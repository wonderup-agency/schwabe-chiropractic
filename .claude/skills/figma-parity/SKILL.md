---
name: figma-parity
description: Compara una página de Schwabe en producción (schwabe.webflow.io) contra su frame de Figma, section por section, y deja los deltas registrados. Usar cuando Pablo pide "revisá la página X contra Figma", "qué diferencias ves", "que quede igual al Figma", o al arrancar la revisión de una página nueva. Corre /responsive al final.
---

# Paridad Figma ↔ prod, página por página

Método que se usó con la Home el 2026-10-01 y que Pablo pidió repetir en el
resto de las páginas. **La Home es la referencia general**: cuando un patrón de
otra página difiere del de la Home sin que el Figma lo pida, se lleva al de la
Home.

## 0. Antes de mirar

1. Leé `.claude/rules/TODO.md` y la sección de la página en `FIGMA-AUDIT.md`:
   muchos deltas ya están anotados o decididos.
2. Frame de la página: tabla *"Las 18 páginas"* de `FIGMA-AUDIT.md`
   (archivo `erUTGKdYCcmvlPiKW4MZMf`, canvas `1237:9927`).
3. Mirá `lastUpdated` de la página (`data_pages_tool > list_pages`). Si alguien
   la editó hoy, **preguntá antes de publicar**: el publish arrastra sus cambios.

## 1. Las dos capturas

| Lado | Cómo |
| --- | --- |
| Figma | `get_metadata` del frame → hijos de primer nivel con su `y`/`height` (el archivo es grande: procesalo con python, no lo leas entero). `get_screenshot` del frame con `maxDimension` = alto del frame, o sea **escala 1** |
| Prod | `node scripts/shot.js <slug> prod.png` → captura 1440 de página completa **después de scrollear toda la página** (si no, los `data-anim` salen vacíos) + el mapa de sections con su `y` |

## 2. Hojas lado a lado, una por section

Armá `pairs.json` emparejando las sections por orden y rango de `y`, y corré
`python3 scripts/compare.py fig.png prod.png pairs.json sheets/`. **Leé todas
las hojas**, no elijas cuáles: la vez que se eligió, `#meet-your-doctor` quedó
sin mirar.

Por cada section anotá: layout/orden, tipografía (familia, no sólo itálica),
colores de fondo y bordes, imágenes, botones (variante + disco + flecha),
líneas/filetes, y textos.

## 3. Pasada de detalle a 2×

Lo que a escala 1 no se ve: bordes de 1–2px, discos de flecha, filetes. Recortá
la zona en los dos lados a 2× (`deviceScaleFactor: 2` en prod; recorte del PNG
del Figma ampliado). **Mirá el hover** de cada botón con un mouse real
(`page.mouse.move`), no con `dispatchEvent`.

## 4. El catálogo de errores que ya aparecieron (buscalos siempre)

| Patrón | Cómo se detecta | Arreglo de referencia |
| --- | --- | --- |
| **Costura de 1px** entre una banda `absolute` y la section siguiente | Sólo a DPR 1.25/1.5 (Macs escalados). `node scripts/seam.js <slug> <selector>` | `margin-top: -1px` en la section de abajo (Home: `.section.cc-fee-bar`) |
| **Botón sin flecha o con disco del color equivocado** | `node scripts/buttons.js` agrupa todos los botones con flecha; los que **no** tienen flecha no salen ahí, buscalos en la hoja | Props del `Button`: `Right Icon Class` = `ph ph-arrow-up-right` + `Right Icon Modifier` (`cc-circle-olive` sobre píldora clara, `cc-circle` sobre olive, `cc-circle-teal` en Shockwave) |
| **Hover que cambia el color de marca** (teal → olive) | Captura reposo vs hover | `src/styles/button.css`, bloque `.cc-slate`/`.cc-teal`. Requiere deploy |
| **Algo que se ve en prod pero no en el Designer** | Es un `::before`/CSS del bundle del CDN | Decidir si pasa a elemento real; si sí, sacarlo del CSS **en el mismo release** |
| **Pasos con número + línea vertical en mobile** | A 390: el número no debe ir apilado y centrado arriba del texto, y la línea no puede cruzar el texto | Patrón Home `#plan`: número en columna de **3rem**, gap **1rem**, línea centrada bajo el número (`left: 1.5rem`). Aplicado también a Four Things *Stacked* y *Stacked Light* |
| **Remate/cita en la familia equivocada** | Figma dice EB Garamond Italic; prod sale DM Sans italic | `font-family` = `Fonts/Secondary Font`, no sólo `font-style` |
| **Mapa sin interacción** | — | `find-us_overlay`: link absoluto con overlay al hover y pill "Open Google Maps"; visible siempre en ≤991 |
| **Slider en mobile, grid en desktop** (pedido del cliente en Our Story) | El MAST slider arranca en todos los anchos | Collection List con grid en Webflow + fallback scroll-snap en ≤767, y `clinic-slider.js` que monta Swiper sólo bajo 768. Ver `components/clinic-slider.md` |
| **Collection List dentro de un componente** | El MCP no ve los campos ni deja bindear | Ponerlo a nivel página (ancla temporal para moverlo entre instancias) |
| **Section interna más angosta (1200)** | Figma con contenido en x120 y prod en x40 | `max-width: 75rem` + margin auto en el grid de la section |
| **Tamaño de Plain Text por instancia** | El prop `Class` de Plain Text cae en el wrapper; la variante de tamaño está en el `.plain-text` interno | Prop string en el componente padre bindeado al `Class`, y la custom property `--_typography---<size>--font-size` redefinida en el wrapper desde `src/styles/plain-text.css` (requiere deploy). Color: combo en el wrapper, hereda |
| **Link interno a `/about/*`** | `grep` de `href="/about/` en el HTML publicado | Los slugs se movieron el 2026-09-27: `/our-story`, `/team`, `/community-partners` |

## 5. Trampas de medición

- Un elemento con `data-anim` medido fuera de viewport da `scaleX(0)` o
  `opacity: 0`: **llevalo a viewport** antes de concluir que falta.
- Las sections **pineadas** (`statement`, `cost`) salen vacías en una captura
  de página completa. No es un faltante; confirmalo scrolleando.
- Las marquesinas y los sliders desbordan a propósito: falsos positivos.
- Antes de tocar una clase base, **contá en cuántas páginas vive**. Si es más
  de una, va combo o variante.
- `"success"` del MCP no garantiza nada: leé de vuelta.

## 6. Aplicar, publicar, medir

1. Mostrale a Pablo la lista de deltas y dejá que marque los suyos (él ve cosas
   que el diff no: así salieron la costura y las flechas).
2. Aplicá, publicá a `webflow.io` (con su OK si la página tiene ediciones
   ajenas) y **medí renderizado** cada cambio.
3. **`/responsive` obligatorio** sobre las sections tocadas:
   `node scripts/probe.js <slug> "#sel1,#sel2"`. Imprime sólo lo que falla.

## 7. Registrar

- Una fila por delta en `TODO.md` con las cuatro columnas.
- Una sección `## <página> · <fecha>` en `FIGMA-AUDIT.md` con lo medido.
- Si apareció un patrón nuevo, sumalo a la tabla del paso 4 **de este archivo**.
