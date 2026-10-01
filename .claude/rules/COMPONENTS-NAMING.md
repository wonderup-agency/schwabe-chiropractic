# Componetización y naming — el contrato

Mismo formato que `RESPONSIVE.md`: arriba las reglas durables, abajo el backlog
abierto. Todo lo del backlog está **medido** contra el sitio el 2026-09-18 vía
MCP, no supuesto.

## Las reglas

### Componetizar es el default, no una optimización

`webflow-build` §3: *"Default: componentize everything. Sections, cards, CTAs,
nav, footer, text blocks — even single-use sections."* La razón no es el reuso:
es que **Build Mode es la superficie con la que el cliente edita el sitio**. Una
section cruda no tiene props, así que para cambiarle una palabra hay que entrar
al Designer y encontrar el nodo.

No se pregunta "¿esto se repite lo suficiente?". Se pregunta "¿esto es un
bloque de contenido?".

### El variant es lo que se raciona

Un variant sólo para un **estado de estilo** (Primary/Secondary, Light/Dark,
Compact). Si dos instancias difieren **estructuralmente**, es otro componente o
un slot. El modo de falla de este sistema es el variant sprawl, no la cantidad
de componentes.

### Semántica: el tag no es decorativo

- Hero de una página → `<header>`
- Cualquier otro bloque de contenido → `<section>`
- `<div>` es para envoltorios de layout **dentro** de una section

Un `Block` con `tag: div` y clase `.section` es un bug de semántica, no una
preferencia. Google lee el outline; un lector de pantalla también.

### Naming — la convención

Decidida el **2026-09-21**. Cuatro reglas, y las cuatro salieron de medir que
329 clases nuestras convivían en **seis formas distintas**.

#### 1. El underscore aparece una sola vez, y marca dónde termina el bloque

```
<bloque>_<elemento>
```

Los guiones **sólo unen palabras dentro de una parte**. `area-card_copy` es
correcto: el bloque es `area-card`, el elemento es `copy`.

El problema que esto resuelve: el guión venía haciendo dos trabajos opuestos.
En `area-card_copy` era parte del bloque; en `team_card-body` marcaba un
sub-elemento. Las dos clases nombran lo mismo —el cuerpo de una card— con la
estructura invertida, y leyendo `team_card-body` no hay forma de saber si el
bloque es `team` o `team_card`. 209 de las 329 ya cumplían la regla.

#### 2. Un sub-elemento no existe: se promueve a bloque

`team_card-body` → `team-card_body`. Lo que era un bloque compuesto pasa a
serlo de verdad.

**Dos excepciones que no son sub-elementos y hay que saber distinguir:**

- **El guion que une una sola idea es legal.** `form_required-note`,
  `guide_fine-print` e `intro_title-block` se quedan como están: "required
  note" es un concepto, no un bloque con un hijo.
- **Un modificador va a combo, no al nombre.** `bio_visual-sticky` y
  `shockwave_mark-1` no tienen un sub-elemento: tienen un estado. Van
  `bio_visual` + `cc-sticky` y `shockwave_mark` + `cc-alt`. El `-1` de
  `shockwave_mark-1` además no decía nada.

#### 3. El prefijo nombra el rol cuando el patrón es genérico

La prueba es una sola pregunta: **¿la clase dejaría de tener sentido en otra
página?** Si no, el prefijo es el rol.

| Genérico → por rol | Propio de su section → se queda |
| --- | --- |
| `stories-scrim` `cta_scrim` `testimonials_scrim` `cost-band_scrim` → `media_scrim` | `cost-band_lines` |
| `testimonials_bg` `stories-bg` → `media_bg` | `four_rule` |
| `hero_stars` `stories-stars` → `rating_stars` | `page-header_art` |
| los nueve `*_head` → `section_head` | `intro-dome_icon` |

Lo que decide **no es si las propiedades son idénticas, sino si el rol es el
mismo**: los cuatro scrims declaran rellenos distintos y aun así son un solo
patrón. Si no se nombran igual, el quinto se escribe de cero otra vez.

#### 4. `u-` es layout y superficie; todo lo demás es bloque

Una clase es utilidad si **no declara contenido** y sirve en cualquier bloque:
estructura (grid, stack, gap, ancho, padding) **y color de superficie**
(fondo, texto sobre oscuro).

| Es utilidad | No es utilidad |
| --- | --- |
| `u-grid-2/-3/-4`, `u-stack` + `u-gap-*` | `area-card` — es un bloque |
| `u-pad-lg/-md/-sm` | `media_scrim` — es un bloque |
| `u-bg-beige/-muted/-ink`, `u-text-on-dark` | `cost-band_lines` — es de una section |
| `u-mw-32`, `u-mx-auto` (ya existen) | |

El color de superficie entra a propósito: es lo que permite retirar los ~60
combos `cc-` de section, que no declaran otra cosa que padding y fondo.

### Un filete decorativo NUNCA es un div vacío

Regla escrita el **2026-09-21** después de meter la pata en `#plan`: los
filetes del eyebrow y la línea vertical de los pasos se construyeron como
`<div>` vacíos con `height: 1px`, y en el canvas del Designer aparecieron como
**cajas grises enormes**. Webflow le da a un elemento vacío un placeholder
visible, porque si no no se podría seleccionar — o sea que un div de 1px de
alto es invisible en el sitio e inmanejable en el Designer.

**Un filete se dibuja de una de estas dos maneras:**

| Caso | Cómo |
| --- | --- |
| El filete acompaña a un elemento que ya existe | `::before` / `::after` sobre ese elemento |
| El filete separa dos cosas | `border-top` / `border-left` del elemento de abajo |

`data_style_tool > update_style` acepta `pseudo: "before"`, así que esto se
hace por MCP sin tocar el Designer a mano.

**Por qué importa más allá de lo visual:**

- Un div vacío entra en el árbol de accesibilidad sin decir nada.
- Si el filete va dentro de algo que se repite —una card en una marquesina que
  duplica su track— **cada cambio estructural se paga dos veces**. Por eso la
  regla de `symptom-card.css` es un `::before`: eran 10 cards.
- En un contenedor flex un div de 1px se estira o se encoge si nadie le pone
  `flex: none`, y el bug aparece recién a cierto ancho.

Los filetes que ya existían y **sí** están bien: `four_rule` y `process_rule`
son elementos posicionados con ancho y alto reales, medidos el 2026-09-17
sobre `/care`. La regla es para los de 1px.

### Una clase no miente sobre lo que hace

`hero_grid` y `symptoms_grid` son `display: flex`. El nombre tiene que
sobrevivir a que alguien lo lea sin abrir el Designer.

### Antes de crear una clase, buscá si el patrón ya existe

Una grilla de dos columnas que colapsa a una en tablet ya existe 18 veces en
este sitio.

---

## El prompt de revisión

Para correr esta auditoría de nuevo (después de una tanda de páginas nuevas, o
antes de un handoff). Pegar tal cual:

```
Auditá componetización y naming de clases en el sitio Webflow de Schwabe
(site 6a9880576ec4624829beb2f5). Es una auditoría: leé, medí, reportá.
NO escribas nada en el Designer sin mi OK explícito sobre la lista.

Cargá primero la skill `webflow-build` — sus §1 (framework agnosticism),
§2 (semantics), §3 (componentization) y §8 (MCP operational reality) son el
criterio. El framework es MAST, ya detectado: no lo re-detectes ni lo mezcles
con Client-First.

Medí, en este orden:

1. INVENTARIO. `data_component_tool > get_all_components` con
   `includeInstanceCount`. Separá los componentes del starter MAST de los
   nuestros (grupos `Sections` y `Cards`).

2. SECTIONS CRUDAS, por página. `data_element_tool > query_elements` con
   `element_filter: {style: "section"}` — a nivel página, que es lo que
   NO devuelve nada que esté dentro de una instancia de componente. Esa es
   justamente la propiedad que lo hace servir: lo que vuelve es lo que NO está
   componetizado. El filtro por `tag: "section"` solo NO alcanza — las sections
   crudas de este sitio están taggeadas `div`, así que no matchean.
   Anotá por cada una: página, clase combo, `tag` real y el `id` del ancla.

3. NAMING. `data_style_tool > get_styles` query `all`, sin propiedades.
   Sobre la lista buscá:
   - nombres autogenerados (`Div Block N`, `Heading N`, sufijos ` 2` / ` 30`)
   - el mismo patrón bajo prefijos distintos (scrims, heads, copy, grids, cards)
   - clases nombradas por la página donde nacieron cuando el patrón es genérico
   - nombres que mienten (un `_grid` que es flex)
   Después traé las propiedades SÓLO de las familias sospechosas
   (`query_styles` con `name_path` y `include_breakpoints`), para poder decir
   cuáles son literalmente iguales y cuáles sólo se parecen.

4. GRILLAS SIN COLAPSO. De toda clase con `display: grid` y más de una columna,
   verificá que tenga override en `medium` o `small`. Las que no lo tengan son
   un bug de responsive, no de naming — van arriba en el reporte.

Entregá: (a) tabla de sections crudas por página, (b) familias de clases a
unificar con el nombre general propuesto y cuántas clases retira cada una,
(c) los bugs que aparecieron de paso. Ordenado por impacto, con el costo de
cada movida. Reporte corto — decido yo qué entra.
```

**Por qué el paso 2 funciona**: `webflow-build` §8 documenta que un
`query_elements` a nivel página devuelve **cero** matches para cualquier cosa
adentro de una instancia de componente. Eso normalmente es una trampa; acá es
la herramienta: el complemento exacto de "lo componetizado" es lo que devuelve.

---

## Backlog abierto

Medido el **2026-09-18** sobre el site en el Designer, 14 páginas.

### 47 sections crudas en 12 páginas

