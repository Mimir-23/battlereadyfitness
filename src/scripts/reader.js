import { isStill, scrollToTarget } from './core.js'

/* ------------------------------------------------------------------ */
/*  Screen reader mode (accessibility panel → "Screen reader"): the site */
/*  reads itself out loud with the browser's own voices (Web Speech     */
/*  API, nothing to install) — whatever gets keyboard focus or is       */
/*  tapped/clicked, the status announcements and, on request, the whole */
/*  page while highlighting each block. For visitors without a screen   */
/*  reader of their own (low vision, reading difficulties, a borrowed   */
/*  device); VoiceOver, NVDA or TalkBack keep working as usual.         */
/*  Loaded on demand by a11y.js only while the mode is on.              */
/* ------------------------------------------------------------------ */

const synth = window.speechSynthesis
const root = document.documentElement
const bar = document.querySelector('[data-reader-bar]')
const playBtn = bar?.querySelector('[data-reader-play]')
const stopBtn = bar?.querySelector('[data-reader-stop]')
const status = document.getElementById('a11y-status')

const clean = (text) => String(text || '').replace(/\s+/g, ' ').trim()
const speakable = (text) => /[\p{L}\p{N}]/u.test(text)

/* ---------- voice ---------- */
let voice = null
let rate = 1

// An English voice for the English site, preferably one installed on the
// device (system voices don't send the text anywhere).
function pickVoice() {
  const voices = synth.getVoices().filter((v) => /^en([-_]|$)/i.test(v.lang))
  voice =
    voices.find((v) => v.localService && /^en[-_]US/i.test(v.lang)) ||
    voices.find((v) => v.localService) ||
    voices.find((v) => /^en[-_]US/i.test(v.lang)) ||
    voices[0] ||
    null
}

// Every new utterance (or silence) invalidates the callbacks of the ones it
// interrupted: browsers report a cancelled utterance as ended or failed.
let token = 0

function say(text, { queue = false, onend } = {}) {
  text = clean(text)
  if (!speakable(text)) {
    onend?.()
    return
  }
  if (!queue) hush()
  const mine = token
  const u = new SpeechSynthesisUtterance(text)
  u.lang = voice?.lang || root.lang || 'en'
  if (voice) u.voice = voice
  u.rate = rate
  u.onend = () => mine === token && onend?.()
  u.onerror = (e) => mine === token && e.error !== 'interrupted' && e.error !== 'canceled' && onend?.()
  synth.speak(u)
}

function hush() {
  token++
  synth.cancel()
}

/* ---------- what an element "says" ---------- */
const SKIP = new Set(['script', 'style', 'noscript', 'template', 'svg', 'iframe', 'video', 'audio', 'canvas'])
// Controls whose aria-label replaces their content (icon-only buttons…).
const NAMED = 'a[href], button, [role="button"], [role="link"], [role="img"], [role="switch"], [role="checkbox"], [role="radio"]'

function hidden(el) {
  if (SKIP.has(el.localName) || el.hidden || el.inert || el.getAttribute('aria-hidden') === 'true') return true
  const style = getComputedStyle(el)
  return style.display === 'none' || style.visibility === 'hidden'
}

/** Visible and screen-reader-only text of a subtree, skipping whatever is
    hidden from assistive technology (like a screen reader would). */
function textOf(node) {
  let out = ''
  for (const child of node.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) out += child.data
    else if (child.nodeType === Node.ELEMENT_NODE && !hidden(child)) {
      if (child.localName === 'img') out += ` ${child.alt || ''} `
      else if (!child.matches('input, select, textarea')) {
        out += ` ${(child.matches(NAMED) && child.getAttribute('aria-label')) || textOf(child)} `
      }
    }
  }
  return out
}

