# Textarea

> A multi-line text field with a fixed 80px minimum height.

```tsx
import { Textarea } from '@pance/react'
```

Source: [`src/components/forms.tsx`](../../src/components/forms.tsx) · Figma: `Textarea` · Tokens: `input.*` in [tokens.md](../tokens.md)

## When to use

- Comments, descriptions and other free text longer than a line.

## When not to use

- Single-line values: use `Input`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `error` | `boolean` |  |  |
| `success` | `boolean` |  |  |
| `className` | `string` | `''` |  |

Also accepts native `<textarea>` attributes.

## Accessibility

- Same wiring as `Input` through `Field`.
- Show a character limit with `Field` `maxChars` rather than blocking typing silently.

## Related

[`Input`](input.md) · [`Field`](field.md)

## Example

```tsx
<Field label="Message"><Textarea rows={4} /></Field>
```
