# announcement

## Purpose

Recuerda que un visitante cerró la barra de anuncio y lo respeta por **14
días**. Eso es todo lo que hace: **la barra la dibuja el Designer y se sirve
visible**; este componente sólo la **saca**.

Construido el **2026-09-28**, junto con el componente `Announcement Bar` de
Webflow.

## Por qué existe

El Master Copy especifica la barra entera en `# GLOBAL: Announcement Bar`, y
el markup del handoff trae el control:

```html
<div class="site-announcement" data-default-state="on" id="announcement-bar">
  <span>Now seeing patients at our new Platt Park clinic.
    <a href="https://maps.app.goo.gl/G92hGT21js2ZptsQ6">Get directions →</a></span>
  <button aria-label="Dismiss announcement" class="announcement-close">×</button>
</div>
```

Webflow puede dibujar la barra y el botón; **lo que no puede es acordarse**.
La persistencia es la mitad que necesita JS.

## Webflow Setup

Todo vive en el componente **`Announcement Bar`**
(`4f6985e3-501a-db32-6f10-b8ffe1b20f4f`, grupo `Global`), así que los
atributos están en la **definición** y las 19 instancias los heredan.

| Atributo | Dónde |
| --- | --- |
| `data-component="announcement"` | La raíz `.announcement` |
| `data-announcement="close"` | `.announcement_dismiss` |

Más `role="button"`, `tabindex="0"`, `aria-label="Dismiss announcement"` y
`aria-controls="announcement-bar"` en el control, escritos en el Designer. El
JS los vuelve a afirmar por si alguien los borra editando.

## Behavior

- **Init**: lee el localStorage. Si este visitante ya cerró **este mismo
  mensaje** y no pasaron 14 días, hace `bar.remove()` y sale. Si no, cablea el
  control.
- **Resize / Breakpoint**: no se usan. No mide nada.

### El descarte está atado al MENSAJE, no sólo al tiempo

`messageId()` hashea el texto de la barra y ese id va guardado junto con la
fecha. Es deliberado: el día que la clínica edite el anuncio desde Build Mode
**es otro anuncio**, y alguien que cerró el anterior nunca vio el nuevo.
Guardando sólo la fecha, el mensaje nuevo quedaría tapado hasta dos semanas.

### El control no es un `<button>`

**Webflow purga un `<button>` creado fuera de un `<form>`** (`webflow-build`
§8) — el mismo límite que ya moldeó `filter.js` y `share.js`. Es un `div` con
`role="button"` y `tabindex="0"`, así que Enter y Espacio los maneja este
archivo (con `preventDefault` en el espacio, o la página scrollea) y el focus
ring lo pone `announcement.css`.

### `localStorage` puede tirar, y se asume

Una ventana privada, site data bloqueada o un navegador in-app pueden hacer
fallar **hasta la lectura**. Las dos vías van en `try/catch` y el fallo cae
hacia el lado seguro: **la barra se muestra**. Si falla la escritura, el
anuncio vuelve en la próxima visita — es un fallo más chico que no dejar
cerrarlo ahora.

### Se hace `remove()`, no `display: none`

Un `hidden` o una clase pelearían con el `display: flex` de `.announcement`
por especificidad, y ese empate lo decide el orden de carga de los stylesheets
—que no controlamos— exactamente como pasó con `cost-band_lines`. Sacar el
elemento no tiene ese problema y no deja residuo de layout.

## Anti-FOUC

**No lleva, y es el punto entero.** La barra se sirve **visible** y el
componente sólo la saca. Ocultarla por defecto y revelarla por JS significaría
que un bundle que no llega **esconde el anuncio para todo el mundo**, que es lo
contrario de para qué existe un anuncio.

**El precio, escrito para que nadie lo descubra solo**: un visitante que ya la
cerró la ve durante los pocos frames entre el primer paint y la corrida del
módulo, y la página salta hacia arriba cuando desaparece. Es un CLS real y
medible.

