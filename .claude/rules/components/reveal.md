# reveal

## Purpose

La primitiva de entrada del sitio. **Un solo componente manejado por
atributos**, para que una animación nueva sea un atributo en el Designer y no
un archivo nuevo acá — y para que todas las entradas del sitio compartan las
mismas curvas.

Siete variantes construidas:

| Variante | Desde | Qué hace |
| --- | --- | --- |
| `mask` | 2026-09-15 | Revela una imagen con el borde barriendo **hacia arriba, contra el scroll** |
| `words` | 2026-09-15 | Entrada del texto palabra por palabra (SplitText) |
| `parallax` | 2026-09-15 | Deriva scrubeada. El hook va **en el elemento que se mueve** |
| `parallax-media` | 2026-09-21 | La misma deriva, pero el hook va **en el contenedor que clipea** y se mueve el `img` de adentro |
| `stagger` | 2026-09-21 | Los hijos directos entran de a uno, una sola vez |
| `rule` | 2026-09-21 | Un filete decorativo se dibuja solo a lo largo de su eje largo |
| `fade` | 2026-09-25 | Opacidad y nada más. **La única variante sin CSS anti-FOUC**, a pedido |

Las otras cuatro especificadas en `.claude/skills/animate/references/recipes.md`
(`fade-up/-down/-left/-right`, `lines`, `scale-in`) **no están
construidas**. Entran en el objeto `BUILDERS` sin tocar nada más.

## Webflow Setup

`data-component="reveal"` va en la **section**; los `data-anim` en los
elementos de adentro.

| Atributo | Valores | Default |
| --- | --- | --- |
| `data-anim` | `mask` `words` `parallax` `parallax-media` `stagger` `rule` `fade` | — |
| `data-anim-delay` | segundos | `0` |
| `data-anim-duration` | `quick` `base` `slow` `hero` | `slow` en `mask`, `base` en `words` |
| `data-anim-distance` | `sm` `md` `lg` | `sm` (sólo `words`) |
| `data-anim-stagger` | `tight` `base` `loose` | `tight` (sólo `words`) |
| `data-anim-speed` | 0–**0.08** (sólo `parallax`) | `0.08` |
| `data-anim-start` | override del `start` de ScrollTrigger | `top 85%` |
| `data-anim-mobile` | `off` para no animar en touch · `on` para forzar | según variante |
| `data-anim-axis` | `x` `y` — override del eje de `rule` | autodetectado |

**`data-anim-speed` se clampea a 0.08**, no a 0.15 como decía el contrato
original. `motion-language.md` fija el techo del parallax en ±8% del alto del
elemento: más que eso se nota como efecto y deja de leerse como profundidad.
El contrato se corrigió, no el lenguaje de movimiento.

### Dónde está aplicado

Aplicado el **2026-09-21** en las **definiciones de componente** (no por
instancia), salvo `cc-process` que es markup suelto de la página.

| Componente / página | Elemento | Atributo |
| --- | --- | --- |
| `Section / Four Things`<br>`613ee37b-…` (3 instancias) | raíz | `data-component="reveal"` |
| ″ | `.four_row` | `data-anim="stagger"` |
| ″ | `.four_rule` | `data-anim="rule"` |
| `Section / Photo Band`<br>`82a560e3-…` (5 instancias) | raíz | `data-component="reveal"` |
| ″ | `.media-band_frame` | `data-anim="fade"` — **era `parallax-media` hasta el 2026-09-25** |
| `Section / Stories Outro`<br>`08741b21-…` (Patient Stories) | raíz | `data-component="reveal"` |
| ″ | `.stories-intro_copy` | `data-anim="fade"` `data-anim-delay="0.2"` |
| `Section / The Space`<br>`16a05044-…` | raíz | `data-component="reveal"` |
| ″ | `.space_frame` — **elemento nuevo** | `data-anim="parallax-media"` |
| Care Hub, `#first-visit` | `section.cc-process` | `data-component="reveal"` |
| ″ | `.process_grid` | `data-anim="stagger"` |
| ″ | los 2 `.process_rule` | `data-anim="rule"` |

