# Responsive — el contrato

Los hechos durables de cómo se comporta este sitio abajo de 992px. El proceso
para verificarlo es la skill `/responsive`; acá viven las decisiones y el
backlog.

## Los breakpoints de Webflow vs. los dispositivos reales

| Breakpoint | Rango | Qué cae ahí de verdad |
| --- | --- | --- |
| 2XL / XL / Large | 1920 / 1440 / 1280 | Desktop grande |
| Base (Desktop) | ≥992 | Desktop, **y el iPad en landscape (1024)** |
| Tablet | 768–991 | iPad portrait (768), **y todo teléfono acostado (844–932)** |
| Mobile landscape | 480–767 | Teléfonos viejos y ventanas angostas. **Ningún teléfono moderno** |
| Mobile portrait | <480 | Teléfonos parados: 320 / 360 / 390 / 393 / 430 |

Los nombres de Webflow son de 2013 y engañan. Las dos que importan:

- **Un teléfono en landscape usa los estilos de Tablet**, no de "Mobile
  landscape".
- **Un iPad en landscape usa los estilos de desktop.** Si algo se ve mal ahí,
  el arreglo va en la base o en 1280.

## La cascada

Los estilos bajan: lo que se toca en Tablet le llega también a Mobile
landscape y Mobile portrait. Hacia arriba no sube.

Por eso se arregla **de arriba hacia abajo** y se re-verifica hacia abajo
después de cada cambio. Un valor que tiene que ser igual en todos los
breakpoints va en la base, nunca repetido por breakpoint — eso deja
"orphaned breakpoint-only styles" que después nadie sabe si se pueden borrar.

## Reglas que no se negocian

- **Cero scroll horizontal**, en los seis perfiles.
- **Un solo padding lateral** en toda la página. Si una card necesita menos
  aire, se le saca el padding lateral a la card en mobile y lo hace el de la
  section — no se suman los dos.
- **Tap targets 44×44** mínimo.
- **Inputs con `font-size` ≥16px.** Abajo de eso iOS zoomea al enfocar y el
  visitante no sale del zoom. No es estético, es una trampa.
- **Nada de `100vh`.** `100dvh` o medición en JS: la barra de direcciones de
  iOS cambia `vh` al scrollear.
- **Una section pineada exige alto, no sólo ancho.** La condición es
  `(min-width: 768px) and (min-height: 600px)`, nunca sólo el ancho. Un
  teléfono acostado (844×390) cae en el breakpoint **Tablet** de Webflow y
  pasaría un `min-width: 768px`, pero 390px de alto no alcanzan para pinear
  nada: el nav sticky ya se come 70px y queda menos de un tercio de pantalla
  para el contenido. Introducido el 2026-09-14 con `statement` y `cost`.
- **El parallax se apaga por POINTER, no por ancho.** La condición es
  `(hover: hover) and (pointer: fine)`, nunca `max-width`. La razón por la que
  el parallax no corre en el celular es que en touch pelea con el scroll del
  sistema — y un **teléfono acostado mide 844px de ancho**, así que pasa
  limpio cualquier gate de `max-width: 767px`. Medido el 2026-09-15 a 844×390
  con el gate por ancho: **tres triggers en vez de dos**. El gate por pointer
  además deja afuera al iPad landscape (1024, touch), que es lo correcto por
  la misma razón. Introducido con `reveal`.
- **Nada adentro de un widget de Webflow se posiciona con `transform`.** Un
  `w-nav`, un slider o unos tabs animan escribiendo `transform` inline en sus
  propios nodos, y al cerrar lo resetean a `translate(0,0)`. Inline le gana a
  cualquier stylesheet, así que un centrado por `translateX(-50%)` sobrevive
  hasta el primer ciclo y después desaparece. Se posiciona con `left` / `right`
  / `inset`, y si el bloque contenedor estorba, se cambia el bloque contenedor.
  Introducido el 2026-09-15 con el menú mobile.
- **Una section pineada cuyo grid colapsa necesita el gate en 992, no en
  768.** La regla de arriba (`min-width: 768px and min-height: 600px`) es el
  piso, no la respuesta. Si el layout de la section cambia en `medium` —dos
  columnas que pasan a una— el stage crece por apilamiento y deja de entrar
  en el viewport: medido en `#plan`, de ~492px a ~978px. El gate se pone
  donde el layout deja de cambiar, y eso se mide por section.
- **Nada abajo de 14px** de tipografía.
- **Todo hover scopeado** a `(hover: hover) and (pointer: fine)`. En touch
  `:hover` queda pegado después del tap.
- **Los dos color schemes se verifican.** Los tokens de MAST son
  `light-dark()`: el mismo CSS pinta distinto según el theme del sistema, y
  desde un Mac en light mode la mitad de los bugs de color no existen.

## Qué corre y qué no en mobile

| Cosa | Mobile |
| --- | --- |
| Menú del nav | El navbar **nativo de Webflow**. `nav.js` no lo toca |
| Dropdowns de `nav.js` | No — scopeados a `min-width: 992px` con `matchMedia` |
| Estado scrolleado del nav | **Sí.** El `IntersectionObserver` no está scopeado, `[data-nav-bg]` pinta en todos los viewports |
| Hover del Button | No — `(hover: hover) and (pointer: fine)`. Queda el `:hover` de MAST |
| Parallax de `reveal.js` | **No** — gate por `(hover: hover) and (pointer: fine)`, no por ancho. Incluye el teléfono acostado y el iPad |
| `mask` y `words` de `reveal.js` | **Sí.** No son scrubeados y no cuestan por frame |
| Otros parallax / scrub | Apagados abajo de 768 por default |

## Backlog abierto

Barrido corrido el **2026-09-08** sobre `schwabe.webflow.io` con Chrome
DevTools, seis perfiles + light/dark. Todo lo de abajo está **medido**, no
supuesto.

### El sitio hereda el dark mode de MAST y no tiene diseño dark

Causa raíz de los dos primeros síntomas reportados. **Re-diagnosticado y
corregido el 2026-09-15** midiendo con Chrome por CDP: la explicación que
estaba acá antes era falsa en su parte central.

El sitio **no tiene toggle de theme**. Las 5 apariciones de
`data-theme-toggle` en el HTML publicado son todas del CSS del propio embed;
no hay ni un elemento que lo use.

**El interruptor es `theme-toggle.min.js`** de MAST (`@latest`, `<script>`
bloqueante en el head). Lee `prefers-color-scheme` y estampa `u-mode-dark` o
`u-mode-light` en `<html>`:

```js
function c(t){ e.classList.toggle("u-mode-light",t), e.classList.toggle("u-mode-dark",!t) }
let o = null!==t ? "light"===t : !n.matches   // t = localStorage.savedTheme
```

`.u-mode-dark` declara el par del polyfill de LightningCSS que emite Webflow:

```css
.u-mode-dark { --lightningcss-light: ; --lightningcss-dark: initial; color-scheme: dark; }
```

Y de ahí se propaga a todo el sitio porque **`--primary--background` y sus
hermanos están declarados en `:root`** (único bloque `:root` del CSS, línea
2073). La sustitución de `var()` ocurre donde la propiedad está declarada, así
que el token se resuelve **en `:root`** con el interruptor en dark y el valor
ya resuelto se hereda hacia abajo. Medido: `#474d33` (Brand/Ink) en `html`,
`body` y `.nav-menu`.

**Por eso no sirve declarar el interruptor en `body`** — y Webflow lo declara
ahí, en estado light. Es irrelevante: para cuando la cascada llega a `body` el
token ya es un color, no un `var()`. Esta es la trampa que hizo fallar el
diagnóstico anterior.

**Las sections no cambian** porque cada una pinta su fondo con hex literal
(`#fbfaf8`, `#eeece4`, `#474d33`, `#262f23`). **El nav es transparente** —
`.nav` background `rgba(0,0,0,0)` y `[data-nav-bg]` en `opacity: 0` arriba de
la página — así que deja ver el body. De ahí la barra verde sobre una página
beige.

**Tres hipótesis descartadas midiendo**, las tres anotadas porque son el error
natural:

1. **No es `light-dark()`.** El CSS publicado tiene cero ocurrencias.
2. **No es el `@media (prefers-color-scheme: dark)` del embed de theme.** Ahí
   las declaraciones están **sueltas al top level de un stylesheet**, sin
   regla que las contenga: CSS inválido, el browser lo descarta entero. Ese
   bloque nunca hizo nada. Neutralizarlo —el fix que recomendaba esta doc
   hasta el 2026-09-15— tampoco habría hecho nada.
3. **`color-scheme: light` no alcanza.** Se probó en vivo con `!important`:
   `colorScheme` pasa a `light` y **el token sigue en `#474d33`**. El polyfill
   no lo mira.

**El fix aplicado** vive en `src/styles/theme.css`, importado desde
`global.js`:

```css
:root:root { --lightningcss-light: initial; --lightningcss-dark: ; color-scheme: light; }
```

`:root:root` es (0,2,0) **a propósito**, contra el (0,1,0) de `.u-mode-dark`.
Con un `:root` pelado sería un empate que decide el orden de carga de los
stylesheets. Gana sin depender de ese orden.

Medido inyectándolo en vivo a 393px, en los dos schemes: `--primary--background`
→ `#fbfaf8`, `.nav-menu` beige, CTA con su borde de siempre, cero scroll
horizontal.

**No hace falta sacar `theme-toggle.min.js`** — su clase queda outrankeada. Si
algún día se quiere sacar, ojo: sin `.u-mode-*` en `<html>` el `:root` se queda
**sin interruptor**, los dos `var()` caen al fallback y `--primary--background`
resuelve a *dos* colores. O sea que el script sólo se puede sacar **con** este
archivo en su lugar, nunca antes.

**Llega al sitio recién cuando se bumpee el hash del CDN** (ver abajo). La
alternativa sin deploy es pegar la misma regla en el `HtmlEmbed` de theme de
MAST, a mano en el Designer — el MCP no edita embeds.

### El CDN está pinneado a un commit

El sitio carga `...schwabe-chiropractic@216bb5a/dist/`, no `@main` como dice
`webflow-snippet.html`.

**Corregido el 2026-09-22: el bundle SÍ está llegando, y esta doc decía lo
contrario.** Medido bajando `@216bb5a/dist/styles.css` y `main.js` del CDN:
`theme.css` (el `--lightningcss-light`), `area-card.css`, `symptom-card.css`,
`job-card.css` y el failsafe están **todos servidos**, y `main.js` registra los
7 componentes (`cost` `filter` `nav` `plan` `reveal` `statement` `toc`). O sea
que los items que varias docs listaban como *"no llega al sitio hasta bumpear el
hash"* ya están publicados: lo que falta ahí es **verificarlos en un navegador**,
no deployarlos.

