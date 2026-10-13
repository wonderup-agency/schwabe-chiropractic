/*
Component: symptoms
Webflow attribute: data-component="symptoms" (on .marquee-component.cc-symptoms,
inside the Section / Sound Familiar component definition)

Home · "Sound familiar?". Replaces MAST's CSS marquee with a JS-driven row so
it can do what Derek asked for in Pastel #4:

- slow auto-scroll, seamless loop with no visible jump
- drag / swipe / trackpad scroll back and forth on every device; the
  auto-scroll pauses while the visitor interacts and resumes a few seconds after
- pauses on hover and on keyboard focus
- a small pause/play button (WCAG 2.2.2, auto-moving content)
- prefers-reduced-motion: no auto-scroll, just a manually scrollable row
- the card alignment rule: every lead takes the height of the tallest one, so
  the trigger lines all start at the same height

The Designer keeps ONE .marquee-group with the seven cards. The copies that make
the loop seamless are cloned here (aria-hidden + inert), so the copy only lives
in one place.
*/

import './styles/symptoms.css'
import { MQ } from '../utils/motion.js'

const SYMPTOMS = {
  speed: 32, // px per second of auto-scroll
  resumeAfter: 3000, // ms of no interaction before auto-scroll comes back
  friction: 0.94, // per-frame decay of the fling after a drag
  minFling: 0.05, // px/ms under which the fling stops
}

const ICON_PAUSE =
  '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false"><rect x="4" y="3" width="2.5" height="10" rx="1" fill="currentColor"/><rect x="9.5" y="3" width="2.5" height="10" rx="1" fill="currentColor"/></svg>'
const ICON_PLAY =
  '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false"><path d="M5 3.2v9.6a.6.6 0 0 0 .92.5l7.2-4.8a.6.6 0 0 0 0-1L5.92 2.7A.6.6 0 0 0 5 3.2Z" fill="currentColor"/></svg>'

/**
 * @param {HTMLElement[]} elements - All elements matching [data-component='symptoms']
 */
export default function (elements) {
  elements.forEach((root) => init(root))
}

