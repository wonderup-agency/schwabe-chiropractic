/*
Pill buttons inside FAQ answers (Pastel 978216 #89, 2026-11-16).

`accordion.css` draws a link as the small pill when it is the only thing in
its own block. That used to mean a <div> whose only child is the link, which
is how the answers were imported. When the client edits that line in the CMS
Rich Text editor, Webflow saves it back as a <p>, and the pill disappeared.

CSS can't tell "<p><a>Link</a></p>" from "<p>Call us at <a>number</a>.</p>"
(text nodes are invisible to selectors), so this marks the first case: a
<p> or <div> directly in the rich text whose text is exactly its one link.
The link gets `is-pill-link` and accordion.css styles that class.
*/

const LABEL = 'pill-links'
const CLASS = 'is-pill-link'

export default function pillLinks(root = document) {
  try {
    root
      .querySelectorAll(
        '.accordion-content .w-richtext > p, .accordion-content .w-richtext > div'
      )
      .forEach((block) => {
        const kids = block.children
        if (kids.length !== 1 || kids[0].tagName !== 'A') return
        const a = kids[0]
        if (block.textContent.trim() !== a.textContent.trim()) return
        a.classList.add(CLASS)
      })
  } catch (error) {
    console.error(`[${LABEL}] failed, links stay as plain text links`, error)
  }
}
