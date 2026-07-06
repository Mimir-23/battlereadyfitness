/* ------------------------------------------------------------------ */
/*  Sincronización de membresías desde Recess                          */
/*                                                                      */
/*  Función serverless de Vercel que corre cada día (cron en            */
/*  vercel.json) y también se puede disparar a mano:                    */
/*    GET /api/recess-sync?token=<CRON_SECRET>                          */
/*                                                                      */
/*  1. Descarga la página del portal de Recess (la misma del iframe de   */
/*     checkout). Recess renderiza en el HTML los objetos                */
/*     `instructor_membership` con nombre, precio, periodicidad, etc.    */
/*  2. Extrae las membresías visibles y activas.                         */
/*  3. Las fusiona con los planes guardados en Supabase: nombre, precio, */
/*     periodo y descripción vienen SIEMPRE de Recess (fuente única);    */
/*     beneficios, "destacado" y texto del botón se conservan del admin  */
/*     (emparejados por nombre). Los planes gratis (p. ej. el free pass, */
/*     que no existe en Recess) también se conservan.                    */
/*  4. Escribe el resultado en site_content.plans con la service key.    */
/*                                                                      */
/*  Variables de entorno necesarias en Vercel:                           */
/*    VITE_SUPABASE_URL          — ya existe (la usa el build)           */
/*    SUPABASE_SERVICE_ROLE_KEY  — Supabase → Settings → API             */
/*    CRON_SECRET                — cadena aleatoria; Vercel la manda     */
/*                                 como Bearer en cada invocación cron   */
/* ------------------------------------------------------------------ */

const DEFAULT_RECESS_URL =
  'https://battle-ready.recess.tv/embed/checkout/explore/packages?hideMenu=true'

/* ---------- parsing ---------- */

// Des-escapa una cadena literal de JS extraída con regex ("\"" → '"').
function unescapeJs(s) {
  try {
    return JSON.parse(`"${s}"`)
  } catch {
    return s.replace(/\\(.)/g, '$1')
  }
}

// Campo string dentro de un bloque: `,name:"..."` (primera aparición).
function strField(block, field) {
  const m = block.match(new RegExp(`[,{]${field}:"((?:[^"\\\\]|\\\\.)*)"`))
  return m ? unescapeJs(m[1]).trim() : ''
}

function boolField(block, field) {
  const m = block.match(new RegExp(`[,{]${field}:(true|false)`))
  return m ? m[1] === 'true' : false
}

/** Extrae las membresías del HTML del embed de Recess. */
export function parseMemberships(html) {
  // Cada membresía es un objeto `{id:"<uuid>",auto_enroll:...}` que termina
  // en `__typename:"instructor_membership"` (los objetos anidados usan
  // typenames más largos, así que la comilla de cierre desambigua).
  const blocks = html.match(
    /\{id:"[a-f0-9-]{36}",auto_enroll:[\s\S]*?__typename:"instructor_membership"/g,
  )
  if (!blocks) return []

  const seen = new Set()
  const items = []
  for (const block of blocks) {
    const name = strField(block, 'name')
    const price = strField(block, 'price')
    const type = strField(block, 'type')
    const repeat = strField(block, 'repeat')
    if (!name || !price || type !== 'membership') continue
    if (!boolField(block, 'is_visible') || !boolField(block, 'is_enabled')) continue
    const key = name.toLowerCase().replace(/\s+/g, ' ')
    if (seen.has(key)) continue
    seen.add(key)
    items.push({
      name,
      price: price.replace(/\.00$/, ''), // "$25.00" → "$25"
      period: repeat === 'monthly' ? 'per month' : '',
      desc: strField(block, 'description') || strField(block, 'short_description'),
    })
  }
  return items
}

/* ---------- merge ---------- */

const norm = (s) => (s || '').toLowerCase().replace(/\s+/g, ' ').trim()

/** Recess manda; el admin conserva perks/featured/cta y los planes gratis. */
export function mergePlans(recess, existing) {
  const byName = new Map((existing || []).map((p) => [norm(p.name), p]))
  const inRecess = new Set(recess.map((r) => norm(r.name)))

  // Planes gratis del admin (free pass) que no existen en Recess: van primero.
  const freebies = (existing || []).filter(
    (p) => /^free$/i.test((p.price || '').trim()) && !inRecess.has(norm(p.name)),
  )

  const synced = recess.map((r) => {
    const prev = byName.get(norm(r.name))
    return {
      ...r,
      desc: r.desc || prev?.desc || '',
      perks: prev?.perks || [],
      featured: prev?.featured || false,
      cta: prev?.cta || 'Join Now',
    }
  })

  return [...freebies, ...synced]
}

/* ---------- Supabase REST ---------- */

function supabaseEnv() {
  const url = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '')
    .trim()
    .replace(/\/(rest|auth|storage)\/v\d.*$/i, '')
    .replace(/\/+$/, '')
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
  return { url, key }
}

