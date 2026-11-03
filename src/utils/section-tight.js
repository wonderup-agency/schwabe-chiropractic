/*
Pastel 978216 #68 (Derek, 2026-11-03): two neighbouring sections with the
same background read as one area, so the gap between them is tighter
(~150px on desktop instead of ~200px).

Webflow can't express "previous section has the same background" and a combo
class can't be shared across sections that already carry their own `cc-*`
combo, so this compares each section with the one before it and adds
`is-continued` (padding-top = the `Section / Padding Tight` variable, see
src/styles/section-tight.css). It follows the page if sections are reordered,
added or recoloured.

Only sections that use the normal padding are touched (heroes, bands with 0
padding and overlaps keep theirs).
*/

const LABEL = 'section-tight'
const CLASS = 'is-continued'
const MIN_PAD = 40 // px; below this the section has its own intentional spacing

function bg(el) {
  return getComputedStyle(el).backgroundColor
}

/* A section painted by a full-bleed photo (testimonials, statement bg…) does
   not share a background with its neighbour even if the color matches. */
const PHOTO_BG = '[class*="_bg"], [class*="bg-image"], [class*="_scrim"]'

function hasPhotoBg(section) {
  if (getComputedStyle(section).backgroundImage !== 'none') return true
  const w = section.getBoundingClientRect().width
  return [...section.querySelectorAll(PHOTO_BG)].some((el) => {
    const cs = getComputedStyle(el)
    const full = el.getBoundingClientRect().width >= w * 0.9
    return full && (cs.position === 'absolute' || cs.position === 'fixed')
  })
}

function isTransparent(color) {
  return color === 'transparent' || /rgba\(.*,\s*0\)$/.test(color)
}

function apply() {
  document
    .querySelectorAll(`.${CLASS}`)
    .forEach((el) => el.classList.remove(CLASS))

  const sections = [...document.querySelectorAll('main .section')].filter(
    (s) => !s.parentElement.closest('.section') && s.offsetParent
  )

  for (let i = 1; i < sections.length; i++) {
    const prev = sections[i - 1]
    const cur = sections[i]
    const a = bg(prev)
    const b = bg(cur)
    if (isTransparent(a) || isTransparent(b) || a !== b) continue
    if (hasPhotoBg(prev) || hasPhotoBg(cur)) continue
    if (parseFloat(getComputedStyle(prev).paddingBottom) < MIN_PAD) continue
    if (parseFloat(getComputedStyle(cur).paddingTop) < MIN_PAD) continue
    if (parseFloat(getComputedStyle(cur).marginTop) < 0) continue // overlap
    cur.classList.add(CLASS)
  }
}

export default function sectionTight() {
  try {
    apply()
    let t
    window.addEventListener('resize', () => {
      clearTimeout(t)
      t = setTimeout(() => {
        try {
          apply()
        } catch (error) {
          console.error(`[${LABEL}] failed`, error)
        }
      }, 150)
    })
  } catch (error) {
    console.error(`[${LABEL}] failed`, error)
  }
}