Lo único que el hash pinneado se está comiendo hoy es **el commit `d8553d2`**,
que es un commit más nuevo y ya pusheado — el chunk de `plan` servido **no tiene
`data-plan-body`** (el fix del dim del 2026-09-22) y el local sí. O sea que el
pendiente real es un bump de `@216bb5a` a `@d8553d2`, no un build. **Verificado curleando el 2026-09-21** — esta doc
decía `@fc2f79a` y `HOME-FIGMA-SYNC.md` decía `@c1bd42f`; las dos estaban
viejas. **Ningún cambio a nuestro CSS o JS llega al sitio hasta
que se bumpee ese hash en Webflow.** Cualquier fix que se shippee por el bundle
tiene ese paso extra.

El hash se verifica curleando el sitio, no de memoria — esta doc lo tuvo mal
(`@ebd7d03`) hasta el 2026-09-15:

```
curl -s https://schwabe.webflow.io/ | grep -o 'schwabe-chiropractic@[^/]*'
```

### Los cinco síntomas reportados

Cuatro **arreglados y verificados** el 2026-09-08 (medidos post-publish en los
seis perfiles). El primero se arregló el **2026-09-15**, con un diagnóstico
distinto del que tenía escrito; el segundo **volvió** ese mismo día por una
causa nueva (ver la ronda de abajo).

| # | Síntoma | Causa real | Arreglo | Estado |
| --- | --- | --- | --- | --- |
| 1 | Nav verde, CTA sin contraste | Dark mode heredado — **no** el embed, sino `theme-toggle.min.js` estampando `u-mode-dark` en `<html>`, donde `:root` resuelve los tokens (arriba) | `:root:root` en `src/styles/theme.css` | ✅ medido en vivo. **Pendiente de bumpear el hash del CDN** |
| 2 | Nav abierto roto | `.nav-menu` @991 tenía `left: 0` + `width: 100vw` heredando `margin-left: auto` del base: la ecuación sobredeterminada resolvía el margen en −47px y lo corría a `left: −23`. Encima `.nav-menu_container` seguía con el centrado absoluto del base (`top: 50%` + `translate`), de ahí los ~170px de aire arriba | `.nav-menu` @medium → `left: 50%`, `right: auto`, `margin-left: 0`, `transform: translateX(-50%)`. `.nav-menu_container` @medium → `position: static`, `transform: none` | ⚠️ resolvió el síntoma reportado **y creó el de la ronda del 2026-09-15**: el `translateX(-50%)` no sobrevive un ciclo abrir/cerrar |
| 3 | Slider roto | `.slider-component` **no tenía `width`**. Su padre `.testimonials_layout` es `align-items: center`, así que el hijo se dimensionaba a `max-content` (938px) y se centraba desbordando a `left: −274` | `.slider-component` base → `width: 100%` | ✅ 343px en `left: 23`; las dos flechas dentro del viewport |
| 4 | Padding en "Your Next Step" | `.cta_content` @991 sobreescribía `padding-top/bottom` pero **no** los laterales, así que quedaban los `2.5rem` (40px) del base | `.cta_content` @medium → `padding-left/right: 1.5rem` | ✅ H2 de `left: 63` → `left: 47`, ancho 263 → 295. Ahora igual que las otras cards |
| 5 | Input del form | `.guide_input` tiene `flex: 1` (= `flex-basis: 0%`). A ≤767 `.guide_form` pasa a `flex-direction: column`, y en un contenedor columna **`flex-basis` gobierna el alto**: pisaba el `height: 3rem` y lo dejaba en el alto del contenido (23px) | `.guide_input` @small → `flex-basis: auto` | ✅ 48px, igual que el submit. `font-size` ya era 16px |

**La lección de los items 3 y 5**: los dos parecían "un ancho/alto mal puesto"
y ninguno tenía la propiedad escrita. Los dos eran **flexbox dimensionando por
nosotros** — `align-items: center` que hace `max-content`, y `flex-basis` que
en columna es el alto. Buscar la propiedad culpable en el Designer no los
encuentra; hay que mirar el contenedor.

### Lo que encontró el barrido y no se había reportado

| Severidad | Hallazgo | Dónde |
| --- | --- | --- |
| Rompe | Tap targets abajo de 44px: ~~bullets del slider **16×16**~~ (**resuelto el 2026-09-22** — la paginación se eliminó del slider), input `#email` 23px de alto, burger 40×43, CTA del nav (`u-link-cover`) 146×**36** | Designer |
| Rompe | En teléfono acostado (844×390) el nav sticky mide 70px = **18% del viewport**, arriba del techo del 15% | Designer, breakpoint Tablet |
| Inconsistente | Tipografía abajo de 14px: `.eyebrow` 12.25px, y `.plain-text` en 12px llevando texto de cita y labels de stats | Designer |
| Inconsistente | Los footer-links miden 18px de alto (82×18) — sin padding vertical no hay dónde tocar | Designer |
| Inconsistente | A 1024 (iPad landscape, estilos de desktop) el padding vertical tiene **9 pares distintos** entre sections: 148/148, 119/119, 68/200, 148/96, 24/0. En mobile el ritmo es consistente (50/50 en 7 de 12) | Designer, base |


### El bottom-margin de tipografía se suma al gap — medido el 2026-09-23

Reportado por Pablo como *"muchas inconsistencias con el margin bottom"*.
Medido con Chrome headless por CDP contra staging, las **16 páginas** a 1440.

Cada nivel tipográfico de MAST trae un `Bottom Margin` desde su token
(`Eyebrow/Bottom Margin` = 24px, H2 = 9.6, H4 = 12.8…). Nuestros contenedores
separan con `gap`. Donde conviven, el margen **se suma al gap** y la separación
supera al diseño.

**39 casos reales en 12 de las 16 páginas**, de 9.6 a 24px cada uno.

#### El primer conteo dio 85 y estaba mal — 46 eran falsos positivos

Vale documentarlo porque las dos causas son sutiles y **aplicar `u-mb-0` a
cualquiera de las dos habría roto el layout**:

1. **MAST ya compensa el eyebrow.** `.eyebrow-component.cc-inline` declara
   `margin-bottom: -24px`, que **cancela exactamente** los +24px del `.eyebrow`
   interno. Medido: neto 0 y `misalign: 0` contra los filetes hermanos. Son 38
   casos en 12 páginas, y ponerles `u-mb-0` dejaría el margen negativo sin
   contraparte — el eyebrow subiría 24px.
2. **En un contenedor `flex-direction: row` un margen vertical no separa
   nada.** `.eyebrow-row` es una fila; el margen del eyebrow no aporta al
   flujo vertical.

**La métrica correcta no es el margen del texto, es el neto**:
`margin-bottom del texto + margin-bottom del wrapper`, y sólo cuenta si el
contenedor es vertical.

#### Dónde están los 39

| Contenedor | Tipo | Sobra | n |
| --- | --- | --- | --- |
| `cta_content` | heading | 12 / 9.6 | **8 — cerrado** |
| `job-card_col` | eyebrow | 24 | 4 |
| `plan-card_head` · `cta_lede` · `find-us_detail` · `statement_layout` | ambos | 9.6–12.8 | 2 c/u |
| 15 contenedores más, de a uno | ambos | 9.6–24 | 15 |

El `Eyebrow` concentra 16 de los 39 y siempre con 24px, que es el valor más
visible de todos.

#### 🔴 La causa raíz: el prop `Style` de MAST no emite nada

**Medido el 2026-09-23**: la Home entera tiene **2 atributos `style`** en su
HTML publicado, y el único con contenido es un badge de Webflow. **Cero vienen
del prop `Style`.** Grep de `style="margin-bottom` en la Home: **0
resultados** — aunque `Section / Statement`, `Meet Your Doctor`,
`What Makes This Different` y `Testimonials` tienen los cuatro
`Style: "margin-bottom: 0"` escrito en el Designer.

O sea que **el prop `Style` es inerte** y todo lo que se puso ahí en este
proyecto nunca hizo nada: los `margin-bottom: 0`, los `margin-bottom: 1rem` de
las 6 cards de `What Makes This Different`, y los `max-width` que lo
acompañaban.

Eso es el origen del problema que reportó Pablo: el espaciado se "resolvió" con
`Style` en decenas de headings y el token siguió aplicando en todos. Explica
por qué la queja fue *"muchas inconsistencias"* y no *"una"* — donde alguien
usó `u-mb-0` funcionó, donde usó `Style` no, y las dos vías conviven.

**Consecuencia de alcance**: hay que barrer **todos** los props `Style` del
sitio, no sólo los que ponen `margin-bottom`. Cualquier cosa ahí es inerte.

#### El arreglo es `u-mb-0` en el prop `Class`, no `margin-bottom: 0`

Decisión de Pablo el 2026-09-23, y **medida**: escribir `margin-bottom: 0` en
una clase propia no gana; `u-mb-0` sí.

La razón es que los variants de MAST se compilan con **`:where()`** —
`.heading-text:where(.w-variant-…)`— y `:where()` aporta **especificidad
cero**. El variant queda en (0,1,0), igual que `.u-mb-0`, así que no lo domina.
Y el prop `Class` de `Heading` aterriza **sobre el `<h1>` mismo**
(`class="heading-text w-variant-… u-mb-0"`), no sobre un wrapper. Verificado:
los 20 headings de `/fees-and-policies` con `u-mb-0` computan `0px`.

**Esto corrige la memoria `mast-class-prop-combo-trick`**, que afirmaba que una
utility inyectada por `Class` no le gana a un variant y recomendaba el prop
`Style`. Era deducido del CSS, no medido, y estaba mal.

**Por qué no se toca el token.** Poner `Eyebrow/Bottom Margin` en 0 arreglaría
los 16 de una escritura, pero rompería la compensación de `cc-inline` en los 38
de arriba —el eyebrow saltaría 24px en 12 páginas— además de los lugares donde
el margen sí separa. El sitio ya sigue la convención `u-mb-0` en 210 de sus 241
headings.

#### Un override de `Class` reemplaza el default, no lo extiende

Es la causa de los 4 casos del CTA Banner. El prop `Title Class` tiene
`defaultValue: "u-mb-0"`, pero cuatro instancias lo pisaron con `cc-cta-sm`
para bajar la escala del título y **perdieron el `u-mb-0` sin que nada avise**.
Corregido a `cc-cta-sm u-mb-0` (y `cc-cta-sm u-mw-32 u-mb-0` en Fees).

**La regla: cuando un prop de clase tiene un default que hace falta, el
override lo repite.** Vale para `Title Class`, `Button Class` y `Text Class`.

#### Aplicado el 2026-09-23 — 37 de los 39

Cerrados en el Designer y verificados por read-back. **Nada publicado todavía.**

| Dónde | Casos | Cómo |
| --- | --- | --- |
| `Section / CTA Banner` | 4 | El override de `Title Class` perdía el `u-mb-0` del default |
| Home (9 componentes) | 13 | El prop `Style` inerte → `u-mb-0` en `Class` |
| Join Our Team | 6 | 4 en la definición de `Current Openings` + 2 con `cc-rule-left` |
| `Card / Membership Plan` | 2 | **1 escritura**: las dos instancias comparten la definición, y la usan Wellness y Fees |
| Patient Stories · Blog · Contact · Products · Sports Injuries · Fees · Wellness | 12 | Eyebrows sueltos |

