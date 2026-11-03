/*
El ® del sitio, formateado como lo pidió Derek.

Regla vigente (Pastel 978216 #40, 2026-11-03):

  · TODOS los ® que están en el contenido se muestran: headings, body,
    botones, nav, footer y rich text de CMS
  · un solo estilo compartido (.u-reg en src/styles/registered.css):
    siempre superíndice, 0.6em con mínimo de 10px, el tope cerca de la cap
    height y line-height 0

Reemplaza la regla anterior (Final review #101: "sólo la primera mención por
página, nunca en botones"), que borraba los ® sobrantes y por eso Derek veía
que "desaparecían" en staging.

Por qué esto es JS y no CSS: **CSS no puede apuntar a un carácter**. Hay que
envolver cada ® en su propio elemento para poder darle tamaño y posición.

El logo no necesita ningún caso especial: es un SVG/imagen, así que no hay un
nodo de texto que recorrer.
*/

const LABEL = 'registered'
const CHAR = '®'
const CLASS = 'u-reg'

/* Subárboles que no son texto visible. El text node de un <script> tiene al
   script como parentElement, así que alcanza con mirar el padre directo. */
const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'TITLE'])

/** Envuelve CADA ® del nodo en su propio <sup class="u-reg">. */
function wrapAll(node) {
  let current = node
  let at = current.nodeValue.indexOf(CHAR)
  while (at !== -1) {
    // splitText deja `current` con lo de antes y devuelve el resto, que arranca con ®
    const rest = current.splitText(at)
    rest.nodeValue = rest.nodeValue.slice(CHAR.length)
    const sup = document.createElement('sup')
    sup.className = CLASS
    sup.textContent = CHAR
    rest.parentNode.insertBefore(sup, rest)
    current = rest
    at = current.nodeValue.indexOf(CHAR)
  }
}

/** Los nodos de texto con ®, en orden de documento. */
function collect(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !node.nodeValue.includes(CHAR)) {
        return NodeFilter.FILTER_REJECT
      }
      const el = node.parentElement
      if (!el || SKIP.has(el.tagName)) return NodeFilter.FILTER_REJECT
      return NodeFilter.FILTER_ACCEPT
    },
  })

  // Se materializan ANTES de mutar: wrapAll parte nodos y agrega elementos.
  const out = []
  let node
  while ((node = walker.nextNode())) out.push(node)
  return out
}

/**
 * Envuelve todos los ® del documento.
 * @param {HTMLElement} [root] - dónde buscar. Por defecto el body.
 */
export default function formatRegistered(root = document.body) {
  try {
    if (!root) return
    for (const node of collect(root)) {
      const el = node.parentElement
      if (!el) continue
      // Un ® que ya venía como <sup> (rich text) sólo necesita la clase.
      const sup = el.closest('sup')
      if (sup && sup.textContent.trim() === CHAR) {
        sup.classList.add(CLASS)
        continue
      }
      wrapAll(node)
    }
  } catch (error) {
    console.error(`[${LABEL}] failed, el ® queda como estaba`, error)
  }
}
