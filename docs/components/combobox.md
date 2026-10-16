# Combobox

> A text field with an autocomplete list of options.

```tsx
import { Combobox } from '@pance/react'
```

Source: [`src/components/forms.tsx`](../../src/components/forms.tsx) · Figma: `Combobox` · Tokens: `input.*` in [tokens.md](../tokens.md)

## When to use

- Long lists where typing is faster than scrolling, and values are known.

## When not to use

- Short lists: use `Select` or `RadioGroup`.
- Free values mixed with suggestions: use `TagInput`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `options` | `{ value: string; label: string; meta?: string; }[]` | **required** |  |
| `value` | `string` | **required** |  |
| `onChange` | `(v: string) => void` | **required** |  |
| `placeholder` | `string` |  |  |
| `label` | `string` |  | Accessible name when not inside a Field. |

## Accessibility

- WAI-ARIA combobox with list autocomplete: type to filter, ↑↓ move the active option, Enter selects, Escape closes.
- The result count and "no results" message are announced.

## Related

[`Select`](select.md) · [`TagInput`](tag-input.md) · [`Field`](field.md)

## Example

```tsx
<Field label="City"><Combobox options={cities} value={city} onChange={setCity} /></Field>
```
