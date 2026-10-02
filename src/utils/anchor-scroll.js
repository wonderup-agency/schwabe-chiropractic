/*
Same-page anchor links that land below the sticky nav, not under it.

Webflow's own smooth scroll (webflow.js) takes over every click on a
`#hash` link and only offsets for a header with `position: fixed`. Our nav
is `position: sticky`, so it scrolls the target to y=0 and the nav covers
the heading. It also ignores `scroll-margin-top`, which is how the offset is
set in the Designer (`faq_category` has 120px) and in repo CSS
(anchor-offset.css, toc.css).

We listen in the capture phase on window, so this runs before Webflow's
delegated handler on document, and hand the scroll to the browser with
scrollIntoView(), which does respect scroll-margin. Measured 2026-10-02 on
/faq: before, every category landed at top 0; after, at its scroll-margin.

Left to Webflow: tabs, dropdowns, lightboxes and anything with
[data-anchor-skip], since those use hashes for their own state. Modified
clicks (new tab, etc.) and links whose target does not exist are untouched.
The target gets focus (without a second scroll) so keyboard and screen
reader users continue from the section they jumped to.
*/

const SKIP = '.w-tabs, .w-dropdown, .w-lightbox, [data-anchor-skip]'

export default function anchorScroll() {
  window.addEventListener(
    'click',
    (event) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const link = event.target.closest?.('a[href^="#"]')
      if (!link || link.closest(SKIP)) return

      const id = decodeURIComponent(link.getAttribute('href').slice(1))
      const target = id && document.getElementById(id)
      if (!target) return

      event.preventDefault()
      event.stopPropagation()

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })

      if (location.hash !== `#${id}`) history.pushState(null, '', `#${id}`)
      if (!target.hasAttribute('tabindex') && !target.matches('a, button, input, select, textarea')) {
        target.setAttribute('tabindex', '-1')
      }
      target.focus({ preventScroll: true })
    },
    true
  )
}
