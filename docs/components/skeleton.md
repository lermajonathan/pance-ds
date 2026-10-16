# Skeleton

> A pulsing placeholder that holds the shape of content while it loads.

```tsx
import { Skeleton } from '@pance/react'
```

Source: [`src/components/feedback.tsx`](../../src/components/feedback.tsx) · Figma: `Skeleton` · Tokens: `skeleton.*` in [tokens.md](../tokens.md)

## When to use

- Loading states where the layout is known.

## When not to use

- Waits under about 300 ms.
- Unknown layout: use `Spinner`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `className` | `string` | `''` |  |

## Accessibility

- `aria-hidden`; set `aria-busy="true"` on the loading container. The pulse stops with `prefers-reduced-motion`.

## Related

[`Spinner`](spinner.md) · [`EmptyState`](empty-state.md)

## Example

```tsx
<div aria-busy="true"><Skeleton className="h-4 w-40" /></div>
```
