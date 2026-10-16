# Accordion

> Stacked sections that expand and collapse.

```tsx
import { Accordion } from '@pance/react'
```

Source: [`src/components/layout.tsx`](../../src/components/layout.tsx) · Figma: `Accordion item` · Tokens: `accordion.*` in [tokens.md](../tokens.md)

## When to use

- FAQs and long settings where people read only some parts.

## When not to use

- Content everyone must read.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `items` | `AccordionItem[]` | **required** |  |
| `allowMultiple` | `boolean` | `false` |  |
| `headingLevel` | `2 \| 3 \| 4 \| 5 \| 6` | `3` | Heading level wrapping each trigger (WAI-ARIA accordion pattern). Match it to the page outline. |

## Accessibility

- Triggers sit inside headings (`headingLevel`) with `aria-expanded` and `aria-controls`; panels are labelled regions. Enter and Space toggle.

## Related

[`Panel`](panel.md) · [`Tabs`](tabs.md)

## Example

```tsx
<Accordion items={[{ id: 'a', title: 'How is usage billed?', content: 'Per million events.' }]} />
```
