# Home ↔ Figma — la pasada 1:1

Specs medidos del Figma **canonical** `erUTGKdYCcmvlPiKW4MZMf`, frame
**`974:1594` "Home page 3 / Proposal 5.1.3"**, el 2026-09-21.

**Ojo con el frame.** La Home se construyó contra `596:50` *"Home page Proposal
v1"*. El frame de esta doc es **otro, más nuevo**. No son la misma propuesta, y
por eso hay diferencias que parecen "cosas que se sacaron" y en realidad nunca
estuvieron en la versión que se construyó. El alcance de acá es **sólo los seis
items que pidió Pablo**, no un rebuild de la Home.

Estado: ver **Progreso** al final.

---

## 1. Cards de "You've tried to get this sorted" — línea arriba + hover verde

Nodo `974:1704` (componente `problem card`), 332×300.

| | Reposo | Hover |
| --- | --- | --- |
| Fondo | `Brand/Beige` **#fbfaf8** | `Brand/Forest Green Dark` **#262f23** |
| Borde | **2px** solid **#cacdb7** | **igual** — no cambia |
| Línea superior | **#728738**, 2×24px, radio 8px | **igual** — no cambia |
| Texto | **#474d33** | `Brand/Beige` **#fbfaf8** |

Resto del reposo: radio **24px**, padding **32px**, `flex column`, gap **24px**,
`overflow: clip`, `align-items: start`.

Contenido: **título + cuerpo**, no un texto suelto.

- Título — EB Garamond Medium **32px** (H4), `line-height 1.2`, `tracking -0.64px`
- Cuerpo — DM Sans Regular **18px**, `line-height 1.5`
- Gap entre los dos: **24px**

**Esto cambia el contenido, no sólo el estilo.** Hoy cada card lleva una sola
frase; el diseño las parte en dos. El copy nuevo, card por card:

| Título | Cuerpo |
| --- | --- |
| A ski day costs you two days | and so can a hard workout, even when it felt fine at the time. |
| Your SI joint lights up | after a long drive, a travel day, or something as simple as gardening. |
| Your shoulder nags | every time you press overhead, reach into the back seat, or sleep on that side. |
| Your low back never fully settles | or your hip, or your plantar fascia, no matter how much you stretch, rest, or modify. |
| You're quietly starting to wonder | if this is just who you are now. |
| You tweaked something recently | your neck, your back, or your shoulder, and you'd rather handle it now than let it turn into a pattern |

**La card oscura del mockup es el hover, no una card destacada.** `974:1747`
("You're quietly starting to wonder") está pintada en `#262f23` mientras las
otras seis están en beige — es cómo se demuestra el estado, igual que hizo el
Figma con la card de Areas of Care. Ver `animations/AREA-CARD-HOVER.md`: ahí ya
se resolvió el mismo caso y la conclusión fue hover, no destacada.

**El hover va en CSS, no en el Designer**: hay que cambiar el color de dos
hijos (título y cuerpo) desde el hover del padre, y Webflow no escribe
selectores de descendencia. Mismo límite que `button.css` y `area-card.css`.
Y va scopeado a `(hover: hover) and (pointer: fine)`.

## 2. "You do not need another guess" — el fondo

Nodo `974:1763`. **No es color plano.** Son dos capas:

1. `Brand/Olive Green Dark` **#474d33**
2. Una **textura encima al `opacity: 15%`**, `background-size: 1050px 615.11px`,
   `background-position: top left`

Asset: `statement-texture.png`, 1024×600, 88KB.

Texto (sin cambios respecto de lo construido): dos líneas de **48px** EB
Garamond, `Tone/Strong` **#f7f6f5**, centradas, ancho **680px**, gap **40px**.
La primera en itálica.

**Contexto que importa**: el 2026-09-07 Pablo pidió reemplazar la foto de fondo
por color plano, y así se construyó. La textura del frame nuevo es el término
medio — no vuelve la foto, pero el fondo deja de ser liso.

## 3. Testimonials de "Dr. Kati Schwabe" — los dos de abajo

Nodo `974:1803`. Card, **664×162**:

| Propiedad | Valor |
| --- | --- |
| Fondo | **#fbfaf8** |
| Radio | **16px** — no 24 |
| Padding | **32px** |
| Layout | `flex column`, `align-items: start`, gap **16px** |
| Cita | EB Garamond **Medium Italic 24px**, `lh 1.2`, `tracking -0.48px`, **#474d33** |
| Atribución | DM Sans Regular **16px**, `lh 1.5`, **#474d33** |

