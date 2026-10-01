# nav

## Purpose

Owns two behaviours on MAST's nav.

**Dropdowns** — replaces the visual behaviour of MAST's Webflow nav dropdowns
with a smooth, directional open/close: hover intent instead of an instant
toggle, a fade + slide for the panel, a staggered reveal of the links, and a
rotating caret. Adapted from Osmo's "directional hover" mega-nav, scaled down
for MAST's per-item dropdowns.

**Scrolled state** — past 40px of scroll, a solid surface and a bottom hairline
fade in. The nav keeps its height. Keeps the nav legible once page content
starts passing behind it.

## Webflow Setup

On the `Nav` component root (the `NavbarWrapper` carrying `.nav`), so every
instance of the global Nav picks it up:

    data-component="nav"

That is the only attribute the component needs. `[data-nav-bg]`, `[data-nav-line]` and `[data-nav-sentinel]` are **injected by
the component**, not added in the Designer.

`data-nav-cta` on the CTA link is optional and **not applied**: it only does
something when the colour inversion is switched on (see below). Note that the
CTA is a Button component instance, so it can't take a plain attribute — it
would have to go through MAST's `Attribute Name` / `Attribute Value` props.

## Behavior

- **Init**: Finds every `.nav-dropdown` inside the nav and, on desktop only,
  takes over its panel visibility. Opens on hover after 120 ms of intent,
  closes 150 ms after the pointer leaves. Switching between two open menus is
  immediate and animates directionally — the outgoing panel slides toward the
  side you came from, the incoming one enters from the opposite side. A cold
  open drops down instead of sliding sideways.
- **Resize**: Not used — nothing in the component measures the DOM, so a width
  change can't invalidate anything. `gsap.matchMedia()` handles the
  desktop/mobile boundary and reverts everything itself.
- **Breakpoint**: Not used, same reason.

### Scrolled state

Fires when a sentinel of `SCROLLED.threshold` px at the top of the document
leaves the viewport. Two things animate over `DUR.slow`, and the exit runs at
`SCROLLED.exitSpeed` (1.4×) so arriving feels considered and leaving feels
immediate:

| Target | Property | Why |
| --- | --- | --- |
| `[data-nav-bg]` | `opacity` 0 → 1 | The solid surface |
| `[data-nav-line]` | `scaleX` 0 → 1 | Hairline growing from the centre outwards, landing last |

Nothing measures the DOM, which is why there is no webfont wait and no resize
listener.

**If a height change is ever wanted back, it must not animate height or
padding.** `.nav` is `position: sticky`, so it sits in the document flow:
shortening it shortens the document and pushes everything below up by the same
amount — a visible jump and a real CLS hit, since scroll-driven shifts are not
exempt the way post-click ones are. The version that worked used two
transforms: `y: -drop` on `.nav` so the box rises, and `y: +drop/2` on its
inner container so the content re-centres in the shorter bar. It needed a
`data-nav-bar` hook on `.container.cc-nav`, plus the measurement, the webfont
wait and the resize listener. Kept in `playground/nav-scroll-state`.

**The surface never animates `background-color`.** It's a separate layer holding
the token, animated with `opacity`. Animating the colour would mean hardcoding
a hex, and the real token is `var(--primary--background)`, which MAST resolves
through the LightningCSS polyfill — beige or Brand/Ink depending on the theme
switch. (The site pins that switch to light in `src/styles/theme.css`; before
that, a phone in dark mode painted this surface Brand/Ink.)

**Why `IntersectionObserver` and not ScrollTrigger**: it costs nothing per
frame, it doesn't depend on a plugin that isn't confirmed present in MAST's
embed (see `.claude/rules/animations/PLUGINS.md`), and IO's initial callback
settles a mid-page refresh for free without animating.

**Paint order matters**: `[data-nav-bg]` and `[data-nav-line]` share
`z-index: -1`, so DOM order decides which paints on top. The surface is
inserted first; reverse them and it covers the hairline.

### Colour inversion — off

The surface is beige, the same colour the nav already carries, so there is
nothing to invert. `src/components/styles/nav.css` deliberately leaves
`--nav-text-scrolled`, `--nav-cta-bg-scrolled` and `--nav-cta-text-scrolled`
undefined, and the component **skips building those tweens when they're
absent** — that's the switch.

To turn it on (e.g. a Forest Green surface), uncomment the block at the bottom
of `nav.css` and change `.nav-link` and `.nav-logo_link` to `color: inherit` in
the Designer, so one tween on `.nav` tints the whole bar. The values must be
plain hex: `getComputedStyle` returns a `light-dark()` unresolved and GSAP
can't animate that.

### No anti-FOUC CSS

Deliberate. The injected nodes don't exist until the JS runs, so before that
the nav renders exactly as its static CSS. If GSAP never loads, nothing
changes.

