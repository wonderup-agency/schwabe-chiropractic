# filter

## Purpose

Filtra **un solo Collection List** en el cliente. Lo usan dos secciones:

| Página | Sección | Filtra por |
| --- | --- | --- |
| `/blog` | `#featured-articles` | `Category` de `Blogs` |
| `/patient-stories` | `#themes` | `Theme` de `Patient Stories` |

## Por qué no son los Tabs de MAST

**El `Tabs Pane` de MAST es un slot, y un slot de Webflow sólo acepta
instancias de componente** — un Collection List no entra. La alternativa era
**un Collection List por tab**: 4 en el Blog + 5 en Patient Stories = 9 queries
de CMS para mostrar 23 items que caben en 2.

Con un solo list por sección:

- 2 queries en vez de 9.
- **Todo el contenido queda en el DOM**, así que un crawler ve las 20 citas y
  los 3 artículos, no sólo la pestaña activa.
- Un mismo componente sirve para los dos casos.

El precio es que sin JS no hay filtro. Es la degradación correcta: se ven
**todos** los items, que para una grilla filtrada es mejor que ninguno.

Es una divergencia deliberada del precedente del FAQ, que sí usa 6 Collection
Lists — pero ahí cada categoría necesita su propio `<h2>` y su ancla, que es
otro problema. Ver `.claude/rules/FAQ-CMS.md`.

## Webflow Setup

`data-component="filter"` va en la **section**, no en el grid.

| Atributo | Dónde | Para qué |
| --- | --- | --- |
| `data-component="filter"` | La `Section` | Registra el componente |
| `data-filter-controls="<nombre>"` | El contenedor de los chips | Agrupa los botones |
| `data-filter-list="<nombre>"` | **El Collection List**, no su wrapper | Sus hijos son los items |
| `data-filter="<valor>"` | Cada chip | El valor a matchear. `*` = todos |
| `data-filter-value` | Un elemento **dentro** de cada card | Su texto es el valor del item |

El `<nombre>` de `controls` y `list` tiene que coincidir. Una section puede
tener más de un par.

### El valor se lee del TEXTO, no de un atributo

**Webflow no expone los campos Option como binding de atributo** — sólo
PlainText. Medido con `get_bindable_sources`: `Category` aparece con
`bindableTo: ["string", "textContent"]` y el intento de bindear el atributo de
la Collection Item falla con *"value must be a string or a binding"*.

O sea que un Option sólo llega al DOM **como texto**. Por eso el JS lee
`[data-filter-value]` y toma su `textContent`, y por eso `data-filter-value` va
en un `<div>` normal envolviendo al `Plain Text` bindeado — una instancia de
componente no acepta atributos.

Dónde está ese div en cada caso:

- **Blog**: visible, es la línea de categoría de la card (`CHIROPRACTIC CARE`).
- **Patient Stories**: `.u-sr-only`, porque la card no muestra su theme.

La alternativa era un campo PlainText espejo (`category-slug`) al lado del
Option. Se descartó: dos campos que dicen lo mismo se desincronizan el día que
alguien edita uno solo.

### El estado inicial vive en el Designer

El componente arranca con el chip que tenga `cc-active` en el Designer, y si no
hay ninguno con el primero. En el Blog eso es `All articles`; en Patient
Stories es `Feeling heard`, porque ese diseño no tiene chip de "todos".

## Behavior

- **Init**: por cada `[data-filter-controls]` busca su lista, cablea click y
  teclado, y aplica el chip activo.
- **Resize / Breakpoint**: no se usan. No mide nada.

Los chips son `<div role="button" tabindex="0">` y no `<button>` **porque
Webflow purga un `<button>` creado fuera de un `<form>`** (`webflow-build` §8).
El costo es que Enter y Espacio los maneja este archivo, y que el focus ring lo
pone `filter.css`.

### Si no matchea nada, muestra todo

Un filtro con cero resultados se lee como una página rota. Si el valor de un
chip no existe en ningún item —porque alguien renombró una opción en el CMS—
el componente revela todos los items y logea un warning, en vez de dejar la
grilla vacía.

## Anti-FOUC

**No lleva, y es deliberado.** Nada se oculta antes de que corra el JS: sin el
bundle se ven todas las cards. Ocultar para después revelar sería introducir
justamente el modo de falla que el failsafe existe para tapar.

## Dependencies

- **Ninguna librería.** No usa GSAP.
- `./styles/filter.css`.

## DOM Expectations

```
section[data-component="filter"]
├── [data-filter-controls="articles"]
│   └── .filter-chip[data-filter="…"]  ×N
│       └── Plain Text                  ← la etiqueta
└── … w-dyn-list …
    └── [data-filter-list="articles"]   ← el Collection List
        └── .article-card               ← un hijo por item
            └── [data-filter-value]
                └── Plain Text          ← bindeado al Option
```

Sin controles, sin lista o sin items, sale limpio.

## Cómo se verificó

Publicado a staging el 2026-09-18 y curleado:

| Check | Resultado |
| --- | --- |
| Blog: cards en el DOM | ✅ 3 |
| Blog: chips | ✅ 4, y sus `data-filter` coinciden con los 3 valores de `Category` |
| Patient Stories: cards | ✅ 20 (3 referral + 13 themes + 4 shockwave) |
| Patient Stories: chips | ✅ 5 |
| `[data-filter-value]` por card | ✅ 13 en la grilla de themes |
| Collection Lists vacíos | ✅ 0 |

**Lo que NO está verificado**: el filtro en sí no corrió nunca en el navegador.
El bundle no llega al sitio hasta `npm run build` + push + **bumpear el hash
pinneado del CDN** (ver `RESPONSIVE.md`). Hasta entonces se ven todas las cards
y los chips no hacen nada.