La fila que los contiene (`974:1802`) mide 1360 y son dos de 664 → gap **32px**.

## 4. Section nueva — "Three steps to moving the way you want to again"

Nodo `974:1811` ("Process 3"), 1440×1103. Va **entre Meet Your Doctor y What
Makes This Different**.

**Section**: fondo `Primary/Forest Green` **#262f23**, padding **148px 40px**,
`flex column`, `align-items: center`, gap **80px**.

**Intro** (680px, centrado, gap 16px):
- Eyebrow "How it works" entre dos filetes de **40×1px** `rgba(239,242,237,.2)`,
  DM Sans Medium **16px**, `tracking 0.64px`, uppercase, **#fbfaf8**, `pb 8px`
- H2 "Three steps to moving the way you want to again." — EB Garamond Medium
  **48px**, `lh 1`, `tracking -0.96px`, **#fbfaf8**, centrado

**Cuerpo** (fila, gap 24px, `align-items: center`):
- **Izquierda** — imagen `flex: 1`, alto **457px**, radio **24px**, `object-fit: cover`
- **Derecha** — **721px**, `flex column`, gap **20px**, con una **línea vertical**
  a `left: 42px` / `top: 42.8px`, alto **368px**: es un borde de **2px #fbfaf8
  al 10% de opacidad** (el SVG del Figma es sólo eso — no hace falta asset)

**Cada paso** (fila, gap 20px):
- Círculo **80×80**, radio 40px, fondo **#262f23**, número EB Garamond Medium
  **48px** `Primary/Olive Green` **#717a52**, centrado
- Contenido `py 24px`, gap **17px**:
  - Título — EB Garamond Medium **32px**, **#fbfaf8**, `lh 1.2`, `tracking -0.64px`
  - *(sólo paso 1)* Cuerpo — DM Sans Regular **16px**, **#fbfaf8**, `lh 1.5`
  - *(sólo paso 1)* Remate — EB Garamond **Medium Italic 24px**, **#fbfaf8**,
    `lh 1.2`, `tracking -0.48px`

Los tres pasos: **1 Be Heard** · **2 Get a Plan That Fits Your Body** ·
**3 Move With Confidence**.

Copy del paso 1:
> Book your 60-minute first visit and start with a real conversation: a full
> health history from birth through today, a thorough postural, orthopedic, and
> neurological evaluation, hands-on treatment, and a clear explanation of what
> your doctor found. For the first time, you leave understanding what is
> actually going on.
>
> *You get clarity, not another guess.*

**CTA** al pie: fondo **#fbfaf8**, alto 48px, radio 99px, `pl 20 / pr 8`, gap 12;
label DM Sans Bold **15px** uppercase **#6b744e**; disco 32px **#6b744e** con
flecha 20px. Es el `Button` de MAST en su variante clara — **no** se construye a
mano.

### Resuelto: es un acordeón, y el copy existe

El Figma sólo muestra expandido el paso 1, pero **el Master Copy v0.35 tiene
body y remate para los tres** (`home.html` del handoff, sección
**`Home-05 Plan`**, ancla **`plan`** — el handoff pide preservar ese id). O sea
que el frame estático está mostrando un acordeón con el primero abierto, no un
bloque donde sólo el primero lleva texto.

| Paso | Remate |
| --- | --- |
| 1 · Be Heard | *You get clarity, not another guess.* |
| 2 · Get a Plan That Fits Your Body | *You leave knowing what happens next.* |
| 3 · Move With Confidence | *A body you trust again. For the long run.* |

Cuerpos completos en `home.html` del handoff. Se construye con el `Accordion`
de MAST — ojo con `Preview in Designer` + `Group Name`, que es el bug
documentado en `animations/ACCORDION-OPEN.md`: para que el paso 1 arranque
abierto necesita **los dos props en `true`**.

### La imagen de la izquierda es un placeholder

El layer se llama *"Img - Abstract acoustic wave treatment graphic"* pero la
imagen que trae es una foto de consulta. Son dos PNG superpuestos con un
degradado blanco al 50% en el medio, y el de arriba pesa **9.2MB**. Hace falta
definir qué foto va.

## 5. Testimonials — la foto de fondo

Nodo `974:1982`. La foto cambia por `testimonials-bg.png` (1024×683).

