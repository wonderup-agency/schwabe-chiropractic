# Patient Stories y Blog — las colecciones de CMS

Creadas el **2026-09-18**. Las dos alimentan páginas nuevas: `/patient-stories`
(`6aad903babc54cc99f00c948`) y `/blog` (`6aad903bcafd21639790a7c5`).

Todo el copy salió del **Master Copy v0.35** (`patient-stories.html`, `blog.html`
y los tres `blog-*.html` del handoff).

---

## `Patient Stories` — `6aad8dcdb8f5b3e9f4febbbf`

Una sola colección para las dos cosas que pide la página: **la historia larga
destacada** y **las 20 citas cortas**. Las separa el switch `Featured Story`.

### Campos

| Campo | Slug | Tipo | Para qué |
| --- | --- | --- | --- |
| Name | `name` | PlainText | Etiqueta en el CMS, p. ej. "Madison — kind and thorough". No se renderiza |
| Quote | `quote` | PlainText | La cita. **Incluye las comillas curvas**, ver abajo |
| Attribution | `attribution` | PlainText | La línea de crédito completa: "Madison · Google review" |
| Theme | `theme` | Option (7) | En qué bloque de la página cae |
| Order | `order` | Number | Orden dentro del theme, empieza en 1 |
| Featured Story | `featured-story` | Switch | ON = historia larga, no card de cita |
| Story Title | `story-title` | PlainText | Sólo featured. El H2 de la historia |
| Story Body | `story-body` | RichText | Sólo featured. Las citas van como `<blockquote>` |
| Portrait | `portrait` | Image | Sólo featured |
| Needs Review | `needs-review` | Switch | ON = espera sign-off de Kati |

### Los 7 themes y dónde se usan

| Theme | id de la opción | Sección de la página |
| --- | --- | --- |
| Feeling heard | `2e6108d581965225263af9b1b626b67e` | Tab 1 de "What patients notice" |
| After other providers | `d260b6f4230bf92791952c50f52c07f1` | Tab 2 |
| Back to activity | `9cd3ce8ee5ff2a329c4ffe9fd645c310` | Tab 3 |
| Long-term care | `805e597b8ff209b6cde9181ddeabf8cc` | Tab 4 |
| Prenatal and whole-body | `ea57ad032c43ca36b8fa479b0885d1ad` | Tab 5 |
| Referral and family | `93bac1590ae8bd62b91a59fd15ca87cc` | "One good experience often leads to the next" |
| Colorado Shockwave | `f2157ab371242545b47f3a5b4860c9c3` | "A different tool, same standard of care" |

**Las comillas van adentro del campo, no en el CSS.** Un `::before` con
`content: "\201C"` sólo funciona si la cita es un párrafo; varias de estas
tienen puntos suspensivos y comillas internas. Copiar el glifo del Master Copy
es lo que garantiza que la página diga exactamente lo que dijo el paciente.

### Lo que hay cargado

21 items: **1 featured** (Sarah, `needs-review: true`) + **20 citas**.
El reparto por theme es 3/3/3/3/**1**/3/4 — el de Prenatal tiene **una sola**,
y el handoff lo marca: *"Additional prenatal testimonials recommended
post-launch. Current testimonial volume is thin."*

---

## `Blogs` — `6a98805a6ec4624829beb3a7`

**No es nueva**: venía con el starter de MAST. Se le sacaron los 5 items demo
(lorem, "The Power of Resilience" y compañía) y se le agregaron 7 campos.

### Campos agregados el 2026-09-18

| Campo | Slug | Tipo | Para qué |
| --- | --- | --- | --- |
| Category | `category` | Option (3) | Los chips de filtro y el breadcrumb del artículo |
| Hero Image | `hero-image` | Image | La foto ancha bajo el título. La card usa `image` |
| Read Time | `read-time` | PlainText | "5 min read" |
| Author | `author` | PlainText | El byline que pidió Derek |
| Author Role | `author-role` | PlainText | Segunda línea del byline |
| Author Photo | `author-photo` | Image | El retrato redondo del byline |
| SEO Title | `seo-title` | PlainText | Override del title en buscadores |
| SEO Description | `seo-description` | PlainText | Meta description |

Campos que ya traía y se siguen usando: `name`, `slug`, `summary`, `body`
(RichText), `image`, `date`, `featured`.

