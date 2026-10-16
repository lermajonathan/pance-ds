# Badge

> A small label for status, category or a removable tag.

```tsx
import { Badge } from '@pance/react'
```

Source: [`src/components/badge.tsx`](../../src/components/badge.tsx) · Figma: `Badge` · Tokens: `badge.*` in [tokens.md](../tokens.md)

## When to use

- Status of an item ("Active", "Failed").
- Tags and filters, with `onRemove`.

## When not to use

- Counts on a bell or tab: use `CountBadge`.
- Anything clickable beyond removal; use a `Button` or `Link`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `severity` | `Severity` | `'secondary'` |  |
| `variant` | `SurfaceVariant` | `'soft'` |  |
| `dot` | `boolean` |  |  |
| `rounded` | `boolean` | `true` |  |
| `size` | `BadgeSize` | `'md'` |  |
| `Icon` | `Icon` |  |  |
| `onRemove` | `(() => void)` |  |  |
| `children` | `ReactNode` | **required** |  |

## Accessibility

- Meaning is carried by the text, never by colour alone. Use `dot` or `Icon` to add a second cue.
- The remove button is named from the badge text ("Remove Beta").

## Content

- One or two words. Sentence case.

## Related

[`CountBadge`](count-badge.md) · [`TagInput`](tag-input.md)

## Example

```tsx
<Badge severity="success" dot>Active</Badge>
<Badge variant="outlined" onRemove={() => remove('beta')}>Beta</Badge>
```
