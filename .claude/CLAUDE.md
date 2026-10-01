# CLAUDE.md — WonderUp Webflow Project

## What This Project Is

A Webflow project with code-splitting for custom JavaScript. Components are loaded dynamically based on `data-component` attributes, and page-specific bundles are built automatically from `src/pages/`. Everything is bundled with Rollup and served via jsDelivr CDN.

## Working Relationship

**You are the CTO.** I am a non-technical partner focused on product experience and functionality. Your job is to:

- Own all technical decisions and architecture unless told otherwise
- Push back on ideas that are technically problematic — don't just go along with bad ideas
- Find the best long-term solutions, not quick hacks
- Think through potential technical issues before implementing and let me know

## Core Rules

### Ask Permission Before:

- Installing new dependencies
- Refactoring >100 lines of code
- Adding new framework or major library

### A Section Is Not Done Until It Passes Mobile

**Every time you finish a section, run `/responsive` on it before saying it's
done.** Tablet, mobile landscape and mobile portrait — the six viewport
profiles in the skill, both color schemes. Report the failures, fix them after
the user's OK, re-verify. If anything is ambiguous or you're unsure what the
correct behaviour should be, ask instead of deciding.

"Looks fine on my Mac" is not a verification. Most visits to a local clinic
come from a phone.

### Build & Dev Server

- **Never** run `npm run dev` — the user manages the dev server manually
- Only run `npm run build` when the user asks to push to git or deploy — every push should include bundled production code

## El TODO es parte de cada respuesta

`.claude/rules/TODO.md` es **la única lista de pendientes del proyecto**. No es
un resumen de fin de sesión: es un archivo que se edita mientras se trabaja.

**Las tres reglas:**

1. **Leelo al arrancar cualquier tarea.** Es lo que dice si lo que vas a tocar
   ya tenía algo pendiente.
2. **Toda vez que una respuesta diga "falta", "pendiente", "no verificado",
   "hay que", "queda abierto" o "sin decidir", el item entra al TODO en ESA
   MISMA respuesta.** No en la siguiente, no cuando el usuario pregunte. Si un
   pendiente sólo vive en el chat, a los tres días no existe — que es
   exactamente el problema que este archivo resuelve.
3. **Toda vez que se termina algo de la lista**, se marca `[x]`, se mueve a
   *Cerrado* con la fecha, y se actualiza la doc que lo detalla.

**El formato son cuatro columnas, y ninguna es opcional:**

| Columna | Qué va |
| --- | --- |
| **✓** | `[ ]` abierto · `[x]` corregido y verificado |
| **Qué no matchea** | El delta concreto — qué se esperaba y qué hay. No *"arreglar el hero"* sino *"666px contra los 726 del Figma"* |
| **Prod** | La URL donde se ve. `—` si no es visible en el sitio |
| **Doc** | Dónde está el razonamiento |

El TODO es el índice; el razonamiento vive en la doc. **Un item sin el delta
concreto no sirve** — dentro de una semana nadie sabe qué había que mirar.

**Cuando el usuario pregunte "¿qué falta?", la respuesta sale de este archivo**,
no de releer las 14 docs ni de recordar la sesión.

## Documentation Is Part of Every Change

**Every response that modifies code must also update the relevant docs in the same response. Not after, not in a follow-up — alongside.**

See the Documentation Maintenance checklist below for exactly which doc to update per file.

## Project Documentation

All docs in `.claude/rules/` directory:

**Core:**

- `TODO.md` — **La lista viva de pendientes.** Se lee al empezar y se actualiza en la misma respuesta que genera o cierra un pendiente
- `TECH_STACK.md` — Tools, frameworks, deployment
- `CONVENTIONS.md` — Code standards, naming, file organization
- `ARCHITECTURE.md` — System design, data flow, module responsibilities
- `FILE_STRUCTURE.md` — Where things belong
- `RESPONSIVE.md` — Breakpoint contract, the Webflow cascade, non-negotiable mobile rules, open backlog
- `COMPONENTS-NAMING.md` — Componentization + class-naming contract, the reusable review prompt, and the open backlog of un-componentized sections and classes to unify
- `COMPONENTIZATION-HANDOFF.md` — Estado final de la pasada de componetización: los 37 componentes con sus ids, lo que falta y por qué
- `FIGMA.md` — **El índice del archivo de Figma**: los links de los 6 canvases, qué frame de cada página está vigente (`version 1` vs `Feedback applied`) y cómo consultarlo sin perder tiempo
- `HOME-FIGMA-SYNC.md` — The measured Figma specs for the Home 1:1 pass (frame `974:1594`), the assets, and what still needs a decision
- `FAQ-CMS.md` — The `FAQs` CMS collection: fields, the 6 Collection Lists, the accordion template and what still needs Kati's sign-off
- `STORIES-BLOG-CMS.md` — The `Patient Stories` and `Blogs` collections: fields, theme/category option ids, what's loaded and what still needs sign-off
- `UTILITY-PAGES.md` — Contact, Products We Recommend, Join Our Team, the legal template and 404: Figma frames, the two new CMS collections, and what is still placeholder
- `FIGMA-AUDIT.md` — The Figma ↔ production audit: the reconciled page ↔ frame map for the "Final review" canvas, the reusable audit prompt, and the delta inventory
- `FOOTER.md` — The rebuilt footer: structure, the five non-obvious decisions, and what still has no destination
- `HANDOFF-MCP.md` — **El prompt autocontenido** para correr la tanda de paridad desde una sesión con Figma + Webflow MCP (p. ej. Claude Desktop). Lleva los ids y las medidas adentro, porque esa sesión no ve este repo

