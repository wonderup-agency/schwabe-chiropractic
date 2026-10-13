/*
Pone en negrita las etiquetas de arranque de párrafo que el copy file marca en
bold (Pastel #15: "Good to know:" en Fees, Derek 2026-10-09).

Viven dentro de un Plain Text de MAST: un solo nodo de texto bindeado a una
prop, sin forma de poner un <strong> en el medio desde el Designer. Esto busca
el texto al principio de cada .plain-text y lo envuelve.

Para sumar otra etiqueta, agregarla a LABELS tal cual figura en el copy.
*/

const LABELS = ['Good to know:']

export default function leadLabels() {
  const main = document.querySelector('main')
  if (!main) return
  main.querySelectorAll('.plain-text').forEach((el) => {
    const node = el.firstChild
    if (!node || node.nodeType !== Node.TEXT_NODE) return
    const text = node.textContent
    const label = LABELS.find((l) => text.trimStart().startsWith(l))
    if (!label) return
    const start = text.indexOf(label)
    const strong = document.createElement('strong')
    strong.textContent = label
    node.textContent = text.slice(start + label.length)
    el.insertBefore(strong, node)
  })
}
