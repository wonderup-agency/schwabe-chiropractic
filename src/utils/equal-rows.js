/*
Alinea las filas de cards en todo el sitio (Pastel #13, #14, #22 — Derek
2026-10-09).

"Headings take the height of the tallest heading in the row, descriptions the
same, and cards in a row are equal height. Every card row on the site. Not
needed on mobile where cards stack."

Webflow no tiene subgrid y cada grilla de cards del sitio tiene su propia
estructura (las de *What makes this different*, las de Membership, las de
Fees…), así que esto es genérico en vez de una regla por clase:

1. Busca en `main` contenedores con 2+ hijos que comparten la misma clase y
   que se ven como card (borde, fondo o radio).
2. Agrupa esos hijos por fila (mismo offsetTop). Una fila de una sola card,
   como en mobile cuando apilan, no se toca.
3. Dentro de cada card toma los bloques de texto en orden (h1–h6, p,
   .heading-text, .plain-text, .eyebrow) y le da a cada uno el min-height del
   más alto en la misma posición de la fila. Así los títulos, las bajadas y lo
   que venga después (una tabla, un botón) arrancan a la misma altura.
4. Las cards de una fila quedan del mismo alto ([data-eq-card] en CSS).

Se recalcula al cargar las fuentes y en cada resize (debounced). Quedan afuera
sliders, marquesinas, forms, nav y footer.
*/

const LABEL = 'equal-rows'
const SLOT = 'h1, h2, h3, h4, h5, h6, p, .heading-text, .plain-text, .eyebrow'
// Things that have a border or a fill but are controls, not cards.
const NOT_CARD =
  '.button, [data-btn], button, input, select, [class*="chip"], [class*="pill"], [class*="tag"], .w-dropdown'
const SKIP =
  '.swiper, .w-slider, .marquee-component, [data-component="symptoms"], form, nav, footer, .w-nav, [data-eq-off]'

function looksLikeCard(el) {
  if (el.matches(NOT_CARD)) return false
  const cs = getComputedStyle(el)
  const border =
    parseFloat(cs.borderTopWidth) > 0 && cs.borderTopStyle !== 'none'
  const bg =
    cs.backgroundColor !== 'rgba(0, 0, 0, 0)' &&
    cs.backgroundColor !== 'transparent'
  const radius = parseFloat(cs.borderTopLeftRadius) > 0
  return border || bg || radius
}

function findGroups(scope) {
  const groups = []
  scope.querySelectorAll('*').forEach((parent) => {
    const kids = Array.from(parent.children)
    if (kids.length < 2) return
    const cls = kids[0].classList[0]
    if (!cls || !kids.every((k) => k.classList[0] === cls)) return
    if (parent.closest(SKIP)) return
    const display = getComputedStyle(parent).display
    if (!/grid|flex/.test(display)) return
    if (!kids.every(looksLikeCard)) return
    groups.push(kids)
  })
  // A card grid nested inside another card grid is still its own group; the
  // outer pass runs first, so its slots never include the inner cards' text.
  return groups
}

// Text blocks of a card, outermost only (a <p> inside a .plain-text counts once).
function slotsOf(card) {
  return Array.from(card.querySelectorAll(SLOT)).filter((el) => {
    const outer = el.parentElement.closest(SLOT)
    return !outer || !card.contains(outer)
  })
}

function rowsOf(cards) {
  const rows = new Map()
  cards.forEach((c) => {
    // offsetTop, not getBoundingClientRect: reveal.js may still be holding a
    // card a few px down mid-entrance, which would split a row in two.
    const top = c.offsetTop
    if (!rows.has(top)) rows.set(top, [])
    rows.get(top).push(c)
  })
  return Array.from(rows.values())
}

let groups = []

function reset() {
  document.querySelectorAll('[data-eq-slot]').forEach((el) => {
    el.style.minHeight = ''
    el.removeAttribute('data-eq-slot')
  })
  document
    .querySelectorAll('[data-eq-card]')
    .forEach((el) => el.removeAttribute('data-eq-card'))
}

function align() {
  reset()
  groups.forEach((cards) => {
    rowsOf(cards).forEach((row) => {
      if (row.length < 2) return
      row.forEach((c) => c.setAttribute('data-eq-card', ''))
      const slots = row.map(slotsOf)
      const depth = Math.min(...slots.map((s) => s.length))
      for (let i = 0; i < depth; i += 1) {
        const items = slots.map((s) => s[i])
        // Only line up blocks that play the same role (same tag + class).
        const sig = (el) => el.tagName + '.' + (el.classList[0] || '')
        if (!items.every((el) => sig(el) === sig(items[0]))) break
        const max = Math.max(...items.map((el) => el.offsetHeight))
        items.forEach((el) => {
          el.style.minHeight = `${max}px`
          el.setAttribute('data-eq-slot', '')
        })
      }
    })
  })
}

export default function equalRows() {
  const main = document.querySelector('main')
  if (!main) return

  const run = () => {
    try {
      groups = findGroups(main)
      align()
    } catch (err) {
      console.warn(`[${LABEL}]`, err)
    }
  }

  const ready = document.fonts ? document.fonts.ready : Promise.resolve()
  ready.then(run)
  window.addEventListener('load', run, { once: true })

  let width = window.innerWidth
  let t = 0
  window.addEventListener('resize', () => {
    if (window.innerWidth === width) return
    width = window.innerWidth
    clearTimeout(t)
    t = setTimeout(align, 150)
  })
}
