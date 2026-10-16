# Link

> An inline navigation link that is always underlined, so it never depends on colour alone.

```tsx
import { Link } from '@pance/react'
```

Source: [`src/components/navigation.tsx`](../../src/components/navigation.tsx) · Figma: `Link`

## When to use

- Moving to another page or section, inside text or on its own.
- External destinations, with `external`.

## When not to use

- Running an action in the page: use `Button`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `variant` | `"default" \| "subtle"` | `'default'` |  |
| `external` | `boolean` |  |  |
| `render` | `((props: { className: string; children: ReactNode; }) => ReactNode)` |  |  |
| `children` | `ReactNode` | **required** |  |

Also accepts native `<a>` attributes.

## Accessibility

- Always underlined (WCAG 1.4.1).
- `external` adds `target="_blank"`, `rel="noopener noreferrer"`, an icon and spoken text "opens in a new tab".
- Use `render` to apply the styles to your router link while keeping an `<a>` in the DOM.

## Content

- Link text should make sense out of context. Avoid "click here".

## Related

[`Button`](button.md) · [`Breadcrumb`](breadcrumb.md)

## Example

```tsx
<Link href="/docs">Read the docs</Link>
<Link href="https://example.com" external>Status page</Link>
```
