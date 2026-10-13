/*
Component: plan
Webflow attribute: data-component="plan"

The Home's `#plan` section ("Three steps to moving the way you want to again").
On desktop all three steps are fully open. The step nearest the middle of the
screen is highlighted and the other two are dimmed but readable; the highlight
moves 1 → 2 → 3 as the page scrolls normally. The photo stays sticky beside the
steps. Clicking a step highlights it too.

Until 2026-10-13 this was a scroll-driven accordion inside a pin. Derek
(Pastel #6) kept the one-step-at-a-time highlight and asked to drop the pin,
so the page always scrolls normally. Nothing is collapsed any more: the copy
of all three steps is always visible.
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
  // The steps that are not being read. Derek: "dimmed but still readable".
  dim: 0.45,
  // How fast the highlight hands over. A state change, not a reveal.
  swap: 0.35,
  // Only where the grid is still two columns AND there is height for the
  // sticky photo. At `medium` .plan_grid collapses to one column and the
  // three steps simply enter, like on a phone.
  highlight: '(min-width: 992px) and (min-height: 600px)',
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

    /*
     * What the dim is applied to, and why it is NOT the step.
     *
     * `.plan-step_num` is an 80px disc filled with the SAME Forest Green as
     * the section, sitting on top of the vertical rule. It reads as nothing
     * at all — its whole job is to mask the rule where it would cross the
     * numeral, which is how the Figma draws the gaps.
     *
     * Dimming the step dims that disc too, and a 40%-opaque mask stops
     * masking: the rule reappears straight through the 2 and the 3, which is
     * exactly what got reported. So the dim goes on the copy and the numeral
     * stays opaque — which also matches the Figma, where all three numerals
     * are equally present.
     *
     * Falls back to the step if the hook is missing, so a copy of this
     * markup without `data-plan-body` still dims rather than doing nothing.
     */
    const bodies = stepEls.map((step) => step.querySelector('[data-plan-body]'))
    const dimTargets = bodies.every(Boolean) ? bodies : stepEls

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
    // design, which would bind every trigger twice.
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
        pinnable: PLAN.highlight,
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

        // ── The highlight ─────────────────────────────────────────────
        // Every step open and in flow; only the dim moves. Nothing changes
        // height, so nothing below the section ever shifts.
        gsap.set(details, { opacity: 1, clearProps: 'height' })
        gsap.set(steps, { clearProps: 'height' })

        let active = -1
        const setActive = (next, instant = false) => {
          if (next === active) return
          active = next
          dimTargets.forEach((el, i) => {
            gsap.to(el, {
              opacity: i === next ? 1 : PLAN.dim,
              duration: instant ? 0 : PLAN.swap,
              ease: EASE.inOut,
              overwrite: true,
            })
          })
          stepEls.forEach((step, i) =>
            step.toggleAttribute('data-plan-active', i === next)
          )
        }

        // The steps enter once, like everywhere else on the site.
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
        setActive(0, true)

        // "The step nearest the middle of the screen": each step owns the
        // band where it crosses the viewport's centre line. Plain toggles, no
        // scrub — the scroll is never held or slowed.
        stepEls.forEach((step, i) => {
          ScrollTrigger.create({
            trigger: step,
            start: 'top 55%',
            end: 'bottom 55%',
            refreshPriority: refreshOrder(steps),
            onToggle: (self) => {
              if (self.isActive) setActive(i)
            },
            markers: isDev(),
          })
        })

        // ── Click and keyboard ────────────────────────────────────
        // A step is now a real control (it changes the highlight), so it gets
        // a role, a focus stop and keyboard handling. aria-pressed rather than
        // aria-expanded: nothing opens, the copy is always visible.
        const cleanups = []
        stepEls.forEach((step, i) => {
          step.setAttribute('role', 'button')
          step.setAttribute('tabindex', '0')
          const onClick = () => setActive(i)
          const onKey = (event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return
            event.preventDefault() // Space would scroll the page instead
            setActive(i)
          }
          step.addEventListener('click', onClick)
          step.addEventListener('keydown', onKey)
          cleanups.push(() => {
            step.removeEventListener('click', onClick)
            step.removeEventListener('keydown', onKey)
            ;['role', 'tabindex', 'data-plan-active'].forEach((a) =>
              step.removeAttribute(a)
            )
          })
        })

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

        return () => {
          cleanups.forEach((fn) => fn())
          gsap.set(dimTargets, { clearProps: 'opacity' })
        }
      })
    })
  })
}