La Home es la única página del sitio **completamente componetizada** (11 de 11).

| Página | Crudas | Clases combo | Tag |
| --- | --- | --- | --- |
| Home | **0** | — | — |
| Patient Stories Template | **0** | — | — |
| Our Team | 1 | `cc-team` | `div` ❌ |
| FAQ | 1 | `cc-faq` | `div` ❌ |
| Blog | 2 | `cc-blog-intro`, `cc-articles` | `section` ✅ |
| Community Partners | 2 | `cc-rooted`, `cc-directory` | `div` ❌ |
| Our Story | 3 | `cc-band`, `cc-story`, `cc-bio` | `section` ✅ |
| Blog Template | 3 | `cc-article-hero`, `cc-article-body`, `cc-article-disclaimer` | `header` + `section` ✅ |
| New Patients | 4 | `cc-after-book`, `cc-signpost`, `cc-orientation`, `cc-faq-preview` | `div` ❌ |
| Care Hub | 5 | `cc-approach`, `cc-process`, `cc-areas`, `cc-shockwave`, `cc-care-cta` | `div` ❌ |
| Sports Injuries | 5 | `cc-injury-hero`, `cc-injury-context`, `cc-shockwave`, `cc-injuries`, `cc-faq-preview` | `div` ❌ |
| Wellness Membership | 6 | `cc-approach` ×2, `cc-intro`, `cc-includes`, `cc-fit`, `cc-faq-preview` | `div` ❌ |
| Fees & Policies | 7 | `cc-quick` ×3, `cc-insurance`, `cc-approach` ×3 | `div` ❌ |
| Patient Stories | 8 | `cc-stories-hero` + 7 más | `header` + `section` ✅ |

**31 de las 47 salen como `<div>`.** Las páginas nuevas (Patient Stories, Blog,
Blog Template) usan el elemento `Section` nativo y están bien; las de las tandas
de septiembre usan `Block` con `tag: div`. Es un arreglo de un atributo por
section, independiente de componetizar.

### Las 5 que ya se repiten y siguen sin ser componente

Ordenadas por instancias. Éstas son las de mejor relación trabajo/beneficio,
porque el patrón ya está probado en más de una página:

| Componente propuesto | Hoy | Dónde |
| --- | --- | --- |
| `Section / Approach` | `.section.cc-approach` ×6 | Care Hub, Fees ×3, Wellness ×2 |
| `Section / Quick Facts` | `.section.cc-quick` ×3 | Fees ×3 |
| `Section / FAQ Preview` | `.section.cc-faq-preview` ×3 | New Patients, Sports Injuries, Wellness |
| `Section / Shockwave Bridge` | `.cc-shockwave` ×2 + `.shockwave-band.cc-light` ×2 | Care Hub, Sports Injuries, Fees, Wellness |
| `Section / Intro` | `.cc-intro` + familia `intro_*` | Wellness + varias |

`cc-approach` ya es una clase compartida por 6 sections en 3 páginas: el patrón
existe y está estable. Que no sea componente es exactamente el caso que
`webflow-build` §3 llama a componetizar.

### Las cuatro grillas que nunca colapsan — esto es un bug, no naming

`rooted_grid`, `orientation_grid`, `signpost_grid` y `partners_grid` **no tienen
ningún override en `medium` ni en `small`**. Se quedan en dos columnas hasta
320px.

`RESPONSIVE.md` ya las tenía anotadas como "el riesgo obvio" desde el
2026-09-14. `faq-preview_grid` era la quinta de esa lista y se arregló el
2026-09-18; **estas cuatro siguen abiertas**. Afecta Community Partners,
New Patients y Our Story.

### 34 clases `_grid` para ~6 grillas distintas

Medidas una por una:

| Patrón | Cuántas | Clases |
| --- | --- | --- |
| 2 col → 1 col en `medium` | **18** | `approach` `bio` `blog-intro` `care-cta` `doctor` `faq` `faq-preview` `featured-story` `find-us` `guide` `includes` `injury-context` `injury-hero` `plans` `shockwave` `space` `stories-hero` `article` |
| 3 col → 2 → 1 | 4 | `areas` `articles` `differentiators` `injuries` |
| 3 col → 1 (se saltea el 2) | 2 | `fit` `payment` |
| 4 col → 2 → 1 | 1 | `policy` |
| 2 col **sin colapso** (bug) | 4 | `rooted` `orientation` `signpost` `partners` |
| No son grid — son `flex` | 2 | `hero_grid` `symptoms_grid` |
| Genuinamente propias | 3 | `process` (5 pistas) `quick` (5/3/2) `team` (rem fijos) |

De las 18 de dos columnas, **7 son literalmente `1fr 1fr`** (`care-cta`,
`blog-intro`, `stories-hero`, `injury-context`, `includes`, `plans`,
`shockwave`) y sólo difieren en el gap. Las otras 11 sólo cambian la proporción.

**La movida**: un `u-grid-2` / `u-grid-3` / `u-grid-4` con el colapso adentro,
más un combo cuando la proporción no es 50/50. Retira ~20 clases y, más
importante, **hace imposible el bug de las cuatro de arriba** — el colapso deja
de ser algo que hay que acordarse de escribir en cada grilla nueva.

Ojo: MAST **no** trae utilidades de grid (`u-` tiene 79 clases y ninguna es de
grid), así que esto es crear vocabulario nuevo, no adoptar el de MAST.

### Las familias de clases, medidas una por una

**Corrección respecto de la primera pasada**: los cuatro scrims **no** son
cuatro copias de lo mismo, y la familia `_copy` no es una familia. Esto está
leído de las propiedades, no de los nombres.

#### Los scrims comparten el posicionamiento, no el relleno

| Clase | Posición | Relleno |
| --- | --- | --- |
| `stories-scrim` | `absolute`, inset 0 | `rgba(38,47,35,.35)` plano |
| `testimonials_scrim` | `absolute`, inset 0, `z-1` | `rgba(38,47,35,.1)` + `backdrop-filter: blur(2px)` |
| `cta_scrim` | `absolute`, inset 0, `z-1` | `linear-gradient(90deg, …)` de .88 a 0 |
| `cost_band-scrim` | `absolute`, inset 0 | **`rgba(0,0,0,.2)` — negro, no el token ink** |

O sea: **un `media_scrim` base con el inset, y tres combos de relleno**. No
retira clases, pero convierte cuatro decisiones sueltas en una con variantes.

Dos cosas a decidir, no a arreglar de oficio:

- **`cost_band-scrim` es el único negro.** Los otros tres usan el ink de marca
  (38,47,35). `components/cost.md` documenta que el `rgba(0,0,0,.2)` viene de
  MAST y que nuestro CSS lo lleva a .45 animando `opacity`. Es deliberado, pero
  queda fuera de la familia de color del sitio.
- **Ese scrim lo anima `cost.js`** por `[data-cost-scrim]`. Renombrar la clase
  es seguro — el JS no la mira — pero hay que saberlo antes de tocarla.

#### Cinco pares que SÍ son idénticos, declaración por declaración

Retiro directo, sin cambio visual posible:

| Sobrevive | Se retira | Qué declaran las dos |
| --- | --- | --- |
| `blog-intro_head` | `articles_head-copy` | `flex` + `column` |
| `plan-card_head` | `team_card-group` | `flex` + `column` + `row-gap: .75rem` |
| `doctor_heading` | `differentiators_head` | `flex` + `column` + `width: 100%` + gap 1rem |
| `feature_copy` | `featured-story_copy` | `flex` + `column` + gap 1.5rem |
| `intro_head` + `u-mx-auto` | `cost_head` | idénticas salvo el `margin-inline: auto`, **que ya existe como utilidad** |

#### 14 clases que son la misma pila vertical con distinto gap

Todas son `display: flex` + `flex-direction: column` + un `row-gap`. Lo único
que las distingue es el número:

| Gap | Clases |
| --- | --- |
| — | `blog-intro_head` `articles_head-copy` |
| `0.5rem` | `partner_heading` |
| `0.75rem` | `plan-card_head` `team_card-group` |
| `1rem` | `doctor_heading` `differentiators_head` |
| `1.0625rem` | `doctor_copy` ← valor suelto, no es un token |
| `1.375rem` | `shockwave-band_head` ← ídem |
| `1.5rem` | `intro_copy` `feature_copy` `featured-story_copy` `stories-hero_copy` |
| `2.5rem` | `rooted_head` |

Un `u-stack` con combos de gap las reemplaza a todas. Y de paso saca los dos
valores sueltos (`1.0625rem`, `1.375rem`) que no salen de ninguna escala.

#### `_head` vs `_heading`, y un `_copy` que significa tres cosas

- **Dos sufijos para lo mismo**: `doctor_heading` y `partner_heading` contra
  nueve `*_head`. Uno de los dos sobra.
- **`_copy` no es una familia**, son tres conceptos bajo un sufijo:
  - la pila de texto — `intro_copy` `feature_copy` `doctor_copy` `stories-hero_copy` `featured-story_copy`
  - un **head centrado** mal nombrado — `stories-intro_copy` (max-w 44rem, `mx: auto`, `align: center`)
  - un **espaciador flex**, sin texto propio — `article-card_copy` (`flex: 1`) y `area-card_copy` (`margin-top: 1rem; flex-grow: 1`)

Los dos últimos son los que más confunden: `article-card_copy` declara una sola
propiedad y no tiene nada que ver con copy.

#### Las cards: el problema real es el radio, no el guión

Las 12 son `flex` + `column` + padding + radio + fondo. Pero **el radio está
escrito de dos maneras**:

| Radio por variable ✅ | Radio en rem crudo ❌ |
| --- | --- |
| `team_card` `partner_card` `space_card` `differentiator-card` `testimonial-card` | `area-card` (1.5) `plan-card` (1.5) `table-card` (1.5) `note-card` (1) `quote-card` (.75) `article-card` (.75) `symptoms_card` (1) |

