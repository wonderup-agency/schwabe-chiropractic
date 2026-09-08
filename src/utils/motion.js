/*
Motion tokens — the shared vocabulary every animation on this site uses.

Nothing here animates anything. It holds the numbers and the runtime guards,
so two animations written months apart still feel like the same site. Import
the tokens; never retype a duration, an ease or a distance.

GSAP is NOT bundled — it is loaded on the Webflow site itself (MAST's Custom
Code embed). Every consumer goes through getGsap() / getPlugin() so a missing
library degrades to "no animation" instead of a thrown error that takes the
rest of the page down with it.
*/

// ── Media queries ────────────────────────────────────────────────────
// Mirror Webflow's breakpoints. Pass these to gsap.matchMedia() rather than
// writing query strings inline — matchMedia reverts its own tweens and
// listeners when a query stops matching, which is why components that scope
// animation this way don't need a resize hook.
export const MQ = {
  desktop: '(min-width: 992px)',
  tabletDown: '(max-width: 991px)',
  mobileDown: '(max-width: 767px)',
  reduced: '(prefers-reduced-motion: reduce)',
  motionOk: '(prefers-reduced-motion: no-preference)',
  // Real pointer only — hover animations must never bind on touch, where
  // "hover" fires on tap and leaves the element stuck in its hover state.
  hover: '(hover: hover) and (pointer: fine)',
}

// ── Durations (seconds) ──────────────────────────────────────────────
export const DUR = {
  instant: 0.15, // feedback that must feel like a direct response
  quick: 0.25, // hovers, carets, small state flips
  base: 0.5, // the default for anything with no reason to differ
  slow: 0.8, // reveals of large elements, image masks
  hero: 1.1, // the one big gesture per page, on load only
}

// ── Eases ────────────────────────────────────────────────────────────
// No bounce, no elastic, no overshoot anywhere on this site. It's a health
// practice: motion should read as calm and competent, not playful.
export const EASE = {
  out: 'power2.out', // default for entrances — decisive, settles clean
  in: 'power2.in', // exits, things leaving the screen
  inOut: 'power2.inOut', // state changes and layout moves (Flip, tabs)
  soft: 'power1.out', // opacity-only fades, parallax, anything scrubbed
  expo: 'expo.out', // reserved for the hero — very fast, very long tail
  linear: 'none', // scrub-driven values and marquees only
}

// ── Travel distances (px) ────────────────────────────────────────────
// Travel is a hint of direction, not a journey. If an element needs to cross
// the screen to be noticed, the problem is the layout, not the animation.
export const DIST = {
  sm: 12, // text lines, list items, small cards
  md: 24, // cards, media, section headers
  lg: 48, // full-width blocks, the hero only
}

// ── Stagger (seconds between siblings) ───────────────────────────────
export const STAGGER = {
  tight: 0.04, // split text lines/words — must read as one gesture
  base: 0.08, // cards, list items
  loose: 0.14, // 2–3 large elements where each deserves a beat
}

// ── ScrollTrigger defaults ───────────────────────────────────────────
export const SCROLL = {
  // Fires once the element is meaningfully in view, not the instant its top
  // edge crosses the fold — animating at "top bottom" means the visitor
  // watches it happen at the very edge of their vision and misses it.
  start: 'top 85%',
  // Cheap insurance: a reveal that would otherwise never fire because its
  // trigger sits below the document's last scrollable pixel.
  startLate: 'top 95%',
  // Never `scrub: true` — it ties the tween 1:1 to the wheel and reads as
  // twitchy. A ~1s catch-up is what makes scrubbing feel expensive.
  scrub: 1,
  // Entrances run once. Re-animating on scroll-back reads as a broken page,
  // not as delight.
  once: true,
}

// ── Runtime guards ───────────────────────────────────────────────────

function warn(label, message) {
  console.warn(
    `%c⚠️ [${label}] ${message}`,
    'color: #fbbf24; font-weight: bold'
  )
}

/**
 * GSAP, or null with a warning. Always branch on the result.
 * @param {string} label - Component name, for the console message
 */
export function getGsap(label) {
  const gsap = window.gsap
  if (!gsap) {
    warn(label, 'GSAP not found on window — leaving static markup in place')
    return null
  }
  return gsap
}

/**
 * A GSAP plugin off window, or null with a warning. Plugins live in the
 * Webflow embed, so availability is a runtime fact, not a build-time one —
 * never assume one is there.
 * @param {string} name - Global name, e.g. 'ScrollTrigger', 'SplitText'
 * @param {string} label - Component name, for the console message
 */
export function getPlugin(name, label) {
  const plugin = window[name]
  if (!plugin) {
    warn(label, `${name} is not loaded on the Webflow site — skipping`)
    return null
  }
  return plugin
}

/** The Lenis instance created in global.js, or null if smooth scroll is off. */
export function getLenis() {
  return window.__lenis || null
}

/** True when the visitor asked for less motion. Read live, never cached. */
export function prefersReduced() {
  return window.matchMedia(MQ.reduced).matches
}

/**
 * True in dev mode (Shift+D on Webflow staging). Use it to gate
 * ScrollTrigger markers so they can never reach production.
 */
export function isDev() {
  try {
    return !!localStorage.dev
  } catch {
    return false // Safari private mode throws on localStorage access
  }
}

/**
 * Safety net for the anti-FOUC CSS.
 *
 * Initial states are hidden in CSS (`[data-anim] { opacity: 0 }`) because
 * `dist/styles.css` is a blocking stylesheet and therefore applies before the
 * first paint, while GSAP arrives several frames later. The cost of that is a
 * real failure mode: if GSAP never loads, or a selector typo means an element
 * is never bound, the content stays invisible forever.
 *
 * So: arm this once from global.js. After `ms`, it stamps a class on <html>
 * that unhides everything. It never needs disarming — GSAP writes an inline
 * opacity on every element it binds, and an inline style always beats a class
 * rule, so elements that ARE animating keep their state and only the orphans
 * get revealed.
 *
 * @param {number} ms - Grace period before revealing. Long enough for a slow
 *   3G first paint, short enough that nobody reads the page without it.
 */
export function armFoucFailsafe(ms = 3000) {
  window.setTimeout(() => {
    document.documentElement.classList.add('anim-failsafe')
  }, ms)
}

/**
 * Runs fn once webfonts have loaded and the page has settled, then again
 * after any late layout shift. Split text and pinned sections measure the
 * DOM, and a font swapping in after measurement puts every trigger in the
 * wrong place — this is the fix for "the animation fires too early on a
 * hard refresh".
 * @param {() => void} fn
 */
export function whenLaidOut(fn) {
  const run = () => fn()
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(run)
  } else {
    run()
  }
  if (document.readyState !== 'complete') {
    window.addEventListener('load', run, { once: true })
  }
}
