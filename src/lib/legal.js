/* Turns the plain text the admin writes into blocks: a blank line separates
   paragraphs, consecutive lines starting with "- " become a list and a line
   starting with "## " is a subheading inside the section. Shared
   by the /terms page and its live preview in the panel. */
export function parseLegalBody(text = '') {
  const blocks = []
  for (const chunk of String(text).replace(/\r\n/g, '\n').split(/\n\s*\n/)) {
    const lines = chunk.split('\n').map((l) => l.trim()).filter(Boolean)
    if (!lines.length) continue
    let para = []
    let list = []
    const flush = () => {
      if (para.length) blocks.push({ type: 'p', text: para.join(' ') })
      if (list.length) blocks.push({ type: 'ul', items: list })
      para = []
      list = []
    }
    for (const line of lines) {
      if (/^#{2,}\s+/.test(line)) {
        flush()
        blocks.push({ type: 'h', text: line.replace(/^#{2,}\s+/, '') })
      } else if (/^[-•*]\s+/.test(line)) {
        if (para.length) {
          blocks.push({ type: 'p', text: para.join(' ') })
          para = []
        }
        list.push(line.replace(/^[-•*]\s+/, ''))
      } else {
        if (list.length) {
          blocks.push({ type: 'ul', items: list })
          list = []
        }
        para.push(line)
      }
    }
    flush()
  }
  return blocks
}
