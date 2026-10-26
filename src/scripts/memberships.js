import { setRecessSrc } from './recess.js'
import { announce } from './core.js'

/* Memberships: picking a plan loads that exact package in the checkout
   below; plans without a Recess id (e.g. the free pass) show the full list. */
export function initMemberships() {
  const root = document.querySelector('[data-memberships]')
  if (!root) return
  const embed = root.querySelector('[data-recess]')
  const bar = root.querySelector('[data-selected-bar]')

  const select = (picked) => {
    if (!embed) return
    bar.hidden = !picked
    if (picked) root.querySelector('[data-selected-name]').textContent = picked.name
    announce(picked ? `Checkout showing ${picked.name}` : 'Checkout showing all packages')
    setRecessSrc(
      embed,
      picked ? picked.src : root.dataset.checkoutUrl,
      picked ? `Battle Ready — ${picked.name} checkout` : 'Battle Ready — Explore Packages',
    )
  }

  root.querySelectorAll('[data-select-plan]').forEach((a) => {
    a.addEventListener('click', () =>
      select(a.dataset.planSrc ? { src: a.dataset.planSrc, name: a.dataset.planName } : null),
    )
  })
  root.querySelector('[data-clear-selection]')?.addEventListener('click', () => select(null))
}
