# Las cinco páginas utility

Contact, Products We Recommend, Join Our Team, Privacy/Terms y 404. Construidas
desde el **2026-09-21** contra el canvas Figma **`1000`** del archivo canonical
`erUTGKdYCcmvlPiKW4MZMf`, y contra el **Master Copy v0.35** para lo que el Figma
no dibuja.

## Los frames de Figma, y cómo se encontraron

**El listado de páginas del MCP de Figma está roto en este archivo**: un
`get_metadata` sin `nodeId` devuelve **una sola** página (`🖼️ Cover`), aunque el
documento tiene al menos ocho canvases. No es que las otras no existan — se leen
bien pidiéndolas por id.

La vía que funcionó para recorrer un canvas sin conocer su id: **los node ids de
un mismo canvas son secuenciales**. Con el id de un frame, el máximo id de su
subárbol +1 es el frame siguiente.

| Frame | id | x |
| --- | --- | --- |
| Contact 2 | `1000:3342` | 1600 |
| Products We Recommend | `1000:4041` | 3200 |
| alternative design (2+ products) | `1000:4283` | 4754 |
| Join Our Team | `1000:4324` | 6358 |

`1000:4638` ya no existe: la cadena corta ahí, y de ahí salió la conclusión de
que **Privacy/Terms y 404 no estaban en este canvas**. Privacy y Terms se
construyeron desde el copy del handoff.

**Las dos cosas eran falsas, y las dos estaban en el mismo canvas.** Medido el
2026-09-25 leyendo el canvas entero (`1000:2086`): el 404 es `1004:5645` y la
plantilla legal es **`1003:5313` "Privacy Policy/Terms of use Template"**. El
404 ya se rehizo contra su frame; **las dos legales siguen construidas sin
diseño** y hay que contrastarlas. Está en el TODO.

El índice completo del archivo, con los seis canvases y qué frame de cada
página está vigente, vive ahora en [FIGMA.md](FIGMA.md) — que existe
justamente para que esto no se repita.

**El 404 SÍ tenía frame y lo di por inexistente: `1004:5645`.** Lo pasó Pablo el
2026-09-21, después de que la primera versión saliera mal. Vive en **otro
canvas** (`1004`), al que el barrido por ids secuenciales desde `1000` no llega
—ese truco recorre un canvas, no el documento— y que el listado de páginas roto
tampoco muestra.

**La lección: "no encontré el frame" no es "no hay frame".** Este archivo tiene
al menos ocho canvases. Cuando un diseño no aparece, lo barato es pedir la URL
del frame, no construir desde el copy y presentarlo como si fuera el diseño.
Costó rehacer la página entera, dos veces.

**Los frames arrastran capas ocultas de otras páginas.** Contact 2 trae dentro
las cards de "Sound familiar?" de la Home en `hidden="true"`. Al leer metadata
hay que filtrar el subárbol oculto o se lee una página que no existe.

## Lo que cada página reusa

Más de lo esperado. Sólo el hero de Contact y los dos formularios son realmente
nuevos.

| Sección | Componente |
| --- | --- |
| Hero de Products (foto izq 574×672 + copy der 646) | `Section / Page Header` layout **Media** |
| Hero de Join Our Team (H1 izq 660 / standfirst der 660) | `Section / Page Header` layout **Split** |
| Foto ancha bajo el hero de Join (1360×812) | `Section / Photo Band` |
| Cierre de Products (card ink, copy izq + foto der) | `Section / Feature Card` **Media Right** |
| Chips de categoría de Products | **`filter.js`**, el mismo de Blog y Patient Stories |
| Tabla de horarios de Contact | `.hours` / `.hours_row` / `.hours_time`, ya existían |

## CMS

### `Products` — `6ab154f7449e8566a2631edf`

| Campo | Slug | Tipo |
| --- | --- | --- |
| Brand Eyebrow | `brand-eyebrow` | PlainText |
| Subtitle | `subtitle` | PlainText |
| Body | `body` | RichText |
| Image / Image Alt | `image` / `image-alt` | Image / PlainText |
| External Link / Link Label | `external-link` / `link-label` | Link / PlainText |
| Available in Clinic | `available-in-clinic` | Switch |
| Featured | `featured` | Switch |
| Order | `order` | Number |
| Category | `category` | Option (2) |

Categorías: **Sleep and Recovery** `9638a87bba75f304933810794625c8e7` ·
**Active Living** `e70325fc6fe325db55f2e00e5dd8af83`.

**El Figma dibuja cinco chips y dos son placeholder** (`CATEGORY 3`,
`CATEGORY 4`). Se cargaron sólo las dos reales.

