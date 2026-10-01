# File Structure

```
├── src/
│   ├── main.js                    Entry point — loads global.js then components
│   ├── components.js              Component registry (auto-managed by create-component)
│   ├── config.js                  Shared project config (API keys, endpoints, flags)
│   ├── components/
│   │   ├── global.js              Runs on every page before components load
│   │   ├── announcement.js        Barra de anuncio: recuerda el descarte por 14 dias
│   │   ├── nav.js                 MAST's nav — dropdowns + scrolled state (GSAP)
│   │   ├── statement.js           cc-statement — pin + SplitText por palabras con blur
│   │   ├── cost.js                cc-cost — cortina + parallax + líneas de a una
│   │   ├── filter.js              Filtro por atributos de un Collection List (Blog + Patient Stories)
│   │   ├── toc.js                 Índice "In this article" del artículo: lista + estado activo
│   │   ├── readtime.js            Calcula el "N min read" del artículo contando palabras del cuerpo
│   │   ├── plan.js                cc-plan — acordeón de 3 pasos por scroll, dentro de un pin
│   │   ├── share.js               Fila "Share this post" del artículo: copiar link + 3 intents
│   │   └── styles/
│   │       ├── announcement.css  Focus ring del control de cerrar. NO lleva anti-FOUC
│   │       ├── nav.css           Injected-node styles for the nav's scrolled state
│   │       ├── statement.css     Estado inicial del split + layout de la rama pineada
│   │       ├── cost.css          Estado inicial + el stage de la cortina + el scrim
│   │       ├── filter.css        Lo que el Designer no expresa del chip + el ocultado del item
│   │       ├── toc.css           scroll-margin de los headings + focus ring de los links
│   │       ├── plan.css         Colapso de los pasos (scopeado al breakpoint pineado) + failsafe que ABRE
│   │       └── share.css        Focus ring del control de copiar + su confirmación
│   ├── styles/
│   │   ├── theme.css              Pins the token palette to light (no dark design)
│   │   ├── button.css             Button hover (colour inversion + arrow)
│   │   ├── accordion.css          Accordion open state (filled disc + minus)
│   │   ├── area-card.css          Area of Care card: the inverted hover/focus state
│   │   ├── symptom-card.css       Symptom card: the olive rule + the inverted hover
│   │   ├── job-card.css           Job opening card: the [open] state of the native <details>
│   │   └── registered.css         El ® al 60% con el tope en la cap height
│   ├── utils/
│   │   ├── motion.js              Shared motion tokens + GSAP runtime guards
│   │   └── registered.js          El ® sólo en la primera mención de cada página
│   └── pages/
│       └── .gitkeep               Per-page standalone bundles go here
│
├── playground/                    Throwaway animation sandboxes (gitignored)
│   ├── image-reveal/              La máscara contra el scroll + la entrada del texto
│   └── image-parallax/            La deriva reutilizable y el sobrante que necesita
│
├── dist/                          Build output (committed to git, cleaned by prod build)
│   ├── main.js                    Bundled entry point
│   ├── styles.css                 Extracted CSS
│   └── *.js                       Page bundles and code-split chunks
│
├── .github/
│   └── workflows/
│       ├── setup.yml              Auto-patches repo name on first push (self-deletes after)
│       └── purge-cdn.yml          Purges jsDelivr CDN cache after every push to main that touches dist/
│
├── scripts/
│   ├── setup.js                   One-time project initialisation (repo name, CDN URLs)
│   ├── create-component.js        Scaffolds component + registers in components.js
│   └── create-page.js             Scaffolds page bundle in src/pages/
│
├── .claude/
│   ├── CLAUDE.md                  Project instructions for Claude
│   ├── skills/                    Claude skill definitions
│   └── rules/
│       ├── TODO.md               La lista viva de pendientes — se lee al empezar, se actualiza siempre
│       ├── ARCHITECTURE.md        System design and data flow
│       ├── CONVENTIONS.md         Code standards and patterns
│       ├── FILE_STRUCTURE.md      This file
│       ├── RESPONSIVE.md          Breakpoint contract + mobile rules + open backlog
│       ├── COMPONENTS-NAMING.md  Componentization + naming contract, review prompt, backlog
│       ├── COMPONENTIZATION-HANDOFF.md  Estado final de componetización: inventario y pendientes
│       ├── FIGMA.md             Índice del archivo de Figma: canvases, links y qué frame está vigente
│       ├── HOME-FIGMA-SYNC.md   Figma specs for the Home 1:1 pass + assets + open decisions
│       ├── FAQ-CMS.md            The FAQs CMS collection + the FAQ page's Collection Lists
│       ├── UTILITY-PAGES.md     Contact, Products, Join Our Team, legal template + 404
│       ├── FIGMA-AUDIT.md       Mapa página ↔ frame del review, el prompt de auditoría y el inventario de deltas
│       ├── FOOTER.md            El footer reconstruido: estructura, decisiones y pendientes
│       ├── HANDOFF-MCP.md       Prompt autocontenido para una sesión con Figma + Webflow MCP
│       ├── ROLLUP.md              Build configuration
│       ├── SCRIPTS.md             Scaffolding scripts (create-component, create-page)
│       ├── TECH_STACK.md          Tools and frameworks
│       ├── animations/            GSAP plugins, smooth scroll, CSS-only interactions, scroll batches
│       ├── components/            Component documentation (one .md per component)
│       └── pages/                 Page bundle documentation (one .md per page)
│
├── rollup.config.dev.js           Dev build config (sourcemaps, no minification)
├── rollup.config.prod.js          Prod build config (minified, no console)
├── eslint.config.js               ESLint flat config
├── .prettierignore                Excludes dist/ from Prettier formatting
├── package.json                   Dependencies, scripts, project metadata
├── webflow-snippet.html           Copy-paste snippet for Webflow head section
├── CLAUDE.md                      Project instructions for Claude
├── CHANGELOG.md                   Release notes
└── README.md                      Project documentation
```