**La salida, si algún día molesta**, es un `<script>` bloqueante en el `<head>`
que lea el localStorage y estampe una clase en `<html>`, con el CSS ocultando
la barra desde antes del primer paint. Vive en el `HtmlEmbed` de MAST y **el
MCP no edita embeds**, así que es un cambio a mano en el Designer.

## Dependencies

- **Ninguna librería.** No usa GSAP.
- `./styles/announcement.css`.

## DOM Expectations

```
.announcement[data-component="announcement"]      ← la banda, Brand/Ink
├── .announcement_inner
│   ├── div                                        "Now seeing patients at…"
│   └── a.announcement_link                        → Google Maps
│       ├── div                                    "Get directions"
│       └── span.ph.ph-arrow-up-right
└── .announcement_dismiss[data-announcement="close"]
    └── span.ph.ph-x
```

Sin `[data-announcement="close"]` adentro, el componente respeta un descarte
previo y no cablea nada — una barra sin control es un aviso y se queda.

## Tuning

Arriba de `src/components/announcement.js`:

| Constante | Valor | Qué es |
| --- | --- | --- |
| `STORE_KEY` | `schwabe:announcement` | La clave de localStorage |
| `DISMISS_DAYS` | `14` | Los ~14 días que pide el Master Copy |

## Cómo se verificó

### La barra: medida en el navegador, 2026-09-28

Publicado y medido con Chrome headless por CDP contra el sitio servido — el MCP
de Chrome DevTools sigue caído, así que es la receta de `RESPONSIVE.md`.

| Check | Resultado |
| --- | --- |
| Fondo | ✅ `rgb(71,77,51)` = `#474d33` Brand/Ink, exacto al Figma |
| Texto | ✅ Beige `rgb(251,250,248)`, **DM Sans 500**, 16px |
| Filete del link | ✅ **2px `rgb(202,205,183)`** = Border Strong, exacto |
| La barra va ARRIBA del nav | ✅ `barTop: 0`, `navTop: 53` — y el nav **no** creció |
| Presente en las páginas reales | ✅ **19 de 19**, con dismiss y el link de Maps |

### Los siete perfiles

| Perfil | Alto | Líneas | Tap target | Solape con el control | Overflow | hScroll |
| --- | --- | --- | --- | --- | --- | --- |
| 1440 | 53 | 1 | 44×53 | no | 0 | ✅ |
| 1024 iPad landscape | 53 | 1 | 44×53 | no | 0 | ✅ |
| 844×390 teléfono acostado | 53 | 1 | 44×53 | no | 0 | ✅ |
| 768 iPad portrait | 53 | 1 | 44×53 | no | 0 | ✅ |
| 430 | 74 | 2 | 44×74 | no | 0 | ✅ |
| 390 | 94 | 3 | 44×94 | no | 0 | ✅ |
| 320 | 94 | 3 | 44×94 | no | 0 | ✅ |

**Cero scroll horizontal y cero elemento desbordando en los siete.** El tap
target cumple el mínimo de 44 en todos, que es lo que fija `RESPONSIVE.md`.

**El dato a tener presente: a 390 y a 320 la barra mide 94px** porque la frase
más el CTA envuelven en tres líneas. Son ~11% del viewport de un teléfono. No
es chrome fijo — la barra scrollea y se va, justamente por eso quedó afuera del
`.nav` pegajoso — pero si alguna vez el mensaje se alarga, esto crece con él.

### Lo que NO está verificado

**El componente de JS nunca corrió en un navegador.** El código está lintado,
formateado y registrado, pero no existe en el sitio hasta `npm run build` +
push + **bumpear el hash del CDN**.

Falta medir: que el descarte persista y expire a los 14 días, que un mensaje
nuevo vuelva a aparecer aunque el anterior esté descartado, que Enter y Espacio
cierren, que una ventana privada no rompa nada, y el salto de layout al remover.