Un item: **Pillowise** (`6ab156419a0eb8bfdd440028`), `featured: true`.

**El `Products Template` quedó en draft.** La colección crea su página de
detalle sola, y como no hay diseño para `/products/<slug>` publicaría una
página en blanco. Si algún día se quiere una ficha por producto, se saca el
draft y se construye.

**`Featured` es lo que elige el layout de la card**: ON = card ancha con la foto
a la izquierda (1200×764, el que muestra el Figma); OFF = card de grilla
(584 de ancho, foto arriba 520×300, el artboard *alternative design*).

### `Legal Pages` — **descartada**

Se creó el 2026-09-21 y **no se usa**. Pablo definió que Privacy y Terms
**no son páginas dinámicas**: van como dos páginas estáticas en las URLs que
especifica el Master Copy. La plantilla quedó en **draft** para que
`/legal/...` no publique, y la colección más sus dos items **se pueden borrar
en el Designer** — el contenido vive ahora en las páginas estáticas.

Lo que sí sobrevive de ese trabajo es la **limpieza del copy legal**, que se
reusó tal cual:

- `terms-of-use.html` termina con un **`# DOCUMENT CHANGELOG`** marcado
  `[DO NOT RENDER — internal document record only]`. Se cortó.
- Los `<h3>` del handoff se promovieron a **`<h2>`**: el H1 lo pone el header
  de la página, así que el cuerpo tiene que empezar en H2 o el outline se
  saltea un nivel.
- `Children Under the Age of 18` venía como `<p>` y es un encabezado de
  sección; el bloque de contacto venía en `<pre><code>`. Los dos corregidos.

El `®` de "Colorado Shockwave" va como **`<sup>®</sup>`**, que en estas páginas
sí se puede porque el cuerpo son elementos reales, no un prop `textContent`.

## Páginas

| Página | Slug | Page id |
| --- | --- | --- |
| Contact | `/contact` | `6ab1564775961073bc7d5506` |
| Products We Recommend | `/products-we-recommend` | `6ab1564795ef616621327d48` |
| Join Our Team | `/join-our-team` | `6ab156498f0c0001881a1cb0` |
| 404 | `/404` | `6a98805a6ec4624829beb379` (ya existía, de MAST) |

## Contact — las cuatro sections

1. **Hero** (`#contact-hero`, `<header>`) — banda Forest Green, eyebrow con
   filete, H1, standfirst, nota y **CTA `Call 720-432-9157`** en variant
   `Secondary On Dark`. A la derecha, foto redondeada con una **card de cita en
   itálica montada abajo a la derecha**.
2. **Quick details** (`#clinic-details`) — Beige Muted. Izq: eyebrow, H2 con la
   dirección, párrafo, `Phone` + número y el CTA de booking. Der: `Clinic hours`
   + las 7 filas + *"Appointments are booked in advance through Jane."*
3. **The space** (`#the-space`) — mapa a ancho de container con una card
   flotante (nombre, dirección, `OPEN IN GOOGLE MAPS ↗`) y debajo dos columnas,
   **Accessibility** y **Parking**.
4. **General inquiry** (`#inquiry-form`) — Beige. Izq H2 *"Not sure how to
   ask?"* + párrafo + CTA de booking. Der el form.

### El hero no es el `Page Header` que ya existe

`Section / Page Header` tiene cinco layouts (Primary, Split, Media, Dark,
Media Overlap) y el layout **Dark** es la banda forest green — pero con el árbol
sangrando a la derecha, no con una foto y una card de cita. Es una diferencia
**estructural**, no un estado de estilo, así que va a componente propio en vez
de a un sexto variant. Además `Page Header` tiene **9 instancias vivas** y
agregarle elementos a la definición las toca a todas.

### El mapa es imagen, no iframe

El Figma dibuja un mapa con la paleta de la marca. Un embed de Google Maps es un
iframe que no se puede pintar, así que va **imagen estilada + card flotante +
link "Open in Google Maps"**, que es el que hace el trabajo real. Esto vale
también para los dos "map placeholder" que arrastran `Section / Find Us` y
`Section / The Space`.

### Sin textura en la banda oscura

El frame muestra una textura muy sutil sobre el forest green. Va **plano**, por
coherencia con la decisión del 2026-09-07 sobre el Statement (Pablo pidió
reemplazar la foto de fondo por color plano). Si se quiere la textura, el asset
`statement-texture.png` (`6ab12a7e97e79865aaadf6d8`) ya está subido.

## Join Our Team — las cuatro sections

