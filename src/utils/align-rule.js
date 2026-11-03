/*
Regla de alineación de texto (Pastel 978216 #34, Derek 2026-11-03):

  "Center only headings and short intros (up to 3 lines at that screen width).
   If any paragraph in a centered block runs 4 or more lines at a given width,
   left-align the whole block (eyebrow, heading, paragraphs) at that width.
   Apply at the text-style or component level, not page by page, so it holds
   as copy changes."

CSS no puede contar líneas, así que esto mide. Para cada párrafo centrado en
`main` busca su bloque (el ancestro más alto que sigue centrado, sin salir de
la section/container) y, si algún párrafo del bloque corre 4+ líneas al ancho
actual, le pone `u-align-left` al bloque. Se recalcula al cargar las fuentes y
en cada resize (debounced), así que vale por ancho y sigue al copy.

Cubre también #57, #61, #69 y #72. Los headings cuentan igual que los
párrafos: un H2 de 4+ líneas centrado también pasa el bloque a la izquierda
(#61, el H2 de Membership Options a 390).
*/

const LABEL = 'align-rule'
const CLASS = 'u-align-left'
const MAX_LINES = 3
// Headings too: #61 is a 4-line centered H2 on phone.
const TEXT = 'p, .plain-text, h1, h2, h3, h4, .heading-text'
const STOP = 'section, .section, .container, main, body'
const SKIP =
  '.button, button, nav, footer, form, .marquee-component, .swiper, .cost-band_lines, .statement_layout, [data-align-keep]'

function lineCount(el) {
  const cs = getComputedStyle(el)
  let lh = parseFloat(cs.lineHeight)
  if (Number.isNaN(lh)) lh = parseFloat(cs.fontSize) * 1.2
  return Math.round(el.getBoundingClientRect().height / lh)
}

function blockOf(el) {
  let block = el
  let parent = el.parentElement
  while (
    parent &&
    !parent.matches(STOP) &&
    getComputedStyle(parent).textAlign === 'center'
  ) {
    block = parent
    parent = parent.parentElement
  }
  return block
}

function apply() {
  document
    .querySelectorAll(`.${CLASS}`)
    .forEach((el) => el.classList.remove(CLASS))

  const blocks = new Set()
  const sel = TEXT.split(',')
    .map((t) => `main ${t.trim()}`)
    .join(', ')
  document.querySelectorAll(sel).forEach((el) => {
    if (!el.offsetParent || el.closest(SKIP)) return
    if (getComputedStyle(el).textAlign !== 'center') return
    if (lineCount(el) > MAX_LINES) blocks.add(blockOf(el))
  })
  blocks.forEach((b) => b.classList.add(CLASS))
}

export default function alignRule() {
  try {
    const run = () => {
      try {
        apply()
      } catch (error) {
        console.error(`[${LABEL}] failed`, error)
      }
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(run)
    else run()

    let t
    let lastW = window.innerWidth
    window.addEventListener('resize', () => {
      if (window.innerWidth === lastW) return
      lastW = window.innerWidth
      clearTimeout(t)
      t = setTimeout(run, 150)
    })
  } catch (error) {
    console.error(`[${LABEL}] failed`, error)
  }
}