`webflow-build` §1: *"No raw values where a token exists."* Siete cards se
saltean el token. Eso vale más que unificar el guión bajo, porque un cambio de
radio en el sistema hoy **no llega a la mitad de las cards**.

Y hay un par casi idéntico: **`plan-card` y `table-card`** — mismo padding
(2.5rem), mismo radio (1.5rem), mismo fondo; `table-card` sólo agrega
`margin-top: 4rem` y no es flex.

La inconsistencia de nombre sigue en pie y son 5 renames
(`feature_card` `partner_card` `space_card` `symptoms_card` `team_card` →
`x-card`), pero es cosmética al lado del radio.

#### Los dos `_stars` y el `_bg`

- `hero_stars` (5.625×1.125rem, flex-none) y `stories-stars` (7rem, `block`):
  mismo propósito, dos tamaños. Una clase + un combo de tamaño.
- `testimonials_bg` y `stories-bg` son el mismo fondo full-bleed
  (`absolute`, inset 0). Dos clases, un patrón.

### `shockwave` bajo tres prefijos

`shockwave_*` (9 clases), `shockwave-band` + `shockwave-band_*` (2), y el combo
`.shockwave_band.cc-light`. Un solo bloque. Además `shockwave_mark` y
`shockwave_mark-1` conviven sin que el `-1` diga nada.

### Lo que pasó limpio

- **Cero clases autogeneradas.** Ni un `Div Block N`, ni un `Heading N`, ni un
  sufijo ` 2`. En un sitio de 699 clases eso no es normal y vale anotarlo.
- **Los 19 `styles_*`** son de la página Style Guide de MAST, no del sitio del
  cliente. No se tocan.
- **Los `col-*`** (~120 clases) son el sistema de grilla de MAST. No se tocan.
- **La Home** es la referencia de cómo tiene que verse una página terminada.

## El plan aprobado — 2026-09-21

Siete decisiones de Pablo. **Nada de esto está aplicado todavía**: los renames
masivos necesitan OK sobre la lista exacta (`webflow-build` §9) y van de a uno.

| # | Decisión | Alcance |
| --- | --- | --- |
| 1 | Componetizar **sólo las 5 que ya se repiten** | Approach ×6, Quick Facts ×3, FAQ Preview ×3, Shockwave Bridge ×4, Intro |
| 2 | Los combos `cc-` de section → **utilidades globales** | `.section` + `u-pad-*` + `u-bg-*`, retira ~60 combos |
| 3 | Las grillas → **`u-grid-2/3/4` + combos de proporción** | 34 clases `_grid` → ~8 |
| 4 | Naming: **underscore una vez, marca el bloque** | 209/329 ya cumplen |
| 5 | Tercer nivel: **promover el sub a bloque** | 24 renames |
| 6 | Prefijo **por rol cuando es genérico** | scrims, bg, stars, heads |
| 7 | `u-` = **layout + color de superficie** | habilita 2 y 3 |

Las ~25 sections de instancia única **quedan sin componetizar** por ahora: es
una desviación consciente del default de `webflow-build` §3, a revisar después
del lanzamiento.

### Los 24 renames de la decisión 5

Ninguno cambia una propiedad, así que ninguno puede cambiar el render.

| Hoy | Queda |
| --- | --- |
| `article_toc-label` | `article-toc_label` |
| `article_toc-link` | `article-toc_link` |
| `article_toc-list` | `article-toc_list` |
| `articles_head-copy` | `articles-head_copy` |
| `bio_list-item` | `bio-list_item` |
| `cost_band-lines` | `cost-band_lines` |
| `cost_band-scrim` | `cost-band_scrim` |
| `cost_head-title` | `cost-head_title` |
| `cost_outro-body` | `cost-outro_body` |
| `cost_outro-copy` | `cost-outro_copy` |
| `doctor_media-col` | `doctor-media_col` |
| `doctor_review-body` | `doctor-review_body` |
| `faq_nav-link` | `faq-nav_link` |
| `hero_trust-figure` | `hero-trust_figure` |
| `hero_trust-item` | `hero-trust_item` |
| `intro_dome-icon` | `intro-dome_icon` |
| `modal_close-button` | `modal-close_button` |
| `modal_close-button_icon` | `modal-close-button_icon` |
| `nav-menu_btn-bar` | `nav-menu-btn_bar` |
| `partner_logo-img` | `partner-logo_img` |
| `team_card-actions` | `team-card_actions` |
| `team_card-body` | `team-card_body` |
| `team_card-group` | `team-card_group` |
| `team_card-photo` | `team-card_photo` |

**Tres se quedan** (`form_required-note`, `guide_fine-print`,
`intro_title-block`) y **dos pasan a combo** (`bio_visual-sticky` →
`bio_visual` + `cc-sticky`; `shockwave_mark-1` → `shockwave_mark` + `cc-alt`).
Los 8 de `inline-video_*`, `tabs-menu_dropdown-*` e `img-component_bg-overlay`
son de MAST y **no se tocan**.

**Dos clases de esta lista las mira el JS del repo**, y las dos por atributo,
no por clase: `cost-band_scrim` (`[data-cost-scrim]`) y `cost-band_lines`
(`[data-cost-lines]`). El rename es seguro; lo que **no** hay que tocar son los
`data-*`. Ver `.claude/rules/components/cost.md`.

## Clases nuevas del 2026-09-21 (tanda de animación de scroll)

Tres clases creadas por la tanda de parallax + acordeón. Las tres siguen la
convención nueva —`<bloque>_<elemento>`, underscore una sola vez— y ninguna
introduce un patrón que ya existiera:

| Clase | Para qué | Dónde |
| --- | --- | --- |
| `media-band_frame` | La ventana que clipea la foto del Photo Band. Se quedó con el `aspect-ratio` (1360/812) y el radio que tenía la imagen | `Section / Photo Band`, 5 instancias |
| `space_frame` | Lo mismo para The Space. Sólo clipea: el `.img-component` de MAST ya aporta el alto | `Section / The Space`, 1 instancia |
| `plan-step_detail` | Lo que colapsa en el acordeón de `#plan` — el texto y el remate, sin el título | Home `#plan`, 3 elementos |

**Los dos frames no son decoración, son un requisito**: un parallax sin un
ancestro que clipee muestra el borde de la foto, y ni Photo Band ni The Space
clipeaban. `.media-band_img` pasó de estático con `aspect-ratio` a
`position: absolute; inset: 0; height: 100%`, y se le quitaron el
`aspect-ratio` y el radio, que ahora viven en el frame.

**`plan-step_detail` es un caso de "el título tiene que sobrevivir al
colapso"**: en el markup original el `h3` vivía dentro de `.plan-step_body`
junto al texto, así que colapsar el body habría escondido también el título.

Ninguna de las tres entra en las familias a unificar del backlog: los frames
son ventanas de media (podrían converger con `article-card_media`, que ya es
`position: relative; overflow: hidden; aspect-ratio`) y `plan-step_detail` es
una pila vertical más — **anotala en la lista de 14 clases que un `u-stack`
con combos de gap reemplazaría**, con `row-gap: 1.0625rem`, el mismo valor
suelto que ya tenía `doctor_copy`.

## Lo que agregó la tanda de páginas utility — 2026-09-21

Ocho componentes de section nuevos, todos ya con la convención de naming, y
**cero sections crudas** en Contact, Join Our Team, la plantilla legal y el 404:

`Section / Contact Hero` · `Section / Clinic Details` · `Section / Map Band` ·
`Section / Inquiry Form` · `Section / Curation Philosophy` ·
`Section / Practice Philosophy` · `Section / Current Openings` ·
`Section / Standing Interest`

**La excepción es `Section / Product List`, y no es un descuido.** El MCP
rechaza la conversión: *"this element contains a Collection List bound to a CMS
collection. Components can't hold a live CMS binding."* Eso explica de paso por
qué Blog (2 crudas) y Patient Stories (8) figuran en la tabla de arriba — las
dos tienen Collection Lists. **Esas diez sections hay que sacarlas del backlog
de componetización: no son deuda, son un límite de la plataforma.**

Detalle completo en `.claude/rules/UTILITY-PAGES.md`.

### La ronda de la Home del 2026-09-22

Tres clases nuevas, todas con la convención:

| Clase | Para qué |
| --- | --- |
| `shockwave-band_brand` | La fila `marca + eyebrow` de la card de Colorado Shockwave |
| `shockwave-band_mark` | La marca de 2rem dentro de esa fila |
| `.shockwave-band.cc-outline` | La card en contorno en vez de rellena |

**`cc-outline` es combo y no un cambio en la base a propósito**:
`shockwave-band` ya tiene un combo hermano `.cc-light` que usan Fees y Wellness,
y tocar la base les habría agregado un borde que nadie pidió.

**Section nueva: `Section / Colorado Shockwave`** (`16eed11b-…`, 12 props),
insertada en la Home entre Testimonials y The Cost of Waiting. Clases:
`cc-shockwave-card` (combo de `.section`), `shockwave-card`,
`shockwave-card_copy`, `_head`, `_brand`, `_mark`, `_body`, `_conditions`,
`_condition`, `_media`, `_img`, más el combo `.button.cc-slate`.

Son el **cuarto prefijo** de la familia shockwave (`shockwave_*`,
`shockwave-band*`, `cc-shockwave`, y ahora `shockwave-card*`). No es un
descuido: es un bloque distinto y la convención pedía un bloque propio. Pero
confirma lo que este backlog ya decía — **esa familia necesita una pasada de
unificación**, y ahora son cuatro prefijos, no tres.

**Token nuevo `Brand/Slate Line` (`#7a999e`)** en la colección Color, para el
borde de la card, los filetes de las condiciones y el borde del botón.

