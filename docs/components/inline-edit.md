# InlineEdit

> Text that turns into an input on click and commits on Enter.

```tsx
import { InlineEdit } from '@pance/react'
```

Source: [`src/components/forms.tsx`](../../src/components/forms.tsx) · Figma: `Inline edit` · Tokens: `input.*` in [tokens.md](../tokens.md)

## When to use

- Renaming an item in place where a full form would be heavy.

## When not to use

- Fields that need validation messages: use a `Field` and a form.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `string` | **required** |  |
| `onChange` | `(v: string) => void` | **required** |  |
| `placeholder` | `string` |  |  |

## Accessibility

- The display state is a button that says what it edits; Enter commits and Escape cancels, returning focus to the button.

## Related

[`Input`](input.md)

## Example

```tsx
<InlineEdit value={name} onChange={setName} placeholder="Untitled stream" />
```
