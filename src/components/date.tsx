/* Pance · Dates — Calendar, RangeCalendar, DatePicker, DateRangePicker.
   Dates are plain ISO strings ("2026-10-15"), never Date objects, so there are no time-zone
   surprises and values serialise straight into forms and URLs. Month and weekday names come
   from Intl using `labels.locale`, so no date library is needed.

   Calendar follows the WAI-ARIA date picker grid pattern: one tab stop (roving tabindex),
   arrows move by day and week, Home/End by week, PageUp/PageDown by month (Shift: year),
   Enter or Space selects. Every day has a full spoken date; today is `aria-current="date"`. */
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react'
import { useLabels } from './labels'
import { IconCalendar, IconChevron, IconChevronLeft } from '../icons'
import { focus } from './shared'
import { useKeepInView } from './a11y'
import { inputBase, inputError, inputNormal, useFieldControl, useFieldLabelId } from './forms'

/* ── ISO date helpers (UTC arithmetic: no DST or local-zone drift) ─────── */
export type DateRange = { start: string | null; end: string | null }

const pad = (n: number, w = 2) => String(n).padStart(w, '0')
const iso = (y: number, m: number, d: number) => `${pad(y, 4)}-${pad(m)}-${pad(d)}`
const utc = (s: string) => { const [y, m, d] = s.split('-').map(Number); return Date.UTC(y, m - 1, d) }
const fromUtc = (ms: number) => { const t = new Date(ms); return iso(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate()) }
const DAY = 86_400_000

/** True for a real calendar date written as YYYY-MM-DD. */
export function isISODate(s: unknown): s is string {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false
  return fromUtc(utc(s)) === s
}
/** Local calendar date of a Date object, as YYYY-MM-DD. */
export const toISODate = (d: Date) => iso(d.getFullYear(), d.getMonth() + 1, d.getDate())
/** YYYY-MM-DD → Date at local midnight. */
export const fromISODate = (s: string) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d) }

const addDays = (s: string, n: number) => fromUtc(utc(s) + n * DAY)
const monthStart = (s: string) => `${s.slice(0, 7)}-01`
const daysIn = (y: number, m: number) => new Date(Date.UTC(y, m, 0)).getUTCDate()
const addMonths = (s: string, n: number) => {
  const [y, m, d] = s.split('-').map(Number)
  const t = y * 12 + (m - 1) + n
  const ny = Math.floor(t / 12), nm = (t % 12) + 1
  return iso(ny, nm, Math.min(d, daysIn(ny, nm)))
}
const weekday = (s: string) => new Date(utc(s)).getUTCDay()
const monthKey = (s: string) => s.slice(0, 7)
const clamp = (s: string, min?: string, max?: string) => (min && s < min ? min : max && s > max ? max : s)

const fmt = (locale: string, o: Intl.DateTimeFormatOptions) => {
  try { return new Intl.DateTimeFormat(locale, { ...o, timeZone: 'UTC' }) } catch { return new Intl.DateTimeFormat('en-US', { ...o, timeZone: 'UTC' }) }
}

/* ── One month grid ────────────────────────────────────────────────────── */
type Mode = 'single' | 'range'
type GridProps = {
  month: string
  mode: Mode
  value: string | null
  range: DateRange
  /** Day hovered or focused while a range is half-picked, to preview it. */
  preview: string | null
  focusISO: string
  tabbable: string
  today: string
  min?: string
  max?: string
  isDisabled: (d: string) => boolean
  onPick: (d: string) => void
  onFocusDay: (d: string) => void
  onHover: (d: string | null) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  prev?: () => void
  next?: () => void
}

