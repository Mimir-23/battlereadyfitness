import { initSmoothScroll, initNavbar, initFloatingActions } from './chrome.js'
import { initScrollEffects, initOffscreenPause } from './scroll-effects.js'
import { initReveals, initCounters } from './reveal.js'
import { initPointerEffects } from './pointer.js'

/* Entry point of the public site's client code (loaded as a deferred
   module on every page). Section-specific behaviour lives in each
   section's own script. */

// Content hidden for the reveal-on-scroll must never stay hidden: if the
// reveals can't start, drop the desktop effects so everything shows.
try {
  initReveals()
  window.__site = true
} catch (err) {
  document.documentElement.classList.remove('fx')
  console.error(err)
}

// Each feature is independent: one failing doesn't take down the rest.
for (const init of [initNavbar, initFloatingActions, initCounters, initScrollEffects, initPointerEffects, initOffscreenPause]) {
  try {
    init()
  } catch (err) {
    console.error(err)
  }
}
initSmoothScroll().catch((err) => console.error(err))
