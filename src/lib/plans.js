/* ------------------------------------------------------------------ */
/*  Membresías agrupadas por tipo. Los planes llegan de Recess con el   */
/*  nombre que tengan allá, así que el grupo se deduce del nombre y la  */
/*  descripción; el admin puede fijarlo a mano (campo `group`), y la    */
/*  sincronización con Recess lo conserva.                              */
/* ------------------------------------------------------------------ */

/** In page order. `id` is what the admin's `group` field stores. */
export const PLAN_GROUPS = [
  { id: 'trial', label: 'Free Trial', admin: 'Prueba gratis', blurb: 'Try the classes before you commit.' },
  { id: 'individual', label: 'Individual', admin: 'Individuales', blurb: 'Unlimited group classes for one warrior.' },
  { id: 'family', label: 'Family', admin: 'Familiares', blurb: 'Train together and pay less per person.' },
  {
    id: 'semi-private',
    label: 'Semi-Private Training',
    admin: 'Semiprivadas',
    blurb: 'A small group with a coach, built around your goals.',
  },
  { id: 'private', label: 'Personal Training', admin: 'Privadas', blurb: 'One-on-one sessions with your coach.' },
  { id: 'other', label: 'Drop-In & Open Gym', admin: 'Sueltas y open gym', blurb: 'Pay as you go, or train on your own.' },
]

const BY_ID = Object.fromEntries(PLAN_GROUPS.map((g) => [g.id, g]))

const fold = (s) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')

/** "$168.68" → 168.68 · "Free"/"$0" → 0 · "$$" or empty → Infinity (last). */
export function planPrice(plan) {
  const raw = String(plan?.price || '').trim()
  if (/^(free|gratis)$/i.test(raw)) return 0
  const n = Number(raw.replace(/[^0-9.]/g, ''))
  return raw && /\d/.test(raw) && Number.isFinite(n) ? n : Infinity
}

/** The group the admin picked, or the one the plan's name suggests. */
export function planGroup(plan) {
  if (BY_ID[plan?.group]) return plan.group
  const name = fold(plan?.name)
  const text = `${name} ${fold(plan?.desc)}`
  if (planPrice(plan) === 0 || /\b(trial|prueba)\b/.test(name)) return 'trial'
  if (/famil/.test(text)) return 'family'
  if (/semi[\s-]*priv/.test(text)) return 'semi-private'
  if (/\bpt\b|personal|private|privad/.test(name)) return 'private'
  if (/drop[\s-]*in|open gym|pay as you go/.test(text)) return 'other'
  return 'individual'
}

/** Admin (Spanish) name of the group a plan lands in. */
export const planGroupLabel = (plan) => BY_ID[planGroup(plan)].admin

/** Options for the admin's select: automatic first, then every group. */
export const PLAN_GROUP_OPTIONS = [
  { value: '', label: 'Automático (según el nombre del plan)' },
  ...PLAN_GROUPS.map((g) => ({ value: g.id, label: g.admin })),
]

/**
 * Plans organized for the page: each non-empty group in order, cheapest
 * first. Exact duplicates (Recess sometimes lists the same package twice)
 * are shown once.
 */
export function groupPlans(plans) {
  const seen = new Set()
  const groups = new Map(PLAN_GROUPS.map((g) => [g.id, []]))
  for (const plan of plans || []) {
    const key = [plan.name, plan.price, plan.period, plan.desc].map(fold).join('|')
    if (seen.has(key)) continue
    seen.add(key)
    groups.get(planGroup(plan)).push(plan)
  }
  return PLAN_GROUPS.map((g) => ({
    ...g,
    plans: groups.get(g.id).sort((a, b) => planPrice(a) - planPrice(b)),
  })).filter((g) => g.plans.length)
}
