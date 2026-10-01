# GSAP en el sitio — qué está cargado

## De dónde viene GSAP

**No está bundleado.** No es dependencia de npm y no sale en `dist/`. Vive en
el embed de Custom Code de MAST, dentro de la página de Webflow — el mismo
`HtmlEmbed` que el MCP de Webflow no puede editar.

Verificado el 2026-09-08 vía MCP: el **head del sitio no carga GSAP**, no hay
scripts registrados y el footer está vacío. O sea que el `<script>` de GSAP
está en un embed a nivel elemento.

**Resuelto el 2026-09-14 curleando el HTML publicado.** El MCP no lee el
`HtmlEmbed`, pero los `<script src>` que ese embed emite **sí salen en el HTML
de la página publicada**. Es la forma barata de auditar el runtime:

    curl -s https://schwabe.webflow.io/faq | grep -o '<script[^>]*src="[^"]*"'

Consecuencia para el código: **qué plugins existen es un hecho de runtime**.
Un plugin que no está no rompe el build — rompe en producción. Por eso todo
acceso pasa por `getGsap()` / `getPlugin()` de `src/utils/motion.js`.

## Estado

Medido en el HTML publicado el **2026-09-14**:

| Plugin | Global | Estado |
| --- | --- | --- |
| Core | `gsap` | ✅ **3.15.0**, servido por Webflow (`cdn.prod.website-files.com/gsap/3.15.0/`) |
| ScrollTrigger | `ScrollTrigger` | ✅ 3.15.0 |
| Flip | `Flip` | ✅ 3.15.0 |
| SplitText | `SplitText` | ✅ 3.15.0 |
| MorphSVGPlugin | `MorphSVGPlugin` | ❌ No está |
| DrawSVGPlugin | `DrawSVGPlugin` | ❌ No está |
| Draggable | `Draggable` | ❌ No está |
| InertiaPlugin | `InertiaPlugin` | ❌ No está |
| Observer | `Observer` | ❌ No está |
| MotionPathPlugin | `MotionPathPlugin` | ❌ No está |
| ScrollToPlugin | `ScrollToPlugin` | ❌ No está |
| CustomEase | `CustomEase` | ❌ No está |
| Lenis | `Lenis` | ❌ No está — ver `SMOOTH-SCROLL.md` |

**GSAP lo carga Webflow, no un embed de MAST** — sale de
`cdn.prod.website-files.com/gsap/3.15.0/`, que es el toggle nativo de GSAP en
Site Settings. Agregar un plugin que falta se hace **ahí**, no pegando un
`<script>`: si se mezclan las dos vías quedan dos copias de GSAP con distinta
versión.

Los scripts de MAST que sí vienen de jsDelivr son los de comportamiento:
`accordion.min.js` (pinneado a `@b014a1b`), `modal.min.js` (`@e3479b3`), y
`theme-toggle` / `slider` / `inline-video` / `tabs` **en `@latest`** — esos
cuatro pueden cambiar bajo nuestros pies sin aviso.

## Cómo confirmar

Pegar en la consola del sitio de staging (`*.webflow.io`) y actualizar la tabla
con el resultado:

```js
console.log('gsap', window.gsap ? gsap.version : 'AUSENTE')
;[
  'ScrollTrigger', 'SplitText', 'Flip', 'MorphSVGPlugin', 'DrawSVGPlugin',
  'Draggable', 'InertiaPlugin', 'Observer', 'MotionPathPlugin',
  'ScrollToPlugin', 'ScrollSmoother', 'CustomEase', 'GSDevTools', 'Lenis',
].forEach((n) => console.log(window[n] ? '✅' : '❌', n))
```

## Cómo agregar un plugin que falta

Los `<script>` van en el embed de MAST, **nunca** en este repo ni en el
`dist/`. Orden obligatorio: core primero, plugins después.

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/ScrollTrigger.min.js"></script>
```

- Versión pinneada, nunca `@3` ni `latest`.
- **La misma versión para core y para todos los plugins.** Mezclar versiones da
  errores raros y difíciles de rastrear.
- El `gsap.registerPlugin()` va en nuestro código, no en el embed.
- Desde GSAP 3.13 (mayo 2025) todos los plugins que antes eran de Club GreenSock
  (SplitText, MorphSVG, DrawSVG, ScrollSmoother, Inertia) son gratis y están en
  el CDN público. No hace falta licencia ni token de npm.

## Última versión disponible

GSAP **3.15.0** (verificado contra la API de jsDelivr el 2026-09-08). Si el
sitio tiene una versión más vieja, no la actualices sin avisar: SplitText
cambió de API entre 3.12 y 3.13.
