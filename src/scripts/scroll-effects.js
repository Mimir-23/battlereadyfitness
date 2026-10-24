import { fx, Spring, onFrame, clamp, mapRange, isStill, onStill } from './core.js'

/* ------------------------------------------------------------------ */
/*  Scroll-linked effects. The progress bar runs everywhere; parallax,  */
/*  hero/banner scroll-out and the marquee skew are desktop-only, like  */
/*  the original (they're costly on phones).                            */
/* ------------------------------------------------------------------ */

/** Progress of `el` through the viewport: 0 when its top meets the bottom
    edge, 1 when its bottom leaves the top edge (Motion "start end"→"end start"). */
const coverProgress = (rect, vh) => clamp((vh - rect.top) / (vh + rect.height), 0, 1)
/** 0 when its top is at the top of the viewport, 1 once it scrolled out ("start start"→"end start"). */
const exitProgress = (rect) => clamp(-rect.top / (rect.height || 1), 0, 1)

function resolveTarget(el) {
  const t = el.dataset.parallaxTarget
  if (t === 'parent') return el.parentElement
  if (t) return el.closest(t) || el
  return el
}

export function initScrollEffects() {
  /* ---------- reading progress bar (spring-smoothed) ---------- */
  const bar = document.querySelector('[data-scroll-progress]')
  const progress = new Spring({ stiffness: 120, damping: 30, restDelta: 0.001 })
  let barRunning = false
  const runBar = () => {
    if (barRunning || !bar) return
    barRunning = true
    onFrame((dt) => {
      progress.step(dt)
      bar.style.transform = `scaleX(${progress.value})`
      if (progress.settled) {
        barRunning = false
        return false
      }
    })
  }
  const readProgress = () => {
    const max = document.documentElement.scrollHeight - innerHeight
    progress.target = max > 0 ? clamp(scrollY / max, 0, 1) : 0
    runBar()
  }

  /* ---------- desktop-only scroll scenes ---------- */
  const layers = fx
    ? [...document.querySelectorAll('[data-parallax]')].map((el) => {
        const [from, to] = el.dataset.parallax.split(',').map(Number)
        return { el, target: resolveTarget(el), from, to }
      })
    : []

  const hero = fx ? document.querySelector('[data-hero]') : null
  const heroParts = hero && {
    bg: hero.querySelector('[data-hero-bg]'),
    orb: hero.querySelector('[data-hero-orb]'),
    content: hero.querySelector('[data-hero-content]'),
  }
  const banner = fx ? document.querySelector('[data-banner]') : null
  const bannerParts = banner && {
    bg: banner.querySelector('[data-banner-bg]'),
    content: banner.querySelector('[data-banner-content]'),
  }
  const skews = fx ? [...document.querySelectorAll('[data-skew]')] : []

  // Hero pointer parallax: photo and glow orb drift on separate planes.
  const pointer = { x: new Spring({ stiffness: 55, damping: 18, restDelta: 0.0005 }), y: new Spring({ stiffness: 55, damping: 18, restDelta: 0.0005 }) }
  let heroScale = 1

  const writeHero = () => {
    if (!heroParts || isStill()) return
    const bgX = mapRange(pointer.x.value, -0.5, 0.5, 14, -14)
    const bgY = mapRange(pointer.y.value, -0.5, 0.5, 10, -10)
    const orbX = mapRange(pointer.x.value, -0.5, 0.5, -40, 40)
    const orbY = mapRange(pointer.y.value, -0.5, 0.5, -30, 30)
    if (heroParts.bg) heroParts.bg.style.transform = `translateX(${bgX}px) translateY(${bgY}px) scale(${heroScale})`
    if (heroParts.orb) heroParts.orb.style.transform = `translateX(${orbX}px) translateY(${orbY}px)`
  }

  if (hero) {
    let pointerRunning = false
    hero.addEventListener('mousemove', (e) => {
      if (isStill()) return
      pointer.x.target = e.clientX / innerWidth - 0.5
      pointer.y.target = e.clientY / innerHeight - 0.5
      if (pointerRunning) return
      pointerRunning = true
      onFrame((dt) => {
        pointer.x.step(dt)
        pointer.y.step(dt)
        writeHero()
        if (pointer.x.settled && pointer.y.settled) {
          pointerRunning = false
          return false
        }
      })
    })
  }

  // Scroll velocity → marquee skew (springed so it eases back when you stop).
  const skew = new Spring({ stiffness: 200, damping: 40, restDelta: 0.5 })
  let lastY = scrollY
  let skewRunning = false
  const runSkew = () => {
    if (skewRunning || !skews.length || isStill()) return
    skewRunning = true
    onFrame((dt) => {
      const y = scrollY
      skew.target = (y - lastY) / dt // px/s
      lastY = y
      skew.step(dt)
      const deg = mapRange(skew.value, -2000, 2000, -8, 8)
      for (const el of skews) el.style.transform = `skewX(${deg}deg)`
      if (skew.target === 0 && skew.settled) {
        skewRunning = false
        for (const el of skews) el.style.transform = ''
        return false
      }
    })
  }

  // "Stop animations": every layer back to its resting place, for good.
  const settle = () => {
    for (const l of layers) l.el.style.transform = ''
    for (const el of skews) el.style.transform = ''
    if (heroParts) {
      for (const part of Object.values(heroParts)) if (part) part.style.transform = ''
      if (heroParts.content) heroParts.content.style.opacity = ''
    }
    if (bannerParts) {
      for (const part of Object.values(bannerParts)) if (part) part.style.transform = ''
      if (bannerParts.content) bannerParts.content.style.opacity = ''
    }
  }
  onStill(settle)

  let scheduled = false
  const update = () => {
    scheduled = false
    readProgress()
    if (isStill()) return
    const vh = innerHeight
    // Read every rect first, then write — no layout thrashing.
    const layerRects = layers.map((l) => l.target.getBoundingClientRect())
    const heroRect = hero?.getBoundingClientRect()
    const bannerRect = banner?.getBoundingClientRect()

    layers.forEach((l, i) => {
      const p = coverProgress(layerRects[i], vh)
      l.el.style.transform = `translateY(${l.from + (l.to - l.from) * p}px)`
    })
    if (heroRect) {
      const p = exitProgress(heroRect)
      heroScale = 1 + 0.18 * p
      writeHero()
      if (heroParts.content) {
        heroParts.content.style.transform = `translateY(${160 * p}px)`
        heroParts.content.style.opacity = String(mapRange(p, 0, 0.85, 1, 0))
      }
    }
    if (bannerRect) {
      const p = exitProgress(bannerRect)
      if (bannerParts.bg) bannerParts.bg.style.transform = `translateY(${90 * p}px)`
      if (bannerParts.content) {
        bannerParts.content.style.transform = `translateY(${110 * p}px)`
        bannerParts.content.style.opacity = String(mapRange(p, 0, 0.9, 1, 0))
      }
    }
  }
  const schedule = () => {
    runSkew()
    if (scheduled) return
    scheduled = true
    requestAnimationFrame(update)
  }

  addEventListener('scroll', schedule, { passive: true })
  addEventListener('resize', schedule, { passive: true })
  update()
}

/* ---------- looping animations only while they can be seen ---------- */
// Embers, marquees, pulses and scanners loop forever. Sections far from the
// screen pause theirs, so the browser isn't animating ~40 things it can't
// show (lighter first load, smoother scrolling, less battery). Runs on every
// device; the margin resumes them well before they scroll into view.
export function initOffscreenPause() {
  const blocks = document.querySelectorAll('main > *')
  if (!blocks.length || !('IntersectionObserver' in window)) return
  const io = new IntersectionObserver(
    (entries) => {
      for (const { target, isIntersecting } of entries) target.toggleAttribute('data-offscreen', !isIntersecting)
    },
    { rootMargin: '300px 0px' },
  )
  blocks.forEach((el) => io.observe(el))
}
