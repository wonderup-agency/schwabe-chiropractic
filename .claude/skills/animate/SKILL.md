---
name: animate
description: Diseña y construye las animaciones del sitio Schwabe — GSAP ScrollTrigger, Flip, SVG morph, SplitText, parallax, tabs, sliders y transiciones custom con JS. Impone un lenguaje de movimiento compartido (duraciones, eases, distancias), obliga a leer documentación oficial antes de escribir código, y opcionalmente itera en un playground local antes de portar el resultado a un componente. Usar para cualquier pedido de animación o interacción con movimiento — "animar esto", "que aparezca en scroll", "parallax", "reveal de texto", "animación de las cards", "morph del SVG", "transición entre tabs", "quiero que se sienta más fluido", "playground de la animación".
argument-hint: '[qué animar]'
---

# Animate: $ARGUMENTS

Construye animaciones para el sitio Schwabe Chiropractic. No es una skill de
"escribir un tween" — es el proceso completo: entender qué comunica el
movimiento, verificar qué hay disponible en runtime, leer la doc, iterar, y
dejarlo shippeado con su doc.

**Regla que no se negocia: nunca escribas GSAP de memoria.** El Paso 1 no es
opcional, ni siquiera para un `gsap.to()` de una línea. La API cambia, los
plugins cambiaron de licencia, y el costo de leer la doc es diez segundos.

---

## Paso 0 — Entender qué se quiere

No empieces a escribir. Contestá estas cinco preguntas primero, con lo que ya
dijo el usuario o preguntándole:

1. **Qué elemento / sección.** Nombre concreto en el DOM de Webflow.
2. **Qué tiene que entender o sentir el visitante.** Si la respuesta es "que se
   vea lindo", falta información — volvé a preguntar. Toda animación acá tiene
   una función: dirigir la mirada, revelar jerarquía, dar feedback, o hacer
   entendible un cambio de estado. Si no cumple ninguna, no se anima.
3. **Disparo**: al cargar, al scrollear, al hover, al click, o scrubbed
   (atada a la posición de scroll).
4. **Repite o pasa una sola vez.**
5. **Referencia.** ¿Hay un sitio, un video, un prototipo de Figma? Si hay
   Figma con motion, leelo con `get_motion_context` del MCP de Figma antes de
   inventar tiempos.

**Preguntá siempre que haya duda.** Es explícitamente preferible una pregunta
a una animación que hay que rehacer. Usá `AskUserQuestion` cuando haya dos
lecturas posibles del pedido, y ofrecé opciones concretas — no abstractas.

Si el pedido es vago pero grande ("animá la home"), no lo tomes entero:
proponé el orden de secciones y arrancá por una.

---

## Paso 1 — Documentación antes de código

Invocá la skill oficial de GSAP que corresponda **antes** de escribir. La
tabla vive en `CLAUDE.md`; el resumen:

| Necesitás | Skill |
| --- | --- |
| Un tween, ease, stagger, `matchMedia` | `/gsap-core` |
| Secuenciar varias cosas | `/gsap-timeline` |
| Cualquier cosa atada al scroll, pin, scrub | `/gsap-scrolltrigger` |
| SplitText, Flip, MorphSVG, DrawSVG, Draggable, Observer, MotionPath | `/gsap-plugins` |
| **Siempre, antes de shippear** — jank, layout thrash, `quickTo`, cleanup | `/gsap-performance` |

Casi siempre son dos o tres, no una. "Texto que aparece por líneas en scroll"
= `/gsap-scrolltrigger` + `/gsap-plugins` + `/gsap-core` + `/gsap-performance`.

`/gsap-performance` **no es condicional**. No se invoca "si hay jank": se invoca
siempre, antes de dar la animación por terminada, porque la mitad de las
decisiones de performance no se pueden arreglar después sin reescribir el
tween.

**Para todo lo que no sea GSAP** (Lenis, Splitting, Web Animations API, view
transitions, una lib nueva) usá **Context7**: `resolve-library-id` y después
`query-docs`. Si Context7 no la tiene, buscá la doc oficial con `WebFetch`.
Nunca a memoria.

---

## Paso 2 — Verificar el runtime

GSAP **no está bundleado**. Vive en el embed de Custom Code de MAST, dentro de
la página de Webflow. Consecuencia directa: *qué plugins existen es un hecho
de runtime, no de build*, y un plugin que no está no tira error de compilación
— rompe en producción.

Antes de usar un plugin:

1. Leé `.claude/rules/animations/PLUGINS.md` — es la tabla de lo que está
   confirmado como cargado.
2. Si el plugin que necesitás figura como no confirmado, **pará y preguntale al
   usuario** que corra el snippet de verificación que está en ese archivo, en
   la consola del sitio de staging. No escribas código apoyado en un plugin sin
   confirmar, y no lo agregues vos al sitio.
