# TagInput

> Collects a list of short values as removable chips, with optional suggestions.

```tsx
import { TagInput } from '@pance/react'
```

Source: [`src/components/forms.tsx`](../../src/components/forms.tsx) · Figma: `Tag input` · Tokens: `tag-input.*` in [tokens.md](../tokens.md)

## When to use

- Tags, keywords, email recipients.

## When not to use

- Choosing from a fixed set only: use `Combobox` or checkboxes.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `tags` | `string[]` | **required** |  |
| `onChange` | `(tags: string[]) => void` | **required** |  |
| `placeholder` | `string` |  |  |
| `suggestions` | `string[]` | `[]` |  |
| `label` | `string` |  | Accessible name when the input isn't inside a <Field>. |

## Accessibility

- Enter or comma adds, Backspace removes the last tag; each chip has a named remove button.
- Suggestions are a listbox reachable with arrow keys.

## Related

[`Badge`](badge.md) · [`Combobox`](combobox.md) · [`Field`](field.md)

## Example

```tsx
<Field label="Tags"><TagInput tags={tags} onChange={setTags} suggestions={['api', 'billing']} /></Field>
```