**`Section / Page Header` quedó afuera** del parallax por decisión de Pablo:
es lo primero que se ve al cargar, así que la deriva arrancaría a mitad de
recorrido.

**`Section / Testimonials` también quedó afuera, y es la segunda vez.** Se le
aplicó el 2026-09-15 y se revirtió ese día; se volvió a aplicar el 2026-09-21
y Pablo lo sacó otra vez el mismo día — *"desactivá la animación de parallax
en el slider"*. La foto de fondo vive **detrás del slider de Swiper**, y una
deriva atrás de un carrusel que ya se mueve solo compite con él en vez de dar
profundidad. El componente quedó sin `data-component` y sin `data-anim`:
verificado leyéndolo de vuelta, cero hooks. **No volver a proponerlo sin
traerlo a la conversación.**

**La máscara sigue rechazada.** El 2026-09-15 Pablo descartó `mask` y
`parallax` viéndolos en el playground; el 2026-09-21 **reactivó sólo el
parallax**. Antes de volver a proponer un reveal enmascarado, traerlo a la
conversación.

### Los dos elementos que hubo que crear

Ni `Photo Band` ni `The Space` clipeaban, y sin un ancestro que clipee la
deriva muestra el borde de la foto:

| Componente | Antes | Ahora |
| --- | --- | --- |
| `Photo Band` | `section > .container > Image` | `… > .media-band_frame > Image`. El frame se quedó con el `aspect-ratio` (1360/812) y el radio; `.media-band_img` pasó a `position: absolute; inset: 0; height: 100%` |
| `The Space` | `section > Image` (suelto) | `section > .space_frame > Image`. El frame sólo clipea: el `.img-component` de MAST ya aporta el alto |

**Un `ComponentInstance` no sirve de ancla para insertar** — tira *"Cannot
insert elements directly into a component instance"* y *"Cannot move an
element before a component instance"*. Hay que appendear al padre y después
`move_element` usando un hermano que **no** sea instancia.

## Behavior

- **Init**: espera la fuente con `onceLaidOut()`, abre un `gsap.matchMedia()`
  con dos ramas y construye cada `[data-anim]` según su variante.
- **Resize**: no se usa. `matchMedia` revierte lo suyo e `invalidateOnRefresh`
  recalcula el parallax.
- **Breakpoint**: no se usa.

### `mask` — el reveal contra el scroll

**No usa `clip-path` y no necesita ningún elemento nuevo en el Designer.** Las
dos capas que hacen falta ya existen en el DOM de MAST:

```
.doctor_media        overflow: hidden  ← la ventana, y el arco que recorta
└ .cc-media-abs      position: absolute; inset: 0   ← la cortina
   └ img.u-img-cover position: absolute; inset: 0   ← la foto
```

La cortina sube `yPercent: 100 → 0` y la foto contra-mueve `-100 → 0`. **Los
dos transforms se cancelan**: la suma es constante, así que la foto queda
quieta y lo único que viaja es el borde del reveal — hacia arriba, contra el
scroll. Transform puro, compositor, sin repaint.

Medido el 2026-09-15 scrubeando el timeline contra el bundle real:

| progress | cortina | foto | alto de la foto |
| --- | --- | --- | --- |
| 0 | +680px (una ventana entera abajo, clipeada) | −20.4 | 720.8 |
| 0.5 | 85 | −2.6 | 685.1 |
| 1 | 0 | 0 | 680 |

Los 20.4px que se mueve la foto **no son translate**: son el `settle` de
escala (`REVEAL.settle = 1.06`, o sea 720.8 → 680). Poner `settle: 1` deja la
foto absolutamente quieta — medido, deriva 0.0px.

**Se descartó un contra-movimiento parcial.** Con `counter: 0.65` la foto
derivaba **195.7px**, cuatro veces `DIST.lg`. `motion-language.md`: el viaje es
una pista de dirección, no un recorrido.

**El fallback de `clip-path`** existe para elementos sin capa interna que
mover — un bloque de texto, una card. Anima `inset(100% 0 0 0) → inset(0…)`
sobre el elemento mismo. **Esa rama repinta la región clipeada en cada
frame**, así que es la cara; se toma sola cuando no hay nada mejor.

