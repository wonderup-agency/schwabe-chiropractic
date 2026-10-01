# Architecture

## Overview

The project has two distinct parts:

1. **Browser code** (`src/`) — components and pages that run on the Webflow site
2. **Tooling** (`scripts/`, config files) — build pipeline, scaffolding scripts

These never mix. Browser code is bundled by Rollup into `dist/`. Tooling runs in Node.js only.

## Browser Runtime Flow

```
Webflow page loads
  → <script src="main.js" type="module" defer>
    → main.js waits for DOMContentLoaded (or runs immediately if DOM is ready)
    → main.js imports components.js (the registry)
    → main.js starts global.js and every matching component IN PARALLEL
      → global.js default function runs (site-wide setup)
    → main.js iterates the registry:
      → For each component, checks if selector exists on the page
      → If yes: dynamically imports the component module
      → Calls the default function with matching elements
      → Stores returned lifecycle hooks (resize, breakpoint)
    → Window resize event (debounced 150ms) fires hooks on all active components
    → Breakpoint changes fire breakpoint hooks with current and previous values
```

Key design decisions:

- **Code splitting**: Components only load if their DOM selector is present. A page with no `data-component` attributes loads zero component code.
- **Skipped components are reported.** `main.js` collects every registered component whose selector matched nothing and logs them in one line at the end of init (`💤 Not on this page (N): …`). The silent return that used to happen made "my animation does nothing" indistinguishable from "the component loaded and threw" — and the usual cause is that the Designer has the attribute but the site hasn't been published, so the published HTML doesn't. Terser strips `console.*` from the prod build, so the line costs nothing to ship.
- **Isolation**: Each component is independent. A failing component doesn't break others (try/catch per component).
- **global.js is never awaited before the components.** It used to be, and that
  serialised the whole cascade into three round trips nose to tail — `main.js`,
  then `global.js`, then the component's chunk. Warm that is ~76ms and
  invisible; on a **cold jsDelivr edge**, where each file is fetched from GitHub
  on demand, it is the difference between one wait and three. It showed up on
  the article template, where the index column sits empty until `toc.js` lands.
  Nothing a component does depends on global.js having finished: the FOUC
  failsafe it arms is a 3s timer, and the site-wide CSS it imports is extracted
  into `dist/styles.css` at build time and already loaded by a blocking `<link>`.
  Changed 2026-09-25.
- **No framework**: Vanilla JS. Components receive raw DOM elements and work with them directly.

## Component System

### Registry (`src/components.js`)

An array of `{ selector, importFn }` objects. The selector uses `data-component` attribute matching. The `importFn` is a dynamic import function for code splitting.

### Loading (`src/main.js`)

1. Queries DOM for each selector
2. Skips components with no matching elements
3. Dynamically imports the module
4. Calls the default export with the element array
5. Collects lifecycle hooks from the return value

### Global (`src/components/global.js`)

Loaded before any components. Runs on every page regardless of data attributes. Use for analytics, global event listeners, shared setup.

It also **arms the anti-FOUC failsafe** (`armFoucFailsafe()` from
`src/utils/motion.js`). Components that animate from a hidden state ship that
hidden state in CSS, because `dist/styles.css` is a blocking stylesheet and
lands before the first paint while GSAP arrives several frames later. The cost
is a real failure mode: if GSAP never loads, or a selector has a typo, the
content stays invisible forever. The failsafe stamps a class on `<html>` after
3s that reveals the orphans, while elements GSAP did bind keep their state —
GSAP writes `opacity` inline and inline beats a class rule. Wired on
2026-09-15 with the `statement` and `cost` components.