async function readContent(env, key) {
  const res = await fetch(
    `${env.url}/rest/v1/site_content?key=eq.${key}&select=value`,
    { headers: { apikey: env.key, Authorization: `Bearer ${env.key}` } },
  )
  if (!res.ok) throw new Error(`Supabase read ${key}: HTTP ${res.status}`)
  const rows = await res.json()
  return rows?.[0]?.value ?? null
}

async function writeContent(env, key, value) {
  const res = await fetch(`${env.url}/rest/v1/site_content`, {
    method: 'POST',
    headers: {
      apikey: env.key,
      Authorization: `Bearer ${env.key}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates',
    },
    body: JSON.stringify({ key, value }),
  })
  if (!res.ok) throw new Error(`Supabase write ${key}: HTTP ${res.status}`)
}

/* ---------- handler ---------- */

export default async function handler(req, res) {
  // Vercel manda `Authorization: Bearer <CRON_SECRET>` en las invocaciones
  // del cron; para disparos manuales aceptamos ?token=.
  const secret = (process.env.CRON_SECRET || '').trim()
  if (secret) {
    const auth = req.headers.authorization || ''
    const ok = auth === `Bearer ${secret}` || req.query?.token === secret
    if (!ok) return res.status(401).json({ error: 'Unauthorized' })
  }

  const env = supabaseEnv()
  if (!env.url || !env.key) {
    return res.status(500).json({
      error: 'Faltan VITE_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en Vercel',
    })
  }

  try {
    // La URL del portal es editable en el admin (brand.recessUrl).
    const brand = await readContent(env, 'brand').catch(() => null)
    const recessUrl = brand?.recessUrl || DEFAULT_RECESS_URL

    const page = await fetch(recessUrl, {
      headers: { 'User-Agent': 'BattleReadyFitness-sync/1.0' },
    })
    if (!page.ok) throw new Error(`Recess: HTTP ${page.status}`)
    const memberships = parseMemberships(await page.text())

    // Si el parseo no encuentra nada (Recess cambió su formato, portal caído…)
    // no tocamos el contenido: la página sigue mostrando lo último válido.
    if (memberships.length === 0) {
      return res.status(502).json({
        error: 'No se encontraron membresías en la página de Recess; no se escribió nada.',
      })
    }

    const existing = await readContent(env, 'plans')
    const merged = mergePlans(memberships, existing)

    if (JSON.stringify(merged) === JSON.stringify(existing)) {
      return res.status(200).json({ ok: true, changed: false, count: merged.length })
    }

    await writeContent(env, 'plans', merged)
    return res.status(200).json({
      ok: true,
      changed: true,
      count: merged.length,
      plans: merged.map((p) => `${p.name} — ${p.price}${p.period ? ' ' + p.period : ''}`),
    })
  } catch (err) {
    return res.status(500).json({ error: String(err?.message || err) })
  }
}
