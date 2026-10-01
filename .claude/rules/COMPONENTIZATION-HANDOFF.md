# Componetización de sections — estado final y lo que falta

Cierre de la pasada del **2026-09-21**. Las reglas durables (convención de
naming, la receta paso a paso, las trampas del MCP) viven en
`COMPONENTS-NAMING.md`. Este archivo es el **estado medido** y la lista de lo
que queda, para que la próxima sesión arranque sin re-auditar.

Todo lo de acá está **escrito en el Designer y verificado leyéndolo de vuelta**.
**Nada está publicado.**

---

## Dónde quedó

| | Sections |
| --- | --- |
| Crudas al empezar (medido hoy) | **48** |
| Componetizadas | **38** |
| Bloqueadas por Collection List | **7** |
| Convertibles y pendientes | **3** (las tres `cc-faq-preview`) |

**93% de lo convertible está hecho.** El techo real del sitio es 41 de 48
(85%), y el resto no es deuda: es una limitación de Webflow.

### Páginas al 100%

Home · Patient Stories Template · **Our Team** · **Community Partners** ·
**Our Story** · **Care Hub** · **Fees & Policies**

Verificado con `query_elements` + `element_filter: {style: "section"}` → 0.

### Páginas con algo pendiente

| Página | Queda | Por qué |
| --- | --- | --- |
| New Patients | `cc-faq-preview` | Necesita slot |
| Sports Injuries | `cc-faq-preview` | Necesita slot |
| Wellness Membership | `cc-faq-preview` | Necesita slot |
| FAQ | `cc-faq` | ❌ Collection List |
| Blog | `cc-articles` | ❌ Collection List |
| Blog Template | `cc-articles` (`#more-articles`) | ❌ Collection List |
| Patient Stories | `cc-featured-story`, `cc-relationship`, `cc-themes`, `cc-shockwave-stories` | ❌ Collection List |

---

## Los 37 componentes, con sus ids

Todos en el grupo **`Sections`**.

| Componente | Props | id |
| --- | --- | --- |
| `Section / Team` | 23 | `235fff33-5619-1002-1092-b93ba1913a9c` |
| `Section / Neighborhood Context` | 9 | `ff8c33be-578a-4fca-5ad4-9548c7c12e1d` |
| `Section / Partner Directory` | 3 | `b5dc8534-9539-5ee6-965c-d026b11305d3` |
| `Section / Full Bleed Photo` | 3 | `7561a9d6-e021-7380-3dc6-8e45ae558229` |
| `Section / Story` | 9 | `84834b68-43e8-ec48-aab1-d7e5b279eb4a` |
| `Section / Doctor Bio` | 25 | `7ed79d4f-b43f-4bd1-9393-991d26ac778f` |
| `Section / Signpost` | 5 | `55778001-4a34-0868-1a48-f18786447583` |
| `Section / After Booking` | 10 | `bec23d7a-e7dd-5828-5cc5-0a82e82a9beb` |
| `Section / Arrival Details` | 19 | `ee5d1adf-03b5-a46c-5a86-d233914d0a23` |
| `Section / Care Approach` | 8 | `c4b9eb33-f708-e097-e98c-47e59ff93298` |
| `Section / First Visit Process` | 10 | `71e6cb73-951d-5ed8-c8d0-fb21e7f44ec8` |
| `Section / Areas of Care` | 21 | `d1842432-760a-e50a-b630-ece80d82138b` |
| `Section / Shockwave Bridge` | 12 | `ea26a120-fe06-b0b2-66ff-80bb118474b0` |
| `Section / Care CTA` | 5 | `d2c66413-7ac4-cf34-1bdb-55eed8793455` |
| `Section / Injury Hero` | 8 | `3c55307b-5e9f-ad30-1204-115e76d8a8c9` |
| `Section / Injury Context` | 8 | `569328f5-ed16-d9ae-9fbc-c49dc8b4f13c` |
| `Section / Conditions Treated` | 15 | `e84ef84d-b84d-558f-adba-280ba55df839` |
| `Section / Wellness Recognition` | 8 | `bdb82f75-66cf-10ea-a7c0-e3b3c1d4b153` |
| `Section / Wellness Intro` | 4 | `d2624f50-3db0-5cb7-b2ec-43235099c001` |
| `Section / Membership Includes` | 27 | `1da05388-22b0-ea6d-f214-06cd8e88aae7` |
| `Section / Membership Options` | 22 | `2a90ae26-6849-d86c-ce17-98010af936a2` |
| `Section / Membership Fit` | 11 | `ef39e266-60e3-d629-4350-1b55eed30a0b` |
| `Section / Fees At A Glance` | 22 | `b32f4f71-a054-6992-0b70-e36ce7f5cfca` |
| `Section / Insurance` | 9 | `87777385-8297-285b-bc72-bc701431ab06` |
| `Section / Appointment Fees` | 21 | `d3c697fe-a114-8ee1-b65e-b1eea0a1d9c6` |
| `Section / HSA FSA` | 11 | `32cfc481-dff3-57c9-11fb-77ccd9ccd363` |
| `Section / Cancellation Policy` | 10 | `0c91ea93-0617-8074-998f-34cf8ef7f3f4` |
| `Section / Payment Methods` | 6 | `c6e80d12-614c-cac2-03b2-da25b4b25187` |
| `Section / Membership Summary` | 30 | `bbad37ba-01c8-5bf5-757c-f8de7e5f9005` |
| `Section / Blog Intro` | 7 | `fb2c6abb-8dea-6cf3-9116-7e4485fee118` |
| `Section / Stories Hero` | 13 | `12afecae-f6ce-8040-d1a0-24cd44b1e605` |
| `Section / Stories Intro` | 5 | `794f4f9e-38e0-0cb0-be79-ac6291e97253` |
| `Section / Stories Outro` | 2 | `08741b21-1de0-3be5-80ef-743dfaade782` |
| `Section / Google Reviews` | 6 | `e6a0064f-c8be-c1ec-1e74-3bda8b826389` |
| `Section / Article Hero` | 2 | `6d264260-350e-33f6-f2ed-96589267673b` |
| `Section / Article Body` | 2 | `ee312802-3a10-dee8-998f-644bb9d32792` |
| `Section / Article Disclaimer` | 3 | `db584868-985d-a640-032b-7f2a49754625` |

