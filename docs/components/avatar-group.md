# AvatarGroup

> Overlapping avatars with a +N chip for the rest.

```tsx
import { AvatarGroup } from '@pance/react'
```

Source: [`src/components/avatar.tsx`](../../src/components/avatar.tsx) · Figma: `Avatar group` · Tokens: `avatar.*` in [tokens.md](../tokens.md)

## When to use

- Show who is part of something in a small space.

## When not to use

- When people need to be reachable one by one: use a list.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `people` | `{ name: string; src?: string; }[]` | **required** |  |
| `max` | `number` | `4` |  |

## Accessibility

- Each avatar is named; the +N chip is read as a number. Add a visible or hidden sentence when the total matters.

## Related

[`Avatar`](avatar.md)

## Example

```tsx
<AvatarGroup max={3} people={[{ name: 'Ana' }, { name: 'Luis' }, { name: 'Marta' }, { name: 'Iván' }]} />
```
