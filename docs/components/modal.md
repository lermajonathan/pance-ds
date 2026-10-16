# Modal

> A dialog that blocks the page until the person responds.

```tsx
import { Modal } from '@pance/react'
```

Source: [`src/components/overlays.tsx`](../../src/components/overlays.tsx) · Figma: `Modal` · Tokens: `modal.*` in [tokens.md](../tokens.md)

## When to use

- Short, focused tasks and decisions that need full attention.

## When not to use

- Information that can sit in the page: use `Alert`.
- Long forms: use a page or `Drawer`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `open` | `boolean` | **required** |  |
| `onClose` | `() => void` | **required** |  |
| `title` | `string` | **required** |  |
| `description` | `string` |  |  |
| `size` | `ModalSize` | `'md'` |  |
| `icon` | `Icon` |  |  |
| `iconSeverity` | `Severity` | `'danger'` |  |
| `footer` | `ReactNode` |  |  |
| `children` | `ReactNode` |  |  |

## Accessibility

- `role="dialog"` with `aria-modal`, named by the title and described by `description`.
- Focus moves in, is trapped, Escape closes, and focus returns to the opener.
- Background scroll is locked.

## Content

- Title states the task. Primary button repeats the verb.

## Related

[`ConfirmDialog`](confirm-dialog.md) · [`Drawer`](drawer.md) · [`Popover`](popover.md)

## Example

```tsx
<Modal open={open} onClose={() => setOpen(false)} title="Rename stream" footer={<Button onClick={save}>Save</Button>}>…</Modal>
```
