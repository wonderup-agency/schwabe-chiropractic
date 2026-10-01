# Conventions

## Language & Modules

- ES modules everywhere (`import`/`export`), never CommonJS (`require`/`module.exports`)
- `type: "module"` is set in package.json
- 2-space indentation
- Prettier defaults for all formatting (no config file, `.prettierignore` excludes `dist`)

## Naming

- **Files**: lowercase, hyphen-separated (`create-component.js`, `rollup.config.dev.js`)
- **Components**: named after their `data-component` attribute value (`calculator.js` → `data-component="calculator"`)
- **Nested components**: mirror directory path (`forms/contact.js` → `data-component="contact"`)
- **Pages**: named to match the Webflow page they target (`pricing.js`, `blog/post.js`)
- **Variables/functions**: camelCase
- **Constants**: camelCase (not UPPER_SNAKE — e.g., `flatItems`, not `FLAT_ITEMS`), except for module-level config-like objects which use UPPER_SNAKE (`MENU_SECTIONS`)

**Las clases CSS del sitio Webflow no se nombran con estas reglas.** Tienen su propia convención —`<bloque>_<elemento>`, underscore una sola vez, prefijo por rol cuando el patrón es genérico, `u-` para layout y color de superficie— y vive en `.claude/rules/COMPONENTS-NAMING.md`. Acá se nombran archivos, variables y componentes de JS; allá, clases del Designer.

## Exports

- **Components**: default export a function that receives `elements` array
- **Page bundles**: no export required, they're standalone entry points
- **Utilities/config**: named exports preferred, destructure on import
- **Config object** (`src/config.js`): default export

## Component Pattern

Every component follows the same structure:

```js
export default function (elements) {
  // Init logic
  elements.forEach((el) => {
    /* ... */
  })

  // Optional lifecycle hooks
  return {
    resize() {},
    breakpoint(current, previous) {},
  }
}
```

- The function receives all matching DOM elements as an array
- Only runs if matching elements exist on the page (after DOMContentLoaded)
- Return lifecycle hooks only if needed — omit if not used
- `resize` is debounced (150ms) — fires once after the user stops resizing
- `breakpoint` fires only when crossing a Webflow breakpoint threshold. Values: `1920` (2XL), `1440` (XL), `1280` (Large), `992` (Desktop/base), `768` (Tablet), `480` (Mobile Landscape), `0` (Mobile Portrait). Receives the new and previous breakpoint values

## Component Registration

Components are registered in `src/components.js` as an array of `{ selector, importFn }` objects. The `create-component` script manages this automatically. Manual edits follow the same pattern:

```js
{
  selector: "[data-component='name']",
  importFn: () => import('./components/name.js'),
}
```

## Animation

- **No magic numbers.** Durations, eases, travel distances, staggers and ScrollTrigger
  defaults come from `src/utils/motion.js` (`DUR`, `EASE`, `DIST`, `STAGGER`, `SCROLL`,
  `MQ`). If a value you need isn't a token, either the choice is wrong or the token is
  missing — decide, don't inline a literal.
- Component-specific tuning values still live in an UPPER_SNAKE object at the top of the
  component file, like `nav.js` does with `DUR` / `HOVER_ENTER` / `SHIFT`.
- **GSAP and its plugins are never imported** — they come off `window` via `getGsap()` and
  `getPlugin()`. A missing library must degrade to static markup, never to a thrown error.
- Scope animation with `gsap.matchMedia()` and the `MQ` queries rather than a `resize`
  hook — matchMedia reverts its own tweens and listeners.
- `prefers-reduced-motion` gets its own `mm.add(MQ.reduced, …)` branch: same end state,
  zero duration, no travel. It is a state, not an off switch.
- **`whenLaidOut()` no construye animaciones, sólo refresca.** El helper de
  `motion.js` llama a `fn` **dos veces** a propósito — una en
  `document.fonts.ready` y otra en `window.load`, que es lo que quiere decir su
  docstring con *"then again after any late layout shift"*. Para un
  `ScrollTrigger.refresh()` eso es correcto; para un `SplitText` o un `pin` es
  destructivo: medido con CDP el 2026-09-14, dejaba **dos ScrollTriggers
  pineando la misma section**. Para construir está **`onceLaidOut()`** en el
  mismo archivo: corre una sola vez, espera igual a `document.fonts.ready`
  —SplitText mide el DOM— y deja los cambios tardíos de layout para un
  `refresh()` en vez de reconstruir.
- **Lo que se crea dentro de un `.then()` queda fuera del contexto de
  `gsap.matchMedia()`**, y por lo tanto `mm.revert()` no lo revierte: el pin
  sobrevive al cambio de breakpoint. La espera de fuentes va **por fuera** del
  `matchMedia`, no adentro — primero se espera, después se abre el `mm`, y todo
  lo que su callback crea es síncrono.
