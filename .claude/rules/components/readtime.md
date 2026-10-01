# readtime

## Purpose

Escribe el *"N min read"* del artículo **contando las palabras del cuerpo**, en
vez de leer un número que alguien tipeó en el CMS.

Pedido de Pablo el 2026-09-26: *"el time to read debería ser dinámico"*.

## Por qué no Finsweet

Pablo ofreció usar Finsweet Attributes. Se descartó por la misma razón que en
el índice del artículo (ver `toc.md`): **el repo ya carga un bundle propio y ya
recorre ese mismo rich text**. Sumar un script de terceros al `<head>` para
contar palabras es un costo de red y una dependencia nueva a cambio de ~20
líneas. `webflow-build` §5 pide justificar cada librería; acá no hay
justificación.

## Webflow Setup

| Atributo | Dónde |
| --- | --- |
| `data-component="readtime"` | El elemento que **muestra** el read time, en `.article-meta` |
| `data-readtime-source` | El contenedor del cuerpo — `.article_content` en `Section / Article Body` |
| `data-readtime-wpm` | Opcional, en el elemento que muestra. Palabras por minuto |

**El elemento tiene que ser nativo, no una instancia de `Plain Text`**: las
instancias de componente de MAST rechazan atributos. Por eso el byline se
reconstruyó con elementos nativos — ver `STORIES-BLOG-CMS.md`.

Si falta `data-readtime-source` el componente cae a **`[data-toc-source]`**, que
es el mismo elemento. El atributo propio existe igual para que el componente se
explique solo y no dependa en silencio del índice.

## Behavior

- **Init**: busca el cuerpo, cuenta palabras, divide por `wpm`, redondea con un
  piso de 1, y escribe `"N min read"`.
- **Resize / Breakpoint**: no se usan. No mide el DOM.

### 225 palabras por minuto

200–250 es el rango habitual de lectura silenciosa de prosa general; 225 queda
en el medio. Es overrideable por elemento porque un artículo clínico es más
denso que un post de blog — si algún día una página necesita otro número, es un
atributo y no un cambio de código.

### Un cuerpo vacío no es un artículo de un minuto

Si el contenedor existe pero no tiene texto, el componente **no escribe nada** y
deja el elemento como está. Un cuerpo vacío significa que el CMS no renderizó,
no que el artículo sea corto; escribir "1 min read" ahí sería inventar un dato.

## El campo `read-time` del CMS queda como fallback

El elemento sigue rindiendo el texto que tiene en el Designer, y el JS lo pisa
al cargar. O sea:

| | Qué se ve |
| --- | --- |
| Con JS | El número **calculado** |
| Sin JS | Lo que diga el elemento (hoy, texto estático) |

**El campo `read-time` de la colección `Blogs` ya no es la fuente de verdad.**
No se borró — borrar un campo de CMS es irreversible por API y nadie lo pidió —
pero puede quedar vacío sin consecuencia.

**El precio es un parpadeo**: si el texto estático dice 5 y el cálculo da 7, se
ve el cambio al cargar. Es una línea de 16px abajo del título y el bundle es
`defer`, así que dura lo que tarda el módulo. Si molesta, la salida es dejar el
elemento vacío y aceptar que sin JS no hay read time — el mismo trato que ya
tiene el índice.

## Anti-FOUC

**No lleva.** No oculta nada: el elemento ya está en el DOM con su texto y el
componente sólo lo reemplaza.

## Dependencies

- **Ninguna librería.** No usa GSAP.
- **Sin CSS propio**: el elemento ya está estilado en el Designer.

## DOM Expectations

```
[data-component="readtime"]        ← el elemento que muestra el texto
…
[data-readtime-source]             ← el cuerpo, en otra section de la página
```

Los dos pueden estar en **componentes distintos** — el read time vive en
`Section / Article Hero` y el cuerpo en `Section / Article Body`. Por eso la
búsqueda del cuerpo es `document.querySelector` y no un `querySelector` dentro
del elemento.

## Cómo se verificó

**No corrió en un navegador todavía.** El template del artículo devuelve **404**
(`shouldPublish: false`), así que igual que `toc.js`, la primera corrida real
va a ser cuando esa página publique.

Verificado: lint y Prettier limpios, el componente registrado en
`src/components.js`, y los dos atributos leídos de vuelta del Designer.

**Falta**: `npm run build` + push + bumpear el hash del CDN.