### `words` — el texto

`SplitText` con `type: 'words'`, `STAGGER.tight`, `y: DIST.sm`.

`aria` queda en su default `'auto'`: pone `aria-label` con la frase entera en
el contenedor y `aria-hidden` en cada palabra, así el lector de pantalla lee
la oración y no 17 fragmentos. **Verificado**: `aria-label` presente en el
bundle, y ausente en la rama de reduced-motion (donde no hay split).

**El `revert()` del split es a mano**, en el cleanup que devuelve el callback
de `matchMedia`, y con la instancia guardada. `mm.revert()` deshace tweens y
triggers; el split reescribió el DOM y eso sólo lo deshace su propia
instancia.

**El encadenado con la máscara es por `data-anim-delay`, no por label.** Un
label compartido exigiría que los dos elementos vivan en el mismo timeline, y
eso pide un atributo de agrupación que el contrato no tiene. Con `0.45` el
texto entra mientras la cortina termina y los dos se leen como un gesto.

### `parallax` — la deriva

Atado al cruce de la section por el viewport, `scrub: SCROLL.scrub` (1),
`EASE.linear`, `invalidateOnRefresh`.

**Un scrub con travel corto está prohibido** por `motion-language.md` desde el
bug de `cc-statement`; un parallax es el caso que la regla exceptúa
explícitamente — un recorrido largo y deliberado.

Es un **tween scrubeado, no un `quickTo` alimentado desde `onUpdate`** como
decía el spec original de `recipes.md`. Un tween con `scrub: 1` ya es un solo
tween reusado cuyo progreso maneja ScrollTrigger, con el mismo lerp de
catch-up y la mitad del código.

Si ningún ancestro clipea, **no anima** y logea un warning: sin `overflow:
hidden` la deriva muestra el borde de la foto.

### `parallax-media` — la misma deriva, un nivel más arriba

Idéntica a `parallax` salvo en **dónde vive el hook**: en el contenedor que
clipea, y el JS busca el `img` de adentro.

**No es una comodidad.** El `Image` de MAST es un `ComponentInstance` y
Webflow rechaza atributos ahí — verificado leyendo sus 11 props en la
definición del CTA Banner: a diferencia de `Button`, **no tiene
`Attribute Name` / `Attribute Value`**. No hay forma de ponerle un `data-*` a
ese `<img>`, así que el hook tiene que ir en un `Block` que lo envuelva.

La diferencia de chequeo importa: `parallax` recorre **ancestros** buscando
uno que clipee, `parallax-media` le pregunta **al hook mismo**, porque el hook
es la ventana. Por eso `.testimonials_bg` sigue usando `parallax`: es
`absolute; inset: 0` pero no clipea él, clipea la section.

El CSS repite el atributo por la misma razón de siempre, y además **restablece
`position: absolute`**: sin eso, `top` y un `height` porcentual no tienen
contra qué resolver y la deriva no hace nada en silencio — que es exactamente
lo que pasaba con `.media-band_img` antes de que existiera el frame.

### `stagger` — los timelines

Los hijos directos entran de a uno, `once`, con un **solo ScrollTrigger para
todo el grupo**. Es lo que usan Four Things, el `cc-process` de `/care` y (en
su rama sin pin) los pasos de `#plan`.

**Los hijos que llevan su propio `data-anim` se saltean**, y ese filtro es lo
único que hace que la variante sirva acá: `.four_row` tiene **cinco** hijos
directos, no cuatro — el filete `.four_rule` es **hermano** de los cuatro
`.four_item`. Sin el filtro se animaría dos veces y, peor, ocuparía el lugar
#1 y correría los cuatro items un paso de stagger. Lo mismo en
`.process_grid`, que alterna `process_col` / `process_rule`.

**Es `fromTo`, no `from`.** `reveal.css` ya shippea `opacity: 0` en esos
hijos, así que un `from()` leería el 0 computado como estado **final** y
animaría de nada a nada.

### `rule` — el filete que se dibuja

`scaleX` o `scaleY` de 0 a 1, con el `transform-origin` en el borde que
corresponde.