It is also where **site-wide CSS** is imported from (`src/styles/*.css`), so Rollup extracts it into `dist/styles.css` on every page. CSS that belongs to one component stays in `src/components/styles/` and is imported by that component instead — it only ships when the component does. Purely-CSS interactions have no component to hang off, so they go through here: currently `theme.css`, `button.css` (the Button hover), `accordion.css` (the Accordion's `[open]` state — see `.claude/rules/animations/ACCORDION-OPEN.md`) `area-card.css` (the Area of Care card's inverted state — see `.claude/rules/animations/AREA-CARD-HOVER.md`), `symptom-card.css` (the Sound Familiar card's olive rule and inverted hover — see `.claude/rules/HOME-FIGMA-SYNC.md`) `job-card.css` (the `[open]` state of the native `<details>` job cards on Join Our Team — see `.claude/rules/UTILITY-PAGES.md`) and `registered.css` (the `®`).

**`global.js` also runs one DOM pass of its own**: `formatRegistered()` from `src/utils/registered.js`, which applies the client's rule for the `®` — only on the first text mention of each page, never inside a button, at 60% of the text size with its top at the cap height. It lives here rather than in a component because it applies to every page and has **no hook in the Designer to hang off**, and it has to be JS because **CSS cannot target a character**. The rule, the two-pass walk and the measurements are in `.claude/rules/RESPONSIVE.md`.

`theme.css` is imported **first**, and it isn't an interaction: it pins MAST's whole token palette to light, because the site has no dark design and MAST's `theme-toggle.min.js` flips `<html>` to `u-mode-dark` from the OS setting. Everything imported after it resolves against the colours the site was actually designed in. The measurement and the rationale are in `.claude/rules/RESPONSIVE.md`.

### Lifecycle

- **Init**: The default function body (runs once on load, after DOMContentLoaded)
- **Resize**: Optional hook called on `window.resize` (debounced 150ms)
- **Breakpoint**: Optional hook called when the window crosses a Webflow breakpoint. Receives `(currentBreakpoint, previousBreakpoint)` as arguments. Values: `1920` (2XL), `1440` (XL), `1280` (Large), `992` (Desktop/base), `768` (Tablet), `480` (Mobile Landscape), `0` (Mobile Portrait).

### Components that are not animation

Most components on this site drive motion, but two do not and neither touches
GSAP: `filter.js` (attribute-driven filtering of one Collection List) and
`toc.js` (the article index, built from the rich text's own H2s). They follow
the same contract — default export, receives the matching elements, own CSS
imported from the component file — and they degrade by doing nothing rather
than by hiding content, so neither ships anti-FOUC CSS. See
`.claude/rules/components/filter.md` and `.claude/rules/components/toc.md`.

### Las tres sections pineadas de la Home

`statement`, `plan` y `cost` pinean, en ese orden de página. Tres pins en una
sola página está en el límite de lo que `CONVENTIONS.md` permite, y sólo
funciona porque **ninguno se solapa**: medido el 2026-09-21 contra la Home
real, `statement` va de 1900 a 2260, `plan` de 4637 a 6077 y `cost` de 10764 a
13689, con huecos de 2377 y 4687px entre ellos.

Eso no es suerte: los tres llevan `refreshPriority: refreshOrder(el)`, que es
lo que reparte la distancia de pin hacia abajo cuando el orden de creación es
una lotería — y lo es, porque `main.js` carga los componentes con `import()`
en paralelo y cada uno espera `document.fonts.ready` por su cuenta.

**Un cuarto pin en la Home no se agrega sin volver a medir esto.**

## Page Bundles (`src/pages/`)

Standalone entry points that Rollup discovers automatically. Each `.js` file becomes a separate bundle in `dist/`. Completely independent from the component system — loaded via separate `<script>` tags on specific Webflow pages.

Page bundles can import from `src/components/` if they need shared logic, but they don't participate in the `data-component` loading system.

## Configuration (`src/config.js`)

A shared config object importable by any component or page. Holds project-level values (API endpoints, feature flags, etc.). Default-exported.

## Build Pipeline

### Dev (`npm run dev`)

```
concurrently:
  → Rollup watch (rollup.config.dev.js)
    → del (clean dist/ once on first build)
    → checkGlobalJs plugin (warns if global.js missing)
    → resolve + commonjs (handle npm packages)
    → postcss (extract CSS to dist/styles.css)
  → http-server (serves dist/ on :8080)
```

### Prod (`npm run build`)

```
prebuild: eslint src/ && prettier . --write
  → rollup (rollup.config.prod.js)
    → del (clean dist/)
    → checkGlobalJs plugin
    → resolve + commonjs
    → postcss (extract + minimize CSS)
    → terser (minify JS, strip console.*, strip comments)
```

## Deployment Flow

```
Local dev → build → commit dist/ → push to GitHub → jsDelivr serves from @main
```

The Webflow site loads assets directly from jsDelivr CDN at `@main`. During local development, the snippet in `webflow-snippet.html` points to `localhost:8080` with `@main` CDN as the production fallback. jsDelivr aggressively caches `@main` — changes propagate within minutes; use the jsDelivr purge API for immediate updates.

