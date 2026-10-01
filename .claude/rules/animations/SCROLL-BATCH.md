# Las tres tandas de animación de scroll — el prompt y las decisiones

Redactado el **2026-09-21**. Es una orden de trabajo, no una regla.

> **EJECUTADO el 2026-09-21.** Las tres tandas están construidas, aplicadas en
> Webflow y medidas. Lo durable ya se mudó a
> `.claude/rules/components/reveal.md` y `components/plan.md`; lo que queda
> acá es el registro de qué se decidió y por qué. **Este archivo se borra
> cuando el sitio se publique y `/responsive` vuelva limpio** — hasta
> entonces sirve de checklist de lo que falta (ver *Lo que quedó abierto* al
> final).

> ⚠️ **El parallax del CTA Banner ya NO va — se apagó el 2026-09-28** a pedido
> de Pablo, junto con el `data-component="reveal"` de esa section. El prompt de
> más abajo todavía lo pide: **no lo re-apliques.** Photo Band tampoco lleva
> parallax (pasó a `fade` el 2026-09-25). Los dos cambios están en
> [components/reveal.md](../components/reveal.md).

## Lo que quedó abierto

1. **Publicar Webflow.** Todos los cambios de Designer están escritos y
   verificados leyéndolos de vuelta, pero no publicados.
2. **`npm run build` + commit de `dist/` + push.**
3. **Bumpear el hash del CDN en Webflow** — hoy `@216bb5a`, verificado
   curleando. Sin esto el JS y el CSS nuevos no llegan al sitio.
4. **`/responsive` sobre la Home**, sobre `/care` (el `cc-process`) y sobre
   una página con `Photo Band`.
5. **La foto de `.plan_media`** sigue sin definirse — ver `HOME-FIGMA-SYNC.md`.

## Tres cosas que aparecieron construyendo y no estaban previstas

- **`gsap.matchMedia()` con objeto de condiciones no tiene default.** Con
  `{ pinnable, reduced }`, un teléfono sin reduced-motion no matcheaba
  ninguna y el handler no corría nunca. Está en `CONVENTIONS.md`.
- **El eje autodetectado del filete necesitaba guard.** Una caja `2×0` elegía
  el eje equivocado y dejaba el filete invisible para siempre.
- **El budget del `height` animado pasó**, así que la caída a crossfade que
  este documento dejaba preparada **no hizo falta**: mediana 16.7ms y CLS 0
  con CPU a 4×.

## Lo que decidió Pablo

Cuatro decisiones, tomadas sobre las opciones que salieron de medir el DOM real
por MCP (no de memoria: se leyeron los árboles de los cuatro componentes).

| # | Decisión | Alternativas descartadas |
| --- | --- | --- |
| 1 | **`#plan` va como acordeón real, scrubeado y pineado** | Foco activo sin colapsar (era la recomendación), acordeón de click, sólo fade |
| 2 | **Los timelines entran uno por uno, una sola vez** | Scrubeado, o el bloque entero de una |
| 3 | **Parallax en CTA Banner, Photo Band y The Space** | `Section / Page Header` quedó afuera desde el principio; **`Section / Testimonials` se sacó el 2026-09-21** tras verlo — compite con el slider |
| 4 | **Sí se tocan las dos definiciones de componente** | Aplicar sólo donde ya clipea; no tocar Webflow |

## El parallax estaba rechazado y se reactivó

`components/reveal.md` registra que el **2026-09-15** Pablo vio la máscara y el
parallax en el playground y los **descartó como recursos** — no por dosis ni
por tuning. Todo se revirtió en Webflow ese mismo día y nunca se publicó.

El 2026-09-21 pidió parallax explícitamente. **Eso reactiva el parallax y sólo
el parallax.** La máscara (`data-anim="mask"`) sigue rechazada: no se propone
ni se aplica sin traerla a la conversación.

## El orden es 2 → 1 → 3, y no es el orden en que se pidió

Por riesgo, no por preferencia:

1. **Tanda 2** no toca estructura en Webflow. Si sale mal se revierte borrando
   un atributo.
2. **Tanda 1** modifica dos definiciones de componente con **14 instancias**
   entre las dos (CTA Banner ×9, Photo Band ×5).
