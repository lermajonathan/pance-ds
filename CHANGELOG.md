# Changelog

All notable changes to Pance are documented here. The format follows [Keep a Changelog](https://keepachangelog.com) and the project uses [Semantic Versioning](https://semver.org).

## [Unreleased]

## [1.4.1] - 2026-10-20

### Security
- Development dependencies updated: Vite 8.3, PostCSS 8.5.31 and their transitive `nanoid` and `source-map-js`, clearing 13 advisories (9 high, 4 moderate) reported by `pnpm audit`. They affect only the dev server and the docs build; the published packages never included them. React 19.3 and React Router 8.5 for the docs site.

### Figma
- Published on [Figma Community](https://www.figma.com/community/file/1694091498392766646), free. The README, `docs/figma.md` and the package README link to the listing.
- New Cover with an animated shader background, a visually rebuilt Getting started (hero, quick start, key numbers, token tiers, file map, Light and Dark, patterns, change flow), and a `Community previews` page with eight gallery frames and a short Motion intro.
- Descriptions on every component and on every Semantic and Components variable (Primitives are self-describing).
- `Progress` gains a `value` variant (0–100 % in steps of 10) whose fill scales with the bar, so instances show their real value; the text property is now `value label`. The library has 1,027 variants (was 987).
- Patterns: Traffic report's line chart no longer overflows its card and the By region bars match their percentages; Settings no longer repeats the Autoscaling row.

### Fixed
- **`Checkbox`, `Radio` and `Switch`:** a click on the check mark, the radio dot or the switch thumb was counted twice (once by the control, once by its wrapping `<label>`), so a checked box could only be cleared from its edge. The marks now ignore the pointer. Regression test in `tests/keyboard.mjs`.
- **`Avatar`:** a photo that fails to load shows the initials instead of a broken image with the name cut off.
- **`Popover`, `DropdownMenu`, `NotificationCenter`, `DatePicker` and `DateRangePicker`:** the panel stays on screen. It shifts sideways when it would overflow the viewport or a container that clips (the notification panel was cut off on the docs page), and opens upwards when there is no room below but there is above. Focus moving into the panel no longer scrolls the page before the panel is placed.
- **Pointer targets of at least 24 × 24 px (WCAG 2.5.8)** for `Checkbox` (sm and md), `Radio`, `Switch` (sm), the `Badge` and `TagInput` remove buttons, the `Breadcrumb` ellipsis, `MetricCard` Retry, the chart "View as table" toggle, `NotificationCenter` "Mark all as read" and `DataTable`'s mobile "Show details". An internal `hitArea` class grows the target with an invisible layer, so nothing looks different.
- **`Badge`:** the remove button shows the focus ring (it had none) and is named after the badge text, as the docs already said.
- **`Calendar` inside `DatePicker`, `DateRangePicker` or any rounded container:** its background now follows the container's radius instead of showing square corners.
- **`DataTable`:** a `max-height` set on a wrapper now scrolls the rows under a sticky header (it was ignored), keeping the toolbar and pagination in view. While it scrolls, the row area is a named, focusable region so keyboard users can reach every row. Its pagination is named after the table, so two tables on one page no longer share a landmark name.

### Documentation
- **Docs site brought up to date:** the version comes from `@pance/react` at build time (header badge, hero), real counts (88 components, 943 tokens), a Get started section (install, styles, first component) with links to GitHub, npm, Figma Community and the changelog, a GitHub link in the header, and release notes for 1.1 to 1.4 in English and Spanish.
- **GitHub Pages:** `.github/workflows/pages.yml` builds the site on every push to `main` and publishes it to pance-ds.jonathanlerma.com. `scripts/pages-routes.mjs` writes one page per route (deep links return 200), a 404 fallback and the CNAME. `VITE_HASH_ROUTER=1` builds a preview that works from any static path.
- Docs site: demo photos are self-hosted (`public/img`), the notification center demo no longer clips, Iconography links to the full Phosphor library, hero chips use `Badge`, destructive buttons on Overlays open the matching confirmation (toast with Undo, simple confirm, type-to-confirm), and Data table adds three common layouts: members (avatars, roles, status filter, bulk actions), invoices (currency, dates, summary strip) and a scrolling log (sticky header, level filter).
- **Docs site home hero:** the hero followed no theme and always looked dark. It now reads `--hero-*` properties resolved per theme: the dark look is unchanged and light mode gets an aqua and sky aurora over the page background, with `ink` text. Site only; the library is not affected.
- **Docs site home, closing bands:** the call-to-action strip and the copyright footer were also fixed dark. They now follow the theme too: dark unchanged, light uses a soft aqua glow (strip) and the sunken page background (footer). Site only.
- Open-source governance: `GOVERNANCE.md` (the maintainer approves everything built or merged), `CODE_OF_CONDUCT.md`, `SECURITY.md`, issue and pull request templates, `CODEOWNERS`, and `docs/github-setup.md` with the repository settings to apply.

## [1.4.0] - 2026-10-19

A small, additive release: a second icon on `Button`, a border option for the calendars, and the complete Figma library (one page per component, 14 patterns, full dark mode, token-bound masters). No breaking changes.

### Added
- **`TrailingIcon` on `Button`** (DDR-DS-018): one button can show an icon before and after the label, for example Download with a chevron. `Icon` and `iconPos` work as before.
- **`bordered` on `Calendar` and `RangeCalendar`:** draws the outer border and radius (off by default, so it still sits inside popovers and cards).

### Fixed
- CI and release workflows are pinned to `ubuntu-24.04`: `ubuntu-latest` moved to Ubuntu 26 on Oct 19, 2026 and Playwright's Chromium install failed there.

### Documentation
- **Design decision records (DDR-DS):** `docs/decisions/` holds 18 records (tokens, source of truth, brand, release and deprecation policy, Figma structure, and the `Button` trailing icon). Append-only; Figma shows one card per record.

### Figma
- `Button` gains `show trailing icon` and `trailing icon` on all 480 variants; the existing `show icon` and `icon` are now `show leading icon` and `leading icon`. Existing instances keep their overrides. The Button page has a new example group, an API row and a matrix of every severity and variant with both icons on.
- Dark mode confirmed usable: every Semantic variable has a Dark value, and all 519 text and background pairs on the component masters resolve above 4.5:1 in Dark (the only exception is a disabled arrow). Fixed hard-coded white fills in the Date range panel's second month. Docs no longer call dark a draft.
- Patterns grew from 5 to 14: Checkout, Profile, Search results, Sign in, Onboarding, Notifications and toasts, Team members, Traffic report, and Loading, empty and error. All are built only from component instances.
- The Cover, Getting started and Icons pages now state that the 70 icons are a selection from Phosphor's 1,000+. New `Icon/ChevronLeft` (the library had 69 of the 70 icons in code). The Cover now shows the current version and counts.
- The two Legacy variable collections were deleted (nothing referenced them). Spacing, radii and font sizes on the component masters are now bound to variables; only chart geometry and 3 px optical values stay fixed, by design.
- Calendar and Calendar / Range now show the outer border (the `bordered` prop). Split button and Skeleton pages gained examples for every severity, variant, size and state, and Skeleton shows real contexts (text, profile, card, list, table, form). Tooltip arrows are attached to the bubble and point the right way.
- New **Accordion** component: the rounded, bordered group around Accordion items (the items alone had lost the container's border radius). The Icons page now has a gallery by category and links to Phosphor Icons.
- The single Components canvas is now one page per component (66), each with a header (status, first version, docs link), Overview, Examples for every variant axis and option, Usage, API, Accessibility, every variant and a Tokens table, and Related, all generated from the repo docs and tokens. New pages: Getting started and DDR-DS. Page groups are separated and sorted A–Z. The templates live on the Doc templates page.

## [1.3.0] - 2026-10-15

The first release meant to be adopted: everything that was a library component hiding in the docs site is now in `@pance/react`, every component has a page of documentation and a Figma counterpart with interaction states, and the checks that protect it (contrast in light and dark, keyboard, axe, packages, docs examples, visual regression) run in CI.

### Figma

- Interaction states (hover, focus, disabled) for Link, Toggle button, File dropzone, Inline edit, Combobox, Radio card, Notification bell, Input group, Tag input, Range slider, Pin input, Date picker, Nav menu item and Calendar day. Where `state` meant something else it was renamed (`kind`, `pressed`, `drag`, `mode`, `list`). The library now has 87 components (952 variants), 878 variables and 69 icons; see [docs/figma.md](docs/figma.md).

### Documentation and tooling

- One page per component in `docs/components/` (71 pages plus an index): when to use it and when not to, props, accessibility, content guidance, related components, example. Props are generated from the TypeScript source with `pnpm docs`; CI fails if a page is stale, a component has no guidance, or an example no longer type-checks (`pnpm docs:check`, `pnpm test:docs`).

- `CONTRIBUTING.md` (how to add a component, required checks, release steps) and a [deprecation policy](docs/deprecation.md) (what is public API, what is breaking, two minor releases and 90 days before removal).
- Visual regression in CI without committed screenshots: it builds the previous commit, screenshots 50 views (every docs page in light and dark, key pages on mobile), builds the new commit and compares. Intended changes are marked with `[visual-change]` in the commit message or PR title.

### Added: table features, charts and flows (promoted from the docs site)
- **`DataTable`:** `renderExpanded` (expandable rows with `aria-expanded` / `aria-controls`, also on the mobile cards) and `columnToggle` (a Columns popover with one checkbox per column).
- **`ScatterChart`** (arrow-key navigation, readout, table view) and **`Meter`** (`role="meter"`, status written as text). Tokens `meter.*` with dark values; 6 new contrast pairs (178 per mode).
- **`ConfirmDialog`** (type-to-confirm), **`NotificationCenter`** (bell with unread count, per-item Mark as read and Dismiss) and **`Toast` `action`** (Undo).
- **Labels:** `columns`, `expandColumn`, `expandRow`, `collapseRow`, `meterStatusWarning`, `meterStatusDanger`, `cancel`, `typeToConfirm`, `notifications`, `notificationsUnread`, `markAllRead`, `markRead`, `dismissNotification`, `noNotifications`, `unread`, `undo`.
- **Tests:** 7 new keyboard checks (32 in total), 6 new package checks (33).
- Nothing left in the docs site is a library component in disguise. `VizStatTile` is `MetricCard variant="compact"`.

### Added: theme, feedback and links
- **Dark mode you can switch on:** `ThemeProvider`, `useTheme`, `ThemeToggle` (Light / Dark / System) and `themeInitScript` for a flash-free first paint. The choice is remembered and follows the system setting. The docs site now has the toggle in its header.
- **`Spinner`** (status role, stops under reduced motion), **`EmptyState`** (real heading, one action) and **`Link`** (always underlined, safe external links that announce the new tab, `render` for router links).
- **Tokens:** `spinner.*` and `empty-state.*`; 5 new contrast pairs (172 per mode).
- **Labels:** `opensInNewTab`, `theme`, `themeLight`, `themeDark`, `themeSystem`; icons `IconSun`, `IconDesktop`.
- **Tests:** 3 new keyboard checks (25 in total) and 5 package checks (27).
- No `Tag` component: `Badge` already has `onRemove`.

### Added: dates
- **`Calendar`, `RangeCalendar`, `DatePicker`, `DateRangePicker`.** ISO-string values, `min`/`max`/`isDateDisabled`, quick-range presets, two-month view on wide screens. Built on the WAI-ARIA date picker grid: one tab stop, arrows by day and week, Home/End by week, Page Up/Down by month (Shift for year), a full spoken date on every day, `aria-current="date"` for today, selected and range cells marked with `aria-selected`, and start and end of a range announced. Selected days are told apart by fill and today by a ring, not by colour alone.
- **Tokens:** `calendar.*` and `date-picker.*`; 7 new contrast pairs (167 per mode). The today ring uses `color.intent.primary.fg` because `border-strong` measured 1.81:1 on white.
- **Labels:** `locale`, `firstDayOfWeek` and 11 strings in `PanceLabels` (month names and weekdays come from `Intl`).
- **Tests:** 4 new keyboard checks (22 in total), axe runs with both pickers open, 3 new package checks.

## [1.2.0] - 2026-10-15

### Added: data components (promoted from the docs site into `@pance/react`)
- **Metric cards:** `MetricCard` (variants `default`, `compact`, `hero`, `goal`, `breakdown`, `comparison`; states `loading`, `empty`, `error`), `Delta` and `Sparkline` (line and bar). The delta is announced with direction and whether it is better or worse; the sparkline is an image with a text alternative; goal progress is a `progressbar`.
- **`DataTable`** and **`Pagination`:** a real `<table>` with `aria-sort` headers, named row checkboxes (`aria-selected`, mixed select-all), density, search slot, loading and empty states; below `md` each row becomes a labelled card. `Pagination` is a labelled `nav` with `aria-current="page"`.
- **Charts:** `LineChart`, `BarChart` (grouped or stacked), `RankedBarChart`, `DivergingBarChart`, `Heatmap`, `DonutChart`. Arrow-key navigation with a live readout, "View as table" for every chart, and series told apart by marker shape and fill pattern as well as colour (WCAG 1.4.1).
- **Tokens:** `color.dataviz.series.1…8` and `color.dataviz.no-data` with dark values; categorical slots 3, 4 and 5 darkened in light mode (to 3:1 on white) and slot 7 lightened in dark mode; component tokens for `sparkline`, `metric-card`, `data-table` and `chart`.
- **Tests:** 13 new contrast pairs (160 per mode), 7 new keyboard and screen-reader checks, 4 new package checks.
- `Checkbox` accepts `ariaLabel` for checkboxes without a visible label.
- `PanceLabels` gains 29 strings for these components.
- **Figma:** new variables (series 1–8, no-data, sparkline, metric-card, data-table, chart tokens) and components (Metric card variants and states, Pagination, Data table row, empty and loading states, 7 charts).

### Changed
- Metric cards no longer lift on hover (they are not interactive). Chart colours come from tokens, so the old per-series `color` props are ignored.
- Not yet in the library: expandable table rows, scatter plot and column visibility menu (still docs-site specimens).

## [1.1.0] - 2026-10-15

First release on npm as `@pance/tokens` and `@pance/react`.

### Packages
- Two npm packages built from the repo: `@pance/tokens` (CSS variables, Tailwind v4 theme, typed JS, JSON, DTCG sources) and `@pance/react` (components, icons, `styles.css` for apps without Tailwind, `tailwind.css` for Tailwind v4 apps, TypeScript types). `pnpm build:packages`, `pnpm test:packages`, and a release workflow that publishes on a GitHub release with npm trusted publishing.
- **Breaking for direct source users:** components no longer read `useI18n`. Built-in strings come from the new `PanceProvider` / `useLabels` (English by default). The docs site passes its EN/ES dictionary to it.
- Component-only CSS (focus ring, range thumb) moved to `src/styles/components.css`.

### Figma
- New components bound to tokens: Avatar (20 variants) and Avatar group, Progress, Segmented control, Steps (Step, connector), Metric card (with Delta), and the Data table family (header cell, cell, row, composed table).
- Dogfooding gaps closed: Field has separate hint / error / success messages and an exposed, swappable control (Select now sits inside Field); Input separates placeholder and value.
- New "Streams dashboard" pattern built only from instances.

### Tokens
- Components are token-driven: every colour comes from a semantic utility (`bg-primary-solid`, `text-danger-fg`, `border-line-strong`, `text-ink-muted`…) or a component token (`bg-(--pance-button-color-primary-filled-bg)`). Button, Badge, Toggle, Checkbox, Radio, Steps, Tabs, Avatar and Tooltip read their component tokens directly.
- `theme.css` adds 88 intent utilities (`{intent}-{solid|solid-hover|solid-active|on-solid|soft|soft-hover|border|outline|border-strong|fg|dot}`), neutrals (`ink-disabled`, `ink-inverse`, `ink-brand`, `ink-link`, `line-strong`, `line-focus`, `surface-inverse`, `scrim`) and `shadow-card-rest` / `shadow-hover-lift`.
- 32 component tokens now alias semantic tokens instead of primitives (toggle, checkbox, radio, steps, nav-menu, avatar, tag-input, file-dropzone…); same values except `steps.color.connector-complete` (aqua-600 → primary solid, aqua-700). Mirrored in Figma.
- Hard-coded shadows, `text-white` and `bg-white` in components replaced by shadow tokens and `on-solid` / inverse tokens, so dark mode reaches them.
- `pnpm lint:tokens` (`scripts/check-token-usage.mjs`) fails CI if a component uses a palette step, hex or rgb colour.

### Tokens (dimensions and contrast)
- Tailwind scales map to Pance tokens: `--spacing` = `space.0-5` (4px), radius sm–2xl, `text-xs`…`text-6xl` plus `text-9/10/11/13/15`, font weights, leading, tracking, `max-w-sm…6xl` and `backdrop-blur-sm`.
- Button, Input, Badge, Toggle, Checkbox, Radio, Tabs, Modal, Drawer, Popover, Toast and Progress read their component size tokens. New tokens: `steps.label-max-width`, `tag-input.input-min-width`.
- `lint:tokens` also blocks magic pixel sizes (`w-[52px]`, `text-[13px]`) in components.
- New `tests/contrast.mjs` (`pnpm test:contrast`, in CI): 147 token pairs checked against WCAG 2.2 in light and dark.
- New semantic `color.border.control` (slate-500 light, slate-400 dark) for unchecked checkbox/radio boundaries and the off switch track: they were 2.56:1, below the 3:1 non-text minimum. Now 4.76:1.
- Dark mode: solid hover/active states now darken (white text kept ≥ 4.5:1), `fg` for info/help/danger uses step 300, `fg.subtle` uses slate-400, slider fills use the intent dot colour. All 147 pairs pass in dark.

### Fixed
- Link buttons and the SplitButton arrow ignored their padding override (`px-1`, `px-2`): the size padding won in the cascade. Now the override applies, so link buttons are tighter, as designed.

### Changed
- Secondary severity aligned to its tokens: soft badge/alert text slate-700 (was 600), soft background slate-100 (was slate-50). Contrast soft badge background slate-100 (was 200).

### Accessibility
- WAI-ARIA patterns with full keyboard support: `Modal` / `Drawer` (focus trap, Escape, focus return), `Popover`, `DropdownMenu` and `SplitButton` (menu button), `Select` (select-only combobox), `Combobox` and `TagInput` (autocomplete), `Tabs` (+ new `TabPanel`), `SegmentedControl` and new `RadioGroup` (roving tabindex), `Accordion`, `Panel` and `NavMenu` (disclosure), `Tooltip` (focus + Escape).
- `Field` now wires `id`, `aria-describedby`, `aria-invalid` and `aria-required` into its control; new `group` prop and `useFieldControl()` hook.
- Accessible names: `label` props on `Toggle`, `Select`, `Combobox`, `TagInput`, `RangeSlider` (+ `valueText`), `Progress` (+ `valueText`), `PinInput`, `Tabs`, `SegmentedControl`, `DropdownMenu`, `Breadcrumb`, `Steps`, `NavMenu`; `Avatar` gets `decorative` and `statusLabel`.
- Live regions: `Alert` and `Toast` use `role="alert"` only for danger/warning, `role="status"` otherwise; `ToastStack` is a labelled landmark. `Skeleton` is hidden from assistive tech.
- `aria-current` on `Breadcrumb`, `Steps` and `NavMenu`; password toggle back in the Tab order with a 24px target; `FileDropzone` is a native label + file input.
- Docs site: unlabelled demos, landmarks, heading order, empty table headers, scrollable regions and contrast fixed.
- `tests/keyboard.mjs` and `tests/axe.mjs`, run in CI. axe-core violations: 975 → 36.

### Fixed
- Alert outlined/solid borders and Badge remove-hover (Tailwind never generated those classes).
- `SplitButton` primary action had no `onClick`.

### Added
- Design tokens extracted into W3C DTCG JSON: `tokens/primitives.json`, `semantic.json`, `components.json` (852 tokens).
- Zero-dependency token build (`pnpm tokens`) that outputs CSS custom properties, a Tailwind v4 theme, a typed TS object, flat JSON and `docs/tokens.md`.
- `brand-950` (aqua-950 `#083344`) in the Tailwind theme.
- Docs: component reference, extraction audit and roadmap.
- GitHub Actions CI (typecheck, build, generated-files check).
- Unified semantic schema `bg / fg / border / intent.*` with draft dark mode (`data-theme="dark"`, opt-in).
- `intent.*.border-strong` for outlined surfaces.
- Figma library rebuilt from the tokens: 789 variables with scopes and code syntax, 14 text styles, 13 effect styles, 67 icons, 20 core components, Foundations and Cover pages. See `docs/figma.md`.
- MIT license.

### Changed
- **Contrast (WCAG 2.2 AA):** solid fills with white text move to step 700 (primary, success, info, warning); `ink-muted` → slate-600; brand text → aqua-700; chart axis labels → slate-500. axe-core contrast violations: 771 → 135.
- Focus ring: 2px aqua-600 + 4px aqua-100 halo (3.68:1). Single disabled opacity (0.45).
- Breakpoint `sm` documented as 640px (matches implementation); H3 is 20px.
- Component library split from a single `ui.tsx` into `src/components/*`. The public API is unchanged.
- Tailwind palette utilities now resolve to the documented Pance hex values instead of Tailwind's built-in OKLCH palette.
- Documentation site moved to `src/site/`. Figma Make build tooling removed.

## [1.0.0]

### Added
- First stable release: foundations, components and patterns, documented with live demos and usage guidance.
- English and Spanish documentation. Tokens, props and code samples keep their original names.
- Tendero console example: a full dashboard built only with Pance components.
- Pance is open source and free to use in your own projects.
