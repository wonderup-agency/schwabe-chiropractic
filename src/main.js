import components from './components.js'

function getComponentName(selector) {
  const match = selector.match(/data-component=['"](.*?)['"]/)
  return match ? match[1] : 'unknown'
}

// ── Debounce helper ──────────────────────────────────────────────────
function debounce(fn, ms) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}

// ── Breakpoint detection ─────────────────────────────────────────────
// Values mirror Webflow's built-in breakpoints (min-width of each range):
//   1920 → 2XL          (≥ 1920px)
//   1440 → XL           (1440–1919px)
//   1280 → Large        (1280–1439px)
//    992 → Desktop      (992–1279px)  ← base breakpoint
//    768 → Tablet       (768–991px)
//    480 → Mobile Landscape  (480–767px)
//      0 → Mobile Portrait   (< 480px)
const breakpoints = [1920, 1440, 1280, 992, 768, 480]

function getCurrentBreakpoint() {
  const w = window.innerWidth
  for (const bp of breakpoints) {
    if (w >= bp) return bp
  }
  return 0 // Mobile Portrait
}

let currentBreakpoint = getCurrentBreakpoint()

const activeComponents = []
// Registered components whose selector matched nothing on this page. Reported
// once at the end of init, because "my animation does nothing" is almost
// always this and the silent return gave no way to tell it apart from a
// component that loaded and then failed. Terser strips console.* in the prod
// build, so this costs nothing to ship.
const skippedComponents = []

async function loadComponent({ selector, importFn }) {
  const componentName = getComponentName(selector)
  try {
    const elements = document.querySelectorAll(selector)
    if (elements.length === 0) {
      skippedComponents.push(`${componentName} (${selector})`)
      return
    }
    const module = await importFn()

    if (typeof module.default === 'function') {
      console.log(
        `%c⚡ [main.js] Loading ${componentName}`,
        'color: #a78bfa; font-weight: bold'
      )
      const result = module.default(Array.from(elements))

      if (result && typeof result === 'object') {
        activeComponents.push({ name: componentName, hooks: result })
      }
    } else {
      console.warn(
        `%c⚠️ [main.js] No valid default function found in ${componentName}.js`,
        'color: #fbbf24; font-weight: bold'
      )
    }
  } catch (error) {
    console.error(
      `%c❌ [main.js] Failed to load ${componentName}:`,
      'color: #f87171; font-weight: bold',
      error
    )
  }
}

// ── Lifecycle hooks ──────────────────────────────────────────────────
window.addEventListener(
  'resize',
  debounce(() => {
    activeComponents.forEach(({ hooks }) => {
      if (typeof hooks.resize === 'function') hooks.resize()
    })

    const newBreakpoint = getCurrentBreakpoint()
    if (newBreakpoint !== currentBreakpoint) {
      const prev = currentBreakpoint
      currentBreakpoint = newBreakpoint
      activeComponents.forEach(({ hooks }) => {
        if (typeof hooks.breakpoint === 'function')
          hooks.breakpoint(newBreakpoint, prev)
      })
    }
  }, 150)
)

// ── Init ─────────────────────────────────────────────────────────────
/**
 * Site-wide setup. Started in PARALLEL with the components, never awaited
 * before them: nothing a component does depends on global.js having finished.
 *
 * Awaiting it used to serialise the whole cascade — main.js, then global.js,
 * then the component chunk, three round trips nose to tail. Warm that is ~76ms
 * and invisible; on a cold jsDelivr edge, where each file is fetched from
 * GitHub on demand, it is the difference between one wait and three. The
 * article index was the place it showed, because its column sits empty until
 * its chunk lands.
 *
 * The FOUC failsafe that global.js arms is a 3s timer, so it does not care
 * whether it is armed before or after a component runs.
 */
async function loadGlobal() {
  try {
    const module = await import('./components/global.js')
    if (typeof module.default === 'function') {
      console.log(
        '%c🌍 [main.js] Loading global function',
        'color: #a78bfa; font-weight: bold'
      )
      module.default()
    } else {
      console.warn(
        '%c⚠️ [main.js] No valid default function found in global.js',
        'color: #fbbf24; font-weight: bold'
      )
    }
  } catch (error) {
    console.error(
      '%c❌ [main.js] Failed to load global function:',
      'color: #f87171; font-weight: bold',
      error
    )
  }
}

function init() {
  ;(async () => {
    await Promise.all([loadGlobal(), ...components.map(loadComponent)])

    if (skippedComponents.length) {
      console.log(
        `%c💤 [main.js] Not on this page (${skippedComponents.length}): ${skippedComponents.join(', ')}`,
        'color: #94a3b8'
      )
    }
  })()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
