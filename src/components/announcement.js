/*
Component: announcement
Webflow attribute: data-component="announcement"

The site-wide announcement band above the nav. The bar itself is built in the
Designer and ships VISIBLE; all this component does is remember that a visitor
dismissed it, and honour that for DISMISS_DAYS.

The Master Copy asks for exactly that — "toggleable global component" with a
dismiss that persists — and persistence is the half Webflow cannot do on its
own.
*/

import './styles/announcement.css'

const LABEL = 'announcement'
const STORE_KEY = 'schwabe:announcement'
const DISMISS_DAYS = 14
const DISMISS_MS = DISMISS_DAYS * 24 * 60 * 60 * 1000

/**
 * A stable short id for the CURRENT message.
 *
 * Dismissals are keyed to it on purpose: when the clinic edits the bar in Build
 * Mode the message becomes a different announcement, and someone who dismissed
 * the old one has never seen the new one. Keying only on time would swallow it
 * for up to two weeks.
 */
function messageId(text) {
  let hash = 0
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(i)
    hash |= 0
  }
  return String(hash)
}

/**
 * Both accessors are wrapped because storage is not guaranteed: a private
 * window, blocked site data or an embedded browser can make even reading throw.
 * When it does, the bar simply always shows — the safe direction to fail.
 */
function readDismissal() {
  try {
    const raw = window.localStorage.getItem(STORE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed.t === 'number' ? parsed : null
  } catch {
    return null
  }
}

function writeDismissal(id) {
  try {
    window.localStorage.setItem(
      STORE_KEY,
      JSON.stringify({ id, t: Date.now() })
    )
  } catch {
    // Nothing to do: the bar comes back on the next visit, which is a smaller
    // failure than refusing to close it now.
  }
}

/**
 * @param {HTMLElement[]} elements - All elements matching [data-component='announcement']
 */
export default function (elements) {
  elements.forEach((bar) => {
    try {
      const close = bar.querySelector('[data-announcement="close"]')
      const id = messageId(bar.textContent.trim())
      const seen = readDismissal()

      if (seen && seen.id === id && Date.now() - seen.t < DISMISS_MS) {
        bar.remove()
        return
      }

      // No control in the markup: the bar is a plain notice and there is
      // nothing to wire. It stays up, which is the Designer's intent.
      if (!close) return

      // role/tabindex/aria-label come from the Designer, but they are asserted
      // here too so the control is never a div that only a mouse can reach —
      // it is not a <button> because Webflow purges a button created outside a
      // form, the same constraint that shaped filter.js and share.js.
      close.setAttribute('role', 'button')
      close.setAttribute('tabindex', '0')
      if (!close.getAttribute('aria-label')) {
        close.setAttribute('aria-label', 'Dismiss announcement')
      }

      const dismiss = () => {
        writeDismissal(id)
        bar.remove()
      }

      close.addEventListener('click', (event) => {
        event.preventDefault()
        dismiss()
      })

      close.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return
        // Space scrolls the page if it is not swallowed.
        event.preventDefault()
        dismiss()
      })
    } catch (error) {
      console.error(`[${LABEL}] failed, the bar stays up`, error)
    }
  })
}
