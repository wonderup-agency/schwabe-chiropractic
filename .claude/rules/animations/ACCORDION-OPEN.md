# Accordion — el estado abierto

## Qué hace

El accordion de MAST, redibujado contra el Figma de Schwabe. Cerrado y abierto
viven en lugares distintos y eso no es una elección:

| Estado | Dónde vive |
| --- | --- |
| Cerrado | Designer de Webflow, en las clases globales de MAST |
| Abierto | `src/styles/accordion.css`, importado desde `global.js` |

## Por qué el abierto no puede ir en el Designer

El `Accordion` de MAST es un `<details>` nativo: `.accordion-component` es el
`details`, `.accordion-trigger` el `summary`, y `.accordion-icon` un `<svg>`
adentro del summary.

El interruptor es **`[open]` en el padre** y lo que tiene que cambiar es un
**hijo**. El Designer no tiene estado `[open]` y no escribe selectores de
descendencia. Son las únicas tres reglas del accordion que están en código.

`prefers-color-scheme` no entra acá: los tokens son los de marca, no los del
theme.

## Lo que sí quedó en el Designer

Aplicado el 2026-09-14 sobre las clases **base** de MAST, no sobre un variant.
Se eligió la base porque las únicas instancias reales del sitio son las de
New Patients (7) y FAQ (**1 sola**, dentro de un Collection List — ver abajo);
las otras 9 están en las páginas demo de MAST
(`/components`, `/basic-layouts`, `/inspired-layouts`), que no son el sitio del
cliente.

| Clase | Antes (MAST) | Ahora (Figma) |
| --- | --- | --- |
| `.accordion-component` | caja con borde en los 4 lados + radio 0.5rem | sólo `border-top` 1px `Divider On Light`, radio 0 |
| `.accordion-trigger` | padding por variable en los 4 lados | `1.5rem 0` (y `1.25rem 0` en small) |
| `.accordion-content` | padding lateral por variable | `0` |
| `.accordion-icon` | 2em, sin borde ni fondo | 1.75rem, borde 1px, `border-radius: 50%`, color Olive Green, `box-sizing: border-box` y padding `0.3125rem` para que el `+` quede en ~11px |

El divisor de abajo del último ítem no es del accordion: lo pone
`.accordion_list` con su `border-bottom`.

## `Preview in Designer` + `Group Name` se pelean en producción

Bug real, encontrado el 2026-09-14 en el sitio publicado: **los 44 `<details>`
del FAQ y los 7 de New Patients salían con `open=""` en el HTML**. El síntoma
que se ve es que clickear abre y cierra de forma errática.

Los dos props que chocan:

- **`Preview in Designer`** (default `true`) no es sólo del canvas: emite
  `open=""` en el HTML publicado.
- **`Group Name`** no es sólo de accesibilidad, aunque el tooltip de MAST lo
  presente así. Emite el atributo **`name`** del `<details>`, que es la
  exclusividad nativa del navegador: uno solo abierto por grupo.

El JS de MAST (`accordion.min.js`) arranca con:

```js
document.querySelectorAll("details[open]").forEach(e => {
  if (e.getAttribute("data-accordion-start-open") !== "true") e.removeAttribute("open")
})
```

Es decir, **cuenta con cerrar los que sobran** — pero el navegador ya colapsó
cada grupo `name` durante el parseo, antes de que el script corra. El JS
normaliza un estado que ya no es el que él supone, y a partir de ahí las alturas
inline que anima quedan desfasadas del `open` real.

**El arreglo**: `Preview in Designer: false` en toda instancia que deba arrancar
cerrada, así el HTML sale con **exactamente un `open` por grupo** — el que
corresponde. Aplicado a 47 instancias (40 FAQ + 7 New Patients); las 4 del FAQ
con `Default Open on Live Page: true` lo conservan en `true`.

**Actualización 2026-09-17**: el FAQ dejó de tener 44 instancias estáticas. Ahora
son **6 Collection Lists** (una por categoría) con **una sola instancia de
Accordion cada una**, bindeada al CMS. El bug de arriba quedó estructuralmente
resuelto: `Preview in Designer` se apaga **una vez por lista**, no 44 veces.
Medido post-publish: **0 `<details open>` en el HTML** de `/faq`.

**El acople a tener presente**: `Default Open on Live Page` sólo emite
`data-accordion-start-open="true"`, y el JS **nunca agrega `open`** — sólo evita
sacarlo. O sea que un accordion que deba arrancar abierto necesita **los dos
props en `true`**. Poner sólo `Default Open` no hace nada.

## El tamaño del título

