# statement

## Purpose

La section `cc-statement` ("You do not need another guess."). Se pinea por un
viewport y revela los dos H2 **palabra por palabra, saliendo de un blur**,
scrubeado al progreso del pin.

Los dos headlines son la bisagra retórica de la Home: el visitante viene de
leer síntomas y acá se le nombra lo que realmente busca. El pin existe para que
esa frase ocupe la pantalla entera y no se pueda pasar de largo scrolleando.

## Webflow Setup

**Aplicado por MCP el 2026-09-15**, en la **definición del componente**
`Section / Statement` (`83be34f3-…`), no por instancia — así lo hereda toda
instancia futura.

| Atributo | Dónde |
| --- | --- |
| `data-component="statement"` | La `Section` con la clase `cc-statement` |
| `data-statement-lines` | `.statement_layout` — **el contenedor**, no las líneas |

**Por qué el hook está en el contenedor y no en cada línea**: los dos H2 son
instancias del componente `Heading` de MAST, y Webflow rechaza atributos ahí
(*"This element does not support attributes"*) — probado, no supuesto. Así que
el JS toma **los hijos directos** de `[data-statement-lines]`, que es la misma
forma que usa `reveal.js` para `data-anim="stagger"`.

Consecuencia práctica: **cualquier elemento que se agregue dentro de
`.statement_layout` entra en la animación**. Si alguna vez hace falta un tercer
bloque que no anime, hay que sacarlo del layout o darle su propio contenedor.

Nada más. No hay nodos inyectados.

## Behavior

- **Init**: espera a que la fuente cargue (`onceLaidOut`), abre un
  `gsap.matchMedia()` con tres ramas y, en la pineada, splitea los dos H2 por
  palabras y los ata a un timeline scrubeado.
- **Resize**: no se usa. `matchMedia` revierte lo suyo y el split es por
  palabras, así que un cambio de ancho no lo invalida.
- **Breakpoint**: no se usa, misma razón.

### Las tres ramas

| Rama | Condición | Qué hace |
| --- | --- | --- |
| Reduced | `prefers-reduced-motion: reduce` | `gsap.set` al estado final. Sin pin, sin travel, sin blur |
| Sin pin | `motionOk` pero no `PINNABLE` | Fade-up simple de los dos bloques, `once: true`, sin blur |
| Pineada | `(min-width: 768px) and (min-height: 600px)` + `motionOk` | Split + blur + pin scrubeado |

**El `min-height: 600px` no es decorativo.** Un teléfono acostado (844×390) cae
en el breakpoint **Tablet** de Webflow y pasaría un `min-width: 768px` pelado,
pero el nav sticky ya se come 70px de esos 390. Ver `.claude/rules/RESPONSIVE.md`.

### El split

`type: 'words'` y **nada de `mask`**. El mask envuelve cada palabra en un
wrapper con `overflow: clip`, y el blur sangra fuera de la caja de la palabra:
con mask se ve cortado por un borde duro.

`aria` queda en su default `'auto'`, que pone `aria-label` con la frase entera
en el contenedor y `aria-hidden` en cada palabra. El lector de pantalla lee la
oración, no 16 fragmentos.

**El `revert()` del split es a mano**, en el cleanup que devuelve el callback de
`matchMedia`: `mm.revert()` deshace tweens y triggers, pero el split reescribió
el DOM y eso hay que revertirlo con la instancia guardada — nunca con una nueva.

### Dos triggers, no uno

El pin y la revelación son **ScrollTriggers separados**, y tiene que ser así:
ScrollTrigger pinea el elemento **donde esté cuando el trigger arranca**, así
que un solo trigger con `start` temprano dejaría la section congelada a media
pantalla. Dos triggers es la única forma de que el texto empiece a aparecer
antes de que el pin empiece.

| Trigger | Rango | Qué hace |
| --- | --- | --- |
| Reveal | `top 35%` → `+= (0.35 + 0.4) × viewport` | Las palabras, scrubeado |
| Pin | `top top` → `+=(revealIntoPin + hold) × viewport` | Sostiene la frase mientras entra, y suelta |

`revealStart: 0.35` está **calibrado midiendo**. El texto está centrado en una
section de `100dvh`, o sea ~450px debajo de su borde superior; con `0.7` el
trigger disparaba mientras el texto seguía abajo del fold, y la primera palabra
llegaba a opacidad plena con la section todavía a 220px del top — se leía como
"ya pasó" en vez de "está llegando".

`revealIntoPin: 0.4` hace que la revelación **siga corriendo dentro del pin**.
Sin eso, las palabras terminarían antes de que el pin arranque y el pin entero
sería estático.

Medido a 1440×900: la primera palabra entra a `scrollY 620` (section a 280px del
top), llega a 1 cuando la section toca el top, y la última termina a `1280`,
380px dentro del pin.

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

### El pin dura lo que dura la revelación, y eso es un arreglo

Hasta el **2026-09-21** el pin era un `'+=100%'` fijo. La revelación termina
exactamente `revealIntoPin` (0.4) dentro del pin, así que el 0.6 de viewport
restante —**~540px a 900 de alto**— era scroll con la frase ya completa y nada
moviéndose. Reportado como querer poder seguir scrolleando una vez que el texto
terminó de aparecer.

Ahora el `end` se **deriva**:

```js
end: () => `+=${window.innerHeight * (STATEMENT.revealIntoPin + STATEMENT.hold)}`
```

