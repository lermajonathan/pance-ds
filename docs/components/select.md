# Select

> A select-only dropdown built as a button plus listbox, with typeahead.

```tsx
import { Select } from '@pance/react'
```

Source: [`src/components/forms.tsx`](../../src/components/forms.tsx) · Figma: `Select` · Tokens: `input.*` in [tokens.md](../tokens.md)

## When to use

- Choosing one value from a list of about 4 to 15 items.

## When not to use

- Fewer than 4 options: use `RadioGroup`.
- Long lists that need filtering: use `Combobox`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `options` | `string[]` | **required** |  |
| `value` | `string` | **required** |  |
| `onChange` | `(v: string) => void` | **required** |  |
| `label` | `string` |  | Accessible name when not inside a Field. |
| `disabled` | `boolean` |  |  |
| `error` | `boolean` |  |  |

## Accessibility

- Select-only combobox pattern: Enter, Space or ↑↓ open, arrows/Home/End move, typing jumps to a match, Enter or Space chooses, Escape closes.
- Always give it a name through `Field` or `label`.

## Related

[`Combobox`](combobox.md) · [`RadioGroup`](radio-group.md) · [`Field`](field.md)

## Example

```tsx
<Field label="Region"><Select options={['Andina', 'Caribe', 'Pacífica']} value={r} onChange={setR} /></Field>
```