**Se tocó una clase base de MAST**: `.slider-nav` pasó de `space-between` a
`center` con gap. Alcanza a cualquier slider del site, que hoy son sólo las
páginas demo de MAST. Es el mismo precedente deliberado que `ACCORDION-OPEN.md`.

**Y se borró un elemento, no una clase**: la paginación del slider de
Testimonials. `slider-pagination` y `slider-pagination_button` siguen existiendo
porque son de MAST y las usan sus demos.

### `rooted_quote` — 2026-09-23

Clase nueva para la cita *"You need to meet Dr. Schwabe."* de
`Section / Neighborhood Context`. El Figma (`711:5934`) la dibuja como
blockquote —filete vertical a la izquierda, sangría y aire propio arriba y
abajo— y lo construido la tenía como un párrafo en itálica más.

| Propiedad | Valor | Por qué |
| --- | --- | --- |
| `border-left` | **2px** solid, token *Divider On Dark* | 1px sobre banda oscura casi desaparece. 2px es lo que ya usan `plan_line` y el filete de `symptom-card` |
| `padding-left` | **1.5rem** | El Figma dibuja 21px; se usó 1.5rem porque es el valor que ya tiene `bio_quote` y evita estrenar un literal por 3px |
| `padding` vertical | **1.25rem** | Los 20px de aire que el Figma le da al blockquote por encima del gap de 20 del contenedor |

**Entra en la familia que el backlog quiere unificar.** `bio_quote` es el mismo
patrón sobre fondo claro; cuando se ejecute el paso 6 (renames por rol), las
dos son candidatas a una sola clase con un combo `cc-on-dark`. Se nombró con el
prefijo de su section por el mismo criterio que `error_bg` / `error_scrim`: no
estrenar el vocabulario nuevo en un solo lugar.

### El 404 reconstruido — 2026-09-21

Cinco clases nuevas, todas con la convención: `cc-error` (combo de `.section`),
`error_bg`, `error_scrim`, `error_content`, `error_copy`.

**`error_bg` y `error_scrim` entran en las dos familias del backlog de la
decisión 6** — la de `testimonials_bg` / `stories-bg` (→ `media_bg`) y la de los
cuatro scrims (→ `media_scrim` + combos de relleno). Se nombraron con el prefijo
de su section, como las que ya existen, para no estrenar el vocabulario nuevo en
una sola página: cuando esa tanda se ejecute, son dos clases más a migrar.

**`error_scrim` es el primer scrim claro del sitio** — `rgba(251,250,248,.85)`,
Beige al 85%. Los cuatro que existen son oscuros. Cuando se arme
`media_scrim` + combos, este es un relleno nuevo, no una variante de los otros.

**No se creó `error_actions`**: la fila de botones reusa
`.hero_actions.cc-center`. Es el caso que esta doc ya anotaba — `hero_actions`
dejó de ser "las acciones del hero" hace rato.

**Dos clases borradas**: `utility_links` y `utility_link`, de la versión
descartada del 404. No quedaron consumidores.

**Y una variante de `Plain Text` nueva: `Error Code`**, con su grupo `Error Code`
en la colección Typography. Es el camino que fija `mast-no-custom-text-classes`
para texto sin casa en la escala — el numeral de 200px del 404 — y evita la
clase de texto custom que la regla prohíbe. Detalle en `UTILITY-PAGES.md`.

### Cuatro renames del TOC, hechos — 2026-09-21

`article_toc` → **`toc`** · `article-toc_label` → **`toc_label`** ·
`article-toc_list` → **`toc_list`** · `article-toc_link` → **`toc_link`**

**Salen tres de los 24 renames de la decisión 5** (`article_toc-label`,
`article_toc-link`, `article_toc-list`): ya estaban a mitad de camino en el
Designer, y ahora quedan con el nombre por rol de la decisión 6, que es el
final. Se hicieron ahora porque el índice pasó a usarse en `/privacy-policy` y
`/terms-of-use`, y dejarlo llamándose "article" en páginas que no son artículos
era exactamente lo que la regla 3 prohíbe.

**`toc.js` tiene una constante `LINK_CLASS` acoplada a ese nombre** y se
actualizó en el mismo commit. Es el único caso del repo donde un rename de
clase obliga a tocar JS — el resto selecciona por `data-*`.

## Orden de ejecución

El orden es por relación impacto/riesgo. Los tres primeros pasos son
independientes entre sí; del 4 en adelante hay dependencia real.

| # | Paso | Riesgo | Por qué va acá |
| --- | --- | --- | --- |
| 1 | Las 4 grillas sin colapso + los 3 paddings de mobile | Ninguno | Son bugs en producción y son 7 escrituras |
| 2 | Los 31 `div` → `section` | Ninguno | Un atributo cada uno, sin efecto visual |
| 3 | Los 24 renames de la decisión 5 | Ninguno | No tocan propiedades; dejan el naming coherente **antes** de mover clases |
| 4 | Las utilidades `u-pad-*` / `u-bg-*` y el retiro de los ~60 combos | Medio | Toca todas las sections del sitio |
| 5 | Las utilidades `u-grid-*` y el retiro de ~20 clases `_grid` | Medio | Depende de que 4 haya fijado el vocabulario de utilidades |
| 6 | Los renames por rol (scrim, bg, stars, head) | Bajo | Va después de 3 para no renombrar dos veces lo mismo |
| 7 | Los 5 componentes de section que ya se repiten | Medio | Va último: componetizar markup ya limpio en vez de arrastrar las clases viejas adentro del componente |

**El paso 3 va antes que el 4 a propósito.** Renombrar primero y mover clases
después significa que cada clase se toca una sola vez; al revés, las que migran
a utilidad se renombrarían para después desaparecer.

**El paso 7 va último por la misma razón.** Una vez que una section es
componente, cambiarle una clase adentro es un cambio en la definición que se
propaga a todas las instancias — más barato que N instancias sueltas, pero el
markup conviene que entre al componente ya ordenado.

**Del 3 en adelante son renames masivos** — `webflow-build` §9 pide OK
explícito sobre la lista exacta antes de cada tanda, y van de a uno con
verificación después de cada escritura (`"success"` no garantiza que
persistió).

---

## Aplicado el 2026-09-21 — pasos 1, 2 y 3

Todo lo de abajo está **escrito en el Designer y verificado leyéndolo de
vuelta** (`"success"` no alcanza — ver `webflow-build` §9). **Falta publicar**:
hasta entonces nada de esto está en `schwabe.webflow.io`.

### Paso 1 — las cuatro grillas que nunca colapsaban ✅

`rooted_grid`, `orientation_grid`, `signpost_grid` y `partners_grid` tienen
ahora `grid-template-columns: 1fr` + `grid-column-gap: 0rem` en **medium**.
Eran las cuatro que `RESPONSIVE.md` marcaba como "el riesgo obvio" desde el
2026-09-14 y seguían en dos columnas hasta 320px. Afectaba Community Partners,
New Patients y Our Story.

El gap se escribió con el alias `grid-column-gap`, **el mismo nombre que la
base**, no `column-gap`. Escribir el nombre moderno dejaría los dos conviviendo
y el resultado lo decidiría el orden de serialización — el bug que ya pasó en
`.symptoms_card` y en `.hero_actions`.

### Paso 2 — los 31 `div` → `section` ✅

Los 31 aplicados, uno por atributo, sin efecto visual (`.section` es una clase,
no un selector de tag; verificado además que el repo no tiene ni un selector
`div.algo`).

| Página | Cuántas |
| --- | --- |
| Care Hub | 5 |
| Sports Injuries | 5 (1 de ellas `header`, ver abajo) |
| Wellness Membership | 6 |
| Fees & Policies | 7 |
| New Patients | 4 |
| Community Partners | 2 |
| Our Team | 1 |
| FAQ | 1 |

**Una salió `<header>` y no `<section>`**: `.section.cc-injury-hero` es el hero
de su página, y la regla de semántica de esta doc dice que el hero de una
página es un `<header>`. Es la única de las 31 que no usa el componente
`Section / Page Header` para su hero, así que es la única donde el tag lo
decidíamos nosotros.

### Paso 3 — los renames: 22 de los 24 ✅, y dos que NO se pueden hacer

Los 22 aplicados y verificados: las clases viejas devuelven **cero matches** y
las nuevas existen.

**`modal_close-button` y `modal_close-button_icon` quedan como están.** No es
una omisión: **`modal.min.js` de MAST hardcodea la clase**. Leído del bundle
servido (`mast@e3479b3`):

```js
t.closest('dialog button.modal_close-button, dialog button[data-modal="close"]')
```

Renombrarla rompe el botón de cerrar del modal. La salida, si algún día se
quiere el rename, es poner `data-modal="close"` en el botón **primero** —el
selector acepta las dos vías— y recién ahí renombrar. No vale la pena por una
mejora cosmética de nombre.

**La regla general que sale de acá**: antes de renombrar una clase que parece
de MAST, hay que grepear los `.min.js` que el sitio carga de verdad. Se listan
curleando el HTML publicado:

```
curl -s https://schwabe.webflow.io/faq | grep -oE 'src="https://cdn\.jsdelivr\.net[^"]*"' | sort -u
```

De los siete scripts, los demás seleccionan **sólo por `data-*`** (`[data-tabs-*]`,
`[data-accordion=...]`, `[data-video]`) o por tag (`details`, `dialog`,
`summary`). `modal_close-button` es la única clase nuestra que aparece.

**`article_toc-link` era el otro riesgo, y éste sí se pudo resolver**, porque
el acoplamiento es con código nuestro y no con un bundle de terceros:
`src/components/toc.js` **escribe la clase** sobre los links que genera
(`const LINK_CLASS = 'article_toc-link'`). El rename en Webflow sin tocar el
repo habría dejado el índice del artículo sin estilo. Actualizado en el mismo
pase, junto con los comentarios de `toc.css` y `cost.css`.

