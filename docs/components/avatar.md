# Avatar

> A person or entity as an image or initials, with an optional presence status.

```tsx
import { Avatar } from '@pance/react'
```

Source: [`src/components/avatar.tsx`](../../src/components/avatar.tsx) · Figma: `Avatar` · Tokens: `avatar.*` in [tokens.md](../tokens.md)

## When to use

- Identify users in lists, comments and headers.

## When not to use

- Decorative icons: use the icon itself.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `src` | `string` |  |  |
| `name` | `string` | **required** |  |
| `size` | `number` | `36` |  |
| `ring` | `boolean` |  |  |
| `status` | `AvatarStatus` |  |  |
| `square` | `boolean` |  |  |
| `decorative` | `boolean` |  | Set when the name is already shown as text next to the avatar, so screen readers don't hear it twice. |
| `statusLabel` | `string` |  | Spoken status, e.g. a translated "Online". Defaults to the status key. |

## Accessibility

- `name` is required: it is the accessible name and the source of the initials.
- Set `decorative` when the name is already visible next to it.
- `status` is spoken through `statusLabel`; the dot is never the only cue.

## Related

[`AvatarGroup`](avatar-group.md)

## Example

```tsx
<Avatar name="Camila Pérez" src="/camila.jpg" status="online" statusLabel="Online" />
```
