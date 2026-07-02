import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from './supabaseEnv'

/* ------------------------------------------------------------------ */
/*  Supabase client (admin only)                                       */
/*  Used for auth, storage and writes from the admin panel. This module */
/*  pulls in supabase-js, so it must only be imported by lazy admin     */
/*  code — never by the public site (which reads content via REST).     */
/* ------------------------------------------------------------------ */

export { isSupabaseConfigured }

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null

/** Storage bucket where uploaded site images live. */
export const IMAGE_BUCKET = 'site-images'