1. **Hero** — `Page Header` layout **Split**, sin CTA.
2. **Foto de cultura** — `Section / Photo Band` a ancho de container.
3. **Practice philosophy** (`#practice-philosophy`) — dos columnas: eyebrow, H2
   y lede a la izquierda; los cinco párrafos del argumento a la derecha.
4. **Current openings** (`#current-openings`) — H2 centrado y dos cards de rol.
5. **Standing interest** (`#standing-interest`) — copy a la izquierda, form de
   cinco campos a la derecha con un `select` de tipo de rol.

### Las vacantes son `<details>` nativo, no el Accordion de MAST

El Figma deja **el título y el resumen del rol visibles con la card cerrada**,
y el `Accordion` de MAST sólo expone `Text` para el trigger — el resumen
tendría que ir en el slot, donde se esconde. Un `<details>` nativo deja que el
`<summary>` lleve las dos cosas, funciona sin JavaScript y es accesible por
teclado y lector de pantalla de entrada.

`data_whtml_builder` **respeta `<details>` y `<summary>`**: entran como
elementos `DOM` con su tag, verificado leyéndolos de vuelta.

El precio es que el estado abierto necesita `[open]`, que el Designer no
escribe. Vive en **`src/styles/job-card.css`**, importado desde `global.js`
igual que `accordion.css`. Ese archivo además saca el triangulito de Safari
(`::-webkit-details-marker`, que `list-style: none` no alcanza a matar) y pone
el focus ring en el `summary` entero, no en el disco de 32px.

**Esto no llega al sitio hasta `npm run build` + push + bumpear el hash del
CDN.** Hasta entonces la card abre y cierra igual — sólo que el `+` no se
convierte en `−`.

### La leyenda del form no es copy

El Figma muestra *"Submission routes to info@schwabechiropractic.com and/or the
selected CRM or hiring workflow"* debajo del form. Es una anotación del handoff
para el que construye, no texto para el visitante. Se reemplazó por
*"We read every introduction. If there is a fit now or later, we will be in
touch."*

## Privacy / Terms — dos páginas estáticas

| Página | Slug | Page id |
| --- | --- | --- |
| Privacy Policy | `/privacy-policy` | `6ab168d301aac48df9e0e8ca` |
| Terms of Use | `/terms-of-use` | `6ab168d442d24d027df96b84` |

Las dos con la misma estructura: `<header>` con eyebrow "Legal" y el H1, y una
`section#legal-body` con la columna de documento de 46rem — `legal_doc`,
`legal_meta` (el rótulo "Last modified:" lo pone un `::before`, así que en el
markup sólo está la fecha) y `legal_content`.

### El cuerpo son elementos reales, no un Rich Text

**`rich_text_inner_text` escapa el HTML.** Probado: escribir
`"<h2>Test</h2><p>…</p>"` en la clave `richText` de un Rich Text deja un único
nodo `String` con el markup literal adentro — o sea que la página mostraría las
etiquetas. Sirve para texto plano y nada más.

Así que el documento entra por **`data_whtml_builder`**, que sí convierte el
HTML en elementos de Webflow de verdad. Verificado leyéndolo de vuelta:

| Página | h2 | listas | párrafos | links |
| --- | --- | --- | --- | --- |
| Privacy Policy | 14 | 13 | 38 | 9 |
| Terms of Use | 25 | 10 | — | — |

Los `<a>` entran como elementos `Link` con su `linkType` resuelto —`email` para
los `mailto:`, `url` para el resto— y los `<strong>` se preservan.

**El precio**: el cuerpo legal son ~300 elementos en el Navigator en vez de un
bloque editable como un documento. Para un texto que se toca una vez por año es
aceptable; si algún día molesta, la alternativa es pegar el texto a mano en un
Rich Text desde el Designer, que sí acepta HTML por la UI.

**Una sola acción de `whtml` aguanta 28KB de HTML** — el cuerpo de Terms entró
completo de una.

### El índice lo genera `toc.js`, no Finsweet

Pablo propuso Finsweet Attributes. Se descartó: **el repo ya tiene el
componente**. `src/components/toc.js` lee los `<h2>` del cuerpo, les pone `id`,
arma la lista y marca el activo al scrollear — exactamente lo que hace
`fs-toc`. Sumar Finsweet sería un script de terceros más en el `<head>` para
algo que ya se paga, y `webflow-build` §5 pide justificar cada librería.

El único argumento real a favor de Finsweet era que carga desde su CDN sin
esperar nuestro deploy — pero el deploy hace falta igual por `job-card.css`,
así que no compra nada.

Hooks en las dos páginas legales:

