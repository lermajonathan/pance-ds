# ToastStack

> The fixed bottom-right container that stacks toasts as a labelled landmark.

```tsx
import { ToastStack } from '@pance/react'
```

Source: [`src/components/feedback.tsx`](../../src/components/feedback.tsx) · Figma: `Toast` · Tokens: `toast.*` in [tokens.md](../tokens.md)

## When to use

- Render once near the app root and feed it your toast list.

## When not to use

- Several stacks on one page.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `toasts` | `ToastItem[]` | **required** |  |
| `onDismiss` | `(id: string) => void` | **required** |  |
| `label` | `string` | `'Notifications'` | Name of the notifications landmark. |

## Accessibility

- A labelled region (`label`, default "Notifications") so screen reader users can find it.

## Related

[`Toast`](toast.md)

## Example

```tsx
<ToastStack toasts={toasts} onDismiss={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />
```
