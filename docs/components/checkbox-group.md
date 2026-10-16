# CheckboxGroup

> A titled list of checkboxes with a select-all parent.

```tsx
import { CheckboxGroup } from '@pance/react'
```

Source: [`src/components/selection.tsx`](../../src/components/selection.tsx) · Figma: `Checkbox group` · Tokens: `checkbox.*` in [tokens.md](../tokens.md)

## When to use

- Choosing several options where "all" is a useful shortcut.

## When not to use

- A single yes/no: use `Checkbox`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `title` | `string` |  |  |
| `options` | `{ value: string; label: string; description?: string; }[]` | **required** |  |
| `values` | `Set<string>` | **required** |  |
| `onChange` | `(values: Set<string>) => void` | **required** |  |

## Accessibility

- The parent checkbox is indeterminate when only some children are selected.
- The group has a visible title that names it.

## Related

[`Checkbox`](checkbox.md)

## Example

```tsx
<CheckboxGroup title="Channels" options={channels} values={selected} onChange={setSelected} />
```