El scrim del Figma es **`rgba(38,47,35,0.2)`** sobre un bloque de 1440×1114
centrado. Anotado porque el scrim construido puede no coincidir — verificar
contra `components/cost.md`, que documenta que un scrim de .2 sobre foto clara
**no llega a AA** (medido: p95 2.74:1). Si esta foto es clara, el .2 del Figma
no alcanza y hay que subirlo.

## 6. CTA Banner "Your next step is simple" — el fondo

Nodo `974:2344`. La foto cambia por `cta-bg.png`.

**El asset viene en 4096×2731 y pesa 7.3MB.** No se sube así: `webflow-build`
§5 pide dimensiones correctas y WebP. Se redimensiona a ~2400px de ancho y se
convierte antes de subir.

Resto de la section, para verificar contra lo construido: section `#eeece4`,
padding `100px 40px`; card alto **736px**, radio 24px, padding `100px 80px`;
H1 **60px** #fbfaf8; subtítulo itálica 32px; párrafo 18px; ancho de la columna
**647px** (el párrafo en 548px).

---

## Assets bajados

En el scratchpad de la sesión. **Las URLs de Figma expiran a los 7 días**, así
que si esto se retoma más tarde hay que volver a exportarlos.

| Archivo | Tamaño | Para |
| --- | --- | --- |
| `statement-texture.png` | 1024×600, 88KB | Item 2 |
| `testimonials-bg.png` | 1024×683, 576KB | Item 5 |
| `cta-bg.png` | 4096×2731, **7.3MB** | Item 6 — **optimizar** |
| `steps-media-a/b.png` | 1448×1086 / 4096×2730 (**9.2MB**) | Item 4 — placeholder |

## Dos cosas que aparecieron midiendo y no son de esta lista

- **El sitio publicado sigue en `u-mode-dark`.** Medido por CDP el 2026-09-21:
  `<html>` lleva la clase, aunque `theme.css` **sí** está en el CSS servido
  (`@c1bd42f`). O sea que el `:root:root` llegó pero la clase sigue puesta —
  hay que verificar si los tokens resuelven bien o si el fix quedó corto.
- **El hash del CDN es `c1bd42f`**, no `fc2f79a` como decía `RESPONSIVE.md`.
  Ya corregido allá.

---

## Progreso

### Hecho y verificado — 2026-09-21

| Item | Qué se hizo |
| --- | --- |
| 1 (parcial) | `src/styles/symptom-card.css` creado e importado desde `global.js`. `data-symptom-card` en **las 10 cards** de la definición (la marquesina duplica el track de 5), leído de vuelta en 2 para confirmar. `.symptoms_card` actualizada al spec: 20.75rem, min-height 18.75rem, padding 2rem, columna, alineada a la izquierda, beige, borde 2px Border Strong, radio por token |
| 5 | `Background Photo` de Testimonials → `6ab12b499ce3fa43176089be` |
| 6 | `Image` del CTA Banner → `6ab12b4a03da6de4cbf965ae` |
| 3 | Los dos testimonials del doctor pasaron de columna con filete a **card**: beige, radio 1rem, padding 2rem, gap 1rem, gap 2rem entre las dos. Tipografía intacta — ya eran las variantes correctas de MAST |
| 4 | **`#plan` construida** e insertada después de Meet Your Doctor: banda forest green, eyebrow entre filetes, H2, grilla media + 3 pasos con círculo numerado y filete vertical, y el CTA en variante **Primary On Dark** |
| 8 (nuevo) | **El hover de las cards parpadeaba.** Mi regla de descendiente pintaba el texto sin transición mientras el fondo tardaba 300ms: texto beige sobre fondo todavía beige. Se **borró** la regla — el texto hereda y acompaña al fondo solo |
| 7 (nuevo) | **Los dos CTA del hero salían apilados.** Causa medida: la columna de copy da 666px y la fila necesita 677. Combo `.container.cc-hero-wide` (desktop) + `hero_actions` a `flex-start` con gap 1rem. Detalle en `RESPONSIVE.md` |

**Los cuatro radios longhand viejos de `.symptoms_card` había que borrarlos**:
quedaban conviviendo con el shorthand nuevo y el longhand gana. Lo mismo pasó
en `hero_actions` con `grid-column-gap` contra `column-gap`. **`update_style`
agrega, no reemplaza**: cuando la propiedad nueva tiene un alias o un longhand
viejo, hay que pasar `remove_properties` en la misma pasada o queda un empate
que decide el orden de serialización.

**⚠️ Este combo se rompió y se corrigió el 2026-09-21.** Su override de
`medium` apuntaba a la variable del *gutter* en vez de a la del ancho máximo y
dejaba el hero en 23px de ancho en todo mobile. Ahora vive sólo en `large`
(≥1280) y abajo hereda `.container`. Detalle completo en `RESPONSIVE.md`.

