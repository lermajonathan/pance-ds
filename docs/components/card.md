# Card

> A bordered surface with a resting shadow for grouping content.

```tsx
import { Card } from '@pance/react'
```

Source: [`src/components/layout.tsx`](../../src/components/layout.tsx) · Figma: `Card` · Tokens: `card.*` in [tokens.md](../tokens.md)

## When to use

- Group related content that sits on the page background.

## When not to use

- Nesting cards inside cards.
- Content that needs a header and actions: use `Panel`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `className` | `string` | `''` |  |
| `children` | `ReactNode` | **required** |  |

## Accessibility

- Presentational. Add a heading inside so the section has a name.

## Related

[`Panel`](panel.md)

## Example

```tsx
<Card className="p-4">…</Card>
```
