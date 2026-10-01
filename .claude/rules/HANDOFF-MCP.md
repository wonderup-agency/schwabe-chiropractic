# Handoff para una sesión con Figma + Webflow MCP

**Este archivo es un prompt, no documentación.** Se pega tal cual en una sesión
(Claude Desktop, o Claude Code con los conectores reautorizados) y es
**autocontenido**: esa sesión **no tiene acceso a este repo**, así que todos los
ids, medidas y decisiones van adentro del texto.

Creado el 2026-09-29, cuando Figma y Webflow quedaron sin autorizar en Claude
Code. Si se retoma la tanda desde acá, **hay que actualizarlo** con lo que se
haya aplicado.

---

> ⚠️ **2026-09-29 — las tandas 1, 2, 3, 4 y 6 se aplicaron y publicaron** desde una sesión Cowork. Antes de reusar este prompt, leé *"Tanda de paridad 2026-09-29"* en `FIGMA-AUDIT.md`: varios datos de abajo resultaron incorrectos (Photo Band son 6 instancias; Tanda 5 no es de instancia; `#growing-team` es un CTA Banner; la foto del CTA de Care Hub es la 0245). **No lo corras tal cual.**

## El prompt — copiar desde acá

````markdown
# Paridad Figma ↔ producción — sitio Schwabe Chiropractic

Sos el CTO técnico de este proyecto. Yo soy el socio no técnico: tomás vos las
decisiones de implementación y me avisás cuando algo necesita una decisión de
producto o de contenido.

## PASO 0 — El gate. No planifiques nada antes de esto.

Verificá que los DOS conectores responden, con una lectura barata cada uno:

1. **Webflow**: `data_sites_tool > get_site` con
   `siteId: 6a9880576ec4624829beb2f5`.
   Usá un `agent_id` propio y `session_id: "start"` en la primera llamada.
2. **Figma**: `get_screenshot` del nodo `1249:12003` del archivo
   `erUTGKdYCcmvlPiKW4MZMf`.

**Si alguno falla, pará y decímelo.** No midas ni planifiques lo que no vas a
poder aplicar. El error que ya apareció dos veces es
`mcp_oauth_token_read_unsupported`, y no se arregla reintentando: es el token
del conector.

Si los dos responden, decime el `lastPublished` del site y seguí.

## Contexto del proyecto

- **Webflow site**: `6a9880576ec4624829beb2f5`, publicado en
  `https://schwabe.webflow.io`.
- **Framework**: **MAST**. NO es Client-First — no uses su vocabulario ni sus
  utilidades, y no intentes re-detectar el framework.
- **Figma**: archivo `erUTGKdYCcmvlPiKW4MZMf`, canvas `1237:9927`
  *"Final review"*. ⚠️ Hay un segundo archivo llamado igual
  (`vzmzEgWYtIR6PoN2TzDB2i`) que **NO se usa** — verificá el fileKey.
- **Línea de base**: CSS publicado `schwabe.webflow.shared.4262d11b9.css`,
  bundle del CDN `@970fb4b`. Si el hash del CSS cambió, alguien publicó: avisá.
- **Convención de clases**: `<bloque>_<elemento>`, underscore **una sola vez**.
  Los guiones unen palabras dentro de una parte (`area-card_copy` es correcto).
  `cc-` para combos, `u-` para utilidades de layout y color de superficie.

### Variables de color que vas a necesitar

Los nombres CSS están verificados en el CSS publicado. **Los ids resolvelos con
la herramienta de variables — no inventes ninguno.** Los dos que tengo
confirmados:

| Token | Nombre CSS | id |
| --- | --- | --- |
| Brand/Beige `#fbfaf8` | `--_color---brand--beige` | `variable-673fc796-8959-0fd8-3f8c-c3680779cbe7` |
| Brand/Olive Green `#6b744e` | `--_color---brand--olive-green` | `variable-6b5f6515-b16b-d72d-229d-7dde8855d613` |
| Brand/Beige Muted `#eeece4` | `--_color---brand--beige-muted` | *resolver* |
| Brand/Ink `#474d33` | `--_color---brand--ink` | *resolver* |
| Brand/Forest Green `#262f23` | `--_color---brand--forest-green` | *resolver* |
| Brand/Border `#d1d6c2` | `--_color---brand--border` | *resolver* |
| Brand/Border Strong `#cacdb7` | `--_color---brand--border-strong` | *resolver* |
| Card radius large (1.5rem) | `--_components---card--border-radius-large` | *resolver* |