3. **Tanda 3** agrega el **tercer pin de la Home**, que es lo único de las tres
   que puede romper algo que hoy funciona.

## Tres hechos del DOM que costaron medirlos

Los tres invalidan la solución obvia, así que están arriba y no enterrados en
el prompt:

- **El `Image` de MAST no acepta atributos.** No tiene props `Attribute Name` /
  `Attribute Value` — a diferencia de `Button`. Verificado leyendo sus 11 props
  en la definición de `Section / CTA Banner`. Por eso el parallax necesita una
  variante nueva cuyo hook vaya en **el contenedor que clipea** y no en la foto.
- **`Section / Photo Band` no clipea.** Su árbol es
  `section > .container > Image` y no hay ni un ancestro con `overflow: hidden`,
  así que `isClipped()` de `reveal.js` devuelve `false` y hoy el parallax se
  saltea con un warning.
- **`.four_row` tiene 5 hijos directos, no 4.** El filete `.four_rule` es
  **hermano** de los cuatro `.four_item`. Un stagger sobre hijos directos lo
  tomaría como item #1 y correría los otros cuatro.

## El acordeón pineado tiene una salida por escrito

Animar `height` en un scrub es layout por frame, que es exactamente lo que
`CONVENTIONS.md` prohíbe salvo para el accordion. **Si el budget con throttling
4× no pasa, la caída está definida de antemano**: un stage de alto fijo (el del
paso más alto) con los tres cuerpos superpuestos y un crossfade de `opacity` —
transform/opacity puro, cero layout. Mismo efecto de lectura.

Está escrito ahora para no improvisarlo cuando la medición falle.

---

## El prompt

Pegar tal cual en una sesión nueva.

````markdown
## Objetivo

Tres tandas de animación de scroll en el sitio de Schwabe, en este orden:

1. **Parallax reutilizable** para sections con imagen grande — `Section / CTA Banner`
   (9 instancias), `Section / Photo Band` (5), `Section / Testimonials` y
   `Section / The Space`.
2. **Entrada escalonada** para los componentes tipo timeline — `Section / Four Things`
   (3 instancias, 2 variants), el `.plan_steps` de la Home y el `cc-process` de
   `/care`.
3. **`#plan` como acordeón scrubeado dentro de un pin** — los tres pasos se abren y
   cierran atados a la posición de scroll.

Las tandas 1 y 2 extienden `src/components/reveal.js` con atributos nuevos. La
tanda 3 es un componente propio.

## Contexto

- **Stack**: Webflow + **MAST** (NO Client-First — no uses su vocabulario ni sus
  utilidades). Vanilla JS ES6+, Rollup, CSS extraído a `dist/styles.css`.
- **GSAP no está bundleado.** Vive en el toggle nativo de GSAP de Site Settings
  (`cdn.prod.website-files.com/gsap/3.15.0/`). Confirmados en runtime: **core,
  ScrollTrigger, SplitText, Flip**. Nada más. Ver `.claude/rules/animations/PLUGINS.md`.
  Todo acceso pasa por `getGsap()` / `getPlugin()` de `src/utils/motion.js`.
- **Ubicación del código**: `src/components/reveal.js` (tandas 1 y 2) y un componente
  nuevo `src/components/plan.js` creado con `/create-component plan` (tanda 3). CSS en
  `src/components/styles/<nombre>.css`, importado desde su `.js`.
- **Tokens obligatorios**: `DUR`, `EASE`, `DIST`, `STAGGER`, `SCROLL`, `MQ` de
  `src/utils/motion.js`. Cero números mágicos. El tuning propio del componente va en
  un objeto UPPER_SNAKE arriba del archivo.
- **Site id**: `6a9880576ec4624829beb2f5`. **Home**: `6a98805a6ec4624829beb376`.
- **Antes de escribir una línea de GSAP**: invocá `/gsap-scrolltrigger`, `/gsap-core`
  y `/gsap-performance`. No escribas GSAP de memoria — lo prohíbe la skill `animate`.
- **Historial que importa**: la variante `parallax` de `reveal.js` ya existe, está
  medida (2026-09-15) y fue **rechazada por el usuario ese mismo día**. Hoy se
  reactiva por pedido explícito. La variante `mask` sigue rechazada — **no la
  propongas ni la apliques**.

