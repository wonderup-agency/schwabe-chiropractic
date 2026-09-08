/*
Component: nav
Webflow attribute: data-component="nav"

Takes over the visual side of MAST's Webflow dropdowns so they open with
hover intent and a directional cross-fade instead of Webflow's hard
display toggle. Webflow keeps owning its own `w--open` class — we never
read it; an inline `display` written by GSAP always beats the class rule,
so the two systems don't fight.

Also owns the nav's scrolled state: past SCROLLED.threshold px of scroll a
solid surface and a bottom hairline fade in. The nav keeps its height.
The dropdown behaviour is desktop-only; the scrolled state runs everywhere.
*/

import './styles/nav.css'
import { DUR, EASE, MQ, getGsap } from '../utils/motion.js'

// Dropdown timings. Component-specific tuning, so they stay local instead of
// living in motion.js — mirrors the reference's object, scaled down for a
// per-item dropdown instead of one shared morphing container.
const PANEL = {
  panelIn: 0.32,
  panelOut: 0.2,
  linksIn: 0.3,
  stagger: 0.035,
  caret: 0.25,
}

const HOVER_ENTER = 120 // ms of intent before the first panel opens
const HOVER_LEAVE = 150 // ms of grace before closing on mouse-out

const SHIFT = 10 // px of sideways travel when switching between panels
const DROP = 6 // px the panel falls in from on a cold open

// Scrolled state. Values picked in playground/nav-scroll-state on 2026-09-08.
const SCROLLED = {
  threshold: 40, // px of scroll before the state flips
  exitSpeed: 1.4, // the exit runs faster than the entrance
}

/**
 * @param {HTMLElement[]} elements - All elements matching [data-component='nav']
 */
export default function (elements) {
  const gsap = getGsap('nav')
  if (!gsap) return

  elements.forEach((nav) => initNav(nav, gsap))
}

// ── Setup ────────────────────────────────────────────────────────────

function collectDropdowns(nav) {
  return (
    Array.from(nav.querySelectorAll('.nav-dropdown'))
      .map((root) => {
        const toggle = root.querySelector('.w-dropdown-toggle')
        const panel = root.querySelector('.w-dropdown-list')
        if (!toggle || !panel) return null

        return {
          root,
          toggle,
          panel,
          caret: root.querySelector('.nav-dropdown_arrow'),
          links: Array.from(panel.querySelectorAll('a')),
        }
      })
      .filter(Boolean)
      // Drop anything not actually rendered. MAST ships an unused mega
      // dropdown that is toggled off; a hidden panel must not occupy a slot
      // in the index the directional animation is derived from.
      .filter((d) => d.toggle.getClientRects().length > 0)
  )
}

function initNav(nav, gsap) {
  const mm = gsap.matchMedia()

  // Dropdowns — desktop only, and only if this nav has any.
  if (nav.querySelector('.nav-dropdown')) {
    mm.add({ isDesktop: MQ.desktop, reduce: MQ.reduced }, (context) => {
      const { isDesktop, reduce } = context.conditions
      if (!isDesktop) return

      // Collected here rather than at init: the query only matches once the
      // desktop menu is laid out, which is what makes the hidden-dropdown
      // filter above trustworthy.
      const dropdowns = collectDropdowns(nav)
      if (!dropdowns.length) return

      return bindDesktop({ nav, dropdowns, gsap, reduce })
    })
  }

  // Scrolled state — every width. A transparent nav over content is
  // unreadable on mobile too, and nothing here is width-dependent.
  mm.add({ reduce: MQ.reduced, ok: MQ.motionOk }, (context) => {
    const { reduce } = context.conditions
    return bindScrolledState({ nav, gsap, reduce })
  })
}

