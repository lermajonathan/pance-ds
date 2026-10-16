# Spinner

> An indeterminate loading indicator with a text name.

```tsx
import { Spinner } from '@pance/react'
```

Source: [`src/components/feedback.tsx`](../../src/components/feedback.tsx) · Figma: `Spinner` · Tokens: `spinner.*` in [tokens.md](../tokens.md)

## When to use

- Short waits of unknown length, inside buttons or small areas.

## When not to use

- Waits longer than a few seconds: use `Progress` with a value.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `size` | `SpinnerSize` | `'md'` |  |
| `label` | `string` |  |  |
| `className` | `string` | `''` |  |

## Accessibility

- `role="status"` named by `label` (default "Loading"). The arc stops under `prefers-reduced-motion`.

## Related

[`Progress`](progress.md) · [`Skeleton`](skeleton.md)

## Example

```tsx
<Spinner label="Loading events" />
```
