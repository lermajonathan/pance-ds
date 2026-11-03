/* Pance · NumberField logic — framework-free so it can be tested without a browser.
   The value is always a number (or null when the field is empty); the text the person sees is
   produced and read with Intl.NumberFormat, so separators follow the locale. */

export type NumberFormatOptions = Intl.NumberFormatOptions

/** Keeps `value` inside [min, max]. Either bound may be missing. */
export const clampNumber = (value: number, min?: number, max?: number) => {
  let v = value
  if (min !== undefined && v < min) v = min
  if (max !== undefined && v > max) v = max
  return v
}

const decimalsOf = (n: number) => {
  const [mantissa, exp] = n.toString().split('e')
  const fraction = (mantissa.split('.')[1] ?? '').length
  return Math.max(0, fraction - (exp ? Number(exp) : 0))
}

/** Snaps `value` to the nearest step counted from `min` (or from 0), without floating point noise. */
export const roundToStep = (value: number, step: number, min: number | undefined) => {
  if (!(step > 0)) return value
  const base = min ?? 0
  const count = Math.round(Number(((value - base) / step).toPrecision(12)))
  return Number((base + count * step).toFixed(Math.max(decimalsOf(step), decimalsOf(base))))
}

export interface StepOptions {
  step: number
  /** Amount for PageUp/PageDown and Shift+Arrow. Defaults to ten steps. */
  largeStep?: number
  min?: number
  max?: number
  /** Use `largeStep` instead of `step`. */
  large?: boolean
}

/** The value after one increment (`direction` 1) or decrement (-1). Always inside [min, max] and on a step. */
export function stepNumber(current: number | null, direction: 1 | -1, { step, largeStep, min, max, large = false }: StepOptions) {
  if (current === null) {
    return clampNumber(direction > 0 ? (min ?? step) : (max ?? -step), min, max)
  }
  if (large) return clampNumber(roundToStep(current + direction * (largeStep ?? step * 10), step, min), min, max)
  const aligned = roundToStep(current, step, min)
  if (Math.abs(aligned - current) > step * 1e-9) {
    // Off the grid (typed by hand): the first press lands on the nearest step in that direction.
    const target = direction > 0 ? (aligned > current ? aligned : aligned + step) : (aligned < current ? aligned : aligned - step)
    return clampNumber(roundToStep(target, step, min), min, max)
  }
  return clampNumber(roundToStep(current + direction * step, step, min), min, max)
}

/* ── Text ⇄ number ─────────────────────────────────────────────────────── */
const SPACES = /[\s  ]/g

function symbols(locale: string, options?: NumberFormatOptions) {
  const parts = new Intl.NumberFormat(locale, options).formatToParts(-12345678.9)
  const find = (type: string) => parts.find((p) => p.type === type)?.value
  return { group: find('group'), decimal: find('decimal') ?? '.', currency: find('currency'), percent: parts.some((p) => p.type === 'percentSign') }
}

/** Text with affixes, spaces and group separators removed and the decimal separator turned into ".". */
function normalize(text: string, locale: string, options?: NumberFormatOptions) {
  const { group, decimal, currency, percent } = symbols(locale, options)
  let t = text.replace(/−/g, '-')
  if (currency) t = t.split(currency).join('')
  if (percent) t = t.replace(/%/g, '')
  t = t.replace(SPACES, '')
  if (group && group.trim() !== '') t = t.split(group).join('')
  if (decimal !== '.') t = t.split(decimal).join('.')
  return { text: t, percent }
}

/** Reads what the person typed. Returns null when it is empty or is not a number in this locale. */
export function parseNumber(text: string, locale: string, options?: NumberFormatOptions): number | null {
  const { text: t, percent } = normalize(text, locale, options)
  if (!/^-?(\d+\.?\d*|\.\d+)$/.test(t)) return null
  const n = Number(t)
  if (!Number.isFinite(n)) return null
  return percent ? Number((n / 100).toPrecision(12)) : n
}

/** The text for a value in this locale ('' when empty). */
export function formatNumber(value: number | null, locale: string, options?: NumberFormatOptions) {
  if (value === null || !Number.isFinite(value)) return ''
  return new Intl.NumberFormat(locale, options).format(value)
}

export interface PartialOptions {
  min?: number
  /** 0 makes the field integer-only. */
  maxFractionDigits?: number
  formatOptions?: NumberFormatOptions
}

/** Whether `text` can still become a number, so the field accepts it while the person is typing ("-", "1,"). */
export function isPartialNumber(text: string, locale: string, { min, maxFractionDigits, formatOptions }: PartialOptions = {}) {
  const { text: t } = normalize(text, locale, formatOptions)
  if (!/^-?(\d*(\.\d*)?)$/.test(t)) return false
  if (t.startsWith('-') && min !== undefined && min >= 0) return false
  if (maxFractionDigits === 0 && t.includes('.')) return false
  return true
}
