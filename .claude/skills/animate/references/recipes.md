# Catálogo de animaciones

Cada receta define **el contrato**: qué atributos usa, qué tokens, qué plugin
necesita y dónde suele romperse. Los snippets muestran la estructura, no la API
final — la API se confirma en el Paso 1 con la skill oficial de GSAP
correspondiente. Nunca copies un snippet de acá sin haber leído la doc del
plugin que usa.

---

## Parte 1 — Primitivas reutilizables (`src/components/reveal.js`)

Un solo componente, manejado por atributos, aplicable desde el Designer sin
pedir código nuevo. `data-component="reveal"` va en la **section**; los
`data-anim` van en los elementos de adentro.

### Contrato

| Atributo | Valores | Default |
| --- | --- | --- |
| `data-anim` | `fade` `fade-up` `fade-down` `fade-left` `fade-right` `stagger` `rule` `lines` `words` `parallax` `parallax-media` `mask` `scale-in` | — |
| `data-anim-delay` | segundos | `0` |
| `data-anim-duration` | `quick` `base` `slow` `hero` | `base` |
| `data-anim-distance` | `sm` `md` `lg` | `md` |
| `data-anim-stagger` | `tight` `base` `loose` | `base` |
| `data-anim-speed` | 0–**0.08** (solo `parallax`) | `0.08` |
| `data-anim-start` | override del `start` de ScrollTrigger | `top 85%` |
| `data-anim-mobile` | `off` para no animar en touch · `on` para forzarlo | según variante |
| `data-anim-axis` | `x` `y` — override del eje de `rule` | autodetectado |

**Estado**: `mask`, `words` y `parallax` están construidas (2026-09-15);
`parallax-media`, `stagger` y `rule` se sumaron el **2026-09-21**. Las otras
cinco siguen siendo spec. Ver `.claude/rules/components/reveal.md` para lo
que se midió.

**`parallax-media` existe porque el `Image` de MAST no acepta atributos** — no
tiene props `Attribute Name` / `Attribute Value`, a diferencia de `Button`. El
hook va en el contenedor que clipea y el JS mueve el `img` de adentro. Es la
variante a usar por default para fotos dentro de un componente de MAST;
`parallax` queda para cuando el elemento que se mueve sí puede llevar el
atributo.

**`stagger` saltea a los hijos que traen su propio `data-anim`.** No es un
detalle de implementación: las filas tipo timeline de este sitio meten el
filete como **hermano** de los items (`.four_row` tiene 5 hijos, no 4;
`.process_grid` alterna columna y filete), así que sin ese filtro el filete
ocuparía el primer slot del stagger.

**`rule` mide su eje en vez de declararlo**, porque `Section / Four Things` es
un solo componente cuyo variant `Columns` lleva el filete horizontal y el
`Stacked` vertical, con el atributo compartido. Una caja con alguna dimensión
en 0 se revela y se saltea: adivinar el eje deja el filete en `scale(0)` para
siempre.

**`data-anim-speed` se clampea a 0.08, no a 0.15.** `motion-language.md` fija
el techo del parallax en ±8% del alto del elemento; el contrato decía 0.15 por
error y se corrigió contra el lenguaje de movimiento, no al revés.

### Anti-FOUC y costo por variante

Qué tiene que estar en CSS antes del primer paint, y cuánto cuesta cada una.
"Scrubbed" significa que corre en cada frame de scroll: son las caras.

| Variante | Estado inicial en CSS | Costo |
| --- | --- | --- |
| `fade` | `opacity: 0` | Bajo — un tween, una vez |
| `fade-up/-down/-left/-right` | `opacity: 0` (el `y`/`x` lo pone GSAP) | Bajo |
| `stagger` | `opacity: 0` en los hijos directos | Bajo con `batch`, alto si hacés un trigger por hijo |
| `lines` / `words` | `opacity: 0` en el **contenedor** | Medio — el split mide el DOM; una sola vez si no re-splitea de más |
| `parallax` | ninguno (arranca visible) | **Alto — scrubbed.** Apagado en mobile |
| `mask` | `opacity: 0` en la ventana | **Bajo** — transform puro (ver abajo) |
| `scale-in` | `opacity: 0` | Bajo |