**El eje se mide, no se declara.** `Section / Four Things` es **un solo
componente** cuyo variant `Columns` tiene el filete horizontal y el `Stacked`
vertical, y el atributo vive en la definición compartida: un eje hardcodeado
estaría mal en uno de los dos. `data-anim-axis="x|y"` lo fuerza cuando haga
falta.

**Una caja degenerada se revela y se saltea, nunca se adivina.** Que cualquiera
de las dos dimensiones sea cero significa o que el filete está apagado en ese
breakpoint (0×0), o que su geometría todavía no resolvió. Medido el
2026-09-21 sobre un filete vertical cuyos insets absolutos superaban a su
padre: volvió **2×0**, `width >= height` leyó `2 >= 0`, eligió el eje
equivocado, y `scaleX(0)` sobre un filete de 2px de ancho es **invisible para
siempre**. Un filete real es largo en una dirección y fino en la otra, nunca
cero en ninguna, así que el guard no cuesta nada.

## La matemática del sobrante, y el bug que encontró

`reveal.css` le da a la foto `REVEAL.slack`% de sobrante arriba y abajo, o sea
alto `(100 + 2·slack)%` del contenedor. Mover la foto ±S% del alto del
**CONTENEDOR** es, en `yPercent` de la **FOTO**, `S / (1 + 2·slack/100)`.
**Sin esa división se asoma el borde.**

Y hay un segundo escalón que costó una medición. La regla va con **el atributo
repetido**:

```css
[data-anim='parallax'][data-anim='parallax'] { top: -10%; height: 120% }
```

MAST pinta la media con `.u-img-cover { position: absolute; inset: 0% }`, que
es **(0,1,0) — la misma especificidad** que `[data-anim='parallax']` sola.
**Empatan, y el empate lo decide el orden de carga, que no controlamos.**
Medido con el atributo simple: ganaba el `inset: 0` de MAST, el ratio
foto/section daba **1.000** y aparecían costuras de **38px y 46px**. Repetido
es (0,2,0) y gana siempre. Es el mismo truco que `button.css`.

El sobrante es **10% y no 8%** aunque el techo de deriva sea 8%: con 8 la
cuenta cierra exacto y el borde quedaba medido en **0.0px de margen**, sin
nada para un redondeo subpíxel. Con 10 quedan ~2% de tolerancia.

`REVEAL.slack` en el JS y el `10%` del CSS son **el mismo número y no pueden
divergir** — la división del drift lo usa.

## Scope

| Variante | Desktop | Touch (sin `hover: hover` + `pointer: fine`) |
| --- | --- | --- |
| `mask` | Sí | Sí |
| `words` | Sí | Sí |
| `stagger` | Sí | Sí |
| `rule` | Sí | Sí — salvo que el filete esté apagado en ese breakpoint |
| `fade` | Sí | Sí — no es scrubeado y no cuesta por frame |
| `parallax` | Sí | **No** — salvo `data-anim-mobile="on"` |
| `parallax-media` | Sí | **No** — salvo `data-anim-mobile="on"` |

**El gate del parallax es el POINTER, no el ancho**, y eso es un arreglo, no
una preferencia. La razón por la que el parallax se apaga en el celular es que
en touch pelea con el scroll del sistema; pero un teléfono acostado mide
**844px de ancho** y pasaba limpio un gate de `max-width: 767px`. Medido el
2026-09-15 a 844×390: **tres triggers en vez de dos**. Con el gate por pointer
quedan dos, y el iPad landscape (1024, touch) también queda afuera.

## Anti-FOUC

Sí, para `mask`, `words`, `rule` y los hijos de `stagger`. **Ni las dos
variantes de parallax ni `fade` llevan** (ver abajo el caso de `fade`) — arrancan visibles por definición, y
ocultarlas significaría esconder una foto entera hasta que GSAP cargue.

**`stagger` esconde a sus HIJOS, no a sí mismo**, porque el hook suele ser un
wrapper de layout que carga el fondo de la section. La regla es
`[data-anim='stagger'] > *:not([data-anim])`, y el `:not()` es estructural: un
hijo con su propio `data-anim` lo maneja su propia variante, y para uno que no
debe arrancar oculto (un parallax) esconderlo sería un bug. El failsafe tiene
que nombrar a los hijos por el mismo motivo —
`html.anim-failsafe [data-anim='stagger'] > *`— o un GSAP que no carga deja
invisibles los cuatro items de cada Four Things del sitio.

