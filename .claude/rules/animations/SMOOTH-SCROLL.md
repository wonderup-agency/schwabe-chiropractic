# Smooth scroll — Lenis

## Decisión

**Lenis**, elegido el 2026-09-08. Se descartó ScrollSmoother (exige un
wrapper/content en el DOM de Webflow y pelea con `position: sticky` y con el
nav fijo) y se descartó no tener smooth scroll.

Lenis no trae parallax: cualquier efecto de profundidad se escribe con
ScrollTrigger. Ver la receta `parallax` en la skill `animate`.

## Estado

**No implementado todavía.** Cuando se implemente, esta sección se actualiza y
`TECH_STACK.md` y `ARCHITECTURE.md` también.

Faltan dos cosas, las dos requieren OK del usuario:

1. **Cargar la librería.** Igual que GSAP: un `<script>` en el embed de Custom
   Code de MAST, leído desde `window.Lenis`. Mantiene el patrón "las librerías
   vienen de window, nuestro código del bundle" y no agrega dependencias de npm.

   ```html
   <script src="https://cdn.jsdelivr.net/npm/lenis@1.3.26/dist/lenis.min.js"></script>
   ```

   La alternativa es bundlearlo (`npm i lenis`, ~3KB gzip). Da versión fija y
   cero race conditions, a cambio de romper el patrón actual. Requiere permiso
   para instalar una dependencia.

2. **El CSS de Lenis.** Es obligatorio, no opcional. Va en
   `src/styles/lenis.css`, importado desde `global.js`, así sale en
   `dist/styles.css`. Copiado literal de `lenis@1.3.26/dist/lenis.css` — no se
   escribe a mano:

   ```css
   html.lenis,
   html.lenis body {
     height: auto;
   }

   .lenis:not(.lenis-autoToggle).lenis-stopped {
     overflow: clip;
   }

   .lenis [data-lenis-prevent],
   .lenis [data-lenis-prevent-wheel],
   .lenis [data-lenis-prevent-touch],
   .lenis [data-lenis-prevent-vertical],
   .lenis [data-lenis-prevent-horizontal] {
     overscroll-behavior: contain;
   }

   .lenis.lenis-smooth iframe {
     pointer-events: none;
   }

   .lenis.lenis-autoToggle {
     transition-property: overflow;
     transition-duration: 1ms;
     transition-behavior: allow-discrete;
   }
   ```

## Wiring

Va en `src/components/global.js` — tiene que existir antes de que cualquier
componente cree un ScrollTrigger. La instancia se expone en `window.__lenis`
para que `getLenis()` de `motion.js` la encuentre.

El patrón de integración es el de la doc oficial de Lenis (leída vía Context7):
`autoRaf: false`, el `raf` de Lenis dentro del ticker de GSAP, `ScrollTrigger.update`
en el evento de scroll, y `lagSmoothing(0)`.

```js
const lenis = new Lenis({
  autoRaf: false, // el ticker de GSAP maneja el frame loop
  anchors: true, // los links #anchor de la Home los resuelve Lenis
})

lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000)) // GSAP da segundos, Lenis pide ms
gsap.ticker.lagSmoothing(0)

window.__lenis = lenis
```

**Por qué un solo frame loop**: si Lenis corre su propio `requestAnimationFrame`
y GSAP el suyo, el scrub queda un frame atrasado respecto de la posición de
scroll y se ve como jitter. Un solo ticker lo resuelve.

`anchors: true` cubre el anchor nav de la Home. Si el nav fijo tapa el destino,
la opción es `anchors: { offset: -N }`, no un handler propio.

## Gotchas

- **`data-lenis-prevent`** en todo contenedor con scroll propio: dropdowns
  scrolleables, mapas embebidos, paneles internos. Sin eso, el scroll del
  contenedor se lo come Lenis.
- **Iframes**: el CSS les saca `pointer-events` mientras el smooth scroll está
  activo. Si hay un mapa o un video que necesita interacción, hay que
  excluirlo.
- **El nav fijo** y cualquier `position: sticky` siguen funcionando — esa es la
  ventaja sobre ScrollSmoother, que los rompe.
- **iOS**: probar en device real. Lenis sobre el scroll nativo de iOS es donde
  aparecen los problemas, no en desktop.
- Si aparece jank, lo primero a revisar es que no haya dos frame loops.
