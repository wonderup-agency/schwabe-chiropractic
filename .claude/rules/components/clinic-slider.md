# clinic-slider

## Purpose

Our Story · `#our-clinic`. Las 6 cards de la clínica (**estáticas** en el
Designer desde el 2026-10-01; antes salían de la colección *Clinic Features*) van en **grid en desktop y slider en mobile**, como pidió el
cliente en el comentario del Figma del 2026-10-01. Este componente sólo monta
Swiper **bajo 768** y lo destruye arriba, así el Designer manda en el resto.

No es el MAST slider: `slider.js` de MAST inicia todo `[data-slider="slider"]`
en todos los anchos.

## Webflow Setup

Section a nivel página, entre *The Space* y *Find Us*.

| Elemento | Clase / atributo |
| --- | --- |
| Section | `section cc-clinic` |
| Raíz del componente | `.clinic_inner` + `data-component="clinic-slider"` |
| Contenedor | `.clinic_list` (contenedor de Swiper) |
| Lista | `.clinic_items` con `role="list"` (wrapper de Swiper) |
| Card | `.clinic_item` con `role="listitem"` (slide) |
| Flechas | `button.button.cc-slider-nav.cc-light` con `data-clinic="prev"` / `"next"` dentro de `.clinic_nav` |

Para sumar, sacar o reordenar cards se duplica o mueve un `.clinic_item` en el
Designer. El JS no depende de cuántas haya.

## Behavior

- **≤767**: espera a `window.Swiper` (lo carga el `<head>` del sitio, swiper@11),
  agrega `.is-slider` a la raíz y monta Swiper con `wrapperClass: clinic_items`
  y `slideClass: clinic_item`. 1.15 slides (1.6 a ≥480), gap 16/20, teclado,
  a11y con `slideRole: listitem` para no romper la lista.
- **≥768**: `destroy(true, true)` y limpia los `aria-label` que deja Swiper.
- Escucha el `change` del media query, no el resize.

## Fallback sin JS

Webflow ya deja en ≤767 una fila con `overflow-x: auto` y scroll-snap, items al
85% y `.clinic_nav` en `display: none`. Si el bundle no carga o Swiper falla,
se sigue pudiendo deslizar y no quedan flechas muertas.

## CSS

`styles/clinic-slider.css`, sólo bajo `.is-slider`: saca el scroll nativo, pone
el wrapper en flex sin gap (Swiper maneja el espacio), muestra las flechas y
atenúa la deshabilitada.

## Dependencies

Swiper 11 global (head del sitio). `MQ.mobileDown` de `utils/motion.js`.