Detalle importante de `lines` y `words`: el `opacity: 0` va en el contenedor,
**no** en las líneas — las líneas todavía no existen cuando el CSS se aplica.
Y el contenedor tiene que tener su altura final reservada antes del split, o el
layout salta cuando el texto se reparte.

### Las variantes

**`fade`** — `opacity` 0 → 1, sin travel. `EASE.soft`. Para logos, badges,
imágenes de fondo, cualquier cosa donde el movimiento sería de más.

**`fade-up` / `-down` / `-left` / `-right`** — el caballito de batalla.
`opacity` + `y`/`x` de `DIST[distance]` a 0. `EASE.out`, `DUR.base`.

**`stagger`** — anima los **hijos directos** del elemento, no el elemento. Para
grids de cards y listas. Cada hijo hace `fade-up` con `sm`, escalonado con
`STAGGER[stagger]`. Un solo ScrollTrigger en el contenedor, no uno por hijo.

**`lines`** — SplitText por líneas, cada línea con `y: DIST.sm` y overflow
oculto en su wrapper, `STAGGER.tight`. **La receta más delicada del sitio**:
- Requiere `SplitText` (verificá en `PLUGINS.md`).
- Hay que envolver en `whenLaidOut()`. Si el webfont entra después del split,
  las líneas se cortan en el lugar equivocado y no se puede arreglar después.
- Re-split en resize: el ancho cambia y las líneas son otras. Se resuelve con
  el auto-split de SplitText moderno; confirmá la opción con `/gsap-plugins`.
- MAST no permite custom classes en texto, así que el wrapper de overflow lo
  crea SplitText, no el Designer.

**`words`** — igual pero por palabras. Para headlines cortos, 3–6 palabras.

**`parallax`** — `y` scrubbed contra el scroll, `EASE.linear`,
`scrub: SCROLL.scrub`, `invalidateOnRefresh: true`. Solo para media dentro de
un contenedor con `overflow: hidden`, o se ven los bordes — el componente
chequea los ancestros y **no anima** si ninguno clipea.

El CSS le reserva un sobrante de `slack%` arriba y abajo (alto `100 + 2·slack`),
así que mover ±S% del alto del **contenedor** es `S / (1 + 2·slack/100)` en
`yPercent` de la **foto**. Sin esa división se asoma el borde.

**Apagado en touch** por default, y el gate es el **pointer**, no el ancho: un
teléfono acostado mide 844px y pasa cualquier `max-width: 767px`. Ver
`RESPONSIVE.md`.

**`mask`** — **no usa `clip-path` y no pide markup nuevo.** Las dos capas ya
están en el DOM de MAST: la ventana (`overflow: hidden`) clipea, el wrapper
interno sube `yPercent: 100 → 0` y el `img` contra-mueve `-100 → 0`. Los dos
transforms **se cancelan**, así que la foto queda quieta y lo único que viaja
es el borde del reveal — hacia arriba, **contra el scroll**. Compositor puro,
sin repaint. `DUR.slow`, `EASE.out`, más un `scale: 1.06 → 1` en la foto que
la hace "asentarse" (medido: 20.4px, y son escala, no translate).

Queda un fallback a `clip-path: inset()` para elementos **sin capa interna**
que mover — un bloque de texto, una card. Esa rama repinta la región clipeada
en cada frame, así que es la cara de las dos.

Un contra-movimiento **parcial** se midió y se descartó: con `counter: 0.65`
la foto derivaba 195.7px, cuatro veces `DIST.lg`.

**`scale-in`** — `scale: 0.96 → 1` + opacity. Para cards y modales. Nunca
arranques abajo de `0.9`: se lee como zoom, no como entrada.

### Reglas de implementación de `reveal.js`

- **Un `gsap.matchMedia()`** con tres ramas: `MQ.motionOk` (todo),
  `MQ.reduced` (estados finales con duración 0), y opcionalmente
  `MQ.mobileDown` para respetar `data-anim-mobile="off"`.