function MonthGrid(p: GridProps) {
  const tt = useLabels()
  const titleId = useId()
  const [y, m] = p.month.split('-').map(Number)
  const lead = (weekday(p.month) - tt.firstDayOfWeek + 7) % 7
  const total = daysIn(y, m)
  const cells: (string | null)[] = [...Array(lead).fill(null), ...Array.from({ length: total }, (_, i) => iso(y, m, i + 1))]
  while (cells.length % 7) cells.push(null)
  const weeks = Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7))
  const title = fmt(tt.locale, { month: 'long', year: 'numeric' }).format(utc(p.month))
  const dayName = fmt(tt.locale, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  const wkLong = fmt(tt.locale, { weekday: 'long' })
  const wkShort = fmt(tt.locale, { weekday: 'short' })
  // Any week starting on the configured first day, for the column headers.
  const base = Date.UTC(2023, 0, 1 + tt.firstDayOfWeek) // 2023-01-01 is a Sunday
  const heads = Array.from({ length: 7 }, (_, i) => ({ long: wkLong.format(base + i * DAY), short: wkShort.format(base + i * DAY) }))

  const { start, end } = p.range
  const open = p.mode === 'range' && start && !end
  const a = p.mode === 'range' ? (open && p.preview ? (p.preview < start! ? p.preview : start) : start) : null
  const b = p.mode === 'range' ? (open && p.preview ? (p.preview < start! ? start : p.preview) : end) : null

  return (
    <div className="min-w-0">
      <div className="mb-(--pance-calendar-header-gap) flex items-center justify-between">
        {p.prev ? (
          <button type="button" aria-label={tt.previousMonth} onClick={p.prev} className={`${focus} grid size-(--pance-calendar-day-size) place-items-center rounded-(--pance-calendar-day-radius) text-ink-soft hover:bg-(--pance-calendar-day-bg-hover)`}>
            <IconChevronLeft aria-hidden className="size-4" />
          </button>
        ) : <span className="size-(--pance-calendar-day-size)" />}
        <h2 id={titleId} aria-live="polite" className="font-semibold text-sm text-ink">{title}</h2>
        {p.next ? (
          <button type="button" aria-label={tt.nextMonth} onClick={p.next} className={`${focus} grid size-(--pance-calendar-day-size) place-items-center rounded-(--pance-calendar-day-radius) text-ink-soft hover:bg-(--pance-calendar-day-bg-hover)`}>
            <IconChevron aria-hidden className="size-4" />
          </button>
        ) : <span className="size-(--pance-calendar-day-size)" />}
      </div>
      <table role="grid" aria-labelledby={titleId} onKeyDown={p.onKeyDown} className="border-separate border-spacing-y-(--pance-calendar-gap)">
        <thead>
          <tr>
            {heads.map((h) => (
              <th key={h.long} scope="col" abbr={h.long} className="size-(--pance-calendar-day-size) text-center font-medium text-xs text-(--pance-calendar-weekday-text)">{h.short.slice(0, 2)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((w, wi) => (
            <tr key={wi}>
              {w.map((d, di) => {
                if (!d) return <td key={di} role="gridcell" aria-hidden="true" />
                const disabled = p.isDisabled(d)
                const isStart = p.mode === 'range' ? d === a : p.value === d
                const isEnd = p.mode === 'range' && d === b
                const inRange = p.mode === 'range' && !!a && !!b && d >= a && d <= b
                const selected = p.mode === 'range' ? (!!start && d === start) || (!!end && d >= start! && d <= end) : p.value === d
                const solid = p.mode === 'range' ? (d === start || d === end) : p.value === d
                const label = [dayName.format(utc(d)), p.mode === 'range' && d === start ? tt.rangeStart : '', p.mode === 'range' && d === end ? tt.rangeEnd : ''].filter(Boolean).join(', ')
                const band = inRange ? 'bg-(--pance-calendar-range-bg)' : ''
                const bandShape = a !== b && isStart ? 'rounded-l-(--pance-calendar-day-radius)' : a !== b && isEnd ? 'rounded-r-(--pance-calendar-day-radius)' : ''
                const face = solid
                  ? 'bg-(--pance-calendar-selected-bg) text-(--pance-calendar-selected-text) font-semibold'
                  : inRange ? 'text-(--pance-calendar-range-text)' : disabled ? 'text-(--pance-calendar-day-text-disabled)' : 'text-(--pance-calendar-day-text) hover:bg-(--pance-calendar-day-bg-hover)'
                const today = d === p.today ? 'border-2 border-(--pance-calendar-today-border)' : ''
                return (
                  <td key={d} role="gridcell" aria-selected={selected || undefined} className={`p-0 text-center ${band} ${bandShape}`}>
                    <button
                      type="button"
                      data-date={d}
                      tabIndex={d === p.tabbable ? 0 : -1}
                      aria-label={label}
                      aria-current={d === p.today ? 'date' : undefined}
                      aria-disabled={disabled || undefined}
                      onClick={() => { if (!disabled) p.onPick(d) }}
                      onFocus={() => p.onFocusDay(d)}
                      onMouseEnter={() => p.onHover(d)}
                      className={`${focus} size-(--pance-calendar-day-size) rounded-(--pance-calendar-day-radius) text-sm ${face} ${today} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {Number(d.slice(8))}
                    </button>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ── Shared calendar engine ────────────────────────────────────────────── */
type EngineProps = {
  mode: Mode
  value: string | null
  range: DateRange
  onPick: (d: string) => void
  min?: string
  max?: string
  isDateDisabled?: (d: string) => boolean
  months?: 1 | 2
  /** Moves focus into the grid on mount (used when it opens inside a popover). */
  autoFocus?: boolean
  /** Month to show first when nothing is selected. */
  defaultMonth?: string
  /** Draws the outer border, radius and surface. Off by default so the calendar can sit inside a popover or card. */
  bordered?: boolean
  className?: string
}

const todayISO = () => toISODate(new Date())

function CalendarEngine({ mode, value, range, onPick, min, max, isDateDisabled, months = 1, autoFocus, defaultMonth, bordered = false, className = '' }: EngineProps) {
  const tt = useLabels()
  const today = useMemo(todayISO, [])
  const seed = (mode === 'single' ? value : range.start) ?? defaultMonth ?? clamp(today, min, max)
  const [focusISO, setFocusISO] = useState(seed)
  const [view, setView] = useState(monthStart(seed))
  const [preview, setPreview] = useState<string | null>(null)
  const root = useRef<HTMLDivElement>(null)
  const wantFocus = useRef(!!autoFocus)
  const hintId = useId()
  const isDisabled = (d: string) => (!!min && d < min) || (!!max && d > max) || !!isDateDisabled?.(d)

  const visible = Array.from({ length: months }, (_, i) => addMonths(view, i))
  const inView = visible.some((v) => monthKey(v) === monthKey(focusISO))
  const tabbable = inView ? focusISO : visible[0]

  useEffect(() => {
    if (!wantFocus.current) return
    wantFocus.current = false
    root.current?.querySelector<HTMLElement>(`[data-date="${focusISO}"]`)?.focus({ preventScroll: true })
  })

  const go = (next: string) => {
    next = clamp(next, min, max)
    wantFocus.current = true
    setFocusISO(next)
    const k = monthKey(next)
    if (k < monthKey(visible[0])) setView(monthStart(next))
    else if (k > monthKey(visible[visible.length - 1])) setView(addMonths(monthStart(next), -(months - 1)))
    else setFocusISO(next)
  }
  const onKeyDown = (e: React.KeyboardEvent) => {
    const wd = (weekday(focusISO) - tt.firstDayOfWeek + 7) % 7
    const map: Record<string, string> = {
      ArrowLeft: addDays(focusISO, -1), ArrowRight: addDays(focusISO, 1),
      ArrowUp: addDays(focusISO, -7), ArrowDown: addDays(focusISO, 7),
      Home: addDays(focusISO, -wd), End: addDays(focusISO, 6 - wd),
      PageUp: addMonths(focusISO, e.shiftKey ? -12 : -1), PageDown: addMonths(focusISO, e.shiftKey ? 12 : 1),
    }
    if (e.key in map) { e.preventDefault(); go(map[e.key]) }
  }
  const shift = (n: number) => { setView((v) => addMonths(v, n)); setFocusISO((f) => clamp(addMonths(f, n), min, max)) }
  const open = mode === 'range' && !!range.start && !range.end

  return (
    <div ref={root} className={`bg-(--pance-calendar-bg) p-(--pance-calendar-padding) ${bordered ? 'rounded-2xl border border-line' : 'rounded-[inherit]'} ${className}`} onMouseLeave={() => setPreview(null)} aria-describedby={hintId}>
      <p id={hintId} className="sr-only">{tt.calendarKeyboardHint}</p>
      <div className="flex gap-(--pance-calendar-months-gap)">
        {visible.map((m, i) => (
          <MonthGrid
            key={m}
            month={m}
            mode={mode}
            value={value}
            range={range}
            preview={open ? preview : null}
            focusISO={focusISO}
            tabbable={tabbable}
            today={today}
            min={min}
            max={max}
            isDisabled={isDisabled}
            onPick={onPick}
            onFocusDay={(d) => { setFocusISO(d); if (open) setPreview(d) }}
            onHover={(d) => { if (open) setPreview(d) }}
            onKeyDown={onKeyDown}
            prev={i === 0 ? () => shift(-1) : undefined}
            next={i === visible.length - 1 ? () => shift(1) : undefined}
          />
        ))}
      </div>
    </div>
  )
}

/* ── Calendar (single date) ────────────────────────────────────────────── */
export type CalendarProps = {
  value: string | null
  onChange: (value: string) => void
  min?: string
  max?: string
  isDateDisabled?: (date: string) => boolean
  defaultMonth?: string
  autoFocus?: boolean
  /** Draws the outer border, radius and surface. Off by default so the calendar can sit inside a popover or card. */
  bordered?: boolean
  className?: string
}
export function Calendar({ value, onChange, ...rest }: CalendarProps) {
  return <CalendarEngine mode="single" value={value} range={{ start: null, end: null }} onPick={onChange} {...rest} />
}

/* ── RangeCalendar ─────────────────────────────────────────────────────── */
export type RangeCalendarProps = {
  value: DateRange
  onChange: (value: DateRange) => void
  min?: string
  max?: string
  isDateDisabled?: (date: string) => boolean
  months?: 1 | 2
  defaultMonth?: string
  autoFocus?: boolean
  /** Draws the outer border, radius and surface. Off by default so the calendar can sit inside a popover or card. */
  bordered?: boolean
  className?: string
}
/** Pick the first day, then the last. A third click starts a new range. */
export function RangeCalendar({ value, onChange, ...rest }: RangeCalendarProps) {
  const pick = (d: string) => {
    if (value.start && !value.end) onChange(d < value.start ? { start: d, end: value.start } : { start: value.start, end: d })
    else onChange({ start: d, end: null })
  }
  return <CalendarEngine mode="range" value={null} range={value} onPick={pick} {...rest} />
}

/* ── Floating panel shared by both pickers ─────────────────────────────── */
function useWide() {
  const [wide, setWide] = useState(false)
  useEffect(() => {
    const q = window.matchMedia('(min-width: 48rem)')
    const on = () => setWide(q.matches)
    on()
    q.addEventListener('change', on)
    return () => q.removeEventListener('change', on)
  }, [])
  return wide
}

type TriggerProps = {
  label?: string
  placeholder?: string
  disabled?: boolean
  error?: boolean
  className?: string
}

function Picker({ text, empty, panel, trigger, name }: {
  text: string
  empty: boolean
  trigger: TriggerProps
  name: string
  panel: (close: () => void) => ReactNode
}) {
  const [open, setOpen] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)
  const btn = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const fit = useKeepInView(panelRef, open)
  useEffect(() => {
    if (!open) return
    const raf = requestAnimationFrame(() => panelRef.current?.scrollIntoView({ block: 'nearest' }))
    return () => cancelAnimationFrame(raf)
  }, [open])
  const panelId = useId()
  const valueId = useId()
  const a11y = useFieldControl({ error: trigger.error })
  const fieldLabelId = useFieldLabelId()
  const close = () => { setOpen(false); btn.current?.focus() }
  useEffect(() => {
    if (!open) return
    const down = (e: MouseEvent) => wrap.current && !wrap.current.contains(e.target as Node) && setOpen(false)
    document.addEventListener('mousedown', down)
    return () => document.removeEventListener('mousedown', down)
  }, [open])
  // The name carries both the field's label and the chosen value.
  const nameProps = fieldLabelId
    ? { 'aria-labelledby': `${fieldLabelId} ${valueId}` }
    : { 'aria-label': `${trigger.label ?? name}${empty ? '' : `: ${text}`}` }
  return (
    <div
      ref={wrap}
      className={`relative ${trigger.className ?? ''}`}
      onKeyDown={(e) => { if (e.key === 'Escape' && open) { e.stopPropagation(); close() } }}
      onBlur={(e) => { if (open && e.relatedTarget && !wrap.current?.contains(e.relatedTarget as Node)) setOpen(false) }}
    >
      <button
        ref={btn}
        type="button"
        disabled={trigger.disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        {...a11y}
        {...nameProps}
        onClick={() => setOpen((o) => !o)}
        className={`${inputBase} h-(--pance-input-size-md-height) px-(--pance-input-size-md-padding-x) text-(length:--pance-input-size-md-font-size) flex items-center gap-2 text-left disabled:cursor-not-allowed disabled:opacity-(--pance-opacity-disabled) ${trigger.error ? inputError : inputNormal} ${open ? 'border-line-focus shadow-[var(--pance-focus-ring)]' : ''}`}
      >
        <IconCalendar aria-hidden className="size-(--pance-input-size-md-icon) shrink-0 text-ink-muted" />
        <span id={valueId} className={`truncate ${empty ? 'text-ink-subtle' : 'text-ink'}`}>{empty ? (trigger.placeholder ?? '') : text}</span>
      </button>
      {open && (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-label={name}
          style={fit.dx ? { transform: `translateX(${fit.dx}px)` } : undefined}
          className={`absolute left-0 z-40 max-w-[calc(100vw-1rem)] rounded-(--pance-date-picker-panel-radius) border border-line bg-surface shadow-popover ${fit.up ? 'bottom-full mb-2' : 'top-full mt-2'}`}
        >
          {panel(close)}
        </div>
      )}
    </div>
  )
}

const linkBtn = `${focus} rounded-md px-2 py-1 font-medium text-sm text-link hover:underline disabled:cursor-not-allowed disabled:text-ink-disabled disabled:no-underline`

/* ── DatePicker ────────────────────────────────────────────────────────── */
export type DatePickerProps = TriggerProps & {
  value: string | null
  onChange: (value: string | null) => void
  min?: string
  max?: string
  isDateDisabled?: (date: string) => boolean
  /** Show a "Clear" action. */
  clearable?: boolean
}
export function DatePicker({ value, onChange, min, max, isDateDisabled, clearable = true, ...trigger }: DatePickerProps) {
  const tt = useLabels()
  const text = value && isISODate(value) ? fmt(tt.locale, { dateStyle: 'medium' }).format(utc(value)) : ''
  const today = todayISO()
  const todayOk = !(min && today < min) && !(max && today > max) && !isDateDisabled?.(today)
  return (
    <Picker
      text={text}
      empty={!text}
      trigger={trigger}
      name={tt.chooseDate}
      panel={(close) => (
        <>
          <Calendar value={value} onChange={(d) => { onChange(d); close() }} min={min} max={max} isDateDisabled={isDateDisabled} autoFocus />
          <div className="flex items-center justify-between border-line-soft border-t px-(--pance-date-picker-panel-padding) py-1">
            <button type="button" disabled={!todayOk} onClick={() => { onChange(today); close() }} className={linkBtn}>{tt.today}</button>
            {clearable && <button type="button" disabled={!value} onClick={() => { onChange(null); close() }} className={linkBtn}>{tt.clearDate}</button>}
          </div>
        </>
      )}
    />
  )
}

/* ── DateRangePicker ───────────────────────────────────────────────────── */
export type DateRangePreset = { label: string; range: { start: string; end: string } }
export type DateRangePickerProps = TriggerProps & {
  value: DateRange
  onChange: (value: DateRange) => void
  min?: string
  max?: string
  isDateDisabled?: (date: string) => boolean
  /** Quick ranges such as "Last 7 days". */
  presets?: DateRangePreset[]
  clearable?: boolean
}
export function DateRangePicker({ value, onChange, min, max, isDateDisabled, presets, clearable = true, ...trigger }: DateRangePickerProps) {
  const tt = useLabels()
  const wide = useWide()
  const f = fmt(tt.locale, { dateStyle: 'medium' })
  const complete = !!value.start && !!value.end && isISODate(value.start) && isISODate(value.end)
  const text = complete ? tt.rangeValue(f.format(utc(value.start!)), f.format(utc(value.end!))) : ''
  // A half-picked range (start only) stays visible while the panel is open.
  const [draft, setDraft] = useState<DateRange>(value)
  const shown = value.start && !value.end ? value : draft
  return (
    <Picker
      text={text}
      empty={!text}
      trigger={trigger}
      name={tt.chooseDateRange}
      panel={(close) => (
        <div className="flex flex-col md:flex-row">
          {presets && presets.length > 0 && (
            <ul className="flex flex-wrap gap-1 border-line-soft border-b p-(--pance-date-picker-panel-padding) md:w-44 md:flex-col md:flex-nowrap md:border-r md:border-b-0">
              {presets.map((p) => (
                <li key={p.label}>
                  <button type="button" onClick={() => { onChange(p.range); setDraft(p.range); close() }} className={`${focus} w-full rounded-md px-2 py-1.5 text-left text-sm text-ink-soft hover:bg-ground`}>{p.label}</button>
                </li>
              ))}
            </ul>
          )}
          <div>
            <RangeCalendar
              value={shown}
              onChange={(r) => { setDraft(r); onChange(r); if (r.start && r.end) close() }}
              min={min}
              max={max}
              isDateDisabled={isDateDisabled}
              months={wide ? 2 : 1}
              autoFocus
            />
            {clearable && (
              <div className="flex justify-end border-line-soft border-t px-(--pance-date-picker-panel-padding) py-1">
                <button type="button" disabled={!value.start} onClick={() => { const e = { start: null, end: null }; setDraft(e); onChange(e); close() }} className={linkBtn}>{tt.clearDate}</button>
              </div>
            )}
          </div>
        </div>
      )}
    />
  )
}
