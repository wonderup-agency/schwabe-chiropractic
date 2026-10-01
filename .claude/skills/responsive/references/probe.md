# El probe — medición, no ojímetro

Un solo `evaluate_script` que devuelve todo lo medible de un viewport. Corre
igual en los seis perfiles; lo que cambia es el resultado.

**Por qué medir y no mirar la screenshot**: un desborde de 3px no se ve en una
screenshot escalada, un tap target de 38px tampoco, y el ritmo de espaciado
roto sólo aparece cuando ves los seis valores de padding en una columna. La
screenshot sirve para lo estético; el probe para lo verificable.

## Cómo correrlo

`evaluate_script` con este `function` como argumento. Devuelve JSON.

```js
() => {
  const vw = window.innerWidth
  const label = (el) => {
    const id = el.id ? `#${el.id}` : ''
    const cls = (el.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean).slice(0, 3).join('.')
    return `${el.tagName.toLowerCase()}${id}${cls ? '.' + cls : ''}`
  }
  const px = (v) => Math.round(parseFloat(v) || 0)
  const all = Array.from(document.querySelectorAll('body *')).filter((el) => {
    const cs = getComputedStyle(el)
    return cs.display !== 'none' && cs.visibility !== 'hidden'
  })

  // 1 — Desborde horizontal
  const overflow = {
    documentScrollWidth: document.documentElement.scrollWidth,
    viewportWidth: vw,
    overflows: document.documentElement.scrollWidth > vw + 1,
    culprits: [],
  }
  for (const el of all) {
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) continue
    if (r.right > vw + 1 || r.left < -1) {
      const cs = getComputedStyle(el)
      if (cs.position === 'fixed' || cs.position === 'sticky') continue
      overflow.culprits.push({
        el: label(el),
        left: Math.round(r.left),
        right: Math.round(r.right),
        width: Math.round(r.width),
        overhang: Math.round(Math.max(r.right - vw, -r.left)),
      })
    }
  }
  overflow.culprits = overflow.culprits.sort((a, b) => b.overhang - a.overhang).slice(0, 12)

  // 2 — Padding de sections: la tabla que delata el ritmo roto
  const sections = Array.from(document.querySelectorAll('section, header, footer, main > div')).map((el) => {
    const cs = getComputedStyle(el)
    const r = el.getBoundingClientRect()
    return {
      el: label(el),
      pt: px(cs.paddingTop),
      pb: px(cs.paddingBottom),
      pl: px(cs.paddingLeft),
      pr: px(cs.paddingRight),
      height: Math.round(r.height),
      bg: cs.backgroundColor,
    }
  })
  const vertical = {}
  const horizontal = {}
  for (const s of sections) {
    vertical[`${s.pt}/${s.pb}`] = (vertical[`${s.pt}/${s.pb}`] || 0) + 1
    horizontal[`${s.pl}/${s.pr}`] = (horizontal[`${s.pl}/${s.pr}`] || 0) + 1
  }

  // 3 — Inset horizontal real del contenido: de dónde arranca el texto
  const insets = {}
  for (const el of document.querySelectorAll('h1, h2, h3, p')) {
    const r = el.getBoundingClientRect()
    if (r.width === 0) continue
    const k = Math.round(r.left)
    insets[k] = (insets[k] || 0) + 1
  }

  // 4 — Tap targets por debajo de 44px
  const smallTargets = []
  for (const el of document.querySelectorAll('a, button, input, select, textarea, [role="button"]')) {
    const cs = getComputedStyle(el)
    if (cs.display === 'none' || cs.visibility === 'hidden') continue
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) continue
    if (r.height < 44 || r.width < 44) {
      smallTargets.push({
        el: label(el),
        text: (el.textContent || el.value || '').trim().slice(0, 30),
        w: Math.round(r.width),
        h: Math.round(r.height),
      })
    }
  }

  // 5 — Tipografía ilegible
  const tinyText = []
  for (const el of all) {
    if (!el.childNodes.length) continue
    const hasText = Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim())
    if (!hasText) continue
    const fs = parseFloat(getComputedStyle(el).fontSize)
    if (fs < 14) tinyText.push({ el: label(el), fontSize: fs, text: el.textContent.trim().slice(0, 30) })
  }

  // 6 — 100vh y otras unidades de viewport en los stylesheets legibles.
  // `unreadableSheets` va aparte a propósito: mezclarlo con los hits infla el
  // conteo y hace leer como fallo lo que es sólo una hoja cross-origin.
  const vhRules = []
  const unreadableSheets = []
  for (const sheet of document.styleSheets) {
    let rules
    try {
      rules = sheet.cssRules
    } catch {
      unreadableSheets.push(sheet.href)
      continue
    }
    const walk = (list) => {
      for (const rule of list) {
        if (rule.cssRules) walk(rule.cssRules)
        else if (rule.cssText && /\d+vh\b/.test(rule.cssText) && !/dvh|svh|lvh/.test(rule.cssText)) {
          vhRules.push({ href: sheet.href, rule: rule.cssText.slice(0, 160) })
        }
      }
    }
    walk(rules)
  }

  // 7 — Imágenes: alt y sobrepeso de descarga
  const images = []
  for (const img of document.querySelectorAll('img')) {
    const r = img.getBoundingClientRect()
    if (r.width === 0) continue
    const ratio = img.naturalWidth ? img.naturalWidth / (r.width * devicePixelRatio) : null
    images.push({
      el: label(img),
      alt: img.alt === '' ? '(vacío — ok sólo si es decorativa)' : img.alt ? 'ok' : '(ausente)',
      displayed: Math.round(r.width),
      natural: img.naturalWidth,
      oversizeFactor: ratio ? Number(ratio.toFixed(2)) : null,
      loading: img.loading,
      sizes: img.sizes || null,
    })
  }

  // 8 — Elementos fijos / sticky: cuánto viewport se comen
  const pinned = []
  for (const el of all) {
    const cs = getComputedStyle(el)
    if (cs.position !== 'fixed' && cs.position !== 'sticky') continue
    const r = el.getBoundingClientRect()
    if (r.height === 0) continue
    pinned.push({ el: label(el), position: cs.position, h: Math.round(r.height), zIndex: cs.zIndex })
  }

  return {
    viewport: { width: vw, height: window.innerHeight, dpr: devicePixelRatio },
    colorScheme: matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    hoverCapable: matchMedia('(hover: hover) and (pointer: fine)').matches,
    overflow,
    sections,
    paddingClusters: { vertical, horizontal },
    contentInsets: insets,
    smallTargets: smallTargets.slice(0, 20),
    tinyText: tinyText.slice(0, 20),
    vhRules: vhRules.slice(0, 20),
    unreadableSheets,
    images: images.slice(0, 25),
    pinned,
  }
}
```

## Cómo leer cada salida

| Campo | Qué es un fallo |
| --- | --- |
| `overflow.overflows` | `true` es fallo, siempre. `culprits` viene ordenado por cuánto se sale: el primero suele ser la causa y el resto sus hijos |
| `paddingClusters.vertical` | Más de 2–3 pares distintos entre sections del mismo tipo = ritmo roto. Lo esperable en mobile es un valor, con excepciones deliberadas |
| `paddingClusters.horizontal` | Debería haber **un solo** par. Dos o más = alguna section tiene su propio margen lateral |
| `contentInsets` | Un solo valor dominante. Un título que arranca en 20 y un párrafo en 44 en la misma section es el bug de "mucho padding en los costados" |
| `smallTargets` | Cualquier cosa <44px en su lado corto. Los iconos sociales y las flechas de slider son los reincidentes |
| `tinyText` | <14px no se lee en un teléfono. Fallo salvo eyebrow/legal deliberado |
| `vhRules` | `100vh` sin `dvh` es fallo: la barra de direcciones de iOS lo cambia al scrollear. **Cubre el CSS de Webflow, no el nuestro** — ver abajo |
| `unreadableSheets` | No es un fallo, es el alcance del check anterior. Contexto, no hallazgo |
| `images.oversizeFactor` | >2 significa que se descarga el doble de lo que se muestra. En 4G es el costo real de la página |
| `pinned` | El nav sticky comiéndose >15% del alto del viewport en mobile es fallo. También sirve para chequear que no haya dos capas fijas peleando z-index |

## Dos cosas que el probe no ve, y hay que chequear a mano

**Nuestro propio CSS es ilegible por CSSOM.** `dist/styles.css` se sirve desde
jsDelivr sin los headers de CORS que hacen falta para leer `cssRules`, así que
aparece en `unreadableSheets` y el check de `vh` **no lo cubre**. La hoja de
Webflow sí se lee (838 reglas en la corrida del 2026-09-08). Para nuestro CSS,
grepear la fuente:

```sh
grep -rn "[0-9]vh\b" src/ | grep -v "dvh\|svh\|lvh"
```

**`overflows: false` con `culprits` cargado no siempre es sano.** Significa que
algo clipea el desborde, y hay dos casos opuestos:

- **Por diseño** — un marquee de 1920px dentro de un contenedor con
  `overflow: hidden`. El contenido que importa está dentro del viewport.
- **Roto** — un slider de 938px con `left: -274` en un viewport de 390. No hay
  scroll horizontal, pero el contenido está *fuera de la pantalla* y no se
  puede alcanzar. Así se veía el slider de testimonios el 2026-09-08.

Los distingue una pregunta: ¿lo que quedó afuera tenía que poder leerse o
tocarse? Si sí, es fallo, aunque `overflows` diga `false`.

## Interacción — lo que el probe no puede ver

El probe mide el estado de reposo. Estos hay que dispararlos a mano con
`click` / `hover` / `press_key` y volver a medir:

- **Nav abierto** — el menú de Webflow **no abre con `.click()` sintético ni con
  `TouchEvent` despachados**. Arrancá el daemon con `--experimentalVision=true`
  y usá `click_at <pageId> <x> <y>` sobre el centro de `.w-nav-button`. Después
  screenshot y probe de nuevo: el menú abierto es otro layout.
- **Nunca busteés caché con `extraHttpHeaders`** — el header extra fuerza
  preflight CORS, jsDelivr/CloudFront lo rechazan, jQuery no carga y el nav deja
  de abrir. Ver los gotchas en `.claude/rules/RESPONSIVE.md`.
- **Slider** — clickear la flecha siguiente, verificar que la slide entra
  completa y que el track no arrastra un desborde horizontal.
- **Accordion / tabs** — abrir el panel más largo y medir de nuevo: cambia el
  alto del documento y con eso cualquier ScrollTrigger.
- **Form** — enfocar cada input (`click`), verificar que iOS no zoomea
  (font-size del input ≥16px es la única forma de evitarlo) y que el foco no
  queda tapado por el nav fijo.
- **Hover en touch** — con `mobile,touch` emulado, `hoverCapable` tiene que
  volver `false`. Si vuelve `true`, el viewport se emuló con `resize_page` y no
  con `emulate`, y toda la verificación de touch es inválida.
