/* Saves the choice (versioned, so a policy change asks again — keep in
   sync with the boot script in BaseLayout) and tells the analytics loader
   in the layout. "Cookie Settings" in the footer reopens the notice. */
const VERSION = 2
const MEASUREMENT_ID = 'G-DXH57945TD'
const root = document.documentElement
const banner = document.querySelector('[data-consent]')

// "Essential only" after having accepted: Google Analytics stops for this
// visit and its cookies are deleted (they live on the registrable domain).
function dropAnalytics() {
  window[`ga-disable-${MEASUREMENT_ID}`] = true
  const domain = location.hostname.replace(/^www\./, '')
  for (const cookie of document.cookie.split('; ')) {
    const name = cookie.split('=')[0]
    if (!name.startsWith('_ga')) continue
    for (const scope of ['', `; domain=${domain}`, `; domain=.${domain}`]) {
      document.cookie = `${name}=; Max-Age=0; path=/${scope}`
    }
  }
}

export function initConsent() {
  for (const btn of document.querySelectorAll('[data-consent-choice]')) {
    btn.addEventListener('click', () => {
      const analytics = btn.dataset.consentChoice === 'all'
      try {
        localStorage.setItem('br-consent', JSON.stringify({ v: VERSION, analytics, at: new Date().toISOString() }))
      } catch {
        /* sin almacenamiento: vale para esta visita */
      }
      if (!analytics) dropAnalytics()
      root.classList.remove('needs-consent')
      dispatchEvent(new CustomEvent('br:consent', { detail: { analytics } }))
    })
  }

  for (const btn of document.querySelectorAll('[data-consent-open]')) {
    btn.addEventListener('click', () => {
      root.classList.add('needs-consent')
      dispatchEvent(new CustomEvent('br:consent-open'))
      banner?.querySelector('[data-consent-choice]')?.focus()
    })
  }
}
