# Changelog

All notable changes to Pance are documented here. The format follows [Keep a Changelog](https://keepachangelog.com) and the project uses [Semantic Versioning](https://semver.org).

## [Unreleased]

### Fixed
- Alert outlined/solid borders and Badge remove-hover (Tailwind never generated those classes).

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
