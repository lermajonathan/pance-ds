# NotificationCenter

> A bell with an unread count that opens a list of notifications.

```tsx
import { NotificationCenter } from '@pance/react'
```

Source: [`src/components/notifications.tsx`](../../src/components/notifications.tsx) · Figma: `Notification bell`, `Notification panel`

## When to use

- App-level notifications the person can review later.

## When not to use

- Immediate feedback: use `Toast`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `items` | `NotificationItem[]` | **required** |  |
| `onRead` | `(id: string) => void` | **required** |  |
| `onReadAll` | `(() => void)` |  |  |
| `onDismiss` | `((id: string) => void)` |  |  |
| `footer` | `ReactNode` |  | Extra content under the list, such as a "View all" link. |
| `align` | `"start" \| "end"` | `'end'` |  |

## Accessibility

- The bell's name includes the count ("Notifications, 3 unread"); unread items say so in text.
- Each item has named Mark as read and Dismiss buttons; focus stays inside the panel when an item disappears; Escape closes and refocuses the bell.

## Related

[`Popover`](popover.md) · [`CountBadge`](count-badge.md) · [`Toast`](toast.md)

## Example

```tsx
<NotificationCenter items={items} onRead={markRead} onReadAll={markAll} onDismiss={dismiss} />
```