- **Un estado inicial anti-FOUC nunca se escribe con `transform`** si GSAP va a
  animar ese mismo transform: el valor de CSS y el que escribe GSAP **se
  componen**. Medido: un `transform: translateY(100%)` en CSS más un
  `yPercent: 100` de GSAP dejaba el elemento en
  `translate(0%, 100%) translate(0px, 900px)` — al doble de distancia y fuera
  de pantalla. El anti-FOUC usa `opacity`, y la posición inicial la pone
  `gsap.set()`.
- **El guard de GSAP va antes de la primera línea que lo toca, y el failsafe
  antes que todo.** Un `gsap.registerPlugin(...)` sin guard arriba del archivo
  tira `ReferenceError` cuando GSAP no está y **aborta el módulo entero**,
  incluido el `armFoucFailsafe()` — que existe justamente para ese caso. El
  contenido oculto por el CSS anti-FOUC queda entonces invisible para siempre.
- **Un empate de especificidad contra MAST lo gana el orden de carga, que no
  controlamos.** Nuestro CSS y el de Webflow pueden entrar en cualquier orden,
  así que una regla nuestra que pelea con una de MAST necesita **más**
  especificidad, no la misma. Un atributo repetido —
  `[data-anim='parallax'][data-anim='parallax']`, (0,2,0)— le gana a la clase
  de MAST (0,1,0) siempre. Medido el 2026-09-15: con el atributo sin repetir,
  el `.u-img-cover { inset: 0 }` de MAST pisaba el sobrante del parallax y
  dejaba costuras de 38px y 46px. Mismo truco que `button.css`.
- **Una máscara de imagen se hace con dos capas y `overflow: hidden`, no con
  `clip-path`.** La ventana clipea, una capa interna sube y la imagen
  contra-mueve lo mismo: los transforms se cancelan, la imagen queda quieta y
  sólo viaja el borde. Es compositor puro; `clip-path` repinta la región
  clipeada en cada frame y además pelea con un `border-radius` complejo.
- **Reusable entrance animations are attribute-driven**, handled by `reveal.js`:
  `data-anim="fade-up"` with `data-anim-delay` / `-duration` / `-distance` / `-stagger` /
  `-speed` / `-start` / `-mobile` modifiers. Don't hand-roll a fade inside a section
  component when `data-anim` already covers it.
- **Un tween scrubeado no lleva travel corto.** Un scrub no tiene duración
  propia: su progreso es el scroll. Medido el 2026-09-15, `DIST.sm` (12px)
  repartido sobre los ~360px de scroll de una palabra da 0.03px por píxel —
  se lee como que el texto se acomoda, no como que entra. Pasar el ease a
  `linear` sólo lo vuelve uniforme. En un scrub van `opacity` / `filter` /
  `scale`, o un recorrido largo y deliberado; el travel corto queda para los
  tweens que sí tienen duración (`once: true`, hover). Detalle en
  `references/motion-language.md` de la skill `animate`.
- **Una regla nuestra que empata en especificidad con una de MAST es una
  moneda al aire**, y la decide el orden de carga de los stylesheets, que no
  controlamos. `[data-cost-lines]` (0,1,0) contra `.cost-band_lines` (0,1,0)
  perdía: las cuatro líneas quedaban apiladas en flujo en vez de en una celda.
  Cuando una regla pisa a MAST, **subí la especificidad a propósito** —
  anteponer un ancestro (`[data-cost-stage] …`) o repetir el atributo — y
  dejá escrito por qué, o el próximo la "simplifica".
- **Los `ComponentInstance` de MAST no aceptan atributos** — `Heading`,
  `Plain Text`, `Icon` y compañía devuelven *"This element does not support
  attributes"*. Cuando el target de una animación es una instancia, el hook va
  en **el contenedor** y el JS toma sus hijos directos
  (`Array.from(box.children)`), como hace `reveal.js` con
  `data-anim="stagger"`. El precio es que cualquier elemento agregado a ese
  contenedor entra en la animación: anotalo en la doc del componente.
  Los elementos nativos (`Image`, `Block`, `Section`) **sí** los aceptan.