Con `hold: 0` el pin suelta en el frame en que aterriza la última palabra.
**Derivarlo en vez de escribir un número es lo que impide que los dos se
desincronicen**: si algún día sube `revealIntoPin`, el pin lo sigue solo.

Consecuencia: el spacer del pin pasa de ~900px a ~360px, o sea que **todo lo
que está abajo sube ~540px**. `cost` recibe esa distancia por
`refreshPriority: refreshOrder(wrapper)`, que es exactamente para lo que está
—ver `CONVENTIONS.md`— así que no hay que tocar nada más. Pero es un cambio de
alto de página: conviene mirar que el CTA banner y `cost` no se solapen.

### El estado inicial se fuerza a mano

```js
gsap.set(line, { opacity: 1 })
gsap.set(split.words, { opacity: 0, filter: `blur(...)` })
```

El segundo `set` **no es redundante** con el `fromTo`. El CSS anti-FOUC oculta
el contenedor, no las palabras — no existían cuando ese CSS aplicó. Y un
`fromTo` colocado más adelante en un timeline **no renderiza sus valores de
inicio hasta que el playhead llega ahí**: medido, las palabras del segundo H2
quedaban en `opacity: 1` durante toda la aproximación, visibles antes de
animarse.

### Sin travel, y no es un olvido

La rama pineada anima **sólo `opacity` y `filter`**. Nada de `y`.

Reportado el 2026-09-15 como *"cada línea se levanta un poquito cada vez que
scrolleo"*, y medido: con `y: DIST.sm` las palabras derivaban 12px a lo largo
de ~360px de scroll — 0.03px por píxel, invisible como movimiento y muy
visible como inestabilidad. El ease `power2.out` lo empeoraba (los últimos
píxeles se repartían sobre media pasada); pasarlo a `linear` volvió la deriva
uniforme pero **no la eliminó**.

**La rama sin pin sí conserva el travel** (`DIST.md`): ahí el tween tiene
duración propia y 24px en 0.5s se leen como una entrada.

Ver la regla completa en `references/motion-language.md` de la skill `animate`.

### El ritmo

El segundo H2 arranca en `<50%` de su propia duración respecto del primero.
Medido: el primero va por el 61% cuando el segundo empieza, que es lo que hace
que se lean como **un gesto** y no como dos bloques.

## Anti-FOUC

Sí, y es obligatorio: las palabras arrancan invisibles.

`src/components/styles/statement.css` pone `opacity: 0` en
**`[data-statement-lines] > *`** — en cada bloque de línea, nunca en las
palabras, que no existen hasta que SplitText corre. Incluye la regla
`html.anim-failsafe [data-statement-lines] > *`, armada por `armFoucFailsafe()`
desde `global.js` (cableado el 2026-09-15 — antes no lo llamaba nadie).

## Dependencies

- **GSAP core + ScrollTrigger + SplitText**, los tres vía `getGsap()` /
  `getPlugin()`. Confirmados en el sitio (`.claude/rules/animations/PLUGINS.md`).
  Si falta cualquiera: `console.warn` y return, markup estático.
- De `src/utils/motion.js`: `DUR`, `DIST`, `EASE`, `STAGGER`, `SCROLL`, `MQ`,
  `onceLaidOut`, `isDev`.
- `./styles/statement.css`.

## DOM Expectations

```
section.cc-statement[data-component="statement"]
└── .container
    └── .statement_layout[data-statement-lines]
        ├── .heading-component  → h2.heading-text.u-italic   ← hijo directo
        └── .heading-component  → h2.heading-text            ← hijo directo
```

Sin `[data-statement-lines]`, o con el contenedor vacío, el componente sale
limpio sin animar.

## Tuning

Arriba de `src/components/statement.js`, en `STATEMENT`:

| Clave | Valor | Qué es |
| --- | --- | --- |
| `hold` | `0` | Scroll que el pin sostiene **después** de que entró la última palabra. El largo total del pin es `revealIntoPin + hold` |
| `revealStart` | `0.35` | Dónde empiezan a aparecer las palabras, en fracción del viewport |
| `revealIntoPin` | `0.4` | Cuánto del pin sigue ocupando la revelación |
| `blur` | `8` | Blur inicial de cada palabra, en px |
| `overlap` | `0.5` | Dónde arranca el 2º H2 respecto del 1º |

Duraciones, eases, distancias y staggers vienen de `motion.js` y no se repiten acá.

## Cómo se verificó

Medido con Chrome headless vía CDP el 2026-09-15, contra el **bundle real**
(`src/` compilado con Rollup), no contra el playground:

| Check | Resultado |
| --- | --- |
| Un solo pin | ✅ (con `whenLaidOut` eran dos — ver `CONVENTIONS.md`) |
| 16 palabras spliteadas, sin anidar | ✅ |
| reduced-motion / mobile 390 / teléfono acostado 844×390 | ✅ 0 pins |
| Sin GSAP → markup estático, failsafe a 3s | ✅ 0 errores |
| Budget CPU 4×, 6s de scroll | ✅ mediana 16.6ms, p95 17.6ms, 0 frames >50ms, 0 long tasks |
| Sin solape con la section de arriba, a 3 velocidades de scroll | ✅ medido en el sitio en vivo |
| Cero deriva vertical durante el pin | ✅ Δ = 0.0px en todo el recorrido (antes: 12px sobre 360px) |
| Nada visible antes de que arranque el reveal | ✅ las 16 palabras en `opacity: 0` hasta `scrollY 560` |

El playground vive en `playground/statement-pin/` (gitignored).
