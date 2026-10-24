/* ------------------------------------------------------------------ */
/*  Shared client helpers: motion flags, one rAF loop for every effect, */
/*  spring physics and the brand easing curve.                          */
/* ------------------------------------------------------------------ */

const root = document.documentElement.classList

/** Mouse/desktop and motion allowed: parallax, reveals, showpiece effects. */
export const fx = root.contains('fx')
/** Precise pointer and motion allowed: cursor, magnetic CTAs, spotlight tilt. */
export const fine = root.contains('fine')
/** The visitor asked the OS for reduced motion. */
export const reducedMotion = !root.contains('motion')
/** No hover-capable precise pointer (phones, tablets). */
export const isTouch = !matchMedia('(hover: hover) and (pointer: fine)').matches

export const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

/** Linear map of `v` from [a1,a2] to [b1,b2], clamped like Motion's useTransform. */
export function mapRange(v, a1, a2, b1, b2) {
  const t = clamp((v - a1) / (a2 - a1), 0, 1)
  return b1 + (b2 - b1) * t
}

/* ---------- cubic-bezier easing (same curves as the CSS) ---------- */
export function cubicBezier(x1, y1, x2, y2) {
  const cx = 3 * x1
  const bx = 3 * (x2 - x1) - cx
  const ax = 1 - cx - bx
  const cy = 3 * y1
  const by = 3 * (y2 - y1) - cy
  const ay = 1 - cy - by
  const sampleX = (t) => ((ax * t + bx) * t + cx) * t
  const sampleY = (t) => ((ay * t + by) * t + cy) * t
  const slopeX = (t) => (3 * ax * t + 2 * bx) * t + cx
  return (x) => {
    if (x <= 0) return 0
    if (x >= 1) return 1
    let t = x
    for (let i = 0; i < 8; i++) {
      const err = sampleX(t) - x
      if (Math.abs(err) < 1e-5) break
      const d = slopeX(t)
      if (Math.abs(d) < 1e-6) break
      t -= err / d
    }
    return sampleY(clamp(t, 0, 1))
  }
}

/** The brand "power" ease: cubic-bezier(0.16, 1, 0.3, 1). */
export const EASE = cubicBezier(0.16, 1, 0.3, 1)

/* ---------- one requestAnimationFrame loop for everything ---------- */
const subscribers = new Set()
let frame = 0
let last = 0

function loop(now) {
  // Seconds since the previous frame, capped so a background tab doesn't
  // make springs jump when it comes back.
  const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60
  last = now
  for (const fn of [...subscribers]) {
    if (fn(dt, now) === false) subscribers.delete(fn)
  }
  if (subscribers.size) frame = requestAnimationFrame(loop)
  else {
    frame = 0
    last = 0
  }
}

/** Runs `fn(dt, now)` every frame until it returns `false` (or unsubscribes). */
export function onFrame(fn) {
  subscribers.add(fn)
  if (!frame) frame = requestAnimationFrame(loop)
  return () => subscribers.delete(fn)
}

/* ---------- damped spring (Motion-style stiffness/damping/mass) ---------- */
export class Spring {
  constructor({ stiffness = 100, damping = 10, mass = 1, restDelta = 0.01 } = {}, value = 0) {
    this.k = stiffness
    this.c = damping
    this.m = mass
    this.restDelta = restDelta
    this.value = value
    this.target = value
    this.velocity = 0
  }

  /** Advances the simulation by `dt` seconds (sub-stepped for stability). */
  step(dt) {
    const steps = Math.max(1, Math.ceil(dt * 240))
    const h = dt / steps
    for (let i = 0; i < steps; i++) {
      const accel = (-this.k * (this.value - this.target) - this.c * this.velocity) / this.m
      this.velocity += accel * h
      this.value += this.velocity * h
    }
    if (this.settled) {
      this.value = this.target
      this.velocity = 0
    }
    return this.value
  }

  get settled() {
    return Math.abs(this.value - this.target) < this.restDelta && Math.abs(this.velocity) < this.restDelta * 10
  }
}

/* ---------- smooth scroll (Lenis on desktop, native elsewhere) ---------- */
let lenis = null
export const setLenis = (instance) => {
  lenis = instance
}
export const getLenis = () => lenis

/** Scrolls to an element or Y position, through Lenis when it's active. */
export function scrollToTarget(target, { offset = 0, duration = 1.2, immediate = false } = {}) {
  if (lenis) {
    lenis.scrollTo(target, { offset, duration, immediate })
    return
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: immediate ? 'auto' : 'smooth' })
  } else {
    target.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' })
  }
}

/* ---------- page scroll lock (dialogs) ---------- */
let locks = 0
export function lockScroll() {
  locks += 1
  document.documentElement.classList.add('is-locked')
  lenis?.stop()
}
export function unlockScroll() {
  locks = Math.max(0, locks - 1)
  if (locks) return
  document.documentElement.classList.remove('is-locked')
  lenis?.start()
}

/** Replaces an element's state classes, keeping a pending reveal (`is-in`). */
export function setClassName(el, value) {
  el.className = el.classList.contains('is-in') ? `${value} is-in` : value
}

/* ---------- accessibility ---------- */

/** The visitor turned on "Stop animations" in the accessibility panel. */
export const isStill = () => document.documentElement.classList.contains('a11y-still')

/** Runs `fn` when "Stop animations" is switched on during the visit. */
export const onStill = (fn) => addEventListener('br:still', fn)

/** Politely announces a short message to screen readers. */
export function announce(message) {
  const region = document.getElementById('a11y-status')
  if (!region) return
  // Clear first so repeating the same message is announced again.
  region.textContent = ''
  setTimeout(() => {
    region.textContent = message
  }, 60)
}
