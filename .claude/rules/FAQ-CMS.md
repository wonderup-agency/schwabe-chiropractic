# FAQ — la colección de CMS

## Qué es

Las 44 preguntas del FAQ dejaron de ser markup estático el **2026-09-17**. Viven
en la colección **`FAQs`** (`6aabf588b3f6ba9a4d867f34`) y la página `/faq` las
rinde con **6 Collection Lists**, una por categoría.

El copy salió del **Master Copy v0.35** (`faq.html` del handoff HTML). Hasta ese
día la página tenía las 44 preguntas correctas y **40 de las 44 respuestas en
Lorem ipsum**.

## Los campos

| Campo | Slug | Tipo | Para qué |
| --- | --- | --- | --- |
| Name | `name` | PlainText | La pregunta |
| Answer | `answer` | **RichText** | La respuesta. Rich text y no Plain Text porque hay negritas, listas y links |
| Category | `category` | Option (6) | En qué bloque del FAQ cae |
| Order | `order` | Number | Orden **dentro** de la categoría, empieza en 1 |
| Needs Review | `needs-review` | Switch | ON = espera sign-off de Kati (ver abajo) |

Los ids de las 6 opciones de `Category` están en el Designer; el filtro de cada
Collection List usa **el id de la opción**, no su nombre.

## Por qué 6 listas y no una

Webflow no agrupa un Collection List por campo. Para que cada categoría tenga su
`<h2>` y su ancla (`#first-visit-booking`, etc. — el nav sticky del FAQ depende
de esas anclas), cada una es su propia lista filtrada por `category` y ordenada
por `order` ascendente.

**Un Option field alcanza y no hace falta una colección `FAQ Categories`**:
agregar una categoría exige tocar el Designer igual (una lista nueva), así que
la colección extra no compraría nada.

## El template de cada lista

Dentro del `Collection Item` va **una sola instancia del `Accordion` de MAST**:

| Prop | Valor |
| --- | --- |
| `Text` | **binding CMS → `name`** |
| Slot (`slot`, en minúscula) | una instancia de **`Rich Text`** con `Content` **binding CMS → `answer`** |
| `Preview in Designer` | **`false`** — no negociable, ver abajo |
| `Group Name` | uno por categoría: `faq-first-visit`, `faq-care`, `faq-insurance`, `faq-family`, `faq-shockwave`, `faq-evidence` |
| `Size` | H6 (`3fee1e3d-0e23-2506-6d0c-d4910fcae199`) |
| `Tag` | `h3` |

El `Collection List` lleva la clase **`accordion_list`** y `role="list"`, que es
lo que traía el `<div>` estático que reemplazó.

**El contenido del accordion no puede ser un elemento suelto**: el slot de un
componente de Webflow sólo acepta **instancias de componente**. Por eso la
respuesta va en el componente `Rich Text` de MAST y no en un Rich Text nativo.

## Lo que este cambio arregló de paso

El bug de `Preview in Designer` documentado en `animations/ACCORDION-OPEN.md`
—que emitía `open=""` en el HTML publicado y peleaba con el `name` de grupo—
**ya no puede volver por descuido**: se apaga una vez por lista en vez de 44
veces. Medido post-publish: **0 `<details open>`** en `/faq`.

## Cómo se verificó

Publicado a staging y curleado el **2026-09-17**:

| Check | Resultado |
| --- | --- |
| Lorem ipsum en la página | ✅ 0 (antes 40) |
| Preguntas renderizadas | ✅ 44 |
| Q y A idénticas al Master Copy v0.35 | ✅ 44/44 |
| `<details open>` en el HTML | ✅ 0 |
| Títulos en H6 | ✅ 44/44 |
| Links internos | `/fees-and-policies` y `/new-patients#arrival-details` — **el primero todavía 404** |

## Pendiente

- **12 items tienen `Needs Review` en ON.** Son los que el handoff marca
  `CLINICAL REVIEW` u `OPERATIONAL REVIEW`: seguridad de los ajustes, prenatal,
  Webster, pediátrico, evidencia, superbills, política de cancelación y
  Medicare (`FINAL MEDICARE COPY PENDING KATI REVIEW AND SIGN-OFF`). **No
  publicar a dominio propio sin ese OK.** Filtrá por ese switch en el CMS para
  verlos.
- **Dos políticas sin definir** en el propio Master Copy: si la cancelación
  online se bloquea a 24 o 48 horas, y si el depósito de la primera visita se
  pierde bajo 48 o bajo 24. Lo cargado dice 24; confirmarlo.
- **`/fees-and-policies` no existe todavía** y una respuesta lo linkea.
- **Falta correr `/responsive` sobre `/faq`** después de este rebuild.

## Reusar las FAQs en otra página

Cualquier página puede traer un subconjunto: Collection List → source `FAQs` →
filtro por `category`. Es el caso de las páginas de Care del handoff, que
repiten preguntas del FAQ.
