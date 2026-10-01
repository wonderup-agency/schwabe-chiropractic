/*
Component: readtime
Webflow attribute: data-component="readtime"

Writes the article's "N min read" by counting the words of the body, instead of
reading a number somebody typed into the CMS.

No CSS: the element is already styled in the Designer and nothing is hidden, so
there is no anti-FOUC state to ship.

The `read-time` field of the Blogs collection is what this replaces. A field
that has to be updated by hand every time a paragraph changes is a field that
is wrong most of the time — and nobody ever notices, because nothing compares
it to the article.
*/

const READTIME = {
  // Words per minute. 200–250 is the usual range for adult silent reading of
  // general prose; 225 sits in the middle. Overridable per element because a
  // clinical article is denser than a blog post.
  wpm: 225,
  label: 'min read',
}

/** The body this element measures. Falls back to the index's source. */
function findSource() {
  return (
    document.querySelector('[data-readtime-source]') ||
    document.querySelector('[data-toc-source]')
  )
}

function countWords(source) {
  // textContent, not innerText: innerText forces a layout pass and skips
  // anything hidden, and neither difference is worth a reflow here.
  const text = source.textContent || ''
  const words = text.trim().split(/\s+/)
  return words[0] === '' ? 0 : words.length
}

/**
 * @param {HTMLElement[]} elements - All elements matching [data-component='readtime']
 */
export default function (elements) {
  elements.forEach((el) => {
    try {
      const source = findSource()
      if (!source) return

      const words = countWords(source)

      // An empty body means the CMS did not render, not that the article is a
      // one-minute read. Leave the element exactly as it is.
      if (!words) return

      const wpm = Number(el.getAttribute('data-readtime-wpm')) || READTIME.wpm
      const minutes = Math.max(1, Math.round(words / wpm))

      el.textContent = `${minutes} ${READTIME.label}`
    } catch (error) {
      console.error('[readtime] failed, byline still readable', error)
    }
  })
}