---

# LAS SEIS TANDAS

Hacelas **en este orden** y **pará después de cada una** para que yo confirme.
El orden no es por importancia: las 1–5 ya están medidas y decididas, así que se
pueden terminar aunque el conector se corte a mitad. La 6 abre decisiones mías y
va última a propósito.

---

## TANDA 1 · Four Things de Our Story — el domo con check

> ✅ **APLICADA en el Designer el 2026-09-29 — sin publicar.** No la repitas.
> Las 2 llamadas se corrieron y además se corrigieron 3 errores del spec
> (padding del glifo 8/2, gap domo→título 20px, filete `top: 2rem` en Ink).
> El detalle está en FIGMA-AUDIT.md, sección *"Four Things · re-medido y
> aplicado"*. Queda: publicar, medir, y la decisión de los 3 segmentos.

**El spec está cerrado y son 2 llamadas. No vuelvas a medir esto.**

El Figma pone, arriba de cada una de las 4 columnas de *"Four things that are
true at every appointment"*, un **domo** beige de 80×58 —esquinas superiores
completamente redondeadas, las de abajo rectas— con un **check oliva** adentro.
Producción pone un **numeral** oliva sobre fondo forest.

### Los ids

| Qué | Id |
| --- | --- |
| Componente `Section / Four Things` | `613ee37b-c54d-fa8c-82b7-f4a6ddcd3a8e` |
| Página Our Story | `6aa7f57458bf3fcec50691d6` |
| La instancia | `{component: "6aa7f57458bf3fcec50691d6", element: "59dc18b8-8218-640e-a4b7-90b62034466c"}` |
| Prop `Variant` | `882cba41-ad46-82ac-cefd-9a2e18009952` — hoy en `base` |
| Variante **`Columns Check`** (ya creada, **vacía**) | `9f9b1bae-5bfd-1149-0b71-887116176c69` |
| Prop `Number` · Item 1 | `b1f84c54-e2aa-9d23-3b88-2d848bbec71c` |
| Prop `Number` · Item 2 | `cab7b6ce-93d1-75e3-aae1-9708615247b0` |
| Prop `Number` · Item 3 | `a5644751-1107-fc24-1259-8868e367652b` |
| Prop `Number` · Item 4 | `fb0417e1-5025-eeb3-e4ae-76cefdc0b4f1` |

### ⚠️ Por qué hay una variante nueva y no se escribe en la clase

**`Columns` ES la variante `base`.** Escribir en `.four_num` a secas alcanzaría
a las **3 instancias** del componente, y las otras dos deben conservar el
numeral:

| Página | Section | Variante | Marcador |
| --- | --- | --- | --- |
| Our Story | `#schwabe-standard` | **`base`** | 🔴 pasa a **check** |
| New Patients | `#what-to-expect` | `ad38b09b-8c79-985e-2bb4-213946a77e19` | ✅ numeral, no se toca |
| Injury | `#care-approach` | `69bbd089-e9ed-7fa8-2c21-d970e463668a` | ✅ numeral, no se toca |

Y las dos Stacked **no pisan ni el fondo ni el radio** (sólo `text-align` y
`padding`; Stacked Light además `background-color`), así que heredarían el domo.
Por eso existe `Columns Check`.

*(El criterio de contenido lo respalda: cuatro cosas que son verdad siempre no
son una secuencia, así que un numeral ahí promete un orden que no existe. La
primera visita y el plan de cuidado sí lo son.)*

### Llamada 1 — props de la instancia de Our Story

`set_component_instance_prop_values` sobre la instancia de arriba:

- `Variant` → `9f9b1bae-5bfd-1149-0b71-887116176c69`
- Los **4 `Number`** → `✓` (los cuatro son `textContent`, van con
  `type: "string"`)

### Llamada 2 — estilos de la variante

`set_variant_styles` con `variant_id: "9f9b1bae-…"`, `style_name: "four_num"`.
**Sólo las diferencias contra la base** — la variante hereda el resto:

