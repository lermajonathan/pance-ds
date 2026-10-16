# ButtonGroup

> Joins related buttons into one control by collapsing inner borders and radii.

```tsx
import { ButtonGroup } from '@pance/react'
```

Source: [`src/components/button.tsx`](../../src/components/button.tsx) · Figma: `Button group` · Tokens: `button.*` in [tokens.md](../tokens.md)

## When to use

- Closely related actions or a small set of view options.

## When not to use

- Choosing exactly one option: use `SegmentedControl`.
- Unrelated actions; keep normal spacing.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `children` | `ReactNode` | **required** |  |

## Accessibility

- Each child keeps its own button semantics and Tab stop.
- Add `role="group"` and `aria-label` when the group needs a name.

## Related

[`Button`](button.md) · [`SegmentedControl`](segmented-control.md) · [`SplitButton`](split-button.md)

## Example

```tsx
<ButtonGroup>
  <Button variant="outlined">Day</Button>
  <Button variant="outlined">Week</Button>
</ButtonGroup>
```
