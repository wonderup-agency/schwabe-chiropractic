# El lenguaje de movimiento de Schwabe

Los valores viven en `src/utils/motion.js`. Este archivo explica **por qué** son
esos y cuándo usar cada uno. Un sitio se siente profesional cuando todas sus
animaciones parecen escritas por la misma persona el mismo día; eso no sale de
tener buen gusto en cada tween aislado, sale de tener un sistema.

## El carácter

Es una práctica quiropráctica. El visitante llega con dolor y con dudas, y la
decisión que tiene que tomar es confiar. El movimiento tiene que leer como
**calmo, preciso y competente** — el equivalente en animación de un consultorio
ordenado.

Traducción operativa:

- **Sin bounce, sin elastic, sin overshoot.** En ningún lugar del sitio. Un
  `back.out` dice "startup divertida", no "profesional de la salud".
- **Nada tarda más de lo necesario.** El default es 0.5s. Si algo necesita 1.5s
  para leerse, casi siempre el problema es que se mueve demasiada distancia.
- **Una animación focal por viewport.** Si dos cosas compiten por la atención al
  mismo tiempo, ninguna la gana. Elegí una y que el resto acompañe.
- **Las entradas pasan una vez.** `once: true`. Re-animar al volver a scrollear
  hacia arriba lee como una página rota, no como un detalle.

## Duraciones — `DUR`

| Token | Valor | Para qué |
| --- | --- | --- |
| `instant` | 0.15 | Feedback que tiene que sentirse como respuesta directa al click |
| `quick` | 0.25 | Hover, carets, flips de estado chicos |
| `base` | 0.5 | **El default.** Todo lo que no tenga una razón para diferir |
| `slow` | 0.8 | Reveals de elementos grandes, máscaras de imagen |
| `hero` | 1.1 | El gesto grande, uno por página, solo al cargar |

Si dudás, es `base`.

## Eases — `EASE`

| Token | GSAP | Cuándo |
| --- | --- | --- |
| `out` | `power2.out` | **Default de entradas.** Arranca rápido y se asienta limpio |
| `in` | `power2.in` | Salidas, cosas que se van de pantalla |
| `inOut` | `power2.inOut` | Cambios de estado y movimientos de layout (Flip, tabs) |
| `soft` | `power1.out` | Fades de opacidad sola, parallax, cualquier cosa scrubbed |
| `expo` | `expo.out` | Solo el hero. Muy rápido al inicio, cola muy larga |
| `linear` | `none` | Valores atados a scrub y marquees. Nada más |

**Por qué `out` y no `inOut` en las entradas**: un `inOut` arranca lento, y una
entrada que arranca lento se siente pesada. El `inOut` se reserva para cuando
algo *se mueve de un lugar a otro* y las dos puntas importan.

**Los scrubs van `linear` o `soft`.** Un `power2.out` scrubbed pelea con el dedo
del visitante: él controla el progreso, y la curva le miente sobre dónde está.

**Y un tween scrubeado no lleva travel.** Esto es más fuerte que la regla del
ease y se descubrió midiendo, el 2026-09-15, con un bug reportado en
`cc-statement`: "cada línea se levanta un poquito cada vez que scrolleo, como
si se fuese acomodando raro".

Un scrub **no tiene duración propia** — su progreso es el scroll del visitante.
`DIST.sm` son 12px, y repartidos sobre los ~360px de scroll que ocupaba cada
palabra dan **0.03px por píxel scrolleado**: demasiado lento para leerse como
movimiento, y más que suficiente para leerse como que el texto nunca termina de
asentarse. Pasar el ease a `linear` sólo volvió la deriva **uniforme**; no la
sacó.

- **Travel → sólo en tweens que tienen su propia duración.** Una entrada
  `once: true`, un hover, un timeline que corre solo.
- **Scrub → `opacity`, `filter`, `scale`, o un recorrido largo y deliberado**
  (una cortina que cruza el viewport, un parallax). Lo que no sirve es un
  recorrido *corto*: es justo el rango donde el ojo no ve movimiento pero sí
  ve inestabilidad.
- El blur es el mejor compañero del scrub porque **no tiene posición**: no hay
  nada a lo que el ojo pueda anclarse, así que se lee como entrar en foco.

## Distancias — `DIST`

| Token | Valor | Para qué |
| --- | --- | --- |
| `sm` | 12px | Líneas de texto, items de lista, cards chicas |
| `md` | 24px | Cards, media, headers de sección |
| `lg` | 48px | Bloques full-width, el hero |

El viaje es **una pista de dirección, no un recorrido**. Si un elemento necesita
cruzar media pantalla para que lo noten, el problema es la jerarquía visual de la
sección, no la animación.

Parallax: máximo **±8%** de la altura del elemento. Más que eso se nota como
efecto y deja de leerse como profundidad.

## Stagger — `STAGGER`

| Token | Valor | Para qué |
| --- | --- | --- |
| `tight` | 0.04 | Líneas o palabras de un split. Tiene que leerse como **un** gesto |
| `base` | 0.08 | Cards, items de lista |
| `loose` | 0.14 | 2–3 elementos grandes donde cada uno merece su beat |

Cuidado con el largo total: 12 cards con `base` son casi un segundo solo de
stagger. Arriba de 8 elementos, usá `tight`, o `gsap.utils.distribute`, o
animá el contenedor en vez de los hijos.

## Scroll — `SCROLL`

- `start: 'top 85%'` — el default. El elemento entra cuando ya está claramente
  en vista. Disparar en `'top bottom'` significa que el visitante lo ve pasar por
  el borde de su visión periférica y se pierde la animación.
- `startLate: 'top 95%'` — para triggers que caen cerca del final del documento
  y con `85%` nunca llegarían a dispararse.
- `scrub: 1` — **nunca `scrub: true`**. El 1:1 con la rueda se siente crispado;
  el segundo de catch-up es exactamente lo que lo hace sentir caro.
- `once: true` en toda entrada.

## Qué no se anima nunca

- **`height`, `width`, `top`, `left`, `margin`.** Disparan layout en cada frame.
  Solo `transform` y `opacity`. La excepción real es el accordion, y ahí se usa
  el patrón de `height: auto` de GSAP, que mide una vez.
- **Cualquier cosa above the fold, en scroll.** El hero anima al cargar,
  inmediatamente. Un hero que espera scroll es una pantalla en blanco.
- **Texto letra por letra**, salvo un momento deliberado por sitio. Por líneas se
  lee; por letras se descifra.
- **El contenido que responde una duda.** El precio, la dirección, el teléfono,
  el botón de turno: aparecen. No se revelan.
- **Nada en `prefers-reduced-motion`.** Mismo estado final, duración 0, sin
  travel. El estado igual cambia; simplemente nada se mueve.

## El test final

Si la animación no ayuda a entender la página, no se shippea. "Se ve lindo" no
es una razón suficiente para un frame de trabajo del CPU del visitante.