3. Si falta, decile exactamente qué `<script>` agregar al embed de MAST y en
   qué orden (core primero, plugins después, `gsap.registerPlugin()` en
   nuestro código).
4. Actualizá `PLUGINS.md` con lo que se confirme.

En el código, **siempre** pasá por los guards de `src/utils/motion.js`:

```js
import { getGsap, getPlugin } from '../utils/motion.js'

const gsap = getGsap('nombre-del-componente')
if (!gsap) return

const ScrollTrigger = getPlugin('ScrollTrigger', 'nombre-del-componente')
if (!ScrollTrigger) return
gsap.registerPlugin(ScrollTrigger)
```

Una librería ausente tiene que dar markup estático, nunca una página rota.

---

## Paso 3 — Playground (cuando corresponde)

Armá un playground si el usuario lo pide, o si la animación es lo bastante
compleja como para que iterar en Webflow sea lento: scrub, pin, Flip, morph de
SVG, timelines de más de tres pasos, cualquier cosa con física o drag.

Para un fade o un stagger simple no hace falta — va directo al componente.

`playground/<nombre>/index.html`, standalone, se abre en el browser o se sirve
con el dev server que ya existe. **`playground/` está en `.gitignore`**: es
espacio de trabajo desechable, no se commitea y no llega al CDN.

Template completo, bloque de CDNs y reglas en
`references/playground.md`.

---

## Paso 4 — Construir

Dos caminos, y elegir bien importa:

### A) Primitivas reutilizables — `src/components/reveal.js`

Fades, slides de entrada, parallax de imágenes y reveals de texto se manejan
con **un solo componente manejado por atributos**, para que el usuario pueda
aplicarlos desde el Designer sin pedir código nuevo, y para que todo el sitio
comparta las mismas curvas.

Contrato de atributos (el detalle completo en `references/recipes.md`):

```html
<div data-anim="fade-up" data-anim-delay="0.1">…</div>
<div data-anim="stagger" data-anim-stagger="base">…</div>
<h2 data-anim="lines">…</h2>
<img data-anim="parallax" data-anim-speed="0.08">
```

Si `reveal.js` todavía no existe, crealo con `/create-component reveal` y
construilo con ese contrato antes de seguir.

**Nunca** hardcodees un fade en un componente de sección si `data-anim` ya lo
cubre. Duplicar reveals es exactamente cómo un sitio termina con seis fades
distintos.

### B) Componentes propios — los momentos especiales

El hero, el arco de la foto del doctor, el número del stat, el morph de un
SVG, la transición de los tabs: cada uno es su propio componente, con su
`data-component`, creado con `/create-component`.

Reglas en los dos casos:

- Importá los tokens de `src/utils/motion.js`. **Ningún número mágico en el
  código**: si necesitás una duración que no está en `DUR`, o es un error de
  criterio, o el token falta y hay que discutirlo. Los valores de tuning
  específicos de un componente van en un objeto UPPER_SNAKE arriba del
  archivo, como hace `nav.js`.
- Scopeá con `gsap.matchMedia()` usando las queries de `MQ`. Revierte solo,
  así que el componente no necesita hook de `resize`.
- `prefers-reduced-motion` es un estado de primera clase, no un apagado:
  mismo estado final, duración cero, sin travel. Se resuelve con un segundo
  `mm.add()` sobre `MQ.reduced`.
- Seguí el patrón de componente del proyecto: default export que recibe
  `elements`, guard clauses, hooks solo si se usan.

El lenguaje de movimiento del sitio — qué ease para qué, cuánto viaja cada
cosa, qué no se anima nunca — está en `references/motion-language.md`.
**Leelo antes de elegir un tiempo.**

---

## Paso 5 — Optimizar y proteger el primer paint

Los dos requisitos que toda animación de este sitio tiene que cumplir. No son
un paso de pulido opcional al final: son parte de la definición de "terminada".

### 5a. Optimización — obligatoria

Corré `/gsap-performance` y aplicá esto antes de considerar la animación lista:

- **Solo `transform` y `opacity`.** Cualquier otra propiedad dispara layout o
  paint en cada frame. La única excepción del sitio es el accordion, con el
  patrón de `height: 'auto'` de GSAP, que mide una vez.
- **`gsap.quickTo()`** para todo lo atado a `mousemove` o a `scroll`. Crear un
  tween nuevo por evento de puntero es el error de performance más común del
  rubro y el más fácil de evitar.
- **Medí una vez, cacheá.** Nada de `getBoundingClientRect()` dentro de un
  handler por frame. Invalidá la medición en el `refresh` de ScrollTrigger, no
  en cada tick.
- **Un trigger por grupo, no uno por elemento.** `ScrollTrigger.batch` para
  grillas y listas. Cuarenta triggers para cuarenta cards son treinta y nueve
  de más.
- **Los scrubs y los pins son lo caro.** Máximo 2–3 activos por viewport. Si
  necesitás más, la sección está haciendo demasiadas cosas a la vez.
