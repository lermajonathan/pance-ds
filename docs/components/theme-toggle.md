# ThemeToggle

> A Light / Dark / System radio group wired to `ThemeProvider`.

```tsx
import { ThemeToggle } from '@pance/react'
```

Source: [`src/components/theme.tsx`](../../src/components/theme.tsx) · Figma: `Theme toggle`

## When to use

- Settings or header.

## When not to use

- Outside a `ThemeProvider`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `size` | `"sm" \| "md" \| "lg"` | `'sm'` |  |
| `className` | `string` | `''` |  |

## Accessibility

- Radio group: one Tab stop, arrows move and select. Strings come from `labels.theme*`.

## Related

[`ThemeProvider`](theme-provider.md) · [`SegmentedControl`](segmented-control.md)

## Example

```tsx
<ThemeToggle />
```
