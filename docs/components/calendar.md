# Calendar

> A month grid for picking one date.

```tsx
import { Calendar } from '@pance/react'
```

Source: [`src/components/date.tsx`](../../src/components/date.tsx) · Figma: `Calendar` · Tokens: `calendar.*` in [tokens.md](../tokens.md)

## When to use

- Inline date selection, or as the panel of `DatePicker`.

## When not to use

- Birth dates far in the past: use separate fields.

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `string \| null` | **required** |  |
| `onChange` | `(value: string) => void` | **required** |  |
| `min` | `string` |  |  |
| `max` | `string` |  |  |
| `isDateDisabled` | `((date: string) => boolean)` |  |  |
| `defaultMonth` | `string` |  |  |
| `autoFocus` | `boolean` |  |  |
| `bordered` | `boolean` |  | Draws the outer border, radius and surface. Off by default so the calendar can sit inside a popover or card. |
| `className` | `string` |  |  |

## Accessibility

- Grid with one Tab stop: ←→ day, ↑↓ week, Home/End week start and end, Page Up/Down month (Shift: year), Enter or Space select.
- Dates are ISO strings (`"2026-10-15"`), never `Date` objects, so there are no time-zone surprises.

## Content

- Month and weekday names come from `Intl` using `labels.locale`.

## Related

[`DatePicker`](date-picker.md) · [`RangeCalendar`](range-calendar.md)

## Example

```tsx
<Calendar value={date} onChange={setDate} min="2026-01-01" />
```