**El combo se llama `cc-hero-wide` y no `cc-hero` a propósito**: `cc-hero` ya
es el combo de la `.section`, y un mismo nombre de combo sobre dos bases
distintas es lo que obligó a renombrar `.card.cc-cta` → `.card.cc-cta-card`
(ver `RESPONSIVE.md`).

### Assets subidos

| Asset | id | Peso |
| --- | --- | --- |
| `statement-texture.png` | `6ab12a7e97e79865aaadf6d8` | 88KB |
| `testimonials-background.jpg` | `6ab12b499ce3fa43176089be` | 109KB (era 576KB PNG) |
| `cta-banner-background.jpg` | `6ab12b4a03da6de4cbf965ae` | 464KB, 2400px (era **7.3MB** a 4096px) |

### Dos gotchas del MCP que costaron tiempo

- **`asset_tool > upload_image_by_url` devuelve timeout pero la subida sale
  igual.** El timeout es de la respuesta del MCP, no de la operación: la
  textura de 88KB reportó error y estaba subida. **Hay que verificar con
  `list_assets` antes de reintentar**, o se duplica el asset.
- **Arriba de ~100KB esa vía sí falla de verdad.** Las fotos de 576KB y 7.3MB
  no entraron por URL. La vía que funciona para archivos locales es
  `data_assets_tool > create_asset` (con el **MD5 en hex de 32 chars**) y
  después un POST multipart al `uploadUrl` presignado con todos los campos de
  `uploadDetails` más `file`. Devuelve 201.

### Lo que sigue, en orden

1. **Item 2** — el fondo del Statement: capa de textura al 15% sobre el ink.
2. **Item 3** — los dos testimonials del doctor: radio a 16px, padding 32, gap 16.
3. **Item 1, la otra mitad** — partir las cards en título + cuerpo. Son 6 props
   nuevas en la definición y un `Plain Text` más por card, **×2 porque la
   marquesina duplica el track**.
4. **Item 4** — construir `Section / Plan` con el acordeón.
5. **`/responsive` sobre la Home** — obligatorio antes de dar esto por cerrado
   (CLAUDE.md). La card pasó de 22rem centrada a 20.75rem alineada a la
   izquierda y con 2rem de padding: hay que medir 390 y 320.
6. **Build + push + bumpear el hash del CDN**, o el CSS del hover no llega al
   sitio. Hoy está en `@216bb5a` (verificado el 2026-09-21).

### La itálica de los items 3 y 4 faltaba — corregido el 2026-09-23

Los dos specs de esta doc ya decían **Medium Italic** y lo construido salió en
redonda, porque la variante `Quote` de `Plain Text` no declara `font-style` (el
detalle está en `RESPONSIVE.md`).

| Item | Qué | Arreglo |
| --- | --- | --- |
| 3 | Los 2 Google reviews del doctor — *"Cita: EB Garamond Medium Italic 24px"* | `u-italic` en el prop `Class` de cada uno, en la definición de `Section / Meet Your Doctor` |
| 4 | El remate de los 3 pasos de `#plan` — *"Remate: EB Garamond Medium Italic 24px"* | `font-style: italic` en `.plan-step_kicker`. Es clase, no prop: **1 escritura para los 3** |

**El remate se arregló en la clase y no por elemento a propósito**: los tres
pasos comparten `.plan-step_kicker` y ninguno tiene razón para diferir. Poner la
utilidad en cada uno habría dejado tres lugares donde olvidarse del cuarto.

### La section `#plan`, y las tres cosas que le faltan

Construida el **2026-09-21**. Clases nuevas, ya con la convención nueva
(`<bloque>_<elemento>`, underscore una sola vez):

`cc-plan` · `plan_head` · `plan_eyebrow` · `plan_rule` · `plan_title` ·
`plan_grid` · `plan_media` · `plan_steps` · `plan_line` · `plan-step` ·
`plan-step_num` · `plan-step_body` · `plan-step_title` · `plan-step_text` ·
`plan-step_kicker` · `plan_actions`

Colores por token, no por hex: el fondo y el círculo usan
`variable-7821b854…` (Forest Green) y el número `variable-6b5f6515…` (Olive
Green) — **los mismos que ya usaba `four_num`**, que es exactamente el mismo
patrón de círculo numerado sobre banda oscura.