**Ojo con el alcance de la advertencia vieja de esta doc.** Decía que las dos
clases acopladas al JS eran `cost-band_scrim` y `cost-band_lines`, y que el
rename era seguro porque el JS las mira por atributo. Es cierto, pero la lista
estaba incompleta: faltaba `article_toc-link`, que el JS mira **por clase y
además la escribe**. El chequeo correcto no es "¿el JS usa atributos?" sino un
grep del repo por cada nombre de la lista.

**`shockwave_mark-1` → `shockwave_mark-alt`, que no es lo aprobado.** Lo
aprobado era partirla en `shockwave_mark` + combo `cc-alt`. Eso exige
re-estilar los elementos, no sólo renombrar, así que hice el medio paso que
saca el `-1` sin decir nada. **La conversión a combo sigue en el backlog**,
igual que `bio_visual-sticky` → `bio_visual` + `cc-sticky`.

### Lo que falta de los 24

| Clase | Estado |
| --- | --- |
| `modal_close-button` | **Bloqueada** — MAST la hardcodea |
| `modal_close-button_icon` | En pausa, para no partir el par |

---

## Corrección medida al plan: "las 5 que ya se repiten" no son 5

Medido el **2026-09-21** leyendo los árboles, no los nombres. Es el **mismo
error que ya se corrigió con los scrims**: la lista se armó desde la lista de
clases, y una clase compartida no prueba que el bloque se repita.

**`.section.cc-approach` ×6 NO es un bloque repetido — es una cáscara.** Las
seis comparten sólo `section > container`; adentro no se parecen en nada:

| Instancia | Qué tiene adentro |
| --- | --- |
| Care Hub `#approach` | `approach_grid` → `doctor_heading` + `approach_body` (3 párrafos + cita con atribución) |
| Fees `#appointment-fees` | `includes_head` + `table-card` → `<table class="plan-table">` |
| Fees `#hsa-fsa` | `includes_head` + `shockwave_band.cc-light` → `shockwave_grid` |
| Fees `#wellness-membership` | `includes_head` + `plans_grid` (2 × `Card / Membership Plan`) + `plans_extra` (párrafos + `quick_list` + CTA) |

Componetizar eso da `<section><container><slot/></container></section>`, y un
slot **no es editable por props**: no compra nada para Build Mode, que es la
razón por la que esta doc pide componetizar. Lo que esas seis comparten
—padding y fondo— es exactamente el caso de la **decisión 2** (`u-pad-*` /
`u-bg-*`), no el de la 7.

**`.section.cc-quick` ×3 es el mismo caso** (`quick_grid` de 5 stat-cards,
`policy_grid`, `payment_grid` — tres contenidos distintos).

**Los dos que SÍ son bloques repetidos**, verificados árbol contra árbol:

- **`Section / FAQ Preview`** (×3 — New Patients, Sports Injuries, Wellness).
  Estructura idéntica: `container > faq-preview_grid > [signpost_body >
  (doctor_heading, hero_actions)] + accordion_list > Accordion ×N`. Varía sólo
  el contenido: eyebrow, título, CTA, y N acordeones (4 en Wellness, 7 en New
  Patients) cada uno con su `Group Name`. Props: Eyebrow, Title, CTA Label, CTA
  Link, Group Name; los acordeones van en un **slot** — y eso funciona porque
  el `Accordion` de MAST es una instancia de componente, que es lo único que un
  slot de Webflow acepta.
- **`Section / Shockwave Bridge`** (×4 contando `.shockwave_band.cc-light`).

**Tres hallazgos de naming que aparecieron midiendo esto:**

- **`includes_head` se usa en las 3 sections de Fees**, y `includes` es el
  nombre de una section de *Wellness*. Es el caso de libro de la decisión 6
  (prefijo por rol): va a `section_head`.
- **`doctor_heading` se usa en `cc-approach` de Care Hub y en los tres
  `cc-faq-preview`.** Mismo problema, otra clase.
- **`hero_actions` se usa como fila de botones en FAQ Preview y en Fees.** Ya
  no es "las acciones del hero": es la fila de acciones de cualquier bloque.

Las tres refuerzan la decisión 6 y ninguna es urgente.

### El orden que queda, corregido

| # | Paso | Estado |
| --- | --- | --- |
| 1 | 4 grillas sin colapso | ✅ hecho |
| 2 | 31 `div` → `section` | ✅ hecho |
| 3 | 24 renames | ✅ 22 hechos, 2 bloqueados |
| 4 | `u-pad-*` / `u-bg-*` + retiro de ~60 combos `cc-` | pendiente — **acá caen `cc-approach` y `cc-quick`** |
| 5 | `u-grid-2/3/4` + retiro de ~20 `_grid` | pendiente |
| 6 | Renames por rol (scrim, bg, stars, head) | pendiente — súmenle `includes_head`, `doctor_heading`, `hero_actions` |
| 7 | Componentes de section | pendiente — **2, no 5**: FAQ Preview y Shockwave Bridge |

---

## Paso 4 — las utilidades de section, creadas el 2026-09-21

Las 11 clases existen y están verificadas. **Todavía no están aplicadas a
ninguna section**: crear una clase que nadie usa no cambia nada, y el swap
necesita medirse (ver "Por qué el swap no se hizo en la misma pasada").

### Son combos de `.section`, y eso NO es un atajo

**`.section` declara `padding-top`, `padding-bottom`, `background-color` y
`color` en su base.** Medido:

```
.section {
  position: relative;
  padding-top:    var(--_components---section--padding);
  padding-bottom: var(--_components---section--padding);
  background-color: <theme var>;
  color: <theme var>;
}
```

O sea que una utilidad global suelta —`.u-pad-xl`, (0,1,0)— **empataría con
`.section`** y el desempate lo decidiría el orden de los stylesheets, que no
controlamos. Es exactamente la trampa que ya rompió las líneas de `cost`
(`[data-cost-lines]` vs `.cost-band_lines`) y el parallax de `reveal`
(`[data-anim]` vs `.u-img-cover`), las dos documentadas en `CONVENTIONS.md`.

Los ~55 combos `cc-` de hoy funcionan **precisamente porque son combos**:
`.section.cc-approach` es (0,2,0) y le gana a `.section` siempre.

Por eso las utilidades se crearon como **combos de `.section`**: `.section.u-pad-xl`.
Misma especificidad que lo que reemplazan, cero dependencia del orden de carga,
y el vocabulario igual se colapsa de ~55 nombres a 11.

**Consecuencia a tener presente**: estas once no son utilidades globales
reutilizables en una card o en un div — son utilidades **de section**. Una
utilidad global suelta (como `u-mw-32`, que sí es `.u-mw-32` pelada) sólo es
segura cuando **nada más declara esa propiedad** sobre ese elemento. La regla:
*una utilidad puede ser global si la propiedad que declara no la declara
también la clase base del elemento; si la declara, la utilidad tiene que ser
combo.*

### La escala

| Utilidad | Base (desktop) | Medium (≤991) |
| --- | --- | --- |
| `.section.u-pad-xl` | `9.25rem` (148px) | `Section / Padding` |
| `.section.u-pad-lg` | `7.5rem` (120px) | `Section / Padding` |
| `.section.u-pad-md` | `5rem` (80px) | `Section / Padding` |
| `.section.u-pad-sm` | `3.75rem` (60px) | `Section / Padding` |
| `.section.u-pad-0` | `0` | `0` |

| Utilidad | `background-color` | `color` |
| --- | --- | --- |
| `.section.u-bg-beige` | Brand/Beige `#fbfaf8` | — (hereda) |
| `.section.u-bg-muted` | Brand/Beige Muted `#eeece4` | — (hereda) |
| `.section.u-bg-ink` | Brand/Ink `#474d33` | Brand/Beige |
| `.section.u-bg-forest` | Brand/Forest Green `#262f23` | Brand/Beige |
| `.section.u-bg-slate` | Brand/Slate Soft `#d3dddf` | Brand/Slate Ink |
| `.section.u-bg-slate-ink` | Brand/Slate Ink `#465659` | Brand/Beige |

**El fondo y el texto van juntos en la misma clase, a propósito.** Separarlos
en `u-bg-ink` + `u-text-on-dark` deja abierta la posibilidad de poner el fondo
y olvidarse del texto — fondo oscuro con texto oscuro. Emparejados, ese estado
no existe. Las dos claras no declaran `color` porque hoy tampoco lo declaran
sus combos: heredan el de `.section`.

### El hallazgo que justifica la escala: hay DOS paddings de mobile

`Section / Padding` (`--_components---section--padding`) **no es 5rem**: es un
clamp fluido de MAST, `3rem → 5rem` entre 320px y 1440px de viewport. O sea
**48px en un teléfono, ~61px a 768, ~67px a 991**.

Medidos los 55 combos, en `medium` conviven dos cosas distintas:

| Qué usan en medium | Cuántos | Cuánto da a 390px |
| --- | --- | --- |
| El token `Section / Padding` | 9 | **50px** |
| El literal `5rem` | 10 | **80px** |
| **Nada** (se quedan con el valor de desktop) | ~20 | **120 o 148px** |

Los ~20 sin override son el bug real: `cc-orientation`, `cc-team`, `cc-four`,
`cc-faq-preview`, `cc-after-book`, `cc-faq`, `cc-plan`, `cc-bio`,
`cc-directory` y compañía se quedan con **148px de padding vertical en un
teléfono**, el triple que sus hermanas. Es la causa medible de la
"inconsistencia de 9 pares de padding" que anota `RESPONSIVE.md`.

