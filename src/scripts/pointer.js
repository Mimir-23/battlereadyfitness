import { fine, Spring, onFrame, clamp, isStill, onStill } from './core.js'

/* ------------------------------------------------------------------ */
/*  Pointer effects (precise pointer + motion allowed): magnetic CTAs   */
/*  and the spotlight/tilt cards.                                       */
/* ------------------------------------------------------------------ */

/** Primary CTAs lean slightly toward the pointer while hovered: a nudge of
    a few pixels, never enough to chase the pointer around. */
const MAGNET = 0.12
const MAGNET_MAX = 4

function initMagnetic() {
  for (const el of document.querySelectorAll('[data-magnetic]')) {
    const sx = new Spring({ stiffness: 250, damping: 18, mass: 0.3 })
    const sy = new Spring({ stiffness: 250, damping: 18, mass: 0.3 })
    let running = false
    const run = () => {
      if (running) return
      running = true
      onFrame((dt) => {
        sx.step(dt)
        sy.step(dt)
        el.style.transform = sx.value || sy.value ? `translateX(${sx.value}px) translateY(${sy.value}px)` : ''
        if (sx.settled && sy.settled) {
          running = false
          return false
        }
      })
    }
    el.addEventListener('mousemove', (e) => {
      if (isStill()) return
      const r = el.getBoundingClientRect()
      sx.target = clamp((e.clientX - (r.left + r.width / 2)) * MAGNET, -MAGNET_MAX, MAGNET_MAX)
      sy.target = clamp((e.clientY - (r.top + r.height / 2)) * MAGNET, -MAGNET_MAX, MAGNET_MAX)
      run()
    })
    el.addEventListener('mouseleave', () => {
      sx.target = 0
      sy.target = 0
      run()
    })
    onStill(() => {
      sx.value = sx.target = sx.velocity = 0
      sy.value = sy.target = sy.velocity = 0
    })
  }
}

/** Cursor-tracking glow (CSS --mx/--my) plus an optional 3D tilt. */
function initSpotlight() {
  for (const el of document.querySelectorAll('[data-spotlight]')) {
    const strength = Number(el.dataset.tilt) || 0
    const rotX = new Spring({ stiffness: 150, damping: 18 })
    const rotY = new Spring({ stiffness: 150, damping: 18 })
    let running = false
    const run = () => {
      if (running) return
      running = true
      onFrame((dt) => {
        rotX.step(dt)
        rotY.step(dt)
        el.style.setProperty('--rx', `${rotX.value}deg`)
        el.style.setProperty('--ry', `${rotY.value}deg`)
        if (rotX.settled && rotY.settled) {
          running = false
          return false
        }
      })
    }
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width
      const py = (e.clientY - r.top) / r.height
      el.style.setProperty('--mx', `${px * 100}%`)
      el.style.setProperty('--my', `${py * 100}%`)
      if (!strength || isStill()) return
      rotY.target = (px - 0.5) * strength
      rotX.target = (0.5 - py) * strength
      run()
    })
    el.addEventListener('mouseleave', () => {
      if (!strength) return
      rotX.target = 0
      rotY.target = 0
      run()
    })
    onStill(() => {
      rotX.value = rotX.target = rotX.velocity = 0
      rotY.value = rotY.target = rotY.velocity = 0
    })
  }
}

export function initPointerEffects() {
  if (!fine) return
  initMagnetic()
  initSpotlight()
  // "Stop animations": nothing follows the pointer.
  onStill(() => {
    document.querySelectorAll('[data-magnetic]').forEach((el) => (el.style.transform = ''))
    document.querySelectorAll('[data-spotlight]').forEach((el) => {
      el.style.removeProperty('--rx')
      el.style.removeProperty('--ry')
    })
  })
}