Las instancias llevan el prop **`Size` = H6** (20px) como override. La
default del componente sigue siendo H4 (32px) y **el MCP no puede cambiar el
default de un prop tipo `variant`** — por eso son 51 overrides y no uno.

Consecuencia práctica: un accordion **duplicado** desde otro hereda el override
y sale bien; uno arrastrado nuevo desde el panel de componentes sale en H4 y hay
que bajarlo a H6 a mano.

**El MCP sí puede setear ese override en una instancia**, aunque el prop sea de
tipo `variant`: se manda por `set_component_instance_prop_values` con
`type: "string"` y el **id del variant** como valor (H6 =
`3fee1e3d-0e23-2506-6d0c-d4910fcae199`). Lo que el MCP no puede cambiar es el
**default del prop en la definición**. Verificado el 2026-09-17 sobre los 6
templates del FAQ.

## El trigger no puede ser texto seleccionable

Reportado por Pablo el **2026-09-23** como *"si hago click en el texto de la
pregunta es como que se abre y se cierra"*, con captura de la palabra
*evidence* resaltada.

**No era el accordion fallando.** Medido por CDP contra staging: un click
simple abre, un segundo cierra, un tercero reabre, cambiar de pregunta cierra
la anterior, y el tap en touch a 390px abre — las seis secuencias correctas, un
solo `toggle` por click, `target=SUMMARY`.

Lo que falla es el **doble click**. `.accordion-trigger` tenía
`user-select: auto`, así que un doble click sobre la pregunta **selecciona la
palabra** (medido: `getSelection()` devuelve `"happens"`) y de paso dispara dos
clicks, o sea dos toggles. El resultado se lee como *"se abre y se cierra"*, y
queda el texto resaltado encima.

**El arreglo**: `user-select: none` en `.accordion-trigger`, en el Designer. Un
trigger de accordion es un control, no un párrafo para copiar; el contenido de
la respuesta sigue siendo seleccionable, que es lo que alguien querría copiar.

Toca la clase base de MAST, así que alcanza a los accordions de FAQ, New
Patients, Wellness y Sports Injuries, más las páginas demo de MAST. Es el mismo
precedente deliberado que el resto de este archivo.

**`-webkit-user-select` no se puede escribir por MCP** — `update_style` lo
rechaza con *"Invalid style property"*. Sólo entra la propiedad estándar; el
prefijo lo agrega Webflow al publicar. **Verificar en Safari después del
publish.**

**La misma regla se aplicó a los otros dos triggers del sitio**, que tenían el
mismo agujero: `.job-card_summary` (las vacantes de Join Our Team, en
`src/styles/job-card.css`) y `[data-plan-step][role='button']` (los pasos de
`#plan`, en `src/components/styles/plan.css`). En `plan` va **dentro de la
media query que cablea los handlers**: donde no hay click, el texto sigue
siendo copy y se puede seleccionar.

## El `−` es un background, no un glifo

El `<svg>` trae un único `path` con forma de `+`. No hay forma de convertir eso
en un `−` con transform: los 45° de MAST lo dejan en `×`.

La solución es pintar la barra con `background-image: linear-gradient(...)`
sobre la misma caja del svg y esconder el `path` con `opacity: 0`.
**No sirve un pseudo-elemento**: `::before` / `::after` no generan caja en
elementos reemplazados, y un `<svg>` inline lo es.

Por eso también está el `transform: none`: el estado abierto de MAST rota el
icono 45°, y sin eso la barra saldría en diagonal.

## Pendiente de deploy

El CSS **no llega al sitio hasta que**:

1. `npm run build`
2. commit de `dist/` y push
3. **se bumpee el hash pinneado del CDN en Webflow** — el sitio carga
   `...schwabe-chiropractic@ebd7d03/dist/`, no `@main`. Ver `RESPONSIVE.md`.

Hasta entonces el cerrado se ve bien y el abierto muestra el `+` rotado de MAST.

## Tuning

Arriba de `src/styles/accordion.css`, sobre `.accordion-component`:

| Variable | Valor | Qué es |
| --- | --- | --- |
| `--acc-dur` / `--acc-ease` | `300ms` / `cubic-bezier(.165,.84,.44,1)` | Los mismos de MAST y de `button.css` |
| `--acc-open-bg` / `--acc-open-fg` | Olive Green / Beige | El disco lleno y el `−` |
| `--acc-bar-width` / `--acc-bar-height` | `12px` / `1.5px` | La barra. 1.5 y no 1 porque sobre un disco lleno un hairline se lee más fino |

## Sin anti-FOUC

Deliberado: nada se oculta. El reposo es el estado estático del accordion.
