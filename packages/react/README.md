# @pance/react

Accessible, token-driven React components from **[Pance](https://pance-ds.jonathanlerma.com)**, a design system for social and data-heavy products.

- 45+ components with one model: **severity** (what it means) × **variant** (how loud) × **size**
- WCAG 2.2 AA: WAI-ARIA keyboard patterns (dialog, menu, combobox, tabs, radio group…), labelled form fields, contrast checked in light and dark
- Every colour and size comes from [`@pance/tokens`](https://www.npmjs.com/package/@pance/tokens)
- No router or i18n dependency: built-in strings are English by default and translatable

## Install

```bash
npm install @pance/react
```

Requires React 19.

## Use

**Without Tailwind** (the stylesheet includes a CSS reset, the tokens and the component styles):

```tsx
import '@pance/react/styles.css'
import { Button, Field, Input, Badge } from '@pance/react'

export function Example() {
  return (
    <>
      <Field label="Stream name" hint="Lowercase, 3–40 characters." required>
        <Input placeholder="e.g. checkout-events" />
      </Field>
      <Button severity="primary">Create stream</Button>
      <Badge severity="success" dot>Flowing</Badge>
    </>
  )
}
```

**With Tailwind v4** (share one stylesheet and use Pance utilities like `bg-primary-solid` or `text-ink-muted` in your own code):

```css
@import "tailwindcss";
@import "@pance/react/tailwind.css";
```

**Fonts.** Pance uses Plus Jakarta Sans, Inter and JetBrains Mono. Load them however you prefer, for example:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap">
```

**Dark mode (preview).** Set `data-theme="dark"` on `<html>`.

## Translate the built-in strings

```tsx
import { PanceProvider } from '@pance/react'

<PanceProvider labels={{ close: 'Cerrar', remove: 'Quitar', noResults: (q) => `Sin resultados para "${q}"` }}>
  <App />
</PanceProvider>
```

## Links

- Documentation and live demos: https://pance-ds.jonathanlerma.com
- Component API: https://github.com/lermajonathan/pance-ds/blob/main/docs/components.md
- Figma library (free on Figma Community): https://www.figma.com/community/file/1694091498392766646

MIT © Jonathan Lerma
