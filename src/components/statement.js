/*
Component: statement
Webflow attribute: data-component="statement"

The "You do not need another guess." section. Pins for one viewport and reveals
both headlines word by word, out of a blur, scrubbed to the pin.

Full rationale, tuning history and the measurements behind every number:
.claude/rules/components/statement.md
*/

import './styles/statement.css'
import {
  DUR,
  DIST,
  EASE,
  STAGGER,
  SCROLL,
  MQ,
  getGsap,
  getPlugin,
  onceLaidOut,
  isDev,
} from '../utils/motion.js'

const STATEMENT = {
  // Scroll the pin consumes, as a share of the viewport.
  pin: '+=100%',
  // Starting blur on each word, in px.
  blur: 8,
  // Where the second headline starts relative to the first, 0–1 of its own
  // duration. At 0.5 the second begins while the first is ~60% through, which
  // is what makes the two read as one gesture instead of two blocks.
  overlap: 0.5,
}

// Pinning needs height, not just width. A phone on its side (844×390) lands in
// Webflow's Tablet breakpoint and would pass a bare min-width: 768px, but the
// sticky nav already takes 70px of those 390. See .claude/rules/RESPONSIVE.md
const PINNABLE = '(min-width: 768px) and (min-height: 600px)'

/**
 * @param {HTMLElement[]} elements - All elements matching [data-component='statement']
 */
export default function (elements) {
  if (!elements.length) return

  // The failsafe in global.js has to survive a missing GSAP, so nothing above
  // this point may touch window.gsap. A bare gsap.registerPlugin() at the top
  // of the module throws ReferenceError and takes the whole module with it.
  const gsap = getGsap('statement')
  if (!gsap) return

  const ScrollTrigger = getPlugin('ScrollTrigger', 'statement')
  const SplitText = getPlugin('SplitText', 'statement')
  if (!ScrollTrigger || !SplitText) return

  gsap.registerPlugin(ScrollTrigger, SplitText)

  // Fonts first, matchMedia second. Opening the matchMedia inside the font
  // promise instead would put every tween outside the context mm.revert()
  // cleans up, and the pin would survive a breakpoint change.
  onceLaidOut(() => {
    const mm = gsap.matchMedia()

    elements.forEach((wrapper) => {
      // MAST's Heading is a ComponentInstance and Webflow rejects attributes
      // on those ("This element does not support attributes"), so the hook is
      // one attribute on the container and the lines are its direct children —
      // the same shape reveal.js uses for data-anim="stagger".
      const linesBox = wrapper.querySelector('[data-statement-lines]')
      if (!linesBox) return
      const lines = Array.from(linesBox.children)
      if (!lines.length) return

      // Reduced motion is a state, not an off switch: same end state, no
      // travel, no blur, no pin.
      mm.add(MQ.reduced, () => {
        gsap.set(lines, { opacity: 1, y: 0, filter: 'blur(0px)' })
      })

      mm.add(
        {
          canPin: `${PINNABLE} and ${MQ.motionOk}`,
          motionOk: MQ.motionOk,
        },
        (ctx) => {
          if (!ctx.conditions.canPin) {
            // No pin: a plain entrance, once, no blur and no scrub.
            gsap.fromTo(
              lines,
              { opacity: 0, y: DIST.md },
              {
                opacity: 1,
                y: 0,
                duration: DUR.base,
                ease: EASE.out,
                stagger: STAGGER.loose,
                scrollTrigger: {
                  trigger: wrapper,
                  start: SCROLL.start,
                  once: SCROLL.once,
                  markers: isDev(),
                },
              }
            )
            return
          }

          // type: 'words' with no mask. A mask wrapper has overflow: clip and
          // would shear the blur, which bleeds outside the word's box.
          // aria defaults to 'auto': the label goes on the container and every
          // word gets aria-hidden, so a screen reader reads the whole sentence.
          const splits = []
          const wordsPerLine = []

          lines.forEach((line) => {
            const split = SplitText.create(line, { type: 'words' })
            splits.push(split)
            wordsPerLine.push(split.words)
            gsap.set(line, { opacity: 1 })
          })

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: wrapper,
              start: 'top top',
              end: STATEMENT.pin,
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
              scrub: SCROLL.scrub,
              invalidateOnRefresh: true,
              markers: isDev(),
            },
          })

          // No travel on the scrubbed branch — opacity and blur only.
          //
          // A scrubbed tween has no duration of its own: its progress is the
          // visitor's scroll. DIST.sm is 12px, and spread over the ~360px of
          // scroll one word occupies that is 0.03px per pixel scrolled — far
          // too slow to read as movement, and plenty to read as the text
          // never settling. Measured: it drifted upward the whole way down.
          //
          // `linear` alone only made the drift uniform, it did not remove it.
          // Travel belongs to tweens that own their duration; the no-pin
          // branch above still uses it. Here blur carries the gesture — it
          // has no position for the eye to anchor to, so it reads as coming
          // into focus rather than as layout moving.
          wordsPerLine.forEach((words, i) => {
            tl.fromTo(
              words,
              {
                opacity: 0,
                filter: `blur(${STATEMENT.blur}px)`,
              },
              {
                opacity: 1,
                filter: 'blur(0px)',
                duration: DUR.base,
                ease: EASE.linear,
                stagger: STAGGER.tight,
              },
              i === 0 ? 0 : `<${STATEMENT.overlap * 100}%`
            )
          })

          // matchMedia reverts the tweens and the trigger on its own, but the
          // split rewrote the DOM and has to be undone by hand — revert the
          // instances we kept, never a fresh one.
          return () => {
            splits.forEach((split) => split.revert())
            splits.length = 0
            wordsPerLine.length = 0
          }
        }
      )
    })
  })
}
