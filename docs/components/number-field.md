# NumberField

> A numeric field with − and + buttons. The value is a number; the text follows the language, with decimals, percent or currency.

```tsx
import { NumberField } from '@pance/react'
```

Source: [`src/components/forms.tsx`](../../src/components/forms.tsx) · Figma: `Number field` · Tokens: `input.*` in [tokens.md](../tokens.md)

## When to use

- A quantity or amount the person can type or nudge: guests, units, price, percentage.
- Values with a known range or step: set `min`, `max` and `step`.

## When not to use

- Identifiers that happen to be digits (phone, postcode, card number): use `Input` so leading zeros survive.
- A value picked from a wide range by feel: use `RangeSlider`.
- Only a handful of fixed choices: use `SegmentedControl` or `Select`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `ref` | `Ref<HTMLInputElement>` |  |  |
| `value` | `number \| null` |  | Controlled value. `null` is an empty field. |
| `defaultValue` | `number \| null` | `null` |  |
| `onValueChange` | `((value: number \| null) => void)` |  | Called with the committed number, or `null` when the field is emptied. |
| `min` | `number` |  |  |
| `max` | `number` |  |  |
| `step` | `number` | `1` | Amount for the arrow keys and the − / + buttons. |
| `largeStep` | `number` |  | Amount for PageUp, PageDown and Shift + arrow. Defaults to ten steps. |
| `formatOptions` | `Intl.NumberFormatOptions` |  | Passed to `Intl.NumberFormat`: decimals, percent, currency, units. |
| `inputSize` | `InputSize` | `'md'` |  |
| `error` | `boolean` |  |  |
| `success` | `boolean` |  |  |

Also accepts native `<input>` attributes (`id`, `placeholder`, `autoComplete`, `aria-label`); `name` adds a hidden field with the plain number.

## Accessibility

- The field is a `spinbutton` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax` and `aria-valuetext` (the formatted text, e.g. "$1,250.50").
- ArrowUp and ArrowDown change the value by `step`; PageUp, PageDown and Shift + arrow by `largeStep` (ten steps by default); Home and End go to `min` and `max` when they are set.
- The − and + buttons are named, kept out of the Tab order (the keyboard has the arrows) and never take focus from the field; they are disabled at the limits.
- Typing accepts only what can become a number in the current language; the value is read, clamped to `min` and `max` and re-formatted when you leave the field or press Enter.
- Inside `Field` it is wired automatically: label, hint, error and required.

## Content

- Say the unit in the label or hint ("Price per night, USD"), not in the placeholder.
- Errors say the range: "Choose between 1 and 10 guests".

## Related

[`Input`](input.md) · [`Field`](field.md) · [`RangeSlider`](range-slider.md)

## Example

```tsx
<Field label="Guests" hint="Between 1 and 10">
  <NumberField defaultValue={2} min={1} max={10} largeStep={5} onValueChange={setGuests} />
</Field>
```
