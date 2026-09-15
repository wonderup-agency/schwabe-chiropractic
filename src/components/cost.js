/*
Component: cost
Webflow attribute: data-component="cost"

The "Cost of waiting" section. Pins for roughly three viewports and tells the
section as one scrubbed sequence: the photo band rises as a curtain over the
intro, the four lines surface one at a time out of a blur, and the photo drifts
behind them.

One ScrollTrigger drives all three — the budget is 2–3 pins per viewport and
this section takes the one for its whole screen.

Full rationale, the measurements behind every number, and the Designer setup
it depends on: .claude/rules/components/cost.md
*/

import './styles/cost.css'
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

const COST = {
  // Scroll the pin consumes. Three beats: curtain, four lines, a last breath.
  pin: '+=325%',
  // Multiplier on DUR.slow for the curtain beat. DUR.slow alone put the
  // curtain at 12% of a 6.3s timeline — the moment that justifies the pin was
  // over in the first eighth. x2 lands it near 22%.
  curtain: 2,
  // Blur each line enters and leaves with, in px.
  blur: 12,
  // How long a line holds before it goes, in seconds.
  hold: 0.5,
  // Overlap between one line leaving and the next arriving. 0 is the only
  // value that keeps "never two lines at once" true — swept against the real
  // timeline, anything above 0 leaves two over opacity 0.01.
  overlap: 0,
  // Photo drift as a share of the band's height. 8% is the ceiling in
  // motion-language.md; the CSS reserves exactly that much overhang.
  parallax: 8,
  // The fourth line stays. If it leaves, the band ends empty and the visitor
  // watches it that way while the pin releases.
  keepLast: true,
}

// See RESPONSIVE.md — pinning needs height, not just width.
const PINNABLE = '(min-width: 768px) and (min-height: 600px)'

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
      const stage = wrapper.querySelector('[data-cost-stage]')
      const intro = wrapper.querySelector('[data-cost-intro]')
      const band = wrapper.querySelector('[data-cost-band]')
      const media = wrapper.querySelector('[data-cost-media]')
      const scrim = wrapper.querySelector('[data-cost-scrim]')
      // MAST's Plain Text is a ComponentInstance and Webflow rejects attributes
      // on those, so the four lines are addressed as the direct children of
      // [data-cost-lines] rather than each carrying its own attribute.
      const linesBox = wrapper.querySelector('[data-cost-lines]')
      const lines = linesBox ? Array.from(linesBox.children) : []

      // Without the stage wrapper there is no curtain: in the published DOM
      // the intro and the band are siblings in normal flow and never overlap,
      // so no tween can make one cover the other.
      if (!stage || !band || !lines.length) return

      // Reduced motion: no pin, no curtain, no blur, no parallax. The CSS for
      // the stage is scoped to no-preference, so the three blocks simply sit
      // in normal flow and everything reads.
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
            // No pin: the lines fade up in sequence, once, and stay. In normal
            // flow there is nothing to replace them with.
            gsap.fromTo(
              lines,
              { opacity: 0, y: DIST.sm },
              {
                opacity: 1,
                y: 0,
                duration: DUR.base,
                ease: EASE.out,
                stagger: STAGGER.loose,
                scrollTrigger: {
                  trigger: band,
                  start: SCROLL.start,
                  once: SCROLL.once,
                  markers: isDev(),
                },
              }
            )
            return
          }

          const blurIn = `blur(${COST.blur}px)`
          const curtainDur = DUR.slow * COST.curtain

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: stage,
              start: 'top top',
              end: COST.pin,
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
              scrub: SCROLL.scrub,
              invalidateOnRefresh: true,
              markers: isDev(),
            },
          })

          // ── Beat 1: the curtain ────────────────────────────────────────
          // The CSS left the band at opacity 0 so there is no flash. The
          // fromTo below applies yPercent: 100 immediately (immediateRender),
          // so by the time this makes it visible it is already off the cell.
          // The initial position is NOT in CSS: a transform there composes
          // with GSAP's own and doubles the distance.
          gsap.set(band, { opacity: 1 })

          tl.fromTo(
            band,
            { yPercent: 100 },
            { yPercent: 0, duration: curtainDur, ease: EASE.soft },
            0
          )

          // The scrim closes with the curtain. The photo enters clean and ends
          // dark enough for the lines to read — measured, the stock MAST scrim
          // leaves the text at 2.74:1 in the p95, under the 3.0:1 WCAG AA asks.
          if (scrim) {
            tl.fromTo(
              scrim,
              { opacity: 0.2 / 0.45 },
              { opacity: 1, duration: curtainDur, ease: EASE.soft },
              0
            )
          }

          // The intro leaves before the band lands, so no frame shows text
          // through the edge of the curtain.
          if (intro) {
            tl.fromTo(
              intro,
              { opacity: 1, scale: 1 },
              {
                opacity: 0,
                scale: 0.96,
                duration: curtainDur * 0.7,
                ease: EASE.soft,
              },
              0
            )
          }

          // The label pins the handoff. With '>' the first line would hang off
          // the last tween added — the intro, which is shorter — and arrive
          // before the curtain had closed.
          tl.addLabel('curtainClosed', curtainDur)

          // ── Beat 2: the lines, one at a time ───────────────────────────
          // Opacity and blur only, no travel, and linear. A scrubbed tween has
          // no duration of its own — its progress is the visitor's scroll — so
          // travel spread across hundreds of pixels reads as the text drifting
          // rather than entering. See statement.js for the measurements. The
          // stacked layout plus the blur is what distinguishes one line
          // replacing another; it does not need direction.
          lines.forEach((line, i) => {
            const isLast = i === lines.length - 1

            tl.fromTo(
              line,
              { opacity: 0, filter: blurIn },
              {
                opacity: 1,
                filter: 'blur(0px)',
                duration: DUR.base,
                ease: EASE.linear,
              },
              i === 0 ? 'curtainClosed' : `>-=${COST.overlap}`
            )

            if (COST.hold > 0) tl.to(line, { duration: COST.hold })

            if (!isLast || !COST.keepLast) {
              tl.to(line, {
                opacity: 0,
                filter: blurIn,
                duration: DUR.base,
                ease: EASE.linear,
              })
            }
          })

          // ── Beat 3: the parallax ───────────────────────────────────────
          // Tied to the pin's progress, not to page scroll: while the section
          // is pinned the scroll does not move it, so a separate trigger would
          // have nothing to run against.
          //
          // The CSS gave the photo PARALLAX% of overhang top and bottom
          // (height: 100 + 2×P). We move ±P% of the BAND's height, which in
          // the PHOTO's own yPercent is P / (1 + 2P/100) — with P=8, ±6.9%.
          // Skip the division and the edge shows.
          if (media && COST.parallax) {
            const p = COST.parallax / (1 + (COST.parallax * 2) / 100)
            tl.fromTo(
              media,
              { yPercent: -p },
              { yPercent: p, duration: tl.duration(), ease: EASE.linear },
              0
            )
          }
        }
      )

      // The photo is lazy and declares no height: when it arrives the document
      // changes and every trigger below it is off. Outside the matchMedia on
      // purpose — it must fire whichever branch is live.
      if (media && !media.complete) {
        media.addEventListener('load', () => ScrollTrigger.refresh(), {
          once: true,
        })
      }
    })
  })
}