**El byline es campo de texto y no una colección `Authors`** — decisión del
usuario el 2026-09-18. Hoy el único autor es Dr. Kati Schwabe. Si algún día
escribe Frank u otro, se migra a colección con un `Reference`.

### Las 3 categorías

| Categoría | id de la opción |
| --- | --- |
| Chiropractic Care | `02d3c8b5451737f5c0d1105dd26af1ad` |
| Colorado Shockwave | `5db46dcef73926272a51fc11c11ecbe1` |
| Active Living | `c542b9453da33335cb8984031efe9339` |

### Los 3 artículos cargados

| Slug | Categoría | Read time |
| --- | --- | --- |
| `why-longer-chiropractic-appointments-matter` | Chiropractic Care | 5 min |
| `shockwave-therapy-plantar-fasciitis` | Colorado Shockwave | 8 min |
| `staying-active-colorado-as-you-age` | Active Living | 7 min |

**El Figma muestra el cuerpo en Lorem ipsum; el cargado es el copy real** del
handoff. El `body` es rich text con `h2` / `p` / `ul` / `blockquote` / `sup`.

**Los `h2` del body son la fuente del índice "In this article"** — el TOC se
genera en runtime, no hay un campo por entrada. Es lo que hace que agregar una
sección al artículo no exija tocar el CMS.

**El `®` va como `<sup>®</sup>` dentro del rich text.** Es el único lugar del
sitio donde el superíndice se puede poner bien hoy: `Heading` y `Plain Text` de
MAST reciben `textContent` plano. El problema general sigue abierto en
`RESPONSIVE.md`.

---

## Las 23 citas de Patient Stories salían en redonda — corregido el 2026-09-23

El campo `quote` trae las comillas curvas pero **no la itálica**, que es estilo y
vive en el Designer. Las variantes `Quote` / `Quote Small` de `Plain Text` no
declaran `font-style`, así que todo lo que rinde este CMS salía en redonda
contra un Figma que lo dibuja en `EB Garamond Medium Italic` (nodo `990:1507`).

Arreglado con `u-italic` en el prop `Class` de **4 elementos**, que cubren 23
textos porque cada Collection List rinde su template:

| Elemento | Textos |
| --- | --- |
| La cita destacada de Sarah (`featured-story_quote`) | 1 |
| El template de la grilla de referral | 3 |
| El template de la grilla de themes | 13 |
| El template de la grilla de Shockwave | 4 |

Más los 6 `<blockquote>` del `story-body` de Sarah, que se arreglaron en
`.rich-text blockquote` — o sea que **también cambian los blockquotes de los
artículos del blog**, que usan el mismo rich text.

**Los bindings de CMS sobrevivieron**: la advertencia de esta doc sobre props
bindeados que se pierden es de **páginas de template**, y `/patient-stories` es
una página estática con Collection Lists. Verificado leyendo los props de vuelta
— el `Text` sigue apuntando a `quote`.

## Gotchas del MCP que costaron tiempo

- **`insert_component_instance` no acepta una instancia como ancla.** Tira
  *"the Designer rejects inserts that use a component instance as the anchor"*.
  Hay que appendear al padre y después `move_element`.
- **`data_whtml_builder` no conoce los nombres CSS de las variables.** Un
  `var(--_color---brand--beige)` en el `css` entra como texto crudo: funciona en
  runtime porque `:root` lo declara, pero **no queda bindeado al token** en el
  Designer. Hay que pasar después por `data_style_tool > update_style` con
  `variable_as_value` y el id `variable-<uuid>`.
- **Un `Option` se escribe por id de opción, no por nombre.**

---

## Pendiente

- **El item featured tiene `Needs Review` en ON.** La historia de Sarah está
  construida a partir de citas consentidas, pero el handoff la marca *"DRAFT —
  constructed from consented source quotes. Kati to review final framing before
  publishing."* **No publicar a dominio propio sin ese OK.**
- **Consentimiento de imagen.** El `portrait` cargado es la imagen del handoff,
  no una foto real de la paciente. El handoff es explícito: *"Do not use patient
  imagery unless approved."*
- **Faltan las 4 URLs de los estudios** que cita "Selected sources" del artículo
  de plantar fasciitis. En el handoff los links eran `<h3>Read study →</h3>` sin
  `href`, así que se cargaron como lista sin link.
- **Falta una sola testimonial de prenatal** para que ese tab no quede con una
  card sola contra tres de los otros.

---

## Cómo se verificó (2026-09-18, staging)

Publicado a `schwabe.webflow.io` y curleado el HTML renderizado.

