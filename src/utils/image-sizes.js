/*
Give every responsive image the `sizes` it actually renders at.

Webflow generates `sizes` for images inside MAST's Image Fit component as
"(max-width: 800px) 100vw, 800px", because inside a component definition it
can't know how wide the image will be. The browser trusts that hint and picks
the 800w candidate from srcset even when the image is drawn 1440px wide on a
2x screen, so photos look soft or pixelated although the assets go up to
2560–2880px. Measured 2026-10-02: 43 of 85 large images were served below 2x.

`sizes` is a reserved attribute in the Designer, so it can't be fixed there.
Here we set it to the real rendered width (the browser multiplies by the
device pixel ratio itself) and keep it current with a ResizeObserver, so a
lazy image that gets its size later, or a viewport rotation, re-picks the
right candidate. Images with 0 width (hidden) are skipped until they appear.
*/

export default function fixImageSizes() {
  const images = document.querySelectorAll('img[srcset]')
  if (!images.length) return

  const apply = (img) => {
    const width = Math.ceil(img.getBoundingClientRect().width)
    if (width > 0) img.sizes = `${width}px`
  }

  images.forEach(apply)

  if (!('ResizeObserver' in window)) return
  const observer = new ResizeObserver((entries) => {
    entries.forEach((entry) => apply(entry.target))
  })
  images.forEach((img) => observer.observe(img))
}
