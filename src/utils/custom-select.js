/*
Pastel 978216 #84: custom dropdown for Webflow Select fields.

The native <select> opens the OS menu (grey list on desktop, wheel on iOS),
which doesn't match the rest of the form. Webflow has no styled select, so we
keep the real <select> for the form submission and draw our own control on
top of it:

  - a button that copies the select's classes, so it looks exactly like the
    other inputs (pill, border, padding);
  - a listbox panel with the options.

The first option with an empty value is treated as the placeholder. Picking
an option writes it back to the hidden <select> and fires `change`, so
Webflow's form submit sees the value. Keyboard: Enter / Space / arrows open,
arrows move, Enter picks, Escape or Tab closes, typing a letter jumps.

Opt out on any select with the attribute data-native-select.
If anything throws, the native select is left untouched and still works.
*/

const LABEL = 'custom-select'
let uid = 0

function enhance(select) {
  const wrap = select.parentElement
  const id = `cs-${++uid}`
  const options = [...select.options]
  const placeholder = options.find((o) => o.value === '')
  const choices = options.filter((o) => o.value !== '' && !o.disabled)
  if (!choices.length) return

  const trigger = document.createElement('button')
  trigger.type = 'button'
  trigger.className = `${select.className.replace(/\bw-select\b/, '')} custom-select_trigger`.trim()
  trigger.id = `${id}-trigger`
  trigger.setAttribute('aria-haspopup', 'listbox')
  trigger.setAttribute('aria-expanded', 'false')
  trigger.setAttribute('aria-controls', `${id}-list`)

  const label = select.id && document.querySelector(`label[for="${CSS.escape(select.id)}"]`)
  if (label) {
    if (!label.id) label.id = `${id}-label`
    trigger.setAttribute('aria-labelledby', `${label.id} ${trigger.id}`)
  }

  const list = document.createElement('ul')
  list.className = 'custom-select_list'
  list.id = `${id}-list`
  list.setAttribute('role', 'listbox')
  list.tabIndex = -1
  if (label) list.setAttribute('aria-labelledby', label.id)
  list.hidden = true

  const items = choices.map((opt, i) => {
    const li = document.createElement('li')
    li.className = 'custom-select_option'
    li.id = `${id}-opt-${i}`
    li.setAttribute('role', 'option')
    li.textContent = opt.text
    li.dataset.value = opt.value
    return li
  })
  list.append(...items)

  let active = -1

  const render = () => {
    const current = choices.find((o) => o.value === select.value)
    trigger.textContent = current ? current.text : placeholder ? placeholder.text : ''
    trigger.classList.toggle('is-placeholder', !current)
    items.forEach((li) => li.setAttribute('aria-selected', String(li.dataset.value === select.value)))
  }

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
    const sel = items.findIndex((li) => li.dataset.value === select.value)
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
    const value = items[i].dataset.value
    if (select.value !== value) {
      select.value = value
      select.dispatchEvent(new Event('change', { bubbles: true }))
    }
    render()
    close()
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
    else if (e.key.length === 1) {
      const k = e.key.toLowerCase()
      const n = items.findIndex((li, idx) => idx > active && li.textContent.toLowerCase().startsWith(k))
      const m = n >= 0 ? n : items.findIndex((li) => li.textContent.toLowerCase().startsWith(k))
      if (m >= 0) setActive(m)
    } else return
    e.preventDefault()
  })

  items.forEach((li, i) => {
    li.addEventListener('mousemove', () => active !== i && setActive(i))
    li.addEventListener('click', () => pick(i))
  })

  document.addEventListener('pointerdown', (e) => {
    if (!wrap.contains(e.target)) close(false)
  })

  // The label points at the hidden select: send its focus to our button.
  select.addEventListener('focus', () => trigger.focus())
  select.addEventListener('change', render)
  select.form?.addEventListener('reset', () => setTimeout(render))

  select.tabIndex = -1
  select.setAttribute('aria-hidden', 'true')
  select.classList.add('custom-select_native')
  wrap.classList.add('custom-select')
  select.after(trigger, list)
  render()
}

export default function customSelect(root = document) {
  root.querySelectorAll('select.w-select:not([data-native-select])').forEach((select) => {
    try {
      enhance(select)
    } catch (error) {
      console.error(`[${LABEL}] failed, the native select stays in use`, error)
    }
  })
}
