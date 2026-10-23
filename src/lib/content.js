import { DEFAULT_CONTENT } from '../content/defaults.js'
import { mergeContent } from '../content/merge.js'
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from './supabaseEnv.js'

/* ------------------------------------------------------------------ */
/*  Contenido en el servidor                                           */
/*  Cada página se renderiza con el contenido de Supabase ya dentro    */
/*  del HTML (antes el navegador lo pedía después de bajar el JS). Si  */
/*  Supabase falla o tarda, se renderiza con los valores por defecto   */
/*  y se cachea poco tiempo, para reintentar enseguida.                */
/* ------------------------------------------------------------------ */

/** Etiqueta de caché de todas las páginas que dependen del contenido. */
export const CONTENT_TAG = 'content'

export async function loadContent() {
  if (!isSupabaseConfigured) return { content: DEFAULT_CONTENT, live: false }
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/site_content?select=key,value`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
      signal: AbortSignal.timeout(4000),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return { content: mergeContent(await res.json()), live: true }
  } catch (err) {
    console.warn('Contenido remoto no disponible, usando valores por defecto:', err?.message || err)
    return { content: DEFAULT_CONTENT, live: false }
  }
}

/**
 * Política de caché de una página de contenido. En el CDN: 5 min frescas y
 * luego se sirve la copia mientras se regenera en segundo plano; el admin
 * purga la etiqueta al guardar, así que los cambios se ven al instante.
 * Si el contenido no llegó (defaults), solo 15 s para reintentar pronto.
 */
export function cacheContentPage(Astro, live) {
  // El navegador siempre revalida (y la página sigue siendo apta para la
  // caché de atrás/adelante, a diferencia de `no-store`).
  Astro.response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate')
  if (!Astro.cache?.enabled) return
  Astro.cache.set(live ? { maxAge: 300, swr: 86400, tags: [CONTENT_TAG] } : { maxAge: 15 })
}
