# CountBadge

> A compact numeric counter, capped at `max` (shows `99+`).

```tsx
import { CountBadge } from '@pance/react'
```

Source: [`src/components/badge.tsx`](../../src/components/badge.tsx) · Figma: `Count badge` · Tokens: `badge.*` in [tokens.md](../tokens.md)

## When to use

- Unread or pending totals next to an icon, tab or menu item.

## When not to use

- Text status: use `Badge`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `count` | `number` | **required** |  |
| `max` | `number` | `99` |  |
| `severity` | `Severity` | `'danger'` |  |

## Accessibility

- The number is plain text. Put the meaning in the name of the control it sits on, for example "Notifications, 3 unread".

## Related

[`Badge`](badge.md) · [`NotificationCenter`](notification-center.md)

## Example

```tsx
<CountBadge count={128} max={99} />
```