| Propiedad | Valor |
| --- | --- |
| `width` / `height` | `5rem` / `3.625rem` |
| `background-color` | Beige (`variable-673fc796-…`) |
| `color` | Olive (`variable-6b5f6515-…`) |
| `border-top-left-radius` / `border-top-right-radius` | `999px` |
| `border-bottom-left-radius` / `border-bottom-right-radius` | `0px` |
| `display` / `justify-content` / `align-items` | `flex` / `center` / `center` |
| `padding-top`/`-right`/`-bottom`/`-left` | `0` — la base trae `padding-left: 1.25rem` |

### Dos cosas que NO hay que tocar, y una que hay que mirar

- ❌ **El filete `.four_rule` NO está roto.** Lleva `data-anim="rule"` y
  arranca en `scaleX(0)`; con la section en viewport da **967×1, scaleX(1)**.
  Si lo medís sin scrollear hasta ahí vas a creer que está roto. **Ya produjo
  un hallazgo falso — no lo repitas.**
- ❌ **No hacen falta los 3 segmentos de filete que dibuja el Figma.** El domo
  beige es opaco igual que el numeral forest de hoy, así que conserva el
  trabajo de **máscara**: el filete continuo pasa por detrás y los domos lo
  cortan.
- ⚠️ **El tamaño del `✓` no lo fija `.four_num`** sino el `Plain Text` hijo,
  cuya variante `Size` (`8ad65db6-2c49-8954-46ef-9d5073969b80`) vive en la
  **definición** y es compartida por las 3 variantes. Un `font-size` escrito
  desde la variante **no le gana**. Mirá cómo sale renderizado; si no coincide,
  la salida es un combo aplicado por el prop `Class` de esa instancia —
  **nunca** tocar su variante `Size`.

**Si esta tanda no se hace, decímelo: hay que BORRAR la variante `Columns
Check`**, que hoy está creada, vacía y sin usar.

---

## TANDA 2 · Photo Band — el recorte de la foto

**Una escritura, 3 instancias. Decidido, no lo re-discutas.**

`.media-band_frame` declara hoy `aspect-ratio: 1360 / 812` (= 1.675) y llena la
foto con `object-fit: cover` / `object-position: 50% 50%`. Las fotos cargadas
son más altas, así que **cover se come alto, mitad arriba y mitad abajo**:

| Página | Foto | Ratio | Alto perdido |
| --- | --- | --- | --- |
| Join Our Team | `0249_…patient_interaction` 2560×1707 | 1.500 | **10%** |
| Our Team | `0350_…team_other_headshot` 2560×1707 | 1.500 | **10%** |
| Community Partners | `partners-platt-park-street` 1448×1086 | **1.333** | **20%** |

**Acción**: `.media-band_frame` → `aspect-ratio: 3 / 2`.

Componente `Section / Photo Band`: `82a560e3-6da8-7311-f80a-23cdcf606d51`.

Dos cosas que quiero que sepas al aplicarlo, y que **no son motivo para
frenar** (ya las decidí):

- **Es un apartamiento deliberado del frame**, que dibuja 1.675.
- **Community Partners va a seguir perdiendo ~12%** porque su foto es 4:3. Se
  cierra el día que se reemplace por una 3:2.

---

## TANDA 3 · `/join-our-team` — 10 deltas, todos medidos

Frame de Figma **`1249:26448`**. Los 10 están **medidos tres veces** contra
tres hashes distintos del CSS publicado y **ninguno se movió**. Aplicá; sólo
volvé al Figma si algo no cierra.

| # | Delta | Prod hoy | Figma pide |
| --- | --- | --- | --- |
| 1 | 🔴 **Banda de Practice Philosophy invertida** | `.section.cc-philosophy` → `background: brand--beige`, `color: brand--ink` | **fondo Ink `#474d33`, texto Beige** |
| 2 | 🔴 **Openings y Standing cruzados** | **una sola regla** `.section.cc-openings, .section.cc-standing` en `beige-muted` | Openings **Beige `#fbfaf8`** · Standing **Beige Muted `#eeece4`** |
| 3 | 🔴 **El `<select>` sin la clase del form** | `<select id="si-role" class="w-select">` — 38px, `#f3f3f3`, radio 0, borde `#ccc`, **14px** | la clase **`inquiry_input`**, como los otros: 48px, Beige, pill 999px, borde `#cacdb7`, **16px** |
| 4 | 🔴 **Los 5 `<label for="">` vacíos** | `si-name` · `si-email` · `si-phone` · `si-role` · `si-intro` tienen id y **ningún label los apunta** | cada `for` con su id |
| 5 | El textarea muestra el handle de resize | `resize: both` | sin handle (`resize: none` o `vertical`) |
| 6 | El lede de Philosophy sale en cuerpo | *"This is not a high-volume practice…"* — DM Sans Regular **16px redonda** | **EB Garamond Medium Italic 32px** (token H4) |
| 7 | El H2 de Standing Interest | 48px → 2 líneas en 569px | **60px** (`Desktop/Heading 1`) → 4 líneas |
| 8 | La foto no pisa la banda de abajo | a tope | la foto monta **100px** sobre Philosophy |
| 9 | El filete y el radio de la card de vacante | borde `border-strong #cacdb7`, radio **1rem** | borde **`brand--border #d1d6c2`**, radio **1.5rem** (`card--border-radius-large`) |
| 10 | La primera vacante arranca cerrada | los 2 `<details class="job-card job-card">` sin `open` | **la primera abierta** |

