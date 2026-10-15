/* Shared primitives used across Pance components. */

/** Class that applies the Pance focus ring on :focus-visible (see styles/index.css). */
export const focus = 'pance-focus'

/** Severity = what it means. Orthogonal to variant (how loud it is). */
export type Severity = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'help' | 'danger' | 'contrast'

/** Emphasis for non-button surfaces (Badge, Alert). */
export type SurfaceVariant = 'soft' | 'solid' | 'outlined'

export const TONE: Record<Severity, { soft: string; solid: string; outlined: string; dot: string; fg: string; bg: string; border: string }> = {
  primary: { soft: 'bg-brand-50 text-brand-700 ring-brand-200', solid: 'bg-brand-600 text-white ring-brand-600', outlined: 'bg-surface text-brand-700 ring-brand-400', dot: 'bg-brand-500', fg: 'text-brand-700', bg: 'bg-brand-50', border: 'border-brand-200' },
  secondary: { soft: 'bg-slate-100 text-slate-600 ring-slate-200', solid: 'bg-slate-600 text-white ring-slate-600', outlined: 'bg-surface text-slate-700 ring-slate-400', dot: 'bg-slate-400', fg: 'text-slate-600', bg: 'bg-canvas', border: 'border-line' },
  success: { soft: 'bg-emerald-50 text-emerald-700 ring-emerald-200', solid: 'bg-emerald-600 text-white ring-emerald-600', outlined: 'bg-surface text-emerald-700 ring-emerald-400', dot: 'bg-emerald-500', fg: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  info: { soft: 'bg-sky-50 text-sky-700 ring-sky-200', solid: 'bg-sky-600 text-white ring-sky-600', outlined: 'bg-surface text-sky-700 ring-sky-400', dot: 'bg-sky-500', fg: 'text-sky-700', bg: 'bg-sky-50', border: 'border-sky-200' },
  warning: { soft: 'bg-amber-50 text-amber-700 ring-amber-200', solid: 'bg-amber-500 text-white ring-amber-500', outlined: 'bg-surface text-amber-700 ring-amber-400', dot: 'bg-amber-500', fg: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  help: { soft: 'bg-violet-50 text-violet-700 ring-violet-200', solid: 'bg-violet-600 text-white ring-violet-600', outlined: 'bg-surface text-violet-700 ring-violet-400', dot: 'bg-violet-500', fg: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-200' },
  danger: { soft: 'bg-rose-50 text-rose-700 ring-rose-200', solid: 'bg-rose-600 text-white ring-rose-600', outlined: 'bg-surface text-rose-700 ring-rose-400', dot: 'bg-rose-500', fg: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' },
  contrast: { soft: 'bg-slate-200 text-slate-900 ring-slate-300', solid: 'bg-slate-900 text-white ring-slate-900', outlined: 'bg-surface text-slate-900 ring-slate-900', dot: 'bg-slate-900', fg: 'text-slate-900', bg: 'bg-slate-100', border: 'border-slate-300' },
}