## Estructura HTML disponible

Medida por MCP el 2026-09-21. Los `styleNames` son literales.

### `Section / CTA Banner` — `7182c8c0-1361-e142-edbc-efc21b088094` (9 instancias)

```
DOM  section.section.cc-cta
└ DOM  div.container
  └ Block  div.card.cc-cta-card
    ├ ComponentInstance  Image        ← prop Class = "cc-media-fill u-z-index-2"
    ├ Block  div.cta_scrim
    └ Block  div.cta_content.u-z-index-2
```

**El `Image` es un `ComponentInstance` y no tiene props `Attribute Name` /
`Attribute Value`** (a diferencia de `Button`) — verificado leyendo sus 11 props. O
sea: **no hay forma de ponerle un `data-*` al `img`**. El hook tiene que ir en
`.card.cc-cta-card`, que es un `Block` y sí los acepta.

### `Section / Photo Band` — `82a560e3-6da8-7311-f80a-23cdcf606d51` (5 instancias)

```
Block  section.section.cc-media-band
└ Block  div.container
  └ Image  img.media-band_img          ← elemento Image NATIVO, sí acepta atributos
```

**No hay ningún ancestro con `overflow: hidden`.** `isClipped()` de `reveal.js`
devuelve `false`, así que hoy el parallax se saltea y logea un warning.

### `Section / Four Things` — `613ee37b-c54d-fa8c-82b7-f4a6ddcd3a8e` (3 instancias)

```
Block  section.section.cc-four
└ Block  div.container
  ├ Block  div.intro_layout  → .intro_head.cc-wide (Heading), .intro_copy (2× Plain Text)
  ├ Block  div.four_row
  │  ├ Block  div.four_rule            ← EL FILETE. Hermano de los items, no hijo
  │  ├ Block  div.four_item            ← .four_num + .doctor_heading
  │  ├ Block  div.four_item
  │  ├ Block  div.four_item
  │  └ Block  div.four_item
  └ Block  div.hero_actions.cc-center  → Button (CTA de turno)
```

`.four_row` tiene **5 hijos directos**, no 4. Variants: `Columns` (filete
horizontal) y `Stacked` / `Stacked Light` (filete vertical, `position: absolute`,
`left: 2.5rem; top: 2.6875rem; bottom: 8.4375rem`).

### `#plan` — markup suelto en la Home, elemento `774aa28f-25b7-4be2-aebc-b9567fc3793b`

```
Section  section#plan.section.cc-plan
└ Block  div.container
  ├ Block  div.plan_head      → .plan_eyebrow, h2.plan_title
  ├ Block  div.plan_grid
  │  ├ Block  div.plan_media          ← placeholder, todavía sin foto
  │  └ Block  div.plan_steps
  │     ├ .plan_line                  ← filete vertical
  │     └ .plan-step ×3               ← .plan-step_num + .plan-step_body
  │                                     (.plan-step_title, _text, _kicker)
  └ Block  div.plan_actions   → Button "Book Your 60-Minute First Visit"
```

**No es componente todavía** (está en el backlog de `COMPONENTS-NAMING.md`). No lo
componetices en esta tanda.

### `Section / Testimonials` — `a0f6c707-b09f-4619-3ee8-36ff6f750006`

`.testimonials_bg` ya es `position: absolute; inset: 0` dentro de una section con
`overflow: hidden`. **Es el único de los cuatro que no necesita cambio estructural.**

### `Section / The Space` — `16a05044-0f97-577d-9150-70ef2090204e`

**Sin medir.** Leé su árbol antes de tocarla y reportá si necesita wrapper.

## Comportamiento esperado

### Tanda 2 — la entrada escalonada (empezá por acá: cero riesgo estructural)

1. Construí la variante **`data-anim="stagger"`** en `BUILDERS` de `reveal.js`. Ya
   está especificada en `.claude/skills/animate/references/recipes.md` y nunca se
   construyó. El hook va en el **contenedor**; se animan sus **hijos directos**.
2. **Un solo ScrollTrigger por contenedor**, no uno por hijo. `once: SCROLL.once`,
   `start` de `SCROLL.start` (`top 85%`), `DUR.base`, `EASE.out`, `DIST.sm`,
   `STAGGER.base`. Todo overrideable por los `data-anim-*` del contrato que ya existe.