// ── Scrolled state ───────────────────────────────────────────────────
/*
Past SCROLLED.threshold px of scroll, a solid surface and a bottom hairline
fade in. Nothing else: the nav keeps its height.

The surface never animates `background-color`. It is a separate layer holding
the token, animated with `opacity` — compositor only. Animating the colour
would mean hardcoding a hex, and the real token is
`light-dark(Brand/Beige, Brand/Ink)`.

The trigger is an IntersectionObserver over a sentinel rather than a
ScrollTrigger: it costs nothing per frame, it doesn't depend on a plugin that
isn't confirmed present in MAST's embed, and IO's initial callback resolves a
mid-page refresh for free without animating.

If a height change is ever wanted back, it must NOT animate height or padding.
`.nav` is `position: sticky`, so it sits in the document flow: shortening it
shortens the document and pushes everything below up by the same amount — a
visible jump and a real CLS hit, because scroll-driven shifts aren't exempt the
way post-click ones are. The way that worked was two transforms — `y: -drop` on
`.nav` so the box rises, and `y: +drop/2` on its inner container so the content
re-centres in the shorter bar. See playground/nav-scroll-state.
*/
function bindScrolledState({ nav, gsap, reduce }) {
  const duration = reduce ? 0 : DUR.slow

  // DOM order decides paint order between siblings sharing a z-index, so the
  // surface goes in first and the hairline sits on top of it.
  const bg = document.createElement('div')
  bg.setAttribute('data-nav-bg', '')
  const line = document.createElement('div')
  line.setAttribute('data-nav-line', '')
  nav.prepend(line)
  nav.prepend(bg)

  const sentinel = document.createElement('div')
  sentinel.setAttribute('data-nav-sentinel', '')
  sentinel.style.height = SCROLLED.threshold + 'px'
  document.body.appendChild(sentinel)

  // The colour inversion is opt-in from CSS: if nav.css doesn't define these
  // custom properties there is nothing to invert and no tween gets built.
  // Reading them is also why the values must be plain hex — a `light-dark()`
  // comes back from getComputedStyle unresolved, which GSAP can't animate.
  const css = window.getComputedStyle(nav)
  const textScrolled = css.getPropertyValue('--nav-text-scrolled').trim()

  const cta = nav.querySelector('[data-nav-cta]')
  const ctaBg = css.getPropertyValue('--nav-cta-bg-scrolled').trim()
  const ctaText = css.getPropertyValue('--nav-cta-text-scrolled').trim()
  const invertCta = cta && ctaBg && ctaText

  // Nothing here measures the DOM, so there is no need to wait for webfonts
  // and no resize listener: a width change can't invalidate any of it.
  gsap.set(bg, { opacity: 0 })
  gsap.set(line, { scaleX: 0 })

  const tl = gsap.timeline({ paused: true })
  tl.to(bg, { opacity: 1, duration, ease: EASE.soft }, 0)
  // Grows from the centre out, slightly slower so it lands last.
  tl.to(line, { scaleX: 1, duration: duration * 1.1, ease: EASE.out }, 0)

  if (textScrolled) {
    tl.to(nav, { color: textScrolled, duration, ease: EASE.soft }, 0)
  }
  if (invertCta) {
    tl.to(
      cta,
      { backgroundColor: ctaBg, color: ctaText, duration, ease: EASE.soft },
      0
    )
  }

  let scrolled = false
  let primed = false

  function apply(next) {
    if (primed && next === scrolled) return
    scrolled = next
    // IO's first callback settles the initial state instantly: a refresh
    // half-way down the page must not animate.
    if (!primed) {
      primed = true
      tl.progress(next ? 1 : 0).pause()
      return
    }
    if (next) tl.timeScale(1).play()
    else tl.timeScale(SCROLLED.exitSpeed).reverse()
  }

  const io = new IntersectionObserver(([entry]) => apply(!entry.isIntersecting))
  io.observe(sentinel)

  // matchMedia reverts its own tweens; the nodes are ours.
  return () => {
    io.disconnect()
    tl.kill()
    gsap.set(nav, { clearProps: 'color' })
    if (cta) gsap.set(cta, { clearProps: 'backgroundColor,color' })
    sentinel.remove()
    line.remove()
    bg.remove()
  }
}

// ── Desktop behaviour ────────────────────────────────────────────────

