/* Shared primitives used across Pance components. */

/** Class that applies the Pance focus ring on :focus-visible (see styles/index.css). */
export const focus = 'pance-focus'


/** Severity = what it means. Orthogonal to variant (how loud it is). */
export type Severity = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'help' | 'danger' | 'contrast'

/** Emphasis for non-button surfaces (Badge, Alert). */
export type SurfaceVariant = 'soft' | 'solid' | 'outlined'

/** Class sets per severity. Every class is a semantic intent utility (theme.css → color.intent.*),
    so editing tokens/semantic.json — or switching to dark mode — restyles every component. */
export const TONE: Record<Severity, { soft: string; solid: string; outlined: string; dot: string; fg: string; bg: string; border: string; borderStrong: string; borderSolid: string; onSolid: string }> = {
  primary: { soft: 'bg-primary-soft text-primary-fg ring-primary-border', solid: 'bg-primary-solid text-primary-on-solid ring-primary-solid', outlined: 'bg-surface text-primary-fg ring-primary-border-strong', dot: 'bg-primary-dot', fg: 'text-primary-fg', bg: 'bg-primary-soft', border: 'border-primary-border', borderStrong: 'border-primary-border-strong', borderSolid: 'border-primary-solid', onSolid: 'text-primary-on-solid' },
  secondary: { soft: 'bg-secondary-soft text-secondary-fg ring-secondary-border', solid: 'bg-secondary-solid text-secondary-on-solid ring-secondary-solid', outlined: 'bg-surface text-secondary-fg ring-secondary-border-strong', dot: 'bg-secondary-dot', fg: 'text-secondary-fg', bg: 'bg-secondary-soft', border: 'border-secondary-border', borderStrong: 'border-secondary-border-strong', borderSolid: 'border-secondary-solid', onSolid: 'text-secondary-on-solid' },
  success: { soft: 'bg-success-soft text-success-fg ring-success-border', solid: 'bg-success-solid text-success-on-solid ring-success-solid', outlined: 'bg-surface text-success-fg ring-success-border-strong', dot: 'bg-success-dot', fg: 'text-success-fg', bg: 'bg-success-soft', border: 'border-success-border', borderStrong: 'border-success-border-strong', borderSolid: 'border-success-solid', onSolid: 'text-success-on-solid' },
  info: { soft: 'bg-info-soft text-info-fg ring-info-border', solid: 'bg-info-solid text-info-on-solid ring-info-solid', outlined: 'bg-surface text-info-fg ring-info-border-strong', dot: 'bg-info-dot', fg: 'text-info-fg', bg: 'bg-info-soft', border: 'border-info-border', borderStrong: 'border-info-border-strong', borderSolid: 'border-info-solid', onSolid: 'text-info-on-solid' },
  warning: { soft: 'bg-warning-soft text-warning-fg ring-warning-border', solid: 'bg-warning-solid text-warning-on-solid ring-warning-solid', outlined: 'bg-surface text-warning-fg ring-warning-border-strong', dot: 'bg-warning-dot', fg: 'text-warning-fg', bg: 'bg-warning-soft', border: 'border-warning-border', borderStrong: 'border-warning-border-strong', borderSolid: 'border-warning-solid', onSolid: 'text-warning-on-solid' },
  help: { soft: 'bg-help-soft text-help-fg ring-help-border', solid: 'bg-help-solid text-help-on-solid ring-help-solid', outlined: 'bg-surface text-help-fg ring-help-border-strong', dot: 'bg-help-dot', fg: 'text-help-fg', bg: 'bg-help-soft', border: 'border-help-border', borderStrong: 'border-help-border-strong', borderSolid: 'border-help-solid', onSolid: 'text-help-on-solid' },
  danger: { soft: 'bg-danger-soft text-danger-fg ring-danger-border', solid: 'bg-danger-solid text-danger-on-solid ring-danger-solid', outlined: 'bg-surface text-danger-fg ring-danger-border-strong', dot: 'bg-danger-dot', fg: 'text-danger-fg', bg: 'bg-danger-soft', border: 'border-danger-border', borderStrong: 'border-danger-border-strong', borderSolid: 'border-danger-solid', onSolid: 'text-danger-on-solid' },
  contrast: { soft: 'bg-contrast-soft text-contrast-fg ring-contrast-border', solid: 'bg-contrast-solid text-contrast-on-solid ring-contrast-solid', outlined: 'bg-surface text-contrast-fg ring-contrast-border-strong', dot: 'bg-contrast-dot', fg: 'text-contrast-fg', bg: 'bg-contrast-soft', border: 'border-contrast-border', borderStrong: 'border-contrast-border-strong', borderSolid: 'border-contrast-solid', onSolid: 'text-contrast-on-solid' },
}

/** Data-visualisation series colours, in the fixed order of `color.dataviz.series.1…8`.
    Classes are spelled out so Tailwind can see them. Each slot is ≥ 3:1 on the chart surface in light and dark,
    but colour must never be the only cue: pair it with a marker shape (see SERIES_MARKERS) or a direct label. */
export const SERIES_BG = [
  'bg-(--pance-color-dataviz-series-1)', 'bg-(--pance-color-dataviz-series-2)', 'bg-(--pance-color-dataviz-series-3)', 'bg-(--pance-color-dataviz-series-4)',
  'bg-(--pance-color-dataviz-series-5)', 'bg-(--pance-color-dataviz-series-6)', 'bg-(--pance-color-dataviz-series-7)', 'bg-(--pance-color-dataviz-series-8)',
] as const
export const SERIES_FILL = [
  'fill-(--pance-color-dataviz-series-1)', 'fill-(--pance-color-dataviz-series-2)', 'fill-(--pance-color-dataviz-series-3)', 'fill-(--pance-color-dataviz-series-4)',
  'fill-(--pance-color-dataviz-series-5)', 'fill-(--pance-color-dataviz-series-6)', 'fill-(--pance-color-dataviz-series-7)', 'fill-(--pance-color-dataviz-series-8)',
] as const
export const SERIES_STROKE = [
  'stroke-(--pance-color-dataviz-series-1)', 'stroke-(--pance-color-dataviz-series-2)', 'stroke-(--pance-color-dataviz-series-3)', 'stroke-(--pance-color-dataviz-series-4)',
  'stroke-(--pance-color-dataviz-series-5)', 'stroke-(--pance-color-dataviz-series-6)', 'stroke-(--pance-color-dataviz-series-7)', 'stroke-(--pance-color-dataviz-series-8)',
] as const
/** One marker shape per series, so series stay distinguishable without colour (WCAG 1.4.1). */
export const SERIES_MARKERS = ['circle', 'square', 'triangle', 'diamond', 'cross', 'circle-open', 'square-open', 'triangle-open'] as const
export type SeriesMarker = (typeof SERIES_MARKERS)[number]
