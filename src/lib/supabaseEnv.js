/* ------------------------------------------------------------------ */
/*  Supabase environment (lightweight)                                 */
/*  Just the public URL + anon key — NO SDK import. The public site     */
/*  reads content via a plain REST fetch using these, so the heavy      */
/*  supabase-js client stays out of the main bundle (it's only pulled   */
/*  into the lazy-loaded admin panel).                                  */
/* ------------------------------------------------------------------ */

// Normaliza la URL: debe ser SOLO el dominio del proyecto. Si alguien pega la
// "Project URL" con una ruta REST (`/rest/v1`) o una barra final, la limpiamos
// aquí — de lo contrario las peticiones salen dobladas (`.../rest/v1/auth/v1/...`)
// y devuelven 404 tanto en el login como al leer el contenido.
export const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL?.trim() || '')
  .replace(/\/(rest|auth|storage)\/v\d.*$/i, '')
  .replace(/\/+$/, '')
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || ''

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)
