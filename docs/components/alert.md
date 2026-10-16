# Alert

> An inline message about the state of the page or a form, in context.

```tsx
import { Alert } from '@pance/react'
```

Source: [`src/components/feedback.tsx`](../../src/components/feedback.tsx) · Figma: `Alert` · Tokens: `alert.*` in [tokens.md](../tokens.md)

## When to use

- Explain a problem, a warning or useful information next to the content it concerns.

## When not to use

- Temporary confirmations: use `Toast`.
- Decisions that block the flow: use `ConfirmDialog`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `severity` | `Severity` | `'primary'` |  |
| `variant` | `SurfaceVariant` | `'soft'` |  |
| `title` | `string` | **required** |  |
| `Icon` | `Icon` |  |  |
| `children` | `ReactNode` |  |  |
| `actions` | `ReactNode` |  |  |
| `onClose` | `(() => void)` |  |  |

## Accessibility

- `role="alert"` for danger and warning, `role="status"` otherwise.
- Every severity has a default glyph, so meaning never depends on colour.
- The close button is named from the labels (`dismiss`).

## Content

- Title says what happened; body says what to do next. Keep actions to one or two.

## Related

[`Toast`](toast.md) · [`EmptyState`](empty-state.md) · [`ConfirmDialog`](confirm-dialog.md)

## Example

```tsx
<Alert severity="warning" title="Quota almost reached" actions={<Button size="sm">Upgrade</Button>}>
  You have used 92% of your events this month.
</Alert>
```
