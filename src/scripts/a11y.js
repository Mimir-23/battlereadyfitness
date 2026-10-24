import { announce } from './core.js'

/* ------------------------------------------------------------------ */
/*  Accessibility panel: reads/writes the visitor's preferences and     */
/*  applies them to <html> (the boot script in BaseLayout applies the   */
/*  saved ones before the first paint, so nothing flashes).             */
/* ------------------------------------------------------------------ */

const KEY = 'br-a11y'
const root = document.documentElement
const dock = document.querySelector('[data-a11y]')

/** The browser can speak (screen reader mode). */
const canSpeak = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
const RATES = ['0.75', '1', '1.25', '1.5']

const defaults = () => ({
  reader: false,
  rate: '1',
  text: '1',
  contrast: matchMedia('(prefers-contrast: more)').matches,
  links: false,
  font: false,
  still: matchMedia('(prefers-reduced-motion: reduce)').matches,
  captions: false,
  cvd: 'none',
})

function read() {
  try {
    return { ...defaults(), ...JSON.parse(localStorage.getItem(KEY) || '{}') }
  } catch {
    return defaults()
  }
}

// Only what the visitor actually changed is stored: untouched options keep
// following the system settings (reduced motion, more contrast).
function save(prefs) {
  const base = defaults()
  const changed = Object.fromEntries(Object.entries(prefs).filter(([k, v]) => v !== base[k]))
  try {
    localStorage.setItem(KEY, JSON.stringify(changed))
  } catch {
    /* sin almacenamiento: vale para esta página */
  }
}

const LABELS = {
  contrast: 'High contrast',
  links: 'Underlined links',
  font: 'Readable font',
  still: 'Animations stopped',
  captions: 'Video captions',
}
const CVD_LABELS = {
  none: 'Standard colors',
  protan: 'Protanopia color filter',
  deutan: 'Deuteranopia color filter',
  tritan: 'Tritanopia color filter',
  mono: 'Grayscale',
}

function apply(prefs) {
  root.style.fontSize = prefs.text === '1' ? '' : `${Number(prefs.text) * 100}%`
  root.classList.toggle('a11y-reader', !!prefs.reader && canSpeak)
  root.classList.toggle('a11y-contrast', !!prefs.contrast)
  root.classList.toggle('a11y-links', !!prefs.links)
  root.classList.toggle('a11y-font', !!prefs.font)
  root.classList.toggle('a11y-captions', !!prefs.captions)
  if (prefs.cvd && prefs.cvd !== 'none') root.dataset.cvd = prefs.cvd
  else delete root.dataset.cvd
}

// An option restyles the whole page at once. Without this, every element
// with transition-all / transition-colors would animate the change — over
// 300 transitions, many of them layout (font-size, padding…) — and the page
// would stutter for most of a second. The new look is applied in one go and
// transitions come back once it has been painted.
function instantly(change) {
  root.classList.add('a11y-switching')
  change()
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('a11y-switching')))
}

function setStill(on) {
  if (on === root.classList.contains('a11y-still')) return
  if (on) {
    // Everything that moves stops right now (CSS + the scripts that listen).
    root.classList.add('a11y-still')
    root.classList.remove('fx', 'fine', 'motion')
    dispatchEvent(new CustomEvent('br:still'))
  } else {
    // Looping CSS animations come back now; entrances and scroll effects on
    // the next page (re-adding .motion here would replay the intros).
    root.classList.remove('a11y-still')
  }
}

/* ---------- screen reader mode (src/scripts/reader.js, loaded on demand) ---------- */
let readerModule = null
const loadReader = () => (readerModule ??= import('./reader.js'))

function setReader(on, { rate, greet = false } = {}) {
  if (on && canSpeak) loadReader().then((m) => m.enable({ rate, greet }))
  else readerModule?.then((m) => m.disable())
}

