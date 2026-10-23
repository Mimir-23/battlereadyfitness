import { DEFAULT_CONTENT } from './defaults.js'

/* ------------------------------------------------------------------ */
/*  Fusión del contenido                                               */
/*  Las filas de `site_content` (una por sección) se aplican sobre los  */
/*  valores por defecto. Lo usan tanto el render del servidor como el   */
/*  panel /admin, para que ambos vean exactamente el mismo contenido.   */
/* ------------------------------------------------------------------ */

/** rows: [{ key, value }] tal como las devuelve Supabase. */
export function mergeContent(rows) {
  const overrides = {}
  for (const row of rows || []) overrides[row.key] = row.value

  // Migración: los testimonios pasaron de una reseña única a una lista.
  // Un valor guardado con el formato antiguo ({ quote, author… }) se
  // convierte al vuelo para que el sitio y el editor sigan funcionando.
  const t = overrides.testimonial
  if (t && !Array.isArray(t.items)) {
    overrides.testimonial = {
      image: t.image || DEFAULT_CONTENT.testimonial.image,
      items: t.quote
        ? [{ quote: t.quote, highlight: t.highlight || '', author: t.author || '', role: t.role || '' }]
        : DEFAULT_CONTENT.testimonial.items,
    }
  }

  return { ...DEFAULT_CONTENT, ...overrides }
}