| Atributo | Dónde |
| --- | --- |
| `data-component="toc"` | `section#legal-body` |
| `data-toc` | El `<aside class="toc">` |
| `data-toc-list` | El `<nav class="toc_list">` vacío |
| `data-toc-source` | `.legal_content` |

El layout es `.legal_grid`, `260fr 800fr` con 5rem de gap, que colapsa a una
columna en `medium` — y ahí `.toc` pasa de `sticky` a `static`, porque un
índice pegajoso arriba de un documento largo en mobile se come media pantalla.
`toc.css` ya traía el filete separador para ese caso.

**El índice no aparece hasta que se publique el bundle**: el `<nav>` va vacío en
el HTML y lo llena el JS. Sin el bundle, el lector recibe el documento sin
índice, que es el documento. Eso es deliberado — es el mismo modo de
degradación que documenta `components/toc.md`.

**Esta es la primera vez que `toc.js` va a correr de verdad.** Su doc dice que
nunca se ejecutó en un navegador porque el template de artículo devuelve 404.
Conviene mirarlo con atención en la primera publicación.

## 404

**Reconstruida el 2026-09-21 contra el frame `1004:5645`**, que existía desde el
principio y yo había dado por inexistente. Las dos versiones anteriores —las dos
hechas a ciegas desde el copy— se descartaron enteras.

### Lo que el diseño pide

| Capa | Spec medido |
| --- | --- |
| Section | 1440×**800**, `flex` centrado en los dos ejes, padding **120px** |
| Fondo | La foto a sangre, `object-fit: cover` |
| Scrim | **`rgba(251,250,248,0.85)`** — Beige al 85%, un velo **claro**, no oscuro |
| Columna | **800px**, centrada, gap **40px** |
| `404` | EB Garamond Medium **200px**, `lh 1`, tracking **-4px**, Brand/Ink |
| Titular | EB Garamond **Medium Italic 32px**, `lh 1.2`, tracking -0.64px, Ink |
| Párrafo | DM Sans Regular **18px**, `lh 1.5`, Ink |
| Botón | **Uno solo** — borde 2px `#cacdb7`, alto 48, radio 99, label DM Sans Bold 15 uppercase |

Los gaps del Figma son 404 -40- titular -24- párrafo -40- botón. Se reproducen
con **un solo wrapper** (`.error_copy`, gap 1.5rem) dentro de `.error_content`
(gap 2.5rem), en vez de las tres cajas anidadas que dibuja el Figma.

### Qué se construyó

El árbol pasó a ser el de cualquier otra página del sitio:

```
.page-wrapper
├── Custom Code
├── Nav                      ← NUEVO
├── section.section.cc-error
│   ├── img.error_bg         ← la foto, asset bindeado
│   ├── .error_scrim
│   └── .error_content
│       ├── Plain Text  [Error Code]     "404"
│       ├── .error_copy
│       │   ├── Heading h1 [H4] + u-italic
│       │   └── Plain Text  [Paragraph LG]
│       └── .hero_actions.cc-center
│           └── Button [Secondary] "Contact Clinic" → /contact
└── Footer                   ← NUEVO
```

**El 404 no tenía Nav ni Footer.** El layout `page-wrapper.cc-utility` de MAST
es una caja de `min-height: 100vh` centrada, sin chrome. El Figma muestra las
dos cosas, así que **se le saco el combo `cc-utility`** y la página quedó con el
`page-wrapper` pelado como las otras 24. De paso se fue el `100vh`, que
`RESPONSIVE.md` prohíbe.

**El H1 es el titular en itálica, no el `404`.** El numeral es el elemento
visualmente dominante pero no dice nada que un buscador o un lector de pantalla
puedan usar; el titular sí. Es la regla de `webflow-build` §2 —*el tamaño visual
es una clase, no un tag*— aplicada al revés de lo que sugiere el mockup.

**Un solo botón, y no es el de booking.** El diseño manda a `Contact Clinic`. La
salida a la home la da el logo del Nav, que ahora existe — que es probablemente
por qué el diseño no dibuja un "Return Home".

Responsive escrito (no medido): `min-height` 50rem → 37.5rem en `medium` → 30rem
en `small`; padding 7.5rem → 5rem → 3.75rem, con 1.5rem laterales siempre.

### La foto ya estaba en el sitio

`create_asset` devolvió un asset **de 2026-09-07** al mandarle el MD5 del JPEG
recién exportado: el 404 reusa la **misma foto del Cost of Waiting** de la Home
(la huella de esquí cruzando el nevado). Webflow deduplica por hash, así que no
hubo alta nueva y el POST a S3 reescribió bytes idénticos — verificado bajando
la variante `p-800`, generada el 7 de septiembre y por lo tanto anterior a este
upload.

