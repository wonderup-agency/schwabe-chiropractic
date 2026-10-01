# share

## Purpose

La fila **"Share this post"** del pie del artículo. Cuatro controles: copiar el
link, y entregar el artículo a LinkedIn, X y Facebook.

Construida el **2026-09-25** contra el Figma `1154:14451`, a pedido de Pablo.

## Por qué es un componente y no cuatro links en el Designer

Los cuatro necesitan **la URL de la página actual**, y en una página de template
eso sólo se sabe en runtime. Un share intent es `https://…?url=<esta página>`,
y **Webflow no puede bindear la URL de una Collection Page a un `href`** — es
el mismo límite que dejó rotos los links de las cards del Blog (ver
`STORIES-BLOG-CMS.md`, donde se probaron las tres formas y todas emiten un href
literal).

O sea que no es una preferencia: sin JS no hay forma de armar el link.

## Webflow Setup

`data-component="share"` va en la **section** del cuerpo del artículo — la misma
que ya lleva `data-component="toc"`. Un elemento puede tener un solo
`data-component`, así que **la fila de share cuelga de su propio contenedor**
con el atributo puesto ahí.

| Atributo | Dónde | Para qué |
| --- | --- | --- |
| `data-component="share"` | El contenedor de la fila | Registra el componente |
| `data-share="copy"` | El control de copiar | Copia al portapapeles |
| `data-share="linkedin"` | Un `Link Block` | Recibe el href de LinkedIn |
| `data-share="x"` | Un `Link Block` | Recibe el href de X |
| `data-share="facebook"` | Un `Link Block` | Recibe el href de Facebook |
| `data-share-done` | opcional, en el control de copiar | El `aria-label` de confirmación. Default `Link copied` |

Los tres sociales se escriben **sin `href`** en el Designer: lo pone el JS junto
con `target="_blank"` y `rel="noopener noreferrer"`.

## Behavior

- **Init**: lee `window.location.href`, **le saca el hash**, y arma los tres
  intents. El control de copiar recibe `role="button"`, `tabindex="0"` y sus
  handlers.
- **Resize / Breakpoint**: no se usan.

### El hash se descarta a propósito

Compartir desde la mitad del artículo no debería pegar un link que aterriza a
mitad de página: el `#section` que puso el índice se saca antes de armar la URL.

### El control de copiar no es un `<button>`

**Webflow purga un `<button>` creado fuera de un `<form>`** (`webflow-build`
§8), el mismo límite que obligó a `filter.js` a usar `role="button"`. El precio
es que Enter y Espacio los maneja este archivo —con `preventDefault` en el
espacio, o la página scrollea— y que el focus ring lo pone `share.css`.

### El portapapeles tiene dos caminos y los dos pueden fallar

`navigator.clipboard` exige **contexto seguro**, así que no existe en http plano
ni dentro de varios navegadores in-app (Instagram, LinkedIn). El fallback del
`<textarea>` + `execCommand` está deprecado y sigue siendo lo único que anda
ahí. Los dos van en `try/catch` porque **Safari tira en vez de devolver
`false`**.

Si los dos fallan, **no se muestra confirmación**: no hay nada peor que decir
"Link copied" cuando no se copió.

### La confirmación se anuncia, no sólo se pinta

Al copiar, el control toma la clase `cc-copied` (un tilde) **y** cambia su
`aria-label` a "Link copied", y vuelve a su estado a los 2s. Sin el cambio de
`aria-label` el feedback sería puramente visual y un lector de pantalla no se
enteraría de nada.

## Anti-FOUC

**No lleva, y es deliberado.** Nada se oculta: la fila se sirve visible y el JS
sólo completa hrefs. Si el bundle no llega, los cuatro iconos quedan inertes —
la misma degradación que eligió `filter.js`, hacer nada antes que esconder algo.

**La contracara es honesta y hay que saberla**: sin el bundle se ven cuatro
iconos que no hacen nada. Se aceptó porque la alternativa —ocultar la fila y
revelarla por JS— necesita una regla de failsafe que, al dispararse, revelaría
justamente los botones muertos.

## Dependencies

- **Ninguna librería.** No usa GSAP.
- `./styles/share.css`.

## DOM Expectations

```
section#article-body[data-component="toc"]
└── .article_grid
    └── .article_content[data-toc-source]
        ├── Rich Text
        └── .article-share[data-component="share"]
            ├── .article-share_label        → "Share this post"
            └── .article-share_actions
                ├── [data-share="copy"]
                ├── [data-share="linkedin"]
                ├── [data-share="x"]
                └── [data-share="facebook"]
```

Sin `[data-share]` adentro, sale limpio sin tocar nada.

## Cómo se verificó

**No se verificó en un navegador.** El código está lintado y formateado, y los
atributos están leídos de vuelta del Designer, pero la fila no existe en el
sitio hasta `npm run build` + push + **bumpear el hash del CDN** (hoy
`@29ed112`).

Falta medir: que los tres intents abran con la URL correcta del artículo, que
el copiar funcione en Safari y en un navegador in-app, y `/responsive` sobre la
fila.
