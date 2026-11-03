/* Pance · TimeField logic — framework-free so it can be tested without a browser.
   The value is a 24-hour "HH:mm" string (or null when empty), like dates are ISO strings: no Date
   objects and no time-zone drift. What the person reads and types follows the locale (12 h or 24 h). */

export type TimeSegment = 'hour' | 'minute' | 'period'

const TIME = /^([01]\d|2[0-3]):([0-5]\d)$/
const pad = (n: number) => String(n).padStart(2, '0')

/** True for a real clock time written as HH:mm (24 h, no seconds). */
export const isISOTime = (s: unknown): s is string => typeof s === 'string' && TIME.test(s)

/** "13:45" → 825. */
export const toMinutes = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m }

/** 825 → "13:45". Wraps around midnight. */
export const fromMinutes = (total: number) => {
  const day = ((Math.round(total) % 1440) + 1440) % 1440
  return `${pad(Math.floor(day / 60))}:${pad(day % 60)}`
}

/** Keeps `value` inside [min, max]. Either bound may be missing. */
export const clampTime = (value: string, min?: string, max?: string) => {
  if (min && value < min) return min
  if (max && value > max) return max
  return value
}

const safeLocale = (locale: string) => { try { return new Intl.DateTimeFormat(locale).resolvedOptions().locale } catch { return 'en-US' } }

/** True when the locale writes the hour on a 12-hour clock (with AM/PM). */
export function uses12Hour(locale: string) {
  const cycle = (new Intl.DateTimeFormat(safeLocale(locale), { hour: 'numeric' }).resolvedOptions() as { hourCycle?: string }).hourCycle
  return cycle === 'h12' || cycle === 'h11'
}

/** The text the person reads: "13:45" in es-ES, "1:45 PM" in en-US. Empty value → "". */
export function formatTime(value: string | null, locale: string) {
  if (!value || !isISOTime(value)) return ''
  const [h, m] = value.split(':').map(Number)
  return new Intl.DateTimeFormat(safeLocale(locale), { hour: uses12Hour(locale) ? 'numeric' : '2-digit', minute: '2-digit', timeZone: 'UTC' })
    .format(new Date(Date.UTC(2000, 0, 1, h, m)))
}

const clean = (s: string) => s.replace(/[\s  ]/g, '').toLowerCase().replace(/\./g, '')

/** Reads what a person typed into a "HH:mm" value; anything that is not a time is null. */
export function parseTime(text: string, _locale: string) {
  const s = clean(text)
  const m = /^(\d{1,2})(?::?(\d{1,2}))?(am|pm|a|p)?$/.exec(s.replace(/(a|p)m?$/, (x) => (x === 'a' || x === 'p' ? x + 'm' : x)))
  if (!m) return null
  let digits = m[1]
  let minutes = m[2]
  // No colon: "945" → 9:45, "1345" → 13:45 (the last two digits are the minutes).
  const bare = /^(\d{3,4})(am|pm)?$/.exec(s)
  if (bare) { digits = bare[1].slice(0, -2); minutes = bare[1].slice(-2) }
  let hour = Number(digits)
  const minute = minutes === undefined ? 0 : Number(minutes)
  const suffix = bare ? bare[2] : m[3]
  if (minute > 59) return null
  if (suffix) {
    if (hour < 1 || hour > 12) return null
    hour = (hour % 12) + (suffix === 'pm' ? 12 : 0)
  }
  if (hour > 23) return null
  return `${pad(hour)}:${pad(minute)}`
}

export interface StepTimeOptions {
  /** Minutes per press on the minute segment. Defaults to 1. */
  step?: number
  min?: string
  max?: string
}

/** The value after one increment (`direction` 1) or decrement (-1) of a segment. Hours and AM/PM wrap; the result stays inside [min, max]. */
export function stepTime(current: string | null, segment: TimeSegment, direction: 1 | -1, { step = 1, min, max }: StepTimeOptions = {}) {
  const lo = min ?? '00:00'
  const hi = max ?? '23:59'
  if (!current || !isISOTime(current)) return direction > 0 ? lo : hi
  const total = toMinutes(current)
  let next: number
  if (segment === 'minute') {
    const aligned = Math.round(total / step) * step
    const onGrid = Math.abs(aligned - total) < 1e-9
    const target = onGrid ? total + direction * step : direction > 0 ? (aligned > total ? aligned : aligned + step) : aligned < total ? aligned : aligned - step
    // Minutes never wrap around the day: they stop at the edges.
    next = Math.min(1439, Math.max(0, target))
  } else if (segment === 'hour') {
    next = total + direction * 60 // wraps through fromMinutes
  } else {
    next = total + 720 // AM ⇄ PM
  }
  return clampTime(fromMinutes(next), lo, hi)
}

/** True while the text can still become a time: digits, one colon, and a partial or full AM/PM suffix. */
export function isPartialTime(text: string, _locale: string) {
  const s = clean(text)
  if (s === '') return true
  return /^\d{0,4}(:\d{0,2})?(a|am|p|pm)?$/.test(s) && !/^:/.test(s) && s.replace(/[^\d]/g, '').length <= 4
}
