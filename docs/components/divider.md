# Divider

> A horizontal rule, optionally with a centred label.

```tsx
import { Divider } from '@pance/react'
```

Source: [`src/components/layout.tsx`](../../src/components/layout.tsx) · Figma: `Divider`

## When to use

- Separate groups of content, e.g. "or" between sign-in options.

## When not to use

- Spacing alone is enough for most cases.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` |  |  |
| `soft` | `boolean` |  |  |

## Accessibility

- Decorative separator; a label is read as text.

## Related

[`Card`](card.md)

## Example

```tsx
<Divider label="or" />
```
