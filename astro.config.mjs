// @ts-check
import { defineConfig, fontProviders, memoryCache, passthroughImageService } from 'astro/config'
import react from '@astrojs/react'
import vercel from '@astrojs/vercel'
import node from '@astrojs/node'
import { cacheVercel } from '@astrojs/vercel/cache'
import tailwindcss from '@tailwindcss/vite'
import { loadEnv } from 'vite'
import { IMAGE_WIDTHS } from './src/lib/image-widths.js'

/* ------------------------------------------------------------------ */
/*  Render y caché                                                     */
/*  Las páginas públicas se renderizan en el servidor con el contenido */
/*  de Supabase ya incluido en el HTML, y el CDN de Vercel las guarda  */
/*  (route caching). Cuando el admin guarda, /api/revalidate purga la  */
/*  caché y el siguiente visitante ya recibe la versión nueva.         */
/*                                                                      */
/*  En Vercel se usa su adaptador; en local (`npm run preview`) el de  */
/*  Node con una caché en memoria, para probar el build real sin       */
/*  desplegar. ASTRO_ADAPTER=node|vercel fuerza uno u otro.            */
/* ------------------------------------------------------------------ */

const env = { ...loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), ''), ...process.env }
const target = env.ASTRO_ADAPTER || (env.VERCEL ? 'vercel' : 'node')
const onVercel = target === 'vercel'

// Mismo saneamiento que src/lib/supabaseEnv.js: solo el dominio del proyecto.
const supabaseHost = (() => {
  try {
    return new URL(String(env.VITE_SUPABASE_URL || '').trim()).hostname
  } catch {
    return ''
  }
})()

// Fuentes propias (subset latino), servidas con hash e `immutable`. Astro
// genera además fallbacks con métricas ajustadas para que el cambio de
// fuente no mueva el layout (CLS).
const LATIN = [
  'U+0000-00FF',
  'U+0131',
  'U+0152-0153',
  'U+02BB-02BC',
  'U+02C6',
  'U+02DA',
  'U+02DC',
  'U+0304',
  'U+0308',
  'U+0329',
  'U+2000-206F',
  'U+20AC',
  'U+2122',
  'U+2191',
  'U+2193',
  'U+2212',
  'U+2215',
  'U+FEFF',
  'U+FFFD',
]
const localFont = (name, cssVariable, file, weight, fallbacks) => ({
  provider: fontProviders.local(),
  name,
  cssVariable,
  fallbacks,
  options: {
    variants: [
      { src: [`./src/assets/fonts/${file}`], weight, style: 'normal', display: 'swap', unicodeRange: LATIN },
    ],
  },
})

export default defineConfig({
  site: 'https://battlereadyfitness.com',
  output: 'server',
  adapter: onVercel
    ? vercel({
        // Optimización de imágenes del CDN: el sitio pide a /_vercel/image
        // el ancho exacto que necesita cada foto (ver src/lib/images.js).
        imagesConfig: {
          sizes: IMAGE_WIDTHS,
          domains: supabaseHost ? [supabaseHost] : [],
          formats: ['image/webp'],
          minimumCacheTTL: 2678400,
        },
      })
    : node({ mode: 'standalone' }),
  cache: {
    provider: onVercel ? cacheVercel() : memoryCache(),
  },
  integrations: [react()],
  // Las fotos las optimiza el CDN (src/lib/images.js); el servicio de Astro
  // no se usa, así que se deja sin sharp y la función pesa ~18 MB menos.
  image: { service: passthroughImageService() },
  fonts: [
    localFont('Bebas Neue', '--font-bebas', 'bebas-neue.woff2', '400', ['sans-serif']),
    localFont('Oswald', '--font-oswald', 'oswald-var.woff2', '400 700', ['sans-serif']),
    localFont('Inter', '--font-inter', 'inter-var.woff2', '400 700', ['system-ui', 'sans-serif']),
  ],
  build: {
    // El CSS completo pesa ~10 KB comprimido: ir dentro del HTML ahorra un
    // viaje de red bloqueante en el primer pintado (clave en móvil).
    inlineStylesheets: 'always',
  },
  vite: {
    plugins: [tailwindcss()],
    // Empaquetar los íconos con el servidor: solo entran los que se usan
    // (sin esto la función carga el paquete entero, ~4 MB).
    ssr: { noExternal: ['react-icons'] },
    // Las variables VITE_SUPABASE_* ya existen en Vercel: se conservan los
    // nombres para que el despliegue no requiera reconfigurar nada.
    envPrefix: ['PUBLIC_', 'VITE_'],
    define: {
      __VERCEL_IMAGES__: JSON.stringify(onVercel),
      __SUPABASE_HOST__: JSON.stringify(supabaseHost),
    },
  },
})
