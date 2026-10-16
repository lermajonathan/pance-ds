# Button

> The primary way to trigger an action. Severity says what it means, variant says how loud it is.

```tsx
import { Button } from '@pance/react'
```

Source: [`src/components/button.tsx`](../../src/components/button.tsx) · Figma: `Button` (severity, variant, size, state) · Tokens: `button.*` in [tokens.md](../tokens.md)

## When to use

- Submit a form, start a task, confirm or cancel a decision.
- One `filled` primary button per view for the main action; use `outlined` or `text` for secondary ones.
- Use `severity="danger"` for destructive actions, ideally behind a `ConfirmDialog`.

## When not to use

- Navigating to another page: use `Link`, so the element is an anchor.
- Toggling a state: use `ToggleButton` or `Toggle`.
- Icon-only actions without a name: use `IconButton`, which requires a label.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `severity` | `Severity` | `'primary'` |  |
| `variant` | `ButtonVariant` | `'filled'` |  |
| `size` | `ButtonSize` | `'md'` |  |
| `Icon` | `Icon` |  |  |
| `iconPos` | `IconPos` | `'left'` |  |
| `rounded` | `boolean` |  |  |
| `raised` | `boolean` |  |  |
| `loading` | `boolean` |  |  |
| `badge` | `string \| number` |  |  |
| `block` | `boolean` |  |  |
| `children` | `ReactNode` |  |  |

Also accepts all native `<button>` attributes (`type`, `disabled`, `onClick`, `aria-*`).

## Accessibility

- Renders a native `<button>`, so Enter and Space work and it sits in the Tab order.
- `loading` sets `aria-busy` and disables the button; keep the label so the action is still named.
- An icon-only `Button` (Icon, no children) needs `aria-label`; prefer `IconButton`.
- Focus shows the shared `pance-focus` ring on `:focus-visible`.
- Disabled buttons drop to 45% opacity; do not rely on that alone to explain why. Say it in a hint nearby.

## Content

- Start with a verb and name the object: "Save changes", "Delete stream".
- Avoid "OK", "Yes" and "Submit" when a specific verb fits.

## Related

[`IconButton`](icon-button.md) · [`ButtonGroup`](button-group.md) · [`SplitButton`](split-button.md) · [`ToggleButton`](toggle-button.md) · [`Link`](link.md) · [`ConfirmDialog`](confirm-dialog.md)

## Example

```tsx
<Button Icon={IconCheck} onClick={save}>Save changes</Button>
<Button severity="danger" variant="outlined" loading={deleting}>Delete stream</Button>
```
