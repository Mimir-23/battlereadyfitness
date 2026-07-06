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

import { DEFAULT_CONTENT } from '../src/content/defaults.js'

const DEFAULT_RECESS_URL =
  'https://battle-ready.recess.tv/embed/checkout/explore/packages?hideMenu=true'
const DEFAULT_BOOKING_URL =
  'https://battle-ready.recess.tv/embed/checkout/explore?displayClassIrl=list&hideMenu=true&class_type=IRL&displayDays=3'

// Zona horaria por defecto (Hialeah, FL). La corrida real usa la que Recess
// declara en su configuración, para que las horas coincidan 1:1 con su portal.
const DEFAULT_TIME_ZONE = 'America/New_York'
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

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

function numField(block, field) {
  const m = block.match(new RegExp(`[,{]${field}:(\\d+(?:\\.\\d+)?)`))
  return m ? Number(m[1]) : null
}

/** Beneficios visibles en el portal de Recess (créditos, guest passes…). */
function buildAutoPerks(block, repeat, desc) {
  const per = repeat === 'monthly' ? ' per month' : ''
  const perks = []

  // La nota corta de Recess ("6 Month commitment") va como beneficio, salvo
  // cuando es solo la descripción recortada (no aportaría nada nuevo).
  const shortDesc = strField(block, 'short_description').replace(/[\s,;.]+$/, '')
  if (shortDesc && !desc.toLowerCase().startsWith(shortDesc.toLowerCase())) {
    perks.push(shortDesc)
  }

  const classes = numField(block, 'max_class')
  if (classes) perks.push(`${classes} Classes${per}`)
  const sessions = numField(block, 'max_appointment')
  if (sessions) perks.push(`${sessions} Sessions${per}`)
  const visits = numField(block, 'max_any')
  if (visits) perks.push(`${visits} Visits${per}`)
  const guests = numField(block, 'max_guest_pass')
  if (guests) perks.push(`${guests} Guest Pass${guests === 1 ? '' : 'es'}`)
  if (boolField(block, 'grants_gym_access')) perks.push('Gym access included')

  return perks
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
    // Dedupe por id (como Recess): dos paquetes distintos pueden compartir
    // nombre (p. ej. mensual vs. con permanencia) y ambos deben salir.
    const id = block.slice(5, 41)
    if (seen.has(id)) continue
    seen.add(id)
    const desc = strField(block, 'description') || strField(block, 'short_description')
    items.push({
      name,
      price: price.replace(/\.00$/, ''), // "$25.00" → "$25"
      period: repeat === 'monthly' ? 'per month' : '',
      desc,
      autoPerks: buildAutoPerks(block, repeat, desc),
      // Permite en la página el enlace directo al checkout de este paquete
      // (…/embed/checkout/package/<id>).
      recessId: id,
    })
  }
  return items
}

