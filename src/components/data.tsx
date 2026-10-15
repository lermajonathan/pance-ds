/* Pance · Data — Delta, Sparkline, MetricCard */
import { useId } from 'react'
import { useLabels } from './labels'
import { IconAlert, IconArrowDown, IconArrowUp, IconChart, type IconType } from '../icons'
import { focus, SERIES_BG, TONE, type Severity } from './shared'
import { Progress, Skeleton } from './feedback'

/* ── Delta ──────────────────────────────────────────────────────────────────
   Change versus a previous period. Direction is shown by an arrow and spoken by
   screen readers; "better" or "worse" is spoken too, so colour is never the only signal. */
export function Delta({
  value,
  upIsGood = true,
  format = (n) => `${Math.abs(n)}%`,
}: {
  /** Signed change, e.g. 12.4 or -3.8. */
  value: number
  /** Set to false when an increase is bad (error rate, churn, cost). */
  upIsGood?: boolean
  format?: (n: number) => string
}) {
  const l = useLabels()
  const flat = value === 0
  const up = value > 0
  const good = flat ? undefined : upIsGood ? up : !up
  const tone = flat ? 'bg-canvas text-ink-soft' : good ? `${TONE.primary.bg} ${TONE.primary.fg}` : `${TONE.danger.bg} ${TONE.danger.fg}`
  const text = format(value)
  const spoken = flat ? l.deltaFlat : `${up ? l.deltaUp(text) : l.deltaDown(text)}, ${good ? l.deltaBetter : l.deltaWorse}`
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 font-mono text-xs font-semibold ${tone}`}>
      <span className="sr-only">{spoken}</span>
      <span aria-hidden className="inline-flex items-center gap-1">
        {flat ? <span className="h-0.5 w-2 rounded-full bg-current" /> : up ? <IconArrowUp className="h-3 w-3" /> : <IconArrowDown className="h-3 w-3" />}
        {flat ? '0%' : text}
      </span>
    </span>
  )
}

/* ── Sparkline ──────────────────────────────────────────────────────────────
   A tiny trend. It carries one fact ("from X to Y"), exposed as an image with a text alternative. */
type SparkSize = 'sm' | 'md' | 'lg'
const SPARK: Record<SparkSize, { w: number; h: number; box: string }> = {
  sm: { w: 56, h: 24, box: 'w-(--pance-sparkline-width-sm) h-(--pance-sparkline-height-sm)' },
  md: { w: 96, h: 36, box: 'w-(--pance-sparkline-width-md) h-(--pance-sparkline-height-md)' },
  lg: { w: 120, h: 56, box: 'w-(--pance-sparkline-width-lg) h-(--pance-sparkline-height-lg)' },
}
const SPARK_TONE = {
  positive: { stroke: 'stroke-(--pance-color-dataviz-positive)', fill: 'fill-(--pance-color-dataviz-positive)' },
  negative: { stroke: 'stroke-(--pance-color-dataviz-negative)', fill: 'fill-(--pance-color-dataviz-negative)' },
  neutral: { stroke: 'stroke-(--pance-color-dataviz-axis-label)', fill: 'fill-(--pance-color-dataviz-axis-label)' },
} as const

export function Sparkline({
  data,
  tone = 'positive',
  size = 'md',
  variant = 'line',
  label,
}: {
  data: number[]
  tone?: keyof typeof SPARK_TONE
  size?: SparkSize
  variant?: 'line' | 'bar'
  /** Accessible name. Defaults to "Trend: from X to Y". */
  label?: string
}) {
  const l = useLabels()
  const { w, h, box } = SPARK[size]
  const t = SPARK_TONE[tone]
  const pts = data.length ? data : [0]
  const max = Math.max(...pts), min = Math.min(...pts), span = max - min || 1
  const y = (v: number) => h - 3 - ((v - min) / span) * (h - 6)
  const x = (i: number) => (pts.length === 1 ? w / 2 : (i / (pts.length - 1)) * w)
  const line = pts.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
  const name = label ?? `${l.trend}: ${pts[0]} → ${pts[pts.length - 1]}`
  const flat = max === min
  return (
    <svg role="img" aria-label={name} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className={`shrink-0 overflow-visible ${box}`}>
      <title>{name}</title>
      {variant === 'bar' ? (
        pts.map((v, i) => {
          const bw = Math.max(3, w / pts.length - 2)
          const bh = Math.max(2, ((v - Math.min(0, min)) / (max - Math.min(0, min) || 1)) * (h - 2))
          return <rect key={i} x={(i / pts.length) * w + (w / pts.length - bw) / 2} y={h - bh} width={bw} height={bh} rx={1.5} className={t.fill} opacity={i === pts.length - 1 ? 1 : 0.4} />
        })
      ) : flat ? (
        <line x1={2} y1={h / 2} x2={w - 2} y2={h / 2} className={t.stroke} strokeWidth={2} strokeDasharray="3 3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      ) : (
        <>
          <polygon points={`0,${h} ${line} ${w},${h}`} className={t.fill} opacity={0.12} />
          <polyline points={line} fill="none" className={t.stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          <circle cx={x(pts.length - 1)} cy={y(pts[pts.length - 1])} r={3} className={t.fill} />
        </>
      )}
    </svg>
  )
}

/* ── MetricCard ─────────────────────────────────────────────────────────────
   One KPI. Variants change layout, not meaning:
     default · compact · hero · goal (progress to a target) · breakdown (parts of the value) · comparison (this vs previous)
   `state` swaps the body for loading, empty or error, keeping the card's size stable. */
export type MetricCardProps = {
  label: string
  /** Pre-formatted value, e.g. "18,204". Formatting stays with you, so locale and units are yours. */
  value: string
  unit?: string
  Icon?: IconType
  /** Signed percentage change. */
  delta?: number
  upIsGood?: boolean
  trend?: number[]
  /** Accessible description of the trend, e.g. "Streams per day, last 8 days". */
  trendLabel?: string
  caption?: string
  variant?: 'default' | 'compact' | 'hero' | 'goal' | 'breakdown' | 'comparison'
  state?: 'ready' | 'loading' | 'empty' | 'error'
  onRetry?: () => void
  /** Colour of the hero card. */
  accent?: Severity
  /** variant="goal" */
  goal?: { current: number; target: number; format?: (n: number) => string }
  /** variant="breakdown": `share` is a percentage of the largest part. */
  breakdown?: { label: string; value: string; share: number }[]
  /** variant="comparison" */
  comparison?: { previous: string; currentLabel: string; previousLabel: string }
}

function IconBox({ Icon, tone = 'primary' }: { Icon: IconType; tone?: Severity }) {
  return (
    <span aria-hidden className={`grid size-(--pance-metric-card-icon-box) shrink-0 place-items-center rounded-xl ${TONE[tone].bg} ${TONE[tone].fg}`}>
      <Icon className="size-(--pance-metric-card-icon-size)" />
    </span>
  )
}

function Value({ value, unit, className }: { value: string; unit?: string; className: string }) {
  return (
    <p className={`font-display font-extrabold leading-none tracking-tight text-ink ${className}`}>
      {value}
      {unit && <span className="ml-1 font-mono text-[0.45em] font-semibold text-ink-muted">{unit}</span>}
    </p>
  )
}

export function MetricCard({
  label, value, unit, Icon = IconChart, delta, upIsGood = true, trend, trendLabel, caption,
  variant = 'default', state = 'ready', onRetry, accent = 'primary', goal, breakdown, comparison,
}: MetricCardProps) {
  const l = useLabels()
  const id = useId()
  const good = delta === undefined ? true : upIsGood ? delta >= 0 : delta < 0
  const sparkTone = delta === undefined || delta === 0 ? 'neutral' : good ? 'positive' : 'negative'
  const shell = 'relative overflow-hidden rounded-(--pance-metric-card-radius) border border-(--pance-metric-card-border) bg-(--pance-metric-card-bg) shadow-card-rest'

  if (state === 'loading') {
    return (
      <article aria-busy="true" aria-labelledby={`${id}-l`} className={`${shell} p-(--pance-metric-card-padding)`}>
        <p id={`${id}-l`} className="sr-only">{label}: {l.loading}</p>
        <div className="flex items-start justify-between"><div className="flex items-center gap-2.5"><Skeleton className="size-(--pance-metric-card-icon-box) rounded-xl" /><Skeleton className="h-3.5 w-24 rounded-full" /></div><Skeleton className="h-6 w-14 rounded-full" /></div>
        <Skeleton className="mt-6 h-9 w-32" />
        <Skeleton className="mt-3 h-3 w-28 rounded-full" />
      </article>
    )
  }
  if (state === 'empty' || state === 'error') {
    const err = state === 'error'
    const Shell = err ? 'div' : 'article'
    return (
      <Shell role={err ? 'alert' : undefined} aria-labelledby={err ? undefined : `${id}-l`} className={`${shell} flex flex-col items-center justify-center gap-2 border-dashed p-(--pance-metric-card-padding) text-center ${err ? TONE.danger.border : ''}`}>
        <IconBox Icon={err ? IconAlert : Icon} tone={err ? 'danger' : 'secondary'} />
        <p id={`${id}-l`} className="text-sm font-medium text-ink-soft">{label}</p>
        <p className="text-xs text-ink-muted">{err ? l.failedToLoad : l.noData}</p>
        {err && onRetry && <button type="button" onClick={onRetry} className={`${focus} mt-1 rounded text-xs font-medium text-ink-link underline-offset-2 hover:underline`}>{l.retry}</button>}
      </Shell>
    )
  }

  const header = (
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2.5"><IconBox Icon={Icon} /><p id={`${id}-l`} className="truncate text-sm font-medium text-ink-muted">{label}</p></div>
      {delta !== undefined && <Delta value={delta} upIsGood={upIsGood} />}
    </div>
  )

  if (variant === 'compact') {
    return (
      <article aria-labelledby={`${id}-l`} className={`${shell} flex items-center justify-between gap-3 p-(--pance-metric-card-padding-compact)`}>
        <div className="min-w-0">
          <p id={`${id}-l`} className="truncate text-xs text-ink-muted">{label}</p>
          <Value value={value} unit={unit} className="mt-1 text-xl" />
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {trend && <Sparkline data={trend} tone={sparkTone} size="sm" label={trendLabel} />}
          {delta !== undefined && <Delta value={delta} upIsGood={upIsGood} />}
        </div>
      </article>
    )
  }

  if (variant === 'hero') {
    return (
      <article aria-labelledby={`${id}-l`} className={`${shell} ${TONE[accent].bg} p-(--pance-metric-card-padding-hero)`}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p id={`${id}-l`} className="text-xs font-medium uppercase tracking-widest text-ink-soft">{label}</p>
            <Value value={value} unit={unit} className="mt-3 text-6xl" />
            {caption && <p className="mt-2 text-sm text-ink-soft">{caption}</p>}
            {delta !== undefined && <div className="mt-4"><Delta value={delta} upIsGood={upIsGood} /></div>}
          </div>
          {trend && <Sparkline data={trend} tone={sparkTone} size="lg" label={trendLabel} />}
        </div>
      </article>
    )
  }

  if (variant === 'goal' && goal) {
    const fmt = goal.format ?? ((n: number) => n.toLocaleString())
    const pct = Math.min(100, Math.round((goal.current / goal.target) * 100))
    const severity: Severity = pct >= 90 ? 'success' : pct >= 60 ? 'primary' : 'warning'
    return (
      <article aria-labelledby={`${id}-l`} className={`${shell} p-(--pance-metric-card-padding)`}>
        {header}
        <div className="mt-5 flex items-end justify-between gap-3">
          <Value value={value} unit={unit} className="text-4xl" />
          <p className="text-right text-xs text-ink-muted"><span className="font-mono font-semibold text-ink">{l.ofGoal(`${pct}%`)}</span></p>
        </div>
        <div className="mt-3"><Progress value={pct} severity={severity} label={label} valueText={`${fmt(goal.current)} / ${fmt(goal.target)}`} /></div>
        <div className="mt-1.5 flex justify-between text-xs text-ink-muted">
          <p>{l.current} <span className="font-mono font-medium text-ink">{fmt(goal.current)}</span></p>
          <p>{l.target} <span className="font-mono font-medium text-ink">{fmt(goal.target)}</span></p>
        </div>
      </article>
    )
  }

  if (variant === 'breakdown' && breakdown) {
    return (
      <article aria-labelledby={`${id}-l`} className={`${shell} p-(--pance-metric-card-padding)`}>
        {header}
        <Value value={value} unit={unit} className="mt-4 text-4xl" />
        <ul className="mt-4 space-y-2 border-t border-line pt-4">
          {breakdown.map((b, i) => (
            <li key={b.label} className="flex items-center gap-3">
              <span className="w-24 shrink-0 truncate text-xs text-ink-muted">{b.label}</span>
              <span aria-hidden className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-ground">
                <span className={`absolute inset-y-0 left-0 rounded-full ${SERIES_BG[i % SERIES_BG.length]}`} style={{ width: `${Math.max(0, Math.min(100, b.share))}%` }} />
              </span>
              <span className="min-w-12 shrink-0 text-right font-mono text-xs font-medium tabular-nums text-ink">{b.value}</span>
            </li>
          ))}
        </ul>
      </article>
    )
  }

  if (variant === 'comparison' && comparison) {
    return (
      <article aria-labelledby={`${id}-l`} className={`${shell} p-(--pance-metric-card-padding)`}>
        {header}
        <dl className="mt-5 grid grid-cols-2 divide-x divide-line">
          <div className="pr-4"><dt className="text-xs font-medium uppercase tracking-wider text-ink-muted">{comparison.currentLabel}</dt><dd className="mt-1"><Value value={value} unit={unit} className="text-3xl" /></dd></div>
          <div className="pl-4"><dt className="text-xs font-medium uppercase tracking-wider text-ink-muted">{comparison.previousLabel}</dt><dd className="mt-1"><Value value={comparison.previous} unit={unit} className="text-3xl !text-ink-soft" /></dd></div>
        </dl>
      </article>
    )
  }

  return (
    <article aria-labelledby={`${id}-l`} className={`${shell} p-(--pance-metric-card-padding)`}>
      {header}
      <div className="mt-6 flex items-end justify-between gap-3">
        <Value value={value} unit={unit} className="text-4xl" />
        {trend && <Sparkline data={trend} tone={sparkTone} label={trendLabel} />}
      </div>
      {(caption ?? (delta !== undefined ? l.vsPrevious : undefined)) && <p className="mt-3 text-xs text-ink-muted">{caption ?? l.vsPrevious}</p>}
    </article>
  )
}
