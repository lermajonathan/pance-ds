# Contributing to Pance

Thanks for helping. Pance is a design system for products that are heavy on data and forms, so the bar is: accessible (WCAG 2.2 AA), token-driven, and documented. This guide covers how to set up, what a change must include, and how it gets released.

## Set up

```bash
pnpm install
pnpm dev            # documentation site at http://localhost:5173
```

Node 22 and pnpm 10. Playwright's Chromium is needed for the browser tests (`pnpm exec playwright install chromium`).

## The source of truth

| What | Where | Rule |
|---|---|---|
| Design decisions | `tokens/*.json` (primitives → semantic → components) | Edit JSON, never the generated files. Reference other tokens with aliases (`{color.aqua.600}`), do not repeat hex values. Dark values live in `$extensions["pance.modes"].dark`. |
| Components | `src/components/*.tsx` | Style only with semantic utilities and component tokens (`bg-(--pance-…)`). `pnpm lint:tokens` rejects hex values, palette steps and magic dimensions. |
| Strings | `src/components/labels.tsx` | Components have no hard-coded user-facing text. Add a label (with an English default) and map it in the docs site. |
| Component docs | `scripts/docs/*.mjs` | Guidance is hand-written; props are generated from the source. |
| Figma | [Pance DS](https://www.figma.com/design/oU5j1pVQQZWGgZvTuW3IP1/Pance-DS) | Mirrors the repo, never leads it. See [docs/figma.md](docs/figma.md). |

Generated files (`src/styles/tokens.css`, `src/tokens.ts`, `tokens/dist/`, `docs/tokens.md`, `docs/components/`) are committed. CI fails when they are stale.

## Adding or changing a component

1. **Check it is needed.** If an existing component covers 80% of it, extend that one. If the same markup exists in the docs site, promote it rather than writing a second version.
2. **Tokens first.** Add a group to `tokens/components.json` with light and dark values, then run `pnpm tokens`. Add contrast pairs for new text/background combinations to `tests/contrast.mjs` (it must stay 100% in both modes).
3. **Build it** in the matching file under `src/components/` and export it from `src/components/index.ts`. Follow the shared model: `severity` for meaning, `variant` for emphasis, `size` as `sm · md · lg`.
4. **Accessibility is part of the component.** Use the matching WAI-ARIA Authoring Practices pattern and the helpers in `src/components/a11y.ts`. Meaning is never carried by colour alone. Controls get an accessible name. Focus is visible and never lost when an element disappears.
5. **Strings** go through `useLabels()`; add EN and ES entries for the docs site.
6. **Tests.** Add a behaviour check to `tests/keyboard.mjs` for anything interactive, and to `tests/packages.mjs` if it must work from the published package.
7. **Docs.** Add an entry in `scripts/docs/` (summary, when to use / not to use, accessibility, content, related, example), then run `pnpm docs`. Props appear automatically; write a JSDoc comment on a prop to give it a description.
8. **Show it** in the docs site (`src/site/`), in light and dark.
9. **Figma.** Add the component to the Figma file, bound to the same variables, and record it in [docs/figma.md](docs/figma.md) and [docs/figma-code-map.md](docs/figma-code-map.md).
10. **Changelog.** Add a line under `[Unreleased]` in [CHANGELOG.md](CHANGELOG.md).

## Checks that must pass

```bash
pnpm tokens && git diff --exit-code     # generated token files are committed
pnpm test:contrast                      # every colour pair, light and dark
pnpm lint:tokens                        # components only use tokens
pnpm typecheck
pnpm docs:check && pnpm test:docs       # component pages are fresh, examples type-check
pnpm build
pnpm build:packages && pnpm test:packages
# with `pnpm preview --port 4173` running:
pnpm test:keyboard http://localhost:4173/en
pnpm test:axe http://localhost:4173/en
```

CI runs all of these.

**Visual regression** needs no committed screenshots. CI builds the previous commit (or the pull request base), screenshots every docs page in light and dark, builds your commit and compares the two on the same machine. If it fails, download the `visual-diff` artifact from the run. If the change is intended, add `[visual-change]` to the commit message or pull request title. Locally: `pnpm test:visual:capture --baseline=/tmp/base` on the old build, then `pnpm test:visual --baseline=/tmp/base` on the new one.

## Commits and pull requests

- Small, focused commits with a clear message in the imperative ("Add Meter component").
- One concern per pull request. Describe what changed, why, and how you checked accessibility (keyboard path, screen-reader name, contrast).
- Screenshots in light and dark for visual changes.

## Versioning and releases

Pance follows [Semantic Versioning](https://semver.org); the policy for removing things is in [docs/deprecation.md](docs/deprecation.md).

- `@pance/react` and `@pance/tokens` share one version number.
- To release: move the `[Unreleased]` entries under a new version heading in the changelog, bump both `package.json` files, merge, and create a GitHub release whose tag matches (`v1.3.0`). The release workflow publishes both packages to npm with provenance; no token is stored in the repository.

## Reporting problems

Open an issue with the component, what you did, what you expected and what happened. For accessibility problems, include the assistive technology and browser. Please do not report security issues publicly; email the maintainer instead.
