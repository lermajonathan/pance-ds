# TimeField

> A time-of-day field. The value is a 24-hour "HH:mm" text; what the person reads and types follows the language, on a 12 or 24 hour clock.

```tsx
import { TimeField } from '@pance/react'
```

Source: [`src/components/forms.tsx`](../../src/components/forms.tsx) · Figma: `Time field` · Tokens: `input.*` in [tokens.md](../tokens.md)

## When to use

- A time of day on its own: opening hours, a reminder, a meeting start.
- Limits that matter: set `min` and `max` (for example office hours) and `step` for the minutes.

## When not to use

- A date and a time together: pair it with `DatePicker` in the same `Field` group.
- A length of time ("90 minutes"): use `NumberField` with a unit.
- Only a few fixed slots: use `SegmentedControl`, `RadioGroup` or `Select`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `ref` | `Ref<HTMLInputElement>` |  |  |
| `value` | `string \| null` |  | Controlled value as "HH:mm" (24 h). `null` is an empty field. |
| `defaultValue` | `string \| null` | `null` |  |
| `onValueChange` | `((value: string \| null) => void)` |  | Called with the committed "HH:mm", or `null` when the field is emptied. |
| `min` | `string` |  | Earliest time, "HH:mm". |
| `max` | `string` |  | Latest time, "HH:mm". |
| `step` | `number` | `1` | Minutes per press of ArrowUp / ArrowDown on the minutes. |
| `inputSize` | `InputSize` | `'md'` |  |
| `error` | `boolean` |  |  |
| `success` | `boolean` |  |  |

Also accepts native `<input>` attributes (`id`, `placeholder`, `autoComplete`, `aria-label`); `name` adds a hidden field with the plain "HH:mm" value.

## Accessibility

- The field is a `spinbutton` with `aria-valuenow` (minutes since midnight), `aria-valuemin`, `aria-valuemax` and `aria-valuetext` (the formatted time, e.g. "1:45 PM").
- ArrowUp and ArrowDown change the part under the caret: the hour, the minutes (by `step`) or AM/PM; the caret stays in that part. PageUp and PageDown change the hour; Home and End go to `min` and `max`.
- Typing accepts only what can become a time in the current language ("945", "1:45 pm", "13:45"); the text is read, clamped to `min` and `max` and re-formatted when you leave the field or press Enter.
- Hours wrap around midnight; minutes stop at the edges of the day.
- Inside `Field` it is wired automatically: label, hint, error and required.

## Content

- Say the zone or meaning in the label ("Start time, Bogotá"), not in the placeholder.
- Errors say the range: "Choose a time between 8:00 and 20:00".

## Related

[`NumberField`](number-field.md) · [`DatePicker`](date-picker.md) · [`Field`](field.md)

## Example

```tsx
<Field label="Start time" hint="Between 8:00 and 20:00">
  <TimeField defaultValue="09:30" min="08:00" max="20:00" step={15} onValueChange={setStart} />
</Field>
```
