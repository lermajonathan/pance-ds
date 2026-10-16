# Toggle

> An on/off switch for a setting that applies immediately.

```tsx
import { Toggle } from '@pance/react'
```

Source: [`src/components/selection.tsx`](../../src/components/selection.tsx) · Figma: `Toggle` · Tokens: `toggle.*` in [tokens.md](../tokens.md)

## When to use

- Settings that take effect right away: notifications on, dark mode.

## When not to use

- Choices that need a Save button: use `Checkbox`.
- Selecting several items: use `Checkbox`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `on` | `boolean` | **required** |  |
| `onChange` | `(v: boolean) => void` | **required** |  |
| `disabled` | `boolean` |  |  |
| `size` | `ToggleSize` | `'md'` |  |
| `label` | `string` |  | Accessible name. Required unless the switch sits inside a <label> or SwitchRow. |
| `labelledBy` | `string` |  |  |
| `describedBy` | `string` |  |  |

## Accessibility

- `role="switch"` with `aria-checked`; Space toggles.
- Needs a name: pass `label`/`labelledBy`, or use `SwitchRow`.
- State is shown by position and track fill, not colour alone.

## Related

[`SwitchRow`](switch-row.md) · [`Checkbox`](checkbox.md) · [`ToggleButton`](toggle-button.md)

## Example

```tsx
<Toggle on={on} onChange={setOn} label="Email alerts" />
```