function init(root) {
  const track = root.querySelector('.marquee-content')
  const group = track && track.querySelector('.marquee-group')
  if (!track || !group) return

  const reduced = window.matchMedia(MQ.reduced)
  root.setAttribute('data-symptoms-ready', '')

  // ── Clones ─────────────────────────────────────────────────────────
  // Any stale copies left in the Designer go; ours are rebuilt on resize so
  // there are always enough to cover the viewport twice over.
  track.querySelectorAll('.marquee-group').forEach((g) => {
    if (g !== group) g.remove()
  })
  let clones = []
  let period = 0 // width of one group + the gap after it

  function build() {
    clones.forEach((c) => c.remove())
    clones = []
    const first = group.cloneNode(true)
    first.setAttribute('aria-hidden', 'true')
    first.inert = true
    track.appendChild(first)
    clones.push(first)
    period = first.offsetLeft - group.offsetLeft
    if (period <= 0) return
    const needed = Math.ceil(root.clientWidth / period) + 1
    for (let i = 1; i < needed; i += 1) {
      const c = first.cloneNode(true)
      c.inert = true
      track.appendChild(c)
      clones.push(c)
    }
    equalize()
  }

  // ── Row alignment ──────────────────────────────────────────────────
  // Leads to the height of the tallest lead, so every trigger starts on the
  // same line (Derek's card rule, #4 and #13).
  function equalize() {
    const leads = track.querySelectorAll('.symptoms_lead')
    root.style.removeProperty('--symptoms-lead-h')
    let max = 0
    leads.forEach((l) => (max = Math.max(max, l.offsetHeight)))
    if (max) root.style.setProperty('--symptoms-lead-h', `${max}px`)
  }

  // ── Motion state ───────────────────────────────────────────────────
  let x = 0
  let velocity = 0 // px/ms, only for the fling after a drag
  let hovering = false
  let focused = false
  let dragging = false
  let userPaused = false
  let idleUntil = 0
  let visible = true
  let last = performance.now()
  let raf = 0

  const autoOn = () =>
    !reduced.matches &&
    !userPaused &&
    !hovering &&
    !focused &&
    !dragging &&
    performance.now() > idleUntil

  function wrap() {
    if (!period) return
    x = ((x % period) + period) % period
    track.style.transform = `translate3d(${-x}px, 0, 0)`
  }

  function tick(now) {
    const dt = Math.min(now - last, 64)
    last = now
    if (!dragging && Math.abs(velocity) > SYMPTOMS.minFling) {
      x += velocity * dt
      velocity *= SYMPTOMS.friction
    } else if (!dragging) {
      velocity = 0
      if (autoOn()) x += (SYMPTOMS.speed * dt) / 1000
    }
    wrap()
    raf = visible ? requestAnimationFrame(tick) : 0
  }

  function start() {
    if (raf) return
    last = performance.now()
    raf = requestAnimationFrame(tick)
  }

  const touched = () => {
    idleUntil = performance.now() + SYMPTOMS.resumeAfter
  }

  // ── Drag / swipe ───────────────────────────────────────────────────
  // Pointer events cover mouse, pen and touch. touch-action: pan-y in the CSS
  // keeps vertical page scrolling native on phones; we only take horizontal.
  let startX = 0
  let startY = 0
  let lastX = 0
  let lastT = 0
  let pointerId = null
  let decided = false

  root.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || e.target.closest('[data-symptoms-toggle]')) return
    pointerId = e.pointerId
    startX = lastX = e.clientX
    startY = e.clientY
    lastT = performance.now()
    decided = e.pointerType === 'mouse'
    dragging = decided
    velocity = 0
    if (dragging) {
      root.setPointerCapture(pointerId)
      root.setAttribute('data-dragging', '')
    }
  })

  root.addEventListener('pointermove', (e) => {
    if (e.pointerId !== pointerId) return
    if (!decided) {
      const dx = Math.abs(e.clientX - startX)
      const dy = Math.abs(e.clientY - startY)
      if (dx < 6 && dy < 6) return
      decided = true
      if (dx <= dy) {
        pointerId = null // a vertical swipe: let the page scroll
        return
      }
      dragging = true
      root.setPointerCapture(pointerId)
      root.setAttribute('data-dragging', '')
    }
    if (!dragging) return
    const now = performance.now()
    const delta = e.clientX - lastX
    x -= delta
    velocity = -delta / Math.max(now - lastT, 1)
    lastX = e.clientX
    lastT = now
    touched()
  })

  const end = (e) => {
    if (e.pointerId !== pointerId) return
    pointerId = null
    if (!dragging) return
    dragging = false
    root.removeAttribute('data-dragging')
    if (performance.now() - lastT > 80) velocity = 0
    touched()
  }
  root.addEventListener('pointerup', end)
  root.addEventListener('pointercancel', end)
  // A drag that ends over a card must not select its text.
  root.addEventListener('dragstart', (e) => e.preventDefault())

  // ── Trackpad / shift+wheel ─────────────────────────────────────────
  root.addEventListener(
    'wheel',
    (e) => {
      const dx = e.shiftKey ? e.deltaY : e.deltaX
      // Only a mostly horizontal gesture is ours; vertical wheel scrolls the page.
      if (!dx || (!e.shiftKey && Math.abs(e.deltaX) <= Math.abs(e.deltaY)))
        return
      e.preventDefault()
      x += dx
      velocity = 0
      touched()
    },
    { passive: false }
  )

  // ── Hover / focus ──────────────────────────────────────────────────
  root.addEventListener('pointerenter', (e) => {
    if (e.pointerType === 'mouse') hovering = true
  })
  root.addEventListener('pointerleave', () => {
    hovering = false
  })
  root.addEventListener('focusin', () => (focused = true))
  root.addEventListener('focusout', (e) => {
    if (!root.contains(e.relatedTarget)) focused = false
  })

  // ── Pause / play ───────────────────────────────────────────────────
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'symptoms_toggle'
  button.setAttribute('data-symptoms-toggle', '')
  const render = () => {
    button.innerHTML = userPaused ? ICON_PLAY : ICON_PAUSE
    button.setAttribute(
      'aria-label',
      userPaused ? 'Play the scrolling cards' : 'Pause the scrolling cards'
    )
    button.setAttribute('aria-pressed', String(userPaused))
    button.hidden = reduced.matches
  }
  button.addEventListener('click', () => {
    userPaused = !userPaused
    idleUntil = 0
    render()
  })
  render()
  root.after(button)
  reduced.addEventListener('change', render)

  // ── Lifecycle ──────────────────────────────────────────────────────
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    if (visible) start()
  })
  io.observe(root)

  let width = root.clientWidth
  const ro = new ResizeObserver(() => {
    if (root.clientWidth === width) return
    width = root.clientWidth
    build()
  })
  ro.observe(root)

  const ready = document.fonts ? document.fonts.ready : Promise.resolve()
  ready.then(() => {
    build()
    wrap()
    start()
  })
}