function roleOf(el) {
  const role = el.getAttribute('role')
  if (role) return role
  const tag = el.localName
  if (tag === 'a') return el.hasAttribute('href') ? 'link' : ''
  if (tag === 'input') {
    return { checkbox: 'checkbox', radio: 'radio', button: 'button', submit: 'button', reset: 'button', range: 'slider' }[el.type] || 'textbox'
  }
  return { button: 'button', summary: 'button', select: 'combobox', textarea: 'textbox', img: 'img' }[tag] || ''
}

const SPOKEN_ROLE = {
  link: 'link',
  button: 'button',
  checkbox: 'checkbox',
  radio: 'radio button',
  switch: 'switch',
  textbox: 'edit text',
  combobox: 'combo box',
  slider: 'slider',
  img: 'image',
  tab: 'tab',
  menuitem: 'menu item',
  option: 'option',
}

function nameOf(el) {
  const ids = el.getAttribute('aria-labelledby')
  if (ids) {
    return ids
      .split(/\s+/)
      .map((id) => document.getElementById(id))
      .filter(Boolean)
      .map(textOf)
      .join(' ')
  }
  const label = el.getAttribute('aria-label')
  if (label) return label
  if (el.localName === 'img') return el.alt || ''
  if (el.matches('input, select, textarea')) {
    return (el.labels?.[0] && textOf(el.labels[0])) || el.getAttribute('placeholder') || el.title || ''
  }
  return textOf(el) || el.title || ''
}

function statesOf(el, role) {
  const states = []
  const attr = (name) => el.getAttribute(name)
  if (el.matches('input[type="checkbox"], input[type="radio"]')) {
    if (role === 'switch') states.push(el.checked ? 'on' : 'off')
    else if (role === 'radio') states.push(el.checked ? 'selected' : 'not selected')
    else states.push(el.checked ? 'checked' : 'not checked')
  } else if (attr('aria-checked')) {
    const on = attr('aria-checked') === 'true'
    states.push(role === 'switch' ? (on ? 'on' : 'off') : on ? 'checked' : 'not checked')
  }
  if (attr('aria-pressed')) states.push(attr('aria-pressed') === 'true' ? 'pressed' : 'not pressed')
  if (attr('aria-expanded')) states.push(attr('aria-expanded') === 'true' ? 'expanded' : 'collapsed')
  if (attr('aria-current') === 'page') states.push('current page')
  if (el.disabled || attr('aria-disabled') === 'true') states.push('unavailable')
  // What's typed in a text field (never a password).
  if (role === 'textbox' && el.type !== 'password' && el.value) states.push(el.value)
  return states
}

/** "Schedule, link, current page" — like a screen reader announces focus. */
function describe(el) {
  if (el.localName === 'main') return 'Main content'
  const role = roleOf(el)
  if (role === 'dialog' || role === 'alertdialog') return `${clean(nameOf(el))}, dialog`
  if (SPOKEN_ROLE[role]) return [clean(nameOf(el)), SPOKEN_ROLE[role], ...statesOf(el, role)].filter(Boolean).join(', ')
  // A section or heading reached through a skip link or an in-page anchor.
  const heading = el.matches('h1, h2, h3, h4, h5, h6') ? el : el.querySelector('h1, h2, h3, h4, h5, h6')
  if (heading) return `${clean(textOf(heading))}, heading level ${heading.localName[1]}`
  return clean(textOf(el)).slice(0, 300)
}

/* ---------- blocks: paragraphs, headings, list items, cards… ---------- */

/** The block an inline piece of text belongs to (a <strong> inside a
    paragraph reads as the whole paragraph). Screen-reader-only spans count
    as inline even though they're positioned. */
function blockOf(el) {
  for (let e = el; e && e !== document.body; e = e.parentElement) {
    if (e.classList.contains('sr-only')) continue
    const display = getComputedStyle(e).display
    if (display !== 'inline' && display !== 'contents') return e
  }
  return document.body
}

const hasOwnText = (el) => [...el.childNodes].some((n) => n.nodeType === Node.TEXT_NODE && n.data.trim())