if (dock) {
  const toggle = dock.querySelector('[data-a11y-toggle]')
  const panel = dock.querySelector('[data-a11y-panel]')
  const readerBar = dock.querySelector('[data-reader-bar]')
  const rateBtn = dock.querySelector('[data-reader-rate]')
  let prefs = read()

  const sync = () => {
    for (const input of panel.querySelectorAll('input')) {
      if (input.type === 'checkbox') input.checked = !!prefs[input.name]
      else input.checked = String(prefs[input.name]) === input.value
    }
    const rate = RATES.includes(prefs.rate) ? prefs.rate : '1'
    rateBtn.querySelector('[data-rate-label]').textContent = `${rate}x`
    rateBtn.setAttribute('aria-label', `Reading speed ${rate}x`)
  }

  const update = (changes) => {
    prefs = { ...prefs, ...changes }
    save(prefs)
    instantly(() => apply(prefs))
    sync()
    // Text size and font change the layout: smooth scroll and parallax
    // measure again.
    if ('text' in changes || 'font' in changes) dispatchEvent(new Event('resize'))
  }

  // Without speech synthesis the option can't work: say so instead.
  if (!canSpeak) {
    const input = panel.querySelector('input[name="reader"]')
    input.disabled = true
    panel.querySelector('[data-reader-hint]').textContent = 'Not available in this browser'
    root.classList.remove('a11y-reader')
  }
  sync()
  if (prefs.reader) setReader(true, { rate: prefs.rate })

  panel.addEventListener('change', (e) => {
    const input = e.target
    if (!(input instanceof HTMLInputElement)) return
    const value = input.type === 'checkbox' ? input.checked : input.value
    update({ [input.name]: value })
    if (input.name === 'still') setStill(value)

    // The screen reader greets (or says goodbye) with its own voice.
    if (input.name === 'reader') setReader(value, { rate: prefs.rate, greet: true })
    else if (input.name === 'text') announce(`Text size ${Math.round(Number(value) * 100)}%`)
    else if (input.name === 'cvd') announce(CVD_LABELS[value])
    else if (input.name === 'still' && !value) announce('Animations on. Scroll effects return on the next page.')
    else announce(`${LABELS[input.name]} ${value ? 'on' : 'off'}`)
  })

  /* ---------- screen reader controls next to the button ---------- */
  rateBtn.addEventListener('click', () => {
    const rate = RATES[(RATES.indexOf(prefs.rate) + 1) % RATES.length]
    update({ rate })
    readerModule?.then((m) => m.setRate(rate))
    announce(`Reading speed ${rate}x`)
  })
  dock.querySelector('[data-reader-off]').addEventListener('click', () => {
    update({ reader: false })
    setReader(false)
    toggle.focus()
  })

  dock.querySelector('[data-a11y-reset]').addEventListener('click', () => {
    try {
      localStorage.removeItem(KEY)
    } catch {
      /* sin almacenamiento */
    }
    if (prefs.reader) setReader(false)
    prefs = defaults()
    instantly(() => {
      apply(prefs)
      setStill(prefs.still)
    })
    sync()
    dispatchEvent(new Event('resize'))
    announce('Accessibility options reset')
  })

  /* ---------- open / close (Escape, outside click, focus return) ---------- */
  const isOpen = () => !panel.hidden
  const open = () => {
    panel.hidden = false
    toggle.setAttribute('aria-expanded', 'true')
    panel.focus()
  }
  const close = ({ restoreFocus = true } = {}) => {
    if (!isOpen()) return
    panel.hidden = true
    toggle.setAttribute('aria-expanded', 'false')
    if (restoreFocus) toggle.focus()
  }
  toggle.addEventListener('click', () => (isOpen() ? close() : open()))
  dock.querySelector('[data-a11y-close]').addEventListener('click', () => close())
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) {
      e.stopPropagation()
      close()
    }
  })
  document.addEventListener('pointerdown', (e) => {
    if (isOpen() && !dock.contains(e.target)) close({ restoreFocus: false })
  })
  // Leaving the panel with Tab closes it (it isn't modal).
  dock.addEventListener('focusout', (e) => {
    if (isOpen() && e.relatedTarget && !dock.contains(e.relatedTarget)) close({ restoreFocus: false })
  })

  // Second skip link of every page: straight to these options.
  for (const link of document.querySelectorAll('[data-a11y-open]')) {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      open()
    })
  }

  /* ---------- first visit: stay above the consent bar ---------- */
  // On phones the consent bar covers the bottom of the screen; until the
  // visitor answers it, the button (and the reader controls) sit above it.
  const consent = document.querySelector('[data-consent]')
  const place = () => {
    dock.style.bottom = ''
    if (!consent || !root.classList.contains('needs-consent')) return
    const right = Math.max(toggle.getBoundingClientRect().right, readerBar.getBoundingClientRect().right)
    if (consent.getBoundingClientRect().left > right + 8) return
    const offset = parseFloat(getComputedStyle(consent).bottom) || 0
    dock.style.bottom = `${offset + consent.offsetHeight + 12}px`
  }
  if (consent && root.classList.contains('needs-consent')) {
    place()
    new ResizeObserver(place).observe(consent)
    addEventListener('resize', place)
    addEventListener('br:consent', place)
  }
}
