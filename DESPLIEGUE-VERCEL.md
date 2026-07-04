# 🚀 Despliegue en Vercel + Supabase — Guía completa

Esta guía te lleva de cero a tener el sitio **en producción** con el panel
administrativo funcionando. Son 4 partes, en orden:

| Parte | Qué haces | Tiempo aprox. |
|---|---|---|
| **A** | Configurar Supabase (base de datos + login) | ~10 min |
| **B** | Subir el proyecto a GitHub | ~5 min |
| **C** | Desplegar en Vercel | ~5 min |
| **D** | Verificar que todo funciona | ~5 min |

> **¿Qué es cada cosa?**
> - **Supabase** guarda el contenido editable, las imágenes que subas y el
>   login del panel `/admin`. Plan gratuito, no necesitas tarjeta.
> - **Vercel** aloja el sitio web y lo vuelve a publicar solo cada vez que
>   subes cambios a GitHub. Plan gratuito (Hobby), no necesitas tarjeta.

---

## Parte A — Supabase

### A.1 Crea el proyecto

1. Entra a [supabase.com](https://supabase.com) → **Start your project** y crea
   una cuenta (puedes usar tu cuenta de GitHub).
2. Pulsa **New project**:
   - **Name:** `battle-ready` (o el que quieras)
   - **Database password:** inventa una y **guárdala** (no la vas a necesitar
     a diario, pero no se puede recuperar fácil).
   - **Region:** la más cercana a tus usuarios (para Miami: `East US`).
3. Espera ~2 minutos a que termine de crearse.

### A.2 Crea las tablas y la seguridad

1. En el menú lateral de Supabase abre **SQL Editor** → **New query**.
2. Abre el archivo [`supabase/schema.sql`](./supabase/schema.sql) de este
   proyecto, copia **todo** el contenido y pégalo en el editor.
3. Pulsa **Run**. Debe decir **Success**.

Esto crea: la tabla de contenido, el historial de cambios, la lista de
administradores, las reglas de seguridad (RLS) y el almacén de imágenes
`site-images`. Es seguro ejecutarlo más de una vez.

> ⚠️ **Si te sale el error** `must be owner of table objects` en la parte de
> imágenes: tu proyecto no permite crear políticas de Storage por SQL. No pasa
> nada — créalas a mano: ve a **Storage → Policies → site-images → New policy**
> y crea 4 políticas equivalentes (lectura para todos; insertar/actualizar/
> borrar solo si `public.is_admin()` es verdadero). El resto del script sí se
> aplicó.

### A.3 Autoriza tu correo como administrador

En el mismo **SQL Editor**, ejecuta (cambiando el correo por el tuyo):

```sql
insert into public.admins (email) values ('tucorreo@ejemplo.com')
  on conflict (email) do nothing;
```

### A.4 Crea tu usuario de login

1. Menú lateral → **Authentication → Users** → **Add user → Create new user**.
2. Usa **exactamente el mismo correo** del paso A.3 y una contraseña.
3. Marca **Auto Confirm User** y crea.

> El correo del login y el de la tabla `admins` deben coincidir (no importan
> mayúsculas/minúsculas).

### A.5 Copia tus 2 claves

Ve a **Project Settings → API** (icono de engranaje) y deja a mano:

- **Project URL** → algo como `https://abcdefgh.supabase.co`
- **anon public key** → una clave larga que empieza por `eyJ...`
  (en proyectos nuevos puede llamarse **Publishable key** y empezar por
  `sb_publishable_...` — sirve igual)

> Estas dos claves son **públicas por diseño**: es seguro que estén en el
> navegador. La protección real son las reglas RLS que creó el `schema.sql`
> (cualquiera puede *leer* el contenido, solo los correos de `admins` pueden
> *escribir*). **Nunca** copies la `service_role key` — esa sí es secreta y
> este proyecto no la necesita.

---

## Parte B — Sube el proyecto a GitHub

Si el proyecto ya está en GitHub, salta a la Parte C.

1. Crea el repositorio en [github.com/new](https://github.com/new)
   (por ejemplo `battlereadyfitness`, puede ser **privado**).
2. En una terminal, dentro de la carpeta del proyecto:

```bash
git add -A
git commit -m "Panel admin + preparación para Vercel"
git remote add origin https://github.com/TU-USUARIO/battlereadyfitness.git
git push -u origin main
```

> ✅ El `.gitignore` ya excluye lo que **no** debe subirse: `node_modules`,
> `dist`, `.env.local` (tus claves locales), `llave.json` y el JSON de
> credenciales de Firebase. No los añadas a mano.

---

## Parte C — Despliega en Vercel

### C.1 Importa el proyecto

1. Entra a [vercel.com](https://vercel.com) y crea cuenta **con tu GitHub**
   (así se conectan solos).
2. En el dashboard pulsa **Add New… → Project**.
3. Busca tu repositorio `battlereadyfitness` y pulsa **Import**.

### C.2 Configuración del build

Vercel detecta **Vite** automáticamente. Verifica que diga:

| Campo | Valor |
|---|---|
| Framework Preset | **Vite** |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

No cambies nada más. El archivo `vercel.json` del proyecto ya se encarga de
que las rutas (`/admin`, `/schedule`, `/memberships`) funcionen al entrar
directo o recargar la página.

### C.3 Variables de entorno (¡el paso clave!)

Antes de pulsar Deploy, abre la sección **Environment Variables** y añade
las 2 claves que copiaste en el paso A.5:

| Name | Value |
|---|---|
| `VITE_SUPABASE_URL` | `https://TU-PROYECTO.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | tu clave anon/publishable (`eyJ...` o `sb_publishable_...`) |

- Deja marcados los 3 entornos (Production, Preview, Development).
- Cuidado con espacios o saltos de línea al pegar.
- **`VITE_SUPABASE_URL` debe ser SOLO el dominio** (`https://xxx.supabase.co`),
  sin `/rest/v1` ni barra final. Cópiala de _Project Settings → API → Project URL_.
  Si le pegas una ruta REST, el login y la lectura de contenido dan **404**.

> Los nombres deben ser **exactos** (empiezan por `VITE_`, en mayúsculas).
> Si te equivocas aquí, el sitio funciona igual con el contenido de fábrica,
> pero `/admin` mostrará la pantalla "Casi listo".

### C.4 Deploy

Pulsa **Deploy** y espera 1–2 minutos. Vercel te dará una URL tipo
`https://battlereadyfitness.vercel.app`.

### C.5 (Opcional) Dominio propio

1. En Vercel: tu proyecto → **Settings → Domains** → **Add**.
2. Escribe tu dominio (ej. `battlereadyfitness.com`).
3. Vercel te dice qué registro DNS crear donde compraste el dominio
   (normalmente un registro `A` a `76.76.21.21` o un `CNAME` a
   `cname.vercel-dns.com`). El certificado HTTPS se genera solo.

---

## Parte D — Verifica que todo funciona

Abre tu URL de Vercel (ideal en **ventana de incógnito** para evitar caché)
y comprueba:

1. ✅ **`/`** — el home carga con todo el contenido.
2. ✅ **`/schedule` y `/memberships`** — entra directo a esas URLs y
   **recarga la página** (F5). No debe salir 404.
3. ✅ **`/admin`** — aparece el login (no la pantalla "Casi listo").
4. ✅ Inicia sesión con el correo/contraseña del paso A.4 → ves el panel.
5. ✅ Edita algo pequeño (ej. el texto del hero) → **Guardar cambios** →
   abre el sitio en otra pestaña y recarga: el cambio se ve.
6. ✅ Sube una imagen en alguna sección → se sube y se muestra.
7. ✅ En el panel principal aparece el **historial** con tu cambio.

Si los 7 puntos pasan: **está en producción.** 🎉

---

## Actualizaciones futuras

- **Cambiar contenido** (textos, imágenes, horarios, planes): hazlo desde
  `/admin`. No hace falta redesplegar nada — los cambios son inmediatos.
- **Cambiar código o diseño**: haz `git push` a `main` y Vercel publica solo
  en ~1 minuto. Cada Pull Request genera además una URL de vista previa.
- **Cambiar una variable de entorno**: tras editarla en Vercel debes hacer
  **Redeploy** (Deployments → ⋯ del último deploy → Redeploy), porque las
  variables `VITE_*` se incrustan en el build.

---

## Solución de problemas

| Síntoma | Causa | Solución |
|---|---|---|
| 404 al recargar `/admin` o `/schedule` | Falta el rewrite de SPA | Ya resuelto con `vercel.json` (debe estar en el repo). Verifica que se subió a GitHub. |
| `/admin` dice **"Casi listo"** | Faltan las variables de entorno o tienen otro nombre | Revisa C.3 (nombres exactos, sin espacios) y haz **Redeploy**. |
| Login dice "Correo o contraseña incorrectos" | Usuario mal creado | En Supabase → Authentication → Users: verifica que el usuario existe y está **confirmado** (Auto Confirm). |
| Entras pero dice **"Sin acceso"** | Tu correo no está en la tabla `admins` | Repite el paso A.3 con el mismo correo del login. |
| Guardar da error "permission denied" / "violates row-level security" | El `schema.sql` no se ejecutó completo, o el correo no coincide | Vuelve a ejecutar `schema.sql` (es seguro repetirlo) y revisa A.3. |
| No se pueden subir imágenes | Políticas de Storage no creadas | Revisa el aviso del paso A.2 (`must be owner...`) y crea las políticas desde la interfaz de Storage. |
| Los cambios del panel no se ven en el sitio | Caché del navegador | Recarga con Ctrl+Shift+R o prueba en incógnito. El contenido se lee en cada visita. |
| El build falla en Vercel | Suele ser un error de código | Corre `npm run build` en tu máquina para ver el error exacto antes de subir. |

---

## Notas técnicas (por si otro desarrollador toca el proyecto)

- **Stack:** React 19 + Vite + Tailwind v4 + React Router 7. SPA pura (sin SSR).
- **`vercel.json`:** reescribe todas las rutas a `index.html` (React Router se
  encarga del enrutado) y cachea `/assets/*` como inmutable (los nombres de
  archivo llevan hash).
- **Contenido:** el sitio público lee `site_content` de Supabase por REST
  (`fetch` plano, sin SDK) y hace *merge* sobre los valores por defecto de
  `src/content/defaults.js`. Si Supabase no responde o no está configurado,
  el sitio renderiza los defaults — nunca se rompe.
- **Panel `/admin`:** chunk *lazy* separado (~63 KB gzip) que sí carga el SDK
  de Supabase (auth + storage). El bundle público no lo incluye.
- **Seguridad:** la `anon key` es pública; RLS restringe la escritura a los
  correos de `public.admins` (función `public.is_admin()`).
- **Imágenes:** el sitio usa WebP optimizado (`public/images/*.webp`). Si se
  añaden imágenes nuevas al proyecto, ejecuta `npm run optimize:images`
  (script en `scripts/optimize-images.mjs`, añade la entrada nueva a la lista
  `JOBS`) para generar su versión WebP redimensionada. Las imágenes subidas
  desde el panel `/admin` van a Supabase Storage y no pasan por este script.
- **Restos de Firebase:** `firebase.json`, `deploy.cjs`, `llave.json` y la
  dependencia `firebase-tools` son de un despliegue anterior en Firebase
  Hosting. Vercel los ignora; se pueden borrar cuando se confirme que ya no
  se usará Firebase. `llave.json` y el JSON de credenciales están en
  `.gitignore` y **no deben subirse nunca** al repositorio.
- **Guía del panel para el cliente final:** ver [`PANEL-ADMIN.md`](./PANEL-ADMIN.md).