3. **`stagger` tiene que ignorar a los hijos directos que lleven su propio
   `data-anim`.** Es la única forma de que `.four_rule` no entre como item #1 y corra
   a los otros cuatro. Documentá esa regla en el contrato.
4. Construí la variante **`data-anim="rule"`** para el filete: `scaleX` o `scaleY` de
   0 a 1 con `transform-origin` en el borde que corresponda. **El eje se
   autodetecta** comparando ancho y alto del elemento, con override por
   `data-anim-axis="x|y"`. La autodetección no es cosmética: `Four Things` es **un
   solo componente** cuyo variant `Columns` tiene el filete horizontal y el
   `Stacked` vertical, y el atributo vive en la definición compartida.
5. Aplicá en el Designer, **en las definiciones** (no por instancia):
   - `Section / Four Things`: `data-component="reveal"` en la raíz,
     `data-anim="stagger"` en `.four_row`, `data-anim="rule"` en `.four_rule`.
   - Home `#plan`: `data-component="reveal"` en la section, `data-anim="stagger"` en
     `.plan_steps`, `data-anim="rule"` en `.plan_line`. **Sacá estos dos cuando
     entregues la tanda 3** — ahí `plan.js` toma el control.
   - `/care` `cc-process`: mismo patrón. Medí su árbol antes.
6. El CTA de turno de `Four Things` está en `.hero_actions.cc-center`, **fuera** de
   `.four_row`, y el de `#plan` en `.plan_actions`, **fuera** de `.plan_steps`.
   Ninguno de los dos se oculta ni se anima. Verificalo, no lo supongas.

### Tanda 1 — el parallax

1. Agregá la variante **`data-anim="parallax-media"`**, que se diferencia de la
   `parallax` que ya existe en **dónde va el hook**: en el *contenedor que clipea*, y
   el JS busca el `img` de adentro y lo deriva. Es lo único que resuelve el caso del
   `Image` de MAST, que no acepta atributos. La `parallax` actual (hook en el
   elemento que se mueve) se conserva para `.testimonials_bg`.
2. La matemática del sobrante es la misma y **no se puede simplificar**: el CSS le da
   al `img` `REVEAL.slack`% arriba y abajo (alto `100 + 2·slack`), así que derivar
   ±S% del alto del **CONTENEDOR** es `S / (1 + 2·slack/100)` en `yPercent` del
   **IMG**. `REVEAL.slack` (JS) y el `10%` del CSS son el mismo número y no pueden
   divergir.
3. **La regla CSS del sobrante lleva el selector repetido**:
   `[data-anim='parallax-media'][data-anim='parallax-media'] img { … }`. MAST pinta
   con `.u-img-cover { inset: 0% }`, que es (0,1,0) — con el atributo sin repetir
   empatan, y el empate lo decide el orden de carga de los stylesheets, que no
   controlamos. Medido: con el atributo simple ganaba MAST y aparecían costuras de
   38px y 46px.
4. Techo de deriva **0.08** (`REVEAL.maxSpeed`), clampeado. `EASE.linear`,
   `scrub: SCROLL.scrub`, `invalidateOnRefresh: true`, trigger en la section.
5. **Gate por pointer, nunca por ancho**: `(hover: hover) and (pointer: fine)`. Un
   teléfono acostado mide 844px y pasa limpio cualquier `max-width: 767px` —
   medido, daba 3 triggers en vez de 2.
6. Cambios en el Designer, **autorizados**, en las definiciones:
   - **`Section / Photo Band`**: insertá un `Block` (clase nueva `media-band_frame`)
     entre `.container` y el `Image`, con `overflow: hidden` y el radio que hoy
     tiene `.media-band_img`. `data-anim="parallax-media"` en ese wrapper.
   - **`Section / CTA Banner`**: `data-anim="parallax-media"` en `.card.cc-cta-card`.
     **Verificá primero que la card ya tenga `overflow: hidden`** — tiene radio 24px
     y una foto absoluta, así que probablemente sí, pero leelo, no lo asumas.
   - **`Section / Testimonials`**: `data-component="reveal"` en la raíz +
     `data-anim="parallax"` `data-anim-speed="0.08"` en `.testimonials_bg`. Sin
     cambio estructural.
   - **`Section / The Space`**: medí y decidí; reportá antes de escribir.
