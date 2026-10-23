import { fx, isTouch, reducedMotion, onFrame, EASE } from './core.js'

/* ------------------------------------------------------------------ */
/*  Reveal-on-scroll (desktop only, like the original: on touch every   */
/*  section is visible from the first paint) and count-up numbers.      */
/* ------------------------------------------------------------------ */

// Starts ~180px BEFORE the element reaches the screen, so by the time it
// scrolls in it's already there (no "blank until you scroll" feel).
const VIEWPORT = { rootMargin: '0px 0px 180px 0px', threshold: 0 }

function revealGroup(group) {
  const step = Number(group.dataset.revealGroup || 0.06)
  const items = [...group.querySelectorAll('[data-reveal-item]')].filter(
    (item) => item.parentElement.closest('[data-reveal-group]') === group,
  )
  items.forEach((item, i) => {
    item.style.setProperty('--reveal-delay', `${(i * step).toFixed(2)}s`)
    item.classList.add('is-in')
  })
}

export function initReveals(scope = document) {
  if (!fx) return
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      io.unobserve(entry.target)
      if (entry.target.hasAttribute('data-reveal-group')) revealGroup(entry.target)
      else entry.target.classList.add('is-in')
    }
  }, VIEWPORT)
  scope.querySelectorAll('[data-reveal-group], [data-reveal]:not([data-reveal-item])').forEach((el) => io.observe(el))
}

// Once an element finished revealing, drop the reveal hooks so it goes back
// to its natural styles (hover transforms, transitions…) with no leftovers.
document.addEventListener('animationend', (e) => {
  const el = e.target
  if (!(el instanceof Element) || !el.classList.contains('is-in') || !e.animationName.startsWith('reveal-')) return
  el.removeAttribute('data-reveal')
  el.classList.remove('is-in')
  el.style.removeProperty('--reveal-delay')
})

/* ---------- count-up numbers ---------- */

/** Counts the element up from 0 to its `data-counter` value over 1.4s. */
export function runCounter(el) {
  const value = Number(el.dataset.counter) || 0
  const suffix = el.dataset.suffix || ''
  if (reducedMotion) {
    el.textContent = `${value}${suffix}`
    return
  }
  el.textContent = `0${suffix}`
  let elapsed = 0
  onFrame((dt) => {
    elapsed += dt
    const t = Math.min(elapsed / 1.4, 1)
    el.textContent = `${Math.round(value * EASE(t))}${suffix}`
    if (t >= 1) return false
  })
}

export function initCounters(scope = document) {
  const counters = [...scope.querySelectorAll('[data-counter]:not([data-counter-manual])')]
  if (!counters.length) return
  // On touch, scroll observers are unreliable: count up right away.
  if (isTouch) {
    counters.forEach(runCounter)
    return
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        io.unobserve(entry.target)
        runCounter(entry.target)
      }
    },
    { rootMargin: '0px 0px 120px 0px', threshold: 0 },
  )
  counters.forEach((el) => {
    if (!reducedMotion) el.textContent = `0${el.dataset.suffix || ''}`
    io.observe(el)
  })
}
