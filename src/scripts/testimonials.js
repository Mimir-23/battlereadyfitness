import { reducedMotion, isStill, onStill, announce } from './core.js'
import { quoteDot } from '../lib/ui-state.js'

/* Reviews carousel: auto-rotates every 7s; any manual navigation restarts
   the timer. The outgoing quote slides out before the next slides in from
   the direction of travel (instant swap under reduced motion).
   Accessibility (WAI-ARIA carousel pattern): a visible pause button, no
   rotation while the pointer or keyboard focus is on it, and screen readers
   hear the new review (live region) only when it isn't rotating on its own. */

const AUTOPLAY_MS = 7000
const section = document.querySelector('[data-testimonials]')
const quotes = section ? [...section.querySelectorAll('[data-quote]')] : []

if (quotes.length > 1) {
  const stage = section.querySelector('[data-quote-stage]')
  const dots = [...section.querySelectorAll('[data-quote-dot]')]
  const pauseBtn = section.querySelector('[data-quote-pause]')
  let index = 0
  let timer = 0
  let leaving = null
  let userPaused = false
  let held = false

  const canRotate = () => !reducedMotion && !isStill() && !userPaused && !held

  const show = (next, dir) => {
    next = (next + quotes.length) % quotes.length
    if (next === index) return
    const prev = quotes[index]
    index = next
    dots.forEach((d, i) => {
      d.firstElementChild.className = quoteDot(i === index)
      d.setAttribute('aria-current', String(i === index))
    })
    stage.style.setProperty('--dir', String(dir))
    restart()

    const enter = () => {
      leaving = null
      quotes.forEach((q, i) => {
        q.toggleAttribute('data-active', i === index)
        q.removeAttribute('data-leaving')
        q.toggleAttribute('data-animate', i === index && !reducedMotion && !isStill())
      })
    }
    if (reducedMotion || isStill()) return enter()
    // A new step while the previous quote is still leaving: jump straight in.
    if (leaving) return enter()
    leaving = prev
    prev.setAttribute('data-leaving', '')
    let done = false
    const finish = () => {
      if (done) return
      done = true
      enter()
    }
    prev.addEventListener('animationend', (e) => e.target === prev && finish(), { once: true })
    setTimeout(finish, 350)
  }

  function restart() {
    clearInterval(timer)
    // While it rotates on its own the quote isn't announced; once it stops,
    // the stage reports changes politely.
    stage.setAttribute('aria-live', canRotate() ? 'off' : 'polite')
    if (!canRotate()) return
    timer = setInterval(() => show(index + 1, 1), AUTOPLAY_MS)
  }

  const syncPauseButton = () => {
    if (!pauseBtn) return
    pauseBtn.hidden = reducedMotion || isStill()
    pauseBtn.setAttribute('aria-label', userPaused ? 'Resume automatic rotation' : 'Pause automatic rotation')
    pauseBtn.querySelector('[data-icon-pause]').hidden = userPaused
    pauseBtn.querySelector('[data-icon-play]').hidden = !userPaused
  }

  pauseBtn?.addEventListener('click', () => {
    userPaused = !userPaused
    syncPauseButton()
    restart()
    announce(userPaused ? 'Automatic rotation paused' : 'Automatic rotation resumed')
  })

  section.querySelector('[data-quote-prev]')?.addEventListener('click', () => show(index - 1, -1))
  section.querySelector('[data-quote-next]')?.addEventListener('click', () => show(index + 1, 1))
  dots.forEach((dot, i) => dot.addEventListener('click', () => show(i, i > index ? 1 : -1)))

  // Hold the rotation while the visitor is reading or using the controls.
  const hold = () => {
    held = section.matches(':hover') || section.contains(document.activeElement)
    restart()
  }
  section.addEventListener('mouseenter', hold)
  section.addEventListener('mouseleave', hold)
  section.addEventListener('focusin', hold)
  section.addEventListener('focusout', () => setTimeout(hold))

  let touchX = null
  stage.addEventListener('touchstart', (e) => {
    touchX = e.touches[0].clientX
  }, { passive: true })
  stage.addEventListener('touchend', (e) => {
    if (touchX === null) return
    const dx = e.changedTouches[0].clientX - touchX
    touchX = null
    if (dx <= -48) show(index + 1, 1)
    else if (dx >= 48) show(index - 1, -1)
  })

  onStill(() => {
    syncPauseButton()
    restart()
  })
  syncPauseButton()
  restart()
}
