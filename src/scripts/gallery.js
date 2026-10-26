import { reducedMotion, setClassName, isStill, onStill } from './core.js'
import { galleryTile } from '../lib/ui-state.js'
import { createSlideDialog } from './dialog.js'

/* Gallery "scanner" + lightbox. While the wall is on screen the lock moves
   to the next photo every 2.4s; hovering a photo takes the lock and pauses
   the sweep so the visitor is always in control. */

export function initGallery() {
  const section = document.querySelector('[data-gallery]')
  if (!section) return

  const grid = section.querySelector('[data-gallery-grid]')
  const tiles = [...grid.querySelectorAll('[data-tile]')]
  let active = -1
  let inView = false
  let paused = false
  let timer = 0

  const render = () => {
    tiles.forEach((tile, i) => {
      const locked = i === active && !reducedMotion
      const k = galleryTile(locked, tile.dataset.span, reducedMotion)
      setClassName(tile, k.figure)
      for (const part of tile.querySelectorAll('[data-part]')) {
        const name = part.dataset.part
        if (name === 'scan') part.hidden = !locked
        else if (k[name]) part.className = k[name]
      }
    })
  }
  const setActive = (next) => {
    if (next === active) return
    active = next
    render()
  }

  const sync = () => {
    clearInterval(timer)
    if (!inView || reducedMotion || isStill() || paused || !tiles.length) return
    timer = setInterval(() => setActive((active + 1) % tiles.length), 2400)
  }

  if (reducedMotion) render()
  else {
    new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        // First lock right away when it comes on screen (no waiting for a tick).
        if (inView && active === -1) setActive(0)
        sync()
      },
      { threshold: 0.2 },
    ).observe(grid)
  }

  tiles.forEach((tile, i) => {
    tile.addEventListener('mouseenter', () => {
      paused = true
      setActive(i)
      sync()
    })
    tile.addEventListener('mouseleave', () => {
      paused = false
      sync()
    })
    // Keyboard: focusing a photo locks the scanner on it, like hovering.
    tile.addEventListener('focusin', () => {
      paused = true
      setActive(i)
      sync()
    })
    tile.addEventListener('focusout', () => {
      paused = false
      sync()
    })
  })
  onStill(sync)

  const dialog = section.querySelector('[data-lightbox]')
  const lightbox = createSlideDialog(dialog, {
    onShow(_, slide) {
      dialog.setAttribute('aria-label', slide.dataset.label)
    },
  })
  section.querySelectorAll('[data-open-photo]').forEach((btn) => {
    btn.addEventListener('click', () => lightbox.open(Number(btn.dataset.openPhoto)))
  })
}
