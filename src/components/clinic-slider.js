/*
Component: clinic-slider
Webflow attribute: data-component="clinic-slider"

Our Story · #our-clinic. Six static feature cards built in the Designer.
The client's call (comment on the Figma slider, 2026-10-01):
"slider for mobile; full grid for desktop".

So this is NOT the MAST slider. MAST's slider.js inits every
[data-slider="slider"] at every width, and here the grid has to stay a grid
from 768 up. This file starts Swiper only under 768 and tears it down above,
so the Designer layout is the source of truth everywhere else.

Without this file (before the deploy, or if Swiper fails to load) the cards
are still usable on mobile: Webflow styles `.clinic_items` as a native
horizontal scroll with scroll-snap, and the arrows stay hidden. The JS only
upgrades that into Swiper with arrows.

Swiper itself comes from the site-wide <head> (swiper@11 bundle, JS + CSS),
the same copy the Home testimonials use. It is NOT bundled here.
*/

import './styles/clinic-slider.css'
import { MQ } from '../utils/motion.js'

const LABEL = 'clinic-slider'
const ON = 'is-slider'

const OPTIONS = {
  // Custom classes on purpose: `.swiper-wrapper` / `.swiper-slide` from the
  // bundle CSS would also hit the desktop grid if they lived in Webflow.
  wrapperClass: 'clinic_items',
  slideClass: 'clinic_item',
  slidesPerView: 1.15,
  spaceBetween: 16,
  speed: 300,
  watchOverflow: true,
  keyboard: { enabled: true, onlyInViewport: true },
  // Keep the list semantics Webflow ships (role=list / listitem).
  a11y: { enabled: true, slideRole: 'listitem' },
  breakpoints: {
    // Landscape phones: a bit more of the next card.
    480: { slidesPerView: 1.6, spaceBetween: 20 },
  },
}

/** Swiper is a deferred classic script; main.js is a module. Either can land first. */
function whenSwiper(timeout = 4000) {
  return new Promise((resolve) => {
    if (window.Swiper) return resolve(window.Swiper)
    const start = Date.now()
    const tick = setInterval(() => {
      if (window.Swiper || Date.now() - start > timeout) {
        clearInterval(tick)
        resolve(window.Swiper || null)
      }
    }, 50)
  })
}

/**
 * @param {HTMLElement[]} elements - All elements matching [data-component='clinic-slider']
 */
export default async function (elements) {
  const Swiper = await whenSwiper()
  if (!Swiper) {
    console.warn(
      `[${LABEL}] Swiper not found, keeping the native scroll fallback`
    )
    return
  }

  const mq = window.matchMedia(MQ.mobileDown)

  const sliders = elements
    .map((root) => {
      const container = root.querySelector('.clinic_list')
      if (!container || !container.querySelector('.clinic_item')) return null
      return {
        root,
        container,
        prev: root.querySelector('[data-clinic="prev"]'),
        next: root.querySelector('[data-clinic="next"]'),
        instance: null,
      }
    })
    .filter(Boolean)

  function mount(s) {
    if (s.instance) return
    s.root.classList.add(ON)
    s.instance = new Swiper(s.container, {
      ...OPTIONS,
      navigation: s.prev && s.next ? { prevEl: s.prev, nextEl: s.next } : false,
    })
  }

  function unmount(s) {
    if (!s.instance) return
    // true, true: also strip the inline widths/transforms Swiper wrote,
    // otherwise the desktop grid inherits them.
    s.instance.destroy(true, true)
    s.instance = null
    // destroy() leaves the a11y labels ("1 / 6") on the slides; on the grid
    // they would be read out for no reason.
    s.container.querySelectorAll('.clinic_item').forEach((slide) => {
      slide.removeAttribute('aria-label')
      slide.removeAttribute('aria-roledescription')
    })
    s.root.classList.remove(ON)
  }

  function sync() {
    sliders.forEach((s) => (mq.matches ? mount(s) : unmount(s)))
  }

  sync()
  mq.addEventListener('change', sync)

  return {
    destroy() {
      mq.removeEventListener('change', sync)
      sliders.forEach(unmount)
    },
  }
}
