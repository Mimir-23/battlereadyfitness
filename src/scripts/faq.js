import { announce } from './core.js'

/* ------------------------------------------------------------------ */
/*  FAQ: search with highlighted matches, topic filters with live       */
/*  counts, and deep links (/#faq-how-do-i-book-a-class opens it). The   */
/*  questions themselves are native <details>, so without this script    */
/*  they still open and close.                                           */
/* ------------------------------------------------------------------ */

/* Accent- and case-insensitive, one char per char so match positions in
   the normalized text are also positions in the original. */
const fold = (text) =>
  Array.from(text, (c) => c.normalize('NFD').replace(/[̀-ͯ]/g, '').charAt(0).toLowerCase() || c).join('')

/** Wraps every occurrence of `terms` inside `root`'s text nodes in <mark>. */
function highlight(root, terms) {
  if (!terms.length) return false
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const nodes = []
  while (walker.nextNode()) nodes.push(walker.currentNode)
  let found = false
  for (const node of nodes) {
    const text = node.nodeValue
    const folded = fold(text)
    const ranges = []
    for (const term of terms) {
      let i = folded.indexOf(term)
      while (i !== -1) {
        ranges.push([i, i + term.length])
        i = folded.indexOf(term, i + term.length)
      }
    }
    if (!ranges.length) continue
    found = true
    ranges.sort((a, b) => a[0] - b[0])
    const frag = document.createDocumentFragment()
    let at = 0
    for (const [start, end] of ranges) {
      if (start < at) continue // overlaps the previous term
      frag.append(text.slice(at, start))
      const mark = document.createElement('mark')
      mark.className = 'faq-mark'
      mark.textContent = text.slice(start, end)
      frag.append(mark)
      at = end
    }
    frag.append(text.slice(at))
    node.replaceWith(frag)
  }
  return found
}

export function initFaq() {
  const section = document.querySelector('[data-faq]')
  if (!section) return

  const search = section.querySelector('[data-faq-search]')
  const clear = section.querySelector('[data-faq-clear]')
  const chips = [...section.querySelectorAll('[data-faq-topic]')]
  const count = section.querySelector('[data-faq-count]')
  const list = section.querySelector('[data-faq-list]')
  const empty = section.querySelector('[data-faq-empty]')
  const ask = section.querySelector('[data-faq-ask]')
  const items = [...section.querySelectorAll('[data-faq-item]')].map((el) => {
    const q = el.querySelector('[data-faq-q]')
    const a = el.querySelector('[data-faq-a]')
    return {
      el,
      q,
      a,
      topic: el.dataset.topic,
      qHtml: q.innerHTML,
      aHtml: a.innerHTML,
      qText: fold(q.textContent),
      text: fold(`${q.textContent} ${el.querySelector('[data-faq-tag]')?.textContent || ''} ${a.textContent}`),
    }
  })
  const total = items.length

  section.querySelector('[data-faq-tools]')?.removeAttribute('hidden')

  let topic = ''
  let query = ''
  let speakTimer = 0

  const render = () => {
    const terms = fold(query.trim()).split(/\s+/).filter(Boolean)
    const perTopic = new Map()
    let shown = 0

    for (const it of items) {
      // Put the original text back before marking the new matches.
      it.q.innerHTML = it.qHtml
      it.a.innerHTML = it.aHtml
      const matches = terms.every((t) => it.text.includes(t))
      if (matches) perTopic.set(it.topic, (perTopic.get(it.topic) || 0) + 1)
      const visible = matches && (!topic || it.topic === topic)
      it.el.hidden = !visible
      if (!visible) continue
      shown += 1
      highlight(it.q, terms)
      const inAnswer = highlight(it.a, terms)
      // A match only in the answer is invisible while closed: open it, and
      // close it again when the search no longer needs it.
      if (terms.length && inAnswer && !terms.every((t) => it.qText.includes(t)) && !it.el.open) {
        it.el.open = true
        it.el.dataset.autoOpen = ''
      } else if (!terms.length && it.el.hasAttribute('data-auto-open')) {
        it.el.open = false
        delete it.el.dataset.autoOpen
      }
    }

    for (const chip of chips) {
      const slug = chip.dataset.faqTopic
      const n = slug ? perTopic.get(slug) || 0 : [...perTopic.values()].reduce((s, v) => s + v, 0)
      chip.setAttribute('aria-pressed', String(slug === topic))
      chip.querySelector('[data-faq-topic-count]').textContent = n
      chip.classList.toggle('is-empty', n === 0 && slug !== topic)
    }

    // The topic tag is noise once a single topic is picked.
    list.classList.toggle('is-topic', !!topic)
    clear?.toggleAttribute('hidden', !query)

    const message =
      shown === total ? `${total} questions` : shown === 0 ? 'No questions match' : `${shown} of ${total} questions`
    if (count) count.textContent = message

    empty.hidden = shown > 0
    list.hidden = shown === 0
    if (!shown) {
      section.querySelector('[data-faq-query]').textContent = query.trim() || topic
      const text = query.trim() ? `Hi! I have a question: ${query.trim()}` : 'Hi! I have a question about Battle Ready Fitness.'
      ask.href = `${ask.dataset.waBase}?text=${encodeURIComponent(text)}`
    }

    // Screen readers hear the result once the visitor pauses typing.
    clearTimeout(speakTimer)
    speakTimer = setTimeout(() => announce(message), 450)
  }

  search?.addEventListener('input', () => {
    query = search.value
    render()
  })
  search?.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && search.value) {
      e.preventDefault()
      search.value = ''
      query = ''
      render()
    }
  })
  clear?.addEventListener('click', () => {
    search.value = ''
    query = ''
    render()
    search.focus()
  })
  for (const chip of chips) {
    chip.addEventListener('click', () => {
      topic = chip.dataset.faqTopic
      render()
    })
  }
  section.querySelector('[data-faq-reset]')?.addEventListener('click', () => {
    if (search) search.value = ''
    query = ''
    topic = ''
    render()
    ;(search || chips[0])?.focus()
  })

  // Opening or closing by hand means the search no longer owns that item.
  for (const it of items) {
    it.el.querySelector('summary').addEventListener('click', () => delete it.el.dataset.autoOpen)
  }

  // Deep links: arriving at (or jumping to) #faq-… opens that question. Runs
  // before the smooth scroll starts, so it lands on the opened item.
  const openFromHash = () => {
    const id = decodeURIComponent(location.hash.slice(1))
    const it = id.startsWith('faq-') && items.find((x) => x.el.id === id)
    if (!it) return
    if (it.el.hidden) {
      if (search) search.value = ''
      query = ''
      topic = ''
      render()
    }
    it.el.open = true
  }
  openFromHash()
  addEventListener('hashchange', openFromHash)
  // In-page links glide through Lenis with pushState (no hashchange): open
  // the target first, in the capture phase, so the scroll lands on it.
  document.addEventListener(
    'click',
    (e) => {
      const a = e.target.closest?.('a[href*="#faq-"]')
      if (!a) return
      const url = new URL(a.href, location.href)
      if (url.pathname !== location.pathname) return
      const it = items.find((x) => x.el.id === decodeURIComponent(url.hash.slice(1)))
      if (it && !it.el.hidden) it.el.open = true
    },
    true,
  )
}
