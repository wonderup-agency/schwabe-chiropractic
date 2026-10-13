/*
Hace clickeable cada teléfono del sitio (Pastel #19, Derek 2026-10-09).

Derek pidió que todos los teléfonos abran el marcador (`tel:+17204329157`):
el botón de Contact, el footer y la sección Medicare. El footer y el botón ya
eran links; los que no lo son están **dentro de un Plain Text o de un Rich Text
del CMS** (Medicare en Fees, FAQ, New Patients, Wellness, la ficha "Phone" de
Find Us). Un Plain Text es un solo nodo de texto bindeado a una prop: Webflow
no permite poner un link en medio. La alternativa sin JS era partir cada texto
en tres piezas en cada página y en cada item del CMS.

Esto recorre los nodos de texto de `main`, busca el número en sus formatos
habituales y lo envuelve en `<a href="tel:…" class="u-tel">`. Nunca toca algo
que ya esté dentro de un `<a>`, un botón o un campo de form.
*/

const LABEL = 'tel-links'
const HREF = 'tel:+17204329157'
const CLASS = 'u-tel'
// 720-432-9157 · 720.432.9157 · 720 432 9157 · (720) 432-9157
const PATTERN = /\(?720\)?[\s.-]?432[\s.-]?9157/
const SKIP =
  'a, button, .button, [data-btn], input, textarea, select, script, style, noscript, template'

function linkNode(node) {
  const match = PATTERN.exec(node.nodeValue)
  if (!match) return
  const hit = node.splitText(match.index)
  hit.splitText(match[0].length)
  const a = document.createElement('a')
  a.href = HREF
  a.className = CLASS
  hit.parentNode.replaceChild(a, hit)
  a.appendChild(hit)
}

export default function telLinks(
  root = document.querySelector('main') || document.body
) {
  try {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!PATTERN.test(node.nodeValue)) return NodeFilter.FILTER_REJECT
        const parent = node.parentElement
        if (!parent || parent.closest(SKIP)) return NodeFilter.FILTER_REJECT
        return NodeFilter.FILTER_ACCEPT
      },
    })
    const nodes = []
    while (walker.nextNode()) nodes.push(walker.currentNode)
    nodes.forEach(linkNode)
  } catch (error) {
    console.error(`[${LABEL}]`, error)
  }
}
