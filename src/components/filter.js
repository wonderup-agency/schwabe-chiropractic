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
function valuesOf(item) {
  // Pastel/punch-list 2026-11-17: a blog post can have several categories
  // (multi-reference). Inside [data-filter-value] they come as a nested
  // Collection List, one .w-dyn-item per category; otherwise the whole text
  // is the single value, as before.
  const values = []
  item.querySelectorAll('[data-filter-value]').forEach((node) => {
    const nested = node.querySelectorAll('.w-dyn-item')
    if (nested.length) {
      nested.forEach((n) => values.push(n.textContent.trim().toLowerCase()))
    } else {
      values.push(node.textContent.trim().toLowerCase())
    }
  })
  return values
}

function apply(group, value) {
  const wanted = value.trim().toLowerCase()
  const all = wanted === '*'

  group.items.forEach((item) => {
    const show = all || valuesOf(item).includes(wanted)
    item.hidden = !show
  })

  group.controls.forEach((control) => {
    const on = control.dataset.filter === value
    control.classList.toggle(ACTIVE, on)
    control.setAttribute('aria-pressed', String(on))
  })
  if (group.onChange) group.onChange(value)

  // Nothing matched. Better to show everything than an empty grid — a filter
  // with no results reads as a broken page, and the CMS can always drift.
  if (!all && group.items.every((item) => item.hidden)) {
    group.items.forEach((item) => {
      item.hidden = false
    })
    console.warn(`[filter] no items matched "${value}" — showing all`)
  }
}


/*
Punch-list 2026-11-17: when there are many categories, a dropdown instead of
chips. If the control group has at least `data-filter-dropdown-at` visible
options (counting "All"), the chip row is hidden and replaced by a custom
dropdown that drives the same filter. Default 7, so up to 6 options stay as
chips. The chips stay in the DOM (and visible without JS).
*/
function sortKey(control) {
  const n = parseFloat(control.closest('[data-cms-sort]')?.getAttribute('data-cms-sort'))
  return Number.isFinite(n) ? n : Infinity
}

let dropdownId = 0
function buildDropdown(controlGroup, controls, group) {
  const id = `filter-dd-${++dropdownId}`
  const label = (c) => c.textContent.trim()
  const fixed = controls.filter((c) => !c.closest('.w-dyn-item'))
  const cms = controls
    .filter((c) => c.closest('.w-dyn-item'))
    .map((c, i) => ({ c, i, k: sortKey(c) }))
    .sort((a, b) => a.k - b.k || a.i - b.i)
    .map((o) => o.c)
  const options = [...fixed, ...cms]

  const wrap = document.createElement('div')
  wrap.className = 'filter-dropdown'
  const trigger = document.createElement('button')
  trigger.type = 'button'
  trigger.className = 'filter-dropdown_trigger'
  trigger.setAttribute('aria-haspopup', 'listbox')
  trigger.setAttribute('aria-expanded', 'false')
  trigger.setAttribute('aria-controls', `${id}-list`)
  const aria = controlGroup.getAttribute('aria-label')
  if (aria) trigger.setAttribute('aria-label', aria)

  const list = document.createElement('ul')
  list.className = 'custom-select_list filter-dropdown_list'
  list.id = `${id}-list`
  list.setAttribute('role', 'listbox')
  list.tabIndex = -1
  list.hidden = true

  const items = options.map((c, i) => {
    const li = document.createElement('li')
    li.className = 'custom-select_option'
    li.id = `${id}-opt-${i}`
    li.setAttribute('role', 'option')
    li.textContent = label(c)
    li.dataset.value = c.dataset.filter
    return li
  })
  list.append(...items)
  wrap.append(trigger, list)

  let active = 0
  const setActive = (i) => {
    active = Math.max(0, Math.min(items.length - 1, i))
    items.forEach((li, n) => li.classList.toggle('is-active', n === active))
    list.setAttribute('aria-activedescendant', items[active].id)
    items[active].scrollIntoView({ block: 'nearest' })
  }
  const open = () => {
    if (!list.hidden) return
    list.hidden = false
    wrap.classList.add('is-open')
    trigger.setAttribute('aria-expanded', 'true')
    const sel = items.findIndex((li) => li.getAttribute('aria-selected') === 'true')
    setActive(sel >= 0 ? sel : 0)
    list.focus({ preventScroll: true })
  }
  const close = (refocus = true) => {
    if (list.hidden) return
    list.hidden = true
    wrap.classList.remove('is-open')
    trigger.setAttribute('aria-expanded', 'false')
    if (refocus) trigger.focus({ preventScroll: true })
  }
  const pick = (i) => {
    apply(group, items[i].dataset.value)
    close()
  }

  group.onChange = (value) => {
    const li = items.find((x) => x.dataset.value === value) || items[0]
    trigger.textContent = li.textContent
    items.forEach((x) => x.setAttribute('aria-selected', String(x === li)))
  }

  trigger.addEventListener('click', () => (list.hidden ? open() : close()))
  trigger.addEventListener('keydown', (e) => {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
      e.preventDefault()
      open()
    }
  })
  list.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') setActive(active + 1)
    else if (e.key === 'ArrowUp') setActive(active - 1)
    else if (e.key === 'Home') setActive(0)
    else if (e.key === 'End') setActive(items.length - 1)
    else if (e.key === 'Enter' || e.key === ' ') pick(active)
    else if (e.key === 'Escape') close()
    else if (e.key === 'Tab') return close(false)
    else return
    e.preventDefault()
  })
  items.forEach((li, i) => {
    li.addEventListener('mousemove', () => active !== i && setActive(i))
    li.addEventListener('click', () => pick(i))
  })
  document.addEventListener('pointerdown', (e) => {
    if (!wrap.contains(e.target)) close(false)
  })

  controlGroup.classList.add('is-dropdown')
  controlGroup.after(wrap)
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

        const visible = controls.filter((c) => !c.closest('.w-condition-invisible'))
        const at = parseInt(controlGroup.dataset.filterDropdownAt || '7', 10)
        if (visible.length >= at) buildDropdown(controlGroup, visible, group)

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
