# Extraction audit

These notes were made while extracting tokens and components from the Figma Make source (October 2026). Each item lists what the documentation says, what the code does, and a suggested fix. Items marked **✅ resolved in this repo** were fixed during extraction. Everything else was left exactly as published so the repo matches the live site.

## Status — October 20, 2026

Decisions taken: Aqua is the brand, the repo JSON is the single source of truth (synced to Figma), solid fills with white text use step 700, `sm` breakpoint is 640px, dark mode ships in v1.1, MIT license.

| Item | Status |
|---|---|
| §2.1–2.3 Class-generation bugs | ✅ Fixed |
| §3.1–3.4 Contrast (warning fill, control fills, solid fills, ink-muted) | ✅ Fixed in tokens, components and docs site (axe contrast nodes 771 → 36; what's left is disabled-state text, which WCAG 1.4.3 exempts, the `base` tag printed on the 600 swatches and the AfterQuake orange headline) |
| §4.1 Breakpoint | ✅ Decided: 640px; docs updated |
| §4.2 H3 size | ✅ Decided: 20px (`typography/h3`), 18px is `typography/h3-compact` for modal/drawer titles |
| §4.5 Warning solid | ✅ amber-700 everywhere |
| §5.1 Disabled opacity | ✅ 0.45 everywhere |
| Figma library | ✅ Rebuilt from tokens: 878 variables, 14 text + 13 effect + 6 fill styles, 70 icons, 88 components (1,027 variants) incl. Avatar, Progress, Steps, Segmented control, Metric card and Data table; Field and Input gaps from the dogfooding form fixed ([docs/figma.md](figma.md)) |
| §3.5–3.10 ARIA patterns, keyboard, Field association | ✅ Fixed: dialog, menu button, select-only and autocomplete combobox, tabs, radio group, tooltip, disclosure; Field wires `id`, `aria-describedby`, `aria-invalid`, `aria-required`. 35 keyboard and ARIA tests in `tests/keyboard.mjs` |
| axe-core, 20 pages × 2 viewports | ✅ 975 → 36 violations (all of them the contrast exceptions above). Runs in CI via `tests/axe.mjs` |
| §6 Components reading semantic tokens | ✅ Done: every component reads semantic utilities or component tokens; 32 component tokens re-aliased from primitives to semantic (code and Figma); `pnpm lint:tokens` in CI blocks hard-coded colours. Visual diff against the previous build: 0 px changed on 18 of 19 pages |
| §5.5 Secondary severity | ✅ Aligned to tokens: soft text slate-700, soft bg slate-100 |
| Dimensions from tokens | ✅ Tailwind spacing, radius, type, weight, leading, tracking and container scales resolve to Pance tokens; Button, Input, Badge, Toggle, Checkbox, Radio, Tabs, Modal, Drawer, Popover, Toast and Progress read their size tokens; `lint:tokens` also blocks magic pixel sizes |
| Token contrast test | ✅ `tests/contrast.mjs`: 147 pairs (text 4.5:1, controls and focus 3:1) in light and dark. Found and fixed: unchecked checkbox/radio and switch-off boundaries at 2.56:1 (new `color.border.control`, slate-500, 4.76:1) and 27 dark-mode pairs (hover/active states, soft hovers, subtle text, slider) |
| §6 i18n/router decoupling | ✅ Components use `PanceProvider` labels (English default); the docs site feeds its EN/ES dictionary into it. The library has no router or i18n import |
| npm packages | ✅ Ready: `@pance/tokens` and `@pance/react` (ESM, types, precompiled `styles.css` and a Tailwind entry). `pnpm test:packages` installs both in a fresh project and checks rendering, labels, stylesheets, token exports and types. Published on npm through GitHub Actions with trusted publishing and provenance, no stored token: 1.1.0 to 1.4.1 (1.4.1 on October 20, 2026) |
| Pointer targets (WCAG 2.5.8) | ✅ Interactive controls have at least a 24 × 24 px target through an invisible hit area (internal `hitArea` helper): Checkbox, Radio, Switch (sm), Badge and TagInput remove buttons, Breadcrumb ellipsis, MetricCard Retry, chart table toggle, "Mark all as read", DataTable "Show details". A re-check of 20 pages found none left, except inline text links and fields inside larger containers, which the criterion exempts. Released in 1.4.1 |
| Panels in the viewport | ✅ `Popover`, `DropdownMenu`, `NotificationCenter`, `DatePicker` and `DateRangePicker` shift sideways to stay on screen and open upward when there is no room below (internal `useKeepInView`). Released in 1.4.1 |
| Docs site | ✅ Served from GitHub Pages at `pance-ds.jonathanlerma.com` (HTTPS, EN/ES, light and dark) and deployed by `pages.yml` on every push to `main`; Figma Make no longer hosts it. Demo photos are self-hosted |

## 1 · Changes made during extraction

| # | Change | Visual impact |
|---|---|---|
| 1.1 | **Tailwind palettes now point to Pance tokens.** Figma Make used Tailwind v4's built-in `slate / emerald / sky / amber / violet / rose` (OKLCH values), while the Colors page documents different hex values. `theme.css` now maps those utilities to the documented hex. ✅ | Subtle. Solid danger, outlined badges and success borders become slightly less saturated, matching the Colors page exactly. Pixel diff: 0.00–0.06% per page. |
| 1.2 | **`brand-950` added.** The Colors page documents aqua-950 `#083344` but `index.css` stopped at 900. ✅ | None (unused until now). |
| 1.3 | **Single `ui.tsx` (2,144 lines) split** into `src/components/{button,badge,avatar,forms,selection,feedback,navigation,overlays,layout,shared}`. ✅ | None. Identical output. |
| 1.4 | **Figma Make tooling removed** (`.figma/`, Make-specific Vite plugins, `AGENTS.md`). Site metadata moved into `index.html`. ✅ | None. |

## 2 · Bugs (classes Tailwind never generates)

Tailwind only generates classes it can find written out in full in the source. These ones are built from string pieces at runtime, so they render with no style:

| # | Where | Problem | Fix |
|---|---|---|---|
| 2.1 | `Alert` `variant="outlined"` | `t.border.replace('200','400')` produces `border-sky-400`, `border-amber-400`, `border-violet-400`, `border-rose-400`. None exist in the CSS, so info/warning/help/danger outlined alerts get a `currentColor` border instead of the tinted one. | Add an `outlined` border class to `TONE` in `shared.ts`, written out in full. |
| 2.2 | `Alert` `variant="solid"` | `t.solid.replace('ring-','border-')` produces `border-brand-600`, `border-rose-600`…, also missing. | Same: add an explicit `solidBorder` entry to `TONE`. |
| 2.3 | `Badge` remove button | `` `hover:${variant === 'solid' ? 'bg-white/20' : 'bg-black/10'}` ``: `hover:bg-black/10` never exists, so soft/outlined removable badges have no hover state. | `variant === 'solid' ? 'hover:bg-white/20' : 'hover:bg-black/10'` |

Quick alternative for all three: add `@source inline("border-{sky,amber,violet,rose}-400 border-{brand,slate,emerald,sky,amber,violet,rose}-600 border-amber-500 border-slate-900 hover:bg-black/10");` to `src/styles/index.css`.

## 3 · Accessibility

| # | Finding | Measured | Suggestion |
|---|---|---|---|
| 3.1 | **Warning filled Button / solid Badge** use `amber-500` with white text. The Colors page documents warning solid as `amber-600`. | White on amber-500 = **2.15:1** (fails). amber-600 = 3.19:1 (AA large only). | Use `amber-700` (5.02:1) for filled warning, or keep amber-500 with `ink` text (≈ 9:1). |
| 3.2 | **Checkbox, Radio, Toggle (on), Steps (complete)** use `aqua-500` fills. | White check on aqua-500 = **2.43:1**. Non-text UI needs 3:1. | Move these fills to `aqua-600` (3.68:1). |
| 3.3 | **Filled primary, success and info buttons, badges, toasts and pills**: white on aqua-600 = 3.68:1, emerald-600 = 3.77:1, sky-600 = 4.10:1. | Labels are 13–16px semibold. That's not "large text" under WCAG (≥ 18.66px bold), so these fail AA (4.5:1). Danger (rose-600 4.70), help (violet-600 5.70) and secondary (slate-600 7.58) pass. | Move filled backgrounds to step 700 (aqua-700 5.36, emerald-700 5.48, sky-700 ≈ 5.9). The brand still reads as aqua-600 in outlines, links and focus. |
| 3.4 | `ink-muted` (slate-500) on `ground` (slate-100) | 4.34:1, just under AA 4.5 for body text. | Use slate-600 for muted text on ground, or keep muted text on `surface` (4.76:1). |
| 3.5 | `Modal` / `Drawer` | No `role="dialog"`, no `aria-modal`, no Escape-to-close, no focus trap or focus return. | Add these, or wrap the native `<dialog>` element. |
| 3.6 | `Tabs` | No `role="tablist"` / `role="tab"` / `aria-selected` and no arrow-key navigation. | Add the WAI-ARIA tabs pattern. |
| 3.7 | `Tooltip` | Shows on hover only (`group-hover`), not on keyboard focus. | Add `group-focus-within/tt:opacity-100` and `role="tooltip"` + `aria-describedby`. |
| 3.8 | `Select`, `Combobox`, `DropdownMenu`, `SplitButton` | No `aria-expanded`, `aria-haspopup`, listbox roles or arrow-key navigation. | Adopt the listbox/menu-button patterns. |
| 3.9 | `Input`'s password toggle has `tabIndex={-1}` | Keyboard users can't reveal the password. | Remove `tabIndex={-1}`. |
| 3.10 | `Field` creates an `id` and puts it on `<label htmlFor>`, but never passes it to the child input. | Label isn't programmatically associated. | Clone the child with `id`, or accept an `id` render prop. |

## 4 · Documentation vs. code mismatches

| # | Docs say | Code does | Token decision |
|---|---|---|---|
| 4.1 | Layout page: breakpoints `xs < 480`, `sm 480`. | No breakpoint override, so Tailwind's `sm = 640px` applies. | Tokens record **640** (real behavior). To adopt 480, add `--breakpoint-sm: 480px` to `theme.css`. This *will* change layouts. |
| 4.2 | Type-scale table: H3 = **18px**. | Title component table: H3 = **20px**. Modals and drawers use 18px (`text-lg`). | Tokens use **20px** for `typography.h3`. Pick one and update the other table. |
| 4.3 | Elevation level 2 "Card" = `0 1px 2px .04 + 0 8px 24px -16px .18`. | `<Card>` and `<Panel>` ship only `0 1px 2px .04`, which is neither level 1 nor level 2. | Recorded as `shadow.card-rest`. Decide whether Card should use `shadow.sm`. |
| 4.4 | Data-viz sequential ramp is labelled "brand teal". | The 13 values (`#cde2fb → #0d366b`) are **blue**, not teal. | Recorded as-is in `color.viz.sequential`. Rename the label or regenerate from aqua. |
| 4.5 | Colors page: warning solid = `#d97706` (amber-600). | Buttons and badges use amber-500. Slider uses `#f59e0b`. | `intent.warning.solid` = amber-600. Component tokens record what ships (see 3.1). |
| 4.6 | "Strict 8pt grid." | Components use 6px (`gap-1.5`), 10px (`gap-2.5`, `px-2.5`) and 14px (`px-3.5`) regularly. | Recorded as off-grid half-steps (`space.0-75`, `space.1-25`, `space.1-75`). Suggest calling it "8pt grid with a 2pt sub-grid". |
| 4.7 | Divergent bar copy: "Blue (slot 1) for positive". | Slot 1 is aqua `#0891b2`. | Copy fix only. |

## 5 · Internal inconsistencies

| # | Finding |
|---|---|
| 5.1 | **Disabled opacity varies**: Button 0.45 · Toggle, Tabs, NavMenu, DropdownMenu 0.4 · Checkbox, Radio, RadioCard 0.5 · SwitchRow 0.6. Tokenised as `opacity.disabled = 0.45`; worth unifying. |
| 5.2 | **Two menu shadows**: Select / Combobox / SplitButton use `rgba(15,23,42,.35)`, while Popover / DropdownMenu / TagInput use `.30`. Recorded as `shadow.menu` vs `shadow.md`. |
| 5.3 | **RangeSlider** hardcodes hex in JS. `danger` uses rose-**600** while the other severities use step **500**. |
| 5.4 | **Two status-color systems**: intents (emerald / amber / rose) and the data-viz status palette (`#0ca30c`, `#fab219`, `#ec835a`, `#d03b3b`). The AfterQuake example adds a third (orange severities). |
| 5.5 | **Secondary severity** breaks the ramp pattern: soft bg slate-100 (others 50), text slate-600 in badges but slate-700 in buttons. |
| 5.6 | Charts, the AfterQuake map and the Colors page repeat hex literals that already exist as tokens. They can now import `tokens` from `src/tokens.ts`. |
| 5.7 | `console-example.tsx` defines its own local `Panel`, which shadows the library's `Panel` name. |

## 6 · Architecture notes

- ~~**Components aren't token-driven yet.**~~ ✅ Resolved: components use semantic utilities and component tokens; see README › How a change flows.
- ~~**Components depend on the i18n context**~~ ✅ Resolved: `PanceProvider` labels, no router or i18n dependency.
- ~~**No dark theme.**~~ ✅ Resolved: semantic dark layer, `ThemeToggle`, every contrast pair passes in both modes.
- **Bundle**: the site ships as one 1.15 MB JS chunk (all pages + Phosphor). Route-level `lazy()` would cut first load substantially.

## Roadmap

Done:

1. ✅ Class-generation bugs (§2) and contrast failures (§3.1–3.3).
2. ✅ Components read semantic tokens; dimensions come from tokens (`lint:tokens` in CI).
3. ✅ Built-in strings as props with English defaults; `@pance/react` and `@pance/tokens` published (1.1.0, 1.2.0).
4. ✅ Patterns promoted into the library: `MetricCard`, `DataTable` (expandable rows, column toggle), all charts incl. `ScatterChart` and `Meter`, `ConfirmDialog`, `NotificationCenter`, `Toast` actions, dates, theme, feedback and links. Nothing in the docs site is a library component in disguise.
5. ✅ Dark semantic layer (every contrast pair passes in both modes).
6. ✅ Visual regression in CI (base commit vs this commit on the same runner, no committed screenshots).
7. ✅ Documentation: one generated page per component (`docs/components/`, 71 pages, CI-checked), `CONTRIBUTING.md`, [deprecation policy](deprecation.md).
8. ✅ Figma library mirrors the repo: all library components, 6 patterns, Light/Dark variables ([figma.md](figma.md), [figma-code-map.md](figma-code-map.md)).
9. ✅ Figma documentation structure: one page per component (header, examples, variants, tokens), a Getting started page and a DDR-DS register of design decisions ([decisions/](decisions/README.md)).
10. ✅ **1.4.1**: fixes only, no API changes. Checkbox, Radio and Switch no longer toggle twice, Avatar falls back to initials, panels stay on screen, 24 px pointer targets, Badge remove focus ring, Calendar corner radius, DataTable scroll and landmark.
11. ✅ Docs site moved from Figma Make to GitHub Pages on its own domain.

Next:

- **Button with leading and trailing icons.** `Button` takes one `Icon` (`iconPos`: left, right, top, bottom). Add `TrailingIcon` so a button can show both (for example "Download ▾"). Additive, ships in the next minor (1.4.0) together with the matching Figma properties (`show leading icon` / `show trailing icon`). Record it as a DDR-DS.
- ✅ **1.3.0**: one mature release covering everything since 1.2.0 (dates, theme, feedback, links, actions, forms, table features, charts, flows, docs). Decision: no interim releases; the design system is announced only once it is complete.
- ✅ **1.4.0**: additive. `Button` `TrailingIcon` (DDR-DS-018), `bordered` on the calendars, and the finished Figma library.
- Launch: LinkedIn (EN and ES) and Instagram posts, and a consulting case study.
- Screen-reader passes (NVDA, VoiceOver) on the dialog, combobox, data table and date picker.
- Figma: dark values for component tokens (the Components collection has one mode).
- Code Connect when the Figma file moves to an Organization plan.
- Storybook or Ladle if contributors need an isolated playground.
