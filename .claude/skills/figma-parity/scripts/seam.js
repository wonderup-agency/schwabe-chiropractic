// Busca costuras de 1px entre una banda absoluta y la section siguiente a DPR fraccional.
// Uso: node seam.js <slug> "<selector de la section de abajo>"
// Imprime filas cuyo brillo medio salta respecto de las vecinas en el borde. Aparece a 1.25/1.5, no a 1/2.
const { chromium } = require('./_pw')
const [, , slug = '', sel = '#fees-at-a-glance'] = process.argv
;(async () => {
  const b = await chromium.launch()
  for (const d of [1, 1.25, 1.5, 2]) {
    const p = await b.newPage({ viewport: { width: 1440, height: 1150 }, deviceScaleFactor: d })
    await p.goto('https://schwabe.webflow.io/' + slug, { waitUntil: 'networkidle' }); await p.waitForTimeout(1200)
    const y = await p.evaluate((s) => document.querySelector(s).getBoundingClientRect().y, sel)
    const buf = await p.screenshot({ clip: { x: 900, y: y - 4, width: 500, height: 8 } })
    console.log('DPR', d, 'boundary y', y.toFixed(3), '-> revisá el PNG si y es fraccional'); require('fs').writeFileSync(`seam_${d}.png`, buf); await p.close()
  }
  await b.close()
})()
