# Area of Care card — el estado invertido

## Qué hace

Las seis cards de la grilla **Areas of Care** (`/care`) se invierten a
Brand/Ink con texto beige cuando el puntero entra o cuando el foco de teclado
cae adentro. En touch no se invierte ninguna.

| Estado | Dónde vive |
| --- | --- |
| Reposo (card beige, borde Border Strong) | Designer, clase `.area-card` |
| Invertido | `src/styles/area-card.css`, importado desde `global.js` |

## Por qué el invertido no puede ir en el Designer

Es el mismo límite que el hover del Button: **Webflow no puede estilar un hijo
en el hover del padre**. El título, el párrafo y el botón viven adentro de la
card, y los tres tienen que cambiar de color. Por eso hay stylesheet y no sólo
un estado hover en el Designer.

## Por qué es hover y no una card destacada

El Figma dibuja **una** de las seis (Back & Neck Pain) sobre Brand/Ink y no
aclara si es un estado o una card destacada. Derek lo preguntó directo:
*"Is the darker background just a 'mouse over' effect? how would this work on
mobile?"*. La respuesta que se tomó es **hover**, por dos razones:

1. Una card permanentemente oscura **privilegia un área de care sobre las otras
   cinco sin razón editorial**. Nada en la copy hace de Back & Neck Pain el
   área principal; es sencillamente la card sobre la que el mockup demostró el
   estado.
2. Un hover tiene una respuesta definida en touch — no corre — mientras que una
   card destacada obligaría a decidir **cuál** se destaca en cada página futura
   que reuse la grilla.

O sea que la respuesta a *"how would this work on mobile?"* es: **no corre, y
no se pierde nada**, porque el estado no comunica ninguna información que la
card no muestre ya.

## El domo se queda claro en los dos estados

A propósito. Los seis iconos son line art de un solo color y **no tienen
variante para fondo oscuro**: invertir el domo los dejaría invisibles. Contra
la card ink el domo beige-muted se lee como una ventana iluminada, que es
además lo que muestra el Figma.

## El alcance

- **Sólo punteros reales** (`@media (hover: hover) and (pointer: fine)`). En
  touch `:hover` se queda pegado después del tap y la card quedaría invertida
  sin salida — la misma trampa que documenta `BUTTON-HOVER.md`.
- **`:focus-within` va FUERA del media query**, a propósito: el foco de teclado
  tiene que mostrar el mismo estado en todos los dispositivos. Dispara cuando
  el link "Learn more" de adentro toma foco, y es lo que hace el estado
  alcanzable sin mouse.
- **`prefers-reduced-motion: reduce`** pone la transition en `0s`. La card
  igual se invierte; simplemente llega de golpe. Es un estado, no un apagado.

## El botón hay que nombrarlo aparte

El título y el párrafo heredan `color` de la card, así que las reglas de la
card ya los llevan. **El Button no**: el variant Secondary de MAST ata su texto
y su borde a una variable de Webflow, no a `currentColor`.

El selector repite el atributo — `[data-area-card][data-area-card]` — por
especificidad. Un descendiente con un solo atributo (0,1,0) **empata** con las
reglas de `.button` de MAST, y el empate lo decide el orden de carga de los
stylesheets, que este proyecto no controla. Mismo truco que `button.css`.

## Setup en Webflow

`data-area-card` está puesto en **la raíz de la definición** del componente
`Card / Area of Care` (`6bb30f46-…`), así que las seis instancias lo heredan.
No hay que ponerlo por instancia.

## Tuning

Arriba de `src/styles/area-card.css`, sobre `[data-area-card]`:

| Variable | Valor | Qué es |
| --- | --- | --- |
| `--area-dur` / `--area-ease` | `300ms` / `cubic-bezier(.165,.84,.44,1)` | Los de MAST, los mismos de `button.css`. La card lleva un Button adentro que ya transiciona con esos valores; igualarlos evita que el botón llegue antes que la card |
| `--area-bg-hover` | Brand/Ink | El fondo invertido |
| `--area-fg-hover` | Brand/Beige | Texto, y borde del botón |
| `--area-border-hover` | Brand/Ink | El borde de la card desaparece contra su propio fondo |

Sólo están los valores de llegada. Los de reposo son los que tiene
`.area-card` en el Designer — repetirlos acá sería una segunda copia libre de
desincronizarse.

## Sin anti-FOUC

Deliberado: acá no se oculta nada. La card en reposo es su estado estático, y
si este stylesheet no cargara la grilla se leería igual — simplemente nunca se
invertiría.

## ✅ Verificado corriendo en el navegador — 2026-09-29

**Este archivo decía que el CSS "no llega al sitio hasta bumpear el hash del
CDN" y que "las cards se ven en reposo y no se invierten nunca". Las dos cosas
quedaron viejas**: el bundle está publicado en `@970fb4b` desde hace tandas, y
el hover **funciona**.

Medido con Chrome headless por CDP a 1440 contra el sitio servido, con un
**mouse real** (`Input.dispatchMouseEvent`) — un `.dispatchEvent` sintético no
dispara `:hover` y habría dado un falso negativo:

| Qué | Reposo | Con hover |
| --- | --- | --- |
| Fondo de la card | Beige `rgb(251,250,248)` | **Ink `rgb(71,77,51)`** |
| Texto | Ink | **Beige** |
| Borde | Border Strong `rgb(202,205,183)` | **Ink** |
| Texto y borde del `Button` interno | Ink / Border Strong | **Beige / Beige** |

- `matchMedia('(hover: hover) and (pointer: fine)')` → **`true`**.
- **6 cards** con `data-area-card` en `/care`, y `data-area-card` **no aparece
  en ninguna otra página** del sitio.
- Hover sobre la primera: **sólo ella se invierte**; la segunda queda en reposo.
  O sea que la regla no sangra a sus hermanas.
- `[data-area-card]:hover` y `[data-area-card][data-area-card]:hover .button`
  están las dos **servidas** en `@970fb4b/dist/styles.css`.

### Lo único que queda por decidir

El hover pinta **Brand/Ink `#474d33`**, que es lo que este archivo declara a
propósito. El reporte de Pablo del 2026-09-29 describe la card del Figma como
**"forest oscuro"**, que sería `#262f23`. **No se pudo abrir el frame** para
dirimirlo. Si el Figma pide Forest, es cambiar `--area-bg-hover` y
`--area-border-hover` en `src/styles/area-card.css`; si pide Ink, no hay nada
que hacer.
