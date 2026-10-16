# ConfirmDialog

> A modal for decisions that are hard to undo, with optional type-to-confirm.

```tsx
import { ConfirmDialog } from '@pance/react'
```

Source: [`src/components/dialogs.tsx`](../../src/components/dialogs.tsx) · Figma: `Confirm dialog` · Tokens: `modal.*` in [tokens.md](../tokens.md)

## When to use

- Deleting data, revoking access, anything irreversible.

## When not to use

- Reversible actions: do them and offer Undo with a `Toast` action.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `open` | `boolean` | **required** |  |
| `onClose` | `() => void` | **required** |  |
| `onConfirm` | `() => void` | **required** |  |
| `title` | `string` | **required** |  |
| `description` | `string` |  |  |
| `confirmLabel` | `string` | **required** | Text of the confirm button, as an action: "Delete stream". |
| `cancelLabel` | `string` |  | Defaults to the translated "Cancel". |
| `severity` | `Severity` | `'danger'` |  |
| `icon` | `Icon` | `IconTrash` |  |
| `requireText` | `string` |  | Phrase to type before the confirm button is enabled. |
| `loading` | `boolean` |  |  |
| `children` | `ReactNode` |  |  |

## Accessibility

- Built on `Modal`: focus trap, Escape, focus return. The confirm button stays disabled until `requireText` matches.

## Content

- Name the action in `confirmLabel` ("Delete stream"); never "OK". Say what will be lost in `description`.

## Related

[`Modal`](modal.md) · [`Toast`](toast.md) · [`Alert`](alert.md)

## Example

```tsx
<ConfirmDialog open={open} onClose={close} onConfirm={remove} title="Delete stream?" description="Events will be lost." confirmLabel="Delete stream" requireText="checkout-events" />
```