**Más una decisión ya tomada**: la nota *"We read every introduction…"* del form
**se OCULTA** (no se borra — volver atrás tiene que ser una escritura), y el
botón queda solo en su fila alineado a la derecha.

### Notas de implementación

- **#3 es la causa entera de "los estilos del form están rarísimos".** Y los
  14px violan una regla dura del proyecto: **abajo de 16px iOS zoomea al
  enfocar y el visitante no sale del zoom.**
- **#4 es accesibilidad, no estética.** Son labels `u-sr-only`: hoy **no
  anuncian nada**, que es peor que no tenerlos.
- **#6 es el bug de `u-italic`** que este sitio ya barrió en las citas: las
  variantes de texto de MAST **no declaran `font-style`**. Se arregla con la
  utilidad `u-italic` en el prop `Class`, no tocando la variante.
- **#8 ya tiene precedente en el sitio**: `.section.cc-rooted` de Community
  Partners usa `margin-top: -6.25rem` para exactamente esto.
- **#10 no necesita CSS nuevo**: el estado abierto ya está pintado (disco oliva
  con `−`).

### Lo que de esta página SÍ matchea — no lo toques

El H1 del hero (60px, 3 líneas, columnas alineadas abajo), la estructura
completa de las dos vacantes (títulos, resúmenes, las 8 viñetas, el bloque *To
apply*), la banda *To apply* en Beige Muted, el pill de los inputs de texto, y
la foto `0249` del Photo Band.

⚠️ **Dos capas del frame están en `hidden="true"` y NO son deltas**: el eyebrow
*"Why these stories matter"* y el botón *"Email Your Application"*. Producción
tampoco los tiene, y está bien así.

---

## TANDA 4 · Our Team — `#growing-team`

Frame **`1249:17851`**. Dos deltas:

1. **La foto va a sangre, no inset.** Figma: card de **dos mitades exactas sin
   hueco**, foto pegada al borde superior, derecho e inferior, recortada por el
   radio del card. Prod: `Section / Feature Card` con `padding: 60px`,
   `grid: 526px 526px`, `column-gap: 80px`, foto **inset con su propio radio de
   24px**. Alto del card: Figma ~556, prod 482.

   👉 **Es exactamente la composición de la variante `Split`** que ya existe en
   `Section / CTA Banner` (`7182c8c0-1361-e142-edbc-efc21b088094`). **Leé cómo
   está construida esa variante antes de escribir nada** — incluido su wrapper
   `cta_media`, que existe por la trampa de la instancia anidada (ver abajo).
   `Section / Feature Card` nunca recibió esa composición.

2. **La foto es otra.** Figma: **la puerta al espacio nuevo** — pared de
   listones de madera, planta, heladera de vidrio, estantería. Prod:
   `team-growing-reception.png`, tres mujeres en recepción. Es el único slot de
   la página que sigue con un asset viejo.

---

## TANDA 5 · Community Partners — el encuadre del CTA

**Un solo delta, y es de instancia, no de clase.**

La foto **es la correcta** (`0245`, la que pidió el cliente) y la variante
`Split` ya está aplicada. Lo que falla es el encuadre:
`object-position: 100% 50%` la ancla a la derecha y **deja a la mujer de camisa
celeste cortada contra el borde izquierdo**. El Figma muestra a las dos de
cuerpo entero, centradas en la mitad derecha.

Viene del prop **`Image Fit`** del componente `Image`. Arreglo de instancia.

