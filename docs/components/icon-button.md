# IconButton

> A square, bordered button that shows only an icon. The label is required and becomes its accessible name.

```tsx
import { IconButton } from '@pance/react'
```

Source: [`src/components/button.tsx`](../../src/components/button.tsx) · Figma: `IconButton` · Tokens: `button.*` in [tokens.md](../tokens.md)

## When to use

- Toolbar and table row actions where text would not fit.
- Close, copy, refresh and similar well-known glyphs.

## When not to use

- Primary actions: a visible label is clearer, use `Button`.
- Glyphs people may not recognise without text.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `Icon` | `Icon` | **required** |  |
| `label` | `string` | **required** |  |

Also accepts native `<button>` attributes.

## Accessibility

- `label` is required and is set as `aria-label`.
- Wrap in `Tooltip` when the glyph needs explaining; the tooltip also appears on keyboard focus.
- Hit area is 40×40.

## Content

- Name the action, not the picture: "Copy link", not "Clipboard".

## Related

[`Button`](button.md) · [`Tooltip`](tooltip.md)

## Example

```tsx
<IconButton Icon={IconCopy} label="Copy link" onClick={copy} />
```