**El efecto colateral que hay que mirar**: `create_asset` **renombró el asset
existente** a `404-background.jpg`. Se corrigió a `snowfield-ski-track.jpg`, que
no nombra a ninguno de sus dos consumidores. El `hostedUrl` no cambia con el
rename, así que la Home no se toco.

**La regla: antes de subir un asset "nuevo", mirá si el hash ya existe.**
`create_asset` no falla ni avisa — devuelve el asset viejo con su id y su
`createdOn`, y le pisa el nombre.

### El numeral de 200px NO lleva clase custom

`mast-no-custom-text-classes` prohíbe clases de texto, y 200px no tiene casa en
la escala (H1 llega a 60px). Se siguió el camino (1) de esa regla: **grupo nuevo
en la colección Typography** con la forma MAST, y después **una variante de
`Plain Text`** que lo consume — igual que salieron `Stat`, `Statement` y
`Proof Band`.

| Variable | Valor |
| --- | --- |
| `Error Code/Font` | → `Fonts/Secondary Font` (EB Garamond) |
| `Error Code/Font Size` | **12.5rem**, y **8rem** en el modo `Mobile` (≤767) |
| `Error Code/Font Size Min/Max (rem)` | 8 / 12.5 |
| `Error Code/Font Weight` · `Line Height` · `Letter Spacing` · `Bottom Margin` | 500 · 1 · -0.02em · 0em |

Variante: **`Plain Text / Error Code`** (`5595cec1-8ac7-93aa-0ad3-d826bf4ee912`),
con las mismas cinco propiedades que `Stat` sobre el style `plain-text`.

**`Font Size` es un rem fijo, no un `clamp()`**, porque el MCP no escribe
expresiones en variables Size (ver `webflow-mcp-custom-value-broken` en
memoria). El escalón lo da el modo `Mobile` en vez de la fórmula fluida.
Consecuencia a tener presente: **entre 768 y 991 el numeral sigue en 200px**.
Entra —mide ~274px de ancho— pero si alguna vez se quiere la rampa fluida hay
que pegar el `clamp()` a mano en el Designer, con la forma que ya usa H1.

### Las dos versiones que se descartaron

Quedan escritas porque las dos fallaron por la misma causa —construir sin el
diseño— y la segunda parecía razonable.

1. **Cinco botónes pill y dos párrafos.** `.utility_container` es una columna de
   600px máximo; cinco pills envuelven en tres filas de anchos distintos. El
   segundo párrafo narraba en prosa los mismos destinos que los botónes.
2. **Dos botónes + una fila de links de texto** (Care · New Patients · Contact),
   con las clases `utility_links` / `utility_link`. Ordenado y coherente, y aun
   así **no era el diseño**: ni la foto, ni el numeral de 200px, ni el titular en
   italica, ni el copy. Las dos clases se **borraron** del sitio.

La regla que sobrevive de ese intento sigue siendo cierta y ahora está también
en el Figma: **un 404 tiene una acción y una salida.** El diseño es todavía más
austero — una acción, y la salida es el Nav.

**`/care-hub` ya no aparece en esta página**, así que el riesgo de que un rename
de slug la rompa desapareció con los links. El pendiente de `/care` sigue vivo
en `schwabe-seo-anchors-images`, sólo que el 404 dejó de ser un consumidor.

## Clases nuevas

Todas nacen con la convención de `COMPONENTS-NAMING.md` — `<bloque>_<elemento>`,
underscore una sola vez.

`cc-contact-hero` · `contact-hero_grid` · `contact-hero_copy` ·
`contact-hero_actions` · `contact-hero_media` · `contact-hero_quote` ·
`cc-clinic-details` · `clinic-details_grid` · `clinic-details_copy` ·
`clinic-details_phone` · `clinic-details_actions` · `clinic-details_hours` ·
`cc-map` · `map_figure` · `map_notes` · `map-card` · `map-note` ·
`legal_grid` · `cc-error` · `error_bg` · `error_scrim` · `error_content` ·
`error_copy` ·
`cc-inquiry` · `inquiry_grid` · `inquiry_copy` · `inquiry_actions` ·
`inquiry_formwrap` · `inquiry_form` · `inquiry_row` · `inquiry_field` ·
`inquiry_footer` · `inquiry_note` · `inquiry_input` · `inquiry_textarea` ·
`inquiry_submit` · `inquiry_state`

Utilidades nuevas:

| Clase | Qué hace |
| --- | --- |
| `u-radius-lg` | `overflow: hidden` + radio 1.5rem. Para media redondeada |
| `.eyebrow-component.cc-rule-left` | El filete de 2.5rem a la izquierda del eyebrow |

