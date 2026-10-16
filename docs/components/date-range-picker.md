# DateRangePicker

> A button that opens a two-month calendar with optional presets.

```tsx
import { DateRangePicker } from '@pance/react'
```

Source: [`src/components/date.tsx`](../../src/components/date.tsx) · Figma: `Date range panel` · Tokens: `date-picker.*` in [tokens.md](../tokens.md)

## When to use

- Filtering reports by period, with presets such as "Last 7 days".

## When not to use

- A single date: use `DatePicker`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` |  |  |
| `placeholder` | `string` |  |  |
| `disabled` | `boolean` |  |  |
| `error` | `boolean` |  |  |
| `className` | `string` |  |  |
| `value` | `DateRange` | **required** |  |
| `onChange` | `(value: DateRange) => void` | **required** |  |
| `min` | `string` |  |  |
| `max` | `string` |  |  |
| `isDateDisabled` | `((date: string) => boolean)` |  |  |
| `presets` | `DateRangePreset[]` |  | Quick ranges such as "Last 7 days". |
| `clearable` | `boolean` | `true` |  |

## Accessibility

- Same behaviour as `DatePicker`. Presets are buttons in the panel.
- Dates are ISO strings (`"2026-10-15"`), never `Date` objects, so there are no time-zone surprises.

## Related

[`RangeCalendar`](range-calendar.md) · [`DatePicker`](date-picker.md)

## Example

```tsx
<Field label="Period"><DateRangePicker value={range} onChange={setRange} presets={presets} /></Field>
```
