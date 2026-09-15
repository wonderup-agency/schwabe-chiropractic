/*
Component: reveal
Webflow attribute: data-component="reveal"

The site's reusable entrance primitive. One component, driven by attributes,
so a new fade or image reveal is an attribute in the Designer rather than a
new file here.

Variants live in BUILDERS below. Three are built:
  mask      — an image reveal whose edge sweeps against the scroll
  words     — word-by-word text entrance (SplitText)
  parallax  — scrubbed drift for large media

The remaining variants specified in the animate skill's recipes.md (fade,
fade-up/-down/-left/-right, stagger, lines, scale-in) drop into BUILDERS
without touching anything else.
*/

import './styles/reveal.css'
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

const LABEL = 'reveal'

const REVEAL = {
  // Vertical slack the CSS reserves above and below a parallax image, as a
  // percentage of its container. MUST match --anim-parallax-slack in
  // reveal.css: the drift maths divides by it.
  slack: 10,
  // Ceiling on data-anim-speed. motion-language.md caps parallax at ±8% of
  // element height — past that it reads as an effect instead of as depth.
  maxSpeed: 0.08,
  // Scale the photograph starts at under a mask, so it settles as the edge
  // sweeps. 1 turns the settle off and the photograph holds perfectly still.
  settle: 1.06,
  // Scrubbed triggers are the expensive kind and this component is applied
  // from the Designer, so it is easy to blow the budget without noticing.
  scrubBudget: 3,
}

// ── Attribute readers ────────────────────────────────────────────────

const readNumber = (el, attr, fallback) => {
  const raw = el.getAttribute(attr)
  const n = raw === null ? NaN : parseFloat(raw)
  return Number.isFinite(n) ? n : fallback
}

const readToken = (el, attr, map, fallback) => {
  const key = el.getAttribute(attr)
  return key !== null && key in map ? map[key] : fallback
}

const readStart = (el) => el.getAttribute('data-anim-start') || SCROLL.start

/** True when some ancestor actually clips, which parallax and mask both need. */
const isClipped = (el) => {
  let node = el.parentElement
  while (node && node !== document.body) {
    const { overflow } = getComputedStyle(node)
    if (overflow === 'hidden' || overflow === 'clip' || overflow === 'auto') {
      return true
    }
    node = node.parentElement
  }
  return false
}

// ── Variants ─────────────────────────────────────────────────────────

/**
 * The mask reveal.
 *
 * The element is the window and must clip. An inner layer slides up from
 * below while the image inside it counter-moves by exactly the same amount,
 * so the two transforms cancel: the photograph holds still and only the
 * revealing edge travels — upward, against the scroll. Transform only, so it
 * stays on the compositor.
 *
 * Measured 2026-09-15: photograph drift 0.0px with settle off, 16.8px with
 * the 1.06 settle. A partial counter (0.65) drifted 195.7px — four times
 * DIST.lg, which motion-language.md rules out as a journey rather than a
 * hint of direction.
 *
 * Without an inner layer there is nothing to counter-move, so it falls back
 * to clip-path on the element itself. That branch repaints the clipped region
 * every frame; it exists so the variant also works on plain blocks.
 */
function buildMask(gsap, el) {
  const duration = readToken(el, 'data-anim-duration', DUR, DUR.slow)
  const delay = readNumber(el, 'data-anim-delay', 0)
  const img = el.querySelector('img')
  const mover = img && img.parentElement !== el ? img.parentElement : null

  const tl = gsap.timeline({
    defaults: { duration, ease: EASE.out },
    delay,
    scrollTrigger: {
      trigger: el,
      start: readStart(el),
      once: SCROLL.once,
      markers: isDev(),
    },
  })

  if (mover) {
    gsap.set(el, { opacity: 1 })
    gsap.set(mover, { yPercent: 100 })
    gsap.set(img, { yPercent: -100, scale: REVEAL.settle })
    tl.to(mover, { yPercent: 0 }, 0).to(img, { yPercent: 0, scale: 1 }, 0)
  } else {
    gsap.set(el, { opacity: 1, clipPath: 'inset(100% 0% 0% 0%)' })
    tl.to(el, { clipPath: 'inset(0% 0% 0% 0%)' }, 0)
    if (img) {
      gsap.set(img, { y: -DIST.lg })
      tl.to(img, { y: 0 }, 0)
    }
  }
  return tl
}

/**
 * Word-by-word text entrance.
 *
 * `aria` stays at its default 'auto', which puts an aria-label carrying the
 * whole sentence on the container and aria-hidden on every word — a screen
 * reader reads the sentence, not N fragments.
 *
 * The returned SplitText instance is collected by the caller: mm.revert()
 * undoes tweens and triggers, but the split rewrote the DOM and only the
 * stored instance can undo that.
 */
function buildWords(gsap, SplitText, el) {
  const duration = readToken(el, 'data-anim-duration', DUR, DUR.base)
  const stagger = readToken(el, 'data-anim-stagger', STAGGER, STAGGER.tight)
  const distance = readToken(el, 'data-anim-distance', DIST, DIST.sm)
  const delay = readNumber(el, 'data-anim-delay', 0)

  const split = SplitText.create(el, { type: 'words' })

  gsap.set(el, { opacity: 1 })
  gsap.from(split.words, {
    opacity: 0,
    y: distance,
    duration,
    delay,
    ease: EASE.out,
    stagger,
    scrollTrigger: {
      trigger: el,
      start: readStart(el),
      once: SCROLL.once,
      markers: isDev(),
    },
  })
  return split
}