7. `data-component="reveal"` va en la **raíz de cada definición**. Las sections de la
   Home son `ComponentInstance`, así que un `query_elements` a nivel página devuelve
   **cero** matches para cualquier clase de adentro: usá `scope_component_id`.

### Tanda 3 — `#plan`, acordeón scrubeado con pin

1. Componente propio: `/create-component plan`. Hooks `data-plan`, `data-plan-stage`,
   `data-plan-steps`, `data-plan-step`, `data-plan-body`, `data-plan-num`. Los
   atributos van sobre `Block`s, nunca sobre `ComponentInstance`.
2. **Tres ramas de `gsap.matchMedia()`**, igual que `statement.js` y `cost.js`:

   | Rama | Condición | Qué hace |
   | --- | --- | --- |
   | Reduced | `MQ.reduced` | Los 3 pasos abiertos, sin pin, sin colapso |
   | Sin pin | `motionOk` y NO pinneable | Los 3 abiertos + el stagger de la tanda 2 |
   | Pineada | `(min-width: 768px) and (min-height: 600px)` y `motionOk` | El acordeón |

   **El `min-height: 600px` no es negociable.** Un teléfono acostado (844×390) cae en
   el breakpoint Tablet de Webflow y pasaría un `min-width: 768px` pelado, pero el
   nav sticky ya se come 70px de esos 390.
3. En la rama pineada: el stage se pinea, el timeline es scrubeado, y a lo largo del
   recorrido **el paso 1 se cierra mientras el 2 se abre, y el 2 mientras el 3 se
   abre**. Un solo `ScrollTrigger` con `pin` + `scrub` para toda la secuencia.
4. **La altura se mide una vez y se cachea.** Está prohibido un `height: 'auto'`
   recalculado por frame. Medí la altura natural de cada `[data-plan-body]` en el
   `onRefresh` del trigger, guardala en px, y scrubbeá entre `0` y ese valor.
   `height` es la **única** excepción del sitio a "sólo transform y opacity" y existe
   por el accordion; usala a conciencia y medila.
5. **Si el budget de performance no pasa, la salida está definida y es esta**: un
   stage de alto fijo (el del paso más alto) con los tres cuerpos superpuestos y un
   crossfade de `opacity` — transform/opacity puro, cero layout. Medí las dos y
   quedate con la que pase; reportá cuál y por qué.
6. **`refreshPriority: refreshOrder(el)` en todos los triggers de las tres tandas.**
   No es opcional. La Home ya pinea `statement` y `cost`, y `#plan` entra **entre los
   dos**: sin esto, el componente que se construya primero no recibe la distancia de
   pin del de arriba. Medido en vivo el 2026-09-15, `cost` arrancaba 900px antes y se
   pineaba encima del CTA banner. **Más alto = se refresca antes** — gsap.com lo dice
   así y la skill `/gsap-scrolltrigger` lo documenta **al revés**; ante la duda gana
   gsap.com.
7. **Nada de `anticipatePin`.** Adelanta el pin según la velocidad del scroll y ese
   adelanto es exactamente un solapamiento con la section de arriba: medido, 51px
   scrolleando normal y 400px scrolleando rápido.
8. **Esta es la 3ª section pineada de la Home.** Medí explícitamente que no haya
   solape entre `statement`, `#plan` y `cost` a tres velocidades de scroll, y que el
   alto total de la Home siga siendo razonable.

## Accesibilidad

- El acordeón de `#plan` **es scroll-driven, no interactivo**: no lleva `<details>`,
  ni `<button>`, ni `aria-expanded`. No hay nada que el visitante pueda abrir a mano,
  así que anunciar un control que no existe sería peor que no anunciar nada.
- Los cuerpos colapsados se ocultan con **`height: 0` + `overflow: hidden`**, nunca
  con `display: none` ni `visibility: hidden`: el contenido clipeado sigue en el
  árbol de accesibilidad y un lector de pantalla lo lee completo. **Si algún día
  entra un link dentro de un `.plan-step_body`, esto hay que rehacerlo** — un foco de
  teclado dentro de un contenedor clipeado scrollea la caja.
