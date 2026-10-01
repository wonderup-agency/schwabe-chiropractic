# Button hover — inversión de color + flecha

## Qué hace

El hover del `Button` de MAST. Las dos variantes se comportan distinto a
propósito:

- **Primary**: se **invierte** — toma los colores contra los que estaba.
- **Secondary**: no se invierte, se **lava**. Un verde muy leve entra de fondo
  y el texto **no cambia**.

En los dos, si el botón lleva la flecha en disco, la flecha se endereza de su
reposo a 45° arriba-derecha a horizontal y el disco pasa a verde.

### Por qué el Secondary no se invierte

Un Secondary invertido es un Primary: mismo peso visual, misma llamada de
atención. La jerarquía entre los dos botones se rompe justo en el momento en
que el visitante está eligiendo. El lavado da feedback de que el botón está
vivo sin subirlo de rango.

### Los bordes

Los dos bordes se resuelven distinto, y por razones distintas.

**Secondary: no se toca.** El variant ata los 4 `border-color` a una variable
de Webflow — **no** a `currentColor`, que es lo que este archivo supuso hasta
que se leyó el variant de verdad con `get_variant_styles`. Como es un valor
fijo, nada del hover puede moverlo: la forma más segura de mantenerlo es no
declararlo. Reescribirlo obligaría a nombrar una variable que este archivo no
puede ver.

**Primary: se le agrega uno.** Su borde es `transparent` en los 4 lados, así
que al invertirse a beige el botón se queda sin canto y **se disuelve** en las
secciones claras. `--btn-border-hover` le da el accent del que venía: la
píldora se vacía en vez de desaparecer. Ponelo en `transparent` para apagarlo.

La regla excluye explícitamente al Secondary:

```css
.button[data-btn][data-btn]:not([data-wf--button--button-variant='secondary']):hover
```

### El tinte

`--btn-tint: 12%`, aplicado con `color-mix()` contra `transparent`:

```css
--btn-bg-hover: color-mix(in srgb, var(--_color---brand--olive-green) var(--btn-tint), transparent);
```

Es una mezcla y no un token plano porque el mismo botón aparece sobre beige y
sobre olive light. Un `#f1f3ed` fijo desaparecería en las secciones olive
light; un tinte translúcido se lee igual sobre cualquier fondo, incluidos los
que se agreguen después.

Sobre superficie oscura un verde no se ve, así que el lavado es beige — misma
idea, misma contención.

## Es CSS puro. No hay componente JS

**Decidido el 2026-09-08.** Se evaluó y se descartó un componente GSAP.

La primera versión sí era un componente (`src/components/button.js`) porque el
diseño original tenía un wipe: un círculo que crecía desde donde entraba el
mouse. Eso necesitaba JS de verdad — medir el puntero, calcular el scale hasta
la esquina más lejana, inyectar capas. Cuando el wipe se descartó, lo que quedó
—cambio de color y una rotación— es exactamente para lo que existen las
transitions de CSS.

Por qué CSS gana acá:

- **Cero JS para 34 botones.** Sin costo de init, sin leer el DOM, sin
  timelines.
- **Funciona sin GSAP y antes de que cargue el JS.** No hay estado degradado
  que mantener.
- **No pelea con MAST.** `.button` ya trae
  `transition: background-color, border-color 300ms cubic-bezier(.165,.84,.44,1)`.
  Un GSAP escribiendo `backgroundColor` inline cada frame contra esa transition
  da doble easing: había que matarla primero. En CSS se reusa.

Lo que Webflow no puede hacer solo es estilar un **hijo** en el hover del
padre — el disco y la flecha viven adentro del Button. Por eso hay un
stylesheet y no sólo un estado hover en el Designer.

## Dónde vive

`src/styles/button.css`, importado desde `src/components/global.js` para que
salga en `dist/styles.css` en todas las páginas. No está en
`src/components/styles/` porque eso es CSS de un componente, y no hay
componente.

## Setup en Webflow

Los dos atributos están **puestos en la definición** del componente `Button`
(no por instancia — las 34 los heredan). Aplicados el 2026-09-08 por MCP:

| Elemento | id | Atributo |
| --- | --- | --- |
| Raíz del `Button` (`.button`, tipo DOM) | `2802151f-…-a9206a0d9625` | `data-btn` |
| Wrapper `.btn-icon` derecho (Block) | `d2a0eba0-58b0-121a-c544-385499c714e4` | `data-btn-icon` |