/** Extrae las clases (instancias con fecha/hora) del HTML del calendario. */
export function parseClasses(html) {
  const blocks = html.match(
    /\{id:"[a-f0-9-]{36}",end_date:[\s\S]*?__typename:"class"/g,
  )
  if (!blocks) return []

  const seen = new Set()
  const items = []
  for (const block of blocks) {
    const id = block.slice(5, 41)
    if (seen.has(id)) continue
    seen.add(id)
    const name = strField(block, 'name')
    const start = strField(block, 'start_date')
    if (!name || !start) continue
    if (boolField(block, 'is_cancelled') || boolField(block, 'is_private')) continue
    items.push({ id, name, start })
  }
  return items
}

/** La zona horaria que el propio portal declara en su configuración. */
export function parseTimeZone(html) {
  const m = html.match(/"timezone",value:"([A-Za-z_/+-]+)"/)
  try {
    // Valida el identificador construyendo un formateador con él.
    new Intl.DateTimeFormat('en-US', { timeZone: m?.[1] })
    return m[1]
  } catch {
    return DEFAULT_TIME_ZONE
  }
}

/** Convierte las clases de una semana en la grilla { days, rows } del sitio. */
export function buildScheduleGrid(classes, timeZone = DEFAULT_TIME_ZONE) {
  const labelFmt = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
  const sortFmt = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  })

  // Orden cronológico: si una clase se repite (la ventana de 8 días trae dos
  // lunes), la celda se queda con el id de la instancia más próxima — que es
  // la que el visitante puede reservar ya.
  const sorted = [...classes].sort((a, b) => new Date(a.start) - new Date(b.start))

  const slots = new Map() // "5:30 PM" → { key: minutos del día, byDay }
  for (const c of sorted) {
    const date = new Date(c.start)
    if (Number.isNaN(date.getTime())) continue
    const p = Object.fromEntries(labelFmt.formatToParts(date).map((x) => [x.type, x.value]))
    if (!DAYS.includes(p.weekday)) continue
    const label = `${p.hour}:${p.minute} ${p.dayPeriod}`
    if (!slots.has(label)) {
      const s = Object.fromEntries(sortFmt.formatToParts(date).map((x) => [x.type, x.value]))
      slots.set(label, { key: Number(s.hour) * 60 + Number(s.minute), byDay: {} })
    }
    const list = (slots.get(label).byDay[p.weekday] ??= [])
    if (!list.some((x) => x.name === c.name)) list.push({ name: c.name, id: c.id })
  }

  const rows = [...slots.entries()]
    .sort((a, b) => a[1].key - b[1].key)
    .map(([time, slot]) => ({
      time,
      classes: Object.fromEntries(
        DAYS.map((d) => [d, (slot.byDay[d] || []).map((x) => x.name).join(' / ')]),
      ),
      // Ids de Recess por día (mismo orden que los nombres): habilitan el
      // enlace directo a la reserva de esa clase en la página.
      ids: Object.fromEntries(
        DAYS.map((d) => [d, (slot.byDay[d] || []).map((x) => x.id)]),
      ),
    }))

  return { days: [...DAYS], rows }
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
    // Beneficios: los de Recess (autoPerks) se refrescan en cada corrida; los
    // que el admin añadió a mano (los que no vinieron de Recess la vez
    // anterior) se conservan detrás, sin duplicados.
    const auto = r.autoPerks || []
    const prevAuto = new Set((prev?.autoPerks || []).map(norm))
    const autoNow = new Set(auto.map(norm))
    const custom = (prev?.perks || []).filter(
      (p) => !prevAuto.has(norm(p)) && !autoNow.has(norm(p)),
    )
    return {
      name: r.name,
      price: r.price,
      period: r.period,
      desc: r.desc || prev?.desc || '',
      perks: [...auto, ...custom],
      autoPerks: auto,
      recessId: r.recessId,
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

  const force = req.query?.force === '1'
  const UA = { headers: { 'User-Agent': 'BattleReadyFitness-sync/1.0' } }

  // La URL de cada portal es editable en el admin (brand.recessUrl /
  // brand.recessBookingUrl). Cada bloque tiene su propio interruptor de pausa
  // y sus errores no tumban al otro.
  const brand = await readContent(env, 'brand').catch(() => null)

  /* ----- Planes de membresía ----- */
  let plans
  try {
    const cfg = await readContent(env, 'plansSync').catch(() => null)
    if (cfg?.paused && !force) {
      plans = { skipped: true, reason: 'Pausada desde el panel' }
    } else {
      const page = await fetch(brand?.recessUrl || DEFAULT_RECESS_URL, UA)
      if (!page.ok) throw new Error(`Recess: HTTP ${page.status}`)
      const memberships = parseMemberships(await page.text())

      // Si el parseo no encuentra nada (Recess cambió su formato, portal
      // caído…) no tocamos el contenido: el sitio sigue con lo último válido.
      if (memberships.length === 0) throw new Error('0 membresías en la página de Recess')

      // Primera corrida (sin planes guardados aún): partimos de los planes por
      // defecto del sitio para conservar el free pass y demás tarjetas curadas.
      const existing = (await readContent(env, 'plans')) ?? DEFAULT_CONTENT.plans
      const merged = mergePlans(memberships, existing)

      if (JSON.stringify(merged) === JSON.stringify(existing)) {
        plans = { changed: false, count: merged.length }
      } else {
        await writeContent(env, 'plans', merged)
        plans = {
          changed: true,
          count: merged.length,
          items: merged.map((p) => `${p.name} — ${p.price}${p.period ? ' ' + p.period : ''}`),
        }
      }
    }
  } catch (err) {
    plans = { error: String(err?.message || err) }
  }

  /* ----- Horario de clases ----- */
  let schedule
  try {
    const cfg = await readContent(env, 'scheduleSync').catch(() => null)
    if (cfg?.paused && !force) {
      schedule = { skipped: true, reason: 'Pausada desde el panel' }
    } else {
      // 8 días y no 7: la ventana empieza hoy y las clases de hoy que ya
      // pasaron no vienen — el mismo día de la próxima semana las completa.
      const u = new URL(brand?.recessBookingUrl || DEFAULT_BOOKING_URL)
      u.searchParams.set('displayDays', '8')
      const page = await fetch(u, UA)
      if (!page.ok) throw new Error(`Recess: HTTP ${page.status}`)
      const html = await page.text()
      const classes = parseClasses(html)
      if (classes.length === 0) throw new Error('0 clases en el calendario de Recess')

      const grid = buildScheduleGrid(classes, parseTimeZone(html))
      const existing = await readContent(env, 'schedule')
      if (JSON.stringify(grid) === JSON.stringify(existing)) {
        schedule = { changed: false, classes: classes.length, rows: grid.rows.length }
      } else {
        await writeContent(env, 'schedule', grid)
        schedule = { changed: true, classes: classes.length, rows: grid.rows.length }
      }
    }
  } catch (err) {
    schedule = { error: String(err?.message || err) }
  }

  const ok = !plans.error && !schedule.error
  return res.status(ok ? 200 : 502).json({ ok, plans, schedule })
}
