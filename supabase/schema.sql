-- ============================================================================
--  BATTLE READY FITNESS — Esquema del panel administrativo (Supabase)
--  Pega TODO este archivo en:  Supabase → tu proyecto → SQL Editor → Run.
--  Es seguro ejecutarlo varias veces (usa IF NOT EXISTS / OR REPLACE).
-- ============================================================================

-- ─── 1) Lista de administradores (por correo) ───────────────────────────────
-- Solo los correos en esta tabla pueden editar el contenido.
create table if not exists public.admins (
  email      text primary key,
  created_at timestamptz not null default now()
);

-- ¿El usuario autenticado actual es administrador?
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- ─── 2) Contenido del sitio (una fila por sección) ──────────────────────────
create table if not exists public.site_content (
  key        text primary key,           -- 'programs', 'hero', 'brand', ...
  value      jsonb not null,             -- el contenido editable de esa sección
  updated_at timestamptz not null default now(),
  updated_by text                         -- correo de quien guardó
);

-- ─── 3) Historial simple de cambios ─────────────────────────────────────────
create table if not exists public.content_history (
  id         bigint generated always as identity primary key,
  key        text not null,
  value      jsonb not null,             -- cómo quedó el contenido tras guardar
  changed_at timestamptz not null default now(),
  changed_by text
);

-- Cada vez que se inserta/actualiza una sección, guardamos una copia.
create or replace function public.snapshot_content()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.content_history (key, value, changed_by)
  values (new.key, new.value, new.updated_by);
  return new;
end;
$$;

drop trigger if exists trg_snapshot_content on public.site_content;
create trigger trg_snapshot_content
  after insert or update on public.site_content
  for each row execute function public.snapshot_content();

-- ============================================================================
--  SEGURIDAD (Row Level Security)
-- ============================================================================
alter table public.admins          enable row level security;
alter table public.site_content    enable row level security;
alter table public.content_history enable row level security;

-- Contenido: cualquiera puede LEERLO (lo necesita el sitio público) ...
drop policy if exists "content readable by everyone" on public.site_content;
create policy "content readable by everyone"
  on public.site_content for select
  using (true);

-- ... pero solo los administradores pueden crear/editar.
drop policy if exists "content writable by admins" on public.site_content;
create policy "content writable by admins"
  on public.site_content for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Historial: solo administradores lo ven.
drop policy if exists "history readable by admins" on public.content_history;
create policy "history readable by admins"
  on public.content_history for select
  to authenticated
  using (public.is_admin());

-- Tabla de admins: cada admin puede ver la lista (para comprobar su acceso).
drop policy if exists "admins readable by admins" on public.admins;
create policy "admins readable by admins"
  on public.admins for select
  to authenticated
  using (public.is_admin());

-- ============================================================================
--  ALMACENAMIENTO DE IMÁGENES
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;

-- Imágenes visibles para todos (el sitio público las muestra).
drop policy if exists "site images public read" on storage.objects;
create policy "site images public read"
  on storage.objects for select
  using (bucket_id = 'site-images');

-- Solo administradores pueden subir / reemplazar / borrar.
drop policy if exists "site images admin write" on storage.objects;
create policy "site images admin write"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'site-images' and public.is_admin());

drop policy if exists "site images admin update" on storage.objects;
create policy "site images admin update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'site-images' and public.is_admin());

drop policy if exists "site images admin delete" on storage.objects;
create policy "site images admin delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'site-images' and public.is_admin());

-- ============================================================================
--  ⚠️  ÚLTIMO PASO — AUTORIZA TU CORREO COMO ADMINISTRADOR
--  Cambia el correo por el tuyo y ejecuta esta línea:
-- ============================================================================
-- insert into public.admins (email) values ('tucorreo@ejemplo.com')
--   on conflict (email) do nothing;