**Dos casos no se tocaron a propósito**: en Blog y en Fees el componente tenía
**dos** eyebrows y sólo uno era el bug — el otro lleva `cc-inline`, o sea que
está compensado. Se identificó cuál por el nombre de su prop (`Disclaimer
Label` contra `Eyebrow`), no por su posición en el árbol.

**Queda 1 sin localizar** (`includes_head` en Wellness) y **1 caso inverso**:
el H1 del hero pedía `margin-bottom: 2.5rem` por el prop `Style` y quedó con
los 12px del token. Ninguna utilidad lo cubre — los tokens de margen son `em`
(`xs` .5, `sm` 1, `md` 2, `lg` 3), así que sobre un H1 dan 30 o 60px, nunca 40.
Necesita una decisión contra el Figma del hero.

#### ⚠️ El barrido corrió contra un staging desactualizado

Staging es **anterior** a los cambios del Designer del 2026-09-21, así que el
HTML medido no es el estado real del proyecto. Ya apareció el caso mixto: en el
CTA Banner **5 instancias estaban bien en el Designer y mal en el HTML
servido**. Los 31 restantes hay que confirmarlos leyendo el Designer o
re-midiendo después de publicar, no darlos por ciertos.

### Las citas salían en redonda — la itálica sólo la da `u-italic`, medido el 2026-09-23

Reportado por Pablo con una captura de la card de Mari en Patient Stories:
*"los quotes que tienen italic están sin italic en Webflow"*. Barrido después
sobre las **17 páginas publicadas**, y no era un caso suelto.

#### La causa: las variantes `Quote` y `Quote Small` no declaran `font-style`

Medido en el CSS publicado (`schwabe.webflow.shared.9246c41cd.css`): **en las
243KB del sitio hay exactamente dos reglas con `font-style: italic`**, y una es
`dfn` del reset de Webflow. La única que usamos es:

```css
.u-italic { font-style: italic }
```

Las dos variantes de `Plain Text` que llevan las citas declaran todo menos eso:

```css
.plain-text:where(.w-variant-c054f833-…)  /* Quote       → tokens de H5 */
.plain-text:where(.w-variant-7f9ac764-…)  /* Quote Small → tokens de H6 */
  { font-family, font-size, line-height, font-weight, letter-spacing }
```

Y la familia resuelve bien — la cadena del quote es
`Quote Small → var(--_typography---h6--font) → var(--_typography---fonts--secondary-font) → "EB Garamond"`,
peso 500, que es exactamente lo que dibuja el Figma. O sea que `font-style` era
lo único que faltaba.

**Pero la cara itálica no está cargada, y eso es un problema aparte.** El loader
de fuentes pide `EB Garamond:500,600` — los dos pesos **en redonda**— en las 17
páginas, y verificado contra Google esa petición devuelve dos `@font-face` los
dos `font-style: normal`. Así que el navegador **fabrica** la itálica
inclinando la redonda. Una itálica real de Garamond no es la redonda inclinada:
cambia el ductus y la *a* pasa de doble piso a un piso. Se nota a 24 y 32px.

Eso **no lo introdujo este arreglo** — afecta igual a las 51 citas que ya
estaban en itálica, al H2 del Statement y al subtítulo del CTA. Y **no se puede
arreglar por MCP**: `data_fonts_tool` sólo administra fuentes *subidas*
(`list_fonts` devuelve 0 — el sitio no self-hostea ninguna), y EB Garamond es un
Google Font que se configura en **Site Settings → Fonts** — donde hoy dice
`EB Garamond · 500, 600` y `DM Sans · 400, 500, 700`, sin una sola itálica.

**Lo que hay que tildar ahí, medido elemento por elemento:**

| Familia | Variante | Cuántos textos | Dónde |
| --- | --- | --- | --- |
| EB Garamond | **500 Italic** y **600 Italic** | 58 | Grupos H1, H2, H4, H5 y H6. Los dos pesos porque el sistema tipográfico declara 500 y 600 según el modo de variable, y el loader ya pide los dos en redonda |
| DM Sans | **400 Italic** | 3 | `paragraph-lg` en Community Partners |

**Que DM Sans también la necesite no era obvio**: la itálica se asocia a las
citas, que son Garamond. Pero Community Partners tiene tres textos con
`u-italic` sobre `Paragraph LG`, que resuelve al font primario. Se encuentra
mapeando cada variante con `u-italic` a su grupo tipográfico y de ahí a
`primary-font` / `secondary-font` — no alcanza con mirar dónde están las citas.

*(Aparte: dos de esos tres son nombres de organizaciones —Serenity Functional &
Integrative Endocrinology y Apto Physical Therapy— en itálica. Un nombre propio
en itálica es discutible; es una decisión de diseño, no un bug, y no se tocó.)*

**El fallback dice `sans-serif` y no se tocó, a propósito.** La variable
`Fonts/Secondary Font` guarda sólo `"EB Garamond"`; el `, sans-serif` lo genera
Webflow. Pisarlo exigiría un `custom_value` con la pila CSS entera, que
desengancha la variable del selector de fuentes del Designer. El fallback sólo
se ve los milisegundos de la carga: no vale ese precio.

O sea que **una variante que se llama "Quote" no hace que el texto parezca una
cita**: hay que acordarse de agregar `u-italic` a mano, instancia por instancia.
Donde alguien se acordó quedó bien; donde no, no. Es **exactamente la misma
forma** que el bug de `u-mb-0` de más arriba, con otra propiedad.

Medido sobre los 96 usos de esas dos variantes: **51 con `u-italic` y 45 sin**.

#### Lo que confirmó el Figma

| Nodo | Qué es | Lo que dibuja |
| --- | --- | --- |
| `990:1302` | La cita del hero de Patient Stories | `EB Garamond Italic` **32px** |
| `990:1507` | Una cita de la grilla de themes | `EB Garamond Medium Italic` **24px** |
| `974:1803` | Los 2 reviews del doctor (Home) | `EB Garamond Medium Italic` 24px |
| `974:1811` | El remate de cada paso de `#plan` | `EB Garamond Medium Italic` 24px |

#### Aplicado — 10 escrituras que arreglan 33 textos

| Dónde | Qué | Textos | Cómo |
| --- | --- | --- | --- |
| Home · `Section / Meet Your Doctor` | Los 2 Google reviews | 2 | `u-italic` en el prop `Class` |
| Home · `#plan` | `.plan-step_kicker` | **3** | `font-style: italic` en la clase — 1 escritura |
| Patient Stories · `Section / Stories Hero` | La cita de Mari (la de la captura) | 1 | `u-italic` |
| Patient Stories · `Section / Stories Outro` | *"Same practice. Same philosophy…"* | 1 | `u-italic` |
| Patient Stories | La cita destacada de Sarah | 1 | `u-italic` |
| Patient Stories | Las 3 grillas de citas del CMS | **20** | `u-italic` en los 3 templates — 3 escrituras |
| Todo el sitio | `.rich-text blockquote` | **6** hoy | `font-style: italic` — 1 escritura |

**Los 20 de CMS son 3 escrituras y no 20** porque cada Collection List tiene un
template. Lo mismo con los 3 kickers y los 6 blockquotes: se arreglan en la
clase, no en el elemento.

**`.rich-text blockquote` es una clase base de MAST** (`e7817097-…`, selector
literal `.rich-text blockquote`) y alcanza a **cualquier** rich text del sitio,
incluidos los artículos del blog. Es deliberado: un blockquote en itálica es el
tratamiento del Figma y no había ningún otro consumidor con otro criterio. Es el
mismo precedente que `ACCORDION-OPEN.md` y `.slider-nav`.

#### Lo que NO se tocó, y por qué

**La tentación es poner `font-style: italic` en las dos variantes y cerrar el
tema de una.** No se hizo porque **las variantes están haciendo dos trabajos**:

| Uso | Ejemplos | ¿Itálica? |
| --- | --- | --- |
| Cita de paciente | las 33 de arriba | **Sí** |
| Precio destacado | los 17 `$349` / `$88` de Fees y Wellness | Sí — ya la tenían |
| **Lista de condiciones** | las 12 de Sports Injuries | **No** |
| **Medios de pago** | las 4 de Fees | **No** |
| **Lede enfatizado** | 4 párrafos en Care Hub, Products y Patient Stories | **No** |

Tocar la variante habría puesto en itálica esas 20 que no son citas. El arreglo
correcto es por elemento, que es como ya funcionaban las otras 51.

**Queda abierto el problema de fondo**: 20 textos que no son citas usan una
variante llamada `Quote`. Es deuda de vocabulario tipográfico, no de itálica —
la salida es una variante `Lead` / `List Item LG` para esos usos. Está en el
TODO.

#### La regla

**Una variante de MAST que nombra un rol no garantiza el estilo de ese rol.**
Antes de confiar en el nombre hay que leer qué propiedades declara —
`get_variant_styles`, o directamente grepear el CSS publicado, que es más
barato:

```
curl -s https://schwabe.webflow.io/ | grep -oE 'href="[^"]*schwabe[^"]*\.css"'
```

Y el chequeo que encuentra este tipo de bug en un barrido: **contar cuántas
reglas del sitio entero declaran la propiedad**. Dos en 243KB para `font-style`
era la señal de que la itálica no vivía en el sistema tipográfico sino en una
utilidad que había que recordar.

#### Verificado post-publish — 2026-09-23, 19:34

Publicado y re-medido contra el HTML y el CSS servidos (`bb06117da`, antes
`9246c41cd`, `cf-cache-status: MISS`):

| Check | Resultado |
| --- | --- |
| Citas con `u-italic` sobre las variantes Quote | **76 de 96** (antes 51) |
| Las 20 restantes | Las de siempre: 12 condiciones, 4 medios de pago, 4 ledes. **Correcto** |
| `.plan-step_kicker` y `.rich-text blockquote` | `font-style: italic` en el CSS publicado ✅ |
| Reglas con `font-style: italic` | De **2** a **6** |

**Y la cara itálica ya está**: Pablo subió `EBGaramond-MediumItalic` (500) y
`EBGaramond-SemiBoldItalic` (600) como **fuentes propias** con la familia
`EB Garamond`, así que el `@font-face` con `font-style: italic` matchea la
cadena del quote y la itálica dejó de ser sintética. **Por eso el loader de
Google sigue pidiendo `EB Garamond:500,600`** y eso no es un síntoma de que
falte algo: la itálica ya no sale de Google.

**El precio son 865KB.** Los dos archivos son TTF sin subsetear, 433 y 432KB. El
mismo par en woff2 con subset latino ronda 30-40KB cada uno — **unas 20 veces
menos**, y hay itálica en casi todas las páginas. El handoff pide Lighthouse
mobile ≥90.

**La salida más barata es no subir nada**: el panel de Google Fonts de Webflow
ofrece `500 Italic` y `600 Italic` de EB Garamond, ya en woff2 y subseteadas.
Se tildan ahí y se **borran las dos subidas** — si conviven, el sitio sirve dos
`@font-face` para la misma cara. Está en el TODO.

