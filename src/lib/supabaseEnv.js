/* ------------------------------------------------------------------ */
/*  Supabase environment (lightweight)                                 */
/*  Just the public URL + anon key — NO SDK import. The public site     */
/*  reads content via a plain REST fetch using these, so the heavy      */
/*  supabase-js client stays out of the main bundle (it's only pulled   */
/*  into the lazy-loaded admin panel).                                  */
/* ------------------------------------------------------------------ */

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL?.trim() || ''
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || ''

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)
