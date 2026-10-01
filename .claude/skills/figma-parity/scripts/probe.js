// Probe de /responsive: 6 perfiles x light/dark sobre las sections que se pasen.
// Uso: node probe.js <slug|""> "#hero,#plan,.cc-footer"  -> imprime solo lo que falla.
// Falsos positivos conocidos que filtra: tracks de marquesina (sound-familiar) y slides de Swiper.
const { chromium } = require('./_pw')
const [, , slug = '', list = ''] = process.argv
const sels = list.split(',').filter(Boolean)
const profiles = [['320', 320, 568, 2], ['390', 390, 844, 3], ['430', 430, 932, 3], ['844L', 844, 390, 3], ['768', 768, 1024, 2], ['1024', 1024, 1366, 2]]
const IGNORE = /marquee|symptoms|swiper-slide|clinic_|testimonial-card|plain-text/
;(async () => {
  const b = await chromium.launch(); let fails = 0
  for (const [pn, w, h, dpr] of profiles) for (const cs of ['light', 'dark']) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, isMobile: true, hasTouch: true, colorScheme: cs })
    const p = await ctx.newPage(); await p.goto('https://schwabe.webflow.io/' + slug, { waitUntil: 'networkidle' })
    for (let y = 0; y < 20000; y += 600) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(50) }
    await p.waitForTimeout(1200)
    const r = await p.evaluate(({ sels, ig }) => {
      const IG = new RegExp(ig); const vw = innerWidth; const out = []
      if (document.documentElement.scrollWidth > vw) out.push('hScroll ' + document.documentElement.scrollWidth)
      const lab = (e) => e.tagName.toLowerCase() + '.' + (e.getAttribute('class') || '').split(/\s+/).slice(0, 2).join('.')
      for (const s of sels) {
        const sec = document.querySelector(s); if (!sec) { out.push(s + ' MISSING'); continue }
        for (const e of sec.querySelectorAll('*')) { const c = getComputedStyle(e); if (c.display === 'none' || c.visibility === 'hidden') continue; const q = e.getBoundingClientRect(); if (!q.width || !q.height) continue; if ((q.right > vw + 1 || q.left < -1) && !IG.test(e.className)) { out.push(s + ' overflow ' + lab(e) + ' ' + Math.round(q.left) + '..' + Math.round(q.right)); break } }
        for (const e of sec.querySelectorAll('a,button,input,select,textarea,summary')) { const q = e.getBoundingClientRect(); if (q.width && (q.height < 44 || q.width < 44) && !/mailto|tel:/.test(e.getAttribute('href') || '')) { out.push(s + ' tap ' + lab(e) + ' ' + Math.round(q.width) + 'x' + Math.round(q.height)); break } }
        for (const e of sec.querySelectorAll('input:not([type=submit]),select,textarea')) if (parseFloat(getComputedStyle(e).fontSize) < 16) out.push(s + ' input<16px')
      }
      return out
    }, { sels, ig: IGNORE.source })
    if (r.length) { fails++; console.log(pn, cs, r.join(' | ')) }
    await ctx.close()
  }
  console.log(fails ? fails + ' perfiles con hallazgos' : 'OK en los 12 perfiles'); await b.close()
})()