`src/components/styles/reveal.css` pone `opacity: 0` y **nunca un
`transform`**: un transform en CSS se **compone** con el que escribe GSAP.

Dos reglas del failsafe son nuevas respecto de `statement.css` y `cost.css`:

- **`clip-path: none`** — lo necesita la rama de fallback de `mask`.
- **`html.anim-failsafe [data-anim='mask'] *`** — la máscara mueve los
  **hijos** del elemento. Sin esta regla, un GSAP que no carga dejaría la foto
  estacionada una ventana entera abajo de su marco. **Verificado**: sin GSAP
  quedan 2 elementos ocultos, con el failsafe 0, y la foto **dentro** de su
  ventana.

## Dependencies

- **GSAP core + ScrollTrigger**, obligatorios, vía `getGsap()` / `getPlugin()`.
  Si falta cualquiera: warn y return, markup estático.
- **SplitText es opcional** — sólo lo necesita `words`. Un sitio sin SplitText
  igual recibe `mask` y `parallax`; la variante `words` se saltea.
- De `src/utils/motion.js`: `DUR`, `DIST`, `EASE`, `STAGGER`, `SCROLL`, `MQ`,
  `onceLaidOut`, `isDev`.
- `./styles/reveal.css`.

## DOM Expectations

```
section[data-component="reveal"]
├── [data-anim="mask"]              ← tiene que clipear (overflow: hidden)
│   └── <cualquier wrapper>         ← la cortina
│       └── img                     ← la foto
├── [data-anim="words"]             ← un bloque de texto
└── [data-anim="parallax"]          ← un img con un ancestro que clipee
```

Una section sin `[data-anim]` adentro sale limpia sin construir nada. Un
elemento con un `data-anim` desconocido se ignora. Un elemento que tira durante
su construcción se logea y **se revela**, sin llevarse el resto de la página.

## Tuning

Arriba de `src/components/reveal.js`, en `REVEAL`:

| Clave | Valor | Qué es |
| --- | --- | --- |
| `slack` | `10` | Sobrante del parallax, en %. **Espejo del CSS** |
| `maxSpeed` | `0.08` | Techo de `data-anim-speed`. Lo fija `motion-language.md` |
| `settle` | `1.06` | Escala inicial de la foto en `mask`. `1` la deja quieta |
| `scrubBudget` | `3` | Arriba de esto, warn en dev |

## Cómo se verificó

### Las variantes de 2026-09-15 (`mask`, `words`, `parallax`)

Playgrounds en `playground/image-reveal/` y `playground/image-parallax/`
(gitignored). Medido con Chrome headless por CDP contra el bundle real.

| Check | Resultado |
| --- | --- |
| Un trigger por elemento | ✅ 3 en desktop (mask + words + parallax) |
| La cortina arranca una ventana entera abajo | ✅ +680px sobre una ventana de 680 |
| La foto no hace translate | ✅ 0.0px con `settle: 1` |
| Ratio foto/section del parallax | ✅ 1.2 — con el atributo sin repetir daba 1.000 y costuras de 38/46px |
| Teléfono acostado 844×390 · iPad landscape 1024 touch | ✅ 2 triggers — el parallax queda afuera |
| reduced-motion | ✅ 0 triggers, 0 ocultos |
| Sin GSAP → failsafe | ✅ 2 ocultos → 0 |
| Budget CPU 4×, 6s de scroll | ✅ mediana 16.7ms, p95 16.7ms, 0 frames >50ms |

### Las variantes de 2026-09-21 (`parallax-media`, `stagger`, `rule`)

Medido el **2026-09-21** con Chrome headless por CDP contra el bundle real, en
un harness con el markup nuevo **más el CSS publicado de MAST**, y además
contra una copia local de la Home publicada con las ediciones de la sesión
reproducidas por script.

