# ThemeProvider

> Chooses light, dark or system and sets `data-theme` on the document.

```tsx
import { ThemeProvider } from '@pance/react'
```

Source: [`src/components/theme.tsx`](../../src/components/theme.tsx)

## When to use

- Once at the app root.

## When not to use

- Nesting providers.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `defaultMode` | `ThemeMode` | `'system'` |  |
| `storageKey` | `string` | `DEFAULT_KEY` |  |
| `children` | `ReactNode` | **required** |  |

## Accessibility

- The system choice follows `prefers-color-scheme`. The choice is stored in `localStorage` and the app still works if storage is blocked. Inline `themeInitScript()` in `<head>` to avoid a flash.

## Related

[`ThemeToggle`](theme-toggle.md)

## Example

```tsx
<ThemeProvider defaultMode="system"><App /></ThemeProvider>
```
