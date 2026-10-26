import { fx, setLenis, getLenis, scrollToTarget, onFrame, onStill } from './core.js'

/* ------------------------------------------------------------------ */
/*  Global chrome: smooth scroll, navbar, floating contact hub.         */
/* ------------------------------------------------------------------ */

/* ---------- Lenis smooth scrolling (desktop mouse only) ---------- */
// On phones/tablets the browser scrolls natively: Lenis' virtualised
// scrolling can fight touch input. The library is only downloaded on desktop.
export async function initSmoothScroll() {
  if (!fx) return
  const { default: Lenis } = await import('lenis')
  const lenis = new Lenis({ duration: 1.1, lerp: 0.09, smoothWheel: true, wheelMultiplier: 1 })
  setLenis(lenis)
  let running = true
  onFrame((_, now) => {
    if (!running) return false
    lenis.raf(now)
  })
  // "Stop animations" (accessibility panel): back to native, instant scrolling.
  onStill(() => {
    running = false
    lenis.destroy()
    setLenis(null)
  })
  // Arriving with a #section (e.g. /#programs from another page): land where
  // an in-page click would, like the SPA did through Lenis.
  if (location.hash) {
    let target = null
    try {
      target = document.querySelector(decodeURIComponent(location.hash))
    } catch {
      /* hash que no es un selector válido */
    }
    if (target) lenis.scrollTo(target, { offset: -72, immediate: true })
  }
}

// In-page anchors (#book, or /#programs while already on home) glide to
// their section below the fixed navbar instead of jumping.
document.addEventListener('click', (e) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  const a = e.target.closest?.('a[href*="#"]')
  if (!a || a.target === '_blank') return
  const url = new URL(a.href, location.href)
  if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash || url.hash === '#') return
  let el
  try {
    el = document.querySelector(decodeURIComponent(url.hash))
  } catch {
    return
  }
  if (!el || !getLenis()) return
  e.preventDefault()
  getLenis().scrollTo(el, { offset: -72, duration: 1.2 })
  // Hash links that name a page (/#programs) also update the address bar.
  if (a.getAttribute('href') !== url.hash) history.pushState(null, '', url.hash)
  // Keyboard and screen-reader users continue from the section they jumped
  // to, as a native anchor jump would do (skip link included).
  focusTarget(el)
})

/** Moves focus to an in-page target without scrolling (the scroll is animated). */
function focusTarget(el) {
  if (!el.matches('a[href], button, input, select, textarea, [tabindex]')) el.setAttribute('tabindex', '-1')
  el.focus({ preventScroll: true })
}

/* ---------- focus never hidden behind the fixed navbar (WCAG 2.4.11) ---------- */
document.addEventListener('focusin', (e) => {
  const el = e.target
  // Keyboard focus only: adjusting the scroll under a mouse click could move
  // the target away between press and release.
  if (!(el instanceof HTMLElement) || !el.matches(':focus-visible')) return
  if (el.closest('[data-navbar], [data-fab], [data-a11y], [data-consent], [data-dialog]')) return
  const header = document.querySelector('[data-navbar]')
  const top = header ? header.getBoundingClientRect().bottom + 12 : 0
  const rect = el.getBoundingClientRect()
  if (rect.height && rect.top < top) scrollToTarget(scrollY + rect.top - top, { immediate: true })
})

/* ---------- navbar: solid background after scrolling + mobile menu ---------- */
export function initNavbar() {
  const header = document.querySelector('[data-navbar]')
  if (!header) return
  const SOLID = ['border-iron', 'bg-ink/95', 'lg:bg-ink/90', 'lg:backdrop-blur-md']
  const CLEAR = ['border-transparent', 'bg-transparent']
  let scrolled = null
  const onScroll = () => {
    const next = scrollY > 24
    if (next === scrolled) return
    scrolled = next
    header.classList.remove(...(next ? CLEAR : SOLID))
    header.classList.add(...(next ? SOLID : CLEAR))
  }
  onScroll()
  addEventListener('scroll', onScroll, { passive: true })

  const toggle = header.querySelector('[data-menu-toggle]')
  const menu = header.querySelector('[data-menu]')
  if (!toggle || !menu) return
  const setOpen = (open) => {
    menu.toggleAttribute('data-open', open)
    menu.inert = !open
    toggle.setAttribute('aria-expanded', String(open))
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
    toggle.querySelector('[data-icon-open]').hidden = open
    toggle.querySelector('[data-icon-close]').hidden = !open
  }
  toggle.addEventListener('click', () => setOpen(!menu.hasAttribute('data-open')))
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false)
  })
}

/* ---------- floating contact hub + back to top ---------- */
export function initFloatingActions() {
  const fab = document.querySelector('[data-fab]')
  if (!fab) return
  const totop = fab.querySelector('[data-totop]')
  const toggle = fab.querySelector('[data-fab-toggle]')
  const backdrop = fab.querySelector('[data-fab-backdrop]')
  const fan = fab.querySelector('[data-fan]')
  const face = fab.querySelector('[data-fab-face]')
  let open = false

  const syncTop = () => totop.toggleAttribute('data-show', scrollY > 600 && !open)
  addEventListener('scroll', syncTop, { passive: true })
  syncTop()
  totop.addEventListener('click', () => scrollToTarget(0, { duration: 1.2 }))

  const setOpen = (next) => {
    open = next
    fab.toggleAttribute('data-open', open)
    fan.inert = !open
    backdrop.hidden = !open
    toggle.setAttribute('aria-expanded', String(open))
    toggle.setAttribute('aria-label', open ? 'Close contact' : 'Contact us')
    fab.querySelector('[data-fab-tip]').hidden = open
    fab.querySelector('[data-fab-ping]').hidden = open
    fab.querySelector('[data-icon-open]').hidden = open
    fab.querySelector('[data-icon-close]').hidden = !open
    face.classList.remove(...(open ? ['bg-battle', 'text-ink'] : ['bg-coal', 'text-chalk']))
    face.classList.add(...(open ? ['bg-coal', 'text-chalk'] : ['bg-battle', 'text-ink']))
    syncTop()
  }
  toggle.addEventListener('click', () => setOpen(!open))
  backdrop.addEventListener('click', () => setOpen(false))
  fan.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false)
  })
  // Escape closes, so keyboard users aren't stuck in the open state.
  addEventListener('keydown', (e) => {
    if (open && e.key === 'Escape') setOpen(false)
  })
}
