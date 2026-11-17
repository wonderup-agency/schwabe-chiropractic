/*
Punch-list 2026-11-16: the skip link must be the first thing Tab reaches.

It lives inside the Nav component, but the Announcement Bar sits before the
Nav on every page, so its "Get directions" link was the first tab stop. We
move the skip link to the top of <body>. It is absolutely positioned and only
shows on :focus-visible, so moving it changes nothing visually except that it
now drops in at the very top of the page.
*/

const LABEL = 'skip-link-first'

export default function skipLinkFirst() {
  try {
    const link = document.querySelector('.nav-skip-link')
    if (link && document.body.firstElementChild !== link) document.body.prepend(link)
  } catch (error) {
    console.error(`[${LABEL}] failed, the skip link stays inside the nav`, error)
  }
}