**1. RESUELTO el 2026-09-21 — es un acordeón manejado por el scroll.**
Pablo eligió el acordeón real, scrubeado y con pin, sobre las otras tres
opciones (foco activo sin colapsar, acordeón de click, sólo fade). Lo
construye `src/components/plan.js`; el detalle está en
`.claude/rules/components/plan.md`.

Las dos objeciones que tenía escritas abajo quedaron cubiertas por cómo se
construyó: **el copy de los tres pasos sigue siempre en el DOM** (un paso
cerrado se clipea, no se saca, así que Google y un lector de pantalla leen los
tres), y **el colapso está scopeado a ≥992px con altura**, así que en teléfono
—de donde viene la mayoría del tráfico— los tres pasos están abiertos y no hay
nada detrás de una interacción. La objeción original, textual:

~~**Los tres pasos están expandidos; el Figma muestra 2 y 3 colapsados.**~~
Es la única decisión de diseño que tomé sin confirmar, y la tomé así porque el
Master Copy tiene body y remate para los tres: dejar dos tercios del contenido
detrás de una interacción **que el diseño no dibuja con ningún afordance** es
un problema de accesibilidad y de SEO, no sólo estético. Si se quiere el
acordeón, la vía es el `Accordion` de MAST con el círculo como hermano del
trigger y el icono `+/−` oculto — y ahí hay que resolver qué indica que se
puede abrir.

**2. Falta la imagen.** `plan_media` está con su fondo de placeholder. El
asset del Figma es a su vez un placeholder: el layer se llama *"Abstract
acoustic wave treatment graphic"* pero trae una foto de consulta, y pesa
9.2MB. Hace falta decidir qué foto va.

**3. No es componente todavía.** Es markup suelto en la Home, así que viola el
default de `webflow-build` §3 y no se puede editar desde Build Mode. Los
títulos son `h2`/`h3`/`p` crudos que heredan la tipografía de MAST por tag —
correcta visualmente, pero para Build Mode tendrían que ser instancias de
`Heading` y `Plain Text` con su prop `Size`. Las dos cosas se resuelven juntas
cuando se convierta a `Section / Plan`, y entra en el backlog de
`COMPONENTS-NAMING.md`.

---

## Ronda del 2026-09-22 — el Figma de la Home se actualizó otra vez

Cuatro cosas que marcó Pablo sobre el mismo frame `974:1594`. **Tres aplicadas,
una pendiente de decisión.**

### 1. La card de Colorado Shockwave — ✅ aplicada

Es el bloque de abajo de *"This is what thorough looks like"*, dentro de
`Section / What Makes This Different` (nodo Figma `974:1886`, 1360×271).

| Qué | Antes | Ahora |
| --- | --- | --- |
| Fondo | Slate Soft **relleno** | **transparente + borde 1px Slate Soft** (combo `cc-outline`) |
| Eyebrow | "Specialized care", sin marca | **marca de Colorado Shockwave 32px** + "Targeted shockwave" |
| Cuerpo | sólo párrafo | párrafo + **botón `Learn about Colorado Shockwave®`** → `coloradoshockwave.com` |

La grilla (`1fr 1.19fr`) y el padding (`3rem 5rem`) **ya coincidían exacto** con
el Figma (549 : 651 en un contenido de 1200, padding 48/80). No se tocaron.

**La marca NO se expuso como prop**, a propósito: es un logo de marca, no
contenido que el cliente vaya a cambiar. Es la misma regla que dejó los 6 iconos
de Areas of Care dentro de la definición — y de paso evita el paso de restaurar
un asset bindeado, que es donde el API tira 429. El botón **sí** es prop
(`Button Label` / `Button Link`), porque el destino puede cambiar.

Clases nuevas: `shockwave-band_brand`, `shockwave-band_mark`, y el combo
`.shockwave-band.cc-outline`.

**Por qué combo y no cambiar la base**: `shockwave-band` tiene un combo hermano
`.cc-light` que usan Fees y Wellness. Cambiar el fondo en la base les habría
puesto un borde que nadie pidió.

### 2. El slider de testimonials — ✅ aplicada

Section *"The questions people ask before they book."* (`974:1982`).

- **La paginación se borró.** Medido en `slider.min.js` de MAST antes de tocar
  nada: la config va detrás de un guard —`const p = d.querySelector('[data-slider="pagination"]'); p && (s.pagination = {...})`—
  así que sacar el elemento es seguro y Swiper simplemente no la inicializa.
