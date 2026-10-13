/*
Component: cost
Webflow attribute: data-component="cost"

The "Cost of waiting" section. The four lines over the photo build up: each
one fades in and stays, so all four end up on screen together. Triggered when
the lines enter the viewport, timed (not tied to scroll), a slight stagger
between lines, played once. No pin: the page scrolls normally.

Until 2026-10-13 this section pinned for ~three viewports, raised the photo as
a curtain over the intro and swapped the lines one at a time out of a blur.
Derek (Pastel #26, following the rule in #5) asked for the mobile behaviour on
every width. History: .claude/rules/components/cost.md
*/

import './styles/cost.css'
import {
  DIST,
  EASE,
  MQ,
  getGsap,
  getPlugin,
  onceLaidOut,
  isDev,
} from '../utils/motion.js'

const COST = {
  // Same family as statement.js: ~0.5s per line, a beat between lines.
  duration: 0.55,
  stagger: 0.2,
  blur: 6,
  start: 'top 75%',
}

/**
 * @param {HTMLElement[]} elements - All elements matching [data-component='cost']
 */
export default function (elements) {
  if (!elements.length) return

  const gsap = getGsap('cost')
  if (!gsap) return

  const ScrollTrigger = getPlugin('ScrollTrigger', 'cost')
  if (!ScrollTrigger) return

  gsap.registerPlugin(ScrollTrigger)

  onceLaidOut(() => {
    const mm = gsap.matchMedia()

    elements.forEach((wrapper) => {
      const media = wrapper.querySelector('[data-cost-media]')
      // MAST's Plain Text is a ComponentInstance and Webflow rejects attributes
      // on those, so the four lines are addressed as the direct children of
      // [data-cost-lines] rather than each carrying its own attribute.
      const linesBox = wrapper.querySelector('[data-cost-lines]')
      const lines = linesBox ? Array.from(linesBox.children) : []
      if (!lines.length) return

      mm.add(MQ.reduced, () => {
        gsap.set(lines, { opacity: 1, y: 0, filter: 'blur(0px)' })
      })

      mm.add(MQ.motionOk, () => {
        gsap.fromTo(
          lines,
          { opacity: 0, y: DIST.sm, filter: `blur(${COST.blur}px)` },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: COST.duration,
            ease: EASE.out,
            stagger: COST.stagger,
            clearProps: 'filter',
            scrollTrigger: {
              trigger: linesBox,
              start: COST.start,
              once: true,
              markers: isDev(),
            },
          }
        )
      })

      // The photo is lazy and declares no height: when it arrives the document
      // changes and every trigger below it is off.
      if (media && !media.complete) {
        media.addEventListener('load', () => ScrollTrigger.refresh(), {
          once: true,
        })
      }
    })
  })
}
