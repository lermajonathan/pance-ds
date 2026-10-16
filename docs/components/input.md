# Input

> A single-line text field in three sizes, with optional leading and trailing icons and error or success states.

```tsx
import { Input } from '@pance/react'
```

Source: [`src/components/forms.tsx`](../../src/components/forms.tsx) · Figma: `Input` (size, state) · Tokens: `input.*` in [tokens.md](../tokens.md)

## When to use

- Short free text: names, emails, search, numbers.
- `type="password"` for secrets; it adds a show/hide toggle.

## When not to use

- Long text: use `Textarea`.
- A choice from a fixed list: use `Select`, `Combobox` or `RadioGroup`.
- Unlabelled: always wrap in `Field` or provide `aria-label`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `ref` | `Ref<HTMLInputElement>` |  |  |
| `Icon` | `Icon` |  |  |
| `TrailingIcon` | `Icon` |  |  |
| `error` | `boolean` |  |  |
| `success` | `boolean` |  |  |
| `inputSize` | `InputSize` | `'md'` |  |

Also accepts native `<input>` attributes (`type`, `value`, `onChange`, `placeholder`, `autoComplete`).

## Accessibility

- Inside `Field` it is wired automatically: label via `id`, `aria-describedby` for hint, error and count, `aria-invalid`, `aria-required`.
- The password toggle is in the Tab order and uses `aria-pressed`.
- Placeholders are not labels; they disappear and have low contrast by design.
- Error and success are shown by border plus message text, not colour alone.

## Content

- Placeholder shows an example, not an instruction: "name@company.com".

## Related

[`Field`](field.md) · [`InputGroup`](input-group.md) · [`Textarea`](textarea.md)

## Example

```tsx
<Field label="Email" hint="We only use it for receipts" required>
  <Input type="email" placeholder="name@company.com" autoComplete="email" />
</Field>
```