**Falta todavía DM Sans 400 Italic**: el CSS publicado tiene dos `@font-face` y
los dos son EB Garamond, así que los 3 textos de Community Partners siguen con
itálica sintética.

### Patient Stories contra el Figma `1154:14667` — ronda del 2026-09-24

Pablo pidió revisar la página entera contra el Figma nuevo y aplicar las
diferencias, más los 5 comentarios que dejó Derek en el prototipo.

**El Figma `1154:14667` es ANTERIOR a los comentarios de Derek.** Todavía dibuja
la foto de la historia destacada, que es justo lo que él pide sacar. Donde los
dos chocan, **manda el comentario**: es la instrucción más nueva.

#### El ancho del Figma NO reproduce el corte de línea del Figma

El H2 de la intro salía `"The details are different. The pattern"` /
`"is familiar."` — un huérfano de dos palabras. El Figma lo dibuja partido en
`"The details are different."` / `"The pattern is familiar."`.

La trampa: **el Figma no lo está envolviendo, lo tiene tipeado con un salto
manual** — `get_design_context` devuelve dos `<p>` separados dentro de una caja
de 680px. Copiar ese 680 no sirve. Medido a 1440 con Chrome por CDP:

| Ancho | Cómo rompe |
| --- | --- |
| 704 (lo construido, `44rem`) | `…different. The pattern` / `is familiar.` |
| **680 (el del Figma)** | **igual — el 680 no arregla nada** |
| 660 → 528 | `…different. The` / `pattern is familiar.` — peor, se lleva el "The" |
| **512 → 464** | **`The details are different.` / `The pattern is familiar.`** ✅ |
| 432 | 3 líneas |

La ventana real es **437–521px**: 437 es lo que mide `"The details are
different."` y 521 lo que mide esa frase más `" The"`. Arriba de 521 el
navegador sube el "The"; abajo de 437 rompe la primera frase.

Aplicado **`u-mw-32`** en el prop `Class` del Heading — computa **504px**, cae
en el centro de la ventana. Verificado inyectándolo en el sitio publicado: corte
exacto, centrado intacto (374px a cada lado) y el párrafo de abajo sin moverse.

**La regla**: un corte de línea del Figma se reproduce **midiendo el ancho de las
frases**, no copiando el ancho de la caja. La caja del diseño puede ser más ancha
que el corte porque el diseñador lo tipeó a mano.

#### Las estrellas eran blancas sobre beige

`.stories-stars` servía `hero-trustbar-stars.svg`, fill **`#FBFAF8`**, dentro de
`.section.cc-google-reviews`, que es **Beige Muted** (`#eeece4`). El Figma
(`1154:15228`) las dibuja en **Olive Green `#6B744E`**.

El SVG lo comparten dos lugares y **sólo uno estaba mal**: en el hero de la Home
va sobre banda oscura y el blanco es correcto. Por eso no se editó el asset
existente sino que se subió **`stars-olive.svg`** (`6ab53abe8293ad9eef669eed`) y
se repuntó sólo el de Google Reviews.

#### Lo aplicado en esta ronda

| Qué | Cómo |
| --- | --- |
| El H2 de la intro rompía mal | `u-mw-32` en el `Class` del Heading |
| *"Patients feel heard…"* en redonda | `u-italic`. Ya era EB Garamond por la variante `Quote`; sólo faltaba el `font-style` |
| Estrellas blancas sobre beige | Asset oliva nuevo, sólo en Google Reviews |
| **Derek**: la banda de *"One good experience"* | Foto de montaña **eliminada** (`.stories-bg`), `.section.cc-relationship` pasa a `background-color: Brand/Ink`. El texto ya era beige, así que el contraste no cambió |
| **Derek**: el botón de la banda Shockwave | *"See more Colorado Shockwave® patient results"* → **"See more patient stories"** |

**El botón quedó con una inconsistencia que NO resolví por mi cuenta**: sigue
linkeando a `coloradoshockwave.com`. Con la etiqueta vieja el destino externo se
entendía; con la nueva, un botón que dice "patient stories" y saca del sitio
promete una cosa y hace otra. Derek pidió sólo la etiqueta — el link necesita su
decisión.

### El `min-height` del CTA Banner bajó de 46rem a 32.5rem — 2026-09-23

Reportado por Pablo: *"me parece que tiene 46rem mínimo y es mucho"*.

**El Figma no estaba mal**: la Home (`974:2344`) y Community Partners
(`711:6086`) dibujan los dos **736px**, que es exactamente lo que el sitio
tenía. El problema es que era un mínimo **fijo para 7 páginas** cuyo copy mide
muy distinto. Medido a 1440 contra staging:

| Página | Card | Contenido | Agujero |
| --- | --- | --- | --- |
| New Patients | 736 | 454 | **282** |
| Sports Injuries · Patient Stories | 736 | 488 | **248** |
| Home | 736 | 548 | 188 |
| Community Partners | 736 | 601 | 135 |
| Blog | 736 | 609 | 127 |
| Our Story | 736 | 638 | 98 |
| Fees (variant `Compact`) | 520 | 461 | 59 |

En New Patients **el 38% de la card estaba vacío**.

`.card.cc-cta-card` pasó a `min-height: 32.5rem` — el mismo valor que ya usaba
el variant `Compact`, así que la escala no inventa un número. Con eso cada card
queda del alto de su copy y ninguna crece: Home 548, Our Story 638, New
Patients 520.

**`medium` no se tocó**: ya estaba en `min-height: auto`, o sea que de 991 para
abajo esto nunca aplicó.

**El variant `Compact` queda redundante** (declara el mismo 32.5rem que ahora
tiene la base). No se borró para no tocar la instancia de Fees sin medirla;
entra en el backlog de limpieza.

**La regla que sale de acá**: un `min-height` copiado de un frame de Figma vale
para el copy de ESE frame. Si el componente se reusa con copy de otro largo, el
mínimo deja de ser un piso y pasa a ser un agujero. Se mide el contenido real
de todas las instancias antes de fijarlo.

### Las 5 páginas internas no están medidas

Our Story, Our Team, Community Partners, New Patients y FAQ se construyeron con
el MCP de Chrome DevTools caído, así que **ningún breakpoint de estas páginas
está verificado**. Los valores se escribieron siguiendo el patrón de la Home:

| Qué | Base | Medium (≤991) | Small (≤767) |
| --- | --- | --- | --- |
| `.team_grid` | 2 col de 26.875rem centradas | `1fr 1fr` | `1fr` |
| `.partners_grid` | `1fr 1fr` | — | — (falta) |
| `.feature_card` | `1fr 1fr`, padding 3.75rem | 1 col, padding 2.5rem | padding 1.5rem |
| `.faq_grid` | `260fr 800fr` | 1 col | — |
| `.faq_nav` | sticky, columna | estático, fila que wrappea | — |
| Page Header `Split` | `1fr 1fr` | 1 col | — |
| Page Header `Media` | `574fr 726fr` | 1 col, foto 16/10 | — |
| Four Things `Stacked` | `5rem 1fr` por item | — | 1 col |
| `.rooted_grid` / `.orientation_grid` / `.signpost_grid` / `.faq-preview_grid` | 2 col | **sin override** | **sin override** |

Las cuatro últimas son el riesgo obvio: quedan en dos columnas hasta 320px.
`/responsive` tiene que correr sobre las cinco páginas antes de publicar.

### Ronda de feedback del 2026-09-14

Cambios aplicados sobre lo de arriba, también **sin medir** — el MCP de Chrome
DevTools sigue caído.

- **Diez grids tenían `grid-template-rows` sin declarar**, y Webflow lo resuelve
  como `auto auto`: una segunda fila fantasma que suma un `row-gap` de aire
  cuando el contenido ocupa una sola fila. Se les puso `grid-template-rows: auto`
  a `.rooted_grid`, `.orientation_grid`, `.signpost_grid`, `.team_grid`,
  `.faq-preview_grid`, `.partners_grid`, `.faq_grid` **y a tres de la Home**
  (`.differentiators_grid`, `.find-us_grid`, `.shockwave-band`). El único con
  efecto visual real en la Home es `.differentiators_grid`, que tenía
  `row-gap: 2rem` de más abajo de sus 3 columnas.
- **`.cta_content` pasó de `max-width: 40.4375rem` + padding lateral `2.5rem` a
  `50.4375rem` + `5rem`** (647px útiles, el ancho de Figma) para que los dos
  botones del CTA entren en una línea. **Esto toca también el CTA de la Home**:
  el H1 rompe en menos líneas. El párrafo no se mueve, tiene su propio
  `max-width` de 34.25rem. En medium el `max-width` ya era `none` y el padding
  baja a 1.5rem, así que mobile no cambia.
- **`.accordion-trigger`** en small pasó de padding por variable en los 4 lados
  a `1.25rem 0`, y `.accordion-content` a `0` lateral. Las filas del FAQ ahora
  van a sangría cero contra la columna, en los cuatro breakpoints.
- **La regla del `Four Things / Stacked`** (`.four_rule`) es vertical y absoluta:
  `left: 2.5rem`, `top: 2.6875rem`, `bottom: 8.4375rem`. Ese `bottom` está
  calcado de Figma y **depende del alto del último ítem** — si cambia la copia
  del punto 4, la línea deja de terminar en el centro del número. La clase base
  apaga la regla de medium para abajo; el variant Stacked la vuelve a prender en
  medium porque ahí el layout ya es de una columna.

Dos cosas más que entraron sin medir:

- `.section.cc-rooted` tiene `margin-top: -6.25rem` para que la foto de
  Community Partners pise la banda ink. En mobile, con la foto más baja, el
  solape puede comerse el título.
- El árbol del header del FAQ (`.page-header_art`) es `position: absolute` con
  `bottom: -13.4375rem` y `z-index: 1` — se sale de la section a propósito. Está
  en `display: none` de medium para abajo.

### Ronda del 2026-09-15 — el menú mobile se abría corrido

Reportado como *"cuando la abro y la cierro después se abre mal posicionada"*.
**Medido** con Chrome headless por CDP contra el sitio publicado, a 393px: la
primera apertura daba `left: 0`, y después de cerrar y reabrir **`left: 196`**
de 393 — exactamente media pantalla.

**La causa es que Webflow pisa el `transform` del menú.** El arreglo del
2026-09-08 (item 2 de la tabla de arriba) centraba `.nav-menu` con
`left: 50%` + `transform: translateX(-50%)`. La rutina de cierre del navbar de
Webflow termina así:

```js
function l(){ e.menu.height(""), d(e.menu).set({x:0,y:0}), e.menu.each(j), … }
```

O sea que **al cerrar** deja inline `transform: translateX(0px) translateY(0px)`.
Inline le gana a cualquier stylesheet, así que de la segunda apertura en
adelante el `translateX(-50%)` no existe y el menú se queda donde lo puso
`left: 50%`. La primera apertura funcionaba porque el atributo inline todavía
no estaba escrito.

**La regla que sale de acá: nada que esté dentro de un `w-nav` puede
posicionarse con `transform`.** Esa propiedad es del script de Webflow. Lo
mismo vale para cualquier widget de Webflow que anime con su propio
transformador (slider, tabs, dropdown).

