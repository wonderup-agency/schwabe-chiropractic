/*
Component: plan
Webflow attribute: data-component="plan"

The Home's `#plan` section ("Three steps to moving the way you want to again").
On desktop the three steps behave as a scroll-driven accordion inside a pin:
step one is open, and as the visitor scrolls each step hands over to the next.

It is NOT an interactive accordion. There is no control to press, so it ships
no <details>, no button and no aria-expanded — announcing a control that does
not exist is worse than announcing nothing. The copy of all three steps stays
in the DOM at all times; a closed step is clipped, never removed.
*/

import './styles/plan.css'
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
  refreshOrder,
  isDev,
} from '../utils/motion.js'

const LABEL = 'plan'

const PLAN = {
  // Scroll the pin consumes. Five beats (hold, swap, hold, swap, hold) share it.
  pin: '+=160%',
  // Relative length of a beat where one step sits fully open, and of a
  // hand-over. Units are arbitrary — a scrub normalises the timeline to the
  // pin distance — so only their ratio matters.
  hold: 1,
  swap: 1,
  // Where the stage parks. Not `top top`: the nav is sticky and ~70px tall,
  // and a stage flush against it reads as if it collided with the header.
  start: 'top 18%',
  // The steps that are not being read. Low enough to recede, high enough that
  // the copy is still legible to anyone who looks straight at it.
  dim: 0.4,
  // A click on a step scrolls to the point INSIDE the pin where that step is
  // open instead of toggling state directly. That keeps click and scroll as
  // ONE mechanism: no second source of truth to drift out of sync, and the
  // scrub opens the step exactly as it would by hand.
  clickToOpen: true,
  // Pinned only where the grid is still two columns AND there is height for
  // it. 992 and not 768: at `medium` .plan_grid collapses to one column, so
  // media and steps stack and the stage grows past a tablet viewport. The
  // height half is the usual guard — a landscape phone clears 768 wide and
  // has 390px of height, most of which the sticky nav already owns.
  pinnable: '(min-width: 992px) and (min-height: 600px)',
}

/**
 * @param {HTMLElement[]} elements - All elements matching [data-component='plan']
 */
