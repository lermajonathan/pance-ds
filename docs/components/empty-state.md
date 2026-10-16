# EmptyState

> Explains why there is nothing to show and offers one next step.

```tsx
import { EmptyState } from '@pance/react'
```

Source: [`src/components/feedback.tsx`](../../src/components/feedback.tsx) · Figma: `Empty state` · Tokens: `empty-state.*` in [tokens.md](../tokens.md)

## When to use

- Empty lists, zero search results, first-run screens.

## When not to use

- Errors: use `Alert`.
- Loading: use `Skeleton`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `Icon` | `Icon` |  |  |
| `title` | `string` | **required** |  |
| `description` | `ReactNode` |  |  |
| `action` | `ReactNode` |  |  |
| `headingLevel` | `2 \| 3 \| 4 \| 5 \| 6` | `3` |  |
| `className` | `string` | `''` |  |

## Accessibility

- The title is a real heading; set `headingLevel` to keep the document outline correct.
- Decorative icons are hidden from assistive tech.

## Content

- Say what is missing and why, then give a single clear action.

## Related

[`Alert`](alert.md) · [`DataTable`](data-table.md) · [`Skeleton`](skeleton.md)

## Example

```tsx
<EmptyState Icon={IconFolder} title="No streams yet" description="Create your first stream to start collecting events." action={<Button>Create stream</Button>} />
```
