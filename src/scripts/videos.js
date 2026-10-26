import { fx, onStill } from './core.js'
import { createSlideDialog } from './dialog.js'

/* Video wall: muted YouTube previews while a poster is near the screen
   (desktop only — several players at once saturate a phone's CPU), and the
   full-screen player, whose iframe only exists while it's showing. */

export function initVideos() {
  const section = document.querySelector('[data-videos]')
  if (!section) return

  if (fx) {
    // Only run a preview while its poster is near the viewport, so a long
    // wall never keeps a dozen players running off screen.
    const io = new IntersectionObserver(
      (entries) => {
        for (const { target, isIntersecting } of entries) {
          const live = target.querySelector('iframe[data-live]')
          if (isIntersecting && !live) {
            const frame = document.createElement('iframe')
            frame.dataset.live = ''
            frame.title = ''
            frame.tabIndex = -1
            frame.setAttribute('aria-hidden', 'true')
            frame.allow = 'autoplay; encrypted-media'
            frame.referrerPolicy = 'strict-origin-when-cross-origin'
            frame.className =
              'pointer-events-none absolute left-1/2 top-1/2 h-full w-[222%] -translate-x-1/2 -translate-y-1/2'
            frame.src = target.dataset.previewSrc
            target.querySelector('[data-shade]').before(frame)
            target.querySelector('[data-muted]').hidden = false
          } else if (!isIntersecting && live) {
            live.remove()
            target.querySelector('[data-muted]').hidden = true
          }
        }
      },
      { rootMargin: '80px' },
    )
    section.querySelectorAll('[data-preview-src]').forEach((poster) => io.observe(poster))
    // "Stop animations": no moving previews either.
    onStill(() => {
      io.disconnect()
      section.querySelectorAll('iframe[data-live]').forEach((f) => f.remove())
      section.querySelectorAll('[data-muted]').forEach((b) => (b.hidden = true))
    })
  }

  const dialog = section.querySelector('[data-video-dialog]')
  const stopAll = () => dialog.querySelectorAll('[data-player] iframe').forEach((f) => f.remove())
  const player = createSlideDialog(dialog, {
    onShow(_, slide) {
      dialog.setAttribute('aria-label', slide.dataset.label)
      stopAll()
      const box = slide.querySelector('[data-player]')
      const frame = document.createElement('iframe')
      frame.title = box.dataset.title
      let src = box.dataset.src
      // "Video captions" (accessibility panel): YouTube shows its subtitles.
      if (document.documentElement.classList.contains('a11y-captions') && /youtube(-nocookie)?\.com\/embed\//.test(src)) {
        src += `${src.includes('?') ? '&' : '?'}cc_load_policy=1&cc_lang_pref=en`
      }
      frame.src = src
      frame.className = 'h-full w-full rounded-xl border border-iron bg-black'
      frame.allow =
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
      frame.allowFullscreen = true
      frame.referrerPolicy = 'strict-origin-when-cross-origin'
      box.append(frame)
    },
    onClose: stopAll,
  })
  section.querySelectorAll('[data-open-video]').forEach((btn) => {
    btn.addEventListener('click', () => player.open(Number(btn.dataset.openVideo)))
  })
}