- **El estado inicial va en CSS**, no solo en `gsap.set()`, junto con la regla
  del failsafe `html.anim-failsafe [data-anim]` — ver el Paso 5b de la skill.
  El CSS lo importa `reveal.js` y sale en `dist/styles.css`.
- **`ScrollTrigger.batch`** para las variantes de `stagger` cuando hay muchos
  elementos iguales en la página: un trigger por grupo visible en vez de
  cuarenta.
- **`parallax` es un tween scrubeado, no un `quickTo`.** El spec original
  pedía un `quickTo` alimentado desde el `onUpdate` del trigger; construido,
  un tween con `scrub: 1` ya es **un solo tween reusado** cuyo progreso maneja
  ScrollTrigger, con el mismo lerp de catch-up y la mitad del código. Lo que
  sigue prohibido es un `gsap.to()` nuevo por frame.
- El componente tiene que pasar el budget del Paso 5a **con la página entera**,
  no con un elemento: `reveal.js` es el que más instancias tiene del sitio, así
  que es donde el costo se multiplica.
- Marcadores solo bajo `isDev()`.

---

## Parte 2 — Componentes propios

### Hero (al cargar, no en scroll)

Timeline con `DUR.hero` y `EASE.expo`. Orden: headline por líneas →
subhead → CTA → media. El `stagger` entre grupos es `loose`; adentro de cada
grupo, `tight`. Arranca después de `whenLaidOut()` para que el split mida
contra la fuente real. La banda oscura del fee bar entra al final, con `fade`.

**Anti-FOUC crítico**: es lo primero que se ve del sitio, así que el estado
inicial tiene que estar en CSS sin excepción. Pero el fee bar lleva el precio,
que es contenido crítico — **no se oculta**. Entra con un `fade` desde visible,
o directamente no se anima.

Skills: `/gsap-timeline` + `/gsap-plugins` (SplitText) + `/gsap-core`.

### Counter / stat animado

El número cuenta hasta su valor con `snap` a entero. `DUR.slow`, `EASE.out`,
`once: true`. El valor final va **en el HTML**, no en el JS — el JS lo lee y
lo cuenta desde 0, así el número correcto es el que ve Google y el que queda si
GSAP no carga. Por eso **no lleva CSS anti-FOUC**: arranca visible y correcto. En este sitio el stat es un H1, así que el layout ya reserva el
espacio: cuidá que contar de `0` a `47` no cambie el ancho y salte.

Skill: `/gsap-core`.

### Pinned scrub (sección que se cuenta sola al scrollear)

`pin: true`, `scrub: SCROLL.scrub`, `end: '+=' + altura`, `anticipatePin: 1`.
Lo que casi siempre rompe:
- Un ancestro con `overflow: hidden` mata el pin. En Webflow pasa seguido.
- `invalidateOnRefresh: true` si algún valor se calcula del tamaño del viewport.
- En mobile suele convenir no pinear: `matchMedia` con una versión simple
  abajo de 992px.
- **Nunca pinear el nav.** El nav ya es fijo; el pin le pelea el `transform`.
- Es de lo más caro que hay: máximo 2–3 scrubs o pins activos por viewport.
  Si necesitás más, la sección hace demasiadas cosas a la vez.

Skill: `/gsap-scrolltrigger`.

### Tabs

Crossfade del contenido + indicator que se desliza entre triggers.
- El indicator se mueve con **Flip**, o con un `quickTo` sobre `x`/`width`
  leyendo `getBoundingClientRect()` del trigger activo. Flip es más limpio si
  el indicator es un solo elemento compartido.
- `DUR.quick` + `EASE.inOut` para el indicator; `DUR.base` + `EASE.soft` para
  el crossfade del contenido.
- El contenido saliente y el entrante se superponen — hay que reservar altura
  o el layout salta. Medí la altura del panel más alto, o animá la altura del
  contenedor con Flip.