---

## TANDA 6 · Care Hub — MEDIR primero, aplicar después

Página `/care`, frame **`1249:12003`**. **Esta es la única tanda que necesita
leer Figma**, y es la que abre decisiones mías.

**El lado de producción ya está medido — no lo vuelvas a medir.** Te lo paso
entero abajo. Lo que falta es abrir el frame y contestar las preguntas
concretas de cada delta.

### El mapa de la página en prod

| # | Section | Fondo | Alto | imgs |
| --- | --- | --- | --- | --- |
| 1 | `#hero` `cc-page-header` | Beige `#fbfaf8` | 408 | 0 |
| 2 | `.cc-media-band` | — | 851 | 1 |
| 3 | `#approach` `cc-approach` | Beige Muted `#eeece4` | 895 | **0** |
| 4 | `#first-visit` `cc-process` | **Forest `#262f23`** | 815 | 0 |
| 5 | `#care-areas` `cc-areas` | Beige | 1691 | 6 |
| 6 | `#csw-bridge` `cc-shockwave` | Beige | 1005 | 1 |
| 7 | `#final-cta` `cc-care-cta` | Beige | 676 | 1 |

### Delta A · `#approach` — falta la foto y la cita está del lado equivocado

**Prod, medido**: `.approach_grid` es 2 columnas **569 / 603** (declaradas
`544fr 576fr`, gap `3rem 5rem`, `align-items: start`). La izquierda lleva
**sólo eyebrow + H2** (alto 142); la derecha lleva los 3 párrafos **+**
`.approach_quote` (card Beige `#fbfaf8`, radio 16px). **0 imágenes y 0 SVG.**

**Lo que necesito que leas del Figma**: la composición exacta. El reporte dice
copy + cita a la **izquierda** y foto en arco a la **derecha** — o sea que
**las dos columnas cambian de contenido**, no es "agregar una imagen".
Confirmalo y dame las medidas.

🔴 **`.approach_grid` la comparten Fees y Wellness** → el cambio va por
**combo**, nunca tocando la base.

### Delta B · `#first-visit` — el verde, los marcadores y el botón

**Prod, medido y confirmado en los tres puntos:**

1. La banda es **`rgb(38,47,35)` = `#262f23` Forest Green**.
2. **No hay ningún marcador**: el primer hijo de las 3 `.process_col` es el
   heading (*Your history* · *Your movement* · *Your plan*), con **0 `<svg>` y
   0 iconos Phosphor**.
3. El botón es `button cc-icon-circle` variant `primary`: **Olive `#6b744e`
   relleno con texto Beige**, sin `cc-on-dark`.

✅ **Los filetes SÍ están** — `.process_rule` da **144×1,
`rgba(255,255,255,0.12)`, `scaleX(1)`** con la section en viewport. La grilla
es de **5 pistas**: `321.4 / 144 / 321.4 / 144 / 321.4`. **No los reportes como
faltantes.**

**Lo que necesito que leas del Figma**: qué verde exacto pide la banda. El
reporte dice *"oliva media"* y los dos candidatos del sistema son **Ink
`#474d33`** y **Olive Green `#6b744e`** — el actual (`#262f23`) es más oscuro
que los dos. Decidilo mirando el frame.

🔴 **El botón necesita DOS props, no uno.** El disco de la flecha es
`icon-color cc-circle` = **fondo Beige con flecha Olive**. Si le ponés
`cc-on-dark` (píldora Beige) el disco queda **Beige sobre Beige, o sea
invisible**, y al hover aparecería de la nada porque el hover del disco es
Olive para todos los botones del sitio. **Es un bug ya diagnosticado y cerrado
en el CTA de este mismo sitio.** Si aplicás `cc-on-dark`, aplicá también
`Button Right Icon Modifier` = **`cc-circle-olive`**.

### Delta C · Areas of Care — ✅ NO es un delta

El hover invertido **funciona**. Verificado con un mouse real: las 6 cards
tienen `data-area-card`, `matchMedia('(hover:hover) and (pointer:fine)')` da
`true`, y al hover la card pasa de Beige/Ink/Border-Strong a **Ink
`rgb(71,77,51)` / Beige / Ink**, con el Button interno a Beige. Sólo se
invierte la card apuntada.