function bindDesktop({ nav, dropdowns, gsap, reduce }) {
  // prefers-reduced-motion collapses every duration to 0 and removes the
  // directional travel, so state still changes but nothing moves.
  const t = (value) => (reduce ? 0 : value)
  const shift = reduce ? 0 : SHIFT
  const drop = reduce ? 0 : DROP

  let openIndex = -1
  let enterTimer = null
  let leaveTimer = null

  const listeners = []
  const on = (target, type, fn, options) => {
    target.addEventListener(type, fn, options)
    listeners.push([target, type, fn, options])
  }

  const parts = (d) => [d.panel, d.caret, ...d.links].filter(Boolean)

  function clearTimers() {
    clearTimeout(enterTimer)
    clearTimeout(leaveTimer)
    enterTimer = leaveTimer = null
  }

  function hide(d) {
    gsap.set(d.panel, { display: 'none', clearProps: 'opacity,transform' })
    gsap.set(d.links, { clearProps: 'opacity,transform' })
    if (d.caret) gsap.set(d.caret, { rotation: 0 })
    d.toggle.setAttribute('aria-expanded', 'false')
  }

  function reset() {
    dropdowns.forEach((d) => {
      gsap.killTweensOf(parts(d))
      hide(d)
    })
    openIndex = -1
  }

  // `direction` is -1, 0 or 1 — the axis the panel leaves along.
  function closePanel(d, direction) {
    gsap.killTweensOf(parts(d))
    d.toggle.setAttribute('aria-expanded', 'false')

    const tl = gsap.timeline({ defaults: { ease: 'power2.in' } })
    tl.to(
      d.panel,
      {
        opacity: 0,
        x: direction * shift,
        y: direction ? 0 : -4,
        duration: t(PANEL.panelOut),
      },
      0
    )
    if (d.caret) {
      tl.to(d.caret, { rotation: 0, duration: t(PANEL.caret) }, 0)
    }
    tl.add(() => hide(d))
  }

  function open(index) {
    if (index === openIndex) return

    const d = dropdowns[index]
    const previous = openIndex >= 0 ? dropdowns[openIndex] : null
    // 0 on a cold open (drop down), ±1 when moving between siblings.
    const direction = previous ? Math.sign(index - openIndex) : 0

    if (previous) closePanel(previous, -direction)

    gsap.killTweensOf(parts(d))
    openIndex = index
    d.toggle.setAttribute('aria-expanded', 'true')

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.set(d.panel, { display: 'block' })
    tl.fromTo(
      d.panel,
      { opacity: 0, x: direction * shift, y: direction ? 0 : -drop },
      { opacity: 1, x: 0, y: 0, duration: t(PANEL.panelIn) },
      0
    )

    if (d.links.length) {
      tl.fromTo(
        d.links,
        { opacity: 0, x: direction * shift, y: direction ? 0 : drop },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: t(PANEL.linksIn),
          stagger: t(PANEL.stagger),
          // Hand opacity back to .nav-link so its own value resumes.
          clearProps: 'opacity,transform',
        },
        direction ? 0.04 : 0.06
      )
    }

    if (d.caret) {
      tl.to(d.caret, { rotation: 180, duration: t(PANEL.caret) }, 0)
    }
  }

  function close() {
    if (openIndex < 0) return
    closePanel(dropdowns[openIndex], 0)
    openIndex = -1
  }

  // ── Hover intent ───────────────────────────────────────────────────
  // Bound on .nav-dropdown, which wraps both the toggle and the panel,
  // so travelling from the label into the menu never counts as a leave.

  function handleEnter(index) {
    clearTimeout(leaveTimer)
    leaveTimer = null
    clearTimeout(enterTimer)
    // Once something is open, switching is immediate — the delay only
    // guards against opening a menu the user is passing over.
    enterTimer = setTimeout(() => open(index), openIndex >= 0 ? 0 : HOVER_ENTER)
  }

  function handleLeave() {
    clearTimeout(enterTimer)
    enterTimer = null
    leaveTimer = setTimeout(close, HOVER_LEAVE)
  }

  // ── Keyboard ───────────────────────────────────────────────────────

  function focusFirstLink(d) {
    if (d.links.length) d.links[0].focus()
  }

  function handleToggleKeydown(event, index) {
    const d = dropdowns[index]

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      clearTimers()
      if (openIndex === index) {
        close()
      } else {
        open(index)
        focusFirstLink(d)
      }
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      clearTimers()
      open(index)
      focusFirstLink(d)
    }
  }

  function handlePanelKeydown(event, index) {
    const { links, toggle } = dropdowns[index]
    if (!links.length) return

    const current = links.indexOf(document.activeElement)
    if (current < 0) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      links[(current + 1) % links.length].focus()
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (current === 0) toggle.focus()
      else links[current - 1].focus()
    }
  }

  function handleEscape(event) {
    if (event.key !== 'Escape' || openIndex < 0) return
    const { toggle } = dropdowns[openIndex]
    clearTimers()
    close()
    toggle.focus()
  }

  function handleDocumentClick(event) {
    if (openIndex < 0) return
    if (!nav.contains(event.target)) {
      clearTimers()
      close()
    }
  }

  // ── Binding ────────────────────────────────────────────────────────

  dropdowns.forEach((d, index) => {
    on(d.root, 'mouseenter', () => handleEnter(index))
    on(d.root, 'mouseleave', handleLeave)

    // Opens when tabbed into, closes when focus leaves the whole item.
    on(d.root, 'focusin', () => {
      clearTimeout(leaveTimer)
      leaveTimer = null
      open(index)
    })
    on(d.root, 'focusout', (event) => {
      if (!d.root.contains(event.relatedTarget)) close()
    })

    on(d.toggle, 'click', (event) => {
      event.preventDefault()
      event.stopPropagation()
      clearTimers()
      if (openIndex === index) close()
      else open(index)
    })

    on(d.toggle, 'keydown', (event) => handleToggleKeydown(event, index))
    on(d.panel, 'keydown', (event) => handlePanelKeydown(event, index))
  })

  on(document, 'keydown', handleEscape)
  on(document, 'click', handleDocumentClick)

  reset()

  // matchMedia calls this when the query stops matching (and on revert),
  // so nothing leaks into the mobile navbar.
  return () => {
    clearTimers()
    listeners.forEach(([target, type, fn, options]) =>
      target.removeEventListener(type, fn, options)
    )
    listeners.length = 0
    dropdowns.forEach((d) => {
      gsap.killTweensOf(parts(d))
      gsap.set(d.panel, { clearProps: 'all' })
      gsap.set(d.links, { clearProps: 'all' })
      if (d.caret) gsap.set(d.caret, { clearProps: 'all' })
      d.toggle.removeAttribute('aria-expanded')
    })
    openIndex = -1
  }
}
