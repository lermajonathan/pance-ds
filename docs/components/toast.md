# Toast

> A short, temporary message about something that just happened, with an optional follow-up action such as Undo.

```tsx
import { Toast } from '@pance/react'
```

Source: [`src/components/feedback.tsx`](../../src/components/feedback.tsx) · Figma: `Toast`, `Toast / With action` · Tokens: `toast.*` in [tokens.md](../tokens.md)

## When to use

- Confirm a completed action; offer a quick Undo with `action`.

## When not to use

- Errors that need attention or a decision: use `Alert` or a dialog.
- Anything the person must not miss: toasts disappear.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `item` | `ToastItem` | **required** |  |
| `onDismiss` | `(id: string) => void` | **required** |  |

## Accessibility

- `role="status"` (`alert` for danger). The dismiss button is named; the action button runs and dismisses.
- Do not auto-dismiss messages that contain actions too quickly (WCAG 2.2.1).

## Related

[`ToastStack`](toast-stack.md) · [`Alert`](alert.md)

## Example

```tsx
<Toast item={{ id: '1', severity: 'success', title: 'Stream deleted', action: { label: 'Undo', onClick: restore } }} onDismiss={dismiss} />
```
