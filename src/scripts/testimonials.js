import { reducedMotion } from './core.js'
import { quoteDot } from '../lib/ui-state.js'

/* Reviews carousel: auto-rotates every 7s; any manual navigation restarts
   the timer. The outgoing quote slides out before the next slides in from
   the direction of travel (instant swap under reduced motion). */

const AUTOPLAY_MS = 7000
const section = document.querySelector('[data-testimonials]')
const quotes = section ? [...section.querySelectorAll('[data-quote]')] : []

if (quotes.length > 1) {
  const stage = section.querySelector('[data-quote-stage]')
  const dots = [...section.querySelectorAll('[data-quote-dot]')]
  let index = 0
  let timer = 0
  let leaving = null

  const show = (next, dir) => {
    next = (next + quotes.length) % quotes.length
    if (next === index) return
    const prev = quotes[index]
    index = next
    dots.forEach((d, i) => {
      d.className = quoteDot(i === index)
      d.setAttribute('aria-current', String(i === index))
    })
    stage.style.setProperty('--dir', String(dir))
    restart()

    const enter = () => {
      leaving = null
      quotes.forEach((q, i) => {
        q.toggleAttribute('data-active', i === index)
        q.removeAttribute('data-leaving')
        q.toggleAttribute('data-animate', i === index && !reducedMotion)
      })
    }
    if (reducedMotion) return enter()
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
    if (reducedMotion) return
    timer = setInterval(() => show(index + 1, 1), AUTOPLAY_MS)
  }

  section.querySelector('[data-quote-prev]')?.addEventListener('click', () => show(index - 1, -1))
  section.querySelector('[data-quote-next]')?.addEventListener('click', () => show(index + 1, 1))
  dots.forEach((dot, i) => dot.addEventListener('click', () => show(i, i > index ? 1 : -1)))

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

  restart()
}
