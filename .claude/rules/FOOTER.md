# Footer — reconstruido contra el Figma

Reconstruido el **2026-09-25** contra el master de Figma **`1183:572`**
("Footer / 2", 1440×720). Hasta ese día el footer era **todavía el del starter
de MAST**: columnas *Explore / Patients / Visit*, una cuarta columna oculta con
cinco `Footer link` placeholder, y la lista social oculta con iconos que no son
los del diseño.

Vive en el componente **`Footer`** (`e2fa2670-5bca-38f1-9fbd-3bf287b462f6`), así
que el cambio alcanza **las 30 páginas del sitio** de una sola escritura.

## La estructura

```
section.section.cc-footer            padding 5rem / 3rem, fondo Forest Green
└ .container
  ├ .footer_nav                      grid de 4 × 1fr, gap 5rem
  │  └ .footer-col  ×4
  │     ├ h3.eyebrow.cc-small        el título de columna
  │     ├ ul.footer-col_list         (3 primeras)
  │     │  └ li.footer-col_item > a.footer-link
  │     └ .footer-contact            (la cuarta)
  │        └ .footer-contact_row ×3
  │           ├ span.footer-contact_icon.ph.ph-*
  │           └ .footer-contact_value > .footer-contact_line ×1-2
  ├ .footer_brand                    grid 30rem / 1fr / 17.5rem, filete arriba
  │  ├ a.footer-brand_link > img.footer-brand_logo
  │  ├ .footer-brand_sub > p.footer-brand_note + img.footer-brand_mark
  │  └ .footer-social
  │     ├ h3.eyebrow.cc-small
  │     └ .footer-social_grid > a.footer-social_pill ×4
  └ .footer_credits                  filete arriba, space-between
     ├ .footer-credits_legal > a.footer-link ×2
     └ p.footer-credits_copy
```

Las medidas salen del frame: las 4 columnas son 280px con 80 de hueco
(280×4 + 80×3 = 1360 exacto), y la banda de marca es 480 / 440 / 280 con los
mismos 80 — de ahí `30rem 1fr 17.5rem` con `column-gap: 5rem`.

## Cinco decisiones que no son obvias

### 1. Los títulos de columna son `.eyebrow`, no una clase nueva

`mast-no-custom-text-classes` prohíbe clases propias para texto, y acá encima
salió gratis: **el `Bottom Margin` del token `Eyebrow` son 24px, que es
exactamente el hueco que dibuja el Figma** entre el título y la lista (heading a
y=0 alto 20, lista a y=44).

Por eso `.footer-col` **no lleva `row-gap`**. Ponerle uno sumaría al margen del
token y daría 48 — el bug de "el margen del texto se suma al gap" que
`RESPONSIVE.md` documenta 39 veces.

El caso del bloque social difiere en 8px (el Figma le da 16 y el token da 24).
Se aceptó la diferencia antes que estrenar un override: 8px no se ven y un
`margin-top` negativo para corregirlos es justo la clase de arreglo que después
nadie entiende.

### 2. Los filetes son `border-top`, no divs

Regla de `COMPONENTS-NAMING.md` —*"un filete decorativo NUNCA es un div
vacío"*— que salió del error de `#plan`. `.footer_brand` y `.footer_credits`
llevan su propio `border-top` con el token **Divider On Dark**
(`variable-b7f02d4e-…`), el mismo que usaba el `.u-border.cc-on-dark` que
reemplazaron.

### 3. Los iconos son Phosphor, no assets

El sitio ya carga `@phosphor-icons/web@2.1.1/src/regular/style.css` — verificado
curleando el HTML publicado. Así que los 7 iconos (teléfono, pin, sobre y las 4
marcas sociales) son `<span class="ph ph-*">` y **no hay un solo SVG que subir,
versionar ni recolorear**.

**Ojo: sólo está cargado el peso `regular`.** Un icono de otro peso
(`ph-fill`, `ph-bold`) no renderiza — se ve el cuadrado vacío del fallback.

### 4. Seis links de Care apuntan a `/care-hub`, y es deliberado

El Figma lista 8 áreas de care. **Sólo dos tienen página**: `/care-hub` y
`/care/sports-activity-overuse-injuries`. Las otras seis —Back & Neck Pain,
Prenatal & Postpartum, Plantar Fasciitis, Headaches & Jaw Pain, Wellness Care y
la propia "Chiropractic Care"— **no existen** (es el mismo agujero que ya tiene
el dropdown del nav, item 2 del TODO).