| Check | Resultado |
| --- | --- |
| `/patient-stories` responde | ✅ 200 |
| Cards de cita en el DOM | ✅ 20 — 3 referral + 13 themes + 4 shockwave |
| Chips de theme | ✅ 5 |
| Historia destacada (título, retrato, cuerpo) | ✅ |
| Cita del hero y banda de proof | ✅ |
| Collection Lists vacíos | ✅ 0 |
| `/blog` responde | ✅ 200 |
| Cards de artículo | ✅ 3 |
| Chips de categoría | ✅ 4, y coinciden exacto con los 3 valores de `Category` |
| Disclaimer y CTA de la primera versión | ✅ |
| `/blog/<slug>` | ❌ **404** — ver abajo |

### El template de artículo no publica

Las tres URLs de artículo dan 404. **No es choque de rutas con la página
estática `/blog`**: se renombró la estática a `/blog-index-test`, se publicó, y
los artículos seguían en 404.

La causa es `shouldPublish: false` en la página `Article Template`
(`6a98805a6ec4624829beb37f`), heredado del starter de MAST. El flag es **de
sólo lectura por MCP** — `update_page_settings` acepta `draft` pero no
`shouldPublish`, y poner `draft: false` no lo mueve. Es un cambio a mano en el
Designer.

Los items **sí** están publicados (`lastPublished` con fecha), así que el
contenido está listo; lo que falta es que la página del template se publique.

### El link de la card tampoco lo puede poner el MCP

La card del Blog y la de "More from the practice" tienen un `u-link-cover` que
debe apuntar al item actual. **Un link a Collection Page no se puede setear por
MCP**: probado con las tres formas y todas emiten un href literal en vez de
resolver.

| Lo que se manda | Lo que sale publicado |
| --- | --- |
| `{mode:"collectionPage", to:"detail_blog"}` | `href="detail_blog"` |
| `{mode:"collectionPage", to:"blog"}` | `href="blog"` |
| `{mode:"page", to:"<id del template>"}` | `href="#"` |

`get_bindable_sources` con `setting_key: "link"` devuelve **cero** fuentes, así
que tampoco hay binding.

Quedó guardado como `{mode:"collectionPage", to:"detail_blog"}`, que es la
intención correcta: en el Designer se abre el link, se elige **Collection page
→ Blogs** y se resuelve. Son **dos** links (la card del Blog y la de
relacionados), una vez cada uno.

### El ® en el rich text sí, en los headings no

El `<sup>®</sup>` del `Body` de los artículos renderiza como superíndice real.
Los `Heading` y `Plain Text` de MAST siguen recibiendo `textContent` plano, así
que el problema general del ® que documenta `RESPONSIVE.md` sigue abierto para
todo lo que no sea rich text.


## El artículo pasó a cuerpo-izquierda / TOC-derecha — 2026-09-25

Pedido de Derek en el prototipo, sobre el Figma nuevo **`1154:14375`**:

> *"Yes, prefer Left Justification. Good with TOC on right and fine to move
> Privacy Policy / Terms of service layout too. I assume FAQ TOC remains on
> left given page structure, but please confirm."*
> — y Olha: *"Yes, exactly"*.

La nota de Olha en el canvas explica el porqué: *"For the heading and article
to be both left aligned a slightly different composition works better — body
text on the left side and table of content on the right."*

| Clase | Antes | Ahora |
| --- | --- | --- |
| `.article_grid` | `17rem 1fr`, gap 5rem | **`1fr 17.5rem`**, gap **7.5rem** |
| `.article_content` | `max-width: 44rem` | **`50rem`** + `grid-column: 1 / 2` |
| `.toc` | (primera en el DOM) | `grid-column: 2 / 3` |
| `.article-hero_copy` | `max-width: 46rem`, mb 3rem | **`50rem`**, mb **4rem** |

Las tres medidas salen del frame: contenido **800px**, sidebar **280px**, hueco
**120px** entre los dos, y el `<h1>` arrancando en el mismo borde izquierdo que
el cuerpo (x=120 los dos).

### El TOC sigue PRIMERO en el DOM, y se mueve con `grid-column`

No se reordenó el markup. Dos razones, y las dos importan:

1. **En `medium` la grilla colapsa a una columna.** Si el TOC fuera segundo en
   el DOM, en teléfono el índice caería **al final del artículo**, que es donde
   no sirve para nada.