**Lo único a confirmar contra el frame**: el hover pinta **Ink `#474d33`** y el
reporte lo describe como *"forest oscuro"* (`#262f23`). Miralo y decime cuál
es. Si es Forest, es cambiar una variable en un CSS del repo — **no es una
escritura de Webflow**, así que sólo reportámelo.

### Delta D · `#csw-bridge` — orden, relleno, logo y botón

**Prod, medido:**

1. **Orden invertido**: `.shockwave_body` a la **izquierda** (x=167),
   `.shockwave_media` a la **derecha** (x=753), grilla `505 / 505`.
2. Eyebrow **"Also available here"**, con **0 imágenes de marca**.
3. ⚠️ **El delta es más chico de lo que parece**: `.shockwave_band` **ya tiene
   el filete** (borde 1px `rgb(113,156,161)`, radio 32px). Lo único que
   difiere es el **relleno**, hoy Beige Muted `#eeece4`.
4. Botón `secondary cc-teal`: transparente, texto y borde 2px
   `rgb(62,85,88)`, **sin disco de flecha**.

🔴 **`.shockwave_band` pelada la comparte Injury** → va por **combo**.

⚠️ **El eyebrow NO se copia del Figma.** El cliente pidió explícitamente algo
**distinto del Figma y de prod**: el **logo horizontal real de Colorado
Shockwave®**, el `.ai` que está en Google Drive, a **40–50px** para que se lean
"COLORADO" y el ®. **Si no tenés ese asset, no toques el eyebrow y decímelo.**

⚠️ El borde `#719ca1` y el botón `#3e5558` **no son tokens** (el más cercano es
`slate-line #7a999e`). Es deuda preexistente — anotala, no la arregles de
oficio.

### Delta E · El CTA — ojo, no es el componente que parece

🔴 **`#final-cta` de Care Hub NO es `Section / CTA Banner`.** Es
`.cc-care-cta` con `.care-cta_grid`, o sea **`Section / Care CTA`**
(`d2c66413-7ac4-cf34-1bdb-55eed8793455`), otro componente — **nunca pudo
recibir la variante `Split`** que sí tienen las otras 9 páginas.

**Prod, medido**: grilla **586 / 586** gap 80, **foto a la IZQUIERDA** (x=86),
copy a la derecha (x=753). La foto es **`doctor-kati-schwabe-consult.jpg`**,
**1439×2158 (vertical 2:3)** en una caja de **586×476** → **se recorta el ~46%
del alto**.

Dos cosas más que valen tanto como el orden:

- **Esa foto es la misma del retrato de la Home**, reusada. El cliente pidió
  explícitamente que los heros y CTAs no repitan fotos.
- El recorte del 46% es peor que el del Photo Band.

✅ **`.care-cta_grid` es sólo de esta página** → acá **sí** se puede tocar la
base.

**Lo que necesito del Figma**: qué orden de columnas pide, y qué foto.

---

# LAS TRAMPAS — cada una ya costó tiempo en este proyecto

1. **Antes de re-estilar una clase para el Figma de UNA página, contá en
   cuántas páginas vive.** `.doctor_quote` la comparten 3 y cambiarla para la
   Home rompió Our Story **en silencio**. Si vive en más de una, el cambio va
   en un **combo**, no en la base. El chequeo es una línea sobre el HTML
   publicado.
2. **La clase de una variante NO llega a una instancia anidada.**
   `set_variant_styles` devuelve `success`, la regla **sale en el CSS
   publicado**, y **no matchea nada** — porque el elemento interno lleva la
   variante de *su propio* componente. Hace falta un wrapper que el componente
   padre posea. (`cta_media` es el precedente, creado exactamente por esto.)
3. **`"success"` no garantiza que persistió. Leé de vuelta siempre**, con la
   acción `get_`, no mirando lo que devolvió el `set_`. Hay un caso donde la
   respuesta **incluía el valor escrito** y el prop se había borrado.
4. **En una página de template, un binding de CMS puesto en un prop de
   instancia se borra en silencio.** La vía que persiste son elementos
   **nativos** con `set_settings`. Y **no se puede CREAR un binding de CMS
   dentro de la definición de un componente** — devuelve *"Element is not
   inside a CMS context"*. El orden que funciona es **bindear → convertir**.
5. **Rate limit: ~6 escrituras por llamada, y el batch NO es atómico.** Un 429
   deja el componente a medio bindear. Meté trabajo que no sea de API
   entremedio en vez de reintentar en caliente — reintentar enseguida vuelve a
   fallar.