| Check | Resultado |
| --- | --- |
| Ratio img/frame en Photo Band y CTA Banner | ✅ **1.2 exacto** en los dos *(las dos salieron después del parallax — ver abajo)* |
| El borde de la foto nunca se asoma | ✅ peor caso **−15px** (siempre sobra), en 201 posiciones de scroll |
| `.four_row` tiene 5 hijos y se animan 4 | ✅ el filete queda fuera del stagger |
| Eje del filete, variante horizontal | ✅ `scaleX(0)`, origen `left center` |
| Eje del filete, variante vertical | ✅ `scaleY(0)`, origen `center top` |
| Caja degenerada (2×0) | ✅ se revela y se saltea — antes elegía el eje equivocado |
| Parallax apagado en touch | ✅ 844×390, 390×844, 320×568 e iPad landscape 1024 |
| Triggers en la Home real | ✅ 6, sin warnings ni excepciones |
| Scroll horizontal | ✅ 0 en los 6 perfiles |
| Budget CPU 4×, 6s de scroll | ✅ mediana 16.7ms, p95 16.7ms, 0 frames >50ms, CLS 0 |

**Lo que NO está verificado**: nada corrió en el sitio publicado. Faltan
**publicar Webflow** y **bumpear el hash del CDN** (hoy `@216bb5a`), y después
`/responsive`.



## `fade`, y por qué es la única variante sin anti-FOUC

Construida el **2026-09-25** para el comentario de Derek en el Figma de Patient
Stories, textual:

> *"On scroll into view, the signage image fades in 0-100% slowly, then the
> closing line fades in shortly after it settles. Subtle, no movement, no
> parallax. Suggested timing: image 500ms, closing line starting around 200ms
> after the image finishes. Respect prefers-reduced-motion. **And nothing
> should be hidden by default, so the content still shows if the animation
> doesn't fire.**"*

La última frase es una restricción dura y es lo que hace a esta variante
distinta de las otras seis. `reveal.css` lista **una por una** las variantes que
oculta (`mask`, `words`, `rule`, `stagger > *`); `fade` está deliberadamente
afuera.

**El precio es un flash, y por eso el builder mide antes de ocultar.**
`dist/styles.css` es bloqueante y aterriza antes del primer paint; GSAP llega
varios frames después. Un `gsap.set(opacity: 0)` a secas parpadearía contenido
que el visitante **ya está mirando**. La salida:

```js
if (el.getBoundingClientRect().top < window.innerHeight) {
  gsap.set(el, { opacity: 1 })   // ya está en pantalla: no hay nada que revelar
  return null
}
```

Lo que está arriba del fold al init se deja quieto y **no anima nunca** — el
visitante ya lo vio, no hay entrada que mostrarle. Lo que está abajo se oculta
**antes de haber podido verse**, así que no existe el frame del parpadeo. Las
dos mitades de la restricción de Derek se cumplen a la vez.

### El encadenado es por scroll + delay, no por timeline

La foto vive en `Section / Photo Band` y la línea de cierre en
`Section / Stories Outro` — **son dos sections distintas**. Un timeline
compartido exigiría un atributo de agrupación que el contrato no tiene, que es
exactamente la misma decisión ya tomada para el par `mask` + `words`.

`DUR.base` es **0.5s**, o sea los 500ms que pide Derek, sin inventar un token.
La línea lleva `data-anim-delay="0.2"`; el resto del "shortly after" lo pone la
distancia de scroll entre las dos sections.

### El parallax del Photo Band se fue, y eso toca 5 instancias

Decisión de Pablo el 2026-09-25, sabiendo el alcance: Derek pide *"no movement,
no parallax"* y el pedido fue aplicarlo **en la definición**, no por instancia.
Las 5 instancias del sitio pasan de derivar a fundirse.

**No deja costura**, y está verificado antes de escribir: al sacar el atributo
deja de aplicar `[data-anim='parallax-media'][data-anim='parallax-media'] img
{ top: -10%; height: 120% }` y `.media-band_img` cae a su base —
`position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover`—
que llena el marco exacto. El `overflow: hidden` de `.media-band_frame` se
queda igual: ya no hace falta para el sobrante, pero sigue recortando el radio.

