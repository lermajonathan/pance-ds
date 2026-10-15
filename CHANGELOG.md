# Changelog

All notable changes to Pance are documented here. The format follows [Keep a Changelog](https://keepachangelog.com) and the project uses [Semantic Versioning](https://semver.org).

## [Unreleased]

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