/**
 * Scrubbed drift for large media.
 *
 * reveal.css gives the image REVEAL.slack% of overflow above and below, so
 * its height is (100 + 2*slack)% of its container. Moving it by S% of the
 * CONTAINER therefore means a yPercent on the IMAGE of S / (1 + 2*slack/100).
 * Skip that division and the image edge shows — measured on cost.js, and
 * measured again here when a specificity tie let MAST's `inset: 0` win and
 * left seams of 38 and 46px.
 *
 * A scrub with short travel is banned by motion-language.md; a parallax is
 * the explicitly exempted case — a long, deliberate journey.
 */
function buildParallax(gsap, el) {
  if (!isClipped(el)) {
    console.warn(
      `%c⚠️ [${LABEL}] parallax needs an ancestor with overflow hidden — skipping`,
      'color: #fbbf24; font-weight: bold',
      el
    )
    return null
  }

  const speed = Math.min(
    readNumber(el, 'data-anim-speed', REVEAL.maxSpeed),
    REVEAL.maxSpeed
  )
  const drift = (speed * 100) / (1 + (2 * REVEAL.slack) / 100)

  return gsap.fromTo(
    el,
    { yPercent: drift },
    {
      yPercent: -drift,
      ease: EASE.linear,
      scrollTrigger: {
        trigger: el.closest('section') || el.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: SCROLL.scrub,
        invalidateOnRefresh: true,
        markers: isDev(),
      },
    }
  )
}

// ── Registry ─────────────────────────────────────────────────────────

const BUILDERS = {
  mask: ({ gsap, el }) => buildMask(gsap, el),
  words: ({ gsap, SplitText, el, splits }) => {
    if (!SplitText) return null
    splits.push(buildWords(gsap, SplitText, el))
    return null
  },
  parallax: ({ gsap, el }) => buildParallax(gsap, el),
}

// Variants that cost a frame on every scroll tick, and are therefore capped.
const SCRUBBED = new Set(['parallax'])
// Variants that need a real pointer unless data-anim-mobile="on" asks for them.
// The gate is the POINTER, not the width. The reason parallax is off on phones
// is that on touch it fights the system scroll and costs frames where there are
// fewest to spare — and a landscape phone is 844px wide, so a width gate of
// 767px lets it straight through. Measured 2026-09-15 at 844x390: three
// triggers instead of two.
const POINTER_ONLY = new Set(['parallax'])

/**
 * @param {HTMLElement[]} elements - All elements matching [data-component='reveal']
 */
export default function (elements) {
  // The guard goes before the first line that touches GSAP. A registerPlugin
  // at module scope throws a ReferenceError when GSAP is absent and aborts the
  // whole module — including, on other pages, the failsafe that exists for
  // exactly that case.
  const gsap = getGsap(LABEL)
  if (!gsap) return

  const ScrollTrigger = getPlugin('ScrollTrigger', LABEL)
  if (!ScrollTrigger) return
  gsap.registerPlugin(ScrollTrigger)

  // SplitText is optional: only the `words` variant needs it, so a site
  // without it still gets masks and parallax.
  const SplitText = window.SplitText || null
  if (SplitText) gsap.registerPlugin(SplitText)

  const targets = elements.flatMap((el) => [
    ...el.querySelectorAll('[data-anim]'),
  ])
  if (!targets.length) return

  if (isDev()) {
    const scrubbed = targets.filter((el) =>
      SCRUBBED.has(el.getAttribute('data-anim'))
    ).length
    if (scrubbed > REVEAL.scrubBudget) {
      console.warn(
        `%c⚠️ [${LABEL}] ${scrubbed} scrubbed instances on this page — the budget is ${REVEAL.scrubBudget}`,
        'color: #fbbf24; font-weight: bold'
      )
    }
  }

  // The font wait sits OUTSIDE matchMedia on purpose: anything created inside
  // a .then() that lives within a matchMedia handler escapes that context and
  // mm.revert() will not revert it. onceLaidOut and not whenLaidOut — the
  // latter runs its callback twice by design, which builds everything twice.
  onceLaidOut(() => {
    const mm = gsap.matchMedia()

    mm.add(MQ.motionOk, () => {
      const splits = []
      const isMobile = window.matchMedia(MQ.mobileDown).matches
      const hasPointer = window.matchMedia(MQ.hover).matches

      targets.forEach((el) => {
        const variant = el.getAttribute('data-anim')
        const build = BUILDERS[variant]
        if (!build) return

        const mobileFlag = el.getAttribute('data-anim-mobile')
        const skip =
          mobileFlag === 'on'
            ? false
            : (isMobile && mobileFlag === 'off') ||
              (POINTER_ONLY.has(variant) && !hasPointer)

        if (skip) {
          gsap.set(el, { opacity: 1 })
          return
        }

        try {
          build({ gsap, SplitText, el, splits })
        } catch (error) {
          // One malformed element must not take the rest of the page with it.
          console.error(`[${LABEL}] failed on`, el, error)
          gsap.set(el, { opacity: 1 })
        }
      })

      return () => splits.forEach((split) => split.revert())
    })

    // A state, not an off switch: same end state, nothing moves.
    mm.add(MQ.reduced, () => {
      gsap.set(targets, {
        opacity: 1,
        clearProps: 'transform,clipPath',
      })
    })
  })
}
