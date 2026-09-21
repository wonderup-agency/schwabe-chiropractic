// --------------------------------------------------
// Component Registry
// --------------------------------------------------
// Each entry maps a data-component attribute to a lazy import.
// Components only load when their selector exists on the page.
//
// 2 ways to add a component:
//
// 1. Ask Claude  → "create a component called calculator"
// 2. Terminal    → npm run create-component -- calculator
//
// Both scaffold the file and add an entry here automatically.
// --------------------------------------------------

export default [
  {
    selector: "[data-component='plan']",
    importFn: () => import('./components/plan.js'),
  },
  {
    selector: "[data-component='toc']",
    importFn: () => import('./components/toc.js'),
  },
  {
    selector: "[data-component='filter']",
    importFn: () => import('./components/filter.js'),
  },
  {
    selector: "[data-component='reveal']",
    importFn: () => import('./components/reveal.js'),
  },
  {
    selector: "[data-component='cost']",
    importFn: () => import('./components/cost.js'),
  },
  {
    selector: "[data-component='statement']",
    importFn: () => import('./components/statement.js'),
  },
  {
    selector: "[data-component='nav']",
    importFn: () => import('./components/nav.js'),
  },
]
