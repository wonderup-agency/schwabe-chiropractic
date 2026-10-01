// Captura de página completa a 1440 + mapa de sections (id/clase, y, alto).
// Uso: node shot.js <slug|""> <out.png> [ancho=1440]
// Scrollea toda la página antes de capturar para disparar los reveals (data-anim) y
// despega el nav sticky para que no se repita en la captura.
const { chromium } = require('./_pw')
const [, , slug = '', out = 'prod.png', w = '1440'] = process.argv
;(async () => {
  const b = await chromium.launch()
  const p = await b.newPage({ viewport: { width: +w, height: 900 } })
  await p.goto('https://schwabe.webflow.io/' + slug + '?cb=' + Date.now(), {
    waitUntil: 'networkidle',
  })
  const H = await p.evaluate(() => document.body.scrollHeight)
  for (let y = 0; y < H + 900; y += 400) {
    await p.evaluate((y) => scrollTo(0, y), y)
    await p.waitForTimeout(90)
  }
  await p.waitForTimeout(2500)
  await p.evaluate(() => {
    scrollTo(0, 0)
    document.querySelectorAll('.nav,[class*=announcement]').forEach((e) => {
      const c = getComputedStyle(e).position
      if (c === 'fixed' || c === 'sticky') e.style.position = 'relative'
    })
  })
  await p.waitForTimeout(800)
  await p.screenshot({ path: out, fullPage: true })
  const secs = await p.evaluate(() =>
    [...document.querySelectorAll('main > *, main section, .page-main > *')]
      .filter((e) => e.tagName === 'SECTION' || e.tagName === 'HEADER')
      .map((e) => {
        const r = e.getBoundingClientRect()
        return [
          (e.id || e.className.split(' ').slice(0, 3).join('.')).slice(0, 40),
          Math.round(r.y + scrollY),
          Math.round(r.height),
        ]
      })
  )
  console.log(JSON.stringify(secs))
  await b.close()
})()