## Where things go

| What                   | Where                                                         |
| ---------------------- | ------------------------------------------------------------- |
| New component          | `src/components/<name>.js` (use `npm run create-component`)   |
| Component subdirectory | `src/components/<group>/<name>.js` (e.g., `forms/contact.js`) |
| Component registration | `src/components.js` (auto-managed by create-component)        |
| Global site-wide code  | `src/components/global.js`                                    |
| Page-specific bundle   | `src/pages/<name>.js` (use `npm run create-page`)             |
| Nested page bundle     | `src/pages/<section>/<name>.js` (e.g., `blog/post.js`)        |
| Project config         | `src/config.js`                                               |
| Motion tokens / guards | `src/utils/motion.js`                                         |
| Shared browser helper  | `src/utils/<name>.js`                                         |
| Component CSS          | `src/components/styles/<name>.css` (imported from its `.js`)  |
| Site-wide CSS          | `src/styles/<name>.css` (imported from `global.js`)           |
| Animation sandbox      | `playground/<name>/index.html` (gitignored, never committed)  |
| CSS                    | Import in any JS file — extracts to `dist/styles.css`         |
| Component CSS          | `src/components/styles/<name>.css`                            |
| Node scripts           | `scripts/`                                                    |
| Component docs         | `.claude/rules/components/<name>.md`                          |
| Page docs              | `.claude/rules/pages/<name>.md`                               |
| Pendientes del proyecto| `.claude/rules/TODO.md` (único lugar, siempre actualizado)    |
| Architecture docs      | `.claude/rules/`                                              |
| Animation runtime docs | `.claude/rules/animations/`                                   |
| Responsive rules       | `.claude/rules/RESPONSIVE.md`                                 |
| Componentization/naming| `.claude/rules/COMPONENTS-NAMING.md`                          |
| Estado de componetización | `.claude/rules/COMPONENTIZATION-HANDOFF.md`               |
| Links y frames de Figma| `.claude/rules/FIGMA.md`                                      |
| Home ↔ Figma specs     | `.claude/rules/HOME-FIGMA-SYNC.md`                            |
| Utility pages          | `.claude/rules/UTILITY-PAGES.md`                              |
| Auditoría Figma ↔ prod | `.claude/rules/FIGMA-AUDIT.md`                                |
| Footer                 | `.claude/rules/FOOTER.md`                                     |
| Handoff a sesión MCP   | `.claude/rules/HANDOFF-MCP.md`                                |
