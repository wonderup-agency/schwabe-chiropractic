# Playground

`playground/<nombre-animacion>/index.html`. Standalone: se abre directo en el
browser o se sirve con `npm run dev` (que ya sirve `dist/`, así que para el
playground alcanza abrir el archivo).

**`playground/` está en `.gitignore`.** Es espacio de trabajo desechable. No se
commitea, no llega al CDN, no es documentación. Lo que sobrevive es el
componente en `src/`.

## Cuándo armarlo

Sí: scrub, pin, Flip, morph de SVG, timelines de más de tres pasos, drag,
física, cualquier cosa que requiera encontrar un número por prueba y error
(`shapeIndex` de MorphSVG, la velocidad de un parallax, el `end` de un pin).

No: un fade, un stagger de cards, un hover. Va directo al componente; armar un
playground para eso es más lento que iterar en el sitio.

## Template

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>[Animación] — Playground</title>

    <style>
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
      img, svg { display: block; max-width: 100%; }
      button { cursor: pointer; border: 0; background: none; font: inherit; }
    </style>

    <!-- ══════════════════════════════════════════════════════
         CSS QUE SE EXPORTA
         Estado inicial (anti-FOUC) + failsafe + reduced-motion.
         Esto va al archivo .css que importa el componente.
         ══════════════════════════════════════════════════════ -->
    <style>
      /* Estado inicial — tiene que llegar antes del primer paint */
      [data-anim] { opacity: 0; }

      /* Red de seguridad: si GSAP no cargó o un elemento no se bindeó */
      html.anim-failsafe [data-anim] { opacity: 1; transform: none; }

      @media (prefers-reduced-motion: reduce) {
        [data-anim] { opacity: 1; transform: none !important; }
      }
    </style>

    <!-- ══════════════════════════════════════════════════════
         CSS DE REFERENCIA — NO SE EXPORTA
         Layout, tipografía y color solo para que el playground se
         vea como el sitio. Esto lo tiene el Designer de Webflow.
         ══════════════════════════════════════════════════════ -->
    <style>
      /* … */
    </style>
  </head>
  <body>
    <!-- ══════════════════════════════════════════════════════
         MARKUP — espejo del DOM real de Webflow (MAST)
         Clases de MAST + los data-* que consume el script.
         ══════════════════════════════════════════════════════ -->

    <!-- CDNs — solo del playground. Nunca se agregan al repo ni al sitio. -->
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/ScrollTrigger.min.js"></script>

    <!-- ══════════════════════════════════════════════════════
         SCRIPT — este es el código que se porta al componente
         ══════════════════════════════════════════════════════ -->
    <script>
      gsap.registerPlugin(ScrollTrigger)

      // Tokens duplicados a mano — el playground no puede importar de
      // src/utils/motion.js. Mantenelos idénticos, y al portar reemplazá
      // este bloque por el import.
      const DUR = { instant: 0.15, quick: 0.25, base: 0.5, slow: 0.8, hero: 1.1 }
      const EASE = { out: 'power2.out', in: 'power2.in', inOut: 'power2.inOut', soft: 'power1.out', expo: 'expo.out', linear: 'none' }
      const DIST = { sm: 12, md: 24, lg: 48 }
      const STAGGER = { tight: 0.04, base: 0.08, loose: 0.14 }
      const SCROLL = { start: 'top 85%', scrub: 1, once: true }

      // markers siempre en el playground, nunca al portar
      ScrollTrigger.defaults({ markers: true })
    </script>
  </body>
</html>
```

## CDNs disponibles

GSAP **3.15.0**, todo desde `https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/`:

| Archivo | Global |
| --- | --- |
| `gsap.min.js` | `gsap` |
| `ScrollTrigger.min.js` | `ScrollTrigger` |
| `SplitText.min.js` | `SplitText` |
| `Flip.min.js` | `Flip` |
| `MorphSVGPlugin.min.js` | `MorphSVGPlugin` |
| `DrawSVGPlugin.min.js` | `DrawSVGPlugin` |
| `Draggable.min.js` | `Draggable` |
| `InertiaPlugin.min.js` | `InertiaPlugin` |
| `Observer.min.js` | `Observer` |
| `MotionPathPlugin.min.js` | `MotionPathPlugin` |
| `ScrollToPlugin.min.js` | `ScrollToPlugin` |
| `ScrollSmoother.min.js` | `ScrollSmoother` |
| `CustomEase.min.js` | `CustomEase` |
| `GSDevTools.min.js` | `GSDevTools` |

Lenis **1.3.26**:
`https://cdn.jsdelivr.net/npm/lenis@1.3.26/dist/lenis.min.js` (global `Lenis`)
y `.../dist/lenis.css`.

**Fijá siempre la versión exacta.** `@3` o `latest` hace que el playground
cambie de comportamiento sin que nadie haya tocado nada.

## Reglas

- El markup del playground **imita el DOM real de MAST**, no una estructura
  ideal. Si en Webflow el arco está en un div con `border-radius`, en el
  playground también — animar contra un DOM que no existe no prueba nada.
- El JS se selecciona **siempre por `data-*`**, nunca por clases de Webflow.
  Las clases de MAST pueden cambiar; los atributos son nuestro contrato.
- Separá con comentarios los tres bloques: CSS exportable, CSS de referencia y
  script. Al portar tiene que quedar obvio qué se lleva cada archivo.
- `GSDevTools` en el playground para timelines largas: te deja scrubbear la
  timeline a mano y encontrar el beat que está mal.
- Un playground por animación. No metas tres experimentos en el mismo archivo.

## Probar en el playground antes de portar

El playground es el lugar más barato para encontrar estas dos cosas, porque
tenés el DevTools sin el ruido de Webflow encima:

1. **Anti-FOUC.** Network → *Slow 3G* + refresh. No tiene que haber flash del
   contenido en su posición final. Después probá con los `<script>` de GSAP
   comentados: con el failsafe armado, el contenido tiene que aparecer igual a
   los 3s; si queda invisible, falta la regla `html.anim-failsafe`.
2. **Performance.** Performance → **CPU 4x** → grabá 6 segundos de scroll.
   Sin long tasks >50ms en el init, sin frames largos sostenidos, sin
   *recalculate style* por tick. Si el número no cierra acá, no va a cerrar en
   Webflow, donde además corre IX2.

## Al portar

1. Reemplazá el bloque de tokens duplicados por
   `import { … } from '../utils/motion.js'`.
2. Los globals (`gsap`, `ScrollTrigger`) pasan por `getGsap()` / `getPlugin()`.
3. Los `markers: true` salen, o quedan bajo `isDev()`.
4. El CSS exportable va a su propio archivo, importado desde el componente —
   incluido el estado inicial y la regla del failsafe.
5. Verificá que `armFoucFailsafe()` esté llamado desde `global.js`.
6. Envolvé en el patrón del proyecto: default export que recibe `elements`,
   `gsap.matchMedia()`, guard clauses.
7. Corré el gate de performance del Paso 5a con el componente ya en el sitio.
8. Actualizá la doc del componente en la misma respuesta.
