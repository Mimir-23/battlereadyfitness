# 🛠️ Panel administrativo — Guía de configuración

El sitio incluye un panel en **`/admin`** donde puedes editar todo el contenido
(textos, imágenes, programas, horarios, planes…) sin tocar código. Funciona con
**Supabase** (base de datos + login + almacenamiento de imágenes, plan gratuito).

Configurarlo lleva ~10 minutos y se hace **una sola vez**.

> 🚀 ¿Vas a publicar el sitio en internet? Sigue mejor la guía completa
> [`DESPLIEGUE-VERCEL.md`](./DESPLIEGUE-VERCEL.md), que incluye estos pasos
> **más** el despliegue en Vercel.

---

## Paso 1 — Crea el proyecto en Supabase

1. Entra a [supabase.com](https://supabase.com) y crea una cuenta gratis.
2. Pulsa **New project**. Ponle un nombre (ej. `battle-ready`), una contraseña
   de base de datos (guárdala) y elige la región más cercana.
3. Espera ~2 minutos a que el proyecto se cree.

## Paso 2 — Crea las tablas y la seguridad

1. En el menú lateral de Supabase, abre **SQL Editor**.
2. Pulsa **New query**.
3. Abre el archivo [`supabase/schema.sql`](./supabase/schema.sql) de este
   proyecto, copia **todo** su contenido y pégalo en el editor.
4. Pulsa **Run**. Debe decir _Success_. Esto crea las tablas, las reglas de
   seguridad y el almacén de imágenes.

## Paso 3 — Autoriza tu correo como administrador

En el mismo **SQL Editor**, ejecuta esta línea (cambia el correo por el tuyo):

```sql
insert into public.admins (email) values ('tucorreo@ejemplo.com')
  on conflict (email) do nothing;
```

## Paso 4 — Crea tu usuario (login)

1. En el menú lateral, ve a **Authentication → Users**.
2. Pulsa **Add user → Create new user**.
3. Usa **el mismo correo** del paso 3 y una contraseña. Marca _Auto Confirm_.

> El correo del login y el de la lista de administradores deben coincidir.

## Paso 5 — Conecta el sitio con tus claves

1. En Supabase, ve a **Project Settings → API**.
2. Copia el **Project URL** y la **anon public key**.
3. En este proyecto, abre el archivo **`.env.local`** y pégalas:

   ```
   VITE_SUPABASE_URL=https://tuproyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...   (la anon key)
   ```

4. Reinicia el sitio (`npm run dev`, o vuelve a desplegar en Vercel).

> En **Vercel**: añade esas dos variables en _Project → Settings → Environment
> Variables_ y vuelve a desplegar.

---

## ✅ Listo — Cómo usar el panel

1. Entra a **`tusitio.com/admin`**.
2. Inicia sesión con tu correo y contraseña.
3. Verás todas las secciones del sitio. Pulsa una para editarla.
4. Cambia textos o sube imágenes — la **vista previa** se actualiza al instante.
5. Pulsa **Guardar cambios**. Aparecerán en el sitio de inmediato.

Cada sección tiene:

- **Guardar cambios** — publica lo editado.
- **Descartar** — deshace lo no guardado.
- **Restaurar original** — vuelve al contenido de fábrica.

El **historial de cambios** (en el panel principal) muestra las últimas ediciones.

---

## Preguntas frecuentes

**¿Es seguro poner las claves en el sitio?**
Sí. La _anon key_ es pública por diseño; la seguridad real la imponen las reglas
(RLS) que creó el `schema.sql`: cualquiera puede _leer_ el contenido, pero solo
los correos de la tabla `admins` pueden _editarlo_.

**Quiero añadir otro administrador.**
Repite los pasos 3 y 4 con el nuevo correo.

**Olvidé mi contraseña.**
En Supabase → Authentication → Users, selecciona el usuario y envía un
restablecimiento, o crea uno nuevo.

**El panel dice "Casi listo".**
Significa que aún faltan las claves del Paso 5 en `.env.local` (o en Vercel).
