/* ------------------------------------------------------------------ */
/*  Recess embeds: auto-height from the portal's postMessage, a loading */
/*  skeleton until it's ready, and swapping the embedded checkout when  */
/*  the visitor picks a specific plan/class on the page.                */
/* ------------------------------------------------------------------ */

const embeds = [...document.querySelectorAll('[data-recess]')]

function originOf(src) {
  try {
    return new URL(src, location.href).origin
  } catch {
    return null
  }
}

const load = (frame) => {
  if (!frame.getAttribute('src') && frame.dataset.src) frame.src = frame.dataset.src
}

// Start loading the portal shortly before it scrolls into view.
const io = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      io.unobserve(entry.target)
      load(entry.target)
    }
  },
  { rootMargin: '600px 0px' },
)

for (const box of embeds) {
  const frame = box.querySelector('[data-recess-frame]')
  // about:blank also fires `load`; only a real portal page counts as ready.
  frame.addEventListener('load', () => frame.getAttribute('src') && box.setAttribute('data-loaded', ''))
  io.observe(frame)
}

// Only trust messages coming from an embedded portal itself — other frames on
// the page (maps, extensions) also post to this window.
addEventListener('message', (e) => {
  if (!Array.isArray(e.data)) return
  const [command, value] = e.data
  const px = Number(value)
  if (command !== 'setHeight' || !(px > 0) || !Number.isFinite(px)) return
  for (const box of embeds) {
    const frame = box.querySelector('[data-recess-frame]')
    if (e.source !== frame.contentWindow || e.origin !== originOf(frame.getAttribute('src'))) continue
    frame.style.height = `${Math.min(px, 20000)}px`
    box.setAttribute('data-loaded', '')
  }
})

/** Points an embed at another checkout (resets the loader, like a remount). */
export function setRecessSrc(box, src, title) {
  const frame = box.querySelector('[data-recess-frame]')
  if (!frame) return
  frame.dataset.src = src
  frame.title = title
  if (frame.getAttribute('src') === src) return
  box.removeAttribute('data-loaded')
  frame.style.height = `${box.dataset.minHeight}px`
  // Picking a plan/class is explicit intent: load it now, wherever it is.
  io.unobserve(frame)
  frame.src = src
}
