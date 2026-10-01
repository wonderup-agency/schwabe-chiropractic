# toc

## Purpose

El índice de navegación interna que se genera solo a partir de los `<h2>` del
cuerpo. Lo usan **tres** páginas: el template de artículo (`/blog/<slug>`) y las
dos legales, `/privacy-policy` y `/terms-of-use`.

Responde el comentario de Derek en el Figma del Blog Post: *"will this be
'sticky'? and what is active vs. non-active state for Table of Content
sections?"*

| Parte | Dónde vive |
| --- | --- |
| Sticky | CSS, en el Designer — `.toc` es `position: sticky; top: 7rem`, y pasa a `static` en medium |
| La lista | Este componente, generada de los `<h2>` del rich text |
| Estado activo | Este componente, agregando `cc-active` al link |
| Reposo vs. activo | Designer — `.article-toc_link` (opacidad .55) y `.article-toc_link.cc-active` (opacidad 1 + Olive Green) |

## Por qué la lista se genera y no es un campo del CMS

Los `<h2>` del `Body` **son** las secciones del artículo. Un campo aparte con
las entradas del índice sería una segunda copia libre de desincronizarse: el
día que alguien agrega un `<h2>` en el rich text y se olvida del campo, el
índice miente. Generándolo, agregar una sección al artículo no exige tocar el
CMS.

El `id` de cada heading también se genera acá (slug del texto, con sufijo
numérico si se repite), porque el rich text de Webflow no los emite.

### Las clases se llaman `toc_*`, no `article-toc_*`

Renombradas el **2026-09-21** al sumar el índice a las dos páginas legales:
`article_toc` → **`toc`**, `article-toc_label` → **`toc_label`**,
`article-toc_list` → **`toc_list`**, `article-toc_link` → **`toc_link`**.

Es la regla 3 de `COMPONENTS-NAMING.md` — *el prefijo nombra el rol cuando el
patrón sirve en otra página*. Un índice de contenidos no es propio de un
artículo, y de hecho ahora vive en tres páginas de las cuales dos no lo son.

**`LINK_CLASS` en `toc.js` tiene que seguir a ese nombre**: el JS estampa la
clase en cada link que crea, así que un rename en el Designer sin tocar el JS
deja los links sin estilo. Es el único acoplamiento del componente con una
clase.

## Webflow Setup

`data-component="toc"` va en la **section** del cuerpo del artículo.

| Atributo | Dónde |
| --- | --- |
| `data-component="toc"` | La section del cuerpo — `#article-body` en el artículo, `#legal-body` en las legales |
| `data-toc` | El `<aside>` — es lo que se oculta si no hay índice |
| `data-toc-list` | El `<nav>` vacío que recibe los links |
| `data-toc-source` | El contenedor del cuerpo: el `Rich Text` bindeado al `Body` en el artículo, `.legal_content` en las legales |

## Behavior

- **Init**: lee los `<h2>` de `[data-toc-source]`, les pone `id`, construye un
  `<a class="article-toc_link">` por cada uno y arranca el tracking.
- **Resize / Breakpoint**: no se usan.

### Menos de dos secciones = no hay índice

Si el artículo tiene un `<h2>` o ninguno, el componente **esconde el aside
entero**. Un índice de un solo ítem no es navegación, es ruido con borde.

### El activo se calcula por posición de scroll, no con IntersectionObserver

IO contesta *"¿este elemento está en pantalla?"*, y con varias secciones cortas
visibles a la vez eso es ambiguo: la pregunta que hay que contestar es *"¿cuál
estoy leyendo?"*. El componente marca **el último heading cuyo top pasó la
línea de lectura** (25% del viewport), que es una sola comparación por heading.

Arriba del primer heading no hay ninguno activo — preferible a marcar el
primero por defecto, que sería falso.

El handler está throttleado a un `requestAnimationFrame` y el listener es
`{ passive: true }`: cero trabajo por frame cuando no se scrollea.

### La flecha del item activo

El Figma (`1160:16538`) le pone al item que estás leyendo un **arrow-up-right de
16px** y corre su texto 28px a la derecha; los otros cuatro van a ras.

**Se construyó con el espacio siempre reservado y sólo la opacidad cambiando.**
El icono está en el DOM de los cinco links y siempre ocupa sus 16px más 12 de
gap; lo único que se anima es `opacity`. Copiar el Figma literal —indentar el
activo— haría que **cada línea del índice saltara de costado** cada vez que
cambia la sección activa, que en un mockup estático se lee como énfasis y
scrolleando se lee como un bug.

El icono es Phosphor (`ph ph-arrow-up-right`), como el resto del sitio: la
fuente ya está cargada y no hay asset que subir. **Sólo está el peso `regular`.**

El link pasó de un `textContent` plano a dos hijos —icono y `<span>` de texto—
así que `.toc_link` necesita ser flex. Esa regla vive en `toc.css` con el
ancestro adelante (`[data-toc-list] .toc_link`, (0,2,0)) porque `.toc_link` es
una clase del Designer que declara `display: block`: un empate lo decidiría el
orden de carga de los stylesheets, que no controlamos.

