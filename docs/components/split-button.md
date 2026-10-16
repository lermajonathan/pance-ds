# SplitButton

> A primary action with a menu of alternatives attached.

```tsx
import { SplitButton } from '@pance/react'
```

Source: [`src/components/button.tsx`](../../src/components/button.tsx) · Figma: `Split button` · Tokens: `button.*` in [tokens.md](../tokens.md)

## When to use

- One default action plus a few variants, such as "Save" with "Save as draft".

## When not to use

- More than about six alternatives: use a `DropdownMenu`.
- Unrelated actions.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | **required** |  |
| `Icon` | `Icon` |  |  |
| `severity` | `Severity` | `'primary'` |  |
| `size` | `ButtonSize` | `'md'` |  |
| `items` | `{ label: string; Icon?: IconType; onSelect?: () => void; danger?: boolean; disabled?: boolean; }[]` | **required** |  |
| `onClick` | `(() => void)` |  | Primary action. |
| `menuLabel` | `string` |  | Accessible name of the arrow button. Defaults to the translated "More actions". |

## Accessibility

- The arrow is a separate menu button with `aria-haspopup="menu"` and `aria-expanded`, named by `menuLabel`.
- Same keyboard model as `DropdownMenu`: Enter, Space or ↓ opens, arrows move, Escape closes and refocuses.

## Content

- The main label is the default action. Menu items are alternatives to it, not a repeat.

## Related

[`DropdownMenu`](dropdown-menu.md) · [`Button`](button.md)

## Example

```tsx
<SplitButton
  label="Publish"
  onClick={publish}
  items={[{ label: 'Save as draft', onSelect: saveDraft }, { label: 'Schedule…', onSelect: schedule }]}
/>
```