`data-btn-icon` **no puede ir en el `Icon`**: es una `ComponentInstance` y
Webflow rechaza atributos ahí (*"This element does not support attributes"*).
El wrapper es un `Block` normal y sí los acepta.

El atributo de la raíz es `data-btn`, **no `data-component`** — ese prefijo
significa "entrada del registry de JS" en este proyecto, y acá no hay JS que
registrar.

**No borres el estado hover de `.button` en Webflow.** En touch sigue siendo
el comportamiento; ver abajo.

## Los selectores, y por qué son los que son

| Selector | Por qué |
| --- | --- |
| `.button[data-btn][data-btn]:hover` | (0,4,0). El atributo repetido no es defensivo: el variant Secondary trae **su propio hover**, que Webflow compila a `.button.w-variant-052759b4…:hover { background-color: <accent> }` — (0,3,0), igual que con un solo atributo. Empatan, y el empate lo decide el orden de carga, que no controlamos. El resultado del empate es que MAST gana el fondo y nosotros el texto: claro sobre claro |
| `[data-wf--button--button-variant='secondary']` | El atributo que **Webflow mismo emite** para el variant. Se usa en vez de la clase `w-variant-<uuid>` porque se lee. Ojo: `.cc-secondary` **no existe** — Secondary es un *variant*, no un combo |
| `[data-btn-icon] > .cc-circle` | `cc-circle` es **nuestro** combo y es lo que convierte al icono en disco. Apuntarlo significa que un botón cuyo icono derecho no tiene círculo nunca recibe un fondo pintado detrás de un glifo pelado |
| `[data-btn-icon] .ph-arrow-up-right` | La clase de Phosphor. Sólo rota la flecha arriba-derecha: un botón con otro glifo queda intacto, que es algo que un selector posicional (`> * > *`) no puede expresar |

Las dos clases son deliberadas. La convención del proyecto —seleccionar por
`data-*`, nunca por clases de MAST— es una regla para **JS**, donde las clases
son un contrato frágil. Acá las dos dicen algo que ningún atributo diría mejor:
"hay un disco" y "esto es la flecha".

## El disco NO se prende con `cc-icon-circle`

Trampa que costó una pasada el 2026-09-21. Son **dos props distintas y dos
clases distintas**, y el nombre de una invita a confundirlas:

| Qué | Prop | Valor |
| --- | --- | --- |
| La clase del **botón** | `Button Class` | `cc-icon-circle` |
| El **disco** detrás de la flecha | `Right Icon Modifier` | `cc-circle` · `cc-circle-invert` · `cc-circle-olive` |

Poner sólo `cc-icon-circle` deja la flecha pelada, sin disco — que es
exactamente lo que se vio en el CTA de `#plan`.

Los discos son **cuatro combos, no tres** — verificado contra el CSS publicado
el 2026-09-23:

| Combo | Selector | Fondo | Glifo | Radio |
| --- | --- | --- | --- | --- |
| `cc-circle` | `.icon.cc-circle` | `neutral/white` | oscuro | **50%** |
| `cc-circle-invert` | `.icon.cc-circle-invert` | Brand/Ink `#474d33` | claro | 50% |
| `cc-circle-olive` | `.icon-color.cc-circle-olive` | Brand/Olive Green `#6b744e` | Beige `#fbfaf8` | 50% |
| `cc-circle` | `.icon-color.cc-circle` | `neutral/white` | oscuro | **6.1875rem** (token del botón) |

Los cuatro miden **2rem** con el glifo en **1.25rem**.

**`cc-circle` está duplicado bajo dos padres distintos y no dan lo mismo**: el
de `.icon` usa `border-radius: 50%` y el de `.icon-color` el token
`--_components---button--border-radius` (6.1875rem). A 2rem de caja las dos
formas se ven redondas, así que la diferencia es invisible hoy — pero deja de
serlo en cuanto alguien agrande el disco. Cuál de las dos aplica lo decide la
clase que tenga el elemento del icono, no el valor del prop.

## Tuning

Dos custom properties arriba de `button.css`:

