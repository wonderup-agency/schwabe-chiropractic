# cost

## Purpose

La section `cc-cost` ("The cost of waiting"). Se pinea por ~3 viewports y cuenta
la section como **una sola secuencia scrubeada**:

1. La banda de la foto **sube como cortina** y tapa el intro.
2. Las cuatro líneas emergen **de a una**, saliendo y volviendo a un blur.
3. La foto **deriva** detrás de ellas mientras tanto.

Un solo ScrollTrigger maneja los tres beats. El presupuesto son 2–3 pins por
viewport y esta section se lleva el de su pantalla entera.

## Webflow Setup

**Aplicado por MCP el 2026-09-15** en la **definición del componente**
`Section / The Cost of Waiting` (`aac5ca5e-…`), no por instancia.

| Atributo | Dónde |
| --- | --- |
| `data-component="cost"` | La `Section` con clase `cc-cost` |
| `data-cost-stage` | `.cost_stage` — **Div Block creado por MCP**, envuelve intro + band |
| `data-cost-intro` | `.cost_intro` |
| `data-cost-band` | `.cost_band` |
| `data-cost-media` | El `img.cc-media-abs` dentro del band |
| `data-cost-scrim` | `.cost-band_scrim` |
| `data-cost-lines` | `.cost-band_lines` — **el contenedor**, no las líneas |

`.cost_outro` **no lleva atributo** y no se anima: tiene el CTA de turno, que es
contenido crítico y no se revela nunca. Quedó **fuera** del stage a propósito.

