/*
El ® del sitio, formateado como lo pidió Derek.

La regla, del comentario #101 de "Final review":

  · ® SÓLO en la primera mención de texto de cada página, por marca
  · NUNCA en botones, y nunca en las menciones posteriores
  · ~60% del tamaño del texto
  · el tope aproximadamente a la cap height, no el glifo por defecto de la fuente
  · si el ® es parte del LOGO siempre queda — y el logo NO cuenta para la regla,
    así que la primera mención de texto igual lleva el suyo

Por qué esto es JS y no CSS: **CSS no puede apuntar a un carácter**. Ese es el
techo que RESPONSIVE.md venía documentando desde que se midió que el ® ocupa
0.673em — más que una minúscula y casi lo mismo que una mayúscula.

Y por qué no es un `replace()` global, que es la solución que parece obvia: la
regla **tiene estado** (sólo la primera mención) y **una excepción estructural**
(los botones). Las dos cosas obligan a recorrer el documento en orden en vez de
reemplazar sobre una cadena.

El logo no necesita ningún caso especial: es un SVG/imagen, así que no hay un
nodo de texto que recorrer. Sale gratis.
*/

const LABEL = 'registered'
const CHAR = '®'
const CLASS = 'u-reg'

/* Un ® adentro de cualquiera de estos se saca: son los botones del sitio.
   `.w-button` y `[type="submit"]` cubren el submit nativo de los forms, que no
   es una instancia del componente Button — el mismo agujero que ya documenta
   animations/BUTTON-HOVER.md. */
const BUTTONS = 'button, .button, [data-btn], .w-button, [type="submit"]'

/* Subárboles que no son texto visible. El text node de un <script> tiene al
   script como parentElement, así que alcanza con mirar el padre directo. */
const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'TITLE'])

/** Un elemento oculto no es una mención: no cuenta y tampoco se toca. */
function isVisible(el) {
  if (typeof el.checkVisibility === 'function') return el.checkVisibility()
  return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length)
}

/** Saca TODOS los ® de un nodo de texto. */
function strip(node) {
  node.nodeValue = node.nodeValue.split(CHAR).join('')
}

/**
 * Envuelve el PRIMER ® del nodo en <sup class="u-reg">, y saca los que sobren
 * del mismo nodo. Devuelve true si envolvió algo.
 */
function wrapFirst(node) {
  const at = node.nodeValue.indexOf(CHAR)
  if (at === -1) return false

  // splitText deja `node` con lo de antes y devuelve el resto, que arranca con ®
  const rest = node.splitText(at)
  rest.nodeValue = rest.nodeValue.slice(CHAR.length)

  const sup = document.createElement('sup')
  sup.className = CLASS
  sup.textContent = CHAR
  rest.parentNode.insertBefore(sup, rest)

  // si el mismo nodo traía más de uno, los de más se van
  strip(rest)
  return true
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

  // Se materializan ANTES de mutar: wrapFirst parte nodos y agrega elementos,
  // y recorrer el walker mientras tanto es recorrer una lista que cambia.
  const out = []
  let node
  while ((node = walker.nextNode())) out.push(node)
  return out
}

/**
 * Qué marca lleva este ®. La regla de Derek es "primera mención de texto por
 * página" POR MARCA: Colorado Shockwave® y CCSP® son menciones distintas. La
 * versión anterior le daba un solo ® a toda la página, así que en la Home,
 * Our Story, Team e Injury el CCSP® del doctor se quedaba con el lugar y
 * Colorado Shockwave salía sin ® (revisión del 2026-10-05).
 *
 * La marca es la palabra (o el par "Colorado Shockwave") que va justo antes
 * del ®. Si el ® ya venía en su propio <sup>, el texto está en el nodo previo.
 */
function markOf(node, sup) {
  let before
  if (sup) {
    const prev = sup.previousSibling
    before = prev ? prev.textContent : ''
  } else {
    before = node.nodeValue.slice(0, node.nodeValue.indexOf(CHAR))
  }
  before = before.trimEnd()
  if (/shockwave$/i.test(before)) return 'colorado shockwave'
  const word = before.match(/([\p{L}\p{N}&.-]+)$/u)
  return word ? word[1].toLowerCase() : '?'
}

/** Saca un ® que ya venía como <sup>, sin perder texto si el sup traía más. */
function dropSup(sup, node) {
  if (sup.textContent.trim() === CHAR) sup.remove()
  else strip(node)
}

/**
 * Aplica la regla a un documento ya cargado.
 * @param {HTMLElement} [root] - dónde buscar. Por defecto el body.
 */
export default function formatRegistered(root = document.body) {
  try {
    if (!root) return

    const found = collect(root)
      .map((node) => {
        const el = node.parentElement
        const sup = el ? el.closest('sup') : null
        return {
          node,
          visible: !!el && isVisible(el),
          button: !!el && !!el.closest(BUTTONS),
          sup,
          mark: markOf(node, sup),
        }
      })
      .filter((m) => m.node.parentElement)

    /* DOS pasadas, y la razón es el FAQ: sus 44 respuestas viven dentro de
       `<details>` cerrados, así que sus ® están ocultos. Un recorrido de una
       sola pasada tiene que decidir sobre cada nodo sin saber si más adelante
       hay uno visible, y eso deja las dos salidas malas: o un ® oculto se queda
       con el lugar de la primera mención —que es justo la que se ve—, o se
       saltea y reaparece crudo en cuanto el visitante abre el accordion.

       Con el reclamante resuelto primero, las dos se evitan: lo oculto nunca
       reclama, pero igual se limpia. */
    // Un reclamante por marca: la primera mención visible fuera de un botón.
    const claims = new Set()
    const seen = new Set()
    for (const m of found) {
      if (!m.visible || m.button || seen.has(m.mark)) continue
      seen.add(m.mark)
      claims.add(m)
    }

    for (const m of found) {
      if (claims.has(m)) {
        if (m.sup) m.sup.classList.add(CLASS)
        else wrapFirst(m.node)
        continue
      }
      if (m.sup) dropSup(m.sup, m.node)
      else strip(m.node)
    }
  } catch (error) {
    console.error(`[${LABEL}] failed, el ® queda como estaba`, error)
  }
}
