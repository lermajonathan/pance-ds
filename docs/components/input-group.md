# InputGroup

> An input with attached prefix, suffix, icons or a button that share one focus ring.

```tsx
import { InputGroup } from '@pance/react'
```

Source: [`src/components/forms.tsx`](../../src/components/forms.tsx) · Figma: `Input group` · Tokens: `input.*` in [tokens.md](../tokens.md)

## When to use

- Units ("kg"), protocols ("https://"), search with a submit button.

## When not to use

- Plain inputs: use `Input`.
- Complex composites with several fields: lay out separate `Field`s.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `prefix` | `string` |  |  |
| `suffix` | `string` |  |  |
| `prefixIcon` | `Icon` |  |  |
| `suffixIcon` | `Icon` |  |  |
| `suffixButton` | `ReactNode` |  |  |
| `children` | `ReactNode` | **required** |  |

Also accepts native `<input>` attributes.

## Accessibility

- The add-ons are presentational text; make sure the label already states the unit.
- `suffixButton` is a real button and needs its own accessible name.

## Related

[`Input`](input.md) · [`Field`](field.md)

## Example

```tsx
<Field label="Website"><InputGroup prefix="https://" suffix=".com"><Input /></InputGroup></Field>
```
