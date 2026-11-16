/*
Pastel 978216 #85: order and empty state for the Open Roles CMS list.

The Data API can't set a Collection List's sort or filter, so:
  - each item carries data-job-sort (bound to Sort Order) and we reorder the
    items by it (lower first, empty last, ties keep the CMS order);
  - inactive roles are hidden by Webflow (item visibility bound to Active,
    class w-condition-invisible), and when no role is left visible we show
    the editable message marked data-openings-empty.
If a Designer filter or sort is added later this still works, it just has
nothing left to do.
*/

const LABEL = 'openings'

export default function openings(root = document) {
  try {
    const items = [...root.querySelectorAll('.w-dyn-item[data-job-sort]')]
    const list = items[0]?.parentElement
    if (list) {
      items
        .map((el, i) => ({ el, i, n: parseFloat(el.getAttribute('data-job-sort')) }))
        .sort((a, b) => {
          const an = Number.isFinite(a.n) ? a.n : Infinity
          const bn = Number.isFinite(b.n) ? b.n : Infinity
          return an - bn || a.i - b.i
        })
        .forEach(({ el }) => list.appendChild(el))
    }

    const empty = root.querySelector('[data-openings-empty]')
    if (empty) {
      const visible = items.some((el) => !el.classList.contains('w-condition-invisible'))
      empty.classList.toggle('is-visible', !visible)
    }
  } catch (error) {
    console.error(`[${LABEL}] failed, roles keep the CMS order`, error)
  }
}
