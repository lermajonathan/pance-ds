# Drawer

> A side or bottom sheet for secondary tasks that keep context behind them.

```tsx
import { Drawer } from '@pance/react'
```

Source: [`src/components/overlays.tsx`](../../src/components/overlays.tsx) · Figma: `Drawer` · Tokens: `drawer.*` in [tokens.md](../tokens.md)

## When to use

- Details, filters and longer forms without leaving the page.

## When not to use

- Quick confirmations: use `Modal`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `open` | `boolean` | **required** |  |
| `onClose` | `() => void` | **required** |  |
| `title` | `string` | **required** |  |
| `description` | `string` |  |  |
| `side` | `DrawerSide` | `'right'` |  |
| `footer` | `ReactNode` |  |  |
| `children` | `ReactNode` |  |  |

## Accessibility

- Same dialog behaviour as `Modal`. The bottom sheet is at most 85dvh.

## Related

[`Modal`](modal.md) · [`Popover`](popover.md)

## Example

```tsx
<Drawer open={open} onClose={close} title="Filters" side="right">…</Drawer>
```
