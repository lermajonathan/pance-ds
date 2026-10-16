# SwitchRow

> A full-width row with a title, description and a switch.

```tsx
import { SwitchRow } from '@pance/react'
```

Source: [`src/components/selection.tsx`](../../src/components/selection.tsx) · Figma: `SwitchRow` · Tokens: `toggle.*` in [tokens.md](../tokens.md)

## When to use

- Settings lists where each option needs an explanation.

## When not to use

- Single inline switches: use `Toggle`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | **required** |  |
| `description` | `string` |  |  |
| `on` | `boolean` | **required** |  |
| `onChange` | `(v: boolean) => void` | **required** |  |
| `disabled` | `boolean` |  |  |
| `size` | `ToggleSize` | `'md'` |  |

## Accessibility

- The label and description name and describe the switch, and clicking the row toggles it.

## Related

[`Toggle`](toggle.md)

## Example

```tsx
<SwitchRow label="Weekly digest" description="A summary every Monday" on={on} onChange={setOn} />
```