export default function (elements) {
  // Before anything that touches GSAP: a registerPlugin at module scope throws
  // when GSAP is absent and takes the whole module with it.
  const gsap = getGsap(LABEL)
  if (!gsap) return

  const ScrollTrigger = getPlugin('ScrollTrigger', LABEL)
  if (!ScrollTrigger) return
  gsap.registerPlugin(ScrollTrigger)

  elements.forEach((root) => {
    const stage = root.querySelector('[data-plan-stage]')
    const steps = root.querySelector('[data-plan-steps]')
    const stepEls = steps ? [...steps.querySelectorAll('[data-plan-step]')] : []
    const details = stepEls.map((step) =>
      step.querySelector('[data-plan-detail]')
    )

    // Nothing to hand over with fewer than two steps, and a missing detail
    // would collapse a step to nothing. Either way the static markup reads
    // perfectly, so leave it alone.
    if (!stage || !steps || stepEls.length < 2 || details.some((d) => !d)) {
      console.warn(
        `%c⚠️ [${LABEL}] incomplete markup — leaving the section static`,
        'color: #fbbf24; font-weight: bold',
        root
      )
      return
    }

    // The font wait sits OUTSIDE matchMedia: anything created inside a .then()
    // within a matchMedia handler escapes its context and mm.revert() will not
    // revert it. onceLaidOut, never whenLaidOut — the latter fires twice by
    // design, which would build two pins on the same section.
    onceLaidOut(() => {
      const mm = gsap.matchMedia()

      // motionOk is the catch-all here, and it is NOT redundant.
      // gsap.matchMedia() only runs the handler while at least ONE named
      // condition matches. With only `pinnable` and `reduced`, a phone that
      // has not asked for reduced motion matches neither — measured at
      // 390x844, the handler never ran at all and the three steps sat at the
      // CSS `opacity: 0` until the 3s failsafe rescued them. Between motionOk
      // and reduced, one of the two is always true.
      const QUERIES = {
        pinnable: PLAN.pinnable,
        reduced: MQ.reduced,
        motionOk: MQ.motionOk,
      }

      mm.add(QUERIES, (context) => {
        const { pinnable, reduced } = context.conditions

        // A state, not an off switch: every step open, nothing moves, no pin.
        if (reduced) {
          gsap.set(stepEls, { opacity: 1, clearProps: 'transform' })
          gsap.set(details, { opacity: 1, clearProps: 'height' })
          gsap.set(steps, { '--plan-line': 1, clearProps: 'height' })
          return
        }

        // No room to pin: the three steps stay open and simply enter, which
        // is the same treatment Four Things gets. Nothing is ever hidden
        // behind an interaction on a phone.
        if (!pinnable) {
          gsap.set(details, { opacity: 1, clearProps: 'height' })
          gsap.set(steps, { clearProps: 'height' })
          gsap.fromTo(
            stepEls,
            { opacity: 0, y: DIST.sm },
            {
              opacity: 1,
              y: 0,
              duration: DUR.base,
              ease: EASE.out,
              stagger: STAGGER.base,
              scrollTrigger: {
                trigger: steps,
                start: SCROLL.start,
                once: SCROLL.once,
                refreshPriority: refreshOrder(steps),
                markers: isDev(),
              },
            }
          )
          gsap.set(steps, { '--plan-line': 1 })
          return
        }

        // ── The pinned accordion ──────────────────────────────────────

        // Natural heights of the three details, in px. Re-measured on every
        // ScrollTrigger refresh because the copy reflows with the viewport.
        let natural = []

        /**
         * Measure, then LOCK the column.
         *
         * The lock is the whole trick. A scroll-driven accordion that lets
         * its container grow and shrink changes the height of the document
         * underneath the visitor while they scroll, and the scroll position
         * jumps. Fixing the column at "collapsed + the tallest single
         * detail" means the height it needs is the height it always has, so
         * the pin spacer never changes and nothing below it moves.
         *
         * Inline `height: auto` is how the natural size is read back: the
         * collapsed state ships in CSS, so clearing the inline value would
         * just re-apply `height: 0` and measure nothing.
         */
        const measure = () => {
          gsap.set(details, { height: 'auto' })
          natural = details.map((detail) => detail.offsetHeight)
          gsap.set(details, { height: 0, opacity: 0 })
          gsap.set(steps, { height: 'auto' })
          gsap.set(steps, {
            height: steps.offsetHeight + Math.max(...natural),
          })
          // t=0 of the timeline: the first step is the one being read.
          gsap.set(details[0], { height: natural[0], opacity: 1 })
          gsap.set(stepEls, { opacity: PLAN.dim })
          gsap.set(stepEls[0], { opacity: 1 })
        }

        measure()

        const tl = gsap.timeline({
          defaults: { duration: PLAN.swap, ease: EASE.inOut },
          scrollTrigger: {
            trigger: stage,
            start: PLAN.start,
            end: PLAN.pin,
            pin: true,
            scrub: SCROLL.scrub,
            invalidateOnRefresh: true,
            // Not optional. The Home pins `statement` above this and `cost`
            // below it, components load through parallel dynamic imports and
            // each waits on its own font promise, so creation order is a
            // lottery. Higher refreshes sooner (gsap.com — the bundled
            // ScrollTrigger skill states this backwards).
            refreshPriority: refreshOrder(stage),
            // Deliberately absent: anticipatePin. It brings the pin forward
            // by the scroll velocity, and that head start is exactly an
            // overlap with the section above.
            onRefreshInit: measure,
            markers: isDev(),
          },
        })

        for (let i = 1; i < details.length; i += 1) {
          const swap = `swap${i}`
          tl.addLabel(swap, `+=${PLAN.hold}`)
            .to(details[i - 1], { height: 0, opacity: 0 }, swap)
            // Function-based so invalidateOnRefresh picks up the re-measure.
            .to(details[i], { height: () => natural[i], opacity: 1 }, swap)
            .to(stepEls[i - 1], { opacity: PLAN.dim }, swap)
            .to(stepEls[i], { opacity: 1 }, swap)
        }
        // A final beat so the last step is readable before the pin lets go —
        // without it the third step lands on the frame the pin releases.
        tl.to({}, { duration: PLAN.hold })

        // ── Click and keyboard ────────────────────────────────────
        // Now that a step IS operable it has to say so. This is the one
        // place the component departs from "scroll-driven, therefore not a
        // control": there is a real control now, so it gets a real role, a
        // real focus stop and real keyboard handling.
        const cleanups = []
        if (PLAN.clickToOpen) {
          // Scroll position at which each step sits fully open, derived from
          // the timeline so it follows any change to hold/swap.
          const windows = stepEls.map((_, i) => {
            const opens = i === 0 ? 0 : tl.labels[`swap${i}`] + PLAN.swap
            const closes =
              i === stepEls.length - 1
                ? tl.duration()
                : tl.labels[`swap${i + 1}`]
            return (opens + closes) / 2
          })

          const scrollToStep = (i) => {
            const st = tl.scrollTrigger
            if (!st) return
            const at =
              st.start + (windows[i] / tl.duration()) * (st.end - st.start)
            // Native smooth scroll, not ScrollToPlugin — that plugin is not
            // loaded on this site (animations/PLUGINS.md), and the browser's
            // own smooth scroll already honours reduced motion.
            window.scrollTo({ top: at, behavior: 'smooth' })
          }

          stepEls.forEach((step, i) => {
            if (!details[i].id) details[i].id = `plan-step-detail-${i + 1}`
            step.setAttribute('role', 'button')
            step.setAttribute('tabindex', '0')
            step.setAttribute('aria-controls', details[i].id)
            step.setAttribute('aria-expanded', i === 0 ? 'true' : 'false')

            const onClick = () => scrollToStep(i)
            const onKey = (event) => {
              if (event.key !== 'Enter' && event.key !== ' ') return
              event.preventDefault() // Space would scroll the page instead
              scrollToStep(i)
            }
            step.addEventListener('click', onClick)
            step.addEventListener('keydown', onKey)
            cleanups.push(() => {
              step.removeEventListener('click', onClick)
              step.removeEventListener('keydown', onKey)
              ;['role', 'tabindex', 'aria-controls', 'aria-expanded'].forEach(
                (a) => step.removeAttribute(a)
              )
            })
          })

          // aria-expanded has to follow the SCROLL too, not only the click, or
          // a screen reader is told the wrong thing the moment someone scrolls
          // past. One integer compare per frame; the DOM is touched only when
          // the active step actually changes.
          let active = -1
          tl.eventCallback('onUpdate', () => {
            const t = tl.time()
            let next = 0
            for (let i = 1; i < windows.length; i += 1) {
              if (t >= tl.labels[`swap${i}`]) next = i
            }
            if (next === active) return
            active = next
            stepEls.forEach((step, i) =>
              step.setAttribute('aria-expanded', i === next ? 'true' : 'false')
            )
          })
        }

        // The vertical hairline is a ::before on .plan_steps, and a pseudo
        // element is not a GSAP target. Driving a custom property the pseudo
        // reads is the only way in, and the CSS fallback `var(--plan-line,1)`
        // means the line is simply there if this never runs.
        gsap.fromTo(
          steps,
          { '--plan-line': 0 },
          {
            '--plan-line': 1,
            duration: DUR.slow,
            ease: EASE.out,
            scrollTrigger: {
              trigger: steps,
              start: SCROLL.start,
              once: SCROLL.once,
              refreshPriority: refreshOrder(steps),
              markers: isDev(),
            },
          }
        )

        // matchMedia reverts its own tweens and triggers, but the locked
        // height was written with gsap.set() outside any of them.
        return () => {
          cleanups.forEach((fn) => fn())
          gsap.set(steps, { clearProps: 'height' })
          gsap.set(details, { clearProps: 'height' })
        }
      })
    })
  })
}