6. **`GET /v2/assets` tiene un límite más bajo todavía**: las imágenes se
   restauran **de a una**.
7. **Un prop de imagen se va a `null` al bindearlo.** Si bindeás una imagen,
   tenés que reponer el asset en la instancia — y ése es el paso más frágil de
   todos.
8. **`update_style` AGREGA, no reemplaza.** Si la propiedad nueva tiene un
   longhand o un alias viejo (p. ej. `grid-column-gap` vs `column-gap`), pasá
   `remove_properties` en la misma pasada o queda un empate que decide el orden
   de serialización.
9. **`transform_element_to_component` regenera los ids internos.** Releé la
   definición antes de bindear; derivarlos por aritmética falla en silencio.
10. **Una section que contiene un Collection List NO se puede convertir a
    componente.** Es límite de plataforma, sin workaround. Se detectan con
    `element_filter: {type: "DynamoList"}`.
11. **Medir un elemento animado sin llevarlo a viewport no es evidencia.** Un
    `data-anim="rule"` arranca en `scaleX(0)` y parece roto. **Ya produjo dos
    hallazgos falsos.**
12. **Una lectura tomada antes de que la página asiente tampoco.** Una section
    midió 970 y era 760.
13. **El nombre de una capa de Figma no es su texto.** Y varios frames traen
    `_placeholder_v1_` en el nombre del asset: eso es **pendiente de contenido,
    no delta**.
14. **Los frames arrastran capas ocultas de otras páginas.** Filtrá el subárbol
    `hidden="true"` o vas a auditar una página que no existe.
15. **Una alternativa del canvas no es el spec.** Si una section tiene un frame
    alternativo al lado, **preguntame cuál manda** antes de reportar su delta.
16. **Para confirmar un publish mirá `lastPublished`, no el hash del CSS** — el
    hash sólo cambia si cambiaron estilos.
17. **Un `ComponentInstance` de MAST no acepta atributos.** El hook va en el
    contenedor y el JS toma sus hijos.
18. **Los elementos nativos SÍ aceptan atributos** (`Image`, `Block`,
    `Section`); las instancias no.

---

# LO QUE YA ESTÁ HECHO — no lo rehagas

- **CTA Banner**: variante `Split` aplicada en las **9 páginas**, padding
  100/100 (760px exactos), parallax y "zoom" **apagados**, hover del disco
  corregido con `cc-circle-olive`, `Title Class` = `cc-cta-sm u-mb-0`.
- **Announcement Bar**: construido y en las **19 páginas**.
- **Our Story**: la cita de `#our-story` como card oliva montada
  (`.doctor_quote.cc-overlay`) — verificado servido, **no la toques**.
- **Areas of Care**: el hover invertido funciona (ver Delta C).
- **Los filetes** de Four Things y de First Visit Process: funcionan.
- **Itálicas de las citas**, `u-mb-0` en 37 headings, las 4 grillas que no
  colapsaban, el mapa con la dirección nueva, las 43 fotos convertidas a WebP.

# LO QUE NO TENÉS QUE HACER

- ❌ **No corras un build ni un deploy del repo.** Hay código escrito esperando
  (`registered.js`, `announcement.js`, `readtime.js`, `share.js`, un fix de
  `button.css`) y **el deploy lo decido yo**.
- ❌ **No toques el gutter del `.container`.** Hay un pendiente abierto (el
  token da 86.4px y el Figma dibuja 40) que **mueve las 19 páginas**. Si una
  medida no cierra por ~108px, es esto: anotalo, no lo arregles.
- ❌ **No midas responsive acá.** Esta tanda es **a 1440 y nada más**.
- ❌ **No reescribas copy.** Si el Figma y el texto del sitio no coinciden,
  reportá el choque; no elijas.
- ❌ **No borres nada del CMS** sin pedírmelo: es irreversible por API.

# CÓMO QUIERO EL REPORTE

Después de **cada tanda**, y no más de 8 líneas: qué escribiste, qué leíste de
vuelta para verificarlo, y qué quedó abierto. El detalle largo sólo si te lo
pido.

Si algo no matchea lo que dice este documento, **decímelo en vez de
adaptarte**: significa que alguien publicó en el medio y el inventario hay que
re-verificarlo.
````