2. Un índice es **navegación de la página**: que el foco de teclado lo alcance
   antes que el cuerpo es lo correcto, no un defecto.

El `grid-column` se resetea a `auto` en `medium` en las dos clases. Sin ese
reset, un `grid-column: 2` contra una grilla de una sola pista manda el
elemento a una segunda fila fantasma.

### El FAQ no se tocó, y está confirmado

El índice del FAQ es `.faq_nav` dentro de `.faq_grid` — **otra clase**. Derek
preguntó explícitamente si quedaba a la izquierda y Olha confirmó que sí.

### 🔴 El byline del hero no está bindeado al CMS

Encontrado midiendo, no buscándolo. Al leer el `Section / Article Hero` para
aplicar el Figma:

- El `Image` del retrato **no tiene `assetId`** — ninguna imagen, ni binding.
- Los `Plain Text` del nombre y del rol **no tienen override de `Text`**, o sea
  que no leen `author` ni `author-role`.

O sea que el byline, la fecha, el read time y la categoría del breadcrumb
probablemente **rinden el placeholder de MAST**. Nadie lo vio nunca porque el
template devuelve 404 (`shouldPublish: false`).

**No se puede arreglar con props**: `UTILITY-PAGES.md` documenta que en una
página de template un binding de CMS por prop de componente **se borra en
silencio** — la escritura devuelve éxito y el prop desaparece al releerlo. La
vía que funciona son elementos **nativos** bindeados con
`data_element_settings_tool > set_settings`.

Es su propia tanda y está en el TODO.

### El retrato del byline se eliminó

El Figma nuevo dibuja el byline en **una sola línea** —
`By Dr. Kati Schwabe` · gap 64px · `April 2026 • 5 min read`— sin retrato
redondo. Decisión de Pablo el 2026-09-25: manda el Figma.

`.article-meta` se movió **adentro** de `.article-byline`, que pasó a
`align-items: baseline`, `column-gap: 4rem` (1.5rem en `small`) y `flex-wrap`.
El campo `author-photo` de la colección `Blogs` **no se borró**: volver atrás
es una escritura.


## Ronda del 2026-09-25 sobre el template de artículo

Cinco cosas que marcó Pablo mirando `/blog/staying-active-colorado-as-you-age`
—que **ya publica (200)**, o sea que el `shouldPublish: false` se destrabó a
mano en el Designer.

### 1. El espaciado del rich text estaba al revés

`.rich-text h1..h4` declaraba **sólo `margin-top: 1em`** y ningún
`margin-bottom`, así que el de abajo caía al token de MAST: **9.6px**.
Resultado medido: **~44px arriba del título y ~10px abajo** — el título pegado
al párrafo que introduce y flotando lejos del que lo precede, que es
exactamente al revés de como debe leerse.

Arreglado con `margin-bottom: 0.5em` en `.rich-text h2`, `h3` y `h4` (~22px a
44px de cuerpo). El Figma dibuja 40px arriba y 20px abajo.

**Son tag styles anidados** (`type: "tag"`, selector `.rich-text h2`), y se
editan con `update_style` pasando `style_name: "h2"` + `parent_style_names:
["rich-text"]`. Alcanza a **cualquier rich text del sitio** — mismo precedente
deliberado que la itálica del blockquote.

### 2. El disclaimer no iba acá

Medido en el handoff: la frase *"This content is educational. It is not a
diagnosis…"* aparece **sólo en `blog.html`** (el índice) y **0 veces** en los
tres artículos. El Figma `1154:14375` tampoco lo dibuja.

La instancia se **eliminó** del template. El componente
`Section / Article Disclaimer` queda registrado y sin usar, así que volver
atrás es una escritura.

### 3. "Share this post" — construida

Es `src/components/share.js`, componente nuevo. Va **dentro de
`.article_content`**, después del Rich Text. Detalle en `components/share.md`.

**Necesita JS y no es una preferencia**: un share intent lleva la URL de la
página, y en un template eso sólo existe en runtime — Webflow no puede bindear
la URL de una Collection Page a un `href`, que es el mismo límite que dejó
rotos los links de las cards.

Los botones son de **44px y el Figma los dibuja de 34**, a propósito:
`RESPONSIVE.md` fija 44 como mínimo de tap target y no es negociable. Mismo
criterio que las flechas del slider.

### 4. El newsletter del Figma se resolvió reusando el Free Guide

