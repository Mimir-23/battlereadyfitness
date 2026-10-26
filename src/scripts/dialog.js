import { lockScroll, unlockScroll, announce } from './core.js'

/* ------------------------------------------------------------------ */
/*  Full-screen dialog with pre-rendered slides (coach profiles, gallery */
/*  photos, videos). Closes with the X, Escape or the backdrop; arrows,  */
/*  keyboard and swipe move between slides. The page doesn't scroll     */
/*  while it's open.                                                     */
/* ------------------------------------------------------------------ */

/**
 * @param {HTMLElement} dialog element with [data-dialog]; its slides are [data-slide]
 * @param {object} options
 * @param {boolean} [options.animateOnOpen] play the slide's entrance when opening
 * @param {boolean} [options.wait] let the outgoing slide animate out first
 * @param {number} [options.swipe] horizontal swipe distance (px) that changes slide
 * @param {(index: number, slide: HTMLElement, opening: boolean) => void} [options.onShow]
 * @param {() => void} [options.onClose]
 */
export function createSlideDialog(dialog, { animateOnOpen = true, wait = false, swipe = 48, onShow, onClose } = {}) {
  const slides = [...dialog.querySelectorAll('[data-slide]')]
  // Directly under <body>, so everything else can be made inert while open.
  document.body.append(dialog)
  let inerted = []
  const many = slides.length > 1
  let index = -1
  let returnFocus = null
  let closeTimer = 0

  const activate = (next, animate, opening) => {
    slides.forEach((s, i) => {
      s.toggleAttribute('data-active', i === next)
      s.toggleAttribute('data-animate', animate && i === next)
      s.removeAttribute('data-leaving')
    })
    index = next
    onShow?.(next, slides[next], opening)
    // Opening moves focus inside (that is the announcement); moving between
    // slides tells screen readers where they landed.
    if (!opening && many) announce(`${slides[next].dataset.label || ''}, ${next + 1} of ${slides.length}`)
  }

  const show = (next, { animate = true, opening = false } = {}) => {
    const prev = slides[index]
    if (!wait || !prev || !animate || prev === slides[next]) {
      activate(next, animate, opening)
      return
    }
    // "wait" mode: the current slide leaves before the next one enters.
    prev.setAttribute('data-leaving', '')
    let done = false
    const finish = () => {
      if (done) return
      done = true
      activate(next, animate, opening)
    }
    prev.addEventListener('animationend', (e) => e.target === prev && finish())
    setTimeout(finish, 400)
  }

  const step = (dir) => {
    if (index < 0 || !many) return
    show((index + dir + slides.length) % slides.length)
  }

  const onKey = (e) => {
    if (e.key === 'Escape') close()
    else if (e.key === 'ArrowLeft' && many) step(-1)
    else if (e.key === 'ArrowRight' && many) step(1)
  }

  function open(i) {
    clearTimeout(closeTimer)
    const wasOpen = dialog.hasAttribute('data-open') && !dialog.hasAttribute('data-closing')
    dialog.removeAttribute('data-closing')
    if (!wasOpen) {
      returnFocus = document.activeElement
      dialog.setAttribute('data-open', '')
      lockScroll()
      addEventListener('keydown', onKey)
      // Modal for keyboard and assistive tech: the rest of the page can't be
      // reached until it closes (the status region keeps announcing).
      inerted = [...document.body.children].filter(
        (el) => el !== dialog && el.id !== 'a11y-status' && !el.inert && el.tagName !== 'SCRIPT',
      )
      inerted.forEach((el) => (el.inert = true))
    }
    show(i, { animate: animateOnOpen, opening: true })
    if (!wasOpen) dialog.querySelector('[data-dialog-close]')?.focus({ preventScroll: true })
  }

  function close() {
    if (!dialog.hasAttribute('data-open') || dialog.hasAttribute('data-closing')) return
    removeEventListener('keydown', onKey)
    dialog.setAttribute('data-closing', '')
    inerted.forEach((el) => (el.inert = false))
    inerted = []
    closeTimer = setTimeout(() => {
      dialog.removeAttribute('data-open')
      dialog.removeAttribute('data-closing')
      slides.forEach((s) => s.removeAttribute('data-active'))
      index = -1
      unlockScroll()
      onClose?.()
      returnFocus?.focus?.({ preventScroll: true })
    }, 250)
  }

  dialog.querySelector('[data-dialog-close]')?.addEventListener('click', (e) => {
    e.stopPropagation()
    close()
  })
  dialog.querySelector('[data-dialog-prev]')?.addEventListener('click', (e) => {
    e.stopPropagation()
    step(-1)
  })
  dialog.querySelector('[data-dialog-next]')?.addEventListener('click', (e) => {
    e.stopPropagation()
    step(1)
  })
  // Backdrop: any click outside the slide content closes.
  dialog.addEventListener('click', (e) => {
    if (!e.target.closest('[data-dialog-content]')) close()
  })

  let touchX = null
  dialog.addEventListener('touchstart', (e) => {
    touchX = e.touches[0].clientX
  }, { passive: true })
  dialog.addEventListener('touchend', (e) => {
    if (touchX === null || !many) return
    const dx = e.changedTouches[0].clientX - touchX
    touchX = null
    if (Math.abs(dx) > swipe) step(dx < 0 ? 1 : -1)
  })

  return { open, close, get index() {
    return index
  } }
}
