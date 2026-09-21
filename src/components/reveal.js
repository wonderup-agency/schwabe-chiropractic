/*
Component: reveal
Webflow attribute: data-component="reveal"

The site's reusable entrance primitive. One component, driven by attributes,
so a new fade or image reveal is an attribute in the Designer rather than a
new file here.

Variants live in BUILDERS below. Five are built:
  mask            — an image reveal whose edge sweeps against the scroll
  words           — word-by-word text entrance (SplitText)
  parallax        — scrubbed drift, hook ON the element that moves
  parallax-media  — the same drift, hook on the CLIPPING CONTAINER instead
  stagger         — direct children entering one by one, once
  rule            — a decorative hairline drawing itself along its long axis

The remaining variants specified in the animate skill's recipes.md (fade,
fade-up/-down/-left/-right, lines, scale-in) drop into BUILDERS without
touching anything else.
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
  refreshOrder,
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

/** True when the element itself clips — what `parallax-media` needs. */
const clipsItself = (el) => {
  const { overflow } = getComputedStyle(el)
  return overflow === 'hidden' || overflow === 'clip' || overflow === 'auto'
}

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
      refreshPriority: refreshOrder(el),
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
      refreshPriority: refreshOrder(el),
      markers: isDev(),
    },
  })
  return split
}

/**
 * Scrubbed drift for large media.
 *
 * Two hooks reach this, and the difference is WHERE the attribute lives:
 *
 *   data-anim="parallax"        the attribute is ON the element that moves,
 *                               and some ANCESTOR has to clip.
 *   data-anim="parallax-media"  the attribute is on the CLIPPING CONTAINER
 *                               and the <img> inside it is what moves.
 *
 * The second one is not a convenience. MAST's `Image` is a ComponentInstance
 * and Webflow refuses attributes on those — verified on the CTA Banner
 * definition, whose 11 props include no `Attribute Name` / `Attribute Value`
 * pair (unlike `Button`). There is literally no way to put a data attribute on
 * that <img>, so the hook has to go on a Block that wraps it.
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
function buildParallax(gsap, el, { media = false } = {}) {
  // `parallax` walks ancestors; `parallax-media` asks the hook itself, because
  // the hook IS the window the photograph moves behind.
  const clipped = media ? clipsItself(el) : isClipped(el)
  if (!clipped) {
    console.warn(
      `%c⚠️ [${LABEL}] ${media ? 'parallax-media needs overflow hidden on itself' : 'parallax needs an ancestor with overflow hidden'} — skipping`,
      'color: #fbbf24; font-weight: bold',
      el
    )
    return null
  }

  const mover = media ? el.querySelector('img') : el
  if (!mover) {
    console.warn(
      `%c⚠️ [${LABEL}] parallax-media found no <img> inside — skipping`,
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
  const trigger = el.closest('section') || el.parentElement

  return gsap.fromTo(
    mover,
    { yPercent: drift },
    {
      yPercent: -drift,
      ease: EASE.linear,
      scrollTrigger: {
        trigger,
        start: 'top bottom',
        end: 'bottom top',
        scrub: SCROLL.scrub,
        invalidateOnRefresh: true,
        refreshPriority: refreshOrder(trigger),
        markers: isDev(),
      },
    }
  )
}

/**
 * Direct children entering one by one, once.
 *
 * The workhorse for anything shaped like a timeline — Four Things, the Plan
 * steps, the Care process band. One ScrollTrigger for the whole group, never
 * one per child.
 *
 * Children that carry their OWN data-anim are skipped, and that is the whole
 * reason this filter exists: `.four_row` has five direct children, not four —
 * the hairline `.four_rule` is a SIBLING of the four `.four_item`s. Without
 * the filter it would animate twice (once here, once as its own `rule`) and,
 * worse, take slot #1 and shift every item by one stagger step.
 *
 * fromTo and not from: reveal.css already ships `opacity: 0` on these
 * children, so a `from()` would read the computed 0 as the END state and
 * animate from nothing to nothing.
 */
function buildStagger(gsap, el) {
  const duration = readToken(el, 'data-anim-duration', DUR, DUR.base)
  const stagger = readToken(el, 'data-anim-stagger', STAGGER, STAGGER.base)
  const distance = readToken(el, 'data-anim-distance', DIST, DIST.sm)
  const delay = readNumber(el, 'data-anim-delay', 0)

  const items = Array.from(el.children).filter(
    (child) => !child.hasAttribute('data-anim')
  )
  if (!items.length) return null

  gsap.set(el, { opacity: 1 })
  return gsap.fromTo(
    items,
    { opacity: 0, y: distance },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease: EASE.out,
      stagger,
      scrollTrigger: {
        trigger: el,
        start: readStart(el),
        once: SCROLL.once,
        refreshPriority: refreshOrder(el),
        markers: isDev(),
      },
    }
  )
}