**Las cuatro líneas no llevan atributo propio**: son instancias del componente
`Plain Text` de MAST y Webflow las rechaza (*"This element does not support
attributes"*), el mismo límite que `data-btn-icon` en `BUTTON-HOVER.md`. El JS
toma **los hijos directos** de `[data-cost-lines]`. Consecuencia: cualquier
elemento agregado a ese contenedor entra en la secuencia.

El `img` **sí** aceptó el atributo — es un elemento `Image` nativo, no una
`ComponentInstance`.

### Por qué hace falta el wrapper `[data-cost-stage]`

**En el DOM publicado, `.cost_intro` y `.cost_band` son hermanos en flujo
normal y nunca se solapan.** Ningún tween puede hacer que uno tape al otro si
no comparten una caja. El stage los apila en la misma celda de un grid.

Y el pin va **en el stage, no en la section**, por tres razones medidas:

1. La section mide `stage + outro`. Pinearla dejaría **un viewport muerto**
   entre el final del pin y el outro.
2. El `overflow: hidden` que esconde el band mientras espera abajo **también
   clipearía el outro**.
3. El stage mide exactamente `100dvh`, así que el pin arranca y termina donde
   corresponde.

## Behavior

- **Init**: espera la fuente (`onceLaidOut`), abre `gsap.matchMedia()` con tres
  ramas y, en la pineada, construye un timeline scrubeado con los tres beats.
- **Resize**: no se usa — `matchMedia` revierte lo suyo e `invalidateOnRefresh`
  recalcula lo que depende del viewport.
- **Breakpoint**: no se usa.

### Las tres ramas

| Rama | Condición | Qué hace |
| --- | --- | --- |
| Reduced | `prefers-reduced-motion: reduce` | Estado final. **Sin pin y sin cortina**: el CSS del stage está scopeado a `no-preference`, así que los tres bloques quedan en flujo normal |
| Sin pin | `motionOk` pero no `PINNABLE` | Las líneas entran con fade-up escalonado, `once`, y **se quedan** — en flujo no hay nada que las reemplace |
| Pineada | `(min-width: 768px) and (min-height: 600px)` + `motionOk` | Los tres beats |

### Beat 1 — la cortina

`.cost_band` va de `yPercent: 100` a `0` sobre `DUR.slow × 2`. El intro se va en
paralelo (`opacity` + `scale: 0.96`) y **termina antes** que el band, para que
en ningún frame se vea texto a través del borde de la cortina.

El `× 2` no es un número suelto: con `DUR.slow` sola la cortina ocupaba **12% de
un timeline de 6.3s** — el momento que justifica el pin se terminaba en el
primer octavo. Con el multiplicador queda cerca del 22%.

El handoff al beat 2 usa el **label `curtainClosed`**, no `'>'`. Con `'>'` la
primera línea se colgaba del último tween agregado (el del intro, que es más
corto) y entraba **antes de que la cortina cerrara**.

### Beat 2 — las líneas

Cada una entra (`opacity` + blur→0), sostiene `hold`, y sale. **Sin travel y
con ease `linear`**: un tween scrubeado no tiene duración propia, así que un
recorrido corto se lee como deriva y no como entrada (ver `statement.md` y
`motion-language.md`). El apilado más el blur ya distinguen el reemplazo; no
hace falta dirección. La cuarta
**se queda** (`keepLast`): si sale, el band termina vacío y el visitante lo ve
así mientras el pin suelta.

**`overlap: 0` es el único valor que cumple "nunca dos líneas visibles a la
vez".** Barrido contra el timeline real de 0 a 0.2: cualquier valor > 0 deja dos
por encima de `opacity` 0.01.

Las cuatro se apilan en la misma celda de grid. En flujo, cada una aparece a
distinta altura del band y se pierde el efecto — **y eso es exactamente lo que
pasaba** hasta el 2026-09-15: `[data-cost-lines]` (0,1,0) empataba con
`.cost-band_lines` de MAST (0,1,0) y el desempate lo decidía el orden de carga.
Medido, las líneas caían en 285 / 378 / 470 / 562 en vez de apilarse. El
selector lleva `[data-cost-stage]` adelante por especificidad, no por scope.

### Beat 3 — el parallax

Atado al **progreso del pin**, no al scroll de la página: mientras la section
está pineada el scroll no la mueve, así que un trigger aparte no tendría contra
qué correr.

El CSS le da a la foto un sobrante de `P%` arriba y abajo (`height: 100 + 2P`).
El tween mueve **±P% del alto del BAND**, que en `yPercent` de la **FOTO** es
`P / (1 + 2P/100)` — con P=8, ±6.9%. **Sin esa división se asoma el borde.**

El techo de 8% lo fija `motion-language.md`: más que eso se nota como efecto y
deja de leerse como profundidad.

**La dirección es un parámetro** (`parallaxInvert`), porque las dos dicen cosas
distintas y ninguna es incorrecta:

| Valor | La foto viaja | Se lee como |
| --- | --- | --- |
| `false` | hacia **abajo** al scrollear, contra el scroll | La foto queda atrás del marco: profundidad, está más lejos que el texto |
| `true` | hacia **arriba**, con el scroll pero más rápido | La foto está más cerca y empuja la banda hacia adelante |

Está en `true` desde el 2026-09-15, a pedido. El sobrante que reserva el CSS es
simétrico, así que invertir no puede exponer un borde — verificado: los huecos
se mantienen ≤ 0 en todo el recorrido en las dos direcciones.

### El pin no puede construirse a ciegas del resto de la página

Dos cosas que **no son tuning** y que rompieron el sitio publicado el
2026-09-15, reportadas como *"las animaciones están muy rotas, veo y después se
repite y raro"*:

1. **`refreshPriority: refreshOrder(wrapper)`** en todo trigger. Sin él, el
   componente que se construía primero no recibía la distancia de pin del de
   arriba. Medido en vivo: `cost` arrancaba en `7601` en vez de `8501` — 900px
   exactos, el spacer de `statement` — y se pineaba encima del CTA banner.
2. **Sin `anticipatePin`.** Adelanta el pin según la velocidad del scroll, y
   ese adelanto es un solapamiento con la section de arriba.

El detalle completo, incluido que la skill de GSAP documenta el signo de
`refreshPriority` al revés, está en `CONVENTIONS.md`.

## El contraste, y por qué el scrim se anima

El scrim de MAST es `rgba(0,0,0,.2)`. **Medido** sobre esta foto (nieve al
atardecer), con el texto oculto para no contaminar la muestra:

| Scrim | Contraste medio | p95 (peor caso) |
| --- | --- | --- |
| `.2` — el de MAST | 4.04:1 | **2.74:1 ❌** |
| `.45` — el nuestro | 7.16:1 | **5.24:1 ✅** |

WCAG AA pide **3.0:1** para texto de 24px o más; estas líneas son de 47px. Con
el scrim original, las zonas más claras de la nieve no llegan.

El scrim arranca en el valor de MAST y la animación lo lleva al máximo
**mientras la cortina cierra**: la foto entra limpia y se oscurece justo cuando
aparece el texto que tiene que leerse encima. Se anima `opacity`, no
`background-color` — lo primero es compositor puro.

## Anti-FOUC

Sí. Dos reglas, y una trampa que costó una regresión:

- **Las 4 líneas**: `opacity: 0` en `[data-cost-lines] > *`.
- **El band**: `opacity: 0`, y **NUNCA un `transform`**. Un
  `transform: translateY(100%)` en CSS **se compone** con el `yPercent` que
  escribe GSAP: medido, el band terminaba en
  `translate(0%, 100%) translate(0px, 900px)` — al doble de distancia, fuera de
  pantalla, con la section en blanco. La posición inicial de la cortina la pone
  `gsap.set()`; el CSS sólo evita el flash.
- **El intro y el outro no se ocultan.** El outro lleva el CTA de turno.

## Dependencies

- **GSAP core + ScrollTrigger**, vía `getGsap()` / `getPlugin()`. **No usa
  SplitText.** Si falta alguno: `console.warn` y return, markup estático.
- De `src/utils/motion.js`: `DUR`, `DIST`, `EASE`, `STAGGER`, `SCROLL`, `MQ`,
  `onceLaidOut`, `isDev`.
- `./styles/cost.css`.

## DOM Expectations

```
section.cc-cost[data-component="cost"]
├── .cost_stage[data-cost-stage]         ← Div Block creado por MCP
│   ├── .cost_intro[data-cost-intro]
│   └── .cost_band[data-cost-band]
│       ├── img.cc-media-abs[data-cost-media]
│       ├── .cost-band_scrim[data-cost-scrim]
│       └── .cost-band_lines[data-cost-lines]
│           └── .plain-text-component  ×4   ← hijos directos, sin atributo
└── .cost_outro                          ← sin atributo, no se anima
```

Sin `[data-cost-stage]`, sin `[data-cost-band]` o sin líneas, el componente sale
limpio: **no hay cortina posible y el markup estático se lee perfecto.**

## Tuning

Arriba de `src/components/cost.js`, en `COST`:

| Clave | Valor | Qué es |
| --- | --- | --- |
| `pin` | `'+=325%'` | Scroll que consume el pin |
| `curtain` | `2` | Multiplicador sobre `DUR.slow` para la cortina |
| `blur` | `12` | Blur de entrada y salida de cada línea, en px |
| `hold` | `0.5` | Cuánto sostiene cada línea |
| `overlap` | `0` | Solape entre líneas. **Sólo 0 cumple el criterio** |
| `parallax` | `8` | Magnitud de la deriva de la foto, en % del alto del band |
| `parallaxInvert` | `true` | Dirección de esa deriva (ver arriba) |
| `keepLast` | `true` | La 4ª línea se queda |

`--cost-scrim-max` (0.45) vive en `cost.css`, no acá: es CSS y no se puede
importar desde JS.

## Cómo se verificó

Medido con Chrome headless vía CDP el 2026-09-15, contra el **bundle real**:

| Check | Resultado |
| --- | --- |
| Un solo pin | ✅ |
| Foto con sobrante (ratio 1.160) | ✅ — con `[data-cost-media]` pelado daba 1.000 y una franja vacía de 62px |
| Nunca dos líneas visibles | ✅ |
| La cortina cierra antes de la 1ª línea | ✅ |
| El stage mide un viewport exacto | ✅ 900 = 900 |
| reduced-motion / mobile 390 / teléfono acostado | ✅ 0 pins |
| El CTA visible en todos los viewports | ✅ |
| Sin GSAP → markup estático, failsafe a 3s | ✅ 0 errores |
| Budget CPU 4×, 6s de scroll | ✅ mediana 16.6ms, p95 17.6ms, 0 frames >50ms, 0 long tasks |
| Las 4 líneas apiladas en el mismo punto | ✅ las cuatro en `top: 423.9` |
| Cero deriva vertical durante el pin | ✅ Δ = 0.0px |

El playground vive en `playground/cost-curtain/` (gitignored).
