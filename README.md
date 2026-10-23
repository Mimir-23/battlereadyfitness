# Battle Ready Fitness Bootcamp

Sitio de [battlereadyfitness.com](https://battlereadyfitness.com): gimnasio boot-camp en Hialeah, Florida.
Incluye un panel en `/admin` para editar todo el contenido sin tocar código.

**Stack:** [Astro 7](https://astro.build) · Tailwind CSS v4 · Supabase (contenido, login e
imágenes del panel) · Vercel (hosting, CDN, optimización de imágenes y cron) · React 19 solo
dentro del panel `/admin`.

## Comandos

| Comando | Qué hace |
| --- | --- |
| `npm install` | Instala dependencias (Node ≥ 22.23). |
| `npm run dev` | Servidor de desarrollo en `http://localhost:4321`. |
| `npm run build` | Build de producción (en Vercel usa su adaptador automáticamente). |
| `npm run preview` | Compila y sirve el build de producción en local, sin desplegar. |
| `npm run lint` | ESLint. |
| `npm run optimize:images` | Regenera los `.webp` de `public/images` (ver `scripts/optimize-images.mjs`). |

Las claves van en `.env.local` (copia de `.env.example`): `VITE_SUPABASE_URL` y
`VITE_SUPABASE_ANON_KEY`. Guía paso a paso: [`DESPLIEGUE-VERCEL.md`](./DESPLIEGUE-VERCEL.md).

## Cómo funciona

- **Páginas públicas** (`/`, `/schedule`, `/memberships`, 404): se renderizan en el servidor con
  el contenido de Supabase ya dentro del HTML, y el CDN de Vercel guarda la copia
  (*route caching* de Astro: 5 min frescas + stale-while-revalidate). El navegador recibe la
  página completa en la primera respuesta, sin esperar JavaScript.
- **Panel `/admin`:** página estática con la app de React como isla `client:only`. Al guardar,
  llama a `POST /api/revalidate`, que purga la caché del CDN: el siguiente visitante ya ve el
  cambio.
- **Sincronización con Recess:** `GET /api/recess-sync` (cron diario en `vercel.json` y botón
  «Sincronizar ahora» del panel) actualiza planes y horario, y purga la caché si hubo cambios.
- **Imágenes:** las fotos del proyecto y las subidas desde el panel pasan por el optimizador
  de Vercel (`/_vercel/image`) con `srcset`, así cada dispositivo baja el ancho que necesita.
- **Animaciones:** CSS nativo + scripts pequeños en `src/scripts` (sin librería de animación).
  En escritorio: revelados al hacer scroll, parallax, cursor, scroll suave con Lenis. En móvil
  todo se ve desde el primer pintado, igual que antes.

## Estructura

```
src/
  pages/        rutas: index, schedule, memberships, 404, admin/[...path], api/*
  layouts/      BaseLayout (sitio público) y AdminShell (panel)
  components/   secciones y piezas de UI en .astro
  scripts/      comportamiento en el navegador (menú, diálogos, carruseles, efectos)
  lib/          contenido (servidor), imágenes, caché, sincronización con Recess
  content/      contenido por defecto, esquema del panel e íconos
  admin/        app React del panel
  styles/       theme.css (sistema de diseño), global.css (sitio), admin.css (panel)
```

Más detalles: [`STYLE_GUIDE.md`](./STYLE_GUIDE.md) (diseño) y
[`PANEL-ADMIN.md`](./PANEL-ADMIN.md) (uso del panel).
