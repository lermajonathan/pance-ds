/* Pance · Charts — LineChart, BarChart, RankedBarChart, DivergingBarChart, Heatmap, DonutChart, ScatterChart, Meter
   Every chart:
   - draws with `color.dataviz.*` tokens, so it follows light and dark mode;
   - never relies on colour alone: series get a marker shape and (in bars) a fill pattern, and the legend repeats them;
   - works with the keyboard (arrow keys move between data points) and announces the active value;
   - offers the same data as an HTML table ("View as table"). */
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { useLabels } from './labels'
import { focus, SERIES_BG, SERIES_FILL, SERIES_MARKERS, SERIES_STROKE, type SeriesMarker } from './shared'
import { hitArea } from './a11y'

/* ── helpers ────────────────────────────────────────────────────────────── */
const M = { t: 16, r: 16, b: 36, l: 48 }
const TEXT = 'fill-(--pance-color-dataviz-axis-label) text-xs'

function niceTicks(max: number, n = 4): number[] {
  if (max <= 0) return [0, 1]
  const raw = max / n, mag = 10 ** Math.floor(Math.log10(raw)), norm = raw / mag
  const step = (norm <= 1.5 ? 1 : norm <= 3 ? 2 : norm <= 7 ? 5 : 10) * mag
  const out: number[] = []
  for (let v = 0; v <= Math.ceil(max / step) * step + step * 0.01; v += step) out.push(+v.toPrecision(10))
  return out
}

function useWidth<T extends HTMLElement>(fallback = 600) {
  const ref = useRef<T>(null)
  const [w, setW] = useState(fallback)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof ResizeObserver === 'undefined') return
    setW(el.clientWidth || fallback)
    const ro = new ResizeObserver(([e]) => setW(Math.max(200, Math.round(e.contentRect.width))))
    ro.observe(el)
    return () => ro.disconnect()
  }, [fallback])
  return [ref, w] as const
}

export type ChartFormat = (n: number) => string
const compact: ChartFormat = (n) => new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 }).format(n)

/** Roving index for arrow-key navigation across `count` points. */
function useActive(count: number, step = 1) {
  const [active, setActive] = useState<number | null>(null)
  const onKeyDown = (e: KeyboardEvent) => {
    const k = e.key
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End', 'Escape'].includes(k)) return
    e.preventDefault()
    if (k === 'Escape') return setActive(null)
    setActive((a) => (k === 'Home' ? 0 : k === 'End' ? count - 1 : Math.max(0, Math.min(count - 1, (a ?? (k === 'ArrowRight' ? -step : count)) + (k === 'ArrowRight' ? step : -step)))))
  }
  return { active: active !== null && active < count ? active : null, setActive, onKeyDown }
}

/* ── marker + swatch (the non-colour cue for each series) ──────────────── */
function Marker({ shape, x, y, size = 5, i }: { shape: SeriesMarker; x: number; y: number; size?: number; i: number }) {
  const open = shape.endsWith('-open')
  const base = shape.replace('-open', '')
  const paint = open ? `${SERIES_STROKE[i % 8]} fill-(--pance-color-dataviz-surface)` : `${SERIES_FILL[i % 8]} stroke-(--pance-color-dataviz-surface)`
  const common = { className: paint, strokeWidth: 1.5 }
  if (base === 'circle') return <circle cx={x} cy={y} r={size} {...common} />
  if (base === 'square') return <rect x={x - size} y={y - size} width={size * 2} height={size * 2} {...common} />
  if (base === 'triangle') return <polygon points={`${x},${y - size * 1.2} ${x + size * 1.1},${y + size * 0.9} ${x - size * 1.1},${y + size * 0.9}`} {...common} />
  if (base === 'diamond') return <polygon points={`${x},${y - size * 1.3} ${x + size * 1.3},${y} ${x},${y + size * 1.3} ${x - size * 1.3},${y}`} {...common} />
  return <path d={`M${x - size},${y} H${x + size} M${x},${y - size} V${y + size}`} className={`${SERIES_STROKE[i % 8]} fill-none`} strokeWidth={2.5} strokeLinecap="round" />
}

