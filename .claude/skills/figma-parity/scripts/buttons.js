// Inventario de botones con flecha en todo el sitio, agrupado por (fondo, disco, flecha, modificador).
// Uso: node buttons.js > btns.json ; un grupo con 1-2 miembros suele ser el inconsistente.
// Ojo: un botón SIN flecha no aparece acá; buscalo con el screenshot (los de Shockwave no la tenían).
const { chromium } = require('./_pw')
const pages = [
  '',
  'our-story',
  'team',
  'community-partners',
  'new-patients',
  'faq',
  'care',
  'care/sports-activity-overuse-injuries',
  'wellness-membership',
  'fees-and-policies',
  'patient-stories',
  'blog',
  'contact',
  'products-we-recommend',
  'join-our-team',
  '404',
]
;(async () => {
  const b = await chromium.launch()
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
  const rows = []
  for (const u of pages) {
    await p
      .goto('https://schwabe.webflow.io/' + u, { waitUntil: 'networkidle' })
      .catch(() => {})
    await p.waitForTimeout(800)
    const r = await p.evaluate(() =>
      [...document.querySelectorAll('[data-btn]')]
        .filter((b) => b.offsetWidth)
        .map((b) => {
          const ic = b.querySelector('[data-btn-icon] .icon-color')
          const i2 = ic && ic.querySelector('.icon')
          const cs = ic && getComputedStyle(ic)
          return {
            t: b.textContent.trim().slice(0, 28),
            cls: b.className.replace(/w-variant-\S+/g, 'v'),
            btnBg: getComputedStyle(b).backgroundColor,
            disc: cs ? cs.backgroundColor : 'NO ICON',
            arrow: i2 ? getComputedStyle(i2).color : '-',
            mod: ic ? ic.className : '-',
          }
        })
    )
    r.forEach((x) => rows.push({ p: u || 'home', ...x }))
  }
  console.log(JSON.stringify(rows))
  await b.close()
})()