El frame trae un bloque *"Subscribe to our newsletter"* **en lorem ipsum**, y
el handoff **no lo pide en ningún artículo** — es un resto de la plantilla de
MAST. En vez de construirlo con copy inventado se insertó una instancia de
**`Section / Free Guide`** (`b7044d4d-…`), que ya tiene exactamente esa forma
—eyebrow, H2, párrafo, campo de email, submit y letra chica— con el copy real
del lead magnet.

Va entre el cuerpo del artículo y *"More from the practice"*, que es donde el
Figma pone el bloque. **Evita inventar una segunda lista de email** y no
estrena ni una clase.

### 5. 🔴 Las cards siguen linkeando a `detail_blog`

Confirmado en el HTML publicado de `/blog`:

```
<a href="detail_blog" class="u-link-cover w-inline-block">   ← ×3
```

Es el límite del MCP que esta doc ya documenta: un link a Collection Page **no
se puede setear por API**. Hay que abrirlo en el Designer y elegir
**Collection page → Blogs**. Son 2 links (la card del Blog y la de
relacionados).

**El botón "View all articles" NO es el problema**: leído del Designer, ya
apunta a `/blog` correctamente.


## El hero del artículo contra el Figma `1154:14378` — 2026-09-25

Pablo: *"no puede haber tantas diferencias"*. Medidas las seis que había, y no
eran seis decisiones sino una de escala más tres textos en la tipografía chica.

| Qué | Figma | Estaba | Ahora |
| --- | --- | --- | --- |
| Título | 48px (*Desktop/Heading 2*) | prop `Size` = **H1** → 60px a 1440 | `Size` = **H2** |
| Breadcrumb | 16px DM Sans Medium, uppercase, .04em | `Eyebrow Small` = **12px** | `.eyebrow.cc-breadcrumb` |
| Separador | icono chevron 20px | el carácter **`/`** | `<span class="ph ph-caret-right">` |
| Fecha · read time | 16px regular, caja baja | `Eyebrow Small` (12px, uppercase) | `Size` = base; el bullet en `Paragraph SM` (14px) |
| Gap breadcrumb → H1 | 24px | 20px | `row-gap: 1.5rem` |
| Foto | 1360×812 ≈ **5/3** | `aspect-ratio: 16/9` | **5/3** |

**El `Tag` sigue en `h1` y sólo cambió `Size`.** Es la regla de `webflow-build`
§2: el tamaño visual es una clase, no un tag. El artículo conserva su único H1.

### `padding-top` de `.article-byline` bajó a 1rem, y eso NO es un cambio de diseño

El salto del H1 al byline tiene que dar 40px y sale de **dos** valores: el
`row-gap` de `.article-hero_copy` más el `padding-top` de `.article-byline`.
Al subir el gap de 20 a 24 para respetar el breadcrumb, el padding tuvo que
bajar de 1.25rem a **1rem** — si no, el byline se iba a 44.

**La trampa**: en una columna flex, el gap es el mismo entre *todos* los hijos.
Corregir la separación de un par mueve la del otro. Se compensa en el elemento,
no en el contenedor.

### MAST ya tenía el breadcrumb resuelto

`.eyebrow.cc-breadcrumb` **existía** en el CSS del starter, con `margin-bottom: 0`,
`text-decoration: none`, un `:hover` que subraya y un `.cc-current-page` al 50%
de opacidad. O sea que el breadcrumb no necesitaba ni una clase nueva ni una
variante: el link va `eyebrow cc-breadcrumb` y la categoría suma
`cc-current-page`.

**Se encontró grepeando el CSS publicado, no el Designer.** Buscar `.eyebrow` en
el CSS servido devuelve la familia entera de combos en una llamada; el panel de
clases no muestra qué declara cada uno.

**El `Class` del `Plain Text` puede inyectar combos sin pelear** porque
**`.plain-text` no declara ni una propiedad** — toda la tipografía vive en las
variantes, y con `Size: base` no hay ninguna aplicada. Verificado grepeando: no
existe una regla `.plain-text {}` en las 247KB del CSS. Por eso acá el prop
`Class` alcanza y no hizo falta cambiar el tipo de elemento.

### El icono es Phosphor, y va como combo de `ph`

Mismo criterio que el footer: el sitio ya carga `@phosphor-icons/web`, así que
el chevron es un `<span>` y no un SVG.

