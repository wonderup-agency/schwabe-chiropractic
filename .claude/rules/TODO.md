# TODO — lo que falta, vivo

**Esta es la única lista de pendientes del proyecto.** Si algo no está acá, no
existe: se pierde entre respuestas de chat y a los tres días nadie se acuerda.

Última actualización: **2026-10-01** (feedback de Pablo sobre la Home) ·
Verificado contra `https://schwabe.webflow.io` · CSS publicado:
**`schwabe.webflow.shared.4262d11b9.css`** (⚠️ **tercer hash en tres tandas** —
`6e44d9a75` → `11c375068` → `4262d11b9`; alguien publica entre sesiones) ·
CDN del bundle: **`@970fb4b`** · último commit pusheado: **`d8553d2`**

> ✅ **El inventario de deltas sigue vivo contra `4262d11b9`.** Re-verificado
> el 2026-09-29 curleando el CSS y el HTML publicados: ninguno de los tres
> publishes tocó un solo delta medido. No hay que re-medir nada — lo que falta
> es aplicar. Detalle en [FIGMA-AUDIT.md](FIGMA-AUDIT.md).


## 👥 Our Team · Community Partners · Join Our Team — figma-parity 2026-10-01

Frames `1249:17851`, `1249:17937`, `1249:26448`. Pablo eligió los deltas por poll. Publicado y medido. `/responsive` en las 3 páginas (todas sus sections) + `.cc-cta` en Home, New Patients, Our Story y Fees: **OK en 12 perfiles**.