- `prefers-reduced-motion: reduce` es **un estado, no un apagado**: mismo estado
  final, duración cero, sin travel, sin pin. Rama propia con `mm.add(MQ.reduced, …)`.
- El parallax no toca contenido, así que no tiene implicancia de a11y — pero
  confirmá que el scrim de `CTA Banner` sigue dando AA sobre la foto después de que
  la foto se mueva. `components/cost.md` documenta que un scrim de `.2` sobre foto
  clara da p95 **2.74:1** y no llega.

## SEO / performance

- **Los tres cuerpos de `#plan` quedan siempre en el DOM.** Se colapsan visualmente,
  nunca se quitan. Google ve los tres.
- **Budget medido, no estimado**: 6 segundos de scroll en el panel de Performance con
  **CPU throttling 4×**. Sin long tasks >50ms durante el init, sin frames largos
  sostenidos, sin *recalculate style* en cada tick, CLS en 0.
- **Máximo 2–3 scrubs o pins activos por viewport.** Contá los de la Home después de
  esta tanda y reportá el número.
- `REVEAL.scrubBudget` está en 3 y avisa en dev. Con CTA Banner + Testimonials en la
  misma página vas a estar en 2; si sube, decilo.
- `will-change` lo maneja GSAP. **Nunca lo escribas en CSS** — deja capas promovidas
  para siempre y se come memoria de GPU en mobile.
- Markers **sólo bajo `isDev()`**.

## Restricciones técnicas

- **El guard de GSAP va antes de la primera línea que lo toca.** Un
  `gsap.registerPlugin()` a nivel de módulo tira `ReferenceError` sin GSAP y **aborta
  el módulo entero**, incluido el `armFoucFailsafe()` que existe justo para ese caso.
- **La espera de fuentes va FUERA del `matchMedia`**, con `onceLaidOut()` y nunca con
  `whenLaidOut()`. El segundo corre su callback **dos veces** a propósito: medido,
  construyendo con él quedaban **dos ScrollTriggers pineando la misma section**. Y lo
  que se crea dentro de un `.then()` adentro de un `matchMedia` **escapa a su
  contexto**: `mm.revert()` no lo revierte y el pin sobrevive al cambio de breakpoint.
- **Un estado inicial anti-FOUC nunca se escribe con `transform`** si GSAP va a
  animar ese mismo transform: se **componen**. Medido — un `translateY(100%)` en CSS
  más un `yPercent: 100` de GSAP dejaba el elemento al doble de distancia y fuera de
  pantalla. El anti-FOUC usa `opacity`; la posición inicial la pone `gsap.set()`.
- **Un scrub no lleva travel corto.** Un scrub no tiene duración propia: `DIST.sm`
  repartido sobre 360px de scroll da 0.03px por píxel y se lee como inestabilidad, no
  como entrada. En un scrub van `opacity` / `filter` / `scale` o un recorrido largo y
  deliberado. El parallax es la excepción explícita.
- **Toda regla nuestra que pise a MAST necesita MÁS especificidad, no la misma.** El
  empate lo decide el orden de carga de los stylesheets, que no controlamos. Repetí
  el atributo o antepuso un ancestro, y dejá escrito por qué.
- **Nada adentro de un widget de Webflow se posiciona con `transform`.**
- Seleccioná por `data-*`, **nunca por clases de MAST**.
- **`update_style` agrega, no reemplaza**: si la propiedad nueva tiene un longhand o
  alias viejo, pasá `remove_properties` en la misma pasada o queda un empate que
  decide el orden de serialización.
- **`"success"` del MCP no garantiza que la escritura persistió.** Leé de vuelta cada
  cambio estructural, instancia por instancia.
- **No corras `npm run dev`** — lo maneja el usuario. **No corras `npm run build`**
  salvo que el usuario pida deployar.

## Edge cases a manejar

- **Sin GSAP, o sin ScrollTrigger**: `console.warn` + `return`, markup estático
  legible. Nunca una página rota.
- **Failsafe de 3s** (`html.anim-failsafe`) sobre todo lo que se oculte. Para `#plan`
  la regla tiene que **abrir los tres pasos**, no sólo revelarlos: si GSAP no carga,
  dos tercios del copy quedarían colapsados para siempre.
