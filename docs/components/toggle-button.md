# ToggleButton

> A button that stays pressed: filled when on, outlined when off.

```tsx
import { ToggleButton } from '@pance/react'
```

Source: [`src/components/button.tsx`](../../src/components/button.tsx) · Figma: `Toggle button` · Tokens: `button.*` in [tokens.md](../tokens.md)

## When to use

- Toolbar-style on/off options such as Bold or Follow.

## When not to use

- Settings that apply immediately and need a visible switch: use `Toggle` or `SwitchRow`.
- Choosing one of several: use `SegmentedControl`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `on` | `boolean` | **required** |  |
| `onChange` | `(v: boolean) => void` | **required** |  |
| `onLabel` | `string` | **required** |  |
| `offLabel` | `string` | **required** |  |
| `OnIcon` | `Icon` |  |  |
| `OffIcon` | `Icon` |  |  |
| `size` | `ButtonSize` | `'md'` |  |

## Accessibility

- Sets `aria-pressed`. Keep the label the same in both states, or change it with `onLabel`/`offLabel` and never both the label and the state at once in a confusing way.
- Enter and Space toggle.

## Related

[`Toggle`](toggle.md) · [`SwitchRow`](switch-row.md) · [`Button`](button.md)

## Example

```tsx
<ToggleButton on={following} onChange={setFollowing} onLabel="Following" offLabel="Follow" />
```
