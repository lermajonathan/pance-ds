# RangeCalendar

> A calendar for picking a start and end date, with one or two months.

```tsx
import { RangeCalendar } from '@pance/react'
```

Source: [`src/components/date.tsx`](../../src/components/date.tsx) · Figma: `Calendar / Range` · Tokens: `calendar.*` in [tokens.md](../tokens.md)

## When to use

- Report ranges, bookings.

## When not to use

- A single date: use `Calendar`.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `DateRange` | **required** |  |
| `onChange` | `(value: DateRange) => void` | **required** |  |
| `min` | `string` |  |  |
| `max` | `string` |  |  |
| `isDateDisabled` | `((date: string) => boolean)` |  |  |
| `months` | `2 \| 1` |  |  |
| `defaultMonth` | `string` |  |  |
| `autoFocus` | `boolean` |  |  |
| `bordered` | `boolean` |  | Draws the outer border, radius and surface. Off by default so the calendar can sit inside a popover or card. |
| `className` | `string` |  |  |

## Accessibility

- Same keys as `Calendar`. Pick the first day then the last; a third click starts a new range. The preview follows pointer and focus.
- Dates are ISO strings (`"2026-10-15"`), never `Date` objects, so there are no time-zone surprises.

## Related

[`DateRangePicker`](date-range-picker.md) · [`Calendar`](calendar.md)

## Example

```tsx
<RangeCalendar value={range} onChange={setRange} months={2} />
```
