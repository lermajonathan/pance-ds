# DatePicker

> A button that opens a calendar and shows the chosen date.

```tsx
import { DatePicker } from '@pance/react'
```

Source: [`src/components/date.tsx`](../../src/components/date.tsx) · Figma: `Date picker` · Tokens: `date-picker.*` in [tokens.md](../tokens.md)

## When to use

- Date fields in forms.

## When not to use

- Dates the person knows by heart: a typed field may be faster.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` |  |  |
| `placeholder` | `string` |  |  |
| `disabled` | `boolean` |  |  |
| `error` | `boolean` |  |  |
| `className` | `string` |  |  |
| `value` | `string \| null` | **required** |  |
| `onChange` | `(value: string \| null) => void` | **required** |  |
| `min` | `string` |  |  |
| `max` | `string` |  |  |
| `isDateDisabled` | `((date: string) => boolean)` |  |  |
| `clearable` | `boolean` | `true` | Show a "Clear" action. |

## Accessibility

- Use inside `Field`: label and value form the accessible name. Non-modal dialog; Escape closes and refocuses the trigger.
- Dates are ISO strings (`"2026-10-15"`), never `Date` objects, so there are no time-zone surprises.

## Related

[`Calendar`](calendar.md) · [`DateRangePicker`](date-range-picker.md) · [`Field`](field.md)

## Example

```tsx
<Field label="Start date"><DatePicker value={d} onChange={setD} clearable /></Field>
```
