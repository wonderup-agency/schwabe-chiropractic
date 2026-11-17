/*
Punch-list 2026-11-16: don't break hyphenated words across lines.

Browsers are allowed to break after a hyphen, so "hands-on" or "60-minute"
can end up as "hands-" / "on". A non-breaking hyphen (U+2011) would fix it,
but DM Sans and EB Garamond don't reliably have that glyph, so instead we
wrap short hyphenated words in <span class="u-nowrap"> (white-space: nowrap).

Only text inside headings, paragraphs, list items and Webflow's text
components is touched, only words up to 24 characters, and never inside
form fields, scripts or code.
*/

const LABEL = 'hyphen-nowrap'
const SCOPE = 'h1, h2, h3, h4, h5, h6, p, li, blockquote, .heading-text, .plain-text, .eyebrow, .btn-text'
const SKIP = 'script, style, textarea, select, option, code, pre, .u-nowrap, [contenteditable]'
const WORD = /[\p{L}\p{N}]+(?:[-‐][\p{L}\p{N}]+)+/gu
const MAX = 24

function wrapNode(node) {
  const text = node.nodeValue
  WORD.lastIndex = 0
  if (!WORD.test(text)) return
  WORD.lastIndex = 0
  const frag = document.createDocumentFragment()
  let last = 0
  let changed = false
  for (const m of text.matchAll(WORD)) {
    if (m[0].length > MAX) continue
    frag.append(text.slice(last, m.index))
    const span = document.createElement('span')
    span.className = 'u-nowrap'
    span.textContent = m[0]
    frag.append(span)
    last = m.index + m[0].length
    changed = true
  }
  if (!changed) return
  frag.append(text.slice(last))
  node.replaceWith(frag)
}

export default function hyphenNowrap(root = document.body) {
  try {
    const nodes = []
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        const el = n.parentElement
        if (!el || !n.nodeValue.includes('-') && !n.nodeValue.includes('‐')) return NodeFilter.FILTER_REJECT
        if (el.closest(SKIP) || !el.closest(SCOPE)) return NodeFilter.FILTER_REJECT
        return NodeFilter.FILTER_ACCEPT
      },
    })
    while (walker.nextNode()) nodes.push(walker.currentNode)
    nodes.forEach(wrapNode)
  } catch (error) {
    console.error(`[${LABEL}] failed, hyphenated words may still break`, error)
  }
}
