import { supabaseEnv, runRecessSync } from '../../lib/recess-sync.js'
import { isAdminToken, bearerToken } from '../../lib/admin-auth.js'
import { purgeContent } from '../../lib/purge.js'

/* ------------------------------------------------------------------ */
/*  GET /api/recess-sync — sincronización de membresías y horario       */
/*  desde Recess (lógica en src/lib/recess-sync.js).                    */
/*                                                                      */
/*  Variables de entorno necesarias en Vercel:                           */
/*    VITE_SUPABASE_URL          — ya existe (la usa el build)           */
/*    SUPABASE_SERVICE_ROLE_KEY  — Supabase → Settings → API             */
/*    CRON_SECRET                — cadena aleatoria; Vercel la manda     */
/*                                 como Bearer en cada invocación cron   */
/* ------------------------------------------------------------------ */

export const prerender = false

const json = (body, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })

export async function GET({ request, url, cache }) {
  const env = supabaseEnv()
  if (!env.url || !env.key) {
    return json({ error: 'Faltan VITE_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en Vercel' }, 500)
  }

  // Tres credenciales válidas:
  //  1. El cron de Vercel: `Authorization: Bearer <CRON_SECRET>`.
  //  2. Disparo manual por URL: ?token=<CRON_SECRET>.
  //  3. El botón "Sincronizar ahora" del panel: la sesión de Supabase de un
  //     administrador logueado.
  const secret = (process.env.CRON_SECRET || '').trim()
  const bearer = bearerToken(request)
  let allowed = !secret || bearer === secret || url.searchParams.get('token') === secret
  if (!allowed && bearer) allowed = await isAdminToken(bearer)
  if (!allowed) return json({ error: 'Unauthorized' }, 401)

  const result = await runRecessSync(env, { force: url.searchParams.get('force') === '1' })
  // Lo sincronizado se publica al instante (misma purga que al guardar en el panel).
  if (result.plans?.changed || result.schedule?.changed) await purgeContent(cache)
  return json(result, result.ok ? 200 : 502)
}
