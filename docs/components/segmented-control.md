# SegmentedControl

> A compact single-choice control for switching a view or a mode.

```tsx
import { SegmentedControl } from '@pance/react'
```

Source: [`src/components/selection.tsx`](../../src/components/selection.tsx) · Figma: `Segmented control` · Tokens: `segmented-control.*` in [tokens.md](../tokens.md)

## When to use

- 2 to 4 short options that change how content is shown: Day / Week / Month.

## When not to use

- Navigating between sections: use `Tabs`.
- Many options: use `Select`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `options` | `{ value: T; label: string; Icon?: IconType; }[]` | **required** |  |
| `value` | `T` | **required** |  |
| `onChange` | `(v: T) => void` | **required** |  |
| `size` | `"sm" \| "md" \| "lg"` | `'md'` |  |
| `label` | `string` |  | Accessible name for the group, e.g. "View". |

## Accessibility

- `role="radiogroup"`, one Tab stop, arrows select. Give it a `label`.

## Related

[`Tabs`](tabs.md) · [`RadioGroup`](radio-group.md) · [`ButtonGroup`](button-group.md)

## Example

```tsx
<SegmentedControl label="Range" value={r} onChange={setR} options={[{ value: 'd', label: 'Day' }, { value: 'w', label: 'Week' }]} />
```
