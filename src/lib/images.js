import { IMAGE_WIDTHS } from './image-widths.js'

/* ------------------------------------------------------------------ */
/*  Imágenes responsivas                                               */
/*  En Vercel cada foto pasa por su optimizador (/_vercel/image): el   */
/*  navegador elige del srcset el ancho que realmente necesita — un     */
/*  celular baja ~640-828 px en vez del original de 1920 px. Aplica a  */
/*  las fotos del proyecto (/images/…) y a las subidas desde el panel   */
/*  (Supabase Storage). Cualquier otra URL se usa tal cual, igual que  */
/*  en local, donde el optimizador no existe.                          */
/* ------------------------------------------------------------------ */

/* global __VERCEL_IMAGES__, __SUPABASE_HOST__ */
const ENABLED = typeof __VERCEL_IMAGES__ !== 'undefined' && __VERCEL_IMAGES__
const SUPABASE_HOST = typeof __SUPABASE_HOST__ !== 'undefined' ? __SUPABASE_HOST__ : ''

const RASTER = /\.(webp|jpe?g|png|avif|gif)$/i

function optimizable(src) {
  if (!ENABLED || typeof src !== 'string' || !src) return false
  if (src.startsWith('/') && !src.startsWith('//')) return RASTER.test(src.split('?')[0])
  try {
    const u = new URL(src)
    return u.protocol === 'https:' && !!SUPABASE_HOST && u.hostname === SUPABASE_HOST
  } catch {
    return false
  }
}

const nearestWidth = (w) =>
  IMAGE_WIDTHS.reduce((best, cur) => (Math.abs(cur - w) < Math.abs(best - w) ? cur : best))

/** URL optimizada a un ancho concreto (o la original si no aplica). */
export function imageUrl(src, width, quality = 75) {
  if (!optimizable(src)) return src
  const params = new URLSearchParams({ url: src, w: String(nearestWidth(width)), q: String(quality) })
  return `/_vercel/image?${params}`
}

/**
 * Atributos `src` / `srcset` / `sizes` para un <img>. `widths` son los
 * candidatos del srcset; `sizes` describe el ancho que ocupa en pantalla.
 */
export function responsiveImage(src, { sizes = '100vw', widths = [640, 828, 1080, 1280, 1920], quality = 75 } = {}) {
  if (!optimizable(src)) return { src }
  return {
    src: imageUrl(src, widths[widths.length - 1], quality),
    srcset: widths.map((w) => `${imageUrl(src, w, quality)} ${nearestWidth(w)}w`).join(', '),
    sizes,
  }
}

/** Full-bleed photo (hero, banners). Without the CDN optimizer, only the
    bundled default hero has a pre-generated mobile variant. */
export function fullBleedImage(src) {
  // Always under dark gradients: q70 is visually identical and lighter.
  const photo = responsiveImage(src, { sizes: '100vw', widths: [640, 828, 1080, 1280, 1600, 1920], quality: 70 })
  if (!photo.srcset && src === '/images/hero.webp') {
    return { src, srcset: '/images/hero-sm.webp 828w, /images/hero.webp 1920w', sizes: '100vw' }
  }
  return photo
}

/** The logo appears in the navbar, hero and footer: one shared candidate set
    so the browser downloads it once. */
export const logoImage = () => responsiveImage('/logo.webp', { widths: [256, 384], sizes: '204px' })
