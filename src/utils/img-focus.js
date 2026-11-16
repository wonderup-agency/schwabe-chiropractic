/*
Pastel 978216 #81: make the photo focal point accept any value.

img-focus.css only maps 0, 10, 20 ... 100. Editors type things like "35",
"35%" or "top", which matched no rule, so the crop never moved. Here any
number from 0 to 100 (with or without %) and the words top/center/bottom
become an inline object-position. Anything else is ignored and the photo
keeps the default centre crop.
*/

const LABEL = 'img-focus'
const WORDS = { top: 0, center: 50, centre: 50, middle: 50, bottom: 100 }

export default function imgFocus(root = document) {
  try {
    root.querySelectorAll('img[data-img-y]').forEach((img) => {
      const raw = (img.getAttribute('data-img-y') || '').trim().toLowerCase()
      if (!raw) return
      let y = raw in WORDS ? WORDS[raw] : parseFloat(raw.replace('%', ''))
      if (!Number.isFinite(y)) return
      y = Math.min(100, Math.max(0, y))
      img.style.objectPosition = `50% ${y}%`
    })
  } catch (error) {
    console.error(`[${LABEL}] failed, photos keep the default crop`, error)
  }
}