/** The block to read when the visitor taps/clicks some text. */
function blockAt(target) {
  if (target.closest('[aria-hidden="true"]')) return null
  if (target.localName === 'img') return target.alt ? target : null
  let host = target
  while (host && host !== document.body && !hasOwnText(host)) host = host.parentElement
  return host && host !== document.body ? blockOf(host) : null
}

/** Long sentences are split: some voices stop after ~15 s of speech. */
function sentences(text) {
  const out = []
  for (let s of text.split(/(?<=[.!?…])\s+/)) {
    while (s.length > 240) {
      const cut = s.lastIndexOf(' ', 240)
      const at = cut > 80 ? cut : 240
      out.push(s.slice(0, at))
      s = s.slice(at).trim()
    }
    if (s) out.push(s)
  }
  return out
}

/** The page as a list of { el, text } in reading order. */
function collect(scope) {
  const chunks = []
  let block = null
  let buffer = ''
  const flush = () => {
    const text = clean(buffer)
    if (block && speakable(text)) for (const s of sentences(text)) chunks.push({ el: block, text: s })
    buffer = ''
  }
  const visit = (node) => {
    for (const child of node.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        if (!child.data.trim()) continue
        const b = blockOf(child.parentElement)
        if (b !== block) {
          flush()
          block = b
        }
        buffer += child.data
      } else if (child.nodeType === Node.ELEMENT_NODE && !hidden(child)) {
        if (child.localName === 'img') {
          // A photo with its own caption is read through the caption.
          if (child.alt && !child.closest('figure')?.querySelector('figcaption')) {
            flush()
            block = child
            buffer = `Image: ${child.alt}`
            flush()
            block = null
          }
        } else if (!child.matches('input, select, textarea')) {
          // Text-only spans inside a block keep a space between them.
          buffer += ' '
          visit(child)
          buffer += ' '
        }
      }
    }
  }
  visit(scope)
  flush()
  return chunks
}

/* ---------- highlight what's being read ---------- */
let lit = null

function highlight(el) {
  lit?.removeAttribute('data-reading')
  lit = el
  el?.setAttribute('data-reading', '')
}

// The page follows the reading until the visitor scrolls on their own:
// from then on it never pulls them back (it keeps reading where it was).
let follow = true
const SCROLL_KEYS = new Set(['PageDown', 'PageUp', 'Home', 'End', 'ArrowDown', 'ArrowUp', ' '])
function onUserScroll(e) {
  if (e.type === 'keydown' && (!SCROLL_KEYS.has(e.key) || e.target.closest?.('input, textarea, select, button'))) return
  follow = false
}

function bring(el) {
  if (!follow) return
  const r = el.getBoundingClientRect()
  if (r.top > 90 && r.bottom < innerHeight - 100) return
  scrollToTarget(Math.max(0, scrollY + r.top - innerHeight * 0.3), { immediate: isStill(), duration: 0.8 })
}

/* ---------- "Read page" ---------- */
let mode = 'idle' // 'reading' | 'paused'
let chunks = []
let pos = 0

function setMode(next) {
  mode = next
  if (!playBtn) return
  playBtn.setAttribute('aria-label', next === 'reading' ? 'Pause reading' : next === 'paused' ? 'Resume reading' : 'Read page')
  playBtn.querySelector('[data-icon-play]').hidden = next === 'reading'
  playBtn.querySelector('[data-icon-pause]').hidden = next !== 'reading'
}

function readFrom(i) {
  if (i >= chunks.length) {
    highlight(null)
    setMode('idle')
    say('End of page.')
    return
  }
  pos = i
  highlight(chunks[i].el)
  bring(chunks[i].el)
  say(chunks[i].text, { onend: () => mode === 'reading' && readFrom(i + 1) })
}

/** Play / pause. Reading starts at the first block on screen, so it picks
    up wherever the visitor scrolled to. */