**`utility_links` / `utility_link` / `utility_actions` ya no están.** Eran de
la versión descartada del 404; las dos primeras se borraron del sitio y
`utility_actions` es de MAST y quedó sin consumidor en esta página.

**Las cinco clases del 404 no traen fila de acciones propia**: reusan
`.hero_actions.cc-center`, que el backlog de naming ya identifica como "la fila
de acciones de cualquier bloque" y no como algo del hero.

**El filete del eyebrow es un `::before`, no un div vacío.** Es la regla de
`COMPONENTS-NAMING.md` que salió del error de `#plan`: un div de 1px de alto es
invisible en el sitio e inmanejable en el canvas del Designer. Usa
`background-color: currentColor` + `opacity: .35` para servir sobre banda oscura
y sobre beige con una sola clase.

## Products pasó de CMS a estático — 2026-09-25

Pedido de Pablo: *"¿por qué creaste una CMS con un solo item Pillowise? Quiero
que sea estática."*

**Por qué existía**: se creó el 2026-09-21 para una lista que iba a crecer — el
handoff traía Pillowise confirmado y una sección *"Recovery tools"* marcada
`DESIGN PLACEHOLDER ONLY — do not publish until Dr. Schwabe confirms`. Nunca
creció, y un item no justifica una colección.

**El beneficio real no es de contenido, es estructural**: el Collection List era
lo único que impedía componetizar `Section / Product List`. Sin él, esa section
sale del grupo de las 7 bloqueadas.

### Lo que hubo que hacer, y por qué no fue un simple "mover"

**Un elemento dentro de un Collection List no se puede sacar de ahí.** El MCP lo
rechaza literal:

> *"Dynamic elements can only be moved within the same Collection List or
> Collection Page."*

Así que la card se **reconstruyó** al lado y después se borró la lista:

1. `data_element_builder` con `children[]` anidados → el esqueleto entero
   (`article.product-card` + `_media` + `_body` + `_head` + `_actions`) en **una
   sola llamada**.
2. Seis `insert_component_instance`: `Image`, `Eyebrow`, `Heading`,
   `Plain Text`, `Rich Text` y `Button`.
3. Los props con el copy real horneado.
4. `remove_element` sobre el `DynamoWrapper`.

**Dos variantes que parecían faltar eran la base**: el `4x3` del `Image` y el
`Inherit` del `Rich Text` son la variante `base` de sus componentes, así que no
llevan override. Se ve en `get_component` con `includeVariants` — el nombre que
sale en el atributo `data-wf--…` es el de la variante base, no una override.

### ⚠️ El prop `richText` guarda el HTML como texto, igual que el setting

`UTILITY-PAGES.md` ya documentaba que `rich_text_inner_text` **escapa el HTML**
en la clave `richText` de un Rich Text nativo. **Vale igual para el prop de una
instancia de componente**: mandado por `set_component_instance_prop_values` con
`type: "richText"`, el valor vuelve como un string con los `<p>` literales
adentro.

Por eso los cuatro párrafos se construyeron con **`data_whtml_builder`**, que sí
los convierte en elementos reales — verificado leyéndolos de vuelta: cuatro
`Paragraph` dentro de `.rich-text` dentro de `.rich-text-component`, que es la
misma estructura que renderiza el componente de MAST. La instancia de
`Rich Text` se borró.

**Lo único que se pierde es la clase `w-richtext`**, que Webflow agrega a un
Rich Text de verdad. Acá no cambia nada: esa clase sirve para figures y embeds,
y el cuerpo son cuatro párrafos planos sin formato inline.

### Verificado

| Check | Resultado |
| --- | --- |
| Collection Lists en la página | ✅ **0** |
| Estructura de la card | ✅ `.products_list > article.product-card > _media + _body` |
| Instancias de MAST conservadas | ✅ las 6, con sus variantes |
| Hooks de `filter.js` huérfanos | ✅ 0 — no había `data-filter-list` |

### Lo que queda, y NO lo hice

**Borrar la colección `Products` y su `Products Template`.** Es irreversible por
API y no hay forma de restaurar, así que queda para confirmación explícita. La
plantilla ya está en draft, o sea que no publica nada mientras tanto.

## Una section con Collection List NO puede ser componente

Límite de plataforma, confirmado por el propio MCP al intentar convertir
`Section / Product List`:

> *"this element contains a Collection List bound to a CMS collection.
> Components can't hold a live CMS binding, so the Designer rejects the
> conversion outright — this is a platform limitation. Unbinding the source
> first lets the conversion succeed, but re-binding the source (o un campo de
> adentro) en el componente resultante no establece un contexto de CMS y falla
> con 'Element is not inside a CMS context'."*

O sea que **la sección de productos queda como markup suelto en la página**, y
no es un descuido. Es la misma razón por la que Blog (2 sections crudas) y
Patient Stories (8) figuran sin componetizar en el backlog de
`COMPONENTS-NAMING.md`: las dos tienen Collection Lists. La card de producto sí
está encapsulada en su propia clase (`product-card`), que es lo que se puede
reusar.

**Lo que sí se puede** es componetizar lo que está **alrededor** del list. Por
eso `Section / Curation Philosophy` sí es componente y `Section / Product List`
no.

## Componentes creados

| Componente | Página |
| --- | --- |
| `Section / Contact Hero` | Contact |
| `Section / Clinic Details` | Contact |
| `Section / Map Band` | Contact |
| `Section / Inquiry Form` | Contact |
| `Section / Curation Philosophy` | Products |
| `Section / Practice Philosophy` | Join Our Team |
| `Section / Current Openings` | Join Our Team |
| `Section / Standing Interest` | Join Our Team |

Reusados sin tocar: `Section / Page Header` (Media en Products, Split en Join),
`Section / Photo Band`, `Section / Feature Card`, `Nav`, `Footer`,
`Custom Code`, `Heading`, `Plain Text`, `Eyebrow`, `Button`, `Image`,
`Rich Text`.

## Las clases de formulario se llaman `inquiry_*` y hay que renombrarlas

Los dos formularios —el de Contact y el de Join— comparten
`inquiry_form` / `inquiry_row` / `inquiry_field` / `inquiry_input` /
`inquiry_textarea` / `inquiry_select` / `inquiry_footer` / `inquiry_note` /
`inquiry_submit`.

Por la regla 3 de `COMPONENTS-NAMING.md` (*el prefijo nombra el rol cuando el
patrón sirve en otra página*) deberían ser **`form_*`**. Se dejaron como
`inquiry_*` porque nacieron en Contact y renombrar a mitad de la construcción
rompía el segundo formulario. **Queda un rename pendiente de `inquiry_*` a
`form_*`** — no cambia ninguna propiedad, así que no puede cambiar el render.

## ⚠️ En una página de template, los bindings de CMS por prop de componente NO persisten

**El bug más caro de esta tanda, y silencioso.**
`set_component_instance_prop_values` con `type: "bindable"` /
`binding_source_type: "cms"` **devuelve éxito y hasta te echa el binding de
vuelta en la respuesta** — y el prop desaparece. Leído inmediatamente después
con `get_component_instance_props`, el prop bindeado **no figura en la lista**:
no queda en `null`, se borra entero. Los props no bindeados de la misma llamada
(Size, Class, Visibility) sí quedan.

Reproducido tres veces sobre la plantilla legal: el `Title` del `Page Header`,
el `Content` del `Rich Text` y el `Text` del `Plain Text` de la fecha.

**No es falta de contexto de CMS.** `get_bindable_sources` sobre esos mismos
elementos devuelve los seis campos de `Legal Pages` como fuentes válidas.

**Dónde sí funciona:** exactamente el mismo mecanismo **dentro de un Collection
List** persiste sin problema — las seis bindings de la card de producto se
leyeron de vuelta intactas. O sea que el corte es *página de template* vs
*Collection List*, no el tipo de binding.

**La vía que funciona en un template**: elementos **nativos**
(`data_element_builder`) bindeados con
`data_element_settings_tool > set_settings`, que es otro camino de código y sí
persiste. Las claves son `text` para Heading/TextBlock y `richText` para
RichText; se verifica con `get_settings` tipo `all_raw_settings`.

**La consecuencia de diseño**: en una página de template **no se pueden usar
los componentes de texto de MAST para nada bindeado**. El `Page Header` de la
plantilla legal se sacó por eso y se reemplazó por un `<header>` nativo. Es una
excepción al default de componetizar, y es de la plataforma, no una elección.

**Y la lección de proceso**: `webflow-build` §8 dice que `"success"` no
garantiza que persistió. Acá eso no alcanzó — la respuesta **incluía el valor
escrito**. Lo único que lo detecta es **releer con la acción `get_`**, no mirar
lo que devolvió el `set_`.

## Gotchas del MCP de esta tanda