**~430 props** en total, todos con el copy real como default.

### Qué quedó editable que antes no lo estaba

Lo que más importa para el cliente: **todos los precios**. Las tarifas de la
tabla de Fees (5 filas × fee), los dos planes de membresía en sus **dos**
apariciones (Wellness y Fees, 9 campos de precio cada uno) y el `$79` de
Shockwave son props. Cambiar un precio ya no exige entrar al Designer.

---

## Lo que falta, en orden

### 1. `Section / FAQ Preview` — 3 instancias, necesita un slot

**Es la única deuda real de esta pasada.** New Patients (7 accordions),
Wellness (4) y Sports Injuries.

El problema medido: **la respuesta de cada accordion vive dentro del slot del
`Accordion` de MAST**, y los hijos de un slot no tienen `id` propio, así que no
son bindeables. Convertir la section tal cual daría preguntas editables y
respuestas no — y con las respuestas horneadas en la definición, las otras dos
páginas no podrían reusar el componente.

**El diseño correcto**: la section expone Eyebrow, Title, CTA Label, CTA Link y
Anchor ID; los accordions van en un **slot**, o sea que viven en la página y
quedan editables uno por uno en Build Mode.

**El paso que hay que probar primero**: que `move_element` acepte un slot como
destino. Si no lo acepta, hay que reconstruir 7 accordions con su copy a mano
y eso cambia el cálculo. Probarlo en New Patients antes de tocar las otras dos.

### ⚠️ Ya no son 7 — Products salió el 2026-09-25

`Section / Product List` estaba bloqueada por su Collection List. La colección
`Products` tenía **un solo item** y Pablo la pidió estática, así que la card se
reconstruyó como markup y la lista se borró: **la section ya es convertible**.
Quedan **6** bloqueadas. Detalle en `UTILITY-PAGES.md`.

**La lección que deja**: "bloqueada por Collection List" no siempre es un techo
de plataforma — a veces es una decisión de contenido que se puede revisar. Una
colección de un solo item que nadie va a hacer crecer cuesta una section sin
props, y eso es peor que el markup estático que reemplaza.

### 2. Las 7 sections bloqueadas — no hay nada que hacer

