# plan

## Purpose

La section `#plan` de la Home ("Three steps to moving the way you want to
again"). En desktop los tres pasos se comportan como un **acordeón manejado
por el scroll** dentro de un pin: el paso 1 arranca abierto y cada uno le pasa
la posta al siguiente a medida que se scrollea.

Es el tercer pin de la Home, después de `statement` y antes de `cost`.

## Scroll y click son el mismo mecanismo

Se abre solo con el scroll **y** se puede abrir con un click o con el teclado
(pedido de Pablo el 2026-09-21).

**Un click no cambia el estado: mueve el scroll.** Cada paso conoce el punto
del pin en el que le toca estar abierto, y clickearlo hace
`window.scrollTo({ behavior: 'smooth' })` hasta ahí; el scrub abre el paso
exactamente como lo habría abierto la mano. Eso deja **una sola fuente de
verdad**: no hay un estado "abierto por click" que pueda desincronizarse del
scroll, que es el modo de falla clásico de mezclar las dos cosas.

Los puntos se **derivan del timeline** (`tl.labels`, `tl.duration()`), así que
cambiar `hold` o `swap` los mueve solos.

**El scroll suave es el nativo, no ScrollToPlugin** — ese plugin no está
cargado en el sitio (`animations/PLUGINS.md`) y el del navegador ya respeta
`prefers-reduced-motion`.

### Accesibilidad: ahora sí hay un control

Mientras fue sólo scroll no llevaba `role` ni `aria-expanded`, porque anunciar
un control inexistente es peor que no anunciar ninguno. Con el click, cada
paso es un control de verdad y lo declara: `role="button"`, `tabindex="0"`,
`aria-controls` apuntando a su detalle, y `aria-expanded`.

**`aria-expanded` sigue al scroll, no sólo al click.** Si sólo se actualizara
al clickear, un lector de pantalla diría lo contrario de lo que se ve apenas
alguien scrollea. Es una comparación de enteros por frame y sólo escribe en el
DOM cuando el paso activo cambia.

`Enter` y `Espacio` abren; el `preventDefault` del espacio es obligatorio o la
página scrollea en vez de abrir.

**Todo esto vive sólo en la rama pineada.** Abajo de 992px, con viewport bajo
o con reduced motion los tres pasos ya están abiertos y no se cablea nada — ni
handlers ni `role` ni cursor. Un `cursor: pointer` ahí prometería una
interacción que no existe.

El copy de los tres pasos **está siempre en el DOM**. Un paso cerrado se
clipea (`height: 0` + `overflow: hidden`), nunca se saca ni se le pone
`display: none`: el contenido clipeado sigue en el árbol de accesibilidad y un
lector de pantalla lee los tres completos. Google también.

**Si algún día entra un link dentro de un `.plan-step_body`, esto hay que
rehacerlo**: un foco de teclado adentro de un contenedor clipeado scrollea la
caja y el visitante termina en un lugar que no eligió.

## Webflow Setup

Aplicado el **2026-09-21** sobre el markup suelto de la Home (`#plan` todavía
no es componente — está en el backlog de `COMPONENTS-NAMING.md`).

| Atributo | Dónde |
| --- | --- |
| `data-component="plan"` | `section#plan.cc-plan` |
| `data-plan-stage` | `.plan_grid` — es lo que se pinea |
| `data-plan-steps` | `.plan_steps` — la columna que se bloquea en alto |
| `data-plan-step` | cada `.plan-step` (×3) |
| `data-plan-body` | `.plan-step_body` (×3) — **lo que se atenúa**, ver abajo |
| `data-plan-detail` | `.plan-step_detail` (×3) — **elemento nuevo** |

### El wrapper `.plan-step_detail` hubo que crearlo

El título vive **adentro** de `.plan-step_body`, junto al texto y el remate:

```
.plan-step_body
├── h3.plan-step_title      ← tiene que quedar SIEMPRE visible
├── p.plan-step_text
└── p.plan-step_kicker
```

Un acordeón necesita que el título sobreviva al colapso, así que se creó
`.plan-step_detail` (flex column, `row-gap: 1.0625rem`, `overflow: hidden`) y
se movieron adentro `_text` y `_kicker`. El `row-gap` es **el mismo** que
tenía `.plan-step_body`, para que el ritmo vertical no cambie.

**El `id="plan"` no se toca**: es un ancla del handoff. Intentar escribirlo con
`set_attributes` falla con *"An internal error occurred"* — el `id` de un
elemento es un **setting** de Webflow, no un atributo.

### El dim va en el CUERPO, no en el paso — y eso es un arreglo

Reportado el **2026-09-22** como *"en el accordion se overlapean los números y
las líneas"*, con captura: la regla vertical cruzaba el **2** y el **3**, pero
no el **1**.

La causa no es la geometría. `.plan_steps::before` está en `left: 2.4375rem`
(39px) con 2px de ancho, o sea centrada en los 80px de `.plan-step_num` — que
es lo que dibuja el Figma. **Lo que tapa la regla es el propio disco**:
`.plan-step_num` tiene `background-color` = Forest Green, el **mismo** color que
la section, así que no se ve como disco pero recorta la línea a su paso. El
hueco alrededor de cada numeral no es un hueco dibujado, es una máscara.

`PLAN.dim` se aplicaba a `[data-plan-step]`, o sea al paso entero, disco
incluido. **Una máscara al 40% de opacidad deja de enmascarar**: la línea
reaparece por debajo. Por eso fallaba exactamente en los dos pasos atenuados y
no en el que está abierto.

El arreglo es mover el dim un nivel adentro, a `[data-plan-body]`. El numeral
queda siempre opaco —que además es lo que muestra el Figma, donde los tres
números se leen igual de presentes— y la máscara deja de depender del estado de
la animación.

**La regla general**: si un elemento tapa algo pintándose del color del fondo,
no puede estar dentro de nada que anime `opacity`. Es una máscara, no un
adorno, y la opacidad la rompe en silencio.

`dimTargets` cae de vuelta a los pasos si falta el hook, así que una copia de
este markup sin `data-plan-body` atenúa de más en vez de no atenuar nada.

## Behavior

- **Init**: espera la fuente con `onceLaidOut()`, abre `gsap.matchMedia()` con
  tres caminos y, en el pineado, mide, bloquea el alto y construye un timeline
  scrubeado.
- **Resize**: no se usa. `matchMedia` revierte lo suyo y el re-measure va en el
  `onRefreshInit` del trigger, que es donde ScrollTrigger ya recalcula.
- **Breakpoint**: no se usa.

### Los tres caminos

| Camino | Condición | Qué hace |
| --- | --- | --- |
| Reduced | `prefers-reduced-motion: reduce` | Los 3 pasos abiertos. Sin pin, sin colapso, sin travel |
| Sin pin | `motionOk` y NO pinneable | Los 3 abiertos + entrada escalonada, `once` |
| Pineado | `(min-width: 992px) and (min-height: 600px)` + `motionOk` | El acordeón |

**El gate es 992, no 768**, y se apartó del spec a propósito: en `medium`
`.plan_grid` colapsa a una columna, así que media y pasos se apilan y el stage
pasa de ~492px a ~978px — más alto que el viewport de un iPad portrait una vez
que el nav sticky se come sus 70px. La mitad de altura (`min-height: 600px`)
es la de siempre: un teléfono acostado mide 844px de ancho y pasaría cualquier
gate que mire sólo el ancho.

### El alto de la columna se BLOQUEA, y ése es todo el truco

Un acordeón manejado por scroll que deja crecer y encoger su contenedor
**cambia el alto del documento mientras el visitante scrollea**, y la posición
de scroll salta. Por eso la columna se fija en

```
alto = (los tres pasos cerrados) + (el detalle más alto)
```

y ese alto no cambia nunca. Medido en la Home real, 201 posiciones de scroll:
**el documento se mantiene en 17062px y la columna en 492px**, invariantes.

La medición se hace con `height: 'auto'` inline y no con `clearProps`: el
estado colapsado se shippea en CSS, así que limpiar el inline volvería a
aplicar `height: 0` y mediría cero.

### `height` es la excepción, y pasó el budget

`CONVENTIONS.md` permite animar `height` sólo con el patrón del accordion —
medir una vez, no por frame. Acá se mide en el `onRefreshInit` y los valores
entran al timeline como **funciones**, que `invalidateOnRefresh` vuelve a
evaluar.

Había una caída documentada por si el budget no daba (un stage de alto fijo
con los tres cuerpos superpuestos y crossfade de `opacity`). **No hizo falta**:
con CPU a 4× y 6 segundos de scroll continuo a través del pin, mediana
**16.7ms**, p95 **16.7ms**, peor frame **16.8ms**, **0 frames >50ms** y
**CLS 0**.

### El filete vertical es un pseudo-elemento

`.plan_steps::before` dibuja la línea, y un pseudo-elemento **no es un target
de GSAP**. La vía es una custom property: el Designer tiene
`transform: scaleY(var(--plan-line, 1))` y el componente anima `--plan-line`
de 0 a 1. El fallback del `var()` es `1`, así que sin JS la línea simplemente
está.

## Anti-FOUC

Sí, y con una vuelta de tuerca respecto del resto del sitio.

- `[data-plan-step] { opacity: 0 }` — el estado inicial de siempre.
- **El colapso va scopeado a la media query que recibe el pin.** Abajo de
  992px, con viewport bajo o con reduced motion, los tres pasos arrancan
  abiertos desde el CSS: **no hay ninguna ventana en la que un teléfono
  esconda dos tercios del copy**. La mayoría de las visitas a una clínica
  local vienen de un teléfono.
- **El failsafe tiene que ABRIR, no sólo revelar.** Un paso cerrado está
  oculto por `height`, así que `html.anim-failsafe [data-plan-detail]` pone
  `height: auto`. Sin eso, un GSAP que no carga dejaría dos tercios del copy
  clipeado para siempre. No necesita `!important`: es (0,2,1) contra el
  (0,1,0) de la regla de colapso.

Medido con GSAP bloqueado por red: a los 900ms hay **4 items ocultos, 3 pasos
ocultos y 2 detalles colapsados** (el paso 1 abierto, como manda la regla
`:first-child`); a los 3.6s el failsafe deja **todo en cero**.

## Dependencies

- **GSAP core + ScrollTrigger**, vía `getGsap()` / `getPlugin()`. **No usa
  SplitText ni ningún otro plugin.** Si falta alguno: `console.warn` y return,
  markup estático.
- De `src/utils/motion.js`: `DUR`, `DIST`, `EASE`, `STAGGER`, `SCROLL`, `MQ`,
  `onceLaidOut`, `refreshOrder`, `isDev`.
- `./styles/plan.css`.

## DOM Expectations

```
section#plan.cc-plan[data-component="plan"]
└── .container
    ├── .plan_head                           ← no se anima
    ├── .plan_grid[data-plan-stage]          ← lo que se pinea
    │   ├── .plan_media
    │   └── .plan_steps[data-plan-steps]     ← alto bloqueado
    │       └── .plan-step[data-plan-step]  ×3
    │           ├── .plan-step_num
    │           └── .plan-step_body
    │               ├── h3.plan-step_title   ← siempre visible
    │               └── .plan-step_detail[data-plan-detail]
    │                   ├── p.plan-step_text
    │                   └── p.plan-step_kicker
    └── .plan_actions                        ← el CTA de turno, NO se anima
```

Con menos de dos pasos, o si a algún paso le falta su `[data-plan-detail]`, el
componente logea y **sale sin tocar nada**: no hay acordeón posible y el
markup estático se lee perfecto.

## Tuning

Arriba de `src/components/plan.js`, en `PLAN`:

| Clave | Valor | Qué es |
| --- | --- | --- |
| `pin` | `'+=160%'` | Scroll que consume el pin |
| `hold` | `1` | Largo relativo del tramo en que un paso está abierto |
| `swap` | `1` | Largo relativo de una entrega. Sólo importa la razón con `hold` |
| `start` | `'top 18%'` | Dónde estaciona el stage. **No `top top`**: el nav sticky mide ~70px y un stage pegado a él se lee como un choque |
| `dim` | `0.4` | Opacidad de los pasos que no se están leyendo |
| `pinnable` | `(min-width: 992px) and (min-height: 600px)` | Ver arriba |

## Cómo se verificó

Medido con Chrome headless por CDP el **2026-09-21**, contra el **bundle real**
compilado con Rollup, y en dos escenarios: un harness con el markup nuevo, y
**una copia local de la Home publicada** con las ediciones de esta sesión
reproducidas por script (que es lo único que permite medir los tres pins
juntos antes de deployar).

| Check | Resultado |
| --- | --- |
| Un solo pin nuevo | ✅ |
| Los 3 pins de la Home sin solaparse | ✅ `statement` 1900→2260, `plan` 4637→6077, `cost` 10764→13689. Huecos de 2377 y 4687px |
| Alto del documento durante todo el scroll | ✅ **17062px invariante** en 201 posiciones |
| Alto de la columna de pasos | ✅ **492px invariante** |
| Un solo paso abierto (salvo durante la entrega) | ✅ máximo 2 en el cruce, que es la animación |
| Solape entre sections visibles | ✅ 0px |
| reduced-motion | ✅ 0 triggers, 3 pasos abiertos |
| 768×1024 · 844×390 · 390×844 · 320×568 | ✅ 0 pins, 3 pasos abiertos, CTA visible |
| iPad landscape 1024×768 touch | ✅ 1 pin, sin parallax |
| Sin GSAP → failsafe a 3s | ✅ 2 detalles colapsados → 0 |
| Budget CPU 4×, 6s de scroll | ✅ mediana 16.7ms, p95 16.7ms, 0 frames >50ms, **CLS 0** |
| Scroll horizontal | ✅ 0 en los 6 perfiles |
| El CTA de turno visible | ✅ en todos los viewports y en todo el recorrido |
| Click en los 3 pasos (2026-09-21) | ✅ scrollea a 5942 / 5366 / 4790, abre el correcto, uno solo a la vez |
| `role` / `tabindex` / `aria-expanded` | ✅ los tres pasos, y `aria` sigue al scroll |

**Lo que NO está verificado**: nada de esto corrió en el sitio publicado.
Faltan **publicar Webflow** y **bumpear el hash del CDN** (hoy `@216bb5a`), y
después `/responsive` sobre la Home.

## Pendiente

- **`.plan_media` sigue siendo un placeholder** (`height: 28.5625rem`, fondo
  beige-muted, sin foto). El pin funciona igual, pero hay que decidir la foto
  — ver `HOME-FIGMA-SYNC.md`.
- **`#plan` no es componente todavía.** Cuando se convierta a
  `Section / Plan`, estos atributos se mudan a la definición.
