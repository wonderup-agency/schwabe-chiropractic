/*
Component: toc
Webflow attribute: data-component="toc"

The article's "In this article" index. Answers Derek's comment on the Blog Post
template — *"will this be 'sticky'? and what is active vs. non-active state for
Table of Content sections?"*

Sticky is CSS (.toc is position: sticky). This file does the two things
CSS cannot: build the list from the article's own H2s, and track which section
the reader is in.
*/

import './styles/toc.css'

const ACTIVE = 'cc-active'
const LINK_CLASS = 'toc_link'

/** Turns a heading's text into a stable id. */
function slugify(text, used) {
  const base =
    text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 60) || 'section'

  let id = base
  let n = 2
  while (used.has(id)) id = `${base}-${n++}`
  used.add(id)
  return id
}

function buildLinks(headings, list) {
  const used = new Set()

  return headings.map((heading) => {
    if (!heading.id) heading.id = slugify(heading.textContent, used)

    const link = document.createElement('a')
    link.className = LINK_CLASS
    link.href = `#${heading.id}`
    link.textContent = heading.textContent
    list.appendChild(link)

    return { heading, link }
  })
}

/**
 * Marks the last heading whose top has passed the reading line.
 *
 * Scroll position, not IntersectionObserver: IO tells you an element is on
 * screen, and with several short sections visible at once that is ambiguous —
 * "which one am I reading" is a different question from "which ones can I
 * see". Comparing tops against a fixed line answers the right one, and it
 * costs one rAF-throttled read per scroll rather than a tween per frame.
 */
function trackActive(entries) {
  let ticking = false

  const update = () => {
    ticking = false
    const line = window.innerHeight * 0.25
    let current = -1

    entries.forEach((entry, i) => {
      if (entry.heading.getBoundingClientRect().top <= line) current = i
    })

    // Above the first heading: nothing is active rather than a false positive.
    entries.forEach((entry, i) => {
      const on = i === current
      entry.link.classList.toggle(ACTIVE, on)
      if (on) entry.link.setAttribute('aria-current', 'true')
      else entry.link.removeAttribute('aria-current')
    })
  }

  const onScroll = () => {
    if (ticking) return
    ticking = true
    requestAnimationFrame(update)
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  update()

  return onScroll
}

/**
 * @param {HTMLElement[]} elements - All elements matching [data-component='toc']
 */
export default function (elements) {
  elements.forEach((root) => {
    try {
      const toc = root.querySelector('[data-toc]')
      const list = root.querySelector('[data-toc-list]')
      const source = root.querySelector('[data-toc-source]')

      if (!toc || !list || !source) return

      const headings = Array.from(source.querySelectorAll('h2'))

      // An article with one section or none has nothing to index. Hiding the
      // whole aside is better than a one-item list pretending to be navigation.
      if (headings.length < 2) {
        toc.hidden = true
        return
      }

      const entries = buildLinks(headings, list)
      trackActive(entries)
    } catch (error) {
      console.error('[toc] failed, article still readable', error)
    }
  })
}