- **El `designer_tool` no conecta** (pide que la pestaña del Designer esté
  abierta y en foreground) **pero la superficie headless sí escribe**:
  `data_whtml_builder`, `data_element_tool`, `data_component_tool` y
  `data_style_tool` funcionan pasando `pageId` explícito, sin Designer abierto.
  O sea que el aviso de `webflow-build` §8 sobre "element operations are scoped
  to the current active page" **no aplica a estas herramientas**.
- **`data_whtml_builder` respeta el `tag`**: un `<header>` entra como Block con
  `tag: header`, y `class="section cc-contact-hero"` crea el combo de verdad
  (`.section.cc-contact-hero`), no una clase global suelta.
- **El CSS del builder no bindea variables.** Se manda layout en el `css` y
  después se pasa por `data_style_tool > update_style` con `variable_as_value`
  para color. `update_style` acepta `pseudo: "before"`, que es lo que permite el
  filete sin div.
- **`set_component_instance_prop_values` escribe props de tipo `variant`** con
  `type: "string"` y el **id del variant** como valor.
- **429 del API.** Con muchas escrituras seguidas, `GET /v2/pages` empieza a
  devolver 429 y hay que esperar. Conviene agrupar acciones en una sola llamada
  en vez de encadenar llamadas chicas.

## Pendiente

### Bloquea el lanzamiento

- **Borrar la colección `Legal Pages` y sus dos items** en el Designer. La
  plantilla ya está en draft, así que no publica, pero la colección quedó
  huérfana.
- **Notificación de los dos formularios.** Los dos quedaron con el nombre
  interno `Html Form` — `data-name` no lo pisa — así que hay que renombrarlos
  en el Designer y apuntarles la notificación a `info@schwabechiropractic.com`.
  Eso es pantalla de Designer, no MCP.
- **`/responsive` sobre las cinco páginas.** Nada de esto se vio renderizado:
  se leyó de vuelta del API, no se midió en un navegador.
- **Las imágenes.** Hero de Contact, mapa, foto de Pillowise, hero de Products,
  banda de cultura de Join y la foto del `Feature Card` son placeholders.
- **`npm run build` + push + bumpear el hash del CDN**, o `job-card.css` no
  llega y el `+` de las vacantes nunca se vuelve `−`.

### Contenido

- **El link externo de Pillowise** no está en el handoff; `external-link` quedó
  vacío.
- **La sección "Recovery tools" de Products no se construyó**: el handoff la
  marca `DESIGN PLACEHOLDER ONLY — do not publish until Dr. Schwabe confirms`.
- **Los chips de categoría de Products están ocultos** hasta que haya 2+
  productos.
- **Los links del Nav y del Footer** a las cinco páginas nuevas.
- **El `®` de "Colorado Shockwave" en el standfirst de Join Our Team sale a
  tamaño completo**: es un prop `textContent`, y ahí no entra un `<sup>`. Es el
  problema general que documenta `RESPONSIVE.md`; en el cuerpo legal sí sale
  bien porque es rich text.

### Deuda que dejó esta tanda

- **Renombrar `inquiry_*` → `form_*`** (ver arriba).
- **`Section / Product List` no es componente** y no puede serlo mientras
  contenga el Collection List (ver arriba).
El `sort` del Collection List **es un `static_json` y es quisquilloso**:
espera `fieldSlug` (no `fieldId`) y la dirección escrita entera —
`"ascending"` / `"descending"`, no `asc`. Quedó por `order` ascendente.


## El índice de las legales pasó a la derecha — 2026-09-25

Mismo pedido de Derek que movió el TOC del blog: *"fine to move Privacy Policy
/ Terms of service layout too"*, y Olha lo pidió por coherencia — *"so we have
consistent design"*.

| Clase | Antes | Ahora |
| --- | --- | --- |
| `.legal_grid` | `260fr 800fr`, gap 5rem | **`1fr 17.5rem`**, gap **7.5rem** |
| `.legal_content` | — | `grid-column: 1 / 2`, y `auto` en `medium` |

**`.toc` no se tocó dos veces.** Es la **misma clase** que usa el template de
artículo, así que el `grid-column: 2 / 3` que se escribió allá mueve el índice
de las tres páginas —`/blog/<slug>`, `/privacy-policy` y `/terms-of-use`— de
una sola escritura. Eso es exactamente lo que pedía Olha, y es la razón por la
que el rename de `article-toc_*` → `toc_*` del 2026-09-21 valió la pena.

`.legal_doc` se quedó en `max-width: 46rem` a propósito: el cuerpo legal es
texto denso y 736px es mejor medida de lectura que los 800 del artículo. Si se
quiere igualar, es una escritura.

**Falta correr `/responsive`** sobre las dos páginas después de este cambio: la
grilla invirtió proporciones y el colapso de `medium` no se midió.