- **Las flechas pasaron de píldora rellena a círculo con contorno**: 2.75rem,
  borde 1px Beige, fondo transparente, glifo Beige. `.slider-nav` pasó de
  `space-between` a `center` con `gap: 1.25rem`, que es lo que el diseño dibuja
  ahora que no hay bullets en el medio.

**El Figma las dibuja de 40px y se construyeron de 44px**, a propósito:
`RESPONSIVE.md` fija 44×44 como mínimo de tap target y no es negociable. La
diferencia es invisible; un target chico no lo es.

**Esto cierra de paso un ítem del backlog de responsive**: los *"bullets del
slider 16×16"* que figuraban como tap target por debajo del mínimo ya no
existen.

**Ojo**: `.slider-nav` es una clase base de MAST, no nuestra. El cambio alcanza
a cualquier otro slider del site — hoy sólo las páginas demo de MAST. Es el
mismo precedente que `ACCORDION-OPEN.md`, que reestiló las clases base del
accordion a sabiendas.

### 3. El acordeón de `#plan` — ✅ arreglado

La regla vertical cruzaba los numerales 2 y 3. No era geometría: el disco de
`.plan-step_num` está pintado del **mismo verde que la section** y su trabajo es
enmascarar la línea, y `PLAN.dim` lo atenuaba junto con el paso. Una máscara al
40% deja de enmascarar. El dim se movió a `[data-plan-body]`. Detalle completo
en `components/plan.md`.

### 4. La section "Specialized" — ✅ construida

`1075:616`, **1440×1055**, entre Testimonials y The Cost of Waiting. Reemplaza a
`974:2137`, que en el Figma quedó **oculto**.

**No existía en la Home construida** — esto no fue "una section que cambió",
fue una section que había que agregar. Pablo decidió el 2026-09-22:
**componente nuevo, sólo Home**; Care Hub y Sports Injuries se quedan con
`Section / Shockwave Bridge`, que tiene otro diseño.

**`Section / Colorado Shockwave`** — `16eed11b-dae6-d4c0-0a2c-5405242cf18f`,
12 props (Eyebrow, Title, Body 1–2, Condition 1–6, Button Label, Button Link).

| Capa | Spec |
| --- | --- |
| Card | Beige, **borde 1px `#7a999e`**, radio 1.5rem, padding 5rem, flex con 5rem de gap |
| Izquierda | 650px máx, columna con 2.5rem de gap |
| Lockup | marca 2rem + eyebrow `Colorado Shockwave®`, gap 0.5rem |
| H2 | 48px EB Garamond (variante H2 del `Heading`), Slate Ink |
| Cuerpo | dos párrafos de 16px, gap 1.25rem |
| Condiciones | grilla de 2 columnas, filete arriba y debajo de cada fila, `Paragraph SM` |
| CTA | `Button` Secondary + combo `cc-slate` → `coloradoshockwave.com` |
| Derecha | foto, `min-height` 39.375rem, radio 1rem, fondo Slate Ink detrás |

**Token nuevo: `Brand/Slate Line` (`#7a999e`)**, en la colección **Color**. El
Figma usa `#6f8c92` para el borde de la card y `#7a999e` para los filetes y el
botón; se unificaron en uno solo — la diferencia es imperceptible y tres
literales sueltos habrían violado *"no raw values where a token exists"*.

**Ojo**: lo creé primero en la colección **Typography** por error y lo borré.
Si aparece un `--_typography---brand--slate-line` en algún lado, es basura de
ese intento.

**Las dos imágenes NO son props**, igual que los iconos de Areas of Care: la
marca es un logo y el key visual es de la sub-marca, no contenido que el cliente
vaya a cambiar. Evita además el paso de restaurar un asset bindeado, que es
justo donde el API tira 429 (y tiró, verificando esta section).

**El key visual pesa 1.6MB y se usa así, por decisión de Pablo** (2026-09-22),
sabiendo el costo: la Home ya es larga y el checklist de handoff pide Lighthouse
mobile ≥90. Si el número no da, éste es el primer lugar donde mirar —
convertirlo a JPEG de ~2400px lo dejaría en 300-500KB.

**Pendientes de esta section**: no tiene `Anchor ID` (el `id` de un elemento es
un *setting*, no un atributo, y no llegué a cablearlo), el `®` sale a tamaño
completo en eyebrow y H2 —el problema general de `RESPONSIVE.md`— y **el
responsive está escrito, no medido**: card a una columna en `medium` con padding
2rem → 1.5rem en `small`, media a 25rem de alto, condiciones a una columna en
`small`.
