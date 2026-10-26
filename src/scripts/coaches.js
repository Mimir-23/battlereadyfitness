import { reducedMotion, isStill, onStill } from './core.js'
import { coachStrip } from '../lib/ui-state.js'
import { createSlideDialog } from './dialog.js'
import { runCounter } from './reveal.js'

/* Coaches wall: the focus cycles through the strips like an arcade demo
   while the wall is on screen, until the visitor hovers it or opens a
   profile; a click opens the full profile dialog. */

const AUTOPLAY_MS = 4200
export function initCoaches() {
  const section = document.querySelector('[data-coaches]')
  if (!section) return

  const wall = section.querySelector('[data-coach-wall]')
  const strips = [...wall.querySelectorAll('[data-coach-strip]')]
  const dialog = section.querySelector('[data-coach-dialog]')
  let active = 0
  let inView = false
  let paused = false
  let isOpen = false
  let timer = 0

  const setActive = (next) => {
    if (next === active) return
    active = next
    strips.forEach((strip, i) => {
      const k = coachStrip(i === active)
      strip.className = k.btn
      for (const part of strip.querySelectorAll('[data-part]')) {
        const name = part.dataset.part
        if (name === 'scan') part.hidden = i !== active
        else if (k[name]) part.className = k[name]
      }
    })
  }

  const profile = createSlideDialog(dialog, {
    animateOnOpen: false,
    wait: true,
    swipe: 56,
    onShow(index, slide) {
      dialog.setAttribute('aria-label', slide.dataset.label)
      slide.querySelectorAll('[data-counter]').forEach(runCounter)
    },
    onClose() {
      isOpen = false
      sync()
    },
  })

  // Arcade demo: only while on screen, not hovered and with no profile open.
  const sync = () => {
    clearInterval(timer)
    if (!inView || paused || isOpen || reducedMotion || isStill() || strips.length < 2) return
    timer = setInterval(() => setActive((active + 1) % strips.length), AUTOPLAY_MS)
  }

  if (!reducedMotion) {
    new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        sync()
      },
      { threshold: 0.25 },
    ).observe(wall)
  }

  // Pauses while the pointer or the keyboard focus is on the wall.
  const hold = (on) => {
    paused = on || wall.matches(':hover') || wall.contains(document.activeElement)
    sync()
  }
  wall.addEventListener('mouseenter', () => hold(true))
  wall.addEventListener('mouseleave', () => hold(false))
  wall.addEventListener('focusin', () => hold(true))
  wall.addEventListener('focusout', (e) => hold(wall.contains(e.relatedTarget)))
  onStill(sync)
  strips.forEach((strip, i) => {
    strip.addEventListener('mouseenter', () => setActive(i))
    strip.addEventListener('focus', () => setActive(i))
    strip.addEventListener('click', () => {
      setActive(i)
      isOpen = true
      sync()
      profile.open(i)
    })
  })
}