**Las cuatro utilidades de padding convergen en el mismo valor en medium**, y
eso es la decisión, no un descuido: el desktop tiene una escala de cuatro
pasos, el mobile tiene **un solo ritmo**. `RESPONSIVE.md` ya había medido que
el ritmo de mobile es 50/50 en 7 de 12 sections — o sea que converger es
formalizar lo que el diseño ya hace en la mayoría, y arreglar las que se
quedaron afuera.

### Por qué el swap no se hizo en la misma pasada

Cambiar el padding de **todas** las sections del sitio es, por definición, un
cambio de ritmo vertical en las 14 páginas. `CLAUDE.md` pide `/responsive`
antes de dar una section por buena, y **nada de lo aplicado hoy está
publicado**: medir antes y después es imposible hasta que el sitio salga.
Hacer el swap a ciegas sería exactamente el *"looks fine on my Mac"* que esa
regla existe para evitar.

El orden correcto es: **publicar → medir la línea de base → swap → volver a
medir**.

### Las que NO pueden pasar a utilidad tal cual

De los 55 combos, **11 declaran algo además de padding y fondo**, y ese algo no
entra en una utilidad de padding ni en una de color. Necesitan conservar un
combo propio (más chico) o quedarse como están:

| Combo | Qué declara de más |
| --- | --- |
| `cc-rooted` | `margin-top: -6.25rem` (el solape con la banda de arriba) + `padding-top: 15rem` |
| `cc-testimonials` | `position: relative` + `overflow: hidden` |
| `cc-relationship` | `position: relative` + `overflow-x/y: hidden` |
| `cc-footer` | `position: relative` + `margin-top: auto` |
| `cc-faq` · `cc-guide` · `cc-media-band` | `z-index: 1` |
| `cc-stories-intro` · `cc-stories-outro` | `text-align: center` |
| `cc-band` | padding en los **4** lados (incluidos los laterales) |
| `cc-media-band` | `background-color: transparent` (no es un token) |

Y **4 tienen padding asimétrico**, que la escala de arriba no expresa:
`cc-cta` (pb 12.5rem), `cc-team` (9.25 / 7.5), `cc-guide` (9.25 / 6),
`cc-footer` (7.5 / 1.625), `cc-rooted` (15 / 9.25). O se les agrega un combo de
ajuste, o se acepta redondearlos al paso más cercano — es una decisión de
diseño, no técnica.

---

## Componetizar el 100% de las sections — decisión del 2026-09-21

Pablo revirtió la decisión 4 del plan: **todas las sections van a componente**,
incluidas las ~25 de instancia única. Vuelve al default de `webflow-build` §3.

### El estándar: componetizar sin props es un retroceso

**Transformar una section en componente y no definir props la hace MENOS
editable, no más.** Los props son la única superficie de Build Mode: una
instancia anidada adentro de una definición —un `Heading`, un
`Card / Team Member`— **no se puede editar desde la instancia padre** salvo que
su prop esté bindeado a un prop del padre.

El estándar que ya fija el sitio: `Section / Page Header` tiene **17 props**,
`Section / Four Things` tiene **24**.

### La receta, calibrada sobre `Section / Team`

Hecho de punta a punta el 2026-09-21. Es la plantilla para las 46 restantes.

1. **Leer el árbol** de la section (`query_elements`, `children_depth: 4`).
2. `transform_element_to_component` con `replace: true`.
3. `create_prop` — todos los props de una, agrupados (`Main Properties`,
   `Member 1`, `Member 2`…).
4. **`update_prop` para poner el copy REAL como default.** Ver la trampa abajo.
5. `set_component_instance_prop_values` con `type: "bindable"` sobre cada
   instancia interna, una llamada por elemento.
6. `set_dom_id` con `binding` para el ancla.
7. Setear en la instancia de página lo que no puede tener default.
8. Leer los props de la instancia de vuelta y verificar que **ningún valor
   quedó en `null`**.

**Costo medido: 7 llamadas MCP + 1 lectura de árbol**, para la section **más
simple del sitio** (2 cards anidadas, 23 props).

### Tres trampas, las tres encontradas en la primera

- **Un prop de imagen no acepta default.** `create_prop` no tiene
  `default_image`, así que al bindear el `Photo` de una card el valor se va a
  `null` y **la foto desaparece**. Hay que setearlo en la instancia con
  `type: "string"` y el **asset id** como `string_value`. Verificado: las dos
  fotos volvieron.
- **Si el default del prop no es el copy real, bindear pisa el contenido.**
  Creé `Bio` con default `"Bio."`; en el momento en que bindeé, la bio real
  habría desaparecido. Por eso el paso 4 existe y va **antes** del 5.
- **El paso 8 no es opcional.** Con 23 props, un `null` pasa desapercibido.
  La lectura de vuelta es lo que lo encuentra.

### Tamaño real del trabajo

| Tipo de section | Cuántas | Llamadas c/u |
| --- | --- | --- |
| Simple (sólo título + cuerpo) | ~10 | ~5 |
| Media (3–6 items o cards anidadas) | ~25 | 10–14 |
| Compleja (Collection List, tabs, tablas, listas de accordion) | ~12 | 15–25 |

**Total estimado: 450–600 llamadas MCP + 47 lecturas de árbol.** Son varias
sesiones. Cada section es atómica: se puede parar entre una y otra sin dejar
el sitio a medias.

**Lo que NO va a poder ser prop**, y hay que aceptarlo por adelantado: el
**filtro de un Collection List** (documentado en `STORIES-BLOG-CMS.md` — un
link a Collection Page tampoco se puede setear por MCP). En las sections de
Patient Stories, Blog y FAQ el filtro queda horneado en la definición. Como son
de instancia única, no molesta.

### Progreso

| # | Page | Section | Componente | Props | Estado |
| --- | --- | --- | --- | --- | --- |
| 1 | Our Team | `cc-team` | `Section / Team` | 23 | ✅ verificado |
| 2 | Community Partners | `cc-rooted` | `Section / Neighborhood Context` | 9 | ✅ verificado |
| 3 | Community Partners | `cc-directory` | `Section / Partner Directory` | 3 | ✅ verificado |
| 4 | Our Story | `cc-band` | `Section / Full Bleed Photo` | 3 | ✅ verificado |
| 5 | Our Story | `cc-story` | `Section / Story` | 9 | ✅ verificado |
| 6 | Our Story | `cc-bio` | `Section / Doctor Bio` | 25 | ✅ verificado |
| 7 | New Patients | `cc-signpost` | `Section / Signpost` | 5 | ✅ verificado |
| 8 | New Patients | `cc-after-book` | `Section / After Booking` | 10 | ✅ verificado |
| 9 | New Patients | `cc-orientation` | `Section / Arrival Details` | 19 | ✅ verificado |
| 10 | Care Hub | `cc-approach` | `Section / Care Approach` | 8 | ✅ verificado |
| 11 | Care Hub | `cc-care-cta` | `Section / Care CTA` | 5 | ✅ verificado |
| 12 | Care Hub | `cc-shockwave` | `Section / Shockwave Bridge` | 11 | ✅ verificado |
| — | New Patients | `cc-faq-preview` | `Section / FAQ Preview` | — | pendiente — necesita slot, ver abajo |
| 13 | Care Hub | `cc-process` | `Section / First Visit Process` | 10 | ✅ verificado |
| 14 | Care Hub | `cc-areas` | `Section / Areas of Care` | 21 | ✅ verificado |
| 15 | Sports Injuries | `cc-injury-hero` | `Section / Injury Hero` | 8 | ✅ verificado |
| 16 | Sports Injuries | `cc-injury-context` | `Section / Injury Context` | 8 | ✅ verificado |
| 17 | Sports Injuries | `cc-injuries` | `Section / Conditions Treated` | 15 | ✅ verificado |
| 18 | Sports Injuries | `cc-shockwave` | **reusa** `Section / Shockwave Bridge` | 12 | ✅ verificado |
| 19 | Wellness | `cc-approach` #1 | `Section / Wellness Recognition` | 8 | ✅ verificado |
| 20 | Wellness | `cc-intro` | `Section / Wellness Intro` | 4 | ✅ verificado |
| 21 | Wellness | `cc-includes` | `Section / Membership Includes` | 27 | ✅ verificado |
| 22 | Wellness | `cc-approach` #2 | `Section / Membership Options` | 22 | ✅ verificado |
| 23 | Wellness | `cc-fit` | `Section / Membership Fit` | 11 | ✅ verificado |
| 24 | Fees | `cc-quick` #1 | `Section / Fees At A Glance` | 22 | ✅ verificado |
| 25 | Fees | `cc-insurance` | `Section / Insurance` | 9 | ✅ verificado |
| 26 | Fees | `cc-quick` #2 | `Section / Cancellation Policy` | 10 | ✅ verificado |
| 27 | Fees | `cc-quick` #3 | `Section / Payment Methods` | 6 | ✅ verificado |
| 28 | Fees | `cc-approach` #1 | `Section / Appointment Fees` | 21 | ✅ verificado |
| 29 | Fees | `cc-approach` #2 | `Section / HSA FSA` | 11 | ✅ verificado |
| 30 | Fees | `cc-approach` #3 | `Section / Membership Summary` | 30 | ✅ verificado |
| 31 | Blog | `cc-blog-intro` | `Section / Blog Intro` | 7 | ✅ verificado |
| 32 | Patient Stories | `cc-stories-hero` | `Section / Stories Hero` | 13 | ✅ verificado |
| 33 | Patient Stories | `cc-stories-intro` | `Section / Stories Intro` | 5 | ✅ verificado |
| 34 | Patient Stories | `cc-stories-outro` | `Section / Stories Outro` | 2 | ✅ verificado |
| 35 | Patient Stories | `cc-google-reviews` | `Section / Google Reviews` | 6 | ✅ verificado |
| 36 | Blog Template | `cc-article-hero` | `Section / Article Hero` | 2 | ✅ verificado |
| 37 | Blog Template | `cc-article-body` | `Section / Article Body` | 2 | ✅ verificado |
| 38 | Blog Template | `cc-article-disclaimer` | `Section / Article Disclaimer` | 3 | ✅ verificado |
| — | FAQ | `cc-faq` | — | — | ❌ **bloqueada** (Collection List) |

