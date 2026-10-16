# Checkbox

> Selects zero or more items, with an indeterminate state for partial groups.

```tsx
import { Checkbox } from '@pance/react'
```

Source: [`src/components/selection.tsx`](../../src/components/selection.tsx) · Figma: `Checkbox` · Tokens: `checkbox.*` in [tokens.md](../tokens.md)

## When to use

- Multiple choices, agreements, table row selection.

## When not to use

- Immediate on/off settings: use `Toggle`.
- Exactly one choice: use `RadioGroup`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `checked` | `boolean` | **required** |  |
| `indeterminate` | `boolean` |  |  |
| `onChange` | `(v: boolean) => void` | **required** |  |
| `label` | `string` |  |  |
| `ariaLabel` | `string` |  | Accessible name when there is no visible label (e.g. a table's row checkbox). |
| `description` | `string` |  |  |
| `disabled` | `boolean` |  |  |
| `error` | `boolean` |  |  |
| `size` | `CheckboxSize` | `'md'` |  |

## Accessibility

- Native checkbox semantics; `indeterminate` exposes `aria-checked="mixed"`.
- Space toggles; the label is clickable.
- `error` is shown with text in the `Field`, not only colour.

## Related

[`CheckboxGroup`](checkbox-group.md) · [`Toggle`](toggle.md) · [`RadioGroup`](radio-group.md)

## Example

```tsx
<Checkbox checked={agree} onChange={setAgree} label="I accept the terms" />
```
