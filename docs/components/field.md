# Field

> Labels a control and connects its hint, error and character count to it for assistive technology.

```tsx
import { Field } from '@pance/react'
```

Source: [`src/components/forms.tsx`](../../src/components/forms.tsx) · Figma: `Field` · Tokens: `field.*` in [tokens.md](../tokens.md)

## When to use

- Around every form control: Input, Textarea, Select, Combobox, DatePicker, TagInput and others.

## When not to use

- Around a group of checkboxes or radios: they have their own `title` or `label`. Use `group` only when the field holds several buttons or chips.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | **required** |  |
| `group` | `boolean` |  | Set when the field holds several controls (buttons, radios, chips). The label then names a role="group". |
| `hint` | `string` |  |  |
| `error` | `string` |  |  |
| `success` | `string` |  |  |
| `required` | `boolean` |  |  |
| `optional` | `boolean` |  |  |
| `charCount` | `number` |  |  |
| `maxChars` | `number` |  |  |
| `children` | `ReactNode` | **required** |  |

## Accessibility

- Gives the control an `id` for the `<label>`, `aria-describedby` for hint, error and count, `aria-invalid` and `aria-required`.
- Errors replace the hint and are announced politely.
- Custom controls read the wiring with `useFieldControl()`.
- Mark optional fields with `optional`; mark required ones with `required` (adds text, not only an asterisk).

## Content

- Labels are nouns: "Email address". Hints explain format or why you ask. Errors say what to do: "Enter a date after 1 Jan".

## Related

[`Input`](input.md) · [`Textarea`](textarea.md) · [`Select`](select.md) · [`DatePicker`](date-picker.md)

## Example

```tsx
<Field label="Bio" hint="Up to 160 characters" maxChars={160} charCount={bio.length}>
  <Textarea value={bio} onChange={(e) => setBio(e.target.value)} />
</Field>
```