export function togglePage() {
  if (mode === 'reading') {
    // Pausing = stopping at this block (more reliable than synth.pause()).
    hush()
    setMode('paused')
    return
  }
  follow = true
  if (mode === 'paused') {
    setMode('reading')
    readFrom(pos)
    return
  }
  chunks = collect(document.querySelector('main') || document.body)
  if (!chunks.length) return
  const first = chunks.findIndex((c) => c.el.getBoundingClientRect().bottom > 80)
  setMode('reading')
  readFrom(Math.max(0, first))
}

export function stop() {
  hush()
  highlight(null)
  setMode('idle')
  pos = 0
}

/* ---------- reading what the visitor does ---------- */
let lastDialog = null

function onFocus(e) {
  const el = e.target
  if (!(el instanceof Element)) return
  // Reaching for the reader's own buttons doesn't interrupt the reading.
  if (el.closest('[data-reader-bar]') && mode === 'reading') return
  if (mode !== 'idle') stop()
  let text = describe(el)
  const dialog = el.closest('[role="dialog"], [role="alertdialog"]')
  if (dialog && dialog !== lastDialog && dialog !== el) text = `${clean(nameOf(dialog))}, dialog. ${text}`
  lastDialog = dialog
  say(text)
}

const INTERACTIVE = 'a[href], button, input, select, textarea, label, summary, [role="button"], [role="link"], [tabindex]:not([tabindex="-1"])'

function onClick(e) {
  const target = e.target
  if (!(target instanceof Element) || target.closest(INTERACTIVE)) return
  const block = blockAt(target)
  if (!block) return
  const text = block.localName === 'img' ? `Image: ${block.alt}` : textOf(block)
  if (!speakable(text)) return
  if (mode !== 'idle') stop()
  highlight(block)
  say(text, { onend: () => highlight(null) })
}

function onKey(e) {
  // Control silences the voice, as in desktop screen readers.
  if (e.key !== 'Control' || e.repeat) return
  if (mode === 'reading') {
    hush()
    setMode('paused')
  } else hush()
}

// Status messages (filters, carousels, the class picked…) are spoken too.
const observer = new MutationObserver(() => {
  const text = clean(status?.textContent)
  if (text && mode !== 'reading') say(text, { queue: true })
})

/* ---------- on / off ---------- */
let on = false

export function setRate(value) {
  rate = Number(value) || 1
}

export function enable({ rate: value = 1, greet = false } = {}) {
  setRate(value)
  if (on) return
  on = true
  pickVoice()
  synth.addEventListener?.('voiceschanged', pickVoice)
  document.addEventListener('focusin', onFocus)
  document.addEventListener('click', onClick)
  addEventListener('keydown', onKey)
  addEventListener('pagehide', hush)
  for (const type of ['wheel', 'touchmove', 'keydown']) addEventListener(type, onUserScroll, { passive: true })
  if (status) observer.observe(status, { childList: true, characterData: true, subtree: true })
  playBtn?.addEventListener('click', togglePage)
  stopBtn?.addEventListener('click', stop)
  // Speech needs a first interaction: when the mode was already on, the
  // first Tab or tap of the page starts it.
  if (greet) {
    say('Screen reader on. Press Tab to move between links and buttons, tap any text to hear it, or choose Read page.')
  }
}

export function disable() {
  if (!on) return
  on = false
  stop()
  synth.removeEventListener?.('voiceschanged', pickVoice)
  document.removeEventListener('focusin', onFocus)
  document.removeEventListener('click', onClick)
  removeEventListener('keydown', onKey)
  removeEventListener('pagehide', hush)
  for (const type of ['wheel', 'touchmove', 'keydown']) removeEventListener(type, onUserScroll, { passive: true })
  observer.disconnect()
  playBtn?.removeEventListener('click', togglePage)
  stopBtn?.removeEventListener('click', stop)
  say('Screen reader off.')
}