**El inventario completo con los ids de los 37 componentes, y la lista ordenada
de lo que falta, está en `COMPONENTIZATION-HANDOFF.md`.**

### Corrección: un binding de campo de CMS NO bloquea la conversión

Esta doc suponía que las tres sections del Blog Template estaban probablemente
bloqueadas porque bindean campos del item de la página template. **Probado el
2026-09-21: las tres se convirtieron sin error.**

Lo único que bloquea es un **Collection List** dentro de la section. Un campo
del item bindeado en un `Heading` o un `Rich Text` convive perfectamente con
una definición de componente.

Confirmado también en la otra dirección: `cc-shockwave-stories` de Patient
Stories —que esta doc listaba como bloqueada sin haberla probado— **sí lo
está**, y devuelve el error literal del Collection List.

**Páginas al 100%: Our Team, Community Partners, Our Story y Care Hub**
(verificado: `query_elements` con `element_filter: {style: "section"}` devuelve
**0**). New Patients va 3 de 4 — le falta sólo `cc-faq-preview`.

**Quedan 19 sections convertibles**, en 5 páginas: Sports Injuries (5, una de
ellas `cc-faq-preview`), Wellness (6, ídem), Fees (7), Blog (1) y Patient
Stories (4 no bloqueadas), más las 3 del Blog Template sin verificar.

### `Section / Areas of Care` expone el copy pero NO los iconos

Decisión deliberada, y es la contracara del gotcha de las imágenes: **bindear
un prop de imagen lo manda a `null`**, así que exponer los 6 iconos habría
significado seis restauraciones contra `GET /v2/assets`, que es justo el
endpoint que más tira 429. Seis chances de dejar la grilla sin iconos a cambio
de poder cambiar un icono desde Build Mode, algo que no va a pasar nunca.

Se expusieron **Title, Description y Link de cada card** (18 props) más eyebrow,
título y ancla. Verificado después de bindear: los 6 `Icon` **conservaron su
asset**, porque no se los tocó.

**La regla que sale de acá**: un prop de imagen se expone cuando la imagen es
contenido que el cliente va a querer cambiar (un retrato, una foto de section).
Un icono de sistema no lo es — dejalo en la definición.

Ids de los componentes nuevos, por si hay que retomar:

| Componente | id |
| --- | --- |
| `Section / Doctor Bio` | `7ed79d4f-b43f-4bd1-9393-991d26ac778f` |
| `Section / Signpost` | `55778001-4a34-0868-1a48-f18786447583` |
| `Section / After Booking` | `bec23d7a-e7dd-5828-5cc5-0a82e82a9beb` |
| `Section / Arrival Details` | `ee5d1adf-03b5-a46c-5a86-d233914d0a23` |
| `Section / Care Approach` | `c4b9eb33-f708-e097-e98c-47e59ff93298` |
| `Section / First Visit Process` | `71e6cb73-951d-5ed8-c8d0-fb21e7f44ec8` |
| `Section / Areas of Care` | `d1842432-760a-e50a-b630-ece80d82138b` |
| `Section / Shockwave Bridge` | `ea26a120-fe06-b0b2-66ff-80bb118474b0` |
| `Section / Care CTA` | `d2c66413-7ac4-cf34-1bdb-55eed8793455` |

### El paso que faltaba en la receta: los ids se REGENERAN al convertir

`transform_element_to_component` **no conserva los ids de los elementos de
adentro**. Los que devolvió el `query_elements` de antes de convertir no
sirven para bindear: apuntan a elementos que ya no existen, y la llamada falla
o —peor— no falla.

La receta corregida tiene un paso más, y va **después** de convertir:

```
2.  transform_element_to_component con replace: true
2b. query_elements con scope_component_id y element_filter {type:
    "ComponentInstance"} → los ids NUEVOS, con el contenido de cada instancia
    para poder mapearlos
3.  create_prop …
```

El filtro por `type: "ComponentInstance"` es lo que hace la lectura barata: sin
filtro vuelve el árbol entero (35 elementos en Arrival Details) y el 60% son
`div` de layout que no se bindean. Para las imágenes nativas se agrega una
segunda query con `{type: "Image"}`.

**No intentes derivar los ids nuevos por aritmética.** Son secuenciales sobre
el id del componente, pero cada instancia con un prop de texto consume **dos**
ids en vez de uno (el nodo de texto interno), así que la cuenta sólo cierra si
adivinás bien cuáles los consumen. Un error ahí no rompe nada visible: bindea
el párrafo 3 al prop del 4 y el copy queda mezclado.

### El rate limit del MCP es el cuello de botella real

La API tira **429 a partir de ~8 escrituras seguidas** en una misma llamada.
Medido el 2026-09-21: un batch de 23 `set_component_instance_prop_values` hizo
8 y las 15 restantes volvieron *"Too Many Requests"*.

Importa porque **el batch NO es atómico**: las 8 primeras quedaron escritas. O
sea que un 429 deja el componente a medio bindear y hay que reintentar sólo lo
que faltó — reintentar el batch entero es idempotente acá (bindear dos veces
al mismo prop no hace daño), pero cuesta el doble.

**La regla: máximo ~6 escrituras por llamada**, y meter trabajo que no sea de
API entremedio (actualizar la doc, por ejemplo) en vez de reintentar en
caliente — reintentar enseguida vuelve a fallar. Medido: el segundo batch, aun
reducido a 6, sólo pasó 4.

Y **`GET /v2/assets` tiene su propio límite, más bajo**: restaurar dos imágenes
en una sola llamada tiró 429 aunque fuera la única acción del batch. Las
imágenes se restauran **de a una**.

### Una imagen NATIVA se bindea por settings, no por props

`Section / After Booking` y `Section / Arrival Details` tienen elementos
`Image` nativos (no instancias del componente `Image` de MAST). Para ésos el
asset y el alt no son props sino **settings**, y el binding va por otra
herramienta:

```
data_element_settings_tool > set_settings
  key "assetId" → binding {source_type: "prop", prop_id: <prop image>}
  key "altText" → binding {source_type: "prop", prop_id: <prop altText>}
```

Se detectan con `query_elements` + `element_filter: {type: "Image"}`. El efecto
colateral es el mismo que con la instancia: el asset se va a `null` y hay que
reponerlo en la instancia de página.

**El `Inline Video` de MAST sí es instancia** y sus tres props útiles se
bindean normal: `Source`, `Image` (el póster) y `Alt Text`.

### `Section / FAQ Preview` necesita un slot, y por eso no se hizo todavía

Medido el 2026-09-21 sobre la instancia de New Patients: **la respuesta de cada
accordion vive DENTRO del slot del `Accordion`**, como una instancia de
`Plain Text`. `query_elements` la devuelve sin `id` propio — los hijos de un
slot no son elementos direccionables — así que **no se puede bindear a un prop
de la section**.

O sea que convertir la section tal cual da un componente donde las 7 preguntas
son editables y las 7 respuestas **no**. Y como las respuestas quedarían
horneadas en la definición, las otras dos páginas (Wellness ×4, Sports
Injuries) **no podrían reusar el componente** — serían tres componentes casi
iguales, que es justo lo que la regla del variant sprawl pide evitar.

**El diseño correcto es el que ya proponía esta doc: un slot.** Los accordions
viven en la página, no en la definición, así que quedan editables uno por uno
en Build Mode y cada página pone los suyos (7, 4, N). Los props de la section
son sólo Eyebrow, Title, CTA Label, CTA Link y Anchor ID.

**Por qué no se hizo en esta tanda**: exige sacar los 7 accordions de la
section, convertir, agregar el slot y volver a meterlos con `move_element`.
Que `move_element` acepte un slot como destino **no está verificado**, y si no
lo acepta hay que reconstruir 7 accordions con su copy a mano. Es una tanda
propia, con la instancia de New Patients como prueba antes de tocar las otras
dos.

**Y de paso apareció un bug de contenido**: el accordion 2 de New Patients
(*"Do I need to have a serious injury or chronic problem to book?"*) tiene la
respuesta en **Lorem ipsum**. Es de los que `STORIES-BLOG-CMS.md` y el handoff
marcaban como pendientes.

### Dos gotchas más, de la segunda tanda

- **Un prop tipo `id` NO acepta default vacío.** `create_prop` con
  `default_text: {value: ""}` falla con *"Invalid defaultValue for type 'id':
  value cannot be normalized to a valid ID"*. Para una section sin ancla hay
  que **omitir `default_text`** — pasarlo vacío revienta la llamada entera y se
  pierden todos los props del batch.
- **La API de assets tira 429.** Al restaurar dos imágenes seguidas,
  `set_component_instance_prop_values` devolvió
  *"GET /v2/assets returned 429"*. **Es el paso más peligroso de la receta**:
  si falla ahí, la foto ya está bindeada a un prop en `null` y la página queda
  sin imagen. Hay que reintentar de a una, espaciadas, y **verificar** que el
  valor quedó. Pasó en Our Story; las dos fotos se recuperaron.

### `Section / Full Bleed Photo` no es `Section / Photo Band`

Se comparó antes de crear el componente, para no duplicar. No son lo mismo:

| | `Photo Band` | `Full Bleed Photo` |
| --- | --- | --- |
| Raíz | `.section.cc-media-band`, `data-component="reveal"` | `.section.cc-band` |
| Estructura | `container` → `media-band_frame[data-anim]` → `Image` | `Image` directo |
| Render | inset al container, redondeada, con parallax | de borde a borde |