Efecto lateral bueno: la Home y Patient Stories pierden un trigger scrubeado
cada una, así que el `REVEAL.scrubBudget` queda más holgado.

### Lo que NO está verificado

**Nada de esto corrió en un navegador.** El código está lintado y los atributos
están leídos de vuelta del Designer, pero la variante necesita
`npm run build` + push + **bumpear el hash del CDN** antes de existir en el
sitio. Falta medir: el budget con CPU 4×, que el above-the-fold no parpadee, y
la rama de `prefers-reduced-motion` (que hoy sale gratis — sin CSS que oculte,
un `mm.add(MQ.reduced)` no tiene nada que revertir, pero hay que verlo).

## El CTA Banner salió del parallax — 2026-09-28

Pedido de Pablo: *"en la cta banner desactivemos el parallax en todas. Y el
zoom de la imagen"*.

**Las dos cosas eran una sola.** Buscado en el CSS publicado: hay **cero
`scale()` en las 250KB** de Webflow, y ninguna regla de MAST toca la escala de
la foto. Lo que se lee como zoom es el **sobrante del propio parallax** — la
variante le da al `img` `height: 120%; top: -10%`, y con `object-fit: cover`
ese 20% de más se recorta y la foto se ve ampliada. Sacar el atributo apaga la
deriva **y** devuelve la foto a su tamaño, de una.

Se quitaron **los dos hooks** de la definición (`7182c8c0-…`), o sea que
alcanza a las 9 instancias de una escritura:

| Elemento | Atributo que se sacó |
| --- | --- |
| `.card.cc-cta-card` | `data-anim="parallax-media"` |
| `section.cc-cta` (la raíz) | `data-component="reveal"` |

**El `data-component` se fue también porque era el único hook de la section**:
sin ningún `[data-anim]` adentro, `reveal.js` entraba, no encontraba nada y
salía. No rompía nada, pero un hook que no hace nada es justo lo que después
nadie sabe si se puede borrar. Efecto lateral bueno: en **Home, Blog, Fees y el
template de artículo** el CTA era la única section con `reveal`, así que esas
cuatro páginas **ya no cargan el chunk**.

**No deja costura**, y está verificado antes de escribir: sin el atributo deja
de aplicar `[data-anim='parallax-media'][data-anim='parallax-media'] img` y la
cascada cae a `.img-component.cc-media-fill` (`absolute; inset: 0; height: 100%`)
más `.u-img-cover` (`inset: 0; width/height 100%; object-fit: cover`), que
llena el marco exacto. El `object-position: 100% 50%` que trae el `Image Fit`
del componente **se queda** — ése es el encuadre elegido, no un zoom.

### Medido

Chrome headless por CDP contra el sitio servido, a 1440, en **cuatro posiciones
de scroll** y en dos páginas: la Home (donde `reveal.js` ya no carga) y Our
Story (donde **sí** carga, por The Space y Photo Band).

| Check | Antes | Ahora |
| --- | --- | --- |
| Ratio img/frame | **1.2** | ✅ **1.000** en las 4 posiciones, en las 2 páginas |
| Sobrante arriba / abajo | 10% y 10% | ✅ **0 y 0** |
| `transform` del img | escrito por GSAP | ✅ `none` |
| `top` del img | `-10%` | ✅ `0px` |
| ScrollTriggers dentro de `.section.cc-cta` | 1 | ✅ **0** |

Y en el HTML servido de las **9 páginas**: `data-anim="parallax-media"` **0**,
`data-component="reveal"` **0** dentro del CTA, con `cta_media` y `cc-cta-card`
**presentes en las 9** — o sea que se apagó la animación, no se rompió la
section.

⚠️ **Queda un `parallax-media` en Our Story y es correcto**: es `.space_frame`,
de `Section / The Space`, que es otro componente y nadie pidió tocarlo.

### `.cta_media` se queda, y no es un resto

El wrapper se creó para el parallax, pero **ya no es su única razón**: es la
celda de grilla que usan las variantes `Split` y `Card Inset`, y su
`overflow: hidden` es lo que recorta la foto contra el radio de 1rem en
`Card Inset`. Borrarlo rompería las dos variantes.
