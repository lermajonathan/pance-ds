# Deprecation policy

Pance is used by products that cannot upgrade on a whim. This policy says what counts as a breaking change, how long something stays after it is deprecated, and how you will find out.

## What is public API

Covered by this policy:

- Exports of `@pance/react` (components, hooks, helpers, types).
- Component props, their accepted values and their defaults.
- Token names in `@pance/tokens` and the CSS custom properties (`--pance-*`, semantic utilities such as `bg-primary-solid`).
- The documented ARIA and keyboard behaviour.

Not covered: internal files, anything not exported from the package entry, generated file layout, and the docs site itself.

## What counts as breaking

| Breaking (major version) | Not breaking (minor or patch) |
|---|---|
| Removing or renaming an export, prop, prop value or token | Adding a component, prop, value or token |
| Changing a default so existing output changes | Fixing a bug, including accessibility bugs, even if output changes |
| Removing or changing documented keyboard or ARIA behaviour | Improving contrast or focus visibility |
| Raising the minimum React, Node or Tailwind version | Small visual refinements within the same token values |

Changing the value of a token (for example a slightly different slate) is a minor change when the contrast checks still pass, and is always listed in the changelog.

## The process

1. **Announce.** The change ships in a minor release. The old API keeps working and is marked `@deprecated` in its JSDoc with the replacement ("Use `ConfirmDialog` instead"), so editors strike it through. The changelog lists it under **Deprecated**, and the component page gets a "Deprecated" note.
2. **Warn.** In development builds only, using a deprecated prop or component logs one `console.warn` per session with the replacement. Production builds stay quiet.
3. **Wait.** A deprecated API stays for at least **two minor releases and 90 days**, whichever is longer.
4. **Remove.** Removal happens only in a major version, and the changelog has a migration note with before/after code. Where it can be mechanical, the note includes a codemod or search-and-replace.

Tokens follow the same steps. A renamed token keeps the old name as an alias to the new one for the same period.

## Exceptions

- **Security or accessibility defects** can be fixed immediately, even if that changes behaviour. The fix is called out in the changelog.
- **Pre-1.0 or experimental** exports (marked `@experimental` in JSDoc) can change in any minor release.

## For contributors

Do not delete a public API in a pull request. Mark it `@deprecated`, add the warning, add a changelog line under **Deprecated**, and open an issue to remove it in the next major. Run `pnpm docs` so the page reflects it.
