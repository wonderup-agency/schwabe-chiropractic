# QA de animaciones

Correr completa antes de decir que está lista. Los primeros cinco son los que
más rompen en este proyecto.

## 1. FOUC — el flash antes de que GSAP cargue

GSAP no está bundleado y `main.js` es `defer` + import dinámico: hay una
ventana real de varios frames donde el HTML está pintado y GSAP todavía no
corrió. Si el estado inicial solo existe en `gsap.set()`, el visitante ve el
contenido en su posición final y después lo ve saltar al estado inicial.

- El estado oculto va **en CSS**: `[data-anim] { opacity: 0 }`.
- El CSS se importa desde el componente y sale en `dist/styles.css`, que el
  snippet del head carga como stylesheet bloqueante — llega antes del primer
  paint, y antes que el JS.
- **El failsafe tiene que estar armado.** `armFoucFailsafe()` de `motion.js`,
  llamado una vez desde `global.js`, más la regla
  `html.anim-failsafe [data-anim] { opacity: 1; transform: none }`. Sin eso, si
  GSAP no carga o un selector tiene un typo, el contenido queda invisible para
  siempre. Con eso, a los 3s se revela solo — y lo que sí está animando
  conserva su estado, porque GSAP escribe opacity inline y el inline le gana a
  la clase.
- Verificalo de verdad: Network → throttling *Slow 3G* y refresh. No tiene que
  haber flash, y tampoco contenido que nunca aparece.
- Para contenido crítico (precio, dirección, teléfono, CTA de turno) **no se
  usa `data-anim`** — ver `motion-language.md`.
- Si la animación no oculta nada, no lleva CSS anti-FOUC. Anotalo en la doc del
  componente, así la próxima persona no lo busca.

## 2. CLS — el layout no se mueve

- Solo `transform` y `opacity`. Nada de `height`, `width`, `top`, `margin`.
- El espacio del elemento tiene que estar reservado antes de animar: si el
  texto se parte en líneas, el contenedor ya tiene su altura final.
- Un counter que va de `0` a `47` cambia de ancho. Fijá `min-width` o usá
  `font-variant-numeric: tabular-nums`.
- Verificá en el panel de Performance con throttling de CPU 4x: el CLS
  aparece ahí, no a ojo en un Mac.

## 3. Fuentes y medición

Todo lo que mide el DOM (SplitText, pin, parallax) tiene que correr después de
que la fuente esté cargada. Usá `whenLaidOut()` de `src/utils/motion.js`.

Síntoma típico de que falta: en refresh duro la animación dispara temprano o
las líneas del split se cortan mal, pero navegando desde otra página anda
bien — porque la fuente ya estaba en caché.

## 4. Lenis / smooth scroll

Si Lenis está activo:
- `lenis.on('scroll', ScrollTrigger.update)` y el `raf` de Lenis en
  `gsap.ticker`, con `autoRaf: false`. Sin eso, el scrub va un frame atrasado y
  se ve como jitter.
- `gsap.ticker.lagSmoothing(0)`.
- Los contenedores con scroll propio (un panel, un mapa, un dropdown scrolleable)
  necesitan `data-lenis-prevent`.
- Ver `.claude/rules/animations/SMOOTH-SCROLL.md`.

## 5. Interacciones de Webflow (IX2)

Si Webflow ya anima el elemento, hay dos sistemas escribiendo el mismo estilo y
gana el último que corre — de forma no determinística.

- Decidí uno. Lo normal: apagar la interacción de Webflow y decirle al usuario
  exactamente cuál.
- Si la interacción no se puede apagar (vive en un componente de MAST, en un
  HtmlEmbed), usá el patrón de `nav.js`: no leas las clases de Webflow, escribí
  estilo inline con GSAP, que siempre le gana a una regla por clase.

## 6. Reduced motion

- `MQ.reduced` con una rama propia en `gsap.matchMedia()`: mismo estado final,
  duración 0, sin travel.
- El estado igual cambia — un tab se cambia, un accordion se abre. Lo que no
  pasa es que se mueva.
- Probalo de verdad: macOS → Accesibilidad → Pantalla → Reducir movimiento.

## 7. ScrollTrigger

- `ScrollTrigger.refresh()` después de cualquier cambio de alto del documento:
  un accordion que abre, contenido de CMS que carga, una imagen sin `height`.
- `invalidateOnRefresh: true` en cualquier trigger cuyos valores dependan del
  viewport.
- Ancestros con `overflow: hidden` rompen el pin. En Webflow es frecuente.
- Triggers cerca del final del documento pueden no llegar a dispararse: usá
  `SCROLL.startLate`.
- **`markers` solo bajo `isDev()`.** Un marker en producción es un bug visible.

## 8. Mobile y touch

El barrido completo de viewports lo hace la skill `/responsive` — corrila al
terminar. Acá quedan sólo los puntos de animación:

- El resize de la barra de direcciones de iOS dispara `refresh` y hace saltar
  las animaciones. `ScrollTrigger.config({ ignoreMobileResize: true })` en
  `global.js`.
- Nada de `100vh` en cálculos: usá `100dvh` o medí en JS.
- Hover solo bajo `MQ.hover`. En touch queda pegado.
- Parallax apagado abajo de 768px por default.
- Probá en un device real vía `npm run tunnel`, no solo en el emulador.

## 9. Performance — es un gate, no una sugerencia

Ver el Paso 5a de la skill. Acá se verifica:

- Solo `transform` y `opacity`. Única excepción: el `height: 'auto'` del
  accordion.
- `gsap.quickTo()` para cualquier cosa atada a `mousemove` o `scroll`.
- Nada de leer `getBoundingClientRect()` dentro de un handler por frame:
  medí una vez y cacheá, invalidando en `refresh`.
- `will-change` lo maneja GSAP; no lo pongas a mano en CSS, deja capas
  promovidas para siempre y se come memoria de GPU en mobile.
- Un trigger por grupo, no uno por elemento: `ScrollTrigger.batch`.
- Máximo 2–3 scrubs o pins activos por viewport.
- Nada animándose fuera de pantalla, y nada de animación de desktop siguiendo
  viva en mobile (`gsap.matchMedia()` revierte sola).

**El budget se mide.** Performance, 6 segundos de scroll, **CPU throttling 4x**:

| Métrica | Objetivo |
| --- | --- |
| Long tasks durante el init | ninguna >50ms |
| Frames largos scrolleando | ninguno sostenido |
| Recalculate style | no por tick |
| CLS | 0 |

Medir sin throttling es medir tu Mac, no el teléfono del visitante.

## 10. Robustez

- El componente arranca con guard clauses: si el elemento no está, sale limpio.
- Si el plugin no está, sale con warning y deja el markup estático.
- La animación no puede depender de que haya CMS items: 0 items no debe tirar
  error.
- Probá con la página a mitad de scroll y refrescá: los triggers que ya pasaron
  tienen que resolver a su estado final, no quedar invisibles.

## 11. Cierre

- `console.*` se strippea en prod por Terser, así que los logs son gratis en
  prod pero **no** en dev — no dejes logs por frame.
- Doc del componente actualizada en la misma respuesta (`CLAUDE.md`).
- Los atributos exactos para pegar en el Designer, comunicados al usuario.
- `npm run build` **solo** si el usuario pide deployar.