Apuntarlas al slug que *debería* existir habría metido **5 404 nuevos en las 30
páginas del sitio**. Apuntarlas a `/care-hub` no rompe nada y no miente: el hub
tiene la grilla de Areas of Care y cubre esos seis temas. Cuando las páginas
existan son 6 ediciones de link, y están anotadas en el TODO.

### 5. El lockup de Colorado Shockwave trae el fondo horneado

El asset que había (`colorado-shockwave-mark-teal.png`) es **sólo el símbolo**,
en teal y casi cuadrado; el Figma pide el **lockup horizontal** con el wordmark
en claro. Se exportó del nodo `1183:700` a 3× y se subió como
**`colorado-shockwave-lockup-on-forest.png`** (`6ab67c67b45e2cd250ef3c05`,
708×204, 20KB).

**Sale con el verde `#262f23` horneado y eso es a propósito.** El nodo de Figma
no es transparente, y recortar el fondo a mano deja fleco verde en el
antialiasing de un wordmark fino. Como el footer es exactamente ese verde, el
resultado en su lugar es idéntico y sin artefactos. **El nombre lo dice para que
nadie lo reuse sobre otro fondo**: si el footer cambia de color, este asset hay
que rehacerlo.

## Responsive — escrito, NO medido

| Clase | Base | medium (≤991) | small (≤767) |
| --- | --- | --- | --- |
| `.footer_nav` | 4 col, gap 5rem | **2 col**, gap 2.5rem | **1 col** |
| `.footer_brand` | 3 col | **1 col**, row-gap 2.5rem | — |
| `.footer_credits` | space-between | wrap (ya en base) | — |
| `.footer-brand_link` | 21.625rem | — | **16rem** |

**Falta correr `/responsive`.** Y hay un tap target a mirar: los `footer-link`
son texto sin padding vertical, o sea ~21px de alto contra el mínimo de 44 —
es el hallazgo que `RESPONSIVE.md` ya tenía anotado para los footer-links
viejos y que **este rebuild no resolvió**. Las píldoras sociales sí: 2.75rem.

## Lo que quedó sin resolver

- ~~**Las 4 URLs sociales.**~~ **Aplicadas el 2026-09-27**, con las URLs del
  Master Copy v0.36: `instagram.com/schwabechiro`,
  `facebook.com/SchwabeChiropractic`, `youtube.com/@schwabechiropractic` y
  `linkedin.com/company/schwabechiropractic`. Verificadas en el HTML publicado.

  **La trampa que casi las deja muertas igual**: cada pill guardaba el destino
  en **dos lugares** — el setting `link` y un **atributo `href="#"` literal**.
  Un atributo custom se escribe sobre el elemento al publicar, así que le gana
  al setting. Escribir el link nuevo y no borrar el atributo habría devuelto
  `success` cuatro veces y dejado los cuatro links en `#`.

  **La regla: en este footer, un link tiene href en dos lugares.** Vale para
  los 21 `footer-link`, no sólo para los sociales — hay que mirar `attributes`
  además de `settings.link` antes de dar un destino por bueno.
- **Las 6 páginas de Care** (ver arriba). **Ojo**: el 2026-09-27 el Care Hub
  se mudó de `/care-hub` a **`/care`**, así que esos 6 links quedaron en 404
  por unos minutos. Se repararon pasándolos a **link de página** en vez de URL
  literal — que es lo que deberían haber sido desde el principio, porque un
  link de página sigue a la página cuando se mueve. Los otros 12 `footer-link`
  siguen siendo URL literal y tienen el mismo agujero.
- **El año del copyright está hardcodeado en 2026.** El footer viejo tenía un
  `<span data-footer-year>` que **ningún JS del repo lee** (grepeado): era
  decorativo y decía 2025. No se reintrodujo. Si se quiere dinámico, es un
  `data-footer-year` más tres líneas en `global.js`.
- **Clases huérfanas de MAST**: `footer-text`, `footer-legal`,
  `footer-logo_link`, `footer-list`, `footer-social_list` y
  `footer-social_link` ya no tienen consumidor en el sitio del cliente. No se
  borraron porque las páginas demo de MAST pueden usarlas — hay que verificar
  antes.