**Ojo con cómo se crea la clase.** `create_style` con el nombre suelto crea una
clase **global** `.ph-caret-right`, y `set_style` la rechaza con *"styles not
found"* — el sitio guarda los iconos como **combo**: `.ph.ph-link`,
`.ph.ph-x-logo`. Hay que crearla con `parent_style_names: ["ph"]` para que
salga `.ph.ph-caret-right`. Con la global suelta el elemento se queda sin
estilo y el error no dice por qué.

### `article-breadcrumb_link` quedó huérfana

Sólo declaraba `text-decoration: none`, que `.cc-breadcrumb` ya trae. No se
borró: es una escritura destructiva que nadie pidió.

### Lo que NO se tocó del hero

Coincide con el Figma y se verificó: la columna de 800px, los 64px entre el
nombre y la fecha, los 64px antes de la foto, y los 8px de la meta.


## El byline se reconstruyó con elementos nativos — 2026-09-26

Para que el byline lea el CMS hay que sacar los `Plain Text` de MAST: en una
página de template un binding puesto en un **prop de instancia** se borra en
silencio (ya documentado en `UTILITY-PAGES.md`). La vía que persiste son
elementos **nativos** con `data_element_settings_tool > set_settings`.

Hecho: los 5 `Plain Text` del hero —categoría del breadcrumb, autor, fecha,
separador y read time— se reemplazaron por 6 bloques nativos
(*By* y el nombre van separados, como los dibuja el Figma).

### 🔴 Y ahí apareció el techo: **no se puede CREAR un binding de CMS dentro de la definición de un componente**

`set_settings` con `source_type: "cms"` sobre los elementos nuevos devolvió las
4 operaciones falladas con:

> *"Element is not inside a CMS context"*

**La definición de un componente no vive en ninguna página**, así que no tiene
item contra el cual resolver. Y eso pasa aunque el componente se use *sólo* en
un template de esa colección.

**Pero un binding hecho ANTES de convertir sí sobrevive.** Es exactamente el
caso del `Rich Text` de `Section / Article Body`, que rinde el `body` real: el
elemento estaba bindeado en la página y la conversión a componente se lo llevó
adentro. Por eso el Designer le muestra el ⚠️ y por eso funciona.

**La regla: un binding de CMS entra por la página, nunca por la definición.**
El orden que funciona es *bindear → convertir*, y no hay forma de hacerlo al
revés sin desarmar el componente.

### La decisión que queda abierta

Para bindear estos 6 elementos hay que **desvincular `Section / Article Hero`**
(`unlink_component_instance`), bindear en la página, y después decidir si se
vuelve a convertir en componente o se deja como markup.

Mientras tanto el hero **rinde exactamente lo mismo que antes** —los mismos
textos estáticos, ahora en elementos nativos— así que no hay regresión: quedó
listo para bindear, no a medias.

### Tres trampas del builder, las tres mudas

Las tres devolvieron `success` o `partial_success` y ninguna hizo lo que decía:

1. **`set_text` del builder no aplica.** Los 6 elementos nacieron con el
   placeholder *"This is some text inside of a div block."* El texto real hubo
   que escribirlo después — y **`set_text` del element tool tampoco sirve**
   (*"This element doesn't support text"*), porque el texto de un `TextBlock`
   vive en un nodo `String` hijo. Lo que funciona es
   `set_settings` con la clave **`text`**.
2. **`set_style` trata el array como una cadena de combos.** `["paragraph-sm",
   "u-mb-0"]` falla con *"styles not found"* aunque las dos existan sueltas,
   porque `.paragraph-sm.u-mb-0` no existe como combo. `["eyebrow",
   "cc-breadcrumb", "cc-current-page"]` funcionó **porque esa cadena sí existe**
   en MAST. Mismo error que dio el chevron del breadcrumb.
3. **Un `TextBlock` vuelve como `Block`.** El tipo pedido no es el tipo que se
   lee de vuelta, así que no sirve para verificar.

### El prop `Byline Separator` quedó sin consumidor

Era el `·` del byline y su `Plain Text` se eliminó. El separador ahora es un
bloque nativo con `•` (el glifo que dibuja el Figma) y `aria-hidden`. El prop
sigue declarado en el componente; no se borró.

### El bullet quedó en 16px y el Figma lo dibuja en 14

Por la trampa 2: aplicarle `paragraph-sm` requiere crear un combo con `u-mb-0`
para matarle el `bottom-margin` del token, que en una fila con
`align-items: center` lo subiría. Dos clases basura para 2px sobre un `•`. Se
dejó a 16.
