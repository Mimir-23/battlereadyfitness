import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabaseEnv.js'

/**
 * Whether a Supabase access token belongs to a site admin. RLS on `admins`
 * returns rows only to admins, so any row back means access.
 */
export async function isAdminToken(token) {
  if (!token || !SUPABASE_URL) return false
  const res = await fetch(`${SUPABASE_URL}/rest/v1/admins?select=email&limit=1`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(5000),
  }).catch(() => null)
  if (!res?.ok) return false
  const rows = await res.json().catch(() => [])
  return Array.isArray(rows) && rows.length > 0
}

/** The bearer token of a request, if any. */
export function bearerToken(request) {
  const auth = request.headers.get('authorization') || ''
  return auth.startsWith('Bearer ') ? auth.slice(7).trim() : ''
}