- Accesibilidad obligatoria: `role="tablist"` / `tab` / `tabpanel`,
  `aria-selected`, `aria-controls`, flechas para navegar, Enter/Space para
  activar. `nav.js` ya tiene el patrón de teclado del proyecto — copialo.
- Si los tabs son los nativos de Webflow, Webflow ya toggle-a sus clases.
  Igual que en `nav.js`: no leas su clase, escribí estilo inline con GSAP y
  siempre gana.

Skills: `/gsap-plugins` (Flip) + `/gsap-core`.

### Slider

MAST trae su propio slider; hay que **desvincularlo** antes de tocarlo y setear
los props antes de adaptar el markup. Para movimiento custom:
- Drag con **Draggable** + **InertiaPlugin** si querés que tenga inercia real.
- El track se mueve con `x` y `quickTo`, nunca con `scrollLeft` animado.
- El track duplicado del marquee de MAST se bindea a los mismos props que el
  original: si cambiás uno, cambiá los dos.
- Accesibilidad: `aria-roledescription="carousel"`, `aria-label` por slide.

Skills: `/gsap-plugins` (Draggable, Inertia) + `/gsap-performance`.

### Marquee

`xPercent: -50` en un track duplicado, `EASE.linear`, `repeat: -1`. Pausa en
hover con `timeScale`, no con `pause()` — el frenado gradual es lo que lo
distingue de un GIF. `timeScale(0)` con un tween de `DUR.quick`.

Skill: `/gsap-core`.

### Flip (transición de layout)

Para cuando un elemento cambia de lugar o de tamaño y hace falta que se
entienda que **es el mismo elemento**: filtros de una grilla, una card que se
abre a detalle, el indicator de los tabs.

`Flip.getState()` antes del cambio de DOM/clase, `Flip.from()` después.
`DUR.base` + `EASE.inOut`. Nunca `EASE.out` en un Flip: el movimiento tiene dos
puntas que importan.

Skill: `/gsap-plugins` (Flip).

### SVG morph

`MorphSVGPlugin`. Los dos paths tienen que tener sentido de dirección y punto
de inicio comparables, o el morph se retuerce — `shapeIndex` es el parámetro
que lo arregla, y encontrarlo es prueba y error (`MorphSVGPlugin.findShapeIndex`
en el playground). `DUR.slow`, `EASE.inOut`.

Reglas de este sitio:
- El SVG tiene que estar **inline en el DOM**, no en un `<img>`. En Webflow eso
  es un HtmlEmbed.
- El arco de la foto del doctor y el de differentiators están en CSS
  (`border-radius: 999px`), no en SVG — **no los conviertas a SVG para
  animarlos**. Si hay que animar el arco, se anima el `border-radius`, aunque
  cueste un frame de paint.
- `DrawSVG` para trazos que se dibujan: necesita `stroke`, no `fill`.

Skill: `/gsap-plugins`.

### Hover

- Solo bajo `MQ.hover`. En touch, `mouseenter` dispara con el tap y deja el
  elemento pegado en su estado de hover.
- `gsap.quickTo()` para cualquier cosa que siga el mouse. Crear un tween por
  `mousemove` es el error de performance más común del rubro.
- `DUR.quick` + `EASE.out`. `overwrite: 'auto'` para que entrar y salir rápido
  no encole tweens.

Skills: `/gsap-core` + `/gsap-performance`.

### Accordion

La única excepción a "no animar `height`": `gsap.to(panel, { height: 'auto' })`.
GSAP mide una vez y anima en píxeles, así que no hay thrash por frame.
`DUR.base` + `EASE.inOut`, `aria-expanded` en el trigger, y
`ScrollTrigger.refresh()` al final si hay triggers debajo — el documento cambió
de alto.

Skills: `/gsap-core` + `/gsap-scrolltrigger`.

### Scroll suave a anchor

**No lo escribas.** Lenis lo maneja con `anchors: true`. Ver
`.claude/rules/animations/SMOOTH-SCROLL.md`. Si hace falta un offset por el nav
fijo, es la opción `anchors.offset`, no un handler propio.
