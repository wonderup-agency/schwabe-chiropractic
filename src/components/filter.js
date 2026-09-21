/*
Component: filter
Webflow attribute: data-component="filter"

Client-side filtering for a single Collection List.

Why not Webflow Tabs + one Collection List per tab: MAST's Tabs family is
slot-based, and a Webflow slot only accepts component instances — a Collection
List cannot go inside one. The alternative was one Collection List per tab
(9 across the Blog and Patient Stories pages, each its own CMS query). This
does it with one list per section, keeps every item in the DOM for crawlers,
and is the same component for both pages.
*/

import './styles/filter.css'

const ACTIVE = 'cc-active'

/**
 * Reads the value a card should be matched on.
 *
 * The value is the TEXT of a [data-filter-value] element, not an attribute on
 * the card: Webflow does not expose Option fields as attribute bindings (only
 * PlainText), so an Option like Category or Theme can only reach the DOM as
 * text. The element is either visible (the blog card's category line) or
 * .u-sr-only (the patient quote card).
 */
function valueOf(item) {
  const node = item.querySelector('[data-filter-value]')
  return node ? node.textContent.trim().toLowerCase() : ''
}

function apply(group, value) {
  const wanted = value.trim().toLowerCase()
  const all = wanted === '*'

  group.items.forEach((item) => {
    const show = all || valueOf(item) === wanted
    item.hidden = !show
  })

  group.controls.forEach((control) => {
    const on = control.dataset.filter === value
    control.classList.toggle(ACTIVE, on)
    control.setAttribute('aria-pressed', String(on))
  })

  // Nothing matched. Better to show everything than an empty grid — a filter
  // with no results reads as a broken page, and the CMS can always drift.
  if (!all && group.items.every((item) => item.hidden)) {
    group.items.forEach((item) => {
      item.hidden = false
    })
    console.warn(`[filter] no items matched "${value}" — showing all`)
  }
}

function bind(controls, group) {
  controls.forEach((control) => {
    const run = () => apply(group, control.dataset.filter)

    control.addEventListener('click', run)
    control.addEventListener('keydown', (event) => {
      // The controls are divs with role="button" because a real <button>
      // created outside a <form> is silently purged by Webflow's validation
      // pass. Divs mean Enter and Space are ours to handle.
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        run()
      }
    })
  })
}

/**
 * @param {HTMLElement[]} elements - All elements matching [data-component='filter']
 */
export default function (elements) {
  elements.forEach((root) => {
    try {
      const controlGroups = root.querySelectorAll('[data-filter-controls]')

      controlGroups.forEach((controlGroup) => {
        const name = controlGroup.dataset.filterControls
        const list = root.querySelector(`[data-filter-list="${name}"]`)

        if (!list) {
          console.warn(
            `[filter] no [data-filter-list="${name}"] in this section`
          )
          return
        }

        const controls = Array.from(
          controlGroup.querySelectorAll('[data-filter]')
        )
        const items = Array.from(list.children)

        if (!controls.length || !items.length) return

        const group = { controls, items }
        bind(controls, group)

        // Honour whichever control the Designer marked active, so the default
        // state lives in Webflow and not in this file.
        const initial =
          controls.find((c) => c.classList.contains(ACTIVE)) || controls[0]
        apply(group, initial.dataset.filter)
      })
    } catch (error) {
      console.error('[filter] failed, leaving all items visible', error)
    }
  })
}
