import { slugify, whatsappUrl } from '../content/defaults.js'
import { parseLegalBody } from './legal.js'

/* ------------------------------------------------------------------ */
/*  Preguntas frecuentes: normaliza lo que escribe el admin (temas,     */
/*  anclas, párrafos y el botón opcional). Lo comparten la sección del  */
/*  inicio y su vista previa en el panel.                               */
/* ------------------------------------------------------------------ */

/** The optional button under an answer. Only safe destinations: site paths,
    anchors, https, mail, phone, or the keyword "whatsapp". */
export function faqLink(item, brand) {
  const label = String(item?.linkLabel || '').trim()
  const raw = String(item?.linkUrl || '').trim()
  if (!label || !raw) return null
  if (raw.toLowerCase() === 'whatsapp') return { label, href: whatsappUrl(brand), external: true }
  if (/^(\/(?!\/)|#)/.test(raw)) return { label, href: raw, external: false }
  if (/^(https?:|mailto:|tel:)/i.test(raw)) return { label, href: raw, external: /^https?:/i.test(raw) }
  // "instagram.com/battle_readyfit" typed without the protocol.
  if (/^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(raw)) return { label, href: `https://${raw}`, external: true }
  return null
}

/** Items ready to render: unique anchor ids, topic slug and answer blocks. */
export function faqItems(faq, brand) {
  const seen = new Map()
  return (faq?.items || [])
    .filter((it) => String(it?.question || '').trim() && String(it?.answer || '').trim())
    .map((it, i) => {
      const base = `faq-${slugify(it.question) || i + 1}`
      const n = seen.get(base) || 0
      seen.set(base, n + 1)
      const category = String(it.category || '').trim() || 'General'
      return {
        id: n ? `${base}-${n + 1}` : base,
        question: it.question.trim(),
        answer: it.answer,
        category,
        topic: slugify(category) || 'general',
        blocks: parseLegalBody(it.answer),
        link: faqLink(it, brand),
      }
    })
}

/** Topics in first-appearance order, with how many questions each has. */
export function faqTopics(items) {
  const topics = new Map()
  for (const it of items) {
    const t = topics.get(it.topic)
    if (t) t.count += 1
    else topics.set(it.topic, { slug: it.topic, label: it.category, count: 1 })
  }
  return [...topics.values()]
}

/** schema.org FAQPage for search engines and assistants. */
export function faqJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: it.blocks.map((b) => (b.type === 'ul' ? b.items.join('. ') : b.text)).join('\n\n'),
      },
    })),
  }
}