### `scroll-margin-top`

Los links saltan a headings dentro del artículo y el nav es sticky (~70px). Sin
`scroll-margin-top: 7rem` sobre `[data-toc-source] h2` el heading destino queda
tapado. Está en `toc.css`.

## Anti-FOUC

**No lleva.** El `<nav>` está vacío hasta que el JS lo llena, así que antes de
eso no hay nada que parpadee. Sin el bundle el lector recibe el artículo sin
índice, que es el artículo.

## Dependencies

- **Ninguna librería.** No usa GSAP.
- `./styles/toc.css`.

## DOM Expectations

```
section#article-body[data-component="toc"]
└── .article_grid
    ├── aside.article_toc[data-toc]
    │   ├── .article-toc_label   → Eyebrow "In this article"
    │   └── nav[data-toc-list]   ← vacío, lo llena el JS
    └── .article_content[data-toc-source]
        └── Rich Text            ← bindeado a Blogs > Body
```

## Cómo se verificó

**No se verificó en el navegador.** El template del artículo **devuelve 404 en
staging** (ver abajo), así que el componente nunca corrió contra el DOM real.

Lo que sí está verificado es que los tres artículos tienen material para un
índice: 5, 9 y 8 `<h2>` respectivamente en el `Body` del CMS.

### El template no publica

`/blog/<slug>` da **404** en staging. Medido el 2026-09-18: **no es un choque
de rutas** con la página estática `/blog` — se renombró la estática a
`/blog-index-test`, se publicó, y los artículos seguían en 404.

La causa es `shouldPublish: false` en la página `Article Template`
(`6a98805a6ec4624829beb37f`), que venía así del starter de MAST. **Ese flag es
de sólo lectura en el MCP**: `update_page_settings` acepta `draft` pero no
`shouldPublish`, y setear `draft: false` no lo mueve. Es un cambio a mano en el
Designer.

Hasta que eso se destrabe, el template está construido y bindeado pero no
alcanzable.

## El nombre de la clase del link está en DOS lugares

`toc.js` **escribe** la clase sobre cada `<a>` que genera
(`const LINK_CLASS = 'article-toc_link'`), y el estilo vive en el Designer. O
sea que **renombrar esa clase en Webflow sin tocar este archivo deja el índice
sin estilo**, y nada avisa: el componente sigue corriendo, los links siguen
funcionando, sólo se ven como texto pelado.

Pasó el 2026-09-21, en la tanda de renames de `COMPONENTS-NAMING.md`
(`article_toc-link` → `article-toc_link`). Se detectó grepeando `src/` por cada
nombre de la lista antes de escribir, no después.

`.article_toc` (el aside sticky) **no** se renombró: ya cumple la convención
—bloque `article`, elemento `toc`— y además `toc.js` sólo la menciona en un
comentario.


## Por qué tardaba en aparecer — medido y corregido el 2026-09-25

Reportado por Pablo: *"¿con qué hiciste el TOC? lo veo que tarda un poco."*

El índice se sirve **vacío** — el `<nav>` no tiene nada hasta que corre el JS —
así que cualquier demora del bundle se ve como una columna en blanco que después
se llena de golpe.

**La causa no era este componente, era el orden de carga de `main.js`.** El
loader hacía:

```js
const module = await import('./components/global.js')   // ← bloqueaba
await Promise.all(components.map(loadComponent))        // ← recién acá
```

O sea tres round-trips **en fila**: `main.js` → `global.js` → `toc-<hash>.js`.
Medido contra el CDN servido (`@29ed112`) con el edge caliente:

| Archivo | Peso | Tiempo |
| --- | --- | --- |
| `main.js` | 1650 B | 23ms |
| `global-DPgLrEqm.js` | 80 B | 27ms |
| `toc-CU80RwzF.js` | 1107 B | 26ms |

~76ms encadenados, que caliente no se nota. **Donde sí se nota es en un edge
frío**: jsDelivr va a buscar cada archivo a GitHub la primera vez, y ahí tres
esperas en serie son segundos, no milisegundos. Es exactamente el caso del
primer visitante después de un purge de CDN — o de mirar la página recién
publicada, que es cuando se reportó.

**El arreglo** es de `main.js`, no de acá: `loadGlobal()` arranca pero **no se
espera**, y todo entra en un solo `Promise.all`. `global.js` y el chunk del
componente ahora se piden **en paralelo**, así que la cascada baja de tres
esperas a dos. Detalle en `ARCHITECTURE.md`.

**Lo que NO cambió, a pedido**: las etiquetas siguen siendo el texto completo
del `<h2>`. Se propuso cortarlas en la primera oración —el Figma dibuja
etiquetas cortas y los H2 de los artículos son oraciones enteras— y Pablo
respondió que *"está bien como se ve"*. Queda anotado por si el índice se
vuelve difícil de escanear cuando haya más artículos.