- **Todo trigger que pinea lleva `refreshPriority: refreshOrder(el)`.** La doc
  de GSAP: *"pinning distance gets added to the start/end values of subsequent
  ScrollTriggers further down the page (that's why order matters)"*. Nuestros
  componentes se cargan con `import()` en paralelo y cada uno espera
  `document.fonts.ready` por su cuenta, así que el orden de creación es una
  lotería — medido en el sitio en vivo el 2026-09-15, `cost` se construía antes
  que `statement` en **4 de 5 cargas**, nunca recibía los 900px del pin de
  `statement`, y se pineaba **encima del CTA banner** 900px antes de tiempo.
  **⚠️ La skill `/gsap-scrolltrigger` dice que un número MÁS BAJO se refresca
  primero. Está al revés.** gsap.com: *"A ScrollTrigger with
  `refreshPriority: 1` will get refreshed earlier than one with
  `refreshPriority: 0`"* — **más alto = antes**. Con el signo invertido el
  "arreglo" empeoró el bug. Ante una duda de API, gana gsap.com, no el resumen
  de la skill.
- **`anticipatePin` y un pin que puede solaparse con lo de arriba no conviven.**
  Existe para evitar flicker adelantando el pin según la velocidad del scroll,
  y ese adelanto es exactamente un solapamiento: medido, con `anticipatePin: 1`
  el stage de `cost` se pineaba 51px antes del start scrolleando normal y 400px
  antes scrolleando rápido, tapando la section de arriba. Sin él, cero solape a
  cualquier velocidad. Si algún día aparece flicker, se arregla con el layout,
  no volviendo a poner esto.
- **`gsap.matchMedia()` con objeto de condiciones sólo corre el handler
  mientras AL MENOS UNA condición matchea.** No es un `switch` con default.
  Medido el 2026-09-21 en `plan.js`: con `{ pinnable, reduced }`, un teléfono
  que no pidió reduced motion no matcheaba ninguna de las dos, **el handler
  nunca corría**, y los tres pasos quedaban en el `opacity: 0` del CSS
  anti-FOUC hasta que el failsafe los rescataba a los 3 segundos. Si usás el
  objeto, una de las condiciones tiene que ser un catch-all — `MQ.motionOk`
  junto a `MQ.reduced` cubre siempre.
- **Un eje o una dirección que se decide midiendo necesita un guard para la
  caja degenerada.** Si una dimensión vuelve 0, la medición no es confiable y
  adivinar es peor que no animar. Medido: un filete vertical devolvió `2×0`
  porque sus insets absolutos superaban al padre, `width >= height` leyó
  `2 >= 0`, eligió el eje equivocado y `scaleX(0)` sobre un filete de 2px lo
  dejó **invisible para siempre** — un fallo silencioso sin vuelta atrás. Se
  revela y se saltea.
- **Animar `height` en un scrub es aceptable sólo si el contenedor tiene el
  alto bloqueado.** Un acordeón manejado por scroll que deja crecer y encoger
  su contenedor cambia el alto del documento mientras el visitante scrollea y
  la posición de scroll salta. `plan.js` fija la columna en
  `(todo cerrado) + (el detalle más alto)`, lo mide en el `onRefreshInit` y
  pasa los valores al timeline como **funciones** para que
  `invalidateOnRefresh` las reevalúe. Medido: documento y columna invariantes
  en 201 posiciones de scroll, CLS 0 con CPU a 4×.
- JS selects animation targets by `data-*` attributes, never by MAST class names.
- ScrollTrigger `markers` only under `isDev()`.

### Performance is a requirement, not a polish pass

- Animate `transform` and `opacity` only. The one exception is the accordion's
  `height: 'auto'`, which GSAP measures once instead of per frame.
- `gsap.quickTo()` for anything driven by `mousemove` or `scroll` — never a fresh tween
  per event.
- Measure once and cache; never `getBoundingClientRect()` inside a per-frame handler.
  Invalidate on ScrollTrigger's `refresh`, not on every tick.
- One trigger per group (`ScrollTrigger.batch`), not one per element.
- At most 2–3 scrubbed or pinned triggers active per viewport.
- Never write `will-change` in CSS — GSAP manages it, and a hand-written one leaves GPU
  layers promoted forever.
- The budget is measured, not estimated: 6 seconds of scroll in the Performance panel at
  **4x CPU throttling**, with no long tasks over 50ms during init, no sustained long
  frames, no per-tick recalculate style, and CLS at 0.

### Anti-FOUC

- Any animation starting from a hidden or offset state **ships its initial state in
  CSS**, in its own file imported by the component so it lands in `dist/styles.css` —
  a blocking stylesheet that applies before the first paint, unlike GSAP.
- That CSS always ships the failsafe rule alongside it:
  `html.anim-failsafe [data-anim] { opacity: 1; transform: none }`, with
  `armFoucFailsafe()` called once from `global.js`. Without it, a GSAP that never loads
  or a mistyped selector hides content permanently.
- **Critical content is never hidden**: price, address, phone, appointment CTA. It
  appears; it does not get revealed.
- An animation that hides nothing carries no anti-FOUC CSS — state that explicitly in
  the component doc rather than leaving it ambiguous.

## CSS

- Import CSS directly in JS files: `import './styles/component.css'`
- PostCSS handles nesting and autoprefixer (stage 2)
- All CSS extracts to a single `dist/styles.css`
- No CSS-in-JS, no CSS modules

## Error Handling

- Components wrap in try/catch — a failing component doesn't break others
- `global.js` loads with its own try/catch
- Use `console.log` for loading info, `console.warn` for non-critical issues, `console.error` for failures
- Production builds strip all `console.*` calls via Terser

## Scripts

- Node scripts live in `scripts/`
- Scripts use `picocolors` for terminal output coloring
- Scripts are Node-only, never bundled for the browser