| Variable | Valor | Qué es |
| --- | --- | --- |
| `--btn-dur` | `300ms` | Los 300ms de MAST. Hoy gobierna **sólo la rotación de la flecha** |
| `--btn-dur-color` | `160ms` | Fondo, borde y texto. **Más corto a propósito** — ver abajo |
| `--btn-ease` | `cubic-bezier(.165,.84,.44,1)` | También de MAST |
| `--btn-tint` | `12%` | Cuánto verde lleva el lavado del Secondary. Es el "leve" |

`motion.js` no se puede importar en CSS, así que estas dos son el equivalente
de los tokens. Cambiándolas cambia todo el hover, incluida la rotación.

La rotación de la flecha es `45deg`: `ph-arrow-up-right` nace a 45° arriba-
derecha y CSS rota en sentido horario, así que **+45 la deja horizontal**.
`-45` la para vertical — el signo es fácil de equivocar.

## El parpadeo del Primary, y por qué el color va a 160ms

Reportado el **2026-09-21** como un blink en el hover de los botones. Es el
mismo defecto que tenía la card de síntomas, y la causa es aritmética.

El Primary **se invierte**, así que sus dos colores se cruzan:

| | Reposo | Hover |
| --- | --- | --- |
| Texto | `#fbfaf8` | `#474d33` |
| Fondo | `#6b744e` | `#fbfaf8` |

A mitad de la transición el texto queda en ~`#a1a396` y el fondo en
~`#b3b7a3`: **1.2:1**. La etiqueta desaparece dentro de su propio botón y
vuelve. A 300ms esa zona muerta dura lo suficiente para leerse como un
destello.

**Ningún orden lo evita**: si el texto va primero queda claro sobre claro, si
va primero el fondo queda oscuro sobre oscuro. Lo único ajustable es cuánto
dura, así que color y borde pasaron a **160ms** — el cruce se termina en ~20ms
y se lee como un cambio, no como un fundido a nada. La flecha se queda en
`--btn-dur` (300ms) porque el movimiento no cruza nada.

**El Secondary no está afectado** y no hay que "emparejarlo": se lava en vez de
invertirse (el fondo toma un 12% de tinte y el texto no se mueve), así que sus
colores nunca se cruzan.

**Esto no reintroduce el desfasaje** que advierte la sección de arriba. Esa
advertencia es sobre nuestra transición peleando con la de MAST; declarar el
shorthand reemplaza la lista de MAST entera, así que las tres propiedades
corren con nuestro reloj. Lo que tiene que ir junto —borde y fondo— va junto.

La misma medición, hecha frame a frame sobre el markup real, está al pie de
`src/styles/symptom-card.css`.

## El hover borraba el botón sobre banda oscura — corregido el 2026-09-24

Reportado por Pablo como *"el hover en el botón se ve raro"*, con captura de la
banda Shockwave de Patient Stories. **Medido** con un hover real por CDP:

| | Fondo del botón | Texto | Contraste sobre la banda |
| --- | --- | --- | --- |
| Reposo | Beige `#fbfaf8` | Olive `#6b744e` | bien |
| **Hover** | `olive 12%` sobre **transparente** | **Ink `#474d33`** | **1.15:1** |

La banda es Slate Ink `#465659`. O sea que al pasar el mouse **el relleno beige
desaparecía y la etiqueta quedaba ink sobre slate**: la palabra se borra.

**La causa es que `.cc-on-dark` no es un Secondary transparente.** Es una
píldora **rellena** clara sobre banda oscura — `.button.cc-on-dark` declara
`background-color: Beige` y `color: Olive Green`. El lavado del Secondary
reemplaza ese relleno por un tinte del 12% sobre `transparent`, así que deja ver
la banda, y de paso lleva el texto a Ink.

**El arreglo es salirse del camino, no inventar un destino nuevo.** El Designer
ya define el hover correcto para ese combo — `.button.cc-on-dark:hover` lleva el
relleno de Beige a Beige Muted y deja el texto oliva. Con `:not(.cc-on-dark)` en
nuestra regla, esa regla (0,3,0) pasa a ser la más específica y gana sola.

```css
.button[data-btn][data-btn]:not(.cc-on-dark):hover { … }
```