- **`will-change` lo maneja GSAP.** No lo escribas en CSS: deja capas
  promovidas para siempre y se come memoria de GPU en mobile.
- **`gsap.matchMedia()` para scopear**, que además revierte solo. Una animación
  de desktop que sigue viva en mobile paga frames que nadie ve.
- **Nada de animar lo que no está en pantalla.** Sin trigger, sin tween.

**El budget, y se mide, no se estima:** grabá 6 segundos de scroll en el panel
de Performance con **CPU throttling 4x**. Tiene que dar sin long tasks (>50ms)
durante el init, sin frames largos sostenidos mientras scrollea, y sin
*recalculate style* en cada tick. Si no medís con throttling, estás probando en
un Mac y el visitante no tiene un Mac.

### 5b. Anti-FOUC — cuando la animación oculta su estado inicial

Toda animación que arranque desde un estado oculto o desplazado **tiene que
shippear su CSS de estado inicial**. Si el estado inicial solo vive en
`gsap.set()` hay un flash real: `main.js` es `defer` + import dinámico y GSAP
llega varios frames después de que el HTML ya está pintado, así que el
visitante ve el contenido en su lugar final y después lo ve saltar al inicial.

El CSS sí llega antes del primer paint: `dist/styles.css` entra como
stylesheet bloqueante desde el snippet del head.

```css
/* Estado inicial — llega antes del primer paint */
[data-anim] {
  opacity: 0;
}

/* Red de seguridad: si GSAP nunca cargó, o un elemento nunca se bindeó,
   a los 3s se revela igual. GSAP escribe opacity inline en todo lo que
   bindea, y el inline le gana a la clase, así que lo que sí está animando
   conserva su estado. */
html.anim-failsafe [data-anim] {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  [data-anim] {
    opacity: 1;
    transform: none !important;
  }
}
```

El failsafe se arma una sola vez, desde `global.js`:

```js
import { armFoucFailsafe } from '../utils/motion.js'
armFoucFailsafe()
```

Reglas:

- El CSS de estado inicial va en su propio archivo, importado desde el
  componente, para que salga en `dist/styles.css`.
- **Contenido crítico nunca se oculta.** Precio, dirección, teléfono, CTA de
  turno: aparecen, no se revelan. Si el JS falla, eso tiene que estar ahí.
- Si la animación **no** oculta nada — un hover, un parallax, un counter que
  arranca de un valor visible — no lleva CSS anti-FOUC. Decilo explícitamente
  en la doc del componente en lugar de dejarlo ambiguo.

## Paso 6 — QA

Corré la checklist de `references/qa.md` completa antes de decir que está
listo. Los dos gates del Paso 5 —el budget medido con throttling y el CSS
anti-FOUC— se verifican acá otra vez: si alguno no está, la animación no está
terminada. Lo que más rompe en este proyecto:

- **FOUC / CLS** — el estado inicial oculto tiene que estar en CSS, no solo en
  `gsap.set()`, o se ve el contenido un frame antes de que GSAP cargue.
- **Fuentes** — usá `whenLaidOut()` de `motion.js`. Un webfont que entra
  después de medir deja todos los triggers corridos.
- **Lenis** — si hay smooth scroll, ScrollTrigger tiene que estar conectado a
  su ticker o el scrub va a ir un frame atrasado.
- **Interacciones de Webflow (IX2)** — si Webflow ya anima el elemento, hay
  dos sistemas escribiendo el mismo estilo. Decidí uno; lo normal es apagar la
  interacción de Webflow.
- **Markers** — solo bajo `isDev()`. Jamás en producción.

---

## Paso 7 — Shippear

1. Portá el código del playground al componente, limpio: sin el HTML de
   referencia, sin los CDNs, sin restos de debug.
2. **Actualizá la doc en la misma respuesta** — lo pide `CLAUDE.md`:
   `.claude/rules/components/<nombre>.md` con propósito, atributo de Webflow,
   behavior, dependencias y expectativas de DOM. Si `reveal.js` ganó un
   `data-anim` nuevo, documentalo en su doc y en `references/recipes.md`.
3. Decile al usuario **los atributos exactos** para pegar en el Designer y qué
   interacción de Webflow apagar, si aplica.
4. No corras `npm run build` salvo que el usuario pida deployar.

---

## Referencias

- `references/motion-language.md` — el sistema de movimiento del sitio.
  Duraciones, eases, distancias, principios, y qué no se anima nunca.
- `references/recipes.md` — catálogo de patrones con su contrato de atributos:
  reveals, parallax, texto, tabs, slider, accordion, counter, Flip, morph SVG,
  marquee, pinned scrub, hover.
- `references/playground.md` — template del playground y bloque de CDNs.
- `references/qa.md` — checklist antes de shippear.
- `.claude/rules/animations/PLUGINS.md` — qué está cargado en el sitio.
- `.claude/rules/animations/SMOOTH-SCROLL.md` — decisión y wiring de Lenis.
