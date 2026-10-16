# Panel

> A card with header, body, footer and optional collapse.

```tsx
import { Panel } from '@pance/react'
```

Source: [`src/components/layout.tsx`](../../src/components/layout.tsx) · Figma: `Panel` · Tokens: `panel.*` in [tokens.md](../tokens.md)

## When to use

- Settings sections, dashboard widgets, grouped forms.

## When not to use

- Plain wrappers: use `Card`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `title` | `string` | **required** |  |
| `description` | `string` |  |  |
| `icon` | `Icon` |  |  |
| `iconSeverity` | `Severity` | `'primary'` |  |
| `actions` | `ReactNode` |  |  |
| `footer` | `ReactNode` |  |  |
| `collapsible` | `boolean` | `false` |  |
| `children` | `ReactNode` |  |  |
| `className` | `string` | `''` |  |

## Accessibility

- The collapse button has `aria-expanded` and is named by the title.

## Related

[`Card`](card.md) · [`Accordion`](accordion.md)

## Example

```tsx
<Panel title="Retention" description="How long events are kept" collapsible>…</Panel>
```