/** Fill patterns for bars: solid, stripes, dots, cross-hatch, repeated. Drawn over the series colour in the surface colour. */
function Patterns({ id, count }: { id: string; count: number }) {
  return (
    <defs>
      {Array.from({ length: Math.min(count, 4) }, (_, k) => k).map((k) => (
        <pattern key={k} id={`${id}-p${k}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          {k === 1 && <line x1="0" y1="0" x2="0" y2="6" strokeWidth="2.5" className="stroke-(--pance-color-dataviz-surface)" opacity={0.55} />}
          {k === 2 && <circle cx="3" cy="3" r="1.2" className="fill-(--pance-color-dataviz-surface)" opacity={0.7} />}
          {k === 3 && <path d="M0 0V6M0 0H6" strokeWidth="1.5" className="stroke-(--pance-color-dataviz-surface) fill-none" opacity={0.6} />}
        </pattern>
      ))}
    </defs>
  )
}
const patternOf = (id: string, i: number) => (i % 4 === 0 ? undefined : `url(#${id}-p${i % 4})`)

function Swatch({ i, kind }: { i: number; kind: 'line' | 'box' }) {
  return (
    <svg aria-hidden width="20" height="12" viewBox="0 0 20 12" className="shrink-0">
      {kind === 'line' ? (
        <>
          <line x1="0" y1="6" x2="20" y2="6" className={SERIES_STROKE[i % 8]} strokeWidth="2" />
          <Marker shape={SERIES_MARKERS[i % 8]} x={10} y={6} size={4} i={i} />
        </>
      ) : (
        <>
          <rect x="2" y="1" width="16" height="10" rx="2" className={SERIES_FILL[i % 8]} />
          {i % 4 !== 0 && <rect x="2" y="1" width="16" height="10" rx="2" fill={`url(#sw${i % 4})`} />}
          <defs>
            <pattern id={`sw${i % 4}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              {i % 4 === 1 && <line x1="0" y1="0" x2="0" y2="6" strokeWidth="2.5" className="stroke-(--pance-color-dataviz-surface)" opacity={0.55} />}
              {i % 4 === 2 && <circle cx="3" cy="3" r="1.2" className="fill-(--pance-color-dataviz-surface)" opacity={0.7} />}
              {i % 4 === 3 && <path d="M0 0V6M0 0H6" strokeWidth="1.5" className="stroke-(--pance-color-dataviz-surface) fill-none" opacity={0.6} />}
            </pattern>
          </defs>
        </>
      )}
    </svg>
  )
}

/* ── frame: title, legend, table alternative, keyboard region, live status ── */
type TableData = { head: string[]; rows: (string | number)[][] }

function Frame({ title, subtitle, legend, summary, table, status, onKeyDown, onBlur, scroll, children }: {
  scroll?: boolean; title: string; subtitle?: string; legend?: ReactNode; summary: string; table: TableData; status?: ReactNode
  onKeyDown?: (e: KeyboardEvent) => void; onBlur?: () => void; children: ReactNode
}) {
  const l = useLabels()
  const id = useId()
  const [asTable, setAsTable] = useState(false)
  return (
    <figure className="m-0 rounded-(--pance-chart-radius) border border-(--pance-chart-border) bg-(--pance-chart-bg) p-(--pance-chart-padding) text-(--pance-color-dataviz-ink)">
      <figcaption className="mb-3 flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div>
          <p className="text-sm font-semibold">{title}</p>
          {subtitle && <p className="mt-0.5 text-xs text-(--pance-color-dataviz-ink-muted)">{subtitle}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {legend}
          <button type="button" aria-pressed={asTable} onClick={() => setAsTable((v) => !v)} className={`${focus} ${hitArea} rounded px-1 text-xs font-medium text-ink-link underline-offset-2 hover:underline`}>
            {asTable ? l.viewAsChart : l.viewAsTable}
          </button>
        </div>
      </figcaption>
      {asTable ? (
        <div className="overflow-auto">
          <table className="w-full border-collapse text-left text-sm">
            <caption className="sr-only">{title}</caption>
            <thead><tr>{table.head.map((h) => <th key={h} scope="col" className="border-b border-line px-3 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-(--pance-color-dataviz-ink-muted)">{h}</th>)}</tr></thead>
            <tbody>{table.rows.map((r, i) => <tr key={i} className="border-b border-line-soft last:border-0">{r.map((c, j) => (j === 0 ? <th key={j} scope="row" className="px-3 py-2 font-medium">{c}</th> : <td key={j} className="px-3 py-2 font-mono tabular-nums">{c}</td>))}</tr>)}</tbody>
          </table>
        </div>
      ) : (
        <>
          <div role="group" tabIndex={0} aria-label={`${title}. ${summary}`} aria-describedby={`${id}-h`} onKeyDown={onKeyDown} onBlur={onBlur} className={`${focus} rounded-lg ${scroll ? 'overflow-x-auto' : ''}`}>
            {children}
          </div>
          <p id={`${id}-h`} className="sr-only">{l.chartKeyboardHint}</p>
          <div role="status" aria-live="polite" className="mt-2 min-h-6 text-xs">{status}</div>
        </>
      )}
    </figure>
  )
}

function Legend({ names, kind }: { names: string[]; kind: 'line' | 'box' }) {
  if (names.length < 2) return null
  return <ul className="m-0 flex list-none flex-wrap gap-x-3 gap-y-1 p-0">{names.map((n, i) => <li key={n} className="flex items-center gap-1.5 text-xs text-(--pance-color-dataviz-ink-muted)"><Swatch i={i} kind={kind} />{n}</li>)}</ul>
}

function Readout({ heading, items }: { heading: string; items: { i: number; name: string; value: string }[] }) {
  return (
    <p className="m-0 flex flex-wrap items-center gap-x-3 gap-y-1">
      <span className="font-medium text-(--pance-color-dataviz-ink-muted)">{heading}</span>
      {items.map((it) => (
        <span key={it.name} className="flex items-center gap-1.5">
          <span aria-hidden className={`size-2 rounded-full ${SERIES_BG[it.i % 8]}`} />
          <span className="text-(--pance-color-dataviz-ink-muted)">{it.name}</span>
          <span className="font-mono font-semibold tabular-nums">{it.value}</span>
        </span>
      ))}
    </p>
  )
}

type Series = { name: string; data: number[] }
type CartesianProps = { title: string; subtitle?: string; labels: string[]; series: Series[]; height?: number; format?: ChartFormat }

function Axes({ ticks, yMax, format, labels, xAt, plotW, plotH, minGap = 64 }: { ticks: number[]; yMax: number; format: ChartFormat; labels: string[]; xAt: (i: number) => number; plotW: number; plotH: number; minGap?: number }) {
  const step = Math.max(1, Math.ceil(minGap / (plotW / Math.max(1, labels.length - 1))))
  return (
    <>
      {ticks.map((t) => {
        const y = plotH - (t / yMax) * plotH
        return (
          <g key={t}>
            <line x1={0} x2={plotW} y1={y} y2={y} className="stroke-(--pance-color-dataviz-grid)" strokeWidth={1} />
            <text x={-8} y={y} textAnchor="end" dominantBaseline="middle" className={`${TEXT} tabular-nums`}>{format(t)}</text>
          </g>
        )
      })}
      <line x1={0} x2={plotW} y1={plotH} y2={plotH} className="stroke-(--pance-color-dataviz-baseline)" strokeWidth={1} />
      {labels.map((lb, i) => (i % step === 0 || (i === labels.length - 1 && (i % step) >= Math.ceil(step / 2)) ? <text key={i} x={xAt(i)} y={plotH + 20} textAnchor="middle" className={TEXT}>{lb}</text> : null))}
    </>
  )
}

/* ── LineChart ──────────────────────────────────────────────────────────── */
export function LineChart({ title, subtitle, labels, series, height = 260, format = compact }: CartesianProps) {
  const [ref, w] = useWidth<HTMLDivElement>()
  const { active, setActive, onKeyDown } = useActive(labels.length)
  const plotW = w - M.l - M.r, plotH = height - M.t - M.b
  const ticks = niceTicks(Math.max(...series.flatMap((s) => s.data)) * 1.05)
  const yMax = ticks[ticks.length - 1]
  const xAt = (i: number) => (labels.length < 2 ? plotW / 2 : (i / (labels.length - 1)) * plotW)
  const yAt = (v: number) => plotH - (v / yMax) * plotH
  const dense = labels.length > 12
  const last = (s: Series) => s.data[s.data.length - 1]
  return (
    <Frame
      title={title} subtitle={subtitle} legend={<Legend names={series.map((s) => s.name)} kind="line" />}
      summary={series.map((s) => `${s.name}: ${format(s.data[0])} → ${format(last(s))}`).join('; ')}
      table={{ head: ['', ...series.map((s) => s.name)], rows: labels.map((lb, i) => [lb, ...series.map((s) => format(s.data[i]))]) }}
      onKeyDown={onKeyDown} onBlur={() => setActive(null)}
      status={active !== null && <Readout heading={labels[active]} items={series.map((s, i) => ({ i, name: s.name, value: format(s.data[active]) }))} />}
    >
      <div ref={ref} className="relative w-full min-w-0" style={{ height }}>
        <svg width={w} height={height} className="absolute left-0 top-0" role="presentation" aria-hidden onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect()
          setActive(Math.max(0, Math.min(labels.length - 1, Math.round(((e.clientX - r.left - M.l) / plotW) * (labels.length - 1)))))
        }} onMouseLeave={() => setActive(null)}>
          <g transform={`translate(${M.l},${M.t})`}>
            <Axes ticks={ticks} yMax={yMax} format={format} labels={labels} xAt={xAt} plotW={plotW} plotH={plotH} />
            {series.map((s, i) => (
              <polyline key={s.name} fill="none" className={SERIES_STROKE[i % 8]} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={i % 3 === 1 ? '6 3' : i % 3 === 2 ? '2 3' : undefined} points={s.data.map((v, j) => `${xAt(j)},${yAt(v)}`).join(' ')} />
            ))}
            {series.map((s, i) => (dense ? [s.data.length - 1] : s.data.map((_, j) => j)).map((j) => <Marker key={`${s.name}${j}`} shape={SERIES_MARKERS[i % 8]} x={xAt(j)} y={yAt(s.data[j])} i={i} />))}
            {active !== null && (
              <>
                <line x1={xAt(active)} x2={xAt(active)} y1={0} y2={plotH} className="stroke-(--pance-color-dataviz-baseline)" strokeWidth={1} />
                {series.map((s, i) => <Marker key={s.name} shape={SERIES_MARKERS[i % 8]} x={xAt(active)} y={yAt(s.data[active])} size={7} i={i} />)}
              </>
            )}
          </g>
        </svg>
      </div>
    </Frame>
  )
}

/* ── BarChart: vertical, grouped or stacked ─────────────────────────────── */
export function BarChart({ title, subtitle, labels, series, height = 260, format = compact, mode = 'grouped' }: CartesianProps & { mode?: 'grouped' | 'stacked' }) {
  const [ref, w] = useWidth<HTMLDivElement>()
  const pid = useId().replace(/:/g, '')
  const { active, setActive, onKeyDown } = useActive(labels.length)
  const plotW = w - M.l - M.r, plotH = height - M.t - M.b
  const totals = labels.map((_, i) => series.reduce((a, s) => a + s.data[i], 0))
  const ticks = niceTicks(mode === 'stacked' ? Math.max(...totals) : Math.max(...series.flatMap((s) => s.data)))
  const yMax = ticks[ticks.length - 1]
  const slot = plotW / labels.length
  const xAt = (i: number) => slot * (i + 0.5)
  const inner = slot * 0.7
  const bw = mode === 'stacked' ? Math.min(40, inner) : Math.min(28, inner / series.length)
  const hOf = (v: number) => (v / yMax) * plotH
  return (
    <Frame
      title={title} subtitle={subtitle} legend={<Legend names={series.map((s) => s.name)} kind="box" />}
      summary={`${labels.length} categories, ${series.map((s) => s.name).join(', ')}`}
      table={{ head: ['', ...series.map((s) => s.name)], rows: labels.map((lb, i) => [lb, ...series.map((s) => format(s.data[i]))]) }}
      onKeyDown={onKeyDown} onBlur={() => setActive(null)}
      status={active !== null && <Readout heading={labels[active]} items={[...series.map((s, i) => ({ i, name: s.name, value: format(s.data[active]) })), ...(mode === 'stacked' ? [{ i: 0, name: 'Total', value: format(totals[active]) }] : [])]} />}
    >
      <div ref={ref} className="relative w-full min-w-0" style={{ height }}>
        <svg width={w} height={height} className="absolute left-0 top-0" role="presentation" aria-hidden onMouseLeave={() => setActive(null)}>
          <Patterns id={pid} count={series.length} />
          <g transform={`translate(${M.l},${M.t})`}>
            <Axes ticks={ticks} yMax={yMax} format={format} labels={labels} xAt={xAt} plotW={plotW} plotH={plotH} minGap={44} />
            {labels.map((_, i) => {
              let acc = 0
              return (
                <g key={i} onMouseEnter={() => setActive(i)} opacity={active === null || active === i ? 1 : 0.55}>
                  <rect x={slot * i} y={0} width={slot} height={plotH} fill="transparent" />
                  {series.map((s, k) => {
                    const v = s.data[i], bh = hOf(v)
                    const x = mode === 'stacked' ? xAt(i) - bw / 2 : xAt(i) - (bw * series.length) / 2 + bw * k
                    const y = mode === 'stacked' ? plotH - hOf(acc + v) : plotH - bh
                    acc += v
                    return (
                      <g key={s.name}>
                        <rect x={x} y={y} width={Math.max(0, bw - 1)} height={Math.max(0, bh - (mode === 'stacked' ? 1 : 0))} rx={2} className={SERIES_FILL[k % 8]} />
                        {patternOf(pid, k) && <rect x={x} y={y} width={Math.max(0, bw - 1)} height={Math.max(0, bh - (mode === 'stacked' ? 1 : 0))} rx={2} fill={patternOf(pid, k)} />}
                      </g>
                    )
                  })}
                </g>
              )
            })}
          </g>
        </svg>
      </div>
    </Frame>
  )
}

/* ── RankedBarChart: horizontal, one series, value written on each bar ──── */
export function RankedBarChart({ title, subtitle, data, format = compact, unit }: { title: string; subtitle?: string; data: { label: string; value: number }[]; format?: ChartFormat; unit?: string }) {
  const { active, setActive, onKeyDown } = useActive(data.length)
  const max = Math.max(...data.map((d) => d.value)) || 1
  return (
    <Frame
      title={title} subtitle={subtitle} summary={`${data.length} items, highest ${data.reduce((a, b) => (b.value > a.value ? b : a)).label}`}
      table={{ head: ['', unit ?? ''], rows: data.map((d) => [d.label, format(d.value)]) }}
      onKeyDown={onKeyDown} onBlur={() => setActive(null)}
      status={active !== null && <Readout heading={data[active].label} items={[{ i: 0, name: unit ?? '', value: format(data[active].value) }]} />}
    >
      <ul className="m-0 list-none space-y-2 p-0">
        {data.map((d, i) => (
          <li key={d.label} onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)} className={`flex items-center gap-3 ${active === null || active === i ? '' : 'opacity-60'}`}>
            <span className="w-28 shrink-0 truncate text-xs text-(--pance-color-dataviz-ink-muted)">{d.label}</span>
            <span aria-hidden className="h-5 flex-1 rounded-sm bg-(--pance-color-dataviz-grid)/50"><span className={`block h-full rounded-sm ${SERIES_BG[0]}`} style={{ width: `${(d.value / max) * 100}%` }} /></span>
            <span className="w-14 shrink-0 text-right font-mono text-xs font-semibold tabular-nums">{format(d.value)}</span>
          </li>
        ))}
      </ul>
    </Frame>
  )
}

/* ── DivergingBarChart: positive and negative around a zero line ────────── */
export function DivergingBarChart({ title, subtitle, data, format = compact }: { title: string; subtitle?: string; data: { label: string; value: number }[]; format?: ChartFormat }) {
  const l = useLabels()
  const { active, setActive, onKeyDown } = useActive(data.length)
  const max = Math.max(...data.map((d) => Math.abs(d.value))) || 1
  return (
    <Frame
      title={title} subtitle={subtitle} summary={`${data.filter((d) => d.value >= 0).length} positive, ${data.filter((d) => d.value < 0).length} negative`}
      table={{ head: ['', ''], rows: data.map((d) => [d.label, `${d.value > 0 ? '+' : ''}${format(d.value)}`]) }}
      onKeyDown={onKeyDown} onBlur={() => setActive(null)}
      status={active !== null && <Readout heading={data[active].label} items={[{ i: data[active].value >= 0 ? 0 : 7, name: '', value: `${data[active].value > 0 ? '+' : ''}${format(data[active].value)}` }]} />}
    >
      <ul className="m-0 list-none space-y-2 p-0">
        {data.map((d, i) => {
          const pos = d.value >= 0
          return (
            <li key={d.label} onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)} className={`grid grid-cols-[7rem_1fr_3.5rem] items-center gap-3 ${active === null || active === i ? '' : 'opacity-60'}`}>
              <span className="truncate text-xs text-(--pance-color-dataviz-ink-muted)">{d.label}</span>
              <span aria-hidden className="relative h-5">
                <span className="absolute inset-y-0 left-1/2 w-px bg-(--pance-color-dataviz-baseline)" />
                <span className={`absolute inset-y-0 rounded-sm ${pos ? 'bg-(--pance-color-dataviz-positive) left-1/2' : 'bg-(--pance-color-dataviz-negative) right-1/2'}`} style={{ width: `${(Math.abs(d.value) / max) * 50}%` }} />
              </span>
              <span className="text-right font-mono text-xs font-semibold tabular-nums"><span className="sr-only">{pos ? l.deltaUp('') : l.deltaDown('')}</span>{pos ? '+' : ''}{format(d.value)}</span>
            </li>
          )
        })}
      </ul>
    </Frame>
  )
}

/* ── Heatmap: intensity of one series across rows × columns ─────────────── */
export function Heatmap({ title, subtitle, rows, cols, data, format = compact }: { title: string; subtitle?: string; rows: string[]; cols: string[]; data: number[][]; format?: ChartFormat }) {
  const l = useLabels()
  const [pos, setPos] = useState<[number, number] | null>(null)
  const flat = data.flat(), lo = Math.min(...flat), hi = Math.max(...flat)
  const shade = (v: number) => `color-mix(in oklab, var(--pance-color-dataviz-series-1) ${Math.round(12 + ((v - lo) / (hi - lo || 1)) * 88)}%, var(--pance-color-dataviz-surface))`
  const onKeyDown = (e: KeyboardEvent) => {
    const d: Record<string, [number, number]> = { ArrowRight: [0, 1], ArrowLeft: [0, -1], ArrowDown: [1, 0], ArrowUp: [-1, 0] }
    if (e.key === 'Escape') { e.preventDefault(); return setPos(null) }
    if (!d[e.key]) return
    e.preventDefault()
    setPos((p) => { const [r, c] = p ?? [0, -1]; return [Math.max(0, Math.min(rows.length - 1, r + d[e.key][0])), Math.max(0, Math.min(cols.length - 1, c + d[e.key][1]))] })
  }
  return (
    <Frame
      title={title} subtitle={subtitle} summary={`${rows.length} × ${cols.length}, ${format(lo)} – ${format(hi)}`}
      table={{ head: ['', ...cols], rows: rows.map((r, i) => [r, ...data[i].map((v) => format(v))]) }}
      onKeyDown={onKeyDown} onBlur={() => setPos(null)} scroll
      status={pos && <Readout heading={`${rows[pos[0]]} · ${cols[pos[1]]}`} items={[{ i: 0, name: '', value: format(data[pos[0]][pos[1]]) }]} />}
    >
      <div>
        <div className="min-w-max">
          <div className="flex pl-16">{cols.map((c) => <div key={c} className="w-6 shrink-0 text-center text-xs text-(--pance-color-dataviz-axis-label)">{c}</div>)}</div>
          {data.map((row, r) => (
            <div key={rows[r]} className="mt-0.5 flex items-center">
              <div className="w-16 shrink-0 pr-2 text-right text-xs text-(--pance-color-dataviz-axis-label)">{rows[r]}</div>
              {row.map((v, c) => {
                const on = pos?.[0] === r && pos?.[1] === c
                return <div key={c} aria-hidden onMouseEnter={() => setPos([r, c])} onMouseLeave={() => setPos(null)} className={`mr-0.5 size-6 shrink-0 rounded-sm ${on ? 'outline-2 outline-offset-1 outline-(--pance-color-dataviz-ink)' : ''}`} style={{ backgroundColor: shade(v) }} />
              })}
            </div>
          ))}
          <div className="mt-3 flex items-center gap-2 pl-16 text-xs text-(--pance-color-dataviz-axis-label)">
            <span>{l.low}</span>
            <span aria-hidden className="flex h-2 w-24 overflow-hidden rounded-sm">{Array.from({ length: 8 }, (_, i) => <span key={i} className="flex-1" style={{ backgroundColor: shade(lo + ((hi - lo) * i) / 7) }} />)}</span>
            <span>{l.high}</span>
          </div>
        </div>
      </div>
    </Frame>
  )
}

/* ── DonutChart: parts of a whole; every slice is named with its share ─── */
export function DonutChart({ title, subtitle, slices, format = compact, size = 180 }: { title: string; subtitle?: string; slices: { label: string; value: number }[]; format?: ChartFormat; size?: number }) {
  const l = useLabels()
  const { active, setActive, onKeyDown } = useActive(slices.length)
  const total = slices.reduce((a, s) => a + s.value, 0) || 1
  const r = size / 2 - 14, c = 2 * Math.PI * r
  let acc = 0
  return (
    <Frame
      title={title} subtitle={subtitle} summary={slices.map((s) => `${s.label} ${Math.round((s.value / total) * 100)}%`).join(', ')}
      table={{ head: ['', l.total, '%'], rows: slices.map((s) => [s.label, format(s.value), `${Math.round((s.value / total) * 100)}%`]) }}
      onKeyDown={onKeyDown} onBlur={() => setActive(null)}
      status={active !== null && <Readout heading={slices[active].label} items={[{ i: active, name: '', value: `${format(slices[active].value)} · ${Math.round((slices[active].value / total) * 100)}%` }]} />}
    >
      <div className="flex flex-wrap items-center gap-6">
        <svg width={size} height={size} aria-hidden role="presentation" className="shrink-0 -rotate-90">
          {slices.map((s, i) => {
            const len = (s.value / total) * c, off = -acc
            acc += len
            return <circle key={s.label} cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={active === i ? 28 : 24} strokeDasharray={`${Math.max(0, len - 2)} ${c}`} strokeDashoffset={off} className={SERIES_STROKE[i % 8]} onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)} />
          })}
        </svg>
        <ul className="m-0 min-w-40 flex-1 list-none space-y-1.5 p-0">
          {slices.map((s, i) => (
            <li key={s.label} onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)} className="flex items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2"><span aria-hidden className={`size-2.5 shrink-0 ${i % 2 ? 'rounded-sm' : 'rounded-full'} ${SERIES_BG[i % 8]}`} />{s.label}</span>
              <span className="font-mono text-xs font-semibold tabular-nums">{Math.round((s.value / total) * 100)}%</span>
            </li>
          ))}
        </ul>
      </div>
    </Frame>
  )
}

/* ── ScatterChart ───────────────────────────────────────────────────────── */
export type ScatterPoint = { label: string; x: number; y: number }

export function ScatterChart({ title, subtitle, points, xLabel, yLabel, formatX = compact, formatY = compact, height = 280 }: {
  title: string; subtitle?: string; points: ScatterPoint[]; xLabel: string; yLabel: string; formatX?: ChartFormat; formatY?: ChartFormat; height?: number
}) {
  const [ref, width] = useWidth<HTMLDivElement>()
  const { active, setActive, onKeyDown } = useActive(points.length)
  const plotW = Math.max(100, width - M.l - M.r), plotH = height - M.t - M.b - 14
  const xMax = Math.max(...points.map((p) => p.x), 1), yMax = Math.max(...points.map((p) => p.y), 1)
  const xTicks = niceTicks(xMax), yTicks = niceTicks(yMax)
  const xTop = xTicks[xTicks.length - 1], yTop = yTicks[yTicks.length - 1]
  const px = (v: number) => (v / xTop) * plotW, py = (v: number) => plotH - (v / yTop) * plotH
  return (
    <Frame
      title={title} subtitle={subtitle} summary={`${points.length}. ${xLabel}, ${yLabel}.`}
      table={{ head: ['', xLabel, yLabel], rows: points.map((p) => [p.label, formatX(p.x), formatY(p.y)]) }}
      onKeyDown={onKeyDown} onBlur={() => setActive(null)}
      status={active !== null && <Readout heading={points[active].label} items={[{ i: 0, name: xLabel, value: formatX(points[active].x) }, { i: 1, name: yLabel, value: formatY(points[active].y) }]} />}
    >
      <div ref={ref}>
        <svg width={width} height={height} aria-hidden role="presentation">
          <g transform={`translate(${M.l},${M.t})`}>
            {yTicks.map((t) => (
              <g key={`y${t}`}>
                <line x1={0} x2={plotW} y1={py(t)} y2={py(t)} className="stroke-(--pance-color-dataviz-grid)" strokeWidth={1} />
                <text x={-8} y={py(t)} textAnchor="end" dominantBaseline="middle" className={`${TEXT} tabular-nums`}>{formatY(t)}</text>
              </g>
            ))}
            {xTicks.map((t) => <text key={`x${t}`} x={px(t)} y={plotH + 18} textAnchor="middle" className={`${TEXT} tabular-nums`}>{formatX(t)}</text>)}
            <line x1={0} x2={plotW} y1={plotH} y2={plotH} className="stroke-(--pance-color-dataviz-baseline)" strokeWidth={1} />
            <text x={plotW / 2} y={plotH + 36} textAnchor="middle" className={TEXT}>{xLabel}</text>
            <text transform={`translate(${-M.l + 12},${plotH / 2}) rotate(-90)`} textAnchor="middle" className={TEXT}>{yLabel}</text>
            {points.map((p, i) => (
              <g key={p.label} onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)}>
                {active === i && <circle cx={px(p.x)} cy={py(p.y)} r={11} className={`${SERIES_STROKE[0]} fill-none`} strokeWidth={2} />}
                <Marker shape="circle" x={px(p.x)} y={py(p.y)} size={active === i ? 6 : 5} i={0} />
                <circle cx={px(p.x)} cy={py(p.y)} r={12} fill="transparent" />
              </g>
            ))}
          </g>
        </svg>
      </div>
    </Frame>
  )
}

/* ── Meter ──────────────────────────────────────────────────────────────── */
export type MeterSeverity = 'default' | 'warning' | 'danger'
const METER_FILL: Record<MeterSeverity, string> = { default: 'bg-(--pance-meter-color-default)', warning: 'bg-(--pance-meter-color-warning)', danger: 'bg-(--pance-meter-color-danger)' }

/** One measurement against a known maximum, for example storage used or quota left. Uses role="meter"; the status is also written as text so colour is never the only cue. */
export function Meter({ label, value, max = 100, unit = '', severity = 'default', format }: {
  label: string; value: number; max?: number; unit?: string; severity?: MeterSeverity; format?: (n: number) => string
}) {
  const l = useLabels()
  const fmt = format ?? ((n: number) => n.toLocaleString())
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  const status = severity === 'danger' ? l.meterStatusDanger : severity === 'warning' ? l.meterStatusWarning : null
  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <span className="text-sm text-ink-muted">{label}</span>
        <span className="shrink-0 whitespace-nowrap font-mono text-sm font-semibold tabular-nums text-ink">{fmt(value)}{unit} <span className="text-xs text-ink-muted">/ {fmt(max)}{unit}</span></span>
      </div>
      <div role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} aria-valuetext={`${fmt(value)}${unit} / ${fmt(max)}${unit}${status ? `, ${status}` : ''}`}
        className="relative h-(--pance-meter-height) overflow-hidden rounded-(--pance-meter-radius) bg-(--pance-meter-color-track)">
        <div className={`absolute inset-y-0 left-0 rounded-(--pance-meter-radius) transition-[width] duration-500 motion-reduce:transition-none ${METER_FILL[severity]}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1.5 flex items-center justify-end gap-2 font-mono text-xs tabular-nums text-ink-muted">
        {status && <span className="font-sans font-semibold text-ink">{status}</span>}
        <span>{pct.toFixed(1)}%</span>
      </p>
    </div>
  )
}
