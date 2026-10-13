/*
Component: statement
Webflow attribute: data-component="statement"

The "You do not need another guess." section. The two headlines fade in when
they enter the viewport: timed, not tied to scroll, the second line a beat
after the first, played once.

Until 2026-10-13 the section pinned for a viewport and scrubbed the words out
of a blur. Derek (Pastel #5) asked to drop every pin so the page always
scrolls normally, and made "timed fade on enter, once" the rule for every
scroll animation on the site. History: .claude/rules/components/statement.md
*/

import './styles/statement.css'
import {
  DIST,
  EASE,
  MQ,
  getGsap,
  getPlugin,
  onceLaidOut,
  isDev,
} from '../utils/motion.js'

const STATEMENT = {
  // Derek: "about 400 to 600ms, second line slightly after the first".
  duration: 0.55,
  delay: 0.15,
  // A light blur keeps the old "coming into focus" feel without the scrub.
  blur: 6,
  // The headlines sit centred in the section, so wait until they are well
  // inside the viewport rather than firing on the section's top edge.
  start: 'top 80%',
}

/**
 * @param {HTMLElement[]} elements - All elements matching [data-component='statement']
 */
export default function (elements) {
  if (!elements.length) return

  // The failsafe in global.js has to survive a missing GSAP, so nothing above
  // this point may touch window.gsap.
  const gsap = getGsap('statement')
  if (!gsap) return

  const ScrollTrigger = getPlugin('ScrollTrigger', 'statement')
  if (!ScrollTrigger) return

  gsap.registerPlugin(ScrollTrigger)

  onceLaidOut(() => {
    const mm = gsap.matchMedia()

    elements.forEach((wrapper) => {
      // MAST's Heading is a ComponentInstance and Webflow rejects attributes
      // on those, so the hook is one attribute on the container and the lines
      // are its direct children.
      const linesBox = wrapper.querySelector('[data-statement-lines]')
      if (!linesBox) return
      const lines = Array.from(linesBox.children)
      if (!lines.length) return

      mm.add(MQ.reduced, () => {
        gsap.set(lines, { opacity: 1, y: 0, filter: 'blur(0px)' })
      })

      mm.add(MQ.motionOk, () => {
        gsap.fromTo(
          lines,
          { opacity: 0, y: DIST.sm, filter: `blur(${STATEMENT.blur}px)` },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: STATEMENT.duration,
            ease: EASE.out,
            stagger: STATEMENT.delay,
            // Hand the filter back so a stray blur(0) doesn't keep a layer.
            clearProps: 'filter',
            scrollTrigger: {
              trigger: linesBox,
              start: STATEMENT.start,
              once: true,
              markers: isDev(),
            },
          }
        )
      })
    })
  })
}
