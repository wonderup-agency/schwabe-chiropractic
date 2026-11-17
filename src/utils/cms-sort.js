/*
Punch-list 2026-11-17: order CMS lists by a Sort Order field.

The Data API can't set a Collection List's sort, so items that carry
data-cms-sort (bound to the collection's Sort Order number) are reordered
here: lower first, empty last, ties keep the CMS order. Used by the Blog
category chips. If a Designer sort is added later this just confirms it.
*/

const LABEL = 'cms-sort'

export default function cmsSort(root = document) {
  try {
    const lists = new Set()
    root.querySelectorAll('.w-dyn-item[data-cms-sort]').forEach((el) => lists.add(el.parentElement))
    lists.forEach((list) => {
      ;[...list.children]
        .map((el, i) => ({ el, i, n: parseFloat(el.getAttribute('data-cms-sort')) }))
        .sort((a, b) => {
          const an = Number.isFinite(a.n) ? a.n : Infinity
          const bn = Number.isFinite(b.n) ? b.n : Infinity
          return an - bn || a.i - b.i
        })
        .forEach(({ el }) => list.appendChild(el))
    })
  } catch (error) {
    console.error(`[${LABEL}] failed, lists keep the CMS order`, error)
  }
}
