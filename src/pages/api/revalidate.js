import { isAdminToken, bearerToken } from '../../lib/admin-auth.js'
import { purgeContent } from '../../lib/purge.js'

/* ------------------------------------------------------------------ */
/*  POST /api/revalidate                                                */
/*  The /admin panel calls this right after saving, with the signed-in  */
/*  admin's Supabase session as credential, so the public pages are     */
/*  re-rendered with the new content on the very next visit.           */
/* ------------------------------------------------------------------ */

export const prerender = false

const json = (body, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })

export async function POST({ request, cache }) {
  if (!(await isAdminToken(bearerToken(request)))) return json({ error: 'Unauthorized' }, 401)
  await purgeContent(cache)
  return json({ ok: true })
}