- **El CSS de colapso de `#plan` va scopeado a la media query pinneable.** Abajo de
  768px o con viewport bajo, los tres pasos arrancan abiertos desde el CSS, así que
  en mobile —de donde viene la mayoría del tráfico— **no hay ventana en la que se
  esconda nada**.
- **`Section / Four Things` tiene 3 instancias y 2 variants.** El filete cambia de
  eje entre ellos y el atributo es compartido. Verificá las 3.
- **`Section / CTA Banner` tiene 9 instancias en 9 páginas.** Un cambio en la
  definición las toca todas. Revisá al menos 3 después de escribir.
- **Un elemento que tira durante su construcción** se logea y **se revela**, sin
  llevarse el resto de la página (el `try/catch` por elemento que `reveal.js` ya
  tiene).
- **Un `data-anim` desconocido se ignora** en silencio.
- **`.plan_media` está vacío** (placeholder sin foto). El pin tiene que funcionar
  igual y no colapsar la columna.
- **El sitio no tiene Lenis todavía.** Si se activa después, ScrollTrigger tiene que
  colgarse de su ticker o el scrub va un frame atrasado. Ver
  `.claude/rules/animations/SMOOTH-SCROLL.md`.

## Criterios de aceptación

Se mide con **Chrome headless por CDP** — el MCP de `chrome-devtools` está caído en
este entorno y la receta con el WebSocket nativo de Node está en
`.claude/rules/RESPONSIVE.md` §"Gotchas de instrumentación". **Nunca uses
`extraHttpHeaders` para bustear caché**: convierte los GET en requests con preflight
CORS, jsDelivr los rechaza, no carga jQuery y parece que rompiste el nav.

| # | Check | Cómo |
| --- | --- | --- |
| 1 | El parallax nunca asoma el borde de la foto | Ratio img/contenedor ≥ 1.2 y hueco ≤ 0 en todo el recorrido, en los 4 targets |
| 2 | `.four_rule` no entra en el stagger de items | 4 items animados, no 5, en los 2 variants |
| 3 | El filete se dibuja en el eje correcto | `Columns` horizontal, `Stacked` vertical |
| 4 | Un solo pin nuevo, y cero solape entre los 3 | Medido a 3 velocidades de scroll |
| 5 | `#plan` con reduced-motion / mobile / teléfono acostado 844×390 | 0 pins, 3 pasos abiertos |
| 6 | Sin GSAP → markup estático y failsafe a 3s | 0 elementos ocultos después de 3s, 3 pasos abiertos |
| 7 | Budget con CPU 4×, 6s de scroll en la Home | Sin frames >50ms, sin long tasks, CLS 0 |
| 8 | Cero scroll horizontal | Los 6 perfiles de `/responsive`, los 2 color schemes |
| 9 | El CTA de turno visible en todo momento | `Four Things`, `#plan` y `CTA Banner`, en todos los viewports |
| 10 | Parallax apagado en touch | 844×390 e iPad landscape 1024: el trigger no existe |

### Al entregar

1. **Actualizá la doc en la misma respuesta** — lo exige `CLAUDE.md`:
   `.claude/rules/components/reveal.md` (las variantes nuevas y su contrato),
   `.claude/rules/components/plan.md` (nuevo), `references/recipes.md` de la skill
   `animate`, `.claude/rules/HOME-FIGMA-SYNC.md` (item 4 — el acordeón deja de ser
   "pendiente de decisión") y `.claude/rules/RESPONSIVE.md` si aparece una regla nueva.
2. Decí **los atributos exactos** que quedaron en el Designer, componente por
   componente, y qué interacción nativa de Webflow hay que apagar si aplica.
3. Recordá el gate de deploy: **nada de esto llega al sitio** hasta `npm run build` +
   commit de `dist/` + push + **bumpear el hash pinneado del CDN en Webflow**. Hoy
   está en `@c1bd42f`, no en `@main`. Verificalo curleando, no de memoria:
   `curl -s https://schwabe.webflow.io/ | grep -o 'schwabe-chiropractic@[^/]*'`
4. Corré `/responsive` sobre la Home y sobre una página con `Photo Band` y `Four
   Things` antes de dar nada por cerrado.
````
