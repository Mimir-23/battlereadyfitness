import { fine, Spring, onFrame, mapRange } from './core.js'

/* ------------------------------------------------------------------ */
/*  Pointer effects (precise pointer + motion allowed): the dumbbell    */
/*  cursor, magnetic CTAs and the spotlight/tilt cards.                 */
/* ------------------------------------------------------------------ */

const INTERACTIVE = 'a, button, [data-cursor], input, textarea, select'

/**
 * Dumbbell cursor. A small dot tracks the pointer 1:1 while a dumbbell
 * follows with spring lag, swinging with the momentum of the movement as if
 * carried. Over interactive elements it starts doing reps (a curl-like
 * bounce) and on press it squashes, like gripping the weight.
 */
function initCursor() {
  const dot = document.createElement('div')
  dot.className = 'cursor-dot'
  dot.innerHTML = '<span class="block h-1.5 w-1.5 rounded-full bg-white"></span>'
  const ring = document.createElement('div')
  ring.className = 'cursor-ring'
  ring.innerHTML = `<div data-sway><svg viewBox="0 0 48 48" class="block h-10 w-10" aria-hidden="true"><g fill="white"><rect x="13" y="22.25" width="22" height="3.5" rx="1.75"/><rect x="8.5" y="14.5" width="4.5" height="19" rx="2"/><rect x="35" y="14.5" width="4.5" height="19" rx="2"/><rect x="3.5" y="18.5" width="4" height="11" rx="2"/><rect x="40.5" y="18.5" width="4" height="11" rx="2"/></g></svg></div>`
  document.body.append(dot, ring)
  document.body.classList.add('has-cursor')
  const sway = ring.firstElementChild
  const svg = sway.firstElementChild

  // The SPA kept the cursor mounted across routes; as a multi-page site it
  // resumes from where the pointer was on the previous page (per tab).
  let x = -100
  let y = -100
  try {
    const saved = JSON.parse(sessionStorage.getItem('br-cursor') || 'null')
    if (Array.isArray(saved)) [x, y] = saved
  } catch {
    /* sin almacenamiento: arranca fuera de pantalla */
  }
  addEventListener('pagehide', () => {
    try {
      sessionStorage.setItem('br-cursor', JSON.stringify([x, y]))
    } catch {
      /* sin almacenamiento */
    }
  })
  const rx = new Spring({ stiffness: 350, damping: 28, mass: 0.4 }, x)
  const ry = new Spring({ stiffness: 350, damping: 28, mass: 0.4 }, y)
  const tilt = new Spring({ stiffness: 160, damping: 12 }, -14)
  const scale = new Spring({ stiffness: 300, damping: 20, restDelta: 0.001 }, 1)
  let hovering = false
  let down = false
  let running = false

  const render = () => {
    dot.style.transform = `translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`
    ring.style.transform = `translateX(${rx.value}px) translateY(${ry.value}px) translateX(-50%) translateY(-50%) scale(${scale.value})`
    sway.style.transform = `rotate(${tilt.value}deg)`
  }
  const run = () => {
    if (running) return
    running = true
    onFrame((dt) => {
      const before = rx.value
      rx.step(dt)
      ry.step(dt)
      // Carried-weight sway: horizontal momentum tips the bar around its
      // resting -14° tilt, springed so it settles back with a little wobble.
      const vx = (rx.value - before) / dt
      tilt.target = mapRange(vx, -1400, 1400, 10, -38)
      if (vx === 0) tilt.target = -14
      tilt.step(dt)
      scale.target = hovering ? 1.55 : down ? 0.82 : 1
      scale.step(dt)
      render()
      if (rx.settled && ry.settled && tilt.settled && scale.settled) {
        running = false
        return false
      }
    })
  }

  // Off screen (or where the previous page left it) until the pointer moves.
  render()

  addEventListener('mousemove', (e) => {
    x = e.clientX
    y = e.clientY
    rx.target = x
    ry.target = y
    render()
    run()
  })
  // One handler that SYNCS the state with whatever is under the pointer: if
  // an interactive element disappears (menu closes) the cursor self-corrects.
  document.addEventListener('mouseover', (e) => {
    const next = !!e.target.closest?.(INTERACTIVE)
    if (next === hovering) return
    hovering = next
    svg.classList.toggle('cursor-reps', hovering)
    run()
  })
  addEventListener('mousedown', () => {
    down = true
    run()
  })
  addEventListener('mouseup', () => {
    down = false
    run()
  })
}

/** Primary CTAs are pulled toward the pointer while hovered. */
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
      const r = el.getBoundingClientRect()
      sx.target = (e.clientX - (r.left + r.width / 2)) * 0.35
      sy.target = (e.clientY - (r.top + r.height / 2)) * 0.35
      run()
    })
    el.addEventListener('mouseleave', () => {
      sx.target = 0
      sy.target = 0
      run()
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
      if (!strength) return
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
  }
}

export function initPointerEffects() {
  if (!fine) return
  initCursor()
  initMagnetic()
  initSpotlight()
}
