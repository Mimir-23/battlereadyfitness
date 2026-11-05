import { initSmoothScroll, initNavbar, initFloatingActions } from './chrome.js'
import { initScrollEffects, initOffscreenPause } from './scroll-effects.js'
import { initReveals, initCounters } from './reveal.js'
import { initPointerEffects } from './pointer.js'
import { initA11y } from './a11y.js'
import { initConsent } from './consent.js'
import { initCoaches } from './coaches.js'
import { initGallery } from './gallery.js'
import { initVideos } from './videos.js'
import { initTestimonials } from './testimonials.js'
import { initMap } from './map.js'
import { initRecess } from './recess.js'
import { initSchedule } from './schedule.js'
import { initMemberships } from './memberships.js'
import { initFaq } from './faq.js'

/* Entry point of the public site's client code: one deferred module on
   every page (one request instead of a chain of small per-section ones).
   Each section's init does nothing on pages without that section. */

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
for (const init of [
  initA11y,
  initConsent,
  initNavbar,
  initFloatingActions,
  initCounters,
  initScrollEffects,
  initPointerEffects,
  initOffscreenPause,
  initCoaches,
  initGallery,
  initVideos,
  initTestimonials,
  initMap,
  initRecess,
  initSchedule,
  initMemberships,
  initFaq,
]) {
  try {
    init()
  } catch (err) {
    console.error(err)
  }
}
initSmoothScroll().catch((err) => console.error(err))