### Why it doesn't fight Webflow

Webflow's dropdown script keeps toggling its own `w--open` class; this
component never reads it. GSAP writes an inline `display`, which beats
Webflow's class-based `display` rule, so the animation always wins without
having to disable or patch Webflow's script (which lives in an `HtmlEmbed`
the MCP cannot edit).

### Scope

Desktop only (`min-width: 992px`). Below that el menú lo maneja el navbar
nativo de Webflow y `nav.js` no lo toca — pero **sus estilos sí se corrigieron
en el Designer**, en dos rondas: el 2026-09-08 (`.nav-menu` y
`.nav-menu_container` corrían el panel 23px a la izquierda y centraban el
contenido en vertical) y el 2026-09-15.

**El panel mobile no puede posicionarse con `transform`.** El script del
navbar de Webflow, al cerrar, escribe inline
`transform: translateX(0px) translateY(0px)` sobre `.nav-menu`, y eso le gana a
cualquier regla del stylesheet: un centrado por `translateX(-50%)` funciona la
primera vez y desaparece de la segunda apertura en adelante. Hoy el panel se
posiciona sólo con `left: 0%` / `right: 0%` a ≤991, y para que eso dé
full-bleed **`.container.cc-nav` es `position: static` en ese breakpoint** — si
no, el bloque contenedor es el container, que está metido por el gutter.
Medido el 2026-09-15; ver `.claude/rules/RESPONSIVE.md`.

Los nodos que inyecta el componente cuelgan de `.nav`, no del container, así
que ese `static` no los afecta. `prefers-reduced-motion: reduce` collapses every
duration to 0 and removes the directional travel — state still changes, nothing
moves.

### Accessibility

- `aria-expanded` is written on each toggle as state changes.
- Opens on `focusin`, closes when focus leaves the dropdown.
- `Enter` / `Space` toggle, `ArrowDown` opens and focuses the first link,
  `ArrowUp` / `ArrowDown` move between links, `ArrowUp` on the first link
  returns to the toggle, `Escape` closes and restores focus to the toggle.
- Click outside the nav closes the open panel.

## Dependencies

**GSAP core only**, via `getGsap('nav')` from `src/utils/motion.js` — read from
`window.gsap`, loaded on the Webflow site, not bundled here. If it is missing
the component logs a warning and returns, leaving Webflow's default behaviour
in place. **No GSAP plugin is used.**

Also from `src/utils/motion.js`: `DUR`, `EASE` and `MQ`.

`src/components/styles/nav.css` — imported by the component, extracted to
`dist/styles.css`.

## DOM Expectations

Elements matching `[data-component='nav']`, each containing one or more
`.nav-dropdown` with:

| Selector | Role |
| --- | --- |
| `.w-dropdown-toggle` | the label; receives `aria-expanded` |
| `.w-dropdown-list` | the panel; `display` and transforms are driven here |
| `.nav-dropdown_arrow` | optional caret, rotated 180° when open |
| `a` inside the panel | staggered on open, used for arrow-key navigation |

Dropdowns with no toggle or no list are skipped, and so are dropdowns that
aren't rendered — the toggle is measured with `getClientRects()` at bind time.
That keeps MAST's hidden mega dropdown from taking a slot in the index the
directional animation is derived from. The measurement happens inside the
`matchMedia` handler, not at init, so the desktop menu is already laid out
when it runs.

## The shared dropdown box

The three dropdowns live inside `.nav-dropdown_group`, a wrapper that spans
About through New Patients. `.nav-dropdown` is `position: static` so the group
is the panels' containing block, and `.nav-dropdown_content` is pinned to
`left: 0 / right: 0 / top: 100%` — which makes all three panels **exactly the
same box**. That is what lets the directional cross-fade read as content
swapping inside a stationary frame rather than three differently-sized boxes
appearing in different places.

At `medium` and below MAST puts `.nav-dropdown_content` back to
`position: relative`, so the group goes `position: static`, the panel's
offsets go back to `auto`, and the mobile menu stacks in normal flow.

**If MAST's mega dropdown is ever re-enabled**, its `.cc-mega` panel was built
to span the whole nav; it would now be constrained to the group instead and
needs its own positioning.

## Tuning

At the top of `src/components/nav.js`:

- `PANEL`, `HOVER_ENTER`, `HOVER_LEAVE`, `SHIFT`, `DROP` — the dropdowns.
  (`PANEL` was named `DUR` before the shared tokens arrived; it was renamed to
  free the name for `motion.js`'s `DUR`.)
- `SCROLLED` — the scrolled state: `threshold` 40px, `exitSpeed` 1.4. Picked in
  `playground/nav-scroll-state` on 2026-09-08.

Durations and eases come from `motion.js` and are not restated here.