/**
 * A decorative hairline drawing itself along its long axis.
 *
 * The axis is MEASURED, not declared, and that is deliberate: `Section / Four
 * Things` is ONE component whose `Columns` variant strings the rule
 * horizontally across four columns and whose `Stacked` variant runs it
 * vertically down the side. The attribute lives in the shared definition, so a
 * hardcoded axis would be wrong in one of the two. `data-anim-axis="x|y"`
 * overrides when a rule is close to square.
 *
 * A DEGENERATE box is revealed and skipped, never guessed at. Either
 * dimension being zero means one of two things: the rule is hidden at this
 * breakpoint (0x0), or its geometry has not resolved yet — measured on a
 * vertical rule whose absolute top/bottom insets exceeded its parent, which
 * came back 2x0. `width >= height` then reads 2 >= 0, picks the wrong axis,
 * and scaleX(0) on a 2px-wide rule is invisible FOREVER: a silent failure
 * with no way back. A real rule is long in one direction and thin in the
 * other, never zero in either, so this guard costs nothing.
 */
function buildRule(gsap, el) {
  const { width, height } = el.getBoundingClientRect()
  if (!width || !height) {
    gsap.set(el, { opacity: 1 })
    return null
  }

  const declared = el.getAttribute('data-anim-axis')
  const axis =
    declared === 'x' || declared === 'y'
      ? declared
      : width >= height
        ? 'x'
        : 'y'

  const duration = readToken(el, 'data-anim-duration', DUR, DUR.slow)
  const delay = readNumber(el, 'data-anim-delay', 0)
  const prop = axis === 'x' ? 'scaleX' : 'scaleY'

  gsap.set(el, {
    opacity: 1,
    transformOrigin: axis === 'x' ? 'left center' : 'center top',
    [prop]: 0,
  })

  return gsap.to(el, {
    [prop]: 1,
    duration,
    delay,
    ease: EASE.out,
    scrollTrigger: {
      trigger: el,
      start: readStart(el),
      once: SCROLL.once,
      refreshPriority: refreshOrder(el),
      markers: isDev(),
    },
  })
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
  'parallax-media': ({ gsap, el }) => buildParallax(gsap, el, { media: true }),
  stagger: ({ gsap, el }) => buildStagger(gsap, el),
  rule: ({ gsap, el }) => buildRule(gsap, el),
}

// Variants that cost a frame on every scroll tick, and are therefore capped.
const SCRUBBED = new Set(['parallax', 'parallax-media'])
// Variants that need a real pointer unless data-anim-mobile="on" asks for them.
// The gate is the POINTER, not the width. The reason parallax is off on phones
// is that on touch it fights the system scroll and costs frames where there are
// fewest to spare — and a landscape phone is 844px wide, so a width gate of
// 767px lets it straight through. Measured 2026-09-15 at 844x390: three
// triggers instead of two.
const POINTER_ONLY = new Set(['parallax', 'parallax-media'])

/**
 * Put an element and anything it hid back on screen.
 *
 * `opacity: 0` does not always live on the hook: `stagger` hides its direct
 * CHILDREN, so revealing only the hook would leave the whole group invisible
 * on a skip or a throw. Every early exit goes through here.
 */
function reveal(gsap, el) {
  gsap.set(el, { opacity: 1 })
  if (el.getAttribute('data-anim') === 'stagger' && el.children.length) {
    gsap.set(Array.from(el.children), { opacity: 1, clearProps: 'transform' })
  }
}

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
          reveal(gsap, el)
          return
        }

        try {
          build({ gsap, SplitText, el, splits })
        } catch (error) {
          // One malformed element must not take the rest of the page with it.
          console.error(`[${LABEL}] failed on`, el, error)
          reveal(gsap, el)
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
      // Same reason as reveal(): `stagger` hides children, not itself.
      targets
        .filter((el) => el.getAttribute('data-anim') === 'stagger')
        .forEach((el) =>
          gsap.set(Array.from(el.children), {
            opacity: 1,
            clearProps: 'transform',
          })
        )
    })
  })
}