`transform_element_to_component` rechaza cualquier elemento que contenga un
Collection List, y desbindear/rebindear **no** funciona (el error dice
explícitamente que el contexto de CMS no se restablece).

No es deuda: el contenido de esas sections **ya es editable donde importa**,
que es el CMS. Lo que queda sin props es la cáscara — eyebrow y título de
section — y eso sí requiere Designer.

**Corrección a lo que esta doc suponía antes**: sólo bloquea el *Collection
List*, no los *bindings de campo del item*. Probado hoy: las tres sections del
Blog Template que bindean campos del artículo (`cc-article-hero`,
`cc-article-body`, `cc-article-disclaimer`) **se convirtieron sin problema**.

### 3. Los pasos 4–6 del plan de naming, todavía pendientes

Están detallados en `COMPONENTS-NAMING.md` y **ninguno se tocó** en esta pasada:

- **Paso 4** — aplicar `u-pad-*` / `u-bg-*` y retirar los ~55 combos `cc-` de
  section. Las 11 utilidades ya existen. **Se difirió a propósito**: cambia el
  ritmo vertical de las 14 páginas y hay que medir antes y después, lo que
  exige publicar primero.
- **Paso 5** — `u-grid-2/3/4` y el retiro de ~20 clases `_grid`.
- **Paso 6** — los renames por rol (`media_scrim`, `section_head`, `media_bg`,
  `rating_stars`), más los tres que aparecieron midiendo: `includes_head`,
  `doctor_heading` y `hero_actions`, que hoy se usan fuera de la section que
  les da nombre.

Y siguen abiertos los dos renames a combo que quedaron a medias:
`shockwave_mark-alt` → `shockwave_mark` + `cc-alt`, y `bio_visual-sticky` →
`bio_visual` + `cc-sticky`.

### 4. Publicar, y recién ahí medir

**Nada de esto está publicado.** Y hay un paso extra que se olvida siempre: el
sitio carga el CSS/JS desde un commit pinneado del CDN, no desde `@main`. Sin
bumpear ese hash, nada del repo llega al sitio.

```
curl -s https://schwabe.webflow.io/ | grep -o 'schwabe-chiropractic@[^/]*'
```

Después de publicar hay que correr **`/responsive`** sobre todo lo tocado. Es
obligatorio por `CLAUDE.md` y en esta pasada **no se corrió sobre ninguna
section**: convertir a componente no cambia el markup renderizado, así que el
riesgo es bajo, pero "bajo" no es "medido".

### 5. Dos bugs de contenido que aparecieron de paso

- **Lorem ipsum en producción.** El accordion 2 del FAQ preview de New Patients
  (*"Do I need to have a serious injury or chronic problem to book?"*) tiene la
  respuesta en Lorem ipsum.
- **`Section / Membership Options` y `Section / Membership Summary` repiten los
  mismos precios** en dos páginas distintas, ahora como dos juegos de props
  independientes. Cambiar una tarifa exige tocar las dos. Es el caso que pide
  una colección de CMS `Membership Plans`, o un componente de tarifa
  compartido — decisión pendiente, y hoy explícitamente fuera de alcance
  porque no se crean colecciones nuevas.

---

## Tres cosas que aprendimos y que cambian cómo se hace la próxima tanda

1. **`transform_element_to_component` regenera los ids internos.** Hay que
   releer la definición (`scope_component_id` + `element_filter: {type:
   "ComponentInstance"}`) antes de bindear. Derivarlos por aritmética falla en
   silencio: bindea el párrafo 3 al prop del 4 y el copy queda mezclado.
2. **El MCP tira 429 a las ~6 escrituras y el batch no es atómico.** Un lote
   parcialmente fallado deja el componente a medio bindear. Y `GET /v2/assets`
   tiene un límite más bajo todavía: las imágenes se restauran de a una.
3. **Un prop de imagen se va a `null` al bindearlo.** Por eso los iconos de
   `Areas of Care` **no** se expusieron: seis restauraciones contra el endpoint
   más frágil, a cambio de una edición que nadie va a hacer. La regla: se expone
   una imagen cuando es contenido (un retrato, una foto de section), no cuando
   es un icono de sistema.

El detalle completo de las trampas está en `COMPONENTS-NAMING.md`.