Reusar Photo Band habría cambiado el render de Our Story. Quedan como dos
componentes y el solape está anotado como candidato a consolidar.

**Our Team y Community Partners quedaron al 100%** (0 sections crudas,
verificado por `query_elements`).

**`Section / Partner Directory` lleva 3 props y no 57 a propósito.** Los 6
`Card / Partner` son 9 props cada uno; exponerlos serían 54 props para un
roster que la doc de ese componente ya marca como *"maps 1:1 to a future
Partners CMS item"*. Es trabajo que se tira el día que Partners pase a
colección, y 54 props planos son peor UX de edición que un item de CMS. La
recomendación es **crear la colección `Partners`**, no los props.

### El techo real: una section con Collection List NO puede ser componente

Encontrado el **2026-09-21** intentando convertir `cc-faq`. Es un límite de
plataforma, no del MCP. El error, literal:

> *Cannot convert: this element contains a Collection List bound to a CMS
> collection. Components can't hold a live CMS binding, so the Designer rejects
> the conversion outright — this is a platform limitation, not something this
> tool can work around. Unbinding the Collection List's source first lets the
> conversion succeed, but **re-binding the source (or a field inside the item)
> on the resulting component does not establish a working CMS context** and
> will fail with "Element is not inside a CMS context."*

O sea que el workaround obvio —desbindear, convertir, rebindear— **tampoco
sirve**. No hay camino.

**Cómo detectarlas antes de intentar**: `query_elements` con
`element_filter: {type: "DynamoList"}`. El tipo es `DynamoList`, no
`CollectionList` ni `w-dyn-list` — las otras dos devuelven cero.

### Las 7 sections bloqueadas

| Página | Section | Qué contiene |
| --- | --- | --- |
| FAQ | `cc-faq` | 6 Collection Lists, una por categoría |
| Blog | `cc-articles` | la grilla de artículos |
| Blog Template | `cc-articles` (`#more-articles`) | relacionados |
| Patient Stories | `cc-featured-story` | la historia destacada |
| Patient Stories | `cc-relationship` | citas de referral |
| Patient Stories | `cc-themes` | la grilla filtrada por theme |
| Patient Stories | `cc-shockwave-stories` | citas de Shockwave |

**La FAQ queda en 0% componetizada** y no hay nada que hacer: su única section
es la que tiene los 6 Collection Lists.

**Pendiente de probar**: las otras 3 del Blog Template (`cc-article-hero`,
`cc-article-body`, `cc-article-disclaimer`) no tienen Collection List pero
**sí tienen campos bindeados al item de la página template**. El mensaje de
error menciona *"or a field inside the item"*, así que probablemente estén
bloqueadas por la misma razón. Hay que probar una antes de contarlas.

### El techo, en números

| | Sections |
| --- | --- |
| Total crudas | 47 |
| Bloqueadas por CMS | **7** (posiblemente 10 con el Blog Template) |
| **Convertibles** | **40** (o 37) |

**"100% componetizado" no es alcanzable.** El máximo real es **~85%**, y el
resto no es pereza ni deuda: es Webflow.

Para esas 7, la editabilidad desde Build Mode ya existe por otra vía — **el
contenido vive en el CMS**, que es donde el cliente lo edita. Lo que queda sin
props es la cáscara (eyebrow, título de la section), y eso sí requiere entrar
al Designer.

### Las clases del footer reconstruido — 2026-09-25

18 clases nuevas, todas con la convención (`<bloque>_<elemento>`, underscore una
sola vez), al reconstruir el `Footer` contra el Figma `1183:572`:

`footer_nav` · `footer-col` · `footer-col_list` · `footer-col_item` ·
`footer-contact` · `footer-contact_row` · `footer-contact_icon` ·
`footer-contact_value` · `footer-contact_line` · `footer-contact_link` ·
`footer_brand` · `footer-brand_link` · `footer-brand_logo` ·
`footer-brand_sub` · `footer-brand_note` · `footer-brand_mark` ·
`footer-social` · `footer-social_grid` · `footer-social_pill` ·
`footer-social_icon` · `footer-social_label` · `footer_credits` ·
`footer-credits_legal` · `footer-credits_copy`

**`footer-link` se reusó tal cual** — ya existía y ya era el nombre correcto.

**Los títulos de columna NO estrenaron clase**: son `h3.eyebrow.cc-small`, que
es lo que la regla `mast-no-custom-text-classes` pide y lo que ya usaba el
footer viejo. De yapa, el `Bottom Margin` del token `Eyebrow` son los 24px
exactos que el Figma dibuja entre el título y la lista — por eso `.footer-col`
no lleva `row-gap`, que sumaría al margen y daría 48.

**Seis clases de MAST quedaron sin consumidor** al reemplazar el markup viejo:
`footer-text`, `footer-legal`, `footer-logo_link`, `footer-list`,
`footer-social_list` y `footer-social_link`. No se borraron — las páginas demo
de MAST pueden usarlas y eso hay que verificarlo primero. Están en el TODO.

Detalle completo en `.claude/rules/FOOTER.md`.

### El Announcement Bar — 2026-09-28

Cuatro clases nuevas, todas con la convención (`<bloque>_<elemento>`,
underscore una sola vez):

| Clase | Qué hace |
| --- | --- |
| `announcement` | La banda: Brand/Ink, 51px de alto mínimo, contenido centrado |
| `announcement_inner` | La fila que envuelve — texto + link, con `flex-wrap` para el teléfono |
| `announcement_link` | El link a Maps, con el filete de 2px en **Border Strong** |
| `announcement_dismiss` | El control de cerrar, absoluto contra el borde derecho |

**Dos wrappers quedaron SIN clase a propósito**, y conviene saber por qué antes
de "arreglarlo": el `div` de la frase y el `div` de la etiqueta del link no
declaran ni una propiedad — sólo existen para colgar el binding de texto del
prop. `data_whtml_builder` no crea una clase que no tiene reglas, y está bien
así: dos clases vacías más serían dos nombres más que mantener.

**Los dos iconos son Phosphor y van como combo de `ph`** — `.ph.ph-arrow-up-right`
(que ya existía, la creó el TOC) y `.ph.ph-x` (nueva). Mismo criterio que el
footer y el breadcrumb: el sitio ya carga `@phosphor-icons/web`, así que no hay
ningún SVG que subir. **Ojo: sólo está cargado el peso `regular`.**

**El filete del link es `border-bottom`, no `text-decoration`.** Medido en el
render del Figma: son **232 píxeles** de `#cacdb7`, que es exactamente 116 × 2 —
el ancho completo del bloque *Get directions + flecha* por 2px de alto. Un
`text-decoration: underline` no cubre el icono y se apoya en la línea de base
de la fuente, no a 2px del borde inferior de la caja.

### `cta_media` — 2026-09-28

Clase nueva, un solo elemento: el marco que envuelve la foto dentro de
`Section / CTA Banner`.

**No es decoración, es un requisito de plataforma.** La variante `Card Inset`
tenía que mover la foto a una columna de grilla, y la foto es una **instancia
anidada** del componente `Image` — donde la clase de variante del padre **no
llega**. La regla se escribe, se publica y no matchea nada. Un wrapper que el
CTA Banner posea sí recibe la clase.

En base es `position: absolute; inset: 0; overflow: hidden`, o sea **el render no
cambia**; la variante lo pasa a `relative` con su `grid-area`, `aspect-ratio` y
radio.

Entra en la familia de marcos de media que este backlog ya sigue —
`media-band_frame` y `space_frame` — aunque **ya no por la misma razón**: nació
como el ancestro que clipea para que el parallax no muestre el borde de la
foto, y el **2026-09-28 el CTA perdió el parallax** a pedido de Pablo. Lo que lo
mantiene vivo es la grilla de las dos variantes (ver la actualización abajo), no
el recorte. Mismo camino que `media-band_frame`, que pasó del parallax al fade y
se quedó por el radio.

**Actualización del 2026-09-28**: `cta_media` sirve a **dos** variantes, no una.
`Card Inset` lo pasa a una celda de grilla con `aspect-ratio` y radio propio;
`Split` lo pasa a la mitad derecha del card a `height: 100%` y sin radio — el
recorte lo hace el radio del card. En `base` sigue siendo `absolute; inset: 0`,
o sea que las 9 instancias de hoy renderizan igual que antes de que existiera.

### `.doctor_quote.cc-overlay` — 2026-09-29

Combo nuevo, un solo consumidor: la cita de `Section / Story` (Our Story), que
el Figma dibuja como **card oliva montada abajo a la derecha de la foto en
arco**.

**Existe porque `.doctor_quote` es una clase de tres páginas** — Home
(`#meet-your-doctor`), Our Story (`#our-story`) y New Patients
(`#after-booking`) — y las tres la quieren distinta. El 2026-09-28 se re-estiló
la base para la Home (blockquote con filete) y eso **rompió Our Story en
silencio**. El combo devuelve el tratamiento montado a una sola de las tres sin
tocar las otras dos.

**Se eligió combo sobre restaurar la base** aunque la card montada sea el
diseño original: restaurar habría roto la Home, que estaba verificada. Un
combo es aditivo y sólo toca lo que se le aplica.

`cc-overlay` no colisiona con nada: es el único combo con ese nombre en el
sitio. Si algún día New Patients vuelve a querer la card montada —hoy Derek
pide lo contrario en el comentario #109— es **aplicarle el mismo combo**, no
una clase nueva.

**La regla que deja**: antes de re-estilar una clase para aplicar el Figma de
una página, contá en cuántas páginas vive. Si es más de una, el cambio va en un
combo, no en la base.