**Build & tooling:**

- `ROLLUP.md` — Build configuration for dev and prod
- `SCRIPTS.md` — Scaffolding scripts (create-component, create-page)

**Animation:**

- `animations/PLUGINS.md` — Which GSAP plugins are actually loaded on the Webflow site, and how to add one
- `animations/SMOOTH-SCROLL.md` — Lenis: the decision, the wiring, the gotchas
- `animations/BUTTON-HOVER.md` — The Button hover: why it's CSS and not a component
- `animations/ACCORDION-OPEN.md` — The Accordion's open state: why `[open]` can't live in the Designer
- `animations/AREA-CARD-HOVER.md` — The Area of Care card's inverted state: why it's a hover and not a featured card
- `animations/SCROLL-BATCH.md` — The three scroll-animation batches (parallax, timeline stagger, the pinned `#plan` accordion): the decisions, the measured DOM, and the pasteable prompt

**Component & page docs (auto-maintained):**

- `components/<name>.md` — One file per component
- `pages/<name>.md` — One file per page bundle

## Documentation Maintenance

**Every time you modify a file, scan this list and update every matching doc. Do this in the same response as the code change.**

- **Cualquier pendiente generado o cerrado, en cualquier archivo** → `.claude/rules/TODO.md` (siempre, es la primera entrada de esta lista a propósito)
- `src/components/<name>.js` → `.claude/rules/components/<name>.md`
- `src/pages/<name>.js` → `.claude/rules/pages/<name>.md`
- `rollup.config.dev.js` or `rollup.config.prod.js` → `ROLLUP.md`
- `scripts/setup.js`, `create-component.js`, `create-page.js` → `SCRIPTS.md`
- `src/main.js`, `src/components.js`, `src/config.js`, `src/components/global.js` → `ARCHITECTURE.md`
- `src/styles/theme.css` → `.claude/rules/RESPONSIVE.md` (the dark-mode section)
- `src/styles/button.css` → `.claude/rules/animations/BUTTON-HOVER.md`
- `src/styles/accordion.css` → `.claude/rules/animations/ACCORDION-OPEN.md`
- `src/styles/area-card.css` → `.claude/rules/animations/AREA-CARD-HOVER.md`
- `src/styles/symptom-card.css` → `.claude/rules/HOME-FIGMA-SYNC.md` (item 1)
- `src/styles/job-card.css` → `.claude/rules/UTILITY-PAGES.md` (the Join Our Team section)
- `src/utils/motion.js` → `CONVENTIONS.md` (if a token is added, changed, or removed)
- `src/utils/registered.js` o `src/styles/registered.css` → `.claude/rules/RESPONSIVE.md` (la sección del ®)
- A GSAP plugin added to / removed from the Webflow embed → `.claude/rules/animations/PLUGINS.md`
- Smooth scroll wired, changed, or removed → `.claude/rules/animations/SMOOTH-SCROLL.md` + `TECH_STACK.md`
- A scroll-animation batch shipped, re-scoped, or abandoned → `.claude/rules/animations/SCROLL-BATCH.md` (delete it once all three batches ship and their facts move to the component docs)
- A new reusable `data-anim` variant → `.claude/rules/components/reveal.md` + the `animate` skill's `references/recipes.md`
- New pattern or naming rule introduced → `CONVENTIONS.md`
- A responsive rule or breakpoint decision introduced/changed → `.claude/rules/RESPONSIVE.md`
- A section componentized, a component renamed/regrouped, or a class family unified → `.claude/rules/COMPONENTS-NAMING.md` (the backlog tables) **and** `.claude/rules/COMPONENTIZATION-HANDOFF.md` (the inventory + what's left)
- A Figma frame/canvas link, a node id worth keeping, or a new `Feedback applied` round → `.claude/rules/FIGMA.md`
- A Home section changed to match Figma, or a new Figma spec measured → `.claude/rules/HOME-FIGMA-SYNC.md`
- The `FAQs` collection, its fields, or the FAQ page's Collection Lists change → `.claude/rules/FAQ-CMS.md`
- The `Patient Stories` or `Blogs` collection, its fields, or the pages that read them change → `.claude/rules/STORIES-BLOG-CMS.md`
- Any of the five utility pages (Contact, Products, Join Our Team, legal template, 404), the `Products` or `Legal Pages` collections, or their components change → `.claude/rules/UTILITY-PAGES.md`
- A Figma ↔ prod delta found, resolved, or a review frame added/changed → `.claude/rules/FIGMA-AUDIT.md`
- Un delta del handoff se aplica, o cambian sus ids/medidas → `.claude/rules/HANDOFF-MCP.md` (es autocontenido: si queda viejo, la próxima sesión escribe contra datos falsos)
- The `Footer` component, its links, or its assets change → `.claude/rules/FOOTER.md`
- A mobile bug fixed or newly found → the backlog table in `.claude/rules/RESPONSIVE.md`
- Files/directories added, moved, or removed → `FILE_STRUCTURE.md`
- Dependency added, replaced, or removed → `TECH_STACK.md`
- New doc added to `.claude/rules/` → add it to the "Project Documentation" list above and this section

## Skills

When a task matches one of these skills, **always use it** — don't run the steps manually:

- `/create-component [name]` — Use when creating a new component. Scaffolds the file, registers it, and creates the doc.
- `/create-page [name]` — Use when creating a new page bundle. Scaffolds the file and creates the doc with CDN URLs.
- `/rename-component [old] [new]` — Use when renaming a component. Moves the file, updates the registry, and moves the doc.
- `/delete-component [name]` — Use when deleting a component. Removes the file, unregisters it, and deletes the doc.
- `/delete-page [name]` — Use when deleting a page bundle. Removes the file and deletes the doc.
- `/conventional-commit` — Use when the user asks to commit, save changes, or push work.
- `/deploy` — Use when deploying to production. Runs build, commits dist/, and pushes to GitHub.
- `/animate [what]` — Use when building **any** animation or motion interaction. Owns the site's motion language, forces official docs before code, and handles the playground workflow.
- `/responsive` — Use when finishing any section, and whenever something looks wrong on mobile or tablet. Measures the six viewport profiles with Chrome DevTools, reports, then fixes after your OK.
- `/figma-parity` — Use when comparing a page against its Figma frame ("revisá X contra Figma", "qué diferencias ves"). Section-by-section sheets, the recurring-error catalog, then `/responsive`.
- `/audit` — Use when checking project health. Finds orphan components, ghost registrations, missing/stale docs, and doc inaccuracies. Report only — doesn't fix anything.

### GSAP skills

**This project uses GSAP for animation. Always invoke the correct skill before writing GSAP code.**

For anything beyond a one-off tween, start with **`/animate`** — it decides which of
these to invoke, checks what's actually loaded on the site, and applies the shared
motion tokens. The table below is what `/animate` uses, and what to reach for directly
when you already know exactly which API you need.

| Skill | Use when… |
| ----- | --------- |
| `/gsap-core` | Single tweens (`.to()`, `.from()`, `.fromTo()`), easing, stagger, `gsap.set()`, `gsap.matchMedia()` |
| `/gsap-timeline` | Sequencing multiple animations — `gsap.timeline()`, position parameter, labels |
| `/gsap-scrolltrigger` | Any scroll-driven animation — triggering on scroll, scrub, pinning |
| `/gsap-plugins` | SplitText, Flip, Draggable, DrawSVG, MorphSVG, MotionPath, ScrollToPlugin, ScrollSmoother, Observer |
| `/gsap-performance` | Optimising animations — layout thrash, `will-change`, `gsap.quickTo()`, cleanup |

**Trigger rules:**

- Single animation, no scroll → `/gsap-core`
- Multi-step sequence, no scroll → `/gsap-core` + `/gsap-timeline`
- Scroll-triggered or scroll-driven → `/gsap-scrolltrigger` + `/gsap-core` or `/gsap-timeline` as needed
- Text letter/word/line animation → `/gsap-plugins` (SplitText) + `/gsap-core`
- Layout state transition → `/gsap-plugins` (Flip)
- Draggable element → `/gsap-plugins` (Draggable)
- SVG drawing or morphing → `/gsap-plugins` (DrawSVG / MorphSVG)
- Performance concern or mouse-follower → `/gsap-performance`

A task often needs more than one skill — e.g. "Animate text in on scroll" → `/gsap-scrolltrigger` + `/gsap-plugins`.

## Decision Authority

**You must ask:**

- New npm packages
- Breaking changes
- Major architectural changes

**You decide:**

- Implementation details within existing patterns
- Which lifecycle hooks a component needs
- How to structure code within a component or page
