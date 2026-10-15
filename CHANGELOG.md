# Changelog

All notable changes to Pance are documented here. The format follows [Keep a Changelog](https://keepachangelog.com) and the project uses [Semantic Versioning](https://semver.org).

## [Unreleased]

### Added
- Design tokens extracted into W3C DTCG JSON: `tokens/primitives.json`, `semantic.json`, `components.json` (838 tokens).
- Zero-dependency token build (`pnpm tokens`) that outputs CSS custom properties, a Tailwind v4 theme, a typed TS object, flat JSON and `docs/tokens.md`.
- `brand-950` (aqua-950 `#083344`) in the Tailwind theme.
- Docs: component reference, extraction audit and roadmap.
- GitHub Actions CI (typecheck, build, generated-files check).

### Changed
- Component library split from a single `ui.tsx` into `src/components/*`. The public API is unchanged.
- Tailwind palette utilities now resolve to the documented Pance hex values instead of Tailwind's built-in OKLCH palette.
- Documentation site moved to `src/site/`. Figma Make build tooling removed.

## [1.0.0]

### Added
- First stable release: foundations, components and patterns, documented with live demos and usage guidance.
- English and Spanish documentation. Tokens, props and code samples keep their original names.
- Tendero console example: a full dashboard built only with Pance components.
- Pance is open source and free to use in your own projects.
