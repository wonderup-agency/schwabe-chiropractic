# Tech Stack

## Runtime & Language

- **JavaScript (ES modules)** — all source uses `import`/`export`, `type: "module"` in package.json
- **Node.js** — scripts, build tooling
- **Browser target** — components run in the browser, loaded as ES modules via `<script type="module">`

## Bundler

- **Rollup** — two configs: `rollup.config.dev.js` (dev) and `rollup.config.prod.js` (prod)
  - `@rollup/plugin-node-resolve` — resolves node_modules imports
  - `@rollup/plugin-commonjs` — converts CJS dependencies to ESM
  - `@rollup/plugin-terser` — minification (prod only)
  - `rollup-plugin-delete` — cleans `dist/` before prod builds
  - `rollup-plugin-postcss` — CSS processing and extraction

## CSS

- **PostCSS** with `postcss-preset-env` (stage 2) — nesting, autoprefixer
- CSS is extracted to `dist/styles.css` in both dev and prod
- CSS is imported directly in JS files — no separate CSS build step

## Linting & Formatting

- **ESLint** (v9, flat config) — `eslint.config.js` uses `@eslint/js` recommended + `eslint-config-prettier`
  - `globals` — provides the browser global set (`globals.browser`) so DOM/timer APIs (`setTimeout`, `requestAnimationFrame`, `IntersectionObserver`, …) don't trip `no-undef`. Lint only runs on `src/`, which is browser-only; `scripts/` is not linted.
- **Prettier** — configurado en **`prettier.config.js`**, no en los defaults: `semi: false`, `singleQuote: true`, `tabWidth: 2`, `trailingComma: 'es5'`. ⚠️ Esta doc decía *"no config file, uses Prettier defaults"* y era falso — los defaults de Prettier llevan punto y coma, así que código escrito contra esa descripción falla `prettier --check`
- Runs automatically before prod builds via `prebuild` script

## Dev Server

- **http-server** — serves `dist/` on `http://127.0.0.1:8080` with CORS enabled
- **concurrently** — runs Rollup watch + http-server in parallel for `npm run dev`

## CDN & Deployment

- **jsDelivr** — serves production assets from GitHub via `cdn.jsdelivr.net/gh/owner/repo@version/dist/`
- Tagged releases (`@v1.0.0`) for instant cache invalidation
- `@main` branch reference available but aggressively cached

## Tunneling

- **Cloudflare Tunnel** (`cloudflared`) — exposes local server for testing on real devices/Webflow preview

## Animation

- **GSAP** — read from `window.gsap`, loaded on the Webflow site itself (MAST's Custom Code
  component / Site Settings), **not** an npm dependency and never bundled into `dist/`.
  `src/components/nav.js` checks for it and returns with a console warning if it is missing,
  so a site without GSAP simply keeps Webflow's default behaviour.
- `gsap.matchMedia()` is the responsive boundary for animation code — it reverts its own
  tweens and listeners when a query stops matching, so components don't need resize hooks
  for breakpoint-scoped animation.
- Because GSAP is a runtime fact rather than a build-time one, **which plugins exist is
  only knowable at runtime**. Every access goes through `getGsap()` / `getPlugin()` in
  `src/utils/motion.js`, and the confirmed-plugin table lives in
  `.claude/rules/animations/PLUGINS.md`.
- **Motion tokens** — `src/utils/motion.js` holds the site's durations, eases, distances,
  staggers and ScrollTrigger defaults. Animation code imports them instead of writing
  literals, so animations written months apart still feel like one system. The rationale
  behind each value is in the `animate` skill's `references/motion-language.md`.

## Smooth Scroll

- **Lenis** — chosen 2026-09-08 over GSAP's ScrollSmoother, which needs a wrapper/content
  pair in the Webflow DOM and breaks `position: sticky` and the fixed nav.
- **Not wired yet.** When it ships it is read from `window.Lenis` (a `<script>` in MAST's
  Custom Code embed, same pattern as GSAP), initialised in `src/components/global.js`, and
  driven by GSAP's ticker so there is a single frame loop. Lenis' own stylesheet is
  required, not optional. Full decision and wiring in
  `.claude/rules/animations/SMOOTH-SCROLL.md`.

## Dependencies

- **Runtime**: `picocolors` (used by scripts only, not bundled to browser)
- **Dev**: All other deps are devDependencies (Rollup, ESLint, `globals`, Prettier, etc.)
- No frontend framework — vanilla JavaScript only