**Ojo con la rama `.u-on-dark` de este mismo archivo**: existe para este caso
pero engancha por **clase ancestro**, y `cc-on-dark` va en el botón mismo.
Grepeadas las 17 páginas publicadas: **`.u-on-dark` no se usa en ninguna**, o
sea que esa rama nunca corrió. Se dejó —el caso vuelve el día que un Secondary
transparente caiga en una banda oscura— pero **no es el arreglo de
`cc-on-dark`**: aplicarle el lavado beige le sacaría el relleno igual.

**Son 4 botones**, uno por página: Blog, FAQ, Fees y Patient Stories.

**Ya llega al sitio.** Verificado el 2026-09-28 bajando el bundle de `@970fb4b`: la regla `.button[data-btn][data-btn]:not(.cc-on-dark):hover` está servida. La nota anterior decía que faltaba deployar y estaba desactualizada.

## Alcance

- **Sólo punteros reales** (`@media (hover: hover) and (pointer: fine)`). En
  touch `:hover` se queda pegado después del tap y dejaría el botón invertido
  sin salida. Ahí sigue vivo el `.button:hover` de MAST, o sea que touch se
  comporta igual que hoy.
- **`prefers-reduced-motion: reduce`** pone las tres transitions en `0s`. El
  botón igual se invierte y la flecha igual termina horizontal; nada se mueve
  gradualmente. Es un estado, no un apagado.
- **Sin anti-FOUC**, y es deliberado: nada se oculta. El reposo es el estado
  estático del botón.

## Pendiente

**El botón de submit del formulario no está cubierto.** En el HTML publicado
es `<input type="submit" class="button w-button">` — un form button nativo de
Webflow, no una instancia del componente `Button`, así que **no tiene
`data-btn`** y conserva el hover accent-dark de MAST. Queda inconsistente con
los otros. Se arregla agregándole el atributo a mano en el Designer, o
sumando `.w-button` al selector.

**Los `.button.cc-slider-nav`** (las flechas prev/next del slider) sí tienen
`data-btn` y por lo tanto se invierten. Son `<button>` chicos y sin texto:
conviene mirar cómo queda la inversión ahí antes de darlo por bueno.

## Cómo se verificó

Los estilos del variant no salen en `query_styles` por nombre — hay que usar
`data_component_variants_tool > get_variant_styles` con el `variant_id`. Y para
saber qué clases y atributos llegan realmente al HTML, lo más rápido es
curlear el sitio publicado:

```
curl -s https://schwabe.webflow.io/ | grep -o 'class="button[^"]*"'
```

Así apareció `data-wf--button--button-variant` y así se descubrió que
`.cc-secondary` no existía.

## El disco de la flecha tenía que ser oliva en REPOSO — 2026-09-28

Reportado por Pablo sobre el CTA nuevo: *"el hover queda raro"*. Medido con un
hover real por CDP contra el sitio servido, y **el problema no era el hover**:

| | Reposo | Hover |
| --- | --- | --- |
| Píldora | Beige `rgb(251,250,248)` | Beige Muted `rgb(238,236,228)` |
| Texto | Olive `rgb(107,116,78)` | Olive — no cambia |
| Borde | **transparente** | Olive |
| **Disco** | **Beige `rgb(251,250,248)`** | **Olive `rgb(107,116,78)`** |

El disco llevaba `cc-circle`, que es **Beige sobre una píldora Beige**: en reposo
**no se veía**. Y como `--btn-circle-bg-hover` es Olive para todos los botones,
al pasar el mouse **aparecía un disco sólido donde no había nada**. Eso es lo que
se lee como raro, y es un defecto del estado de reposo, no de la transición.

**El Figma lo dibuja Olive desde el reposo**, o sea `cc-circle-olive`
(`.icon-color.cc-circle-olive` → fondo Olive Green, glifo Beige). Aplicado en las
9 instancias del CTA.

Medido después: **el disco ya no cambia entre reposo y hover** — `rgb(107,116,78)`
en los dos— así que el hover queda en las tres cosas que sí tienen que moverse:
la píldora se apaga un tono, aparece el anillo oliva y la flecha se endereza.

**La regla que sale de acá**: `--btn-circle-*-hover` está definido una sola vez
para todos los botones, así que **el modificador de disco que elijas en reposo
tiene que ser el mismo color al que el hover lo lleva**, o el disco parpadea al
existir. Con la píldora clara eso significa `cc-circle-olive`, no `cc-circle`.