| ✓ | Qué falta | Qué no matchea | Prod | Doc |
| --- | --- | --- | --- | --- |
| [x] | **Team · fotos de las cards** · ✅ Kati → recorte nuevo `0141_schwabe_chiropractic_kati_team-card.webp` (encuadre del Figma), Frank → `0089`. Alts nuevos. De paso el botón *Read Dr. Schwabe's Full Story* iba a `/about/our-story` (404): ahora `/our-story` | Prod: fotos viejas, Frank con remera de otra clínica (ALIGN) | [/team](https://schwabe.webflow.io/team#team-members) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [ ] | **Team · credenciales de Frank** (copy, no tocado) | Prod dice *DC · CCSP®* para un Chiropractic Assistant; el Figma copia las de Kati. Confirmar con el cliente | ″ | — |
| [x] | **Team · comilla del CTA** · ✅ *We’re growing thoughtfully.* (tipográfica) | — | [/team#growing-team](https://schwabe.webflow.io/team#growing-team) | — |
| [ ] | **Team · párrafo del CTA a 16px** · ✅ en Webflow, ⏳ **requiere deploy**. Prop nuevo `Paragraph Class` en CTA Banner, Team lo setea a `cc-body`; el tamaño lo hace `src/styles/plain-text.css` (redefine `--_typography---paragraph-lg--font-size` en el wrapper). Medido con el CSS inyectado: 16px. Los otros CTAs siguen en 18 (Figma de Partners/Home: 18) | Figma Team 16px, prod 18px | [/team#growing-team](https://schwabe.webflow.io/team#growing-team) | ″ |
| [x] | **Banda de foto con margen** · ✅ variante nueva **Inset Top** de Photo Band (`bb9d5501…`): padding-top 2.5rem (1.5 en small), frame `aspect-ratio: 1360/812`. En Team, Partners y Join; las otras 3 instancias siguen en base. Medido: 40px + 1360×812 | Prod pegada al hero, 1360×907 | 3 páginas | ″ |
| [ ] | **Partners · cards del directorio** · ✅ práctica (*Serenity…*) a *quote* (EB Garamond Medium Italic 24). Categoría y link: combo `.plain-text-component.cc-meta` (Olive) en Webflow + 14px vía `plain-text.css` ⏳ **requiere deploy** (hoy 12px). Medido con CSS inyectado: 14px Olive | Figma 24 Garamond / 14 Olive uppercase | [/community-partners#partner-directory](https://schwabe.webflow.io/community-partners#partner-directory) | ″ |
| [x] | **Partners · encuadre foto CTA** · ✅ `Image Style` = `--img-pos: 0% 50%` (el Figma ancla la foto a la izquierda, logo entero) | Prod centrada, logo cortado | [/community-partners#final-cta](https://schwabe.webflow.io/community-partners#final-cta) | ″ |
| [x] | **Join · H1 en las líneas del Figma** · ✅ utility nueva `u-text-wrap` (el `text-wrap: pretty` heredado cortaba distinto). Medido: *For people who still believe / care should be done / properly.* | — | [/join-our-team](https://schwabe.webflow.io/join-our-team) | ″ |
| [x] | **Join · lede de Philosophy** · ✅ `u-max-width-29rem` (464, Figma 457) | Prod 544 | ″ | ″ |
| [x] | **Join · job cards** · ✅ intro a *paragraph-lg* (18px, Figma 18), borde del `+` cerrado a Brand Border `#d1d6c2` | Prod 16px, borde Olive | [/join-our-team#current-openings](https://schwabe.webflow.io/join-our-team#current-openings) | ″ |
| [x] | **CTA Split 50/50 + variante *Split Wide*** · ✅ Split vuelve a `1fr 1fr` (Figma de Team y Partners), padding derecho 3rem a ≥1280 para que los 2 botones entren. Variante nueva **Split Wide** (`0f26b495…`, 1.57fr/1fr) sólo en Our Story, donde el secundario es largo. Medido: Team 680/680 con los 2 botones en fila; Our Story 831/529 | Hoy había puesto 831/529 en las 9 | 9 páginas | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [x] | **Partners · cita y remate** · ✅ en *Section / Neighborhood Context*: *"You need to meet Dr. Schwabe"* a *quote-large* (EB Garamond 32) y el remate *"That is how…"* a *quote* (EB Garamond itálica 24). Antes DM Sans itálica | Patrón del catálogo: remate en la familia equivocada | [/community-partners](https://schwabe.webflow.io/community-partners#neighborhood-context) | ″ |
| [x] | **Partners · ancho 1200 en Rooted** · ✅ `.rooted_grid` max 75rem centrado; `.rooted_head` max 26rem → H2 en 3 líneas como el Figma | — | ″ | ″ |
| [x] | **Partners · links subrayados** · ✅ `.partner_link` borde inferior 2px Border Strong, pb .5rem, min-height 2.75rem (tap target 44) | Figma: borde 2px `#cacdb7` | [/community-partners#partner-directory](https://schwabe.webflow.io/community-partners#partner-directory) | ″ |
| [x] | **Join · ancho 1200** · ✅ `.philosophy_grid`, `.openings_list` y `.standing_grid` max 75rem centrados | Figma x120, 1200 | [/join-our-team](https://schwabe.webflow.io/join-our-team) | ″ |
| [x] | **Join · chevron del select** · ✅ combo `.inquiry_input.cc-select` (appearance none + chevron SVG Ink a la derecha) en *Role type* | — | [/join-our-team#standing-interest](https://schwabe.webflow.io/join-our-team#standing-interest) | ″ |
| [x] | **Hero · título angosto en Partners y Join** · ✅ utilities nuevas `u-max-width-30rem` / `u-max-width-40rem` vía el prop *Title Class* del Page Header. Medido: 480 y 640 de ancho, 2 y 3 líneas | Figma 480 y 631 | 2 páginas | ″ |

## 📖 Our Story · `#our-clinic` + figma-parity — 2026-10-01

Pedido de Pablo con el comentario del cliente sobre el slider (*"slider for mobile; full grid for desktop"*) y el copy nuevo `UPDATED_our-story-05-clinic-section-v0_1.md`. Publicado en `webflow.io` y medido. Detalle en [FIGMA-AUDIT.md](FIGMA-AUDIT.md), sección *"Our Story · #our-clinic y figma-parity, 2026-10-01"*.

| ✓ | Qué falta | Qué no matchea | Prod | Doc |
| --- | --- | --- | --- | --- |
| [x] | **Grid de 6 features de la clínica · estático** · ✅ 2026-10-01 (tarde), pedido de Pablo: **las 6 cards son estáticas** en el Designer, ya no salen del CMS. Section `section.cc-clinic` a nivel página entre *The Space* y *Find Us*, mismas clases (`clinic_list` > `clinic_items[role=list]` > `clinic_item[role=listitem]` > `clinic_card`). 3 col a ≥992, 2 en tablet, fila deslizable en ≤767. Para editar copy o fotos se toca el Designer | El Figma tenía slider también en desktop; el cliente pidió grid | [/our-story](https://schwabe.webflow.io/our-story#our-clinic) | [components/clinic-slider.md](components/clinic-slider.md) |
| [ ] | **Colección *Clinic Features* · borrar a mano** · los 6 items ya están borrados (pedido de Pablo). La colección en sí **no se puede borrar por MCP** (no hay acción): CMS → Clinic Features → Settings → Delete collection. El template está en draft | — | CMS | ″ |
| [ ] | **Swiper con flechas en mobile · falta deploy** · `src/components/clinic-slider.js` + `styles/clinic-slider.css` + registro en `components.js`. Sigue sirviendo igual con las cards estáticas (usa las clases, no el CMS). Hasta el deploy, mobile usa el fallback nativo con scroll-snap | Pablo eligió *Swiper MAST con flechas* | [/our-story](https://schwabe.webflow.io/our-story#our-clinic) | ″ |
| [ ] | **Platt Park · foto placeholder** · `partners-platt-park-street.png`. Cambiarla en el Designer cuando llegue la sesión 2 | El cliente lo pidió como placeholder | ″ | ″ |
| [ ] | **0066 · retocar el logo Titan Fitness** (pedido del cliente) · no lo hice: es retoque de foto, va por el fotógrafo o diseño | Se ve el logo en el cajón | ″ | ″ |
| [ ] | **0185 · latas de bebida** a revisar en el crop final (pedido del cliente) | Se ven en la heladera, chico | ″ | ″ |
| [x] | **0142 · crop arriba + corrección de color** · ✅ subido `0142_schwabe_chiropractic_circadian-sky-crop.webp` (6:5, panel Circadian + pared verde, sin el equipo; balance de blancos neutralizado) | — | ″ | ″ |
| [ ] | **Innerscene Circadian Sky · confirmar nombre y marca** antes del launch (flag del cliente) | — | ″ | ″ |
| [x] | **H2 *A space designed…* con `text-wrap: balance`** · ✅ `u-text-balance` en el prop Class del Heading. Section con `id="our-clinic"` y alt nuevo en la foto 0225 | — | ″ | ″ |
| [x] | **Hero · comilla tipográfica** · ✅ *don’t* y *hasn’t* en el Page Header de Our Story (props de la instancia) | Figma: ’ | [/our-story](https://schwabe.webflow.io/our-story) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [x] | **Story · card de la cita** · ✅ `.doctor_quote.cc-overlay` 420 de ancho, radio 16, bottom -4.5rem (-2rem en ≤767 para no pisar la Bio), y el Plain Text pasó a tamaño *quote-large*. Medido: **420×202, 32px** a 1440; 24.5px a 390, 18px de aire antes de la Bio | Figma 420×200, EB Garamond Italic 32 | [/our-story#our-story](https://schwabe.webflow.io/our-story#our-story) | ″ |
| [x] | **Bio · citas en Ink** · ✅ `.bio_quote` color Ink (sólo vive en *Doctor Bio*, 1 instancia) | Figma: Ink | [/our-story#dr-schwabe](https://schwabe.webflow.io/our-story#dr-schwabe) | ″ |
| [x] | **Four Things · botón** · ✅ props nuevos en *Section / Four Things*: `Button Class` (default `cc-icon-circle`) y `Button Icon Modifier` (default `cc-circle`), bindeados al Button interno. Our Story usa `cc-icon-circle cc-on-dark` + `cc-circle-olive`. Variante *Columns Check*: `hero_actions` margin-top 1rem → **80px** medidos | Figma: píldora Beige, texto olive, disco olive, 80px | [/our-story#schwabe-standard](https://schwabe.webflow.io/our-story#schwabe-standard) | ″ |
| [x] | **Find Us · mapa y fondo** · ✅ mapa 610×700 con borde 2px Border Strong en Home y Our Story (`.find-us_grid` `1.13fr 1fr`, max 79.3125rem, gap 4rem / 7.5rem a ≥1280; `.find-us_map` min-height 43.75rem). Variante nueva **Light** (fondo claro, padding 80) sólo en Our Story: la Home en Figma es beige oscuro con 148 y así quedó | Figma Our Story: claro, py 80. Figma Home: beige, py 148 | [/our-story#find-us](https://schwabe.webflow.io/our-story#find-us) | ″ |
| [x] | **CTA Split · botones en una fila** · ✅ variante *Split*: columnas `1.57fr 1fr` (831/529 del Figma), padding lateral 3rem / 5rem a ≥1280. En una fila a 1440 y 768; apilan a 1024 y 390. De paso: el **Secondary Button Link** default apuntaba a `/about/community-partners` (404), ahora `/community-partners` | Figma: lado a lado | [/our-story#community](https://schwabe.webflow.io/our-story#community) | ″ |
| [x] | **Formularios · estados success y error** · ✅ clases nuevas `form_message` (+ combo `cc-error`), `form_message-inner` y `form_message-icon` en los 3 formularios: *Free Guide* (Home y 1 más), *Inquiry Form* (Contact) y *Standing Interest* (Join). Borde fino, radio 12, fondo Beige, ícono Phosphor `check-circle` olive; el error en arcilla suave (`#f8eeea` / borde `#e6c8bd` / ícono `#a4553f`). No se tocó `display` (lo maneja Webflow) | Antes: gris y rosa por defecto de Webflow | [/contact](https://schwabe.webflow.io/contact) | — |
| [ ] | **Copy por defecto en 2 formularios** · *Free Guide* y *Standing Interest* siguen con *"Thank you! Your submission has been received!"* y *"Oops! Something went wrong…"*. No lo cambié (copy) | Contact ya tiene copy propio | / · /join-our-team | — |
| [x] | **Contact · inputs de 38px y fuente <16px** · ✅ los 3 inputs y el textarea de *Section / Inquiry Form* habían perdido sus clases (sólo `w-input`). Vuelven a `inquiry_input` / `inquiry_textarea`: **48px y 16px** como Join. De paso `.inquiry_grid` no tenía breakpoint y el form desbordaba de 177 a 433 en 320–430: ahora 1 columna en ≤991, gap 3rem. Probe Contact y Join: OK en 12 perfiles | — | [/contact](https://schwabe.webflow.io/contact) | [RESPONSIVE.md](RESPONSIVE.md) |

## 🏠 Home · feedback de Pablo del 2026-10-01

Publicado el 2026-10-01 con OK de Pablo (salieron también las ediciones de la Home de las 12:44). CSS publicado: `schwabe.webflow.shared.3e0e2e2e4.css`. `/responsive` sobre hero, fee bar, What Makes This Different, card de Shockwave y Find Us (Home + Our Story): 0 desbordes, 0 tap targets chicos. Detalle en [FIGMA-AUDIT.md](FIGMA-AUDIT.md), sección *"Home · feedback 2026-10-01"*.

| ✓ | Qué falta | Qué no matchea | Prod | Doc |
| --- | --- | --- | --- | --- |
| [x] | **Línea entre el hero y la fee bar** · ✅ 2026-10-01: `.section.cc-fee-bar` `margin-top: -1px`. Re-medido a DPR 1.5: sin fila clara — Costura de 1px: `.hero_band` (absoluta) termina en y=952.797 y la fee bar arranca ahí; a zoom fraccional el antialias deja ver el beige del hero. Medido: fila clara a 1.25 y 1.5, no a 1 ni 2 | [/](https://schwabe.webflow.io/) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [ ] | **Sound Familiar · la línea no se ve en el Designer** · Pablo eligió pasarla a elemento real. **Bloqueado por el deploy**: hay que sacar el `::before` de `symptom-card.css` en el mismo release, si no quedan dos líneas. Plan: `div.symptoms_rule` 24×2 Olive como primer hijo de las 10 cards + borrar el bloque `::before` | En el publicado la línea **está** (`[data-symptom-card]::before`, 24×2 olive, `symptom-card.css`). No se ve en el Designer porque vive en el bundle del CDN. Además el Figma tiene **título serif + bajada** y prod sólo un texto en itálica | [/](https://schwabe.webflow.io/#sound-familiar) | [HOME-FIGMA-SYNC.md](HOME-FIGMA-SYNC.md) |
| [x] | **Botones de Shockwave sin disco** · hecho en Designer: los 2 (banda de *What Makes This Different* y card grande) con `ph-arrow-up-right` + `.icon-color.cc-circle-teal` (nuevo, Shockwave Teal / Beige) + `cc-icon-circle cc-slate`. ✅ publicado y medido (disco `#719ca1`, borde teal) | Figma: disco teal con flecha. Prod: sin flecha, y el de la banda con borde beige en vez de teal | [/](https://schwabe.webflow.io/#what-makes-this-different) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [ ] | **Hover de los botones teal se vuelve olive** · código listo en `src/styles/button.css` (bloque `.cc-slate`/`.cc-teal`), **falta deploy** (commit + push + bump del hash del CDN). Bloqueado: el working tree tiene cambios sin commitear de otra tanda (`global.js` + `registered.*`, `toc.*`, `components.js`) que `npm run build` metería en el bundle; además la VM no puede borrar `.git/index.lock` ni tiene credenciales de GitHub | `button.css` les aplicaba el wash olive del Secondary: al hover perdían el teal | / y /care | `src/styles/button.css` |
| [x] | **Mapa → Google Maps** · hecho en Designer, dentro de *Section / Find Us* (Home y Our Story): link `find-us_overlay` con overlay Forest Green 40% y pill "Open Google Maps" al hover/focus; en ≤991 la pill queda siempre visible abajo (no hay hover en touch). Nueva pestaña. ✅ publicado, hover medido en 1440 y pill visible en 390/768 | Pedido nuevo de Pablo, no está en el Figma | [/](https://schwabe.webflow.io/#find-us) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [ ] | **Banda de Shockwave: borde teal** (detectado, no pedido) | Figma: borde 2px teal y título en 2 líneas más grande. Prod: borde beige suave, título en 1 línea | [/](https://schwabe.webflow.io/#what-makes-this-different) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |

### Home · mobile y patrones compartidos — 2026-10-01 (tarde)

Publicado y medido. Método registrado en la skill nueva **`/figma-parity`** (`.claude/skills/figma-parity/`), con sus scripts.

| ✓ | Qué falta | Qué no matchea | Prod | Doc |
| --- | --- | --- | --- | --- |
| [x] | **How it works en mobile: el número se comía 100px** · ✅ ≤767: `.plan-step_num` 3rem (fuente 2rem), gap 1rem, `.plan-step_body` pt .375rem, y la línea (`.plan_steps::before`, estado *Before* en el Designer) a `left: 1.4375rem`, top/bottom 1.5rem. Medido a 390: cuerpo de **250 → 286px**, línea centrada bajo el número | Número 80×80 + 20 de gap en un viewport de 350 | [/](https://schwabe.webflow.io/#plan) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [x] | **El remate de `#plan` salía en DM Sans** · ✅ `.plan-step_kicker`: EB Garamond (token `Fonts/Secondary Font`) 500 italic, 1.5rem / 1.25rem en ≤767, lh 1.2, -0.02em | Figma: EB Garamond Medium Italic 24px. Prod tenía sólo `font-style: italic` | [/](https://schwabe.webflow.io/#plan) | ″ |
| [x] | **Four Things Stacked: número apilado y línea cruzando el texto en mobile** (reporte de Pablo en New Patients) · ✅ variantes *Stacked* (`ad38b09b`) y *Stacked Light* (`69bbd089`) en ≤767: `3rem 1fr`, gap 1rem, regla a `left: 1.5rem`; *Stacked Light* además muestra la regla en ≤991. Mismo patrón que la Home | New Patients colapsaba a 1fr con la regla en `left: 2.5rem` atravesando el párrafo; Injury ocultaba la regla | [/new-patients](https://schwabe.webflow.io/new-patients#what-to-expect) · [Injury](https://schwabe.webflow.io/care/sports-activity-overuse-injuries) | ″ |
| [x] | **Footer desbordaba 9px a 1024** · ✅ `.footer_brand` base `minmax(0,1.5fr) minmax(0,1fr) 17.5rem` gap 3rem; los valores de Figma (`30rem 1fr 17.5rem`, gap 5rem) pasan a `large` (≥1280) | `.footer-social` iba de 753 a 1033 en un viewport de 1024 | todas | [RESPONSIVE.md](RESPONSIVE.md) |
| [x] | **La barra de anuncio ocupaba 3 líneas en mobile** · ✅ ≤767: texto 14px, padding vertical 8px, y frase + link en una sola línea de texto que envuelve (`.announcement_inner` a `block`, clase nueva **`announcement_text`** `inline`, link `inline-flex`). Medido: **94 → 59px** a 320/360/390/430, 2 líneas; 768 sin cambio (53) | 94px a 390 = 11% del viewport | todas | [components/announcement.md](components/announcement.md) |
| [x] | **H2 y H3 más chicos en mobile** · ✅ sólo en el modo **Mobile** de la colección Typography: `H2/Font Size Min` 2.25 → **2rem**, `H3/Font Size Min` 2 → **1.75rem**. Medido: H2 36.75 → **33px** a 390 (H1 sigue en 41), tablet y desktop sin cambio (40.8 a 768) | H2 de 36.75 contra un H1 de 41: casi no había jerarquía | todas | [RESPONSIVE.md](RESPONSIVE.md) |
| [ ] | **Tap targets chicos que siguen en la Home** — preexistentes | `announcement_link` 130×25, `footer-link` ~18px de alto, el CTA del nav 146×36, logo del nav 80×29 | todas | [RESPONSIVE.md](RESPONSIVE.md) |
| [ ] | **Revisar las otras 17 páginas con `/figma-parity`** | Pablo encontró los mismos errores (líneas, flechas) en varias páginas. Orden sugerido: New Patients, Care Hub, Injury, Wellness, Fees | todas | `.claude/skills/figma-parity/SKILL.md` |

## 🛠️ Tanda de paridad del 2026-09-29 (sesión Cowork con Figma + Webflow MCP)

Publicado y medido a 1440 + `/responsive` (6 perfiles × light/dark) sobre lo tocado. Detalle en [FIGMA-AUDIT.md](FIGMA-AUDIT.md), sección *"Tanda de paridad 2026-09-29"*.

| ✓ | Qué falta | Qué no matchea | Prod | Doc |
| --- | --- | --- | --- | --- |
| [x] | **🔴 Join Our Team no colapsa en mobile** · ✅ **arreglado y medido el 2026-09-29**: `philosophy_grid`/`standing_grid`/`job-card_cols` a 1fr en Tablet, `inquiry_row` a 1fr en Mobile landscape, filete de la vacante arriba al apilar, solape de la foto −4rem/−3rem. 0 desbordes en 320/390/768/844 — — preexistente, no lo introdujo la tanda | `.philosophy_grid` (544fr/576fr), `.standing_grid` (520fr/600fr), `.inquiry_row` (1fr/1fr) y `.job-card_cols` **no tienen ni una regla por breakpoint**: a 390 la columna de copy de Philosophy mide ~107px y la section ~2900px de alto; el form y las columnas de la vacante se salen del viewport (recortados, sin scroll). Arreglo: `1fr` en Tablet (≤991) para las 4 | [/join-our-team](https://schwabe.webflow.io/join-our-team) | [RESPONSIVE.md](RESPONSIVE.md) |
| [x] | **Tanda 5 · encuadre del CTA de Community Partners** · ✅ **2026-09-29**: la variante *center-right* del `Image Fit` ahora es `object-position: var(--img-pos, 100% 50%)`; el CTA Banner expone el prop nuevo **`Image Style`** (`cb9f7fef-…`, bindeado al `Style` del `Image`); Community Partners = `--img-pos: 50% 50%`. Medido: las otras 8 siguen en `100% 50%` — | Ver fila de arriba (#157): `Image Fit` vive en la definición. Opciones: (a) exponer un prop de encuadre en el CTA Banner, (b) cambiar el default a *center* y revisar las 8 | [/community-partners](https://schwabe.webflow.io/community-partners) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [x] | **Care Hub · la foto del CTA** · ✅ **2026-09-29**: 0245, decidido por Pablo aunque repita entre CTAs — | Orden ✅ (copy izq, foto der), H1 60px ✅, padding 120 ✅. La foto sigue siendo `doctor-kati-schwabe-consult.jpg` (la del retrato de la Home, recorte ~46%). El Figma pide la **0245**, que ya usan Home y Community Partners | [/care](https://schwabe.webflow.io/care#final-cta) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [ ] | **Contact desborda a 390** — preexistente | `.clinic-details_hours` y la tabla de horarios van de 256 a 394 en un viewport de 390 | [/contact](https://schwabe.webflow.io/contact) | [RESPONSIVE.md](RESPONSIVE.md) |
| [ ] | **Care Hub · `#csw-bridge` botón** | Figma: píldora Beige con borde 2px `#79979d` y **disco** `#79979d` con flecha. Prod: `secondary cc-teal` sin disco | [/care](https://schwabe.webflow.io/care#csw-bridge) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [x] | **Our Team · "Join Our Team" linkea a `/contact`** · ✅ **2026-09-29**: ahora `/join-our-team` — | Heredado del Feature Card viejo; existe `/join-our-team`. No lo cambié porque es contenido | [/team](https://schwabe.webflow.io/team#growing-team) | — |
| [ ] | **Our Team · el borde del botón secundario** | Figma `#d1d6c2` (`brand--border`), prod Beige | [/team](https://schwabe.webflow.io/team#growing-team) | — |
| [ ] | **Diferencias que eran el gutter** · el gutter ya está en 40px (2026-09-29): **re-medir** estas tres | Our Team CTA 611 de alto contra 560 y botones en 2 filas; H2 de Standing en 3 líneas contra 4; H1 del Care CTA en 3 contra 2. Todas por la columna ~93px más angosta | varias | fila *"El gutter del container"* |
| [ ] | **Four Things · gap título→cuerpo 16 vs 17** | `.doctor_heading` es compartida por 6 páginas; 1px, no se toca | [/our-story](https://schwabe.webflow.io/our-story#schwabe-standard) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |

## El contrato

1. **Al arrancar una tarea**, este archivo se lee primero.
2. **Toda vez que una respuesta diga "falta", "pendiente", "no verificado", "hay
   que", "queda abierto" o "sin decidir"** — el item entra acá **en esa misma
   respuesta**, no en la siguiente.
3. **Toda vez que se termina algo**, se marca `[x]` en la columna ✓, se mueve a
   *Cerrado* con la fecha, y se actualiza la doc que lo detalla.
4. *Cerrado* se poda cuando pasa de ~15 items. Para el historial está git.

### Las cuatro columnas

| Columna | Qué va |
| --- | --- |
| **✓** | `[ ]` abierto · `[x]` corregido y verificado. Se tacha a mano |
| **Qué no matchea** | El delta concreto: qué se esperaba y qué hay. No "arreglar el hero" sino "666px contra los 726 del Figma" |
| **Prod** | La URL donde se ve. `—` si no es visible en el sitio (Designer, CMS, repo) |
| **Doc** | Dónde está el razonamiento. El TODO es índice, no el lugar donde se piensa |

> Los `[ ]` dentro de una tabla no son checkbox clickeable en GitHub — se editan
> a mano a `[x]`. Es a propósito: con cuatro campos por item, una lista de tareas
> clickeable sería ilegible.

---

## 📘 Master Copy v0.36 — el sitio quedó en v0.35

Pasado el **2026-09-27**. **El Figma está alineado con v0.36; producción no.**
Eso resuelve a favor del Figma tres deltas que yo no podía dirimir.
Razonamiento en [FIGMA-AUDIT.md](FIGMA-AUDIT.md).

| ✓ | Qué falta | Qué no matchea | Prod | Doc |
| --- | --- | --- | --- | --- |
| [x] | ~~**Las 4 URLs no son las del spec**~~ · movidas el 2026-09-27 | Las tres de `about` salieron de la carpeta y el Care Hub pasó de `care-hub` a **`care`**. Verificado publicado: `/our-story` `/team` `/community-partners` `/care` devuelven **200**, y `/care` convive con la carpeta `care` sin romper `/care/sports-activity-overuse-injuries`. ⚠️ **Faltan los 301** de los slugs viejos — ver abajo | 4 páginas | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [ ] | **🔴 Home-03 son 7 cards, no 5, y sólo 2 matchean** | v0.36 reestructuró la section a **Lead + Trigger**. Cards 2 y 3 ✅; **1, 4 y 5 tienen otro copy**; **6 y 7 no existen**. ⚠️ La card 6 lleva un FLAG: su lead no tiene sustantivo **a propósito** — *"Do not 'correct' this to add a body part"* | [Home](https://schwabe.webflow.io/) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [x] | ~~**Home-06: los 5 cambios de v0.36**~~ → **eran 11** · aplicados el 2026-09-27 | ⚠️ **Mi auditoría decía "94 de 95 textos de la Home matchean exacto" y en esta section era falso**: v0.36 no cambió 5 cosas, **reescribió los 6 cuerpos de card enteros**, más los 2 títulos, el arch `100% / of visits` y el label `1 / Patient per room`. Leído del render del Figma, no del diff de texto. Verificado publicado: los 11 presentes, **0 restos** de `at Every Appointment`, `Every Session`, `Soft tissue work` y `Private room`. ⚠️ El `100%` sigue **pendiente del sign-off clínico de Kati** | [Home](https://schwabe.webflow.io/) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [ ] | **🔴 Privacy y Terms se van a indexar** — **el API no lo puede hacer** | El spec pide `[ROBOTS: noindex, follow]` y ninguna de las 19 páginas lo emite. `data_pages_tool` expone `seo.title`/`seo.description` y Open Graph, **no `robots`**: hay que pegar `<meta name="robots" content="noindex, follow">` a mano en Page Settings → Custom Code → Inside head tag de las dos | [/privacy-policy](https://schwabe.webflow.io/privacy-policy) · [/terms-of-use](https://schwabe.webflow.io/terms-of-use) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [x] | ~~**Falta `og:description` en 17 de 19 páginas**~~ · aplicado el 2026-09-27 | `descriptionCopied` y `titleCopied` a `true` en las **17** páginas reales, en una sola escritura. Verificado en el HTML publicado de la Home: `<meta content="…" property="og:description"/>` presente | todas | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [ ] | **El template de Blog Post no tiene meta description** | Las otras 18 la tienen y matchean el spec exacto. Los `<title>` matchean **17 de 17** | los 3 artículos | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [ ] | **24 anclas del spec no existen** | La Home es el caso extremo: **2 de 12**. Fees no tiene `medicare` (esa section no está construida). **Las 3 anclas que son destino de un link interno funcionan las tres**, así que el impacto hoy es bajo — pero cualquier link nuevo del copy rompe | todas | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [ ] | **El 404 tiene tres versiones distintas** | Master Copy: *"Page not found."* + **5 CTAs**. Figma: `404` + *"wandered off the trail"* + **BACK TO HOME**. Prod: como el Figma pero **Contact Clinic**. Necesita decisión | la vista 404 | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |

---

## 💬 Comentarios de "Final review" — la instrucción más nueva

Pasados el **2026-09-27**. **Derek = cliente** (sus comentarios son pedidos),
**Olha = diseñadora** (los suyos son propuestas: sólo valen si Derek respondió).
Manda sobre el Figma. Razonamiento en [FIGMA-AUDIT.md](FIGMA-AUDIT.md).

| ✓ | Qué falta | Qué no matchea | Prod | Doc |
| --- | --- | --- | --- | --- |
| [ ] | **#101 · El eyebrow de Shockwave va con el logo horizontal real** | Ni el lockup del Figma ni el *"ALSO AVAILABLE HERE"* de prod: Derek pide **el logo horizontal de Colorado Shockwave®** (`.ai` en Drive) a **40–50px**, para que se lean "COLORADO" y el ® | [Home](https://schwabe.webflow.io/) · [/care-hub](https://schwabe.webflow.io/care-hub) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [ ] | **#103 · Fees: sacar la imagen — el Figma dibuja lo contrario** | Derek: **no hace falta imagen**, heading **centrado** y checklist **a la izquierda** en columna angosta centrada. El frame `1249:14888` **sí tiene** una imagen de 560×480: construir contra el Figma agregaría justo lo que el cliente pide sacar | [/fees-and-policies](https://schwabe.webflow.io/fees-and-policies) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [ ] | **#109 · New Patients: la card tapa la foto** | Derek: *"The text placement on top of most of the photo doesn't work."* ⚠️ **Yo había dado esta section por ✅** — prod y Figma tienen la misma composición. El cliente quiere que **las dos** cambien | [/new-patients](https://schwabe.webflow.io/new-patients) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [ ] | **#110 · Patient Stories: el hero tapa al paciente** | Mover la card y/o cambiar el crop. Derek subió `0018_schwabe_chiropractic_chiro_treatment.jpg`. Con esto son **3 candidatas**: la de prod, la del Figma y ésta | [/patient-stories](https://schwabe.webflow.io/patient-stories) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [ ] | **#108 · El logo del footer va en versión "reversed"** | Está en Google Drive. Hoy prod sirve `logo-dark.svg` en las 30 páginas | todas | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [ ] | **#99 · La imagen del CTA, y heros exclusivos** | Usar la **245** (saludo en recepción) en el CTA; la **249** queda reservada al hero de Join Our Team. **Derek pide que los heros sean exclusivos** — es el criterio que resuelve las 5 fotos reutilizadas. ⚠️ El comentario es sobre **`Final CTA 2`** y el frame de la Home embebe **`Final CTA 1`**: confirmar cuál va | todas | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) · **2026-09-29**: el Figma del CTA de **Care Hub** es la **0245** exacta (hash perceptual 0), que ya está en los CTA de Home y Community Partners → decisión de Pablo |
| [ ] | **#107 · Our Story: `#cc-space` va como slider de fotos** | Renderizado: el Figma pone un **slider de imágenes de la clínica**, una foto por punto (*Four treatment rooms*, etc.). Prod los rinde como **lista de texto estática**. Olha preguntó *"will this slider work?"* y nadie contestó | [/about/our-story](https://schwabe.webflow.io/about/our-story) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [ ] | **⏳ #106 · Wellness `#fit` — BLOQUEADO, no pendiente** | Derek reconoce que se le pasó la página y **va a mandar las imágenes**. No se pone la del Figma: se espera | [/wellness-membership](https://schwabe.webflow.io/wellness-membership) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [ ] | **📦 6 assets a buscar en Google Drive** | Logo *reversed* · logo horizontal de Colorado Shockwave `.ai` · imagen **245** · imagen **249** · `0018_schwabe_chiropractic_chiro_treatment.jpg` · las de Wellness (las manda Derek) | — | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |

---

## 🎯 Paridad Figma ↔ prod — tanda del 2026-09-29

Medido el **2026-09-29** con Chrome headless por CDP a 1440 contra el CSS
publicado `6e44d9a75`, y contra el canvas **`1237:9927` "Final review"**.
Razonamiento y números en [FIGMA-AUDIT.md](FIGMA-AUDIT.md).

### `/join-our-team` — 10 deltas

✅ **Reconfirmados DOS veces**: contra `11c375068` por CDP, y contra
**`4262d11b9`** el 2026-09-29 curleando el CSS y el HTML servidos. **Los 10
siguen vivos** — ningún publish los tocó. Lo medido por CDP contra `11c375068`: Philosophy en Beige `rgb(251,250,248)`; Openings y Standing las
dos en Beige Muted `rgb(238,236,228)`; el `<select>` con **`w-select` pelada,
38px, `#f3f3f3`, radio 0, 14px** contra el input de referencia
(`inquiry_input`, 48px, Beige, 999px, 16px); los **5 labels con `for=""`**;
`resize: both`; el H2 de Standing en **48px / 544px / 2 líneas**; la banda de
foto **a tope** (`bottom 1217 == top 1217` de `cc-philosophy`, cero solape); la
card de vacante con **`1px #cacdb7` y radio 16px**; y el primer `<details>`
todavía en `open: false`.

⚠️ **Una corrección**: el lede de Philosophy mide **16px**, no los 18 que decía
la fila de abajo. Sigue en redonda (`font-style: normal`), así que el delta de
itálica se mantiene — lo que cambia es el tamaño de partida.

⚠️ Y `.media-band_frame` sigue en **`aspect-ratio: 1360 / 812`**: el cambio a
`3/2` que Pablo decidió **no está aplicado**.


| ✓ | Qué falta | Qué no matchea | Prod | Doc |
| --- | --- | --- | --- | --- |
| [x] | **🔴 La banda de Practice Philosophy está invertida** | El Figma la pinta **Brand/Ink `#474d33` con texto Beige**; prod la sirve **Beige con texto Ink**. Medido: `.section.cc-philosophy` → `background-color: var(--_color---brand--beige)`. Es el delta de color más grande de la página · ✅ **publicado y medido el 2026-09-29** | [/join-our-team](https://schwabe.webflow.io/join-our-team) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [x] | **🔴 Current Openings y Standing Interest tienen el fondo cambiado** | Figma: Openings **Beige `#fbfaf8`**, Standing **Beige Muted `#eeece4`**. Prod: **las dos en Beige Muted** — `.section.cc-openings` y `.cc-standing` comparten valor. Con el fondo mal, la card de vacante (que es Beige) queda como una caja clara sobre gris en vez de una card con filete sobre su mismo fondo | ″ | ″ |
| [x] | **🔴 El `<select>` del form no tiene la clase `inquiry_input`** | Sale con el `.w-select` crudo de Webflow: **38px de alto, `#f3f3f3` gris, esquinas rectas, borde `#ccc`, `font-size: 14px`** — al lado de un input de **48px, pill, Beige, borde Border Strong, 16px**. Es la causa entera de *"los estilos del form están rarísimos"*. ⚠️ Los 14px además rompen la regla de `RESPONSIVE.md`: abajo de 16px iOS zoomea al enfocar | ″ · ✅ **publicado y medido el 2026-09-29** | [RESPONSIVE.md](RESPONSIVE.md) |
| [x] | **🔴 Los 5 `<label>` del form tienen `for=""` vacío** | `si-name` · `si-email` · `si-phone` · `si-role` · `si-intro` tienen id, pero ningún label lo apunta. Son labels `u-sr-only`, o sea que hoy **no anuncian nada** — peor que no tenerlos. Es a11y, no estética | ″ | ″ |
| [x] | **El textarea muestra el handle de resize** | `resize: both` (el default del navegador). El Figma no lo dibuja, y arrastrarlo rompe la grilla del form | ″ · ✅ **publicado y medido el 2026-09-29** | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [x] | **El lede de Practice Philosophy sale en cuerpo, no en cita** | *"This is not a high-volume practice…"* — Figma: **EB Garamond Medium Italic 32px** (token H4). Prod: **DM Sans Regular 18px redonda**. Es el mismo bug de `u-italic` que ya se barrió en las citas | ″ · ✅ **publicado y medido el 2026-09-29** | [RESPONSIVE.md](RESPONSIVE.md) |
| [x] | **El H2 de Standing Interest es 48px y el Figma lo pone en 60** | El frame usa el token **`Desktop/Heading 1` = 60px** (medido: caja de 520×240 = 4 líneas a lh 1). Prod rinde 48px en una columna de 569, así que rompe en 2 líneas donde el Figma rompe en 4 | ″ | ″ |
| [x] | **La foto no pisa la banda de abajo** | El Figma monta la foto **100px sobre** la banda de Philosophy. Prod las deja a tope. Es el mismo patrón que Community Partners ya tiene (`.cc-rooted` con `margin-top: -6.25rem`) | ″ | ″ |
| [x] | **El filete de la card de vacante es el token equivocado** | Figma `#d1d6c2` = **`brand--border`**; prod usa **`border-strong` `#cacdb7`**. Y el radio: prod **1rem**, Figma ~**1.5rem** (el token `card--border-radius-large` que ya existe) | ″ | ″ |
| [x] | ~~⏳ Decisión: ¿la primera vacante arranca abierta?~~ → **decidido el 2026-09-29: abierta** | El Figma dibuja la card 1 **abierta** (disco oliva relleno con un `−`) y la 2 cerrada, y Pablo eligió matchearlo literal. Falta escribir el `open` en el primer `<details>` | ″ | ″ |
| [x] | ~~⏳ Decisión: la nota del form~~ → **decidido el 2026-09-29: se oculta** | *"We read every introduction…"* se saca, como manda el Figma, y el botón queda solo en su fila alineado a la derecha. **El copy no se borra**, se oculta: volver atrás es una escritura | ″ | ″ |

### `/care` — Care Hub · **prod medido el 2026-09-29**

Contra el frame **`1249:12003`**. ⚠️ **Sólo está medido el lado de PROD** — los
conectores de Figma y Webflow volvieron a no estar disponibles, así que el frame
sigue sin leerse y **no se aplicó ninguna escritura**. Cada fila tiene ahora su
columna "prod dice" cerrada en números; falta contrastarla contra el frame.
Números y scoping en [FIGMA-AUDIT.md](FIGMA-AUDIT.md).

| ✓ | Qué falta | Qué no matchea | Prod | Doc |
| --- | --- | --- | --- | --- |
| [x] | **🔴 `#approach` — falta la foto y la cita va a la izquierda** · **prod medido** | Medido: `.approach_grid` es **569 / 603** con la izquierda llevando **sólo eyebrow + H2** y la derecha los 3 párrafos + `.approach_quote` (card Beige, radio 16px). **0 imágenes y 0 SVG** en la section. Figma: copy + cita a la izquierda, foto en arco a la derecha — o sea que **las dos columnas cambian de contenido**. ⚠️ `.approach_grid` la comparten **Fees y Wellness**: va por combo, no tocando la base · ✅ **publicado y medido el 2026-09-29** | [/care](https://schwabe.webflow.io/care) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [x] | **🔴 `#first-visit` — el verde, los ticks y el botón** · **los 3 confirmados** | (1) La banda es **`#262f23` Forest Green** medido; "oliva media" son **`#474d33` Ink** o **`#6b744e` Olive** y **cuál de los dos lo decide el frame**. (2) **No hay ningún marcador**: el primer hijo de las 3 `.process_col` es el heading, con **0 `<svg>` y 0 iconos Phosphor**. (3) El botón es **Olive relleno con texto Beige**, sin `cc-on-dark`. ✅ Los filetes **sí están** (144×1, `scaleX(1)`) — mi primera lectura dio 0 porque los medí fuera de viewport, el falso positivo de siempre. 🔴 **El botón necesita DOS props**: `cc-on-dark` **y** `cc-circle-olive`, porque su disco es Beige y sobre píldora Beige queda invisible — es el bug del CTA ya cerrado el 2026-09-28 | ″ · ✅ **publicado y medido el 2026-09-29** | [animations/BUTTON-HOVER.md](animations/BUTTON-HOVER.md) |
| [x] | ~~**Areas of Care — el hover invertido no se ve**~~ · **✅ FUNCIONA, medido el 2026-09-29** | Verificado con un **mouse real por CDP** (un `.dispatchEvent` sintético no dispara `:hover`): las **6 cards** tienen `data-area-card`, `matchMedia('(hover:hover) and (pointer:fine)')` da `true`, y al hover la card pasa de **Beige/Ink/Border Strong** a **Ink `rgb(71,77,51)` / Beige / Ink**, con el `Button` interno a Beige. **Sólo se invierte la card apuntada** — cero sangrado. Las reglas están servidas en `@970fb4b`. ⚠️ Queda **una** cosa: el hover pinta **Ink `#474d33`** y el reporte dice *"forest oscuro"* `#262f23` — lo decide el frame, y es una variable en `area-card.css` | ″ | [animations/AREA-CARD-HOVER.md](animations/AREA-CARD-HOVER.md) |
| [ ] | **🔴 `#csw-bridge` — orden, relleno, logo y botón** · **prod medido** | (1) **Orden invertido confirmado**: `.shockwave_body` a la izquierda (x=167), `.shockwave_media` a la derecha (x=753), grilla `505/505`. (2) Eyebrow **"Also available here"** con **0 imágenes de marca**. (3) ⚠️ **Más chico de lo anotado**: el filete **ya está** (1px `#719ca1`) — el delta es sólo el **relleno**, hoy Beige Muted `#eeece4`. (4) Botón secondary `cc-teal` transparente **sin disco**. ⚠️ `.shockwave_band` pelada la comparte **Injury**: va por combo. ⚠️ El borde `#719ca1` y el botón `#3e5558` **no son tokens** | ″ | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) · **2026-09-29**: ✅ orden, relleno Beige, borde 2px `slate-line` y texto `slate-ink` aplicados en la variante nueva **`Media Left`** (`47fc56d7-…`) de `Shockwave Bridge` — Injury no se toca. **Siguen abiertos**: el eyebrow con logo (asset en Drive) y el botón con disco |
| [ ] | **🔴 El CTA — la premisa del TODO era falsa** · **corregido el 2026-09-29** | Este TODO decía que la variante `Split` estaba aplicada *"en las 9 instancias"* y que el delta era de esta instancia. **El CTA de Care Hub no es `Section / CTA Banner`**: es `.cc-care-cta` con `.care-cta_grid`, o sea **`Section / Care CTA`** (`d2c66413-…`), otro componente que **nunca pudo recibir `Split`**. Medido: grilla **586/586** gap 80, **foto a la IZQUIERDA** (x=86) y copy a la derecha. Y dos cosas que no estaban anotadas: la foto es **`doctor-kati-schwabe-consult.jpg`, la misma del retrato de la Home** (el problema de fotos reusadas de Derek #99), y **se recorta el ~46% del alto** — es una foto vertical 2:3 en una caja horizontal. `.care-cta_grid` es **sólo de esta página**: se puede tocar la base | ″ | ″ |

⚠️ **El lado de Figma sigue sin medirse.** Falta: qué verde exacto pide
`#first-visit`, si el hover va en Ink o en Forest, la composición de `#approach`,
y qué orden y qué foto pide el CTA.

🔴 **Y no es que los MCP "se caigan": están SIN AUTORIZAR.** Medido el
2026-09-29 — Figma y Webflow no aparecen ni en la lista de herramientas, están
en el grupo *"requieren autenticación"*, y en una sesión no interactiva el flujo
de OAuth no corre. **No se arregla reintentando**: hay que reautorizar los dos
conectores en claude.ai → Connectors, o correr la tanda desde Claude Desktop.
El prompt autocontenido para esa sesión está en
[HANDOFF-MCP.md](HANDOFF-MCP.md).

### Our Team y Community Partners — la imagen

| ✓ | Qué falta | Qué no matchea | Prod | Doc |
| --- | --- | --- | --- | --- |
| [x] | **🔴 El `Photo Band` recorta la foto en las 3 páginas que lo usan** · **decidido el 2026-09-29: se baja el `aspect-ratio` del marco a `3/2`** — una escritura para las 3 instancias, sin assets nuevos. Community Partners igual va a perder ~12% hasta que su foto se reemplace por una 3:2 | `.media-band_frame` es `aspect-ratio: 1360/812` (**1.675**) y las fotos son más altas: Join Our Team y Our Team **3:2 (1.500) → se come el 10% del alto**; Community Partners **4:3 (1.333) → el 20%**. Con `object-fit: cover` y `object-position: 50% 50%` eso sale de arriba y de abajo por igual. Medido contra el render: al Figma de Partners se le ve **la copa del árbol y la vereda** que prod corta, y al de Our Team **el aire sobre las cabezas** · ✅ **publicado y medido el 2026-09-29** | [/team](https://schwabe.webflow.io/team) · [/community-partners](https://schwabe.webflow.io/community-partners) · [/join-our-team](https://schwabe.webflow.io/join-our-team) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [x] | **🔴 Our Team · la foto de `#growing-team` va a sangre, no inset** | Figma: card de **dos mitades exactas sin hueco**, con la foto pegada al borde superior, derecho e inferior y recortada por el radio del card. Prod: `feature_card` con `padding: 60px`, `grid: 526px 526px`, `column-gap: 80px` y la foto **inset con su propio radio de 24px**. Es exactamente la composición que ya se construyó como variante **`Split`** del CTA Banner el 2026-09-28 — `Section / Feature Card` nunca la recibió · ✅ **publicado y medido el 2026-09-29** | [/team](https://schwabe.webflow.io/team) | ″ |
| [ ] | **🔴 Our Team · la foto de `#growing-team` es otra** | Figma: **la puerta al espacio nuevo** — pared de listones de madera, planta, heladera de vidrio y estantería. Prod: `team-growing-reception.png`, las tres mujeres en recepción. Es el único slot de la página que sigue con un asset viejo (el resto ya pasó a las fotos numeradas) | ″ | ″ · **2026-09-29**: la card ya es un `CTA Banner` Split; sólo falta el asset |
| [ ] | **Community Partners · el CTA corta a la paciente** | La foto es la correcta (**`0245`**, la que pidió Derek en #99) pero el encuadre no: `object-position: **100% 50%**` la ancla a la derecha y **deja a la mujer de camisa celeste cortada contra el borde izquierdo**. El Figma muestra a las dos de cuerpo entero, centradas en la mitad derecha | [/community-partners](https://schwabe.webflow.io/community-partners) | ″ · **2026-09-29**: ⛔ **no es un arreglo de instancia**: `Image Fit` = *cover center-right* está fijo en la **definición** del CTA Banner y lo usan **8 páginas**. Cambiarlo reencuadra las 7 restantes → decisión de Pablo |

### Lo que se verificó y **sí** matchea

Anotado para no volver a auditarlo: el H1 del hero de Join Our Team (60px, 3
líneas, y las dos columnas **alineadas abajo**, como el Figma), la estructura
completa de las dos vacantes (títulos, resúmenes, las 8 viñetas y el bloque
*To apply*), la banda *To apply* en Beige Muted, el estado abierto del disco
(`job-card.css` ya lo pinta oliva con `−`), el pill de los inputs, el CTA de
Community Partners con `0245` y la variante `Split`, y la foto `0249` del
Photo Band de Join Our Team.

---

## 🔴 Links rotos en producción

Encontrados curleando el sitio el 2026-09-22. **Ninguno estaba anotado como
tal.** Son 404 alcanzables desde el nav de todas las páginas.

| ✓ | Qué falta | Qué no matchea | Prod | Doc |
| --- | --- | --- | --- | --- |
| [x] | ~~**El Care Hub es inalcanzable desde el nav**~~ · resuelto el 2026-09-27 | La página se mudó a **`/care`**, que es lo que el nav ya linkeaba. Los links del nav **eran correctos**: son links de *página*, no URLs literales, así que siguieron a la página solos | [/care](https://schwabe.webflow.io/care) ✅ | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [ ] | **5 links del dropdown de Care dan 404** | El nav lista `back-neck-pain`, `headaches-tmj`, `plantar-fasciitis`, `prenatal-postpartum` y `wellness` bajo `/care/`. **Ninguna de las 5 páginas existe.** La única construida es `sports-activity-overuse-injuries` | [/care/back-neck-pain](https://schwabe.webflow.io/care/back-neck-pain) ❌ | — |
| [x] | ~~**Un link a `/team` en la Home da 404**~~ · resuelto el 2026-09-27 | Era el `u-link-cover` de *"Dr. Schwabe's full story"*. Lo arregló la mudanza de slug: ahora `/team` existe | [Home](https://schwabe.webflow.io/) | — |
| [ ] | **🔴 Faltan los 301 de los 4 slugs viejos — el MCP no los puede escribir** | `/about/our-story`, `/about/team`, `/about/community-partners` y `/care-hub` devuelven **404** desde el 2026-09-27. Estaban publicados, así que hay links externos y resultados de Google apuntando ahí. `data_sites_tool` no tiene acción de redirects: van a mano en **Site Settings → Publishing → 301 Redirects** | 4 URLs | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [ ] | **Los 9 links del footer guardaban el destino dos veces** | Cada `footer-link` tenía `settings.link` **y** un atributo `href` literal con la misma URL. Los 9 rotos se pasaron a **link de página**, que sigue a la página si se mueve; los otros 12 siguen siendo URL literal y se van a romper igual el día que algo se mude | todas | [FOOTER.md](FOOTER.md) |
| [ ] | **La página `/test` está publicada** | Creada el 2026-09-23, responde 200 y no está en el nav. O se borra o se pasa a draft antes del lanzamiento | [/test](https://schwabe.webflow.io/test) | — |

---

## 🎨 Figma — cuatro rondas de *"Feedback applied"* sin revisar

> ⚠️ **Revisar contra `1237:9927` "Final review", no contra estos ids.** El
> 2026-09-27 apareció un canvas más nuevo que los cuatro de abajo (ids `1237`+
> contra `1214`/`1209`/`1200`) con **un frame por página**. Probablemente los
> reemplaza a todos; confirmarlo cierra de un saque los 5 items de esta tabla.
> Ver [FIGMA-AUDIT.md](FIGMA-AUDIT.md).

Encontrado el 2026-09-25 mapeando el archivo entero para armar
[FIGMA.md](FIGMA.md). **Cada canvas está partido en `version 1` y
`Feedback applied`**, y varias páginas se construyeron contra la primera sin
que nadie mirara la segunda. No sé qué cambió en cada una — hay que comparar.

| ✓ | Qué falta | Qué no matchea | Prod | Doc |
| --- | --- | --- | --- | --- |
| [ ] | **🔴 Inner group 1 — las 5 páginas están contra el Figma viejo** | Lo construido salió de `711:*` (*version 1*). La sección vigente es `1214:12684`: Our Story **`1214:12685`**, Our Team **`1214:13206`**, Community Partners **`1214:13312`**, New Patients **`1214:13540`**, FAQ **`1214:14877`** | [/about/our-story](https://schwabe.webflow.io/about/our-story) · [/about/team](https://schwabe.webflow.io/about/team) · [/about/community-partners](https://schwabe.webflow.io/about/community-partners) · [/new-patients](https://schwabe.webflow.io/new-patients) · [/faq](https://schwabe.webflow.io/faq) | [FIGMA.md](FIGMA.md) |
| [ ] | **🔴 Inner group 2 — Care Hub e Injury, ídem** | Construidas contra `805:*`. Vigentes: Care Hub **`1200:7814`**, Injury template **`1200:8069`**, más una alternativa *"beeter contrast"* `1200:9269` | [/care-hub](https://schwabe.webflow.io/care-hub) · [/care/sports-activity-overuse-injuries](https://schwabe.webflow.io/care/sports-activity-overuse-injuries) | [FIGMA.md](FIGMA.md) |
| [ ] | **🔴 Wellness + Fees, ídem** | Construidas contra `888:*`. Vigentes: Fees **`1209:10644`**, Wellness **`1209:11340`** | [/fees-and-policies](https://schwabe.webflow.io/fees-and-policies) · [/wellness-membership](https://schwabe.webflow.io/wellness-membership) | [FIGMA.md](FIGMA.md) |
| [ ] | **Blog alternative `1154:14090` sin mirar** | De la misma sección *Feedback applied* donde Patient Stories (`1154:14667`) y Blog Post (`1154:14375`) **ya se aplicaron**. Es el único frame de ese canvas que quedó sin revisar | [/blog](https://schwabe.webflow.io/blog) | [FIGMA.md](FIGMA.md) |
| [ ] | **Las dos legales se construyeron sin diseño** | `UTILITY-PAGES.md` decía que Privacy/Terms no tenían frame. **Sí lo tienen**: `1003:5313` *"Privacy Policy/Terms of use Template"*, en el mismo canvas de utility. Mismo error que el 404, que hubo que rehacer dos veces | [/privacy-policy](https://schwabe.webflow.io/privacy-policy) · [/terms-of-use](https://schwabe.webflow.io/terms-of-use) | [FIGMA.md](FIGMA.md) |

La Home tiene el mismo patrón —se construyó contra `596:50` y la vigente es
`974:1594`— pero eso ya está desglosado abajo en *La Home contra el Figma*.

---

## 🔍 Auditoría Figma ↔ prod — canvas "Final review"

Mapa reconciliado el **2026-09-27**: canvas `1237:9927`, **18 frames de página
que cubren las 21 vistas publicadas — no falta ninguna**. El prompt y el
inventario viven en [FIGMA-AUDIT.md](FIGMA-AUDIT.md).

| ✓ | Qué falta | Qué no matchea | Prod | Doc |
| --- | --- | --- | --- | --- |
| [x] | ~~**El `Announcement Bar` hay que construirlo**~~ · construido el 2026-09-28 | Componente **`Announcement Bar`** (`4f6985e3-501a-db32-6f10-b8ffe1b20f4f`, grupo `Global`) con 5 props — Text, Link Label, Link, Show Link y **Show Bar**, que es el interruptor global del `[LAUNCH STATE]`. **19 instancias**, una por página real, verificadas en el HTML servido: bar + dismiss + el link real de Maps en las 19. Copy y URL salen del Master Copy; color (Ink `#474d33`), filete del link (Border Strong, 2px) y tipografía (DM Sans **Medium**) del Figma `1241:10401`. ⚠️ **El dismiss no persiste hasta el deploy del bundle** — ver abajo | todas | [components/announcement.md](components/announcement.md) |
| [ ] | **12 frames alternativos sin elegir** — los del CTA ya se decidieron | Las 12 alternativas de otras sections siguen sin decidir. **El CTA salió de la lista el 2026-09-28**: `Split` aplicado en las 9 páginas, y **`Card Inset`** (= `Final CTA 2` y las 6 alternativas de página) queda construida y **sin aplicar**, a un prop de distancia si alguna página la quiere | todas | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [x] | ~~**El CTA de prod no matchea ninguno de los dos diseños**~~ · resuelto el 2026-09-28 | Pablo eligió **`Split`** (= `Final CTA 1`, el que el frame de la Home embebe) y está aplicado en **las 9 instancias**: Home, Our Story, Community Partners, New Patients, Patient Stories, Blog, Sports Injuries, Fees y el template de artículo. Verificado en el HTML servido: **9 de 9** con la variante, el marco de media, el disco oliva y la píldora clara. ⚠️ **Mi tercera pasada decía que prod y `Final CTA 1` eran la misma composición y que sólo difería el scrim. Era falso** — prod no matcheaba ninguno de los dos | 9 páginas | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [x] | ~~**El botón del CTA es la píldora oliva y el Figma lo dibuja claro**~~ · destrabado el 2026-09-28 | Los dos frames lo dibujan **relleno Beige con texto Olive** — el combo `cc-on-dark` que el sitio ya tenía — y prod lo tiene al revés. **No lo podía arreglar la variante**: el `Button` es una instancia anidada. Se expuso el prop **`Button Class`** (default `cc-icon-circle`, o sea **cero cambio hoy**) bindeado al botón; con `cc-icon-circle cc-on-dark` sale la píldora clara. Verificado renderizado: `rgb(251,250,248)` de fondo con texto `rgb(107,116,78)`, exacto al Figma | 9 páginas | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [x] | ~~**`/responsive` sobre el CTA**~~ · medido el 2026-09-28 | **`Split`: siete perfiles, cero fallos.** 2 columnas a 1440 y 1024, **1 columna con la foto arriba** de 991 para abajo, 0 scroll horizontal, 0 overflow y tap target ≥48px en los siete. ⚠️ **A 1024 el botón envolvía en dos líneas** — el punto ciego del iPad landscape: el padding de 80/64 del Figma dejaba la columna en 307px. Corregido scopeando ese padding a **`large` (≥1280)** y dejando 40/32 en la base, que es la regla que este doc ya fijaba. **`Card Inset` sigue sin medir** porque no está aplicada en ninguna página | 9 páginas | [RESPONSIVE.md](RESPONSIVE.md) |
| [x] | ~~**El título del CTA va en 48px en el Figma y prod lo rinde en 60**~~ · aplicado el 2026-09-28 | `Title Class` = **`cc-cta-sm u-mb-0`** en las 9. De paso se arregló el **template de artículo**, que tenía `cc-cta-sm` **sin** `u-mb-0` — el bug del override que pisa el default y que este doc ya documenta | 9 páginas | [RESPONSIVE.md](RESPONSIVE.md) |
| [x] | ~~**🔴 REGRESIÓN MÍA: la cita de Our Story quedó como caption bajo la foto**~~ · corregida el 2026-09-29 | Causa: **`.doctor_quote` la comparten 3 páginas** (Home, Our Story, New Patients) y el 2026-09-28 la cambié a blockquote con filete **para la Home**, así que las otras dos heredaron el cambio. El Figma de Our Story la quiere como **card oliva montada sobre la foto** — y el componente **ya estaba diseñado así**: su descripción dice *"an arched portrait with an olive pull-quote card"* y tiene el prop `Pull Quote`. Arreglado con el combo **`.doctor_quote.cc-overlay`** aplicado sólo en `Section / Story`, o sea **aditivo: Home y New Patients no se tocan**. Medido: 400×134, `absolute`, fondo `rgb(107,116,78)` Olive, texto Beige, montada sobre la foto, alineada a su borde derecho, sobresale 64px abajo y **no pisa la section siguiente** (56px de aire) | [/our-story](https://schwabe.webflow.io/our-story) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [x] | ~~**El CTA era 85px más alto que el Figma**~~ · corregido el 2026-09-29 | Reportado por Pablo como *"el cta split debería tener una variante más chica"*. **No hacía falta variante**: medido, `#community` daba **845** contra los **760** del Figma y el card estaba bien (565 ≈ 560) — lo que sobraba eran los **200px de `padding-bottom`** de `.section.cc-cta`. Bajado a **100/100** (6.25rem). Verificado en Home, Our Story, New Patients, Blog, Fees y Patient Stories: **760 exactos**, 1 escritura para las 9 | 9 páginas | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [x] | **Our Story · Four Things: el domo con check** — ✍️ **aplicado en el Designer el 2026-09-29, SIN publicar** | Re-medido contra el frame `1249:17441` (Pablo pidió re-chequear): el spec de las 2 llamadas tenía **3 errores**. (1) el glifo no va centrado, el Figma le da **`padding` 8 arriba / 2 abajo**; (2) el gap domo→título es **20px** y `.four_item` daba **40**; (3) el filete va a **`top: 32px`** (prod 40) y en **Ink `#474d33`** (prod `divider-on-dark` = blanco 12%). Aplicado todo en la variante **`Columns Check`**, así que New Patients e Injury no se tocan; leído de vuelta con `get_`. El glifo ya matchea sin tocar nada: `Plain Text` en `Size` = h2 → EB Garamond 500, 48px, -0.02em. **Falta**: (a) publicar y medir renderizado con la section en viewport; (b) **decisión de Pablo**: el Figma dibuja el filete en **3 segmentos de 170px con ~50px de aire a cada lado del domo**, y prod es un filete continuo que **toca** los domos; (c) `/responsive` de la section · ✅ **publicado y medido el 2026-09-29** | [/our-story](https://schwabe.webflow.io/our-story) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [ ] | **Our Story · `#cc-space`: el Figma lo parte en TRES sections y prod tiene una** | Medido sobre el frame: el Figma tiene (1) *A space designed for this kind of care* con su foto, (2) **`1249:17670` — un slider de 6 slides** de 480×622 con flechas de 44px, cada slide con una foto de la clínica y uno de los 4 puntos, y (3) **`1249:17687` — *Find us in Platt Park*** como section propia, con mapa de **610×700**, la dirección en H2 y la **tabla de los 7 días** + Phone + Arriving. Prod comprime los 4 puntos en una lista de texto y la ubicación en una card chica. Son **dos sections nuevas**, no un ajuste | [/our-story](https://schwabe.webflow.io/our-story) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [x] | ~~**El parallax y el "zoom" de la foto del CTA**~~ · apagados el 2026-09-28 | Pedido de Pablo. **Eran una sola cosa**: el CSS de Webflow no tiene **ni un `scale()`**, así que lo que se leía como zoom era el **sobrante del propio parallax** — `height: 120%; top: -10%` recortado por `object-fit: cover`. Se sacaron los dos hooks de la definición (`data-anim="parallax-media"` del card y `data-component="reveal"` de la raíz, que quedaba sin nada que animar), o sea **1 escritura para las 9**. Medido por CDP en 4 posiciones de scroll y 2 páginas: ratio img/frame **1.000** (antes 1.2), sobrante **0/0**, `transform: none`, **0 ScrollTriggers** en la section. En el HTML servido: 0 hooks en las 9, con el CTA intacto. ⚠️ El `parallax-media` que queda en Our Story es `.space_frame` de **The Space**, otro componente | 9 páginas | [components/reveal.md](components/reveal.md) |
| [x] | ~~**El hover del CTA "quedaba raro"**~~ · diagnosticado y corregido el 2026-09-28 | Reportado por Pablo. **No era el hover: era el reposo.** Medido con un hover real por CDP, el disco de la flecha estaba en `cc-circle`, o sea **Beige sobre la píldora Beige — invisible** — y al hacer hover nuestra regla lo pintaba Olive, así que **aparecía de la nada**. El Figma lo dibuja **Olive desde el reposo**. Corregido con `Button Right Icon Modifier` = **`cc-circle-olive`** en las 9. Medido después: el disco ya no cambia entre reposo y hover, y el hover queda en tinte de la píldora (Beige → Beige Muted) + anillo oliva + flecha que se endereza | 9 páginas | [animations/BUTTON-HOVER.md](animations/BUTTON-HOVER.md) |
| [ ] | **Las 5 páginas de `/care/*` no tienen frame** | El review sólo trae *Injury (template)*. Las 5 del dropdown (`back-neck-pain`, `headaches-tmj`, `plantar-fasciitis`, `prenatal-postpartum`, `wellness`) dan 404 y no están diseñadas. O se construyen desde la plantilla, o se sacan del nav | [/care/back-neck-pain](https://schwabe.webflow.io/care/back-neck-pain) ❌ | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [x] | ~~**Home — fase 1 corrida**~~ · 2026-09-27 | **12 deltas** contra `1241:10399`. El orden de las 16 sections es **idéntico** y **94 de 95 textos matchean exacto**, comillas curvas y `®` incluidos | [Home](https://schwabe.webflow.io/) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [ ] | ~~**el CTA Banner cambió de estructura**~~ → **es sólo el scrim** · corregido el 2026-09-27 | Renderizadas las dos, **la composición es la misma**: bloque oliva izquierda, foto derecha. Lo único que difiere es el borde — **corte duro** en el Figma, **degradado** en prod. Es un ajuste de `.cta_scrim`, **no un rebuild de 9 páginas** | 9 páginas | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [x] | ~~**Home · la card de Shockwave: foto y columnas**~~ · aplicado el 2026-09-27 | Foto → **`0340_shockwave_treatment`** (el cabezal en el tobillo, con el equipo detrás), y `shockwave-card_media` movido **antes** de `_copy`. Verificado en el HTML publicado: `shockwave-card_media` es el primer hijo y `colorado-shockwave-key-visual` aparece **0 veces**. El alt también se corrigió — decía *"acoustic wave therapy graphic"* | [Home](https://schwabe.webflow.io/) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [x] | ~~**Home · la foto de `#plan`**~~ · aplicada el 2026-09-27 | **`0243_patient_interactions`** — la doctora mostrando el libro de anatomía. Elegida contra el Figma comparando con `0242`, que es casi idéntica: las distingue la doble página con las figuras rojas y la pestaña de color en el canto. `.plan_media` ya clipeaba, así que sólo hizo falta un `Image` con la clase nueva **`plan_img`** | [Home `#plan`](https://schwabe.webflow.io/#plan) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [x] | ~~**Home · la foto de fondo de Testimonials**~~ · aplicada el 2026-09-27 | **`schwabe_chiropractic_colorado_summer_mountains`** — la pradera alpina que dibuja el Figma | [Home](https://schwabe.webflow.io/) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [ ] | **Home · las cards de síntoma: título + cuerpo, y el copy cambió** | Además del split que ya estaba anotado, **el texto no es el mismo**: prod dice *"Your hip, plantar fascia, or low back never fully settles…"* y el Figma *"Your low back never fully settles"* / *"or your hip, or your plantar fascia…"*. **Hay que leer las 6 una por una** — la marquesina del Figma clipea y sólo 4 se leen completas | [Home](https://schwabe.webflow.io/) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [x] | ~~**El mapa de New Patients publicaba la dirección VIEJA**~~ · corregido el 2026-09-27 | El pin decía **`628 S PEARL`** (el local original) mientras el H2 al lado decía la nueva. **El mapa nuevo se exportó del Figma**, del frame de New Patients `1249:19415` — que es el único con el pin corregido: el de la Home **todavía dibuja `628 S PEARL`**, así que exportar del frame equivocado habría repetido el error. Export PNG a 3×, redimensionado a 1220px, subido como `south-denver-map-evans.png` (`6ab9966881d40ecb7705ec54`, 138KB). Aplicado en **New Patients, Contact y la Home**. Verificado: 0 restos de `south-denver-map.png` en las tres | [/new-patients](https://schwabe.webflow.io/new-patients) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [x] | ~~**El mapa de `#find-us` de la Home no existe**~~ · construido el 2026-09-27 | Era un rectángulo con un ícono de pin y **0 `<img>`**. Se insertó el mapa corregido con una clase nueva `find-us_img` y se ocultó el glifo del pin. Verificado renderizado: el pin dice `628 E Evans Ave, Suite 100`, igual que el H2 al lado | [Home](https://schwabe.webflow.io/#find-us) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [x] | **🔴 Los marcadores de columna: check ✓ en disco, no numeral** | En *Four things* de Our Story el Figma pone un **check dentro de un disco relleno** y prod un **numeral**. En *First visit process* de Care Hub faltan **los checks Y los filetes** entre ellos, y la banda es **forest oscuro** donde el Figma la pinta **oliva media** · ✅ **publicado y medido el 2026-09-29** | [/about/our-story](https://schwabe.webflow.io/about/our-story) · [/care-hub](https://schwabe.webflow.io/care-hub) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [x] | **🔴 Care Hub · `#approach` tiene otro layout** | Figma = copy + **foto en arco a la derecha**, con la cita dentro de la columna. Prod = **dos columnas de texto**, sin foto, con la cita en una card beige. No es "falta la foto": es otra composición · ✅ **publicado y medido el 2026-09-29** | [/care-hub](https://schwabe.webflow.io/care-hub) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [x] | ~~**Home · la card 4 de What makes this different**~~ · cubierto arriba por Home-06 | — | [Home](https://schwabe.webflow.io/) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [ ] | **Our Story · *The space* y el cierre** | Prod trae un bloque extra (*Four treatment rooms…*) + card de ubicación que el Figma no dibuja. Y el cierre: Figma = card oliva **con foto**, prod = banda plana | [/about/our-story](https://schwabe.webflow.io/about/our-story) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [ ] | **Care Hub · el eyebrow del Shockwave bridge** | Figma = **lockup de marca + `Colorado Shockwave®`** · prod = *"ALSO AVAILABLE HERE"*. ⚠️ Derek (#101) pide algo **distinto de los dos**: el **logo horizontal real** a 40–50px, que está en Drive. ✅ La foto de esa section ya pasó a **`0292`** el 2026-09-27 | [/care](https://schwabe.webflow.io/care) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [ ] | **⚠️ El eje "section por section renderizada" está incompleto — y no sólo en las 13 páginas que faltan** | Las 5 que sí se compararon sacaron **11 deltas que el diff de texto y el de imágenes no veían**. Faltan enteras: Injury · Wellness · Fees · FAQ · Our Team · Community Partners · Blog · Blog Post · Contact · Products · Join · legales · 404. **Y encima la cobertura dentro de una página auditada no es total**: la Home figura como comparada y `#meet-your-doctor` **nunca se miró** — de ahí salió el delta del blockquote de abajo, que encontró Pablo. La pasada tiene que ser **section por section de verdad**, enumerando las sections del frame y tachándolas de a una | 13 páginas + las sections sueltas | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [x] | ~~**Home · la cita de `#meet-your-doctor` está en otro lugar**~~ · aplicada el 2026-09-28 | La cita salió de la card verde flotante y pasó a ser **blockquote dentro de la columna de copy**, entre el ¶3 y el ¶4, con **filete de 2px en Olive Green** (`#6b744e`, muestreado del render), sangría 1.5rem y 1.25rem de aire — el mismo tratamiento que `rooted_quote`. La **atribución se ocultó**, como manda el Figma: la cita ya está dentro de la bio de quien la dice. Verificado en el HTML publicado: la cita está dentro de `doctor_copy`, **0** dentro de `doctor-media_col`, **0** apariciones de la atribución. ⚠️ El prop `Attribution` quedó **sin consumidor visible** — no se borró, volver atrás es una escritura | [Home](https://schwabe.webflow.io/#meet-your-doctor) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [ ] | **El dismiss del Announcement Bar no persiste hasta el deploy** | `src/components/announcement.js` está escrito, lintado y registrado, pero **no llega al sitio** hasta `npm run build` + push + **bumpear el hash del CDN**. Hasta entonces la × se ve y no hace nada. **La barra igual funciona** — se sirve visible y el JS sólo la saca | todas | [components/announcement.md](components/announcement.md) |
| [x] | ~~**`/responsive` sobre el Announcement Bar**~~ · medido el 2026-09-28 | **Siete perfiles, cero fallos**: 0 scroll horizontal, 0 elemento desbordando, tap target **44px en los siete** y sin solape entre el contenido y el control. ⚠️ **A 390 y 320 la barra mide 94px** — la frase más el CTA envuelven en 3 líneas, ~11% del viewport. No es chrome fijo (scrollea y se va, que es por qué quedó afuera del `.nav` pegajoso), pero crece si el mensaje se alarga | todas | [components/announcement.md](components/announcement.md) |
| [ ] | **De las 23 imágenes distintas, quedan 6** | ✅ Aplicadas el 2026-09-27, todas elegidas comparando contra el render del Figma: Home (4) · Our Story (2) · Our Team · Join · Patient Stories (2) · Products (2) · Contact (2) · Care Hub (2) · Injury (2) · New Patients (3, incluido el mapa) · Wellness (1). **Quedan**: el slider de 5 fotos de Our Story `#cc-space`, la banda y `#fit` de Wellness (**bloqueadas: las manda Derek**), la banda del Blog Post (es campo de CMS, una por artículo), la foto del `Feature Card` de Products y el póster del video de New Patients | 5 páginas | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [x] | ~~**Contact servía un placeholder del starter de MAST en el hero Y en el mapa**~~ · corregido el 2026-09-27 | Hero → **`0085_exterior`**, la fachada con los dos carteles. ⚠️ Mi auditoría decía que el Figma pone *"el saludo en recepción"* — renderizado, es **la fachada**. Mapa → el corregido. Los dos `Image` estaban **sin override**, o sea tomando el default del componente `Image` de MAST: por eso salía el render violeta. Verificado: **0** `Surreal` en el HTML | [/contact](https://schwabe.webflow.io/contact) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [x] | ~~**La card de producto mostraba un degradado genérico de MAST**~~ · aplicado el 2026-09-27 | Card → **`0262_products_retail`** (el expositor con las almohadas), hero → **`0251_products_retail`** (el expositor de pared). ⚠️ El `Image` del hero estaba en **`null`**, o sea que tomaba el **default del componente** `Section / Page Header` — por eso mostraba la foto del hero de la Home. Se seteó en la **instancia**, no en el default, para no tocar las otras 8 páginas | [/products-we-recommend](https://schwabe.webflow.io/products-we-recommend) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [ ] | **Prod reutilizaba 5 fotos en 2 slots — quedan 2** | ✅ Resueltos el 2026-09-27: Our Team → **`0350`** (Kati y Frank contra los carteles) · Join Our Team → **`0249`** (la que Derek reservó para esta página) · Products → **`0251`** · Patient Stories → **`0018`** (la que subió Derek) y banda → **`0200`**. **Quedan**: `home-hero-active-conversation` todavía cubre Home + **Wellness**, y `007_SC-OURSTORY…` todavía cubre **Care Hub** | 2 páginas | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [ ] | **Our Story · la foto de Platt Park va enmascarada en arco** | Es **la misma foto** que prod; el Figma la recorta en arco y prod la deja rectangular. Único delta de recorte. ✅ De paso, la banda pasó a **`0092`** y el retrato a **`0102`** el 2026-09-27 | [/our-story](https://schwabe.webflow.io/our-story) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [x] | ~~**Fase 1 completa — las 18 páginas auditadas**~~ · 2026-09-27 | **38 deltas de texto, layout y estructura**, más **23 imágenes distintas** medidas en una segunda pasada. **4 páginas con cero** — New Patients, FAQ, Contact y Join Our Team — y Injury con una sola palabra. Detalle página por página en [FIGMA-AUDIT.md](FIGMA-AUDIT.md) | todas | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [ ] | **🔴 Fees · falta el bloque de Medicare entero** | El Figma trae 5 sub-bloques (*Medicare patients* · *What Part B covers* · *Maintenance and wellness care* · *Medicare Advantage (Part C)* · *Questions before you book*). En prod "Medicare" aparece **una sola vez, en el intro del hero — que lo promete**: *"Direct answers on fees, insurance, payment, cancellations, and Medicare"*. La página promete algo que no entrega | [/fees-and-policies](https://schwabe.webflow.io/fees-and-policies) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [ ] | **🔴 Fees · falta *"Three ways to pay for ongoing care."*** | Pay-per-visit · Care Package · Wellness Membership, con su bajada. Prod tiene `#wellness-membership` pero no la comparación de las tres | [/fees-and-policies](https://schwabe.webflow.io/fees-and-policies) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [ ] | **🔴 Fees · *The quick version* son otras cards** | Figma: 5 con labels `out of network` · `superbill ready` · `due today` · `HSA/FSA` · `Not covered`. Prod: **3 de estadística** — `60 Full minutes` · `20 Hands-on minutes` · `3 Ways to pay`. Otro modelo de contenido, no un wording | [/fees-and-policies](https://schwabe.webflow.io/fees-and-policies) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [ ] | **💵 El per-visit rate de Ultimate Longevity · 4 visitas** | Figma **`$143`**, prod **`$145`**. **La aritmética le da la razón a prod** ($580 ÷ 4 = $145): o el Figma tiene el error, o el monthly debería ser $572. Aparece en los dos frames (Wellness y Fees). **Es un precio — no lo asumo** | [/wellness-membership](https://schwabe.webflow.io/wellness-membership) · [/fees-and-policies](https://schwabe.webflow.io/fees-and-policies) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [ ] | ~~**Our Story · faltan 2 sections**~~ → **las dos estaban mal leídas** · corregido el 2026-09-27 | `1249:17670` **no es un carrusel de testimonials**: es el **slider de fotos de la clínica** (una imagen por punto). Y *Find us* **no falta** — dirección, teléfono y horarios están dentro de `#cc-space` como card. El delta real: prod rinde como **texto estático** lo que el Figma rinde como **slider** | [/about/our-story](https://schwabe.webflow.io/about/our-story) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [ ] | **🔴 Blog Post · falta *"Subscribe to our newsletter"*** | El Figma trae `CTA / 26 /` con H2, bajada, input, botón `Subscribe` y la línea de Terms. En prod ese lugar lo ocupa `#free-guide` — **es otra oferta**: el lead magnet de la guía en vez de una suscripción. Hay que decidir cuál va | [/blog/why-longer…](https://schwabe.webflow.io/blog/why-longer-chiropractic-appointments-matter) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [x] | **Care Hub · `#approach` sin foto, y `#csw-bridge` con las columnas al revés** | El Figma dibuja *"Candid chiropractic treatment photography area"* de **590×719** en la columna derecha de `#approach`; prod tiene 0 imágenes. Y en `#csw-bridge` el Figma pone la media a la **izquierda** · ✅ **publicado y medido el 2026-09-29** | [/care-hub](https://schwabe.webflow.io/care-hub) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [ ] | **⏳ Wellness · `#fit` y la banda — BLOQUEADAS** | Derek reconoce (#106) que se le pasó la página y **va a mandar las imágenes**. No se ponen las del Figma: Olha ya avisó (#105) que las que hay ahí son **placeholder suyo**, puestas porque el manifest no las especificaba. ✅ El hero sí se resolvió: **`0063_excercise`** | [/wellness-membership](https://schwabe.webflow.io/wellness-membership) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [ ] | **Blog · el H2 ✅, falta el bloque `Advanced clinical training`** | El H2 de la grilla ya dice **"Expert guidance for moving better."** (era *"All articles."*), verificado publicado. **Queda** el Aside de *Advanced clinical training* del intro, que hay que construir | [/blog](https://schwabe.webflow.io/blog) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [ ] | **Legales · 3 deltas en las dos páginas** | Falta el **árbol del hero** (747×778, igual que el FAQ), la card **`Questions?`** al pie del índice, y **`Share this post`**. *"Last Modified"* **no** es delta: lo pone un `::before` | [/privacy-policy](https://schwabe.webflow.io/privacy-policy) · [/terms-of-use](https://schwabe.webflow.io/terms-of-use) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [x] | ~~**Our Team · el `Final CTA 1` contra `#growing-team`**~~ · decidido el 2026-09-27 | **Se mantiene `#growing-team`**: el copy es específico de la página y dice más que el CTA genérico. Misma decisión para Our Story y Community Partners. De paso la banda de cultura pasó a **`0350`** | [/team](https://schwabe.webflow.io/team) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [x] | ~~**Community Partners y Our Story · el mismo caso del CTA**~~ · decidido el 2026-09-27 | **Se mantienen las sections propias** de cierre en las dos | 2 páginas | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [x] | ~~**404 · el botón dice otra cosa**~~ · aplicado el 2026-09-27 | → **`Back to home`** apuntando a `/`, como manda el Figma. La salida lateral la da el nav, que la página ahora tiene. ⚠️ El prop `Link` del `Button` **sólo acepta url/email/phone**, no link de página: quedó como URL literal `/`, la única que nunca se va a mudar | la vista 404 | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [x] | ~~**Products · el tag de la card está invertido**~~ → **eran dos cosas** · aplicado el 2026-09-27 | Mi auditoría decía que estaban invertidos. Renderizando el Figma: **las dos existen, en lugares distintos** — `SLEEP & COMFORT` es el eyebrow arriba del nombre, y `AVAILABLE IN CLINIC` es una **píldora blanca sobre la foto**, arriba a la izquierda, con punto verde. Se corrigió el eyebrow y se **construyó la píldora** (clase nueva `product-card_chip`, fondo por token Beige, `product-card_media` a `position: relative`). Verificado renderizado por CDP | [/products-we-recommend](https://schwabe.webflow.io/products-we-recommend) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [x] | ~~**Injury · una palabra**~~ · aplicada el 2026-09-27 | *"Shoulder pain, **shoulder strains**, rotator cuff…"*. Verificado publicado | [/care/sports-activity…](https://schwabe.webflow.io/care/sports-activity-overuse-injuries) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [x] | ~~**Correr la fase 1 sobre las 18 páginas**~~ · hecho el 2026-09-27 | Una página por pasada, empezando por **Home** (su Nav, Footer y las 9 instancias del CTA Banner se propagan a las 21 vistas) y siguiendo por **Blog Post**, que nunca fue auditable. Requiere **publicar antes** — el Designer tiene cambios sin publicar y si no, los deltas mezclan "falta hacerlo" con "falta publicarlo" | todas | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |

---

## 🚨 Bloquea el lanzamiento

| ✓ | Qué falta | Qué no matchea | Prod | Doc |
| --- | --- | --- | --- | --- |
| [x] | ~~**Bumpear el hash del CDN a `@d8553d2`**~~ · verificado el 2026-09-24 | El sitio ya sirve `…schwabe-chiropractic@d8553d2/dist/main.js`. Confirmado bajando el bundle y su chunk de `filter` | [schwabe.webflow.io](https://schwabe.webflow.io/) | [RESPONSIVE.md](RESPONSIVE.md) |
| [ ] | **Publicar Webflow** | Todo lo del Designer desde el 2026-09-21 —38 componentes de section, 31 `div`→`section`, 22 renames, las 4 grillas que no colapsaban, los atributos de animación, la ronda del 2026-09-22— está escrito y verificado **pero sin publicar** | — | [COMPONENTIZATION-HANDOFF.md](COMPONENTIZATION-HANDOFF.md) |
| [ ] | **`/responsive` sobre todo lo tocado** | Obligatorio por `CLAUDE.md` y **no se corrió sobre ninguna** de las sections de las últimas tres tandas. Faltan: Home (3 pins + cards + hero), `/care-hub`, `/faq` (rebuild CMS) y las 5 utility | todas | [RESPONSIVE.md](RESPONSIVE.md) |
| [ ] | **Verificar en navegador lo que ya se publicó** | `theme.css`, `area-card.css`, `symptom-card.css`, `job-card.css`, `filter.js` y `toc.js` **sí están en `@216bb5a`** — las docs decían que no llegaban. Nunca se los vio correr | todas | [RESPONSIVE.md](RESPONSIVE.md) |
| [ ] | **El `<html>` seguía en `u-mode-dark`** | Medido el 2026-09-21: la clase estaba puesta **aunque `theme.css` ya estaba servido**. El `:root:root` llegó pero hay que confirmar que los tokens resuelven a light. No se puede verificar por curl — la clase la escribe JS | [schwabe.webflow.io](https://schwabe.webflow.io/) | [RESPONSIVE.md](RESPONSIVE.md) |

---

## ⏳ Necesita una decisión tuya

| ✓ | Qué falta | Qué no matchea | Prod | Doc |
| --- | --- | --- | --- | --- |
| [ ] | **La section "Specialized" de la Home** | El Figma `1075:616` la dibuja entre Testimonials y The Cost of Waiting. **No existe en la Home construida.** La decisión: componente nuevo sólo para la Home, o migrar las 3 instancias de `Section / Shockwave Bridge` | [Home](https://schwabe.webflow.io/) | [HOME-FIGMA-SYNC.md](HOME-FIGMA-SYNC.md) |
| [x] | ~~**El ® sale a tamaño completo**~~ · **construido el 2026-09-29**, falta deployar | Derek dio la regla (#101) y está implementada en **`src/utils/registered.js`** + **`src/styles/registered.css`**, corriendo desde `global.js`: ® **sólo en la primera mención visible de cada página**, **nunca en botones**, al **60%** con el tope en la **cap height**. El `-0.45em` está **medido** con `canvas.measureText` sobre las dos fuentes del sitio (ideal −0.457 en EB Garamond, −0.455 en DM Sans: un solo valor sirve). Verificado inyectando el código del repo por CDP sobre 6 páginas publicadas: **Home 11→1 · Patient Stories 15→1 · FAQ 14→1 · Fees 7→1 · Join 3→1 · Care 5→1**, un solo `sup.u-reg`, ratio 0.60 exacto y **0 en botones**. ⚠️ El FAQ obligó a **dos pasadas**: sus 44 `<details>` cerrados esconden 10 de sus 14 ®, y con una sola pasada reaparecían crudos al abrir el accordion — medido y corregido. **Falta `npm run build` + push + bump del CDN**, y mirarlo con los ojos | todas | [RESPONSIVE.md](RESPONSIVE.md) |
| [x] | **El gutter del container** · ✅ **2026-09-29**: base 2.5rem + modos *Tablet* 2rem (medium) y *Mobile* 1.25rem (small) en la colección Components. Medido 40/32/20 — El token da **86.4px** por lado a 1440; el Figma dibuja **40px**. Toda section es ~108px más angosta que el diseño. Es un cambio de token y mueve las 14 páginas | todas | [RESPONSIVE.md](RESPONSIVE.md) |
| [ ] | **Falta un logo claro para fondos oscuros** | El wordmark granate sobre el nav verde oliva se lee flojo. **Pasa también en desktop** — no es responsive | [/faq](https://schwabe.webflow.io/faq) | [RESPONSIVE.md](RESPONSIVE.md) |
| [ ] | **Lenis elegido pero no implementado** | Decidido el 2026-09-08 sobre ScrollSmoother. Falta cargar la librería (script en el embed de MAST, o dependencia npm) y su CSS, que es obligatorio | — | [animations/SMOOTH-SCROLL.md](animations/SMOOTH-SCROLL.md) |
| [ ] | **Los precios de membresía están duplicados** | `Section / Membership Options` y `Section / Membership Summary` los repiten como **dos juegos de props independientes**. Cambiar una tarifa exige tocar las dos | [/wellness-membership](https://schwabe.webflow.io/wellness-membership) · [/fees-and-policies](https://schwabe.webflow.io/fees-and-policies) | [COMPONENTIZATION-HANDOFF.md](COMPONENTIZATION-HANDOFF.md) |

---

## 🎨 Footer — reconstruido, con tres agujeros de contenido

El rebuild contra el Figma `1183:572` **está hecho** (2026-09-25) y alcanza las
30 páginas. Lo que queda no es estructura, es contenido que no existe.

| ✓ | Qué falta | Qué no matchea | Prod | Doc |
| --- | --- | --- | --- | --- |
| [x] | ~~**Las 4 URLs sociales**~~ · aplicadas el 2026-09-27 | Instagram, Facebook, YouTube y LinkedIn con las URLs del Master Copy v0.36, verificadas en el HTML publicado. ⚠️ **Cada pill arrastraba además un atributo `href="#"` literal** que se emite sobre el elemento y le gana al link del setting — hubo que borrarlo, o los 4 seguían muertos | todas | [FOOTER.md](FOOTER.md) |
| [ ] | **6 links de Care apuntan a `/care-hub`** | El Figma lista 8 áreas; sólo 2 tienen página. Se apuntaron al hub **a propósito**, para no meter 5 404 nuevos en las 30 páginas. Cuando existan Back & Neck, Prenatal, Plantar, Headaches y Wellness Care, son 6 ediciones de link | todas | [FOOTER.md](FOOTER.md) |
| [ ] | **Los `footer-link` siguen abajo del tap target** | Texto sin padding vertical → ~21px de alto contra los **44** que fija el contrato. El rebuild **no lo resolvió**; las píldoras sociales sí (2.75rem) | todas | [RESPONSIVE.md](RESPONSIVE.md) |
| [ ] | **`/responsive` sobre el footer** | El colapso está **escrito y no medido**: 4 col → 2 (≤991) → 1 (≤767), y la banda de marca a 1 columna en `medium` | todas | [FOOTER.md](FOOTER.md) |
| [ ] | **6 clases de MAST quedaron huérfanas** | `footer-text`, `footer-legal`, `footer-logo_link`, `footer-list`, `footer-social_list`, `footer-social_link`. No se borraron porque las páginas demo de MAST pueden usarlas — hay que verificar antes | — | [FOOTER.md](FOOTER.md) |

---

## 📰 Blog Post template

El template **ya publica** (`/blog/<slug>` devuelve 200 — el `shouldPublish`
se destrabó a mano). Ronda del 2026-09-25 aplicada; esto es lo que queda.

| ✓ | Qué falta | Qué no matchea | Prod | Doc |
| --- | --- | --- | --- | --- |
| [ ] | **🔴 El byline no lee el CMS — bloqueado en una decisión** | Los 5 `Plain Text` se reemplazaron por **6 elementos nativos** (el paso previo obligatorio) y el hero rinde igual que antes. Pero **no se puede crear un binding de CMS dentro de la definición de un componente**: `set_settings` devuelve *"Element is not inside a CMS context"*. Para bindear hay que **desvincular `Section / Article Hero`** y hacerlo en la página. Decisión pendiente: desvincular y dejarlo como markup, o desvincular, bindear y volver a convertir | el template da 404 | [STORIES-BLOG-CMS.md](STORIES-BLOG-CMS.md) |
| [ ] | **Las etiquetas del TOC son el H2 completo** | El Figma dibuja etiquetas cortas (*"The short-visit problem"*); los H2 de los artículos son oraciones enteras, así que el índice ocupa 3 líneas por entrada. **Pablo dijo que está bien así** el 2026-09-25 — anotado por si deja de escalar cuando haya más artículos. La salida barata es cortar en el primer punto | ″ | [components/toc.md](components/toc.md) |
| [x] | ~~**Hueco en blanco arriba del cuerpo del artículo**~~ · arreglado el 2026-09-25 | No era un margen: `.toc` va **primero en el DOM** en la columna 2 y `.article_content` segundo en la columna 1, así que el auto-placement mandaba el cuerpo a una **segunda fila** y dejaba vacía la celda fila 1 / columna 1 — el alto del TOC más los 2.5rem de `grid-row-gap`. Arreglado con `grid-row: 1 / 2` en `.toc`, `.article_content` y `.legal_content`, y el reset a `auto` en `medium`. Verificado por read-back. **Falta publicar y medirlo** | [/blog/<slug>](https://schwabe.webflow.io/blog/why-longer-chiropractic-appointments-matter) · [/privacy-policy](https://schwabe.webflow.io/privacy-policy) · [/terms-of-use](https://schwabe.webflow.io/terms-of-use) | [RESPONSIVE.md](RESPONSIVE.md) |
| [ ] | **El `body` del artículo está bindeado DENTRO de la definición del componente** | `Section / Article Body` tiene **2 props** (`Anchor ID`, `Index Label`) y **ninguno para el cuerpo**: el binding al campo `body` vive en la instancia de `Rich Text` de la definición, de ahí el ⚠️ del Designer. Funciona (el canvas rinde el artículo real) pero **acopla el componente a la colección `Blogs`**: fuera de un template de Blogs se rompe. Hoy tiene 1 sola instancia. **No se puede verificar en producción: el template da 404** | el template da 404 | [STORIES-BLOG-CMS.md](STORIES-BLOG-CMS.md) |
| [ ] | **Falta la section de newsletter del Blog Post** | El Figma `1154:14467` (*CTA / 26*, 1440×502) dibuja **"Subscribe to our newsletter"** + párrafo + form de una línea (input 499×48 + botón *Subscribe* 121×48) + la línea legal *"By clicking Sign Up…"*. **El form va independiente, no un variant de `Section / Free Guide`** — decisión de Pablo el 2026-09-25: los estilos de Free Guide sirven de referencia y nada más, el diseño es muy distinto | [/blog/<slug>](https://schwabe.webflow.io/blog/why-longer-chiropractic-appointments-matter) | [FIGMA.md](FIGMA.md) |
| [x] | ~~**El H1 del artículo medía 60px**~~ · corregido el 2026-09-25 | El prop `Size` estaba en la variante **H1** (hasta 3.75rem); el Figma `1154:14378` usa **Desktop/Heading 2** = 48px. `Size` → **H2**, `Tag` sigue en `h1`. **Falta publicar** | el template da 404 | [STORIES-BLOG-CMS.md](STORIES-BLOG-CMS.md) |
| [x] | ~~**El breadcrumb en 12px y con un `/`**~~ · corregido el 2026-09-25 | Pasó a **`.eyebrow.cc-breadcrumb`**, que MAST ya traía (16px uppercase, hover subrayado, `cc-current-page` al 50%), y el `/` se reemplazó por un **`<span class="ph ph-caret-right">`**. `article-breadcrumb_link` quedó huérfana, sin borrar | ″ | [STORIES-BLOG-CMS.md](STORIES-BLOG-CMS.md) |
| [x] | ~~**La meta del byline en versalitas de 12px**~~ · corregido el 2026-09-25 | Los 3 `Plain Text` estaban en `Eyebrow Small`. Fecha y read time → **base** (16px, caja baja) y el bullet → **Paragraph SM** (14px), que es exacto al Figma | ″ | [STORIES-BLOG-CMS.md](STORIES-BLOG-CMS.md) |
| [x] | ~~**Dos medidas chicas del hero**~~ · corregido el 2026-09-25 | `row-gap` a **1.5rem** (24px) y, para que el salto al byline siguiera dando 40, el `padding-top` de `.article-byline` bajó a **1rem**. El gap de *By* al nombre, a 0.25rem | ″ | [STORIES-BLOG-CMS.md](STORIES-BLOG-CMS.md) |
| [x] | ~~**La foto del hero era 16/9**~~ · corregido el 2026-09-25 | El frame mide 1360×812 (1.675) → `aspect-ratio: **5/3**`, que es el ratio limpio más cercano (0.5% de diferencia) | ″ | [STORIES-BLOG-CMS.md](STORIES-BLOG-CMS.md) |
| [x] | ~~**El read time tenía que ser calculado**~~ · construido el 2026-09-26 | Componente **`readtime`**: cuenta las palabras de `[data-readtime-source]` a 225 wpm y escribe `"N min read"`. **Sin Finsweet** — el bundle ya carga y `toc.js` ya recorre ese mismo rich text. El campo `read-time` del CMS queda como fallback sin JS y **deja de ser la fuente de verdad**. Falta build + push + bump del CDN, y nunca corrió en un navegador (el template da 404) | ″ | [components/readtime.md](components/readtime.md) |
| [x] | ~~**El índice no tenía la flecha del item activo**~~ · construido el 2026-09-26 | El Figma `1160:16538` le pone un arrow-up-right de 16px al item activo. Construido con **el espacio siempre reservado y sólo la opacidad animándose**: copiar la indentación del Figma haría saltar cada línea de costado al cambiar de sección | ″ | [components/toc.md](components/toc.md) |
| [ ] | **Falta la section de newsletter del Blog Post** | Sigue sin construirse. El Figma es `1154:14467` (*CTA / 26*) y el form va **independiente**, no un variant de `Section / Free Guide` | ″ | [FIGMA.md](FIGMA.md) |
| [ ] | **El caption de imagen del Figma no existe** | El frame dibuja `Image caption` bajo la foto del cuerpo. El rich text del CMS no lo trae | ″ | — |
| [ ] | **`/responsive` sobre el layout nuevo** | `.article_grid` y `.legal_grid` invirtieron proporciones (`1fr 17.5rem`), y encima entraron la fila de share y el Free Guide. **Nada medido.** Son 3 páginas: `/blog/<slug>`, `/privacy-policy`, `/terms-of-use` | 3 páginas | [RESPONSIVE.md](RESPONSIVE.md) |
| [ ] | **`share.js` nunca corrió en un navegador** | Falta ver que los 3 intents abran con la URL del artículo, y que el copiar ande en **Safari** y en un navegador in-app (donde `navigator.clipboard` no existe y cae al fallback deprecado) | ″ | [components/share.md](components/share.md) |

---

## 🖐️ A mano en el Designer — el MCP no puede

| ✓ | Qué falta | Qué no matchea | Prod | Doc |
| --- | --- | --- | --- | --- |
| [ ] | **Los 2 links a Collection Page** | El `u-link-cover` de la card del Blog y el de "More from the practice" tienen que apuntar al item actual. El MCP emite un **href literal** con las tres formas probadas, y `get_bindable_sources` devuelve cero fuentes | [/blog](https://schwabe.webflow.io/blog) | [STORIES-BLOG-CMS.md](STORIES-BLOG-CMS.md) |
| [ ] | **Notificación de los 2 formularios** | Los dos quedaron con el nombre interno `Html Form` (`data-name` no lo pisa) y sin destinatario. Va a `info@schwabechiropractic.com` | [/contact](https://schwabe.webflow.io/contact) · [/join-our-team](https://schwabe.webflow.io/join-our-team) | [UTILITY-PAGES.md](UTILITY-PAGES.md) |
| [ ] | **Borrar la colección `Legal Pages`** | Quedó huérfana: Privacy y Terms son páginas estáticas. La plantilla ya está en draft, así que no publica | — | [UTILITY-PAGES.md](UTILITY-PAGES.md) |
| [ ] | **Los links del Nav y Footer a las 5 páginas nuevas** | Confirmado curleando: el nav de la Home **no linkea** a `/blog`, `/products-we-recommend`, `/join-our-team`, `/privacy-policy` ni `/terms-of-use`. Las 5 responden 200 y son inalcanzables navegando | [Home](https://schwabe.webflow.io/) | [UTILITY-PAGES.md](UTILITY-PAGES.md) |

---

## 📝 Contenido y sign-off

**No se publica a dominio propio sin el OK de Kati sobre los tres primeros.**

| ✓ | Qué falta | Qué no matchea | Prod | Doc |
| --- | --- | --- | --- | --- |
| [ ] | **12 FAQs con `Needs Review` en ON** | Seguridad de los ajustes, prenatal, Webster, pediátrico, evidencia, superbills, cancelación y Medicare — este último dice literal *"FINAL MEDICARE COPY PENDING KATI REVIEW AND SIGN-OFF"*. Filtrar por ese switch en el CMS | [/faq](https://schwabe.webflow.io/faq) | [FAQ-CMS.md](FAQ-CMS.md) |
| [ ] | **La historia de Sarah tiene `Needs Review` en ON** | El handoff la marca *"DRAFT — constructed from consented source quotes. Kati to review final framing before publishing"* | [/patient-stories](https://schwabe.webflow.io/patient-stories) | [STORIES-BLOG-CMS.md](STORIES-BLOG-CMS.md) |
| [ ] | **Consentimiento de la foto de Sarah** | El `portrait` cargado es la imagen del handoff, **no una foto real de la paciente**. El handoff: *"Do not use patient imagery unless approved"* | [/patient-stories](https://schwabe.webflow.io/patient-stories) | [STORIES-BLOG-CMS.md](STORIES-BLOG-CMS.md) |
| [x] | ~~**Dos políticas sin definir en el Master Copy**~~ · resuelto el 2026-09-27 | **El Figma las define y prod las tiene exactas**: 48h para la primera visita, $100 de depósito perdido abajo de 24h, y 24h para las de seguimiento. El FAQ dice lo mismo. Sólo falta el sign-off de Kati, no una decisión | [/faq](https://schwabe.webflow.io/faq) | [FAQ-CMS.md](FAQ-CMS.md) |
| [ ] | **Lorem ipsum en producción** | El accordion 2 del FAQ preview de New Patients (*"Do I need to have a serious injury or chronic problem to book?"*) tiene la respuesta en Lorem ipsum | [/new-patients](https://schwabe.webflow.io/new-patients) | [COMPONENTIZATION-HANDOFF.md](COMPONENTIZATION-HANDOFF.md) |
| [ ] | **Faltan 4 URLs de estudios** | "Selected sources" del artículo de plantar fasciitis. En el handoff venían como `<h3>Read study →</h3>` **sin `href`**, así que se cargaron como lista sin link | el artículo da 404 | [STORIES-BLOG-CMS.md](STORIES-BLOG-CMS.md) |
| [ ] | **Falta una 2ª testimonial de prenatal** | El reparto por theme es 3/3/3/3/**1**/3/4. Ese tab queda con una card sola contra tres de los otros; el handoff lo marca | [/patient-stories](https://schwabe.webflow.io/patient-stories) | [STORIES-BLOG-CMS.md](STORIES-BLOG-CMS.md) |
| [ ] | **El link externo de Pillowise** | No está en el handoff; el campo `external-link` quedó **vacío** | [/products-we-recommend](https://schwabe.webflow.io/products-we-recommend) | [UTILITY-PAGES.md](UTILITY-PAGES.md) |
| [ ] | **La sección "Recovery tools" de Products** | No se construyó: el handoff la marca *"DESIGN PLACEHOLDER ONLY — do not publish until Dr. Schwabe confirms"* | [/products-we-recommend](https://schwabe.webflow.io/products-we-recommend) | [UTILITY-PAGES.md](UTILITY-PAGES.md) |
| [ ] | **Los chips de categoría de Products están ocultos** | Se muestran a partir de 2 productos. Hoy hay **1** (Pillowise) | [/products-we-recommend](https://schwabe.webflow.io/products-we-recommend) | [UTILITY-PAGES.md](UTILITY-PAGES.md) |

---

## 🎬 El video de New Patients

| ✓ | Qué falta | Qué no matchea | Prod | Doc |
| --- | --- | --- | --- | --- |
| [ ] | **🔴 No hay archivo de video** | El HTML publicado tiene `<source data-src="" type="video/mp4">` — **vacío**. Hoy es la foto del edificio con un botón de play que no reproduce nada. El prop `Source` del `Inline Video` quedó sin setear | [/new-patients](https://schwabe.webflow.io/new-patients) | [UTILITY-PAGES.md](UTILITY-PAGES.md) |
| [ ] | **El botón de play no se parece al Figma** | Figma (`711:7168`, *The space*): disco **~100px centrado**, Olive Green, glifo claro. Construido: **32×32 blanco en la esquina inferior derecha** (variant `Bottom Right`). El prop `Position` de MAST sólo ofrece las 4 esquinas — **no tiene Center**, hay que crear el variant | [/new-patients](https://schwabe.webflow.io/new-patients) | — |
| [ ] | **El botón mide 32px — abajo del mínimo de tap target** | 32×32 contra los **44×44** que fija `RESPONSIVE.md`. Se resuelve solo si se aplica el disco de 100px del Figma | [/new-patients](https://schwabe.webflow.io/new-patients) | [RESPONSIVE.md](RESPONSIVE.md) |
| [ ] | **El radio del video no matchea su marco** | `.orientation_video` tiene radio **24px** y el `.inline-video_video` de adentro **8px** | [/new-patients](https://schwabe.webflow.io/new-patients) | — |
| [ ] | **Sin decidir: qué hace el botón mientras reproduce** | El Figma sólo dibuja el estado con póster. Un disco de 100px centrado encima del video corriendo tapa la imagen. Las opciones son que se quede mostrando pause, o que se desvanezca y vuelva en hover | [/new-patients](https://schwabe.webflow.io/new-patients) | — |

## 🖼️ Imágenes y assets

| ✓ | Qué falta | Qué no matchea | Prod | Doc |
| --- | --- | --- | --- | --- |
| [x] | ~~**Las 43 fotos nuevas eran PNG de hasta 2.4MB**~~ · convertidas el 2026-09-27 | `data_assets_tool > compress_assets` a **webp**, 43 de 43, 0 fallos: **71.1 MB → 10.7 MB (−85%)**. Verificado en el HTML publicado: la Home sirve `.webp` y la foto de Testimonials bajó de 508KB a **104KB**. ⚠️ **Es irreversible** — el PNG original no queda en Webflow. Los originales están en el Drive del fotógrafo | 14 páginas | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [x] | ~~**`.plan_media` es un placeholder**~~ · resuelto el 2026-09-27 | La foto definitiva ya está puesta y publicada | [Home `#plan`](https://schwabe.webflow.io/#plan) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |
| [ ] | **2 placeholders en las utility (eran 6)** | ✅ Resueltos: hero de Contact, el mapa, la foto de Pillowise, el hero de Products y la banda de cultura de Join. **Quedan**: la foto del `Feature Card` de Products y el póster del video de New Patients | [/products-we-recommend](https://schwabe.webflow.io/products-we-recommend) | [UTILITY-PAGES.md](UTILITY-PAGES.md) |
| [x] | ~~`colorado-shockwave-key-visual.png` pesa 1.6MB~~ · resuelto el 2026-09-27 | Lo reemplazó la foto real del tratamiento. Ese asset ya **no se sirve en la Home** | [Home](https://schwabe.webflow.io/) | [FIGMA-AUDIT.md](FIGMA-AUDIT.md) |

---

## 🧱 Deuda técnica

Nada de esto rompe nada hoy. Ordenado por relación impacto/riesgo.

### Naming y componetización — pasos 4 a 7

| ✓ | Qué falta | Qué no matchea | Prod | Doc |
| --- | --- | --- | --- | --- |
| [ ] | **Paso 4 — `u-pad-*` / `u-bg-*`** | Las 11 utilidades **existen y están verificadas, pero no aplicadas a ninguna section**. Retiran ~55 combos `cc-`. Se difirió a propósito: ~20 combos no tienen override en `medium` y se quedan con **148px de padding vertical en un teléfono**, el triple que sus hermanas | todas | [COMPONENTS-NAMING.md](COMPONENTS-NAMING.md) |
| [ ] | **Paso 5 — `u-grid-2/3/4`** | 34 clases `_grid` para 6 grillas distintas; **18 son la misma de dos columnas escrita 18 veces**. Hace imposible el bug de "la grilla que nunca colapsa" | todas | [COMPONENTS-NAMING.md](COMPONENTS-NAMING.md) |
| [ ] | **Paso 6 — renames por rol** | `media_scrim`, `media_bg`, `rating_stars`, `section_head`. Más `includes_head`, `doctor_heading` y `hero_actions`, que **hoy se usan fuera de la section que les da nombre** | — | [COMPONENTS-NAMING.md](COMPONENTS-NAMING.md) |
| [ ] | **Paso 7 — `Section / FAQ Preview` con slot** | Las respuestas viven dentro del slot del `Accordion` y **no tienen `id` propio**, así que no se pueden bindear. Convertir tal cual daría preguntas editables y respuestas no. **Probar primero** que `move_element` acepte un slot como destino | [/new-patients](https://schwabe.webflow.io/new-patients) | [COMPONENTIZATION-HANDOFF.md](COMPONENTIZATION-HANDOFF.md) |
| [ ] | **Dos renames a combo a medias** | `shockwave_mark-alt` → `shockwave_mark` + `cc-alt`, y `bio_visual-sticky` → `bio_visual` + `cc-sticky`. Exigen re-estilar, no sólo renombrar | — | [COMPONENTS-NAMING.md](COMPONENTS-NAMING.md) |
| [ ] | **Renombrar `inquiry_*` → `form_*`** | 9 clases que **los dos formularios comparten**, así que el prefijo tiene que nombrar el rol y no la página donde nacieron. No cambia ninguna propiedad | — | [UTILITY-PAGES.md](UTILITY-PAGES.md) |
| [ ] | **`#plan` no es componente** | Es markup suelto en la Home, así que **no se edita desde Build Mode**. Los títulos son `h2`/`h3`/`p` crudos en vez de instancias de `Heading` | [Home `#plan`](https://schwabe.webflow.io/#plan) | [components/plan.md](components/plan.md) |
| [ ] | ~~`modal_close-button`~~ **bloqueado** | `modal.min.js` de MAST **hardcodea la clase**: `dialog button.modal_close-button`. Renombrarla rompe el cerrar del modal. Se desbloquea poniendo `data-modal="close"` primero. No vale la pena | — | [COMPONENTS-NAMING.md](COMPONENTS-NAMING.md) |

### La Home contra el Figma

| ✓ | Qué falta | Qué no matchea | Prod | Doc |
| --- | --- | --- | --- | --- |
| [x] | ~~**Item 2 — el fondo del Statement**~~ · verificado el 2026-09-27 | La textura **ya está aplicada**: prod sirve `statement-texture.png` (`6ab12a7e…`) dentro de `#you-need-answers` | [Home](https://schwabe.webflow.io/) | [HOME-FIGMA-SYNC.md](HOME-FIGMA-SYNC.md) |
| [ ] | **Item 1, la otra mitad — partir las cards** | El Figma parte cada card de síntoma en **título (32px) + cuerpo (18px)**; hoy llevan una sola frase. Son 6 props nuevas y un `Plain Text` más por card, **×2 porque la marquesina duplica el track** | [Home](https://schwabe.webflow.io/) | [HOME-FIGMA-SYNC.md](HOME-FIGMA-SYNC.md) |

### Espaciado — el bottom-margin de tipografía

| ✓ | Qué falta | Qué no matchea | Prod | Doc |
| --- | --- | --- | --- | --- |
| [x] | **El H1 del `Section / CTA Banner`** | 4 de las 9 instancias pisaban el default `u-mb-0` del prop `Title Class` con `cc-cta-sm` y perdían el `u-mb-0`. Corregido el 2026-09-23 en Blog, Sports Injuries, Patient Stories y Fees. Las otras 5 ya tomaban el default | 9 páginas | [RESPONSIVE.md](RESPONSIVE.md) |
| [x] | ~~**39 textos con el margen del token encima del gap**~~ · **37 aplicados** el 2026-09-23 | Medido en las 16 páginas descontando la compensación de MAST. Cerrados: CTA Banner (4 overrides), Join Our Team (6), Home (13), Wellness (2), Patient Stories (2), Blog (1), Contact (1), Products (1), Sports Injuries (1), Fees (1), `Card / Membership Plan` (1 escritura = 2 casos en 2 páginas). **Falta verlo publicado** | 12 páginas | [RESPONSIVE.md](RESPONSIVE.md) |
| [ ] | **1 eyebrow sin localizar: `includes_head` en Wellness** | Medido con 24px sobre un gap de 24. **No aparece** ni como instancia de `Eyebrow` ni como elemento con clase `eyebrow` dentro de `Section / Membership Includes`, `Membership Fit`, `Wellness Intro` ni `Wellness Recognition`. Hay que ubicarlo en el Designer | [/wellness-membership](https://schwabe.webflow.io/wellness-membership) | [RESPONSIVE.md](RESPONSIVE.md) |
| [ ] | **El H1 del hero es el caso inverso: le FALTA margen** | Pedía `margin-bottom: 2.5rem` por el prop `Style`, que es inerte, así que quedó con los **12px del token** — 28px menos que el diseño. **Ninguna utilidad `u-mb-*` da 2.5rem sobre un H1**: los tokens son `em` (xs .5 / sm 1 / md 2 / lg 3), o sea 30px y 60px sobre ese font-size. Hace falta decidir contra el Figma del hero | [Home](https://schwabe.webflow.io/) | [RESPONSIVE.md](RESPONSIVE.md) |
| [ ] | **🔴 El prop `Style` de MAST no emite nada — barrer todos sus usos** | Medido el 2026-09-23: la Home tiene **2 atributos `style`** en su HTML y **ninguno** viene del prop `Style`. Todo lo escrito ahí es inerte — los `margin-bottom: 0` de Statement / Doctor / Differentiators / Testimonials, los `margin-bottom: 1rem` de las 6 cards de What Makes This Different, y sus `max-width`. **Es la causa raíz de las inconsistencias.** Falta barrer el sitio entero por usos de `Style`, no sólo los de margen | todas | [RESPONSIVE.md](RESPONSIVE.md) |
| [ ] | **Re-medir después de publicar** | El barrido corrió contra staging, que es **anterior** a los cambios del Designer del 2026-09-21. Ya apareció un caso mixto: en el CTA Banner 5 instancias estaban bien en el Designer y mal en el HTML servido. Los 31 restantes pueden incluir falsos positivos por la misma razón | todas | [RESPONSIVE.md](RESPONSIVE.md) |

### Tipografía — la itálica de las citas

| ✓ | Qué falta | Qué no matchea | Prod | Doc |
| --- | --- | --- | --- | --- |
| [x] | ~~**33 citas salían en redonda**~~ · aplicado el 2026-09-23 | Las variantes `Quote` y `Quote Small` de `Plain Text` **no declaran `font-style`** — en las 243KB del CSS publicado hay **2** reglas con `font-style: italic` y una es `dfn`. Medido: 51 usos con `u-italic` y **45 sin**. Cerrados los 33 que el Figma dibuja en itálica (`990:1302` 32px, `990:1507` 24px Medium Italic) con **10 escrituras**. **Verificado post-publish el 2026-09-23**: 76 de 96 con `u-italic` (antes 51), y las 20 restantes son las que no son citas | [/patient-stories](https://schwabe.webflow.io/patient-stories) · [Home](https://schwabe.webflow.io/) | [RESPONSIVE.md](RESPONSIVE.md) |
| [x] | ~~**La cara itálica de EB Garamond no estaba cargada**~~ · resuelto el 2026-09-23 | Pablo subió **EBGaramond-MediumItalic (500)** y **SemiBoldItalic (600)** como fuentes propias con la familia `EB Garamond`. Verificado en el CSS publicado (`bb06117da`): los dos `@font-face` con `font-style: italic` y `font-display: swap`. Por eso el loader de Google sigue diciendo `500,600` — la itálica ya no sale de Google | todas | [RESPONSIVE.md](RESPONSIVE.md) |
| [ ] | **🔴 Los dos .ttf de itálica pesan 865KB entre los dos** | 433KB + 432KB, **TTF sin subsetear**. El equivalente woff2 en subset latino ronda **30-40KB cada uno** — o sea ~20x. El handoff pide Lighthouse mobile ≥90 y hay itálica en casi todas las páginas. **La salida barata es no subir nada**: Webflow ofrece `500 Italic` y `600 Italic` de EB Garamond en el panel de Google Fonts, ya en woff2 y subseteadas. Tildarlas y **borrar las dos subidas** (si conviven, quedan `@font-face` duplicados) | todas | [RESPONSIVE.md](RESPONSIVE.md) |
| [ ] | **Falta la itálica de DM Sans 400** | 3 textos de Community Partners con `u-italic` son `Paragraph LG`, que resuelve al font primario. Siguen con itálica falsa: el CSS publicado tiene **2** `@font-face` y los dos son EB Garamond | [/about/community-partners](https://schwabe.webflow.io/about/community-partners) | [RESPONSIVE.md](RESPONSIVE.md) |
| [ ] | **20 textos que no son citas usan la variante `Quote`** | Las 12 condiciones de Sports Injuries, los 4 medios de pago de Fees y 4 ledes de Care Hub / Products / Patient Stories corren con `Quote` / `Quote Small` sólo para tomar el tamaño de H5/H6. **Por eso la itálica no se pudo poner en la variante.** Hace falta una variante `Lead` y otra de item de lista | [/care/sports-activity-overuse-injuries](https://schwabe.webflow.io/care/sports-activity-overuse-injuries) · [/fees-and-policies](https://schwabe.webflow.io/fees-and-policies) | [RESPONSIVE.md](RESPONSIVE.md) |
| [ ] | **El subtítulo en itálica del CTA Banner sólo existe en 2 de 7 páginas** | El Figma (`974:2344`) dibuja un subtítulo en itálica de 32px bajo el H1. Medido: sólo Home y Blog lo tienen; en Community Partners, Our Story, Sports Injuries, New Patients y Patient Stories el prop `Subtitle` está **vacío**. No es un problema de itálica — falta el copy | 5 páginas | [HOME-FIGMA-SYNC.md](HOME-FIGMA-SYNC.md) |

### Patient Stories — ronda contra Figma `1154:14667` + comentarios de Derek (2026-09-24)

**El Figma es anterior a los comentarios de Derek**: todavía dibuja la foto de la
historia destacada, que él pide sacar. Donde chocan, manda el comentario.

| ✓ | Qué falta | Qué no matchea | Prod | Doc |
| --- | --- | --- | --- | --- |
| [x] | ~~El H2 de la intro rompía con huérfano~~ | `"The details are different. The pattern" / "is familiar."` contra el `"The details are different." / "The pattern is familiar."` del Figma. **El ancho del Figma (680) no arregla nada** — la ventana real medida es 437–521px. `u-mw-32` (504px) aplicado | [/patient-stories](https://schwabe.webflow.io/patient-stories) | [RESPONSIVE.md](RESPONSIVE.md) |
| [x] | ~~*"Patients feel heard…"* en redonda~~ | Ya era EB Garamond por la variante `Quote`; faltaba el `font-style`. `u-italic` aplicado | ″ | [RESPONSIVE.md](RESPONSIVE.md) |
| [x] | ~~Estrellas blancas sobre beige~~ | SVG con fill `#FBFAF8` sobre `.cc-google-reviews` (Beige Muted). El Figma `1154:15228` las quiere Olive `#6B744E`. Asset nuevo `stars-olive.svg` (`6ab53abe8293ad9eef669eed`), repunteado **sólo** ahí — en el hero de la Home el blanco es correcto | ″ | [RESPONSIVE.md](RESPONSIVE.md) |
| [x] | ~~**Derek**: sacar la foto de montaña de *"One good experience"*~~ | `.stories-bg` eliminado, `.section.cc-relationship` → `background-color: Brand/Ink`. El texto ya era beige | ″ | [RESPONSIVE.md](RESPONSIVE.md) |
| [x] | ~~**Derek**: etiqueta del botón de la banda Shockwave~~ | → **"See more patient stories"** | ″ | [RESPONSIVE.md](RESPONSIVE.md) |
| [ ] | **El botón dice "patient stories" y linkea afuera** | Quedó apuntando a `coloradoshockwave.com`. Con la etiqueta vieja el destino externo se entendía; con la nueva promete una cosa y hace otra. Derek pidió sólo la etiqueta — **el link necesita su decisión** | ″ | [RESPONSIVE.md](RESPONSIVE.md) |
| [ ] | **🔴 Derek: la historia destacada va sin foto y a una sola columna** | *"No photo in this section. It's Sarah's own account and a portrait of anyone else would undercut it. Run it as a single narrative column, with the pull quotes doing the visual work. Keep the dark green quote card and make it larger and more prominent, anchoring the section where the image was."* Es reestructurar `cc-featured-story` | ″ | — |
| [ ] | **🔴 Derek: condensar de 6 citas a 2-3 con narrativa más larga** | *"the block currently alternates narrative and quote around six times. Please condense to two or three quotes with longer narrative between them."* **Es reescribir el `story-body` de Sarah**, que el handoff marca *"constructed from consented source quotes. Kati to review final framing before publishing"*. No es copy que se pueda inventar — hace falta el texto de Derek o el OK de Kati | ″ | [STORIES-BLOG-CMS.md](STORIES-BLOG-CMS.md) |
| [ ] | **Derek: la banda Shockwave con las señas visuales de las otras páginas** | *"Use the same Colorado Shockwave visual cues as we have settled on for other pages, but keep the section structure used elsewhere on this page rather than the compact card. No image."* Hoy tiene foto de fondo y no lleva el lockup marca + eyebrow que sí usan Home y Care | ″ | [COMPONENTS-NAMING.md](COMPONENTS-NAMING.md) |
| [ ] | **Derek: entrada suave al scrollear** · variante construida el 2026-09-25 | *"On scroll into view, the signage image fades in 0-100% slowly, then the closing line fades in shortly after it settles. Subtle, no movement, no parallax. Image 500ms, closing line ~200ms after. Respect prefers-reduced-motion. Nothing hidden by default."* **Doble bloqueo**: la foto todavía no es la de cartelería (*"Image will change to signage"*), ~~y la variante `fade` de `reveal.js` no está construida~~. **`fade` ya existe** y está aplicada: `Section / Photo Band` (fade, reemplaza al parallax en sus 5 instancias) y `Section / Stories Outro` (fade + `data-anim-delay="0.2"`). **Queda**: la foto de cartelería, y build + push + bump del CDN | ″ | [components/reveal.md](components/reveal.md) |

| [x] | ~~**El hover borraba el botón sobre banda oscura**~~ · corregido el 2026-09-24 | Medido con hover real por CDP: el lavado del Secondary reemplazaba el relleno beige de `.cc-on-dark` por un tinte del 12% sobre transparente y llevaba el texto a Ink — **1.15:1** sobre Slate Ink. Arreglado con `:not(.cc-on-dark)` en `src/styles/button.css`, dejando correr el hover que el Designer ya define. Son 4 botones: Blog, FAQ, Fees, Patient Stories. **Falta build + push + bump del CDN** | 4 páginas | [animations/BUTTON-HOVER.md](animations/BUTTON-HOVER.md) |
| [x] | ~~**Faltaba un chip "todos" en los filtros de Patient Stories**~~ | El diseño viejo no tenía chip de todos, así que arrancaba en *Feeling heard* y no había forma de ver las 13 citas juntas. El Figma nuevo `1154:15157` sí lo trae (*"View all"*, primero de la lista). Agregado con `data-filter="*"` — `filter.js` ya soportaba el comodín, verificado en el chunk publicado | [/patient-stories](https://schwabe.webflow.io/patient-stories) | [components/filter.md](components/filter.md) |
| [ ] | **El layout de los filtros cambió entero en el Figma** | `1154:15157` los pasa de **chips horizontales arriba de una grilla** a **lista vertical en una columna de 430px a la izquierda**, con las citas en una columna de 650px a la derecha y el título del theme encima. Hoy está construido con el layout viejo. Es reestructurar `#themes` | ″ | [RESPONSIVE.md](RESPONSIVE.md) |
| [x] | ~~**La colección `Products` tenía un solo item**~~ · pasada a estático el 2026-09-25 | La card de Pillowise se **reconstruyó** —un elemento no se puede mover fuera de un Collection List, el MCP lo rechaza— con las 6 instancias de MAST y el copy horneado, y se borró el `DynamoWrapper`. Verificado: **0 Collection Lists** en la página | [/products-we-recommend](https://schwabe.webflow.io/products-we-recommend) | [UTILITY-PAGES.md](UTILITY-PAGES.md) |
| [ ] | **Borrar la colección `Products` y su template** | Quedan huérfanos: el contenido ahora vive en el markup. **Es irreversible por API**, así que necesita confirmación explícita. El template ya está en draft y no publica | — | [UTILITY-PAGES.md](UTILITY-PAGES.md) |
| [ ] | **`Section / Product List` ya se puede componetizar** | Era una de las 7 bloqueadas por Collection List; sin la lista, el bloqueo desapareció. Bajan a **6** | ″ | [COMPONENTIZATION-HANDOFF.md](COMPONENTIZATION-HANDOFF.md) |

### La Home y Community Partners contra el Figma

| ✓ | Qué falta | Qué no matchea | Prod | Doc |
| --- | --- | --- | --- | --- |
| [x] | ~~**La cita de "Rooted in Platt Park" perdió el blockquote**~~ | Clase **`rooted_quote`** creada y aplicada el 2026-09-23: filete izquierdo de 2px con el token Divider On Dark, sangría 1.5rem, 1.25rem de aire arriba y abajo. **Falta verlo publicado** | [/about/community-partners](https://schwabe.webflow.io/about/community-partners) | [COMPONENTS-NAMING.md](COMPONENTS-NAMING.md) |
| [ ] | **Las dos columnas de `rooted_grid` son ~27px más anchas** | Figma **580 / 540** dentro de un container de **1200** (padding lateral 120). Construido **607 / 565** en 1252. El gap de 80 y el padding-top de 240 sí coinciden. Consecuencia visible: el H2 rompe en **2 líneas contra las 3 del Figma**, y *"That is how good neighborhood practices grow"* en **1 línea contra 2** | [/about/community-partners](https://schwabe.webflow.io/about/community-partners) | [RESPONSIVE.md](RESPONSIVE.md) |
| [x] | ~~**El `min-height: 46rem` del CTA Banner deja hasta 282px de agujero**~~ · bajado a **32.5rem** el 2026-09-23 | El Figma dibuja **736px** y el sitio tiene 736 — **no está mal contra el Figma**. El problema es que es fijo para 7 páginas con copy de largo muy distinto: medido, el contenido va de **454px (New Patients) a 638px (Our Story)**, así que sobran **282 / 248 / 248 / 188 / 135 / 127 / 98px**. Fees ya usa el variant `Compact` (32.5rem). Decisión: bajar el base o aplicar `Compact` donde el copy es corto | 7 páginas | [RESPONSIVE.md](RESPONSIVE.md) |

### Reportado y no reproducido

| ✓ | Qué falta | Qué no matchea | Prod | Doc |
| --- | --- | --- | --- | --- |
| [x] | ~~**"En FAQ el accordion se abre y se cierra"**~~ | Era el **doble click**: `.accordion-trigger` tenía `user-select: auto`, así que seleccionaba la palabra y disparaba dos toggles. `user-select: none` aplicado en el Designer, y en `job-card.css` y `plan.css` para los otros dos triggers. **Falta verificar en Safari** — el prefijo `-webkit-` lo rechaza el MCP y lo agrega Webflow al publicar | [/faq](https://schwabe.webflow.io/faq) | [animations/ACCORDION-OPEN.md](animations/ACCORDION-OPEN.md) |

### Responsive — backlog medido

| ✓ | Qué falta | Qué no matchea | Prod | Doc |
| --- | --- | --- | --- | --- |
| [ ] | **Tap targets abajo de 44×44** | Input `#email` **23px** de alto, burger **40×43**, CTA del nav (`u-link-cover`) **146×36**, `.nav-link` **42px**, `footer-link` **82×18** | todas | [RESPONSIVE.md](RESPONSIVE.md) |
| [ ] | **Tipografía abajo de 14px** | `.eyebrow` cae a **13.6px a 768** (el token es fluido) y los headings del footer están en **12px** | todas | [RESPONSIVE.md](RESPONSIVE.md) |
| [ ] | **El nav se come 18% del viewport acostado** | A 844×390 el nav sticky mide **70px = 18%**, arriba del techo del 15% | todas | [RESPONSIVE.md](RESPONSIVE.md) |
| [ ] | **9 pares de padding distintos a 1024** | iPad landscape usa los estilos de desktop: 148/148, 119/119, 68/200, 148/96, 24/0. En mobile el ritmo sí es consistente (50/50 en 7 de 12). Lo resuelve el paso 4 | todas | [RESPONSIVE.md](RESPONSIVE.md) |
| [ ] | **El burger no está en el árbol de a11y** | Es un `div.w-nav-button` **sin `role` ni `aria-expanded`**, así que un lector de pantalla no llega al menú mobile. `take_snapshot` tampoco lo lista | todas | [RESPONSIVE.md](RESPONSIVE.md) |

### Animación y CSS

| ✓ | Qué falta | Qué no matchea | Prod | Doc |
| --- | --- | --- | --- | --- |
| [ ] | **El submit del form no tiene `data-btn`** | Es un `<input type="submit" class="button w-button">` nativo de Webflow, no una instancia del `Button`, así que **conserva el hover accent-dark de MAST** y queda inconsistente con los otros 34 | [/contact](https://schwabe.webflow.io/contact) | [animations/BUTTON-HOVER.md](animations/BUTTON-HOVER.md) |
| [ ] | **Mirar el hover de `.button.cc-slider-nav`** | Las flechas del slider **sí** tienen `data-btn`, así que se invierten como cualquier botón — y son chicas y sin texto. Hay que ver cómo queda | [Home](https://schwabe.webflow.io/) | [animations/BUTTON-HOVER.md](animations/BUTTON-HOVER.md) |
| [ ] | **Borrar `animations/SCROLL-BATCH.md`** | Es una orden de trabajo **ya ejecutada**; lo durable se mudó a `components/reveal.md` y `components/plan.md`. Se borra cuando el sitio publique y `/responsive` vuelva limpio | — | [animations/SCROLL-BATCH.md](animations/SCROLL-BATCH.md) |

### Verificación que no se hizo

| ✓ | Qué falta | Qué no matchea | Prod | Doc |
| --- | --- | --- | --- | --- |
| [ ] | **`filter.js` nunca corrió en un navegador** | El bundle ya está publicado (`@216bb5a` lo incluye), pero **nadie vio los chips filtrar**. Sin JS se ven todas las cards, que es la degradación correcta | [/blog](https://schwabe.webflow.io/blog) · [/patient-stories](https://schwabe.webflow.io/patient-stories) | [components/filter.md](components/filter.md) |
| [ ] | **`toc.js` nunca corrió en un navegador** | Las legales se publicaron después del bundle. **El template de artículo ya responde 200** (verificado el 2026-09-27), así que ahora son 5 páginas donde tiene que correr, no 2 | [/privacy-policy](https://schwabe.webflow.io/privacy-policy) · [/terms-of-use](https://schwabe.webflow.io/terms-of-use) | [components/toc.md](components/toc.md) |
| [ ] | **Las 5 utility no se vieron renderizadas** | Se leyeron de vuelta del API, **no se midieron en un navegador** | [/contact](https://schwabe.webflow.io/contact) · [/join-our-team](https://schwabe.webflow.io/join-our-team) | [UTILITY-PAGES.md](UTILITY-PAGES.md) |
| [ ] | **Los 3 pins de la Home, en el sitio real** | Medidos contra una copia local con las ediciones reproducidas por script, **nunca contra el sitio publicado**: `statement` 1900→2260, `plan` 4637→6077, `cost` 10764→13689 | [Home](https://schwabe.webflow.io/) | [components/plan.md](components/plan.md) |

---

## ✅ Cerrado

Se poda cuando pasa de ~15 items. Para el historial completo está git.

| ✓ | Qué se cerró | Cuándo |
| --- | --- | --- |
| [x] | **Tanda de paridad Figma ↔ prod**: Four Things (domo + check + 3 segmentos), Photo Band 3/2, los 10 deltas de Join Our Team, Our Team `#growing-team` como CTA Banner Split, y Care Hub `#approach` · `#first-visit` · `#csw-bridge` · `#final-cta` (orden). Publicado y medido; 19 filas marcadas `[x]` arriba | 2026-09-29 |
| [x] | **Las 3 páginas de artículo ya responden 200** — el `shouldPublish: false` del `Article Template` se destrabó. Verificado curleando las tres. Es la primera vez que `/blog/<slug>`, el byline y `toc.js` son auditables | 2026-09-27 |
| [x] | **Mapa Figma ↔ prod reconciliado** — canvas `1237:9927` "Final review", 18 frames de página contra 21 vistas vivas. **Cobertura completa, no falta ninguna.** Más 14 frames alternativos identificados como decisiones pendientes | 2026-09-27 |
| [x] | **El espaciado del rich text estaba al revés** — `.rich-text h1..h4` tenía `margin-top: 1em` y **ningún `margin-bottom`**, así que caía al token de 9.6px: ~44px arriba del título y ~10px abajo. Puesto `margin-bottom: 0.5em` en h2/h3/h4 | 2026-09-25 |
| [x] | **El TOC tardaba porque `main.js` serializaba la cascada** — `await import(global.js)` antes de los componentes daba 3 round-trips en fila. Ahora `global.js` y los componentes van **en paralelo**. Medido: 23+27+26ms encadenados con el edge caliente; en uno frío eran segundos | 2026-09-25 |
| [x] | **El disclaimer salió del template de artículo** — medido en el handoff: esa frase está **sólo en `blog.html`** y 0 veces en los 3 artículos, y el Figma tampoco la dibuja | 2026-09-25 |
| [x] | **"Share this post" construida** — componente nuevo `share.js`: copiar link + LinkedIn + X + Facebook. Botones de 44px contra los 34 del Figma, por el mínimo de tap target | 2026-09-25 |
| [x] | **El newsletter del Figma se resolvió reusando `Section / Free Guide`** — el bloque del Figma está en lorem y el handoff no lo pide; el Free Guide ya tiene esa forma exacta con copy real | 2026-09-25 |
| [x] | **El footer se reconstruyó entero contra el Figma `1183:572`** — 4 columnas (22 links), banda de marca con logotipo + lockup de Colorado Shockwave + 4 píldoras sociales, y la línea legal con la razón social completa. Reemplaza al footer del starter de MAST en **las 30 páginas**. Cierra de paso el pendiente de que el footer no linkeaba a `/blog`, `/products-we-recommend`, `/join-our-team`, `/privacy-policy` ni `/terms-of-use` | 2026-09-25 |
| [x] | **Los iconos del footer salen de Phosphor, no de assets** — el sitio ya carga `@phosphor-icons/web@2.1.1`, así que los 7 iconos son `<span class="ph ph-*">` y no hay un SVG que subir ni recolorear | 2026-09-25 |
| [x] | **Lockup horizontal de Colorado Shockwave subido** — `colorado-shockwave-lockup-on-forest.png` (`6ab67c67b45e2cd250ef3c05`). El que había era sólo el símbolo teal | 2026-09-25 |
| [x] | **Blog post + legales: cuerpo a la izquierda, TOC a la derecha** — `.article_grid` y `.legal_grid` a `1fr 17.5rem`; el índice se mueve con `grid-column`, no reordenando el DOM, para que en mobile siga cayendo **antes** del cuerpo. El FAQ queda a la izquierda, confirmado por Derek y Olha | 2026-09-25 |
| [x] | **La variante `fade` de `reveal.js`** — la única del sitio **sin CSS anti-FOUC**, a pedido explícito de Derek (*"nothing should be hidden by default"*). Oculta sólo lo que está abajo del fold al init, así que no parpadea lo que ya se está mirando | 2026-09-25 |
| [x] | **El parallax del Photo Band se reemplazó por el fade** en la definición — 5 instancias. Verificado antes de escribir que `.media-band_img` cae a `inset: 0; height: 100%` y llena el marco **sin costura** | 2026-09-25 |
| [x] | **El retrato del byline del artículo** — el Figma nuevo lo saca; `.article-meta` se movió adentro de `.article-byline`, que pasó a una línea con `baseline` y 4rem de gap | 2026-09-25 |
| [x] | **`npm run build` + commit + push** — `d8553d2` pusheado, `dist/` al día. Verificado: el chunk local tiene `data-plan-body`, el publicado no | 2026-09-22 |
| [x] | **La regla vertical de `#plan` cruzaba los numerales 2 y 3** — el dim se movió de `[data-plan-step]` a `[data-plan-body]`: el disco es una máscara y al 40% deja de enmascarar | 2026-09-22 |
| [x] | **El slider de Testimonials** — paginación eliminada, flechas a círculo con contorno de 44px. Cierra de paso el tap target de los bullets 16×16 | 2026-09-22 |
| [x] | **La card de Colorado Shockwave** — contorno + marca + botón | 2026-09-22 |
| [x] | **`cc-hero-wide` apuntaba al gutter** en vez del ancho máximo y dejaba el hero en 23px de ancho en todo mobile | 2026-09-21 |
| [x] | **Las 4 grillas que nunca colapsaban** (`rooted`, `orientation`, `signpost`, `partners`) | 2026-09-21 |
| [x] | **Los 31 `div` → `section`** y **22 de los 24 renames** | 2026-09-21 |
| [x] | **38 sections componetizadas** — 93% de lo convertible | 2026-09-21 |
| [x] | **El padding de las cards vivía en `small`** y el teléfono acostado es Tablet: la rampa quedó `desktop → 2rem (≤991) → 1.5rem (≤767)` | 2026-09-21 |
