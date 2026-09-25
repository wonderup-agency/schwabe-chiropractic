/*
Component: share
Webflow attribute: data-component="share"

The article's "Share this post" row. Four controls: copy the link, and hand the
article to LinkedIn, X and Facebook.

All four need the CURRENT page URL, and that is the whole reason this is a
component instead of four links in the Designer. A share intent is
`https://…?url=<this page>`, and on a CMS template "this page" is only known at
runtime — Webflow cannot bind a Collection Page URL into an href (see
.claude/rules/STORIES-BLOG-CMS.md, where the same limit bit the card links).
*/

import './styles/share.css'

const LABEL = 'share'
const COPIED = 'cc-copied'
const COPIED_MS = 2000

/**
 * Share intents, by `data-share` value.
 *
 * Both arguments arrive already percent-encoded. X is `x.com/intent/post`, not
 * the old `twitter.com/intent/tweet`: the latter still redirects today, and a
 * redirect is one more thing that can quietly stop working.
 */
const INTENTS = {
  linkedin: (url) =>
    `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
  x: (url, title) => `https://x.com/intent/post?url=${url}&text=${title}`,
  facebook: (url) => `https://www.facebook.com/sharer/sharer.php?u=${url}`,
}

/**
 * Copies `text`, resolving false when the browser refuses.
 *
 * `navigator.clipboard` needs a secure context, so it is absent on plain http
 * and inside some in-app browsers. The textarea fallback is deprecated and
 * still the only thing that works there; it is wrapped because Safari throws
 * rather than returning false.
 */
async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // fall through to the legacy path
  }

  try {
    const field = document.createElement('textarea')
    field.value = text
    field.setAttribute('readonly', '')
    field.style.position = 'fixed'
    field.style.opacity = '0'
    document.body.appendChild(field)
    field.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(field)
    return ok
  } catch {
    return false
  }
}

/**
 * Wires the copy control.
 *
 * It is not a <button> because Webflow purges a button created outside a form
 * — the same constraint that made filter.js use role="button" — so Enter and
 * Space are handled here and the focus ring lives in share.css.
 */
function wireCopy(el, url) {
  const done = el.getAttribute('data-share-done') || 'Link copied'
  const idle = el.getAttribute('aria-label') || 'Copy link'
  let timer

  el.setAttribute('role', 'button')
  el.setAttribute('tabindex', '0')
  el.setAttribute('aria-label', idle)

  const run = async () => {
    const ok = await copyText(url)
    if (!ok) return

    el.classList.add(COPIED)
    // aria-label, not just the class: the state has to reach a screen reader,
    // and the confirmation is a colour swap with nothing to announce.
    el.setAttribute('aria-label', done)

    clearTimeout(timer)
    timer = setTimeout(() => {
      el.classList.remove(COPIED)
      el.setAttribute('aria-label', idle)
    }, COPIED_MS)
  }

  el.addEventListener('click', (event) => {
    event.preventDefault()
    run()
  })

  el.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    // Space scrolls the page if it is not swallowed.
    event.preventDefault()
    run()
  })
}

/**
 * @param {HTMLElement[]} elements - All elements matching [data-component='share']
 */
export default function (elements) {
  elements.forEach((root) => {
    try {
      const controls = Array.from(root.querySelectorAll('[data-share]'))
      if (!controls.length) return

      // The hash is dropped so sharing from halfway down an article does not
      // paste a link that lands the reader mid-page.
      const raw = window.location.href.split('#')[0]
      const url = encodeURIComponent(raw)
      const title = encodeURIComponent(document.title)

      controls.forEach((el) => {
        const kind = el.getAttribute('data-share')

        if (kind === 'copy') {
          wireCopy(el, raw)
          return
        }

        const build = INTENTS[kind]
        if (!build) return

        el.setAttribute('href', build(url, title))
        el.setAttribute('target', '_blank')
        el.setAttribute('rel', 'noopener noreferrer')
      })
    } catch (error) {
      console.error(`[${LABEL}] failed, article still readable`, error)
    }
  })
}