**El arreglo** (Designer, breakpoint Medium, aplicado por MCP el 2026-09-15):

| Clase | Cambio | Por qué |
| --- | --- | --- |
| `.container.cc-nav` | `position: static` | Era el bloque contenedor del menú, y está metido ~24px por el gutter. En static el contenedor pasa a ser `.nav`, que es full width. Es lo que permite posicionar sin transform |
| `.nav-menu` | `left: 0%`, `right: 0%`, se **borran** `width: 100vw` y `transform` | Con el contenedor en `.nav`, `left`/`right` en 0 dan full-bleed solos. Y `top: 100%` ahora es el borde inferior real del nav |

Nada más del nav depende de que el container sea `relative` a ≤991:
`.nav-menu_container`, `.nav-dropdown` y `.nav-dropdown_content` ya son
`static`/`relative` ahí, y los nodos que inyecta `nav.js` (`[data-nav-bg]`,
`[data-nav-line]`) cuelgan de `.nav`, no del container.

Medido después del fix, con ciclo abrir/cerrar/abrir/abrir en los dos schemes:

| Perfil | Menú | Top | Scroll horizontal |
| --- | --- | --- | --- |
| 393×852 | `0 → 393` ✅ | 63 = borde inferior del nav ✅ | 0 ✅ |
| 430×932 | `0 → 430` ✅ | 63 ✅ | 0 ✅ |
| 768×1024 | `0 → 768` ✅ | 70 ✅ | 0 ✅ |
| 844×390 (teléfono acostado) | `0 → 844` ✅ | 70 ✅ | 0 ✅ |

Links en `left: 24`, alineados al logo. **Falta publicar el sitio** para
verificarlo post-publish.

### Lo que pasó limpio

- **Cero scroll horizontal** en los seis perfiles y en los dos color schemes.
- **Ritmo vertical de mobile consistente**: 50/50 en 7 de 12 sections a 390.
- **Un solo inset horizontal**: el `.container` resuelve su `max-width` desde
  una **variable de Layout**, con márgenes auto. **El valor cambió**: medido
  el 2026-09-21 es `min(100% - 172.8px, 1440px)` (86.4px por lado a 1440), no
  el `min(100% - 46.8px, 1440px)` que esta doc decía. Es un token, no una
  regla por breakpoint — `.container` tiene una sola declaración base y ningún
  override. Cambiarlo mueve **todas** las páginas.
- **Nada de `100vh`** en el CSS de Webflow (838 reglas leídas). Nuestro
  `dist/styles.css` es cross-origin y no se puede auditar por CSSOM — se
  chequea grepeando `src/`.
- **Emulación válida**: `hoverCapable: false` en los seis perfiles mobile.

Se sacan de estas tablas cuando `/responsive` vuelve limpio en los seis
perfiles, no cuando se aplica el arreglo.

### Las dos sections animadas de la Home (2026-09-14)

`cc-statement` y `cc-cost` tienen animación scrubeada con pin. Las dos están
**construidas y verificadas en playground, no medidas en el sitio** — el MCP
de Chrome DevTools sigue caído.

| Qué | Base / Tablet (≥768 y alto ≥600) | Mobile (<768) o alto <600 |
| --- | --- | --- |
| Pin + scrub | Sí | **No** |
| `filter: blur()` | Sí | **No** |
| Parallax de la foto | Sí, ±8% | **No** |
| Cortina de `cc-cost` | Sí | **No** — los 3 bloques en flujo |

**Actualización 2026-09-15**: portadas a `src/components/statement.js` y
`src/components/cost.js`, y **medidas contra el bundle real** con Chrome
headless por CDP. El teléfono acostado (844×390) cae en la rama sin pin, como
la regla pretendía. Quedan dos cosas:

- **El wrapper y los atributos ya están en Webflow** (aplicados por MCP el
  2026-09-15, en las definiciones de componente, no por instancia). Ver
  `.claude/rules/components/cost.md`.
- **Nada de esto está medido en el sitio publicado**, sólo contra el bundle
  local con el markup real. Faltan dos pasos antes de poder correr
  `/responsive` sobre la Home: **publicar el sitio** y **bumpear el hash
  pinneado del CDN** (sigue en `@ebd7d03`), o el JS y el CSS nuevos no llegan.

## Gotchas de instrumentación

Cosas que costaron tiempo en las corridas del 2026-09-08 y el 2026-09-15, y
que se repiten.

- **El MCP de Chrome DevTools cayéndose no es un bloqueo.** Chrome se levanta a
  mano y se maneja por CDP con el `WebSocket` nativo de Node — sin dependencias:

  ```
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    --headless=new --remote-debugging-port=9333 --user-data-dir=<tmp> about:blank
  ```

  Después `GET /json/list` para el `webSocketDebuggerUrl`, y de ahí
  `Emulation.setDeviceMetricsOverride` (viewport), `Emulation.setEmulatedMedia`
  (`prefers-color-scheme`), `Emulation.setTouchEmulationEnabled`,
  `Runtime.evaluate` (mediciones) e `Input.dispatchMouseEvent` (el burger).
  Es lo que se usó el 2026-09-15 para medir los dos bugs del nav.
- **La instancia headless se muere sola cada tantas navegaciones.** No es el
  sitio: hay que levantarla de nuevo y seguir. Conviene un script por medición
  en vez de uno largo que recorra los seis perfiles.
- **Un bug de cascada se mide en la página, no se deduce del CSS.** El
  diagnóstico viejo del dark mode era coherente leyendo el CSS y estaba mal:
  el bloque que culpaba es CSS inválido y el culpable real era un `<script>`.
  Antes de escribir una causa en esta doc, hay que haber visto el valor
  computado.

- **Nunca uses `extraHttpHeaders` para bustear caché.** Un
  `Cache-Control: no-cache` convierte los GET simples en requests con
  **preflight CORS**; jsDelivr y CloudFront lo rechazan, y con eso **no carga
  jQuery** — o sea que el nav de Webflow deja de abrir y parece que lo rompiste
  vos. Síntoma exacto: `typeof window.Webflow === "undefined"` y
  `net::ERR_FAILED` en `jquery-3.5.1.min.js`. No hace falta bustear nada: la
  URL del CSS publicado lleva hash, así que un publish nuevo es una URL nueva.
  Lo que sí hay que hacer después de publicar es forzar una recarga real — un
  `navigate_page` a la misma URL puede servir la página cacheada (y descarta el
  query string, así que `?cb=` tampoco sirve).
- **El toggle del nav mobile necesita un click real de CDP.** `.click()`
  sintético y `TouchEvent` despachados a mano **no lo abren**. Hay que arrancar
  el daemon con `--experimentalVision=true` y usar `click_at <pageId> <x> <y>`
  con las coordenadas del centro de `.w-nav-button`.
- **El burger no está en el árbol de accesibilidad**: es un `div.w-nav-button`
  sin `role` ni `aria-expanded`, así que `take_snapshot` no lo lista y un lector
  de pantalla no llega al menú mobile. Es un hallazgo de a11y, no sólo una
  molestia de testing.
- **`query_styles` no muestra lo que dimensiona flexbox.** El slider medía
  938px y el estilo no tenía `width`: el ancho lo ponía el `align-items:
  center` del padre. Si una medición y el estilo no coinciden, el culpable es
  el contenedor.

### Las dos páginas de Care — medidas el 2026-09-17

`/care` y `/care/sports-activity-overuse-injuries` se publicaron a staging y se
midieron con Chrome headless por CDP en los seis perfiles. **Es el primer
barrido real desde que el MCP de Chrome DevTools se cayó.**

| Check | Resultado |
| --- | --- |
| Scroll horizontal, 6 perfiles, las 2 páginas | ✅ 0 en todos |
| `.areas_grid` | ✅ 3 → 2 (≤991) → 1 (≤767) |
| `.injuries_grid` | ✅ 3 → 2 → 1 |
| `.process_grid` | ✅ 5 pistas → 1 |
| `.shockwave_grid` / `.approach_grid` / `.care-cta_grid` / `.injury-hero_grid` / `.injury-context_grid` | ✅ 2 → 1 |
| Filetes de `cc-process` | ✅ `top: 19px` = centro exacto del heading; 144px dentro de su pista |
| Regla de `Four Things / Stacked Light` | ✅ `36 → 751` = centros exactos de los números 1 y 4 |
| Título del CTA con `cc-cta-sm` | ✅ 48px (antes 60) |

### El solape del hero de Injury — corregido el 2026-09-21

Medido: con `margin-bottom: -3.75rem` en la base, el solape era de **60px a
1440 y 1280**, pero **26px a 1100 y 5px a 992** — porque abajo de ~1200 la
columna de copy se vuelve más alta que la foto, manda ella el alto de la fila, y
el margen negativo deja de rendir. Un sobrante de 5px se lee como error.

Ahora el margen negativo vive **sólo en el breakpoint Large (≥1280)** y la base
(992–1279) está en 0. Verificado después del cambio: 60px a 1440 y 1280, y
**sin solape** a 1100 (−4px) y a 992 (−25px).

**Ese arreglo estaba mal y se reemplazó el 2026-09-21.** Scopearlo a Large no
resolvía nada: de 992 a 1279 la foto quedaba **5px por encima** del borde de la
section, o sea una lonja de beige entre la foto y la banda verde que se lee
como un error de alineación, no como diseño. Reportado con captura desde el
canvas del Designer, que es justamente donde el ancho cae en ese rango.

Medido sobre staging, inyectando cada candidato y leyendo el solape real:

| Ancho | Como estaba | base + `align-self: start` | base + **`align-self: end`** |
| --- | --- | --- | --- |
| 1440 | 60 | 60 | **60** |
| 1280 | 60 | 60 | **60** |
| 1200 | **0** | 60 | **60** |
| 1100 | **−5** | **−9** | **60** |
| 1024 | **−18** | **−37** | **60** |
| 992 | **−25** | **−50** | **60** |

**`align-self: end` es la única que da 60px exactos en los seis anchos**, y la
razón es que deja de depender de qué columna es la más alta: con `end` el borde
inferior de la foto se ancla al borde inferior de la fila y el margen negativo
lo empuja esos 60px, gane quien gane el alto. Con `stretch` (lo que había) o
con `start`, el margen negativo sólo rinde mientras la foto sea la más alta —
y a partir de ~1200 la columna de copy la pasa.

**El mismo agujero estaba en el hero de Wellness** y no se había visto porque
sólo aparece en el rango angosto del desktop: con `align-self: start` daba 60px
a 1440/1280/1200/1100 pero **46 a 1024 y 6 a 992**. O sea que fallaba
exactamente en el iPad landscape, que usa los estilos de desktop. Corregido con
el mismo `align-self: end` en el variant `Media Overlap`; medido, 60 constante
en los seis.

Lo aplicado:

| Clase | Base | Medium (≤991) |
| --- | --- | --- |
| `.injury-hero_media` | `margin-bottom: -3.75rem`, `align-self: end` | `margin-bottom: 0`, `align-self: auto` |
| `page-header_media` (variant `Media Overlap`) | `align-self: end` (era `start`), `margin-bottom: -7.5rem` sin tocar | `align-self: auto`, `margin-bottom: 0` |

El override de `margin-bottom` que vivía en `large` se **borró**: con el valor
en la base, dejarlo ahí sería un orphaned breakpoint-only style de los que esta
doc pide no dejar.

**La regla, corregida**: un margen negativo que hace que un elemento pise la
section de abajo **no se scopea al breakpoint donde funciona — se ancla**. Con
`align-self: end` el efecto es determinístico y la regla vieja ("sólo es fiable
mientras ese elemento sea el más alto de su fila") deja de aplicar. Scopear era
tapar el síntoma: conviertía "el solape se degrada" en "el solape desaparece y
queda una lonja de 5px", que se ve peor.

**Verificado por read-back del estilo, no en el sitio**: los dos cambios están
en el Designer y **falta publicar**. Lo que sí está medido en el navegador es
el comportamiento — la tabla de arriba sale de inyectar el CSS candidato sobre
staging con el markup real.

**La regla que sale de acá**: un margen negativo que hace que un elemento pise
la section de abajo **sólo es fiable mientras ese elemento sea el más alto de su
fila**. En cuanto la otra columna lo pasa, el efecto se degrada sin avisar. Si
depende de eso, scopealo al breakpoint donde midieron que se cumple, no a la
base.

### Lo que sigue abierto en estas dos páginas

Todo lo de abajo es **preexistente y ya está en el backlog de arriba**, no lo
introdujeron estas páginas — pero ahora también se ve acá:

- **Tap targets abajo de 44px**: `.nav-link` 42px de alto, el CTA del nav
  (`u-link-cover`) 146×36, los `footer-link` 82×18, el burger 40×43.
- **Tipografía abajo de 14px**: los eyebrows caen a **13.6px a 768** (el token
  `Eyebrow/Font Size` es fluido) y los headings del footer están en 12px.

Lo único sin verificar de estas dos páginas es el **hover invertido de las
cards de Areas of Care**: vive en `dist/styles.css` y no llega al sitio hasta
build + push + bumpear el hash del CDN. Ver
`.claude/rules/animations/AREA-CARD-HOVER.md`.

### Fees y Wellness Membership — medidas el 2026-09-18

`/fees-and-policies` y `/wellness-membership` se publicaron a staging y se
midieron con Chrome headless por CDP en **siete** viewports (los seis del
contrato más 320px).

| Check | Resultado |
| --- | --- |
| Scroll horizontal, 7 perfiles, las 2 páginas | ✅ 0 en todos |
| `.includes_grid` (8 inclusiones) | ✅ 2 → 1 (≤991) |
| `.plans_grid` (tarjetas de plan) | ✅ 2 → 1 (≤991) |
| `.fit_grid` (los 3 caminos) | ✅ 3 → 1 (≤991) |
| `.quick_list` (The quick version) | ✅ 2 → 1 (≤991) |
| `.payment_grid` | ✅ 3 → 1 (≤991) |
| `.policy_grid` | ✅ 4 → 2 (≤991) → 1 (≤767) |
| `.approach_grid` / `.shockwave_grid` | ✅ 2 → 1 |
| Las 5 tablas de precios dentro de su contenedor | ✅ hasta 320px (234 en 282) |
| Título del CTA con `cc-cta-sm` | ✅ 48px en las dos páginas |

### `.faq-preview_grid` no colapsaba — arreglado

El riesgo que esta doc anotaba desde el 2026-09-14 ("quedan en dos columnas
hasta 320px") **era real y estaba en producción**. Medido en
`/wellness-membership`: el `.accordion_list` se salía de su columna **37px a
430, 72px a 390 y 134px a 320**. No producía scroll horizontal porque algo lo
clipeaba más arriba — o sea que **era invisible para un chequeo de `hScroll` y
sólo aparece midiendo el overflow por elemento**.

Arreglado con `grid-template-columns: 1fr` en medium (+ gaps). Re-medido: 1
columna y cero overflow a 768 / 390 / 320.

**Afecta también a New Patients y a `/care/sports-activity-overuse-injuries`**,
que usan la misma clase — las dos quedaron arregladas de paso.

**La lección de instrumentación**: `hScroll === 0` **no prueba que nada
desborde**. Un ancestro con `overflow` clipea el desborde y el documento no
crece. El barrido tiene que medir además el elemento que más se pasa del
viewport (`getBoundingClientRect().right - innerWidth`), que es lo que encontró
esto.

### El hero es más angosto que el Figma, y el container es la causa

Medido el **2026-09-21** a 1440 sobre el sitio publicado, a partir de que los
dos CTA del hero salían **apilados** en vez de en fila:

| Qué | Medido | Figma |
| --- | --- | --- |
| `.container` del hero | **1252** | 1360 |
| `.hero_media` | 526 | 574 |
| `.hero_body` (columna de copy) | **666** | 726 |
| Los dos botones + gap | 335 + 322 + 20 = **677** | 329 + 316 + 16 = 661 |

O sea que la fila necesitaba 677px y tenía 666: envolvía por **11px**, y como
`.hero_actions` estaba en `justify-content: center`, los dos quedaban centrados
uno debajo del otro.

**La causa no es el hero, es el container.** El token de Layout da 86.4px de
gutter por lado a 1440; el Figma dibuja 40px. Toda section del sitio es ~108px
más angosta de lo que el diseño la dibuja — el hero es sólo donde primero se
nota, porque es la única fila de dos botones anchos.

**El arreglo, scopeado:** combo **`.container.cc-hero-wide`** con
`max-width: min(100% - 5rem, 85rem)` en base, y el token de vuelta en `medium`.
Así el hero rinde 1360 / 574 / 726 —exacto al Figma— de 992 para arriba, y de
991 para abajo no cambia nada. Más `hero_actions` a `justify-content:
flex-start` y gap 1rem.

**Es una excepción deliberada a "un solo padding lateral"**, y por eso está
scopeada a desktop: la regla existe para que en mobile no se sumen paddings, y
ahí el hero sigue usando el token como todas las demás.

**Los botones entran en una fila a partir de ~1345px de viewport.** Entre 992 y
1345 siguen envolviendo, ahora alineados a la izquierda en vez de centrados.
Eso es degradación aceptable: el Figma está dibujado a 1440.

**Lo que queda abierto es la decisión grande**: si el gutter del sitio (86.4px)
tiene que bajar al del Figma (40px) en todas las sections. Es un cambio de
token y mueve el sitio entero — sin decidir.

### Re-verificado post-publish — 2026-09-21

Publicado y vuelto a medir: **12 páginas × 6 perfiles, cero fallos reales**.
`/patient-stories` pasó a limpio y los únicos flags que quedan son los tres
falsos positivos conocidos (marquesina, `four_item`, `quick_item`).

| Arreglo | Verificado |
| --- | --- |
| `.container.cc-hero-wide` | 282 / 343 / 676 / 872 / 873 — **idéntico al resto de los containers** de 320 a 992; 1200 y 1360 en 1280 y 1440 |
| Padding de las 6 cards | **24px a 390**, **32px a 768 y 844** (antes 40), las seis parejas |
| `.quote-grid.cc-two` | 1 columna a 430/390/320 (378/343/282px); 2 a 768 con 326px cada una |

**Una falsa alarma que vale anotar**: una screenshot de página completa tomada
inmediatamente después de un `scrollTo` mostró el CTA del nav vacío sobre el
header oscuro. Medido y recapturado con un settle de 1.2s, el texto está y se
lee bien. **Una captura sin esperar el render no es evidencia** — hay que
volver a medir antes de reportar lo que muestra.

### El logotipo tiene poco contraste sobre las bandas oscuras

Visto midiendo el nav sobre `/faq` y `/about/community-partners`: el wordmark
es granate oscuro y el nav, sobre esas páginas, es verde oliva
(`rgb(71,77,51)`). Se lee, pero flojo, y **pasa igual en desktop** — no es un
problema de responsive sino de que falta una variante clara del logo para
fondos oscuros. Sin decidir.

### Barrido de las 12 páginas — 2026-09-21

Primer barrido completo del sitio: las 12 páginas reales × 6 perfiles, medido
con Chrome headless por CDP contra staging publicado.

**Pasó limpio en las 12**: cero scroll horizontal, cero elemento desbordando,
un solo padding lateral por página. El `marquee-group` de la Home aparece
desbordando ~3000px en todos los perfiles y **no es un bug**: es el track
duplicado de la marquesina, clipeado a propósito por la section.

**Dos falsos positivos que conviene no volver a perseguir**: `.four_item`
(`80px 1fr`) y `.quick_item` (`20px 1fr`) cuentan como "grilla de 2 columnas
sin colapsar" en cualquier heurística por número de pistas, y son correctas —
la primera pista es el número y la viñeta, no una columna de contenido.

### El padding de las cards vivía en `small`, y el teléfono acostado es Tablet

Reportado por Pablo como *"hay algunas cards que mantienen el padding de
2.5rem y es mucho"*. Medido a 390 y a 844 en las 12 páginas: a 390 casi todo
ya estaba en 24px, pero **a 844 siete clases saltaban a 40px**.

La causa es de sistema, no de una card: los overrides se escribieron en
`small` (≤767), y un teléfono acostado mide 844px de ancho, o sea que cae en
**Tablet** (768–991) y se queda con el valor de desktop. Es la trampa que esta
doc abre en su primera tabla, aplicada al espaciado.

**El arreglo, y la escala que queda**: se bajó `medium` a **2rem** y se dejó
`small` en **1.5rem**, con lo que la rampa es `desktop → 2rem (≤991) → 1.5rem
(≤767)`.

| Clase | Antes (base / medium / small) | Ahora |
| --- | --- | --- |
| `feature_card` | 3.75 / 2.5 / 1.5 | 3.75 / **2** / 1.5 |
| `shockwave-band` | 3–5 / 2.5 / 2–1.5 | ″ / **2** / ″ |
| `shockwave_band` | 5 / 2.5 / 2–1.5 | ″ / **2** / ″ |
| `plan-card` | 2.5 / — / 1.5 | 2.5 / **2** / 1.5 |
| `table-card` | 2.5 / — / 1.5 | 2.5 / **2** (+ `margin-top` 4rem → 2.5) / 1.5 |
| `partner_card` | 2.5 / — / — | 2.5 / **2** (+ gap 2.5 → 1.5) / **1.5** |

`partner_card` era la única sin ningún override: 2.5rem de padding **y**
2.5rem de gap en todos los viewports.

**Ojo con el alias del gap**: `partner_card` declara `grid-row-gap` en la
base. Escribir sólo `row-gap` en `medium` deja los dos vivos y el ganador lo
decide el orden de serialización — hay que escribir **los dos**, como ya pasó
con `hero_actions` (ver `HOME-FIGMA-SYNC.md`).

### `.quote-grid.cc-two` no colapsaba — arreglado

En `/patient-stories`, dos columnas hasta 320px: cards de **160px a 390** y
**136px a 320**. Una cita de paciente en 136px son unos 15 caracteres por
línea. Su hermana `.quote-grid` (sin el combo) ya era de una columna ahí.
Arreglado con `grid-template-columns: 1fr` en `small`.

### El hero se rompía entero abajo de 992 — `cc-hero-wide` apuntaba al gutter

Reportado el **2026-09-21** como *"el home en responsive está rotísimo, al
menos el hero"*, apenas se publicó el sitio. Medido en staging:

| Viewport | `.container` (el resto) | `.container.cc-hero-wide` |
| --- | --- | --- |
| 390 | `min(100% - 46.8px, 1440px)` → 343 | **23.4px** |
| 768 | `min(100% - 92.16px, 1440px)` → 676 | **46.08px** |
| 992+ | — | `min(100% - 80px, 1360px)` ✅ |

Todo el hero quedaba en una columna de **23px de ancho por 3144px de alto**.

**La causa**: el override de `medium` del combo apuntaba a la variable
`Container/Gutter` (`--_components---container--gutter`, **6vw**) creyendo que
era el ancho máximo. 6vw de 390 da 23.4 exacto, y 23.4 es justo la mitad de
los 46.8 que el token real descuenta — de ahí que el número "casi" cerrara y
no saltara a la vista.

**El bug es del 2026-09-21 pero recién se vio hoy**: `cc-hero-wide` se creó
ese día y el sitio no se publicó hasta ahora. Una clase rota en el Designer no
rompe nada hasta el publish.

**El arreglo**: se borraron el override de `medium` **y** el valor de la base,
y el ancho de Figma pasó a **`large` (≥1280)**. Abajo de 1280 el combo no
declara nada y hereda `.container` tal cual. No se pierde nada: esta misma doc
ya medía que los dos botones del hero sólo entran en una fila arriba de
~1345px.

**Las dos reglas que salen de acá:**

1. **Un combo que existe para ensanchar algo en desktop se declara en `large`,
   no en la base con un override abajo.** La base de Webflow cascadea hacia
   abajo, así que ponerla ahí obliga a un override en `medium` — y ese
   override es una oportunidad de equivocarse que no hacía falta correr.
2. **Antes de bindear una variable a `max-width`, verificá qué mide.** Hay una
   variable de *gutter* y otra de *ancho máximo*, las dos de tipo Size. El MCP
   devuelve el id, no el significado. La comprobación barata es computar el
   valor en dos viewports: un gutter escala con `vw` y da un número chico; un
   ancho máximo sale como `min(...)`.

### Las otras cuatro grillas sin colapso — cerradas el 2026-09-21

Confirmado leyendo los estilos por MCP el **2026-09-18**: de las cinco que esta
doc marcaba como "el riesgo obvio" desde el 2026-09-14, sólo `.faq-preview_grid`
se arregló. **`.rooted_grid`, `.orientation_grid`, `.signpost_grid` y
`.partners_grid` no tenían ni un override en `medium` ni en `small`** — seguían
en dos columnas hasta 320px.

**Arregladas el 2026-09-21**: las cuatro con `grid-template-columns: 1fr` y
`grid-column-gap: 0rem` en `medium`. El gap se escribió con el alias
`grid-column-gap`, el mismo nombre que usa la base, y no con `column-gap`: si
se escribe el nombre moderno los dos conviven y el resultado lo decide el orden
de serialización (el bug de `.symptoms_card` y `.hero_actions`).
**Falta publicar y volver a medir** en los seis perfiles.

| Clase | Base | medium | small | Dónde |
| --- | --- | --- | --- | --- |
| `.rooted_grid` | `580fr 540fr` | — | — | Community Partners |
| `.orientation_grid` | `665fr 575fr` | — | — | New Patients |
| `.signpost_grid` | `1fr 1fr` | — | — | New Patients |
| `.partners_grid` | `1fr 1fr` | — | — | Community Partners |

Y no son cuatro casos sueltos: son cuatro de **34 clases `_grid`**, de las
cuales 18 son la misma grilla de dos columnas escrita 18 veces. Mientras el
colapso haya que acordarse de escribirlo grilla por grilla, esto se va a
repetir. La salida — utilidades `u-grid-2/3/4` con el colapso adentro — está en
`.claude/rules/COMPONENTS-NAMING.md`.

### El símbolo ® sale a tamaño completo

Derek pidió *"make sure registered mark is formatted with correct superscript
typography setting"*. **Medido el 2026-09-18** sobre el H2 de 48px de
`/fees-and-policies`, con `canvas.measureText` en la fuente real
(EB Garamond):

| Glifo | Avance | En em |
| --- | --- | --- |
| `®` | 32.3px | **0.673** |
| `C` | 34.1px | 0.710 |
| `o` | 23.9px | 0.498 |

O sea que el ® ocupa **más que una minúscula y casi lo mismo que una
mayúscula**: es el glifo a tamaño completo, sentado en la línea base. Un ®
superíndice bien puesto ronda 0.40em. **El comentario es correcto y está sin
resolver.**

**Por qué no se arregló acá**: `Heading` y `Plain Text` de MAST reciben
`textContent` **plano**, así que no hay forma de meter un `<sup>` desde el
Designer ni por MCP, y **CSS no puede apuntar a un carácter**. Las dos salidas
reales son (1) un pase de JS en `global.js` que envuelva cada `®` en
`<sup class="u-reg">` en runtime — arregla las ~9 apariciones de estas dos
páginas y las de Care/Injury/FAQ de una vez, pero no llega al sitio hasta
build + push + bumpear el hash del CDN — o (2) pasar esos títulos a `Rich Text`,
que rompe la escala tipográfica. Decisión pendiente del usuario.

#### Construido el 2026-09-29 — `src/utils/registered.js` + `src/styles/registered.css`

Derek cerró la decisión en el comentario #101, y con la regla escrita la salida
por JS dejó de ser una idea: **® sólo en la primera mención de texto de cada
página, nunca en botones ni en menciones posteriores, a ~60% del tamaño y con
el tope a la cap height.** El logo lo conserva siempre y **no cuenta**.

Vive en `global.js` y no en un componente porque aplica a **todas** las páginas
y no tiene ningún hook en el Designer del que colgarse.

**Por qué no es un `replace()` global**, que es lo que parece obvio: la regla
**tiene estado** (sólo la primera) y **una excepción estructural** (los
botones). Las dos obligan a recorrer el documento en orden.

##### El −0.45em del CSS está medido, no elegido a ojo

`vertical-align: super` sube demasiado. Para poner el tope del glifo en la cap
height hace falta `top = ascenso(®) − capHeight`, y las dos se midieron con
`canvas.measureText().actualBoundingBoxAscent` sobre las fuentes reales del
sitio, a 100px de referencia:

| Familia | cap height | ascenso del ® al 60% | `top` ideal |
| --- | --- | --- | --- |
| EB Garamond | 65.4 | 38.0 | **−0.457em** |
| DM Sans | 70.0 | 42.7 | **−0.455em** |

Las dos coinciden dentro de 0.002em, así que **un solo valor sirve para las
dos**. Se escribió **−0.45em**.

⚠️ **La trampa del `em`**: `top` resuelve contra el font-size **del propio
`<sup>`**, que ya es 0.6em del padre. El desplazamiento que hace falta es 0.27em
*del padre* — escribir `-0.27em` lo subiría 0.16em y quedaría corto. El valor a
escribir es `0.27 / 0.6`.

##### Las DOS pasadas existen por el FAQ, y la primera versión tenía el bug

El FAQ tiene **44 `<details>` cerrados** y sus respuestas contienen ®. Medido:
**14 ® en el DOM y sólo 4 renderizados**.

La primera versión recorría una sola vez y salteaba lo oculto. Eso deja las dos
salidas malas: o un ® oculto **se queda con el lugar de la primera mención** —
que es justo la que se ve—, o se saltea y **reaparece crudo** en cuanto el
visitante abre el accordion. Se midió el segundo caso y pasaba.

Con el reclamante resuelto en una primera pasada, lo oculto **nunca reclama
pero igual se limpia**.

##### Medido contra el sitio publicado

El código **del repo** (leído del archivo, no una copia) inyectado por CDP sobre
las páginas servidas:

| Página | ® en el DOM antes | después | Con los accordions ABIERTOS |
| --- | --- | --- | --- |
| Home | 11 | **1** | 1 |
| Patient Stories | 15 | **1** | 1 |
| **FAQ** (44 details) | **14** (4 visibles) | **1** | **1** ✅ |
| Fees | 7 | **1** | 1 |
| Join Our Team | 3 (2 visibles) | **1** | 1 |
| Care | 5 | **1** | 1 |

En las seis: **un solo `sup.u-reg`**, `font-size` del sup / del padre = **0.60
exacto**, y **cero ® dentro de botones**.

##### Lo que NO está verificado

**No corrió en el sitio de verdad**: el bundle no llega hasta
`npm run build` + push + **bumpear el hash del CDN**. Lo medido es el código
real sobre el DOM real, inyectado — que es lo más cerca que se puede estar sin
deployar, pero no es lo mismo.

Y falta **mirarlo con los ojos**: el `-0.45em` está calculado y verificado
contra las métricas de la fuente, no contra una captura.

### Ronda de feedback del 2026-09-18 — Fees y Wellness contra el Figma

Siete items de Pablo sobre las dos páginas recién construidas, más los dos CTA.
Todo medido con Chrome headless por CDP contra staging, **nueve** anchos
(1440 / 1280 / 1100 / 1024 / 991 / 768 / 480 / 390 / 320) y los dos schemes.

#### El árbol del hero pisaba el H1 — en Fees Y en FAQ

`.page-header_art` (el árbol del layout Dark) estaba en `right: 4%`, o sea
**hacia adentro** del viewport. El Figma lo dibuja con el borde derecho 51px
**afuera** (x=744→1491 en un frame de 1440). Medido antes del arreglo, el árbol
se comía el texto del H1 en todo el rango de desktop, y **empeoraba al
angostar**:

| Ancho | Solape con el texto del H1 |
| --- | --- |
| 1600 | −52 (limpio) |
| 1440 | **92** |
| 1280 | **124** |
| 1100 | **158** |
| 992 | **178** |

**Era invisible para un chequeo de `hScroll`**: el árbol desborda a propósito y
un ancestro lo clipea, así que el documento nunca crece. Mismo patrón que el
bug de `.faq-preview_grid`.

**La causa de que empeore hacia abajo**: la columna de copy es de **660px
fijos** mientras el container se angosta. A 1440 ocupa el 46% del viewport; a
992, el 67%. No hay ancho de árbol que entre al lado de eso.

**El arreglo**, en tres breakpoints:

| Breakpoint | Regla |
| --- | --- |
| base (≥992) | `right: -4%`, `display: none` |
| large (≥1280) | `display: block`, `max-width: 46%` |
| xl (≥1440) | `max-width: 52%` |

O sea que **el árbol sólo existe de 1280 para arriba**. Entre 992 y 1279 no
entra sin pisar el título y se apaga; abajo de 992 ya estaba apagado. Medido
después: hueco de **145px a 1440 y 37px a 1280**, cero solape.

**La regla que sale de acá**: una decoración absoluta que convive con una
columna de ancho fijo **no se escala con un porcentaje**. La columna crece en
proporción al angostarse y se come el espacio más rápido de lo que el
porcentaje lo devuelve. O se scopea al rango donde se midió, o la columna deja
de ser fija.

#### La grilla de 5 cards desbordaba 144px a 1024

`.quick_grid` nació con `1fr × 5` en la base y `3` en medium. **1024 cae en la
base**, así que seguía en 5 columnas: cada card quedaba en 154px y el domo
(figura + label) tiene un `min-content` mayor, así que el `min-width: auto`
implícito de las pistas de grid empujaba la fila **144px fuera del viewport**.

Arreglado moviendo el 5 arriba: base `3`, `large` (≥1280) `5`, `small` `2`,
`tiny` `1`. Más `min-width: 0` en `.stat-card` y en `.intro_dome.cc-stat`.

**La lección**: *Tablet* de Webflow es ≤991, así que **el iPad landscape (1024)
usa la base**. Una grilla de más de 3 columnas tiene que colapsar en `large`,
no en `medium`, o hay un agujero de 992–1279 sin cubrir.

#### Barrido final

| Check | Resultado |
| --- | --- |
| Scroll horizontal, 9 anchos, las 2 páginas | ✅ 0 en todos |
| `.quick_grid` | ✅ 5 (≥1280) → 3 (992–1279) → 3 (≤991) → 2 (≤767) → 1 (<480) |
| `.policy_grid` | ✅ 4 → 2 (≤991) → 1 (≤767) |
| `.payment_grid` · `.approach_grid` · `.shockwave_grid` · `.plans_grid` | ✅ → 1 (≤991) |
| `.includes_grid` · `.fit_grid` · `.faq-preview_grid` · `.feature_card` | ✅ → 1 (≤991) |
| Las 5 tablas de precios dentro de su contenedor | ✅ hasta 320 (234 en 282) |
| Hueco árbol ↔ H1 | ✅ 145 @1440 · 37 @1280 · oculto ≤1279 |
| Solape foto ↔ section, hero de Wellness | ✅ **60px exactos** (Figma ~57) |
| Los dos color schemes | ✅ idénticos — las clases nuevas usan tokens de marca, no los `--primary--*` que voltea `u-mode-dark` |

#### El solape del hero de Wellness vive en su propio variant

La foto del hero tiene que pisar 60px la section de abajo. Todo lo que hace
falta tocar está **adentro** del componente `Section / Page Header`, y su
layout `Media` lo comparte **New Patients**, cuya section siguiente es la banda
verde oscura — el solape ahí sería un cambio de diseño que nadie pidió.

Por eso se creó el variant **`Media Overlap`** replicando las 7 reglas base y
las 5 de medium de `Media`, más:

| Estilo | Base | Medium |
| --- | --- | --- |
| `page-header_media` | `align-self: start`, `margin-bottom: -7.5rem` | `margin-bottom: 0` |
| `cc-ph-root` | `z-index: 1` | — |

**`align-self: start` no es decorativo**: `Media` lo tiene en `center`, y con un
margen negativo el alto de la fila baja 120px y la foto queda centrada sobre
esa fila más corta — desborda 60px **arriba y abajo**. Con `start` arranca en
el borde superior de la celda y todo el sobrante cae abajo, que es lo único
que se quiere.

**El `z-index: 1` tampoco**: `.section` es `position: relative` con `z-index:
auto`, así que entre dos sections posicionadas pinta última la que va después
en el DOM. Sin el z-index, la section beige de abajo tapa la foto y el solape
no se ve.

**`duplicate_variant` no se usó** — está documentado como roto en este proyecto
(lee bien, no aplica). Se replicó a mano con `create_variant` +
`set_variant_styles`, y `get_variant_styles` acepta `breakpoint_id`, que es lo
que permitió copiar también las reglas de medium.

#### El variant Compact del CTA Banner, y un rename que hizo falta

El CTA de Fees medía **1016px de alto con la card en 736 y padding 80/200**,
contra los 720/520/100-100 del Figma. La misma section la usan la Home y otras
5 páginas, donde 736 se ve bien, así que el arreglo no podía ir en la base:
variant **`Compact`** con `.card.cc-cta-card` en `min-height: 32.5rem` y
`.section.cc-cta` en `padding: 5rem` arriba y abajo. Medido después: **680px**.

Para poder escribirlo hubo que **renombrar `.card.cc-cta` → `.card.cc-cta-card`**:
`set_variant_styles` sólo toma `style_name`, y `cc-cta` era el combo de la
**section** y de la **card** a la vez — no había forma de decirle a cuál de las
dos apuntaba.

#### Clases y utilidades nuevas

- `quick_grid`, `stat-card`, `stat-card_label`, `.intro_dome.cc-stat` — las 5
  cards con domo de *The quick version*.
- `shockwave_figure`, `shockwave_price` — el `$79` superpuesto sobre la foto.
  **Ancla a `bottom`, no a `top`**: la imagen trae el logotipo de SHOCKWAVE
  quemado en la esquina superior y el overlay se le montaba encima.
- `.shockwave_band.cc-light` — la banda en Beige, para no tocar la de `/care`.
- `u-mw-23 / -26 / -32 / -36 / -40` y `u-mx-auto` — anchos máximos para forzar
  los cortes de línea del diseño. `u-mx-auto` va **sólo** en los títulos
  centrados: en un contenedor flex-column un `margin-inline: auto` centra en el
  eje cruzado y desalinearía los que van a la izquierda.
- Prop **`Title Class`** en `Section / Page Header`, bindeado al `Class` del
  Heading — el mismo patrón que ya tenían `Button Class` y el `Title Class` del
  CTA Banner. Default `u-mb-0`, así que las otras 7 instancias no cambian.

Cortes de línea medidos contra el Figma después del cambio:

| Título | Figma | Medido |
| --- | --- | --- |
| Wellness H1 | 569px, 3 líneas | **568, 3** ✅ |
| "There is a point in care…" | 414, 3 | **414, 3** ✅ |
| "Two membership options…" | 640, 3 | **640, 3**, centrado en 720 ✅ |
| "Is Wellness Membership right for you?" | 508, 2 | **504, 2**, centrado en 720 ✅ |
| "Out-of-pocket care, by design." | 370, 2 | 2 líneas ✅ |
| "Ready to book your first visit?" | 505, 2 | 2 líneas ✅ |


### El TOC se movió a la derecha con `grid-column`, no reordenando el DOM — 2026-09-25

`.article_grid` pasó de `17rem 1fr` a `1fr 17.5rem` y `.legal_grid` de
`260fr 800fr` a lo mismo, con el índice colocado en la columna 2 por
`grid-column` en vez de moverlo en el markup.

**La regla que sale de acá**: cuando una grilla de dos columnas colapsa a una
en `medium`, el orden del DOM es el orden de mobile. Un sidebar que se mueve
visualmente con `grid-column` conserva su posición en el apilado; uno que se
mueve reordenando el markup **cae al final en teléfono**. Para un índice de
contenidos eso lo vuelve inútil, que es justo donde más se usa.

**Y el reset en `medium` no es opcional.** Un `grid-column: 2 / 3` contra una
grilla de una sola pista no se ignora: crea una **segunda pista implícita** y
manda el elemento ahí, así que el "colapso a una columna" deja de colapsar. Las
dos clases llevan `grid-column-start: auto` / `grid-column-end: auto` en
`medium`.

### Mover una columna con `grid-column` deja un hueco si no se fija la FILA

Encontrado el **2026-09-25** en el canvas del Designer, un día después del
cambio de arriba: arriba del cuerpo del artículo quedaba un bloque en blanco
del alto del TOC, y el mismo en las dos legales.

**No es un margen ni un `grid-template-rows` faltante — es el auto-placement.**
El TOC va **primero en el DOM** en la columna 2 y el contenido va segundo en la
columna 1. Grid coloca el primero en fila 1 / columna 2 y **el cursor queda
pasado**; cuando el segundo pide la columna 1, en esa fila ya no hay lugar y
cae a la **fila 2**. Resultado: la celda fila 1 / columna 1 queda vacía, con el
alto del TOC más los `2.5rem` de `grid-row-gap`.

| Clase | Base | medium |
| --- | --- | --- |
| `.toc` | `grid-row: 1 / 2` | `auto` |
| `.article_content` | `grid-row: 1 / 2` | `auto` |
| `.legal_content` | `grid-row: 1 / 2` | `auto` |

**El reset en `medium` es tan obligatorio como el de `grid-column`**, y por la
razón simétrica: con las dos clases clavadas en la fila 1 de una grilla de una
sola pista, la segunda no tiene dónde ir y se inventa una **columna implícita**
— el colapso a una columna deja de colapsar. Es el mismo error que el
`grid-column: 2 / 3` sin reset, una fila más abajo.

**La regla: colocar un elemento por `grid-column` contra el orden del DOM exige
fijar también `grid-row`.** Una sola de las dos coordenadas no coloca nada — deja
que el algoritmo elija la otra, y el algoritmo nunca retrocede.

Aplicado y verificado por read-back; **no está publicado** (medido: el CSS
servido no tiene todavía ni `article_grid`, ni `legal_grid`, ni `.toc`).

**Sin medir todavía**: los seis perfiles sobre `/blog/<slug>` (que además sigue
en 404), `/privacy-policy` y `/terms-of-use`.


## Backlog agregado el 2026-09-29

| ✓ | Perfil | Síntoma | Arreglo propuesto |
| --- | --- | --- | --- |
| [x] | 320 · 390 · 430 (y Tablet) | ✅ 2026-09-29 **Join Our Team no colapsaba**: `.philosophy_grid`, `.standing_grid`, `.inquiry_row`, `.job-card_cols` no tienen reglas por breakpoint. Copy de Philosophy ~107px de ancho, form y columnas de la vacante recortados fuera del viewport | `grid-template-columns: 1fr` + `column-gap: 0` en Tablet (≤991) en las 4; `row-gap` del token |
| [x] | 6 perfiles × light/dark | Four Things, Photo Band, Our Team CTA, Care Hub (4 sections) | Pasaron: 0 desborde, inputs ≥16px, sólo eyebrows <14px (deliberados) y links `mailto` inline |
| [ ] | 390 | **Contact**: `.clinic-details_hours` / `.hours_row` se salen del viewport (256..394) | revisar la grilla de `clinic-details` en Mobile |

### 2026-10-01 · Home: fee bar, botones de Shockwave, mapa

Probe de 6 perfiles × light/dark sobre `#hero`, `#fees-at-a-glance`,
`#what-makes-this-different`, `.section.cc-shockwave-card` y `#find-us` (Home y
Our Story): 0 desbordes, 0 tap targets bajo 44px. `.find-us_overlay` en ≤991
queda con `opacity: 1`, fondo transparente y la pill abajo, porque en touch no
hay hover que la revele.
