# symptoms

## Purpose

El carrusel de **"Sound familiar?"** en la Home. Reemplaza la marquesina CSS
de MAST porque Derek (Pastel #4, 2026-10-09) pidió cosas que con keyframes no
se pueden hacer: arrastrar, pausar mientras interactúan, botón de pausa.

Creado el **2026-10-13**.

## Webflow Setup

En la **definición** de `Section / Sound Familiar` (`c36845cb-…`):

| Qué | Dónde |
| --- | --- |
| `data-component="symptoms"` | `.marquee-component.cc-symptoms` |
| **Una sola** `.marquee-group` | Las copias para el loop las clona el JS (aria-hidden + inert). No volver a duplicar el grupo en el Designer |
| 7 cards `.symptoms_card[data-symptom-card]` | Copy del Figma `974:1701`. Texto estático (ya no usa las props Text/Show viejas, que quedaron sin uso en la instancia) |
| `h3.symptoms_lead` + `p.symptoms_trigger` | Lead EB Garamond 500 2rem/1.2, trigger 1.125rem/1.5 (1.625rem / 1rem en mobile) |
| `.symptoms_card.cc-dark` | La card "You're quietly starting to wonder", Forest Green con texto beige (Derek la quiere oscura, no es el hover) |

## Behavior

- Auto-scroll a 32px/s con `requestAnimationFrame`, loop sin salto (la
  posición se envuelve con el ancho de un grupo + gap).
- Drag con mouse (pointer capture), swipe en touch (sólo si el gesto es más
  horizontal que vertical; `touch-action: pan-y`), trackpad/shift+wheel
  horizontal. Al soltar hay un poco de inercia. El auto-scroll vuelve 3s
  después de la última interacción.
- Pausa con hover (mouse), con foco dentro y con el botón pausa/play que se
  inyecta debajo del carrusel (`.symptoms_toggle`, `aria-pressed`).
- `prefers-reduced-motion`: sin auto-scroll y sin botón; el row se puede
  arrastrar a mano.
- Todos los leads toman la altura del más alto (`--symptoms-lead-h`) para que
  los triggers arranquen en la misma línea. Se recalcula en resize.
- Fuera de pantalla el loop se detiene (IntersectionObserver).

## Notas

- `symptom-card.css` (global) sigue dando la rayita olive y el hover
  invertido.
- Sin JS (o antes del deploy) corre la animación CSS de MAST sobre un solo
  grupo: se ve un salto al final del loop.
