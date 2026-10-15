import { useMemo, useState, type ReactNode } from 'react'
import { useI18n, type Key } from '../i18n'
import { Alert, Avatar, Badge, Button, Card, Progress, SegmentedControl, Tabs, ToastStack, type Severity, type ToastItem } from '../components'
import {
  IconAlert, IconArrowDown, IconArrowUp, IconBell, IconBuildings, IconCalendar, IconCheck, IconCheckCircle,
  IconCurrency, IconDownload, IconMapPin, IconPhone, IconPlus, IconSearch, IconUsers, IconWave, type IconType,
} from '../icons'

/* ═══════════════════════════════════════════════════════════════════════
   TENDERO — fictional console for a Colombian neighborhood shop (tienda de barrio).
   Store, people, amounts and suppliers are invented. Payment rails
   (Nequi, Daviplata, Bre-B) are named only for local realism.
   ═══════════════════════════════════════════════════════════════════════ */

type Range = 'hoy' | '7d' | '30d'
const cop = (n: number) => '$' + Math.round(n).toLocaleString('es-CO')

const METHODS = [
  { key: 'efectivo', label: 'Efectivo', color: '#334155' },
  { key: 'nequi', label: 'Nequi', color: '#0891b2' },
  { key: 'daviplata', label: 'Daviplata', color: '#e11d48' },
  { key: 'breb', label: 'Bre-B', color: '#7c3aed' },
  { key: 'tarjeta', label: 'Tarjeta', color: '#d97706' },
] as const
type MethodKey = (typeof METHODS)[number]['key']

/* Hourly shape for a tienda: breakfast, lunch and after-work peaks. */
const HOURS = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
const SHAPE = [0.5, 1.4, 1.1, 0.7, 0.6, 0.9, 1.3, 1.0, 0.6, 0.5, 0.7, 1.2, 1.6, 1.5, 1.0, 0.5]
const MIX: Record<MethodKey, number> = { efectivo: 0.46, nequi: 0.27, daviplata: 0.11, breb: 0.09, tarjeta: 0.07 }
const SCALE: Record<Range, { total: number; tickets: number; prev: number; label: Key }> = {
  hoy: { total: 1_284_600, tickets: 142, prev: 1_190_300, label: 'console.kpi.vs.today' },
  '7d': { total: 8_472_900, tickets: 948, prev: 8_102_000, label: 'console.kpi.vs.7d' },
  '30d': { total: 34_918_400, tickets: 3_861, prev: 35_620_000, label: 'console.kpi.vs.30d' },
}

type Tx = { id: string; time: string; who: string; items: string; method: MethodKey | 'fiado'; amount: number; status: 'ok' | 'pendiente' | 'reversada' }
const TXS: Tx[] = [
  { id: 'V-20418', time: '18:42', who: 'Cliente de mostrador', items: 'Leche 1L ×2, pan tajado, huevos ×12', method: 'nequi', amount: 23_400, status: 'ok' },
  { id: 'V-20417', time: '18:37', who: 'Don Hernán Ospina', items: 'Arroz 5 lb, aceite 1L, panela', method: 'fiado', amount: 31_800, status: 'pendiente' },
  { id: 'V-20416', time: '18:31', who: 'Domicilio · Cra 45 #67-12', items: 'Gaseosa 1.5L ×2, papas, hielo', method: 'daviplata', amount: 18_900, status: 'ok' },
  { id: 'V-20415', time: '18:24', who: 'Cliente de mostrador', items: 'Recarga de celular', method: 'efectivo', amount: 10_000, status: 'ok' },
  { id: 'V-20414', time: '18:19', who: 'Yesenia Cardona', items: 'Mercado semanal (14 ítems)', method: 'breb', amount: 86_250, status: 'ok' },
  { id: 'V-20413', time: '18:11', who: 'Cliente de mostrador', items: 'Cerveza ×6', method: 'tarjeta', amount: 21_000, status: 'reversada' },
  { id: 'V-20412', time: '18:06', who: 'Doña Gloria Restrepo', items: 'Chocolate, queso campesino, arepas', method: 'fiado', amount: 17_500, status: 'pendiente' },
  { id: 'V-20411', time: '17:58', who: 'Cliente de mostrador', items: 'Pago factura de servicios', method: 'efectivo', amount: 64_300, status: 'ok' },
]

type Debt = { id: string; name: string; phone: string; balance: number; limit: number; days: number }
const DEBTS: Debt[] = [
  { id: 'f1', name: 'Hernán Ospina', phone: '300 ··· 4521', balance: 148_300, limit: 200_000, days: 3 },
  { id: 'f2', name: 'Gloria Restrepo', phone: '311 ··· 0987', balance: 92_000, limit: 150_000, days: 9 },
  { id: 'f3', name: 'Luis Fernando Mejía', phone: '315 ··· 2210', balance: 186_500, limit: 180_000, days: 21 },
  { id: 'f4', name: 'Marleny Zapata', phone: '320 ··· 7745', balance: 34_200, limit: 120_000, days: 1 },
]

type Stock = { id: string; name: string; supplier: string; units: number; par: number; next: [Key, string?] }
const STOCK: Stock[] = [
  { id: 's1', name: 'Huevos AA × 30', supplier: 'Avícola Santa Elena', units: 3, par: 20, next: ['console.when.thu'] },
  { id: 's2', name: 'Leche entera 1L', supplier: 'Lácteos del Aburrá', units: 11, par: 48, next: ['console.when.tomorrow', '6:00'] },
  { id: 's3', name: 'Pan tajado', supplier: 'Panadería La Floresta', units: 6, par: 24, next: ['console.when.tomorrow', '5:30'] },
  { id: 's4', name: 'Gas cilindro 40 lb', supplier: 'Gas Ladera', units: 2, par: 6, next: ['console.when.fri'] },
  { id: 's5', name: 'Arroz 5 lb', supplier: 'Distribuidora El Llano', units: 19, par: 30, next: ['console.when.mon'] },
]

const DELIVERIES = [
  { id: 'D-311', to: 'Cra 45 #67-12, apto 302', rider: 'Kevin', eta: 4, onRoute: true },
  { id: 'D-312', to: 'Cl 70 #44-08', rider: 'Kevin', eta: 12, onRoute: false },
  { id: 'D-313', to: 'Cra 46 #71-30, casa', rider: 'Andrés', eta: 18, onRoute: false },
]

const methodOf = (m: Tx['method']) => (m === 'fiado' ? { key: m, label: 'Fiado', color: '#059669' } : METHODS.find((x) => x.key === m)!)
const METHOD_LABEL: Partial<Record<Tx['method'], Key>> = { efectivo: 'console.method.cash', tarjeta: 'console.method.card', fiado: 'console.method.credit' }

/* ── KPI tile ─────────────────────────────────────────────────────────── */
function Kpi({ label, value, sub, delta, upIsGood = true, Icon }: { label: string; value: string; sub: string; delta: number; upIsGood?: boolean; Icon: IconType }) {
  const good = upIsGood ? delta >= 0 : delta < 0
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-sm font-medium text-ink-muted">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-50 text-brand-600"><Icon size={16} /></span>{label}
        </span>
        <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 font-mono text-[11px] font-semibold ${good ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
          {delta >= 0 ? <IconArrowUp size={10} weight="bold" /> : <IconArrowDown size={10} weight="bold" />}{Math.abs(delta).toFixed(1)}%
        </span>
      </div>
      <p className="mt-4 font-display text-[28px] font-extrabold leading-none tracking-tight text-ink">{value}</p>
      <p className="mt-2 text-xs text-ink-muted">{sub}</p>
    </div>
  )
}

/* ── Hourly stacked bars ──────────────────────────────────────────────── */
function SalesChart({ total, hidden, onToggle }: { total: number; hidden: Set<MethodKey>; onToggle: (k: MethodKey) => void }) {
  const { t: tt } = useI18n()
  const [hover, setHover] = useState<number | null>(null)
  const sum = SHAPE.reduce((a, b) => a + b, 0)
  const bars = SHAPE.map((s) => METHODS.map((m) => (hidden.has(m.key) ? 0 : (total * s * MIX[m.key]) / sum)))
  const max = Math.max(...SHAPE) * total / sum
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {METHODS.map((m) => {
          const off = hidden.has(m.key)
          return (
            <button key={m.key} onClick={() => onToggle(m.key)} aria-pressed={!off} className={`pance-focus inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${off ? 'border-line text-ink-muted line-through opacity-60' : 'border-line bg-surface text-ink-soft hover:border-slate-300'}`}>
              <span className="h-2 w-2 rounded-full" style={{ background: m.color }} />{METHOD_LABEL[m.key] ? tt(METHOD_LABEL[m.key]!) : m.label}
              <span className="font-mono text-[10px] text-ink-muted">{Math.round(MIX[m.key] * 100)}%</span>
            </button>
          )
        })}
      </div>
      <div className="mt-8 flex h-48 items-end gap-1 sm:gap-2">
        {bars.map((stack, i) => {
          const h = stack.reduce((a, b) => a + b, 0)
          return (
            <div key={i} className="relative flex h-full flex-1 flex-col justify-end" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              {hover === i && (
                <div className="pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 font-mono text-[11px] text-white shadow-lg" style={{ bottom: `calc(${(h / max) * 100}% + 8px)` }}>
                  {HOURS[i]}:00 · {cop(h)}
                </div>
              )}
              <div className={`flex flex-col-reverse overflow-hidden rounded-md transition-all duration-300 ${hover !== null && hover !== i ? 'opacity-50' : ''}`} style={{ height: `${(h / max) * 100}%` }}>
                {stack.map((v, j) => <div key={j} style={{ height: `${h ? (v / h) * 100 : 0}%`, background: METHODS[j].color }} />)}
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-2 flex gap-1 font-mono text-[10px] text-ink-muted sm:gap-2">
        {HOURS.map((h, i) => <span key={h} className="flex-1 text-center">{i % 2 === 0 ? h : ''}</span>)}
      </div>
    </div>
  )
}

function Panel({ title, sub, action, children, className = '' }: { title: string; sub?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <Card className={`flex flex-col overflow-hidden ${className}`}>
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-line-soft px-6 py-4">
        <div>
          <h3 className="font-display text-[15px] font-bold tracking-tight text-ink">{title}</h3>
          {sub && <p className="mt-0.5 text-xs text-ink-muted">{sub}</p>}
        </div>
        {action}
      </header>
      {children}
    </Card>
  )
}

const STATUS: Record<Tx['status'], { sev: Severity; label: Key }> = {
  ok: { sev: 'success', label: 'console.status.ok' },
  pendiente: { sev: 'warning', label: 'console.status.pending' },
  reversada: { sev: 'danger', label: 'console.status.reversed' },
}

export default function ConsoleExample() {
  const { t: tt } = useI18n()
  const [range, setRange] = useState<Range>('hoy')
  const [hidden, setHidden] = useState<Set<MethodKey>>(new Set())
  const [txFilter, setTxFilter] = useState('todas')
  const [query, setQuery] = useState('')
  const [reminded, setReminded] = useState<Set<string>>(new Set())
  const [ordered, setOrdered] = useState<Set<string>>(new Set())
  const [closed, setClosed] = useState(false)
  const [counted, setCounted] = useState('589000')
  const [offline, setOffline] = useState(false)
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const toast = (t: Omit<ToastItem, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((x) => [...x, { ...t, id }])
    setTimeout(() => setToasts((x) => x.filter((y) => y.id !== id)), 4000)
  }

  const s = SCALE[range]
  const delta = ((s.total - s.prev) / s.prev) * 100
  const fiadoTotal = DEBTS.reduce((a, d) => a + d.balance, 0)
  const cashExpected = 591_200
  const diff = Number(counted || 0) - cashExpected

  const txs = useMemo(() => TXS.filter((t) => {
    if (txFilter === 'digital' && (t.method === 'efectivo' || t.method === 'fiado')) return false
    if (txFilter === 'efectivo' && t.method !== 'efectivo') return false
    if (txFilter === 'fiado' && t.method !== 'fiado') return false
    const q = query.trim().toLowerCase()
    return !q || `${t.id} ${t.who} ${t.items}`.toLowerCase().includes(q)
  }), [txFilter, query])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
        <Badge severity="help" size="sm">{tt('console.demo.tag')}</Badge>
        <span>{tt('console.demo.text')}</span>
      </div>

      <div className="overflow-hidden rounded-3xl border border-line bg-canvas shadow-[0_24px_64px_-32px_rgba(15,23,42,0.35)]">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line bg-surface px-6 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 font-display text-base font-extrabold text-white">T</span>
            <div className="min-w-0">
              <p className="truncate font-display text-[15px] font-bold leading-tight text-ink">Tienda La Esquina de Doña Marta</p>
              <p className="flex items-center gap-1 truncate text-xs text-ink-muted"><IconMapPin size={12} /> Manrique Central · Medellín, Antioquia</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${offline ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${offline ? 'bg-amber-500' : 'animate-pulse bg-emerald-500'}`} />
              {offline ? tt('console.sync.offline') : tt('console.sync.online')}
            </span>
            <SegmentedControl size="sm" value={range} onChange={setRange} options={[{ value: 'hoy', label: tt('console.range.today') }, { value: '7d', label: tt('console.range.7d') }, { value: '30d', label: tt('console.range.30d') }]} />
            <Avatar name="Marta Úsuga" size={32} status="online" />
          </div>
        </div>

        <div className="space-y-6 p-4 sm:p-6">
          <Alert
            severity="warning"
            title={tt('console.alert.title')}
            Icon={IconAlert}
            actions={
              <Button size="sm" severity="warning" variant={offline ? 'filled' : 'outlined'}
                onClick={() => {
                  setOffline((o) => !o)
                  toast(offline
                    ? { severity: 'success', title: tt('console.toast.online.title'), description: tt('console.toast.online.desc') }
                    : { severity: 'info', title: tt('console.toast.offline.title'), description: tt('console.toast.offline.desc') })
                }}>
                {offline ? tt('console.alert.btn.on') : tt('console.alert.btn.off')}
              </Button>
            }
          >
            {tt('console.alert.body')}
          </Alert>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Kpi label={tt('console.kpi.sales')} value={cop(s.total)} sub={tt(s.label)} delta={delta} Icon={IconCurrency} />
            <Kpi label={tt('console.kpi.ticket')} value={cop(s.total / s.tickets)} sub={tt('console.kpi.ticket.sub', { n: s.tickets.toLocaleString('es-CO') })} delta={range === '30d' ? -1.2 : 3.4} Icon={IconWave} />
            <Kpi label={tt('console.kpi.credit')} value={cop(fiadoTotal)} sub={tt('console.kpi.credit.sub', { n: DEBTS.length })} delta={8.6} upIsGood={false} Icon={IconUsers} />
            <Kpi label={tt('console.kpi.digital')} value={`${Math.round((1 - MIX.efectivo) * 100)}%`} sub={tt('console.kpi.digital.sub')} delta={5.1} Icon={IconPhone} />
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <Panel
              title={tt('console.chart.title')}
              sub={range === 'hoy' ? tt('console.chart.sub.today') : tt('console.chart.sub.avg', { n: range === '7d' ? 7 : 30 })}
              action={<Button size="sm" variant="text" severity="secondary" Icon={IconDownload} onClick={() => toast({ severity: 'success', title: tt('console.chart.toast.title'), description: tt('console.chart.toast.desc') })}>CSV</Button>}
            >
              <div className="p-6">
                <SalesChart
                  total={range === 'hoy' ? s.total : s.total / (range === '7d' ? 7 : 30)}
                  hidden={hidden}
                  onToggle={(k) => setHidden((h) => { const n = new Set(h); if (n.has(k)) n.delete(k); else n.add(k); return n })}
                />
              </div>
            </Panel>

            <Panel title={tt('console.cash.title')} sub={tt('console.cash.sub')} action={<Badge severity={closed ? 'success' : 'secondary'} dot>{closed ? tt('console.cash.closed') : tt('console.cash.open')}</Badge>}>
              <div className="flex flex-1 flex-col gap-4 p-6">
                <dl className="space-y-2.5 text-sm">
                  {([[tt('console.cash.base'), 150_000], [tt('console.cash.sales'), 505_500], [tt('console.cash.supplier'), -64_300]] as const).map(([k, v]) => (
                    <div key={k} className="flex justify-between"><dt className="text-ink-muted">{k}</dt><dd className={`font-mono ${v < 0 ? 'text-rose-600' : 'text-ink'}`}>{v < 0 ? '−' : ''}{cop(Math.abs(v))}</dd></div>
                  ))}
                  <div className="flex justify-between border-t border-line-soft pt-2.5 font-semibold"><dt className="text-ink">{tt('console.cash.expected')}</dt><dd className="font-mono text-ink">{cop(cashExpected)}</dd></div>
                </dl>
                <label className="block">
                  <span className="text-xs font-medium text-ink-soft">{tt('console.cash.counted')}</span>
                  <div className="mt-1.5 flex h-10 items-center rounded-xl border border-line bg-surface px-3 focus-within:border-brand-500 focus-within:shadow-[0_0_0_3px_var(--color-brand-100)]">
                    <span className="font-mono text-sm text-ink-muted">$</span>
                    <input disabled={closed} value={Number(counted || 0).toLocaleString('es-CO')} onChange={(e) => setCounted(e.target.value.replace(/\D/g, '').slice(0, 9))} inputMode="numeric" className="ml-1 w-full bg-transparent font-mono text-sm text-ink outline-none disabled:text-ink-muted" />
                  </div>
                </label>
                <div className={`rounded-xl px-3 py-2 text-xs ${diff === 0 ? 'bg-emerald-50 text-emerald-700' : Math.abs(diff) <= 5000 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'}`}>
                  {diff === 0 ? tt('console.cash.exact') : `${tt('console.cash.detail', { kind: diff < 0 ? tt('console.cash.short') : tt('console.cash.over'), amount: cop(Math.abs(diff)) })}${Math.abs(diff) <= 5000 ? tt('console.cash.tolerance') : tt('console.cash.review')}`}
                </div>
                <Button className="mt-auto w-full" severity={closed ? 'secondary' : 'primary'} variant={closed ? 'outlined' : 'filled'} Icon={closed ? IconCheckCircle : IconCheck}
                  onClick={() => { if (!closed) toast({ severity: 'success', title: tt('console.cash.toast.title'), description: tt('console.cash.toast.desc', { diff: `${diff < 0 ? '−' : ''}${cop(Math.abs(diff))}` }) }); setClosed((c) => !c) }}>
                  {closed ? tt('console.cash.btn.reopen') : tt('console.cash.btn.close')}
                </Button>
              </div>
            </Panel>
          </div>

          <Panel
            title={tt('console.tx.title')}
            sub={tt('console.tx.sub')}
            action={
              <label className="flex h-9 items-center gap-2 rounded-xl border border-line bg-surface px-3 focus-within:border-brand-500">
                <IconSearch size={14} className="text-ink-muted" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={tt('console.tx.search')} className="w-44 max-w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted" />
              </label>
            }
          >
            <div className="px-6 pt-3">
              <Tabs size="sm" value={txFilter} onChange={setTxFilter} tabs={[
                { key: 'todas', label: tt('console.tx.tab.all'), badge: TXS.length },
                { key: 'digital', label: tt('console.tx.tab.digital') },
                { key: 'efectivo', label: tt('console.tx.tab.cash') },
                { key: 'fiado', label: tt('console.tx.tab.credit'), badge: TXS.filter((t) => t.method === 'fiado').length },
              ]} />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b border-line-soft text-left font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                    <th className="px-6 py-3 font-medium">{tt('console.tx.th.time')}</th>
                    <th className="px-3 py-3 font-medium">{tt('console.tx.th.customer')}</th>
                    <th className="px-3 py-3 font-medium">{tt('console.tx.th.detail')}</th>
                    <th className="px-3 py-3 font-medium">{tt('console.tx.th.method')}</th>
                    <th className="px-3 py-3 text-right font-medium">{tt('console.tx.th.amount')}</th>
                    <th className="px-6 py-3 text-right font-medium">{tt('console.tx.th.status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-soft">
                  {txs.map((t) => {
                    const m = methodOf(t.method)
                    return (
                      <tr key={t.id} className="transition-colors hover:bg-canvas">
                        <td className="px-6 py-3 font-mono text-xs text-ink-muted">{t.time}<span className="ml-2 text-[10px] opacity-70">{t.id}</span></td>
                        <td className="px-3 py-3 font-medium text-ink">{t.who}</td>
                        <td className="max-w-[240px] truncate px-3 py-3 text-ink-muted">{t.items}</td>
                        <td className="px-3 py-3"><span className="inline-flex items-center gap-1.5 text-xs text-ink-soft"><span className="h-2 w-2 rounded-full" style={{ background: m.color }} />{METHOD_LABEL[m.key] ? tt(METHOD_LABEL[m.key]!) : m.label}</span></td>
                        <td className={`px-3 py-3 text-right font-mono ${t.status === 'reversada' ? 'text-ink-muted line-through' : 'text-ink'}`}>{cop(t.amount)}</td>
                        <td className="px-6 py-3 text-right"><Badge size="sm" severity={STATUS[t.status].sev}>{tt(STATUS[t.status].label)}</Badge></td>
                      </tr>
                    )
                  })}
                  {txs.length === 0 && <tr><td colSpan={6} className="px-6 py-10 text-center text-sm text-ink-muted">{tt('console.tx.empty')}</td></tr>}
                </tbody>
              </table>
            </div>
          </Panel>

          <div className="grid gap-6 lg:grid-cols-2 2xl:grid-cols-3">
            <Panel title={tt('console.debt.title')} sub={tt('console.debt.sub')}>
              <ul className="divide-y divide-line-soft">
                {DEBTS.map((d) => {
                  const pct = (d.balance / d.limit) * 100
                  const sev: Severity = pct > 100 ? 'danger' : pct > 70 || d.days > 14 ? 'warning' : 'success'
                  const sent = reminded.has(d.id)
                  return (
                    <li key={d.id} className="px-6 py-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <Avatar name={d.name} size={32} />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-ink">{d.name}</p>
                            <p className="font-mono text-[11px] text-ink-muted">{d.phone} · {d.days === 1 ? tt('console.debt.ago1') : tt('console.debt.ago', { n: d.days })}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-mono text-sm font-semibold ${pct > 100 ? 'text-rose-600' : 'text-ink'}`}>{cop(d.balance)}</p>
                          <p className="font-mono text-[10px] text-ink-muted">{tt('console.debt.limit', { amount: cop(d.limit) })}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex-1"><Progress value={pct} severity={sev} /></div>
                        <Button size="sm" variant={sent ? 'text' : 'outlined'} severity={sent ? 'success' : 'secondary'} Icon={sent ? IconCheck : IconBell} disabled={sent}
                          onClick={() => { setReminded((r) => new Set(r).add(d.id)); toast({ severity: 'success', title: tt('console.debt.toast.title', { name: d.name.split(' ')[0] }), description: tt('console.debt.toast.desc') }) }}>
                          {sent ? tt('console.debt.sent') : tt('console.debt.remind')}
                        </Button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </Panel>

            <Panel title={tt('console.stock.title')} sub={tt('console.stock.sub')}>
              <ul className="divide-y divide-line-soft">
                {STOCK.map((p) => {
                  const pct = (p.units / p.par) * 100
                  const done = ordered.has(p.id)
                  return (
                    <li key={p.id} className="flex items-center gap-4 px-6 py-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="truncate text-sm font-medium text-ink">{p.name}</p>
                          <span className="shrink-0 font-mono text-[11px] text-ink-muted">{p.units}/{p.par}</span>
                        </div>
                        <p className="mb-2 truncate text-[11px] text-ink-muted">{p.supplier} · {tt('console.stock.visit', { when: tt(p.next[0], { time: p.next[1] ?? '' }) })}</p>
                        <Progress value={pct} severity={pct < 20 ? 'danger' : pct < 50 ? 'warning' : 'primary'} />
                      </div>
                      <Button size="sm" variant={done ? 'text' : 'outlined'} severity={done ? 'success' : 'primary'} Icon={done ? IconCheck : IconPlus} disabled={done}
                        onClick={() => { setOrdered((o) => new Set(o).add(p.id)); toast({ severity: 'primary', title: tt('console.stock.toast.title'), description: `${p.par - p.units} × ${p.name} · ${p.supplier}` }) }}>
                        {done ? tt('console.stock.ordered') : `${p.par - p.units}`}
                      </Button>
                    </li>
                  )
                })}
              </ul>
            </Panel>

            <Panel title={tt('console.deliv.title')} sub={tt('console.deliv.sub')} className="lg:col-span-2 2xl:col-span-1">
              <ul className="divide-y divide-line-soft">
                {DELIVERIES.map((d) => (
                  <li key={d.id} className="flex items-center gap-4 px-6 py-4">
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${d.onRoute ? 'bg-brand-50 text-brand-600' : 'bg-ground text-ink-muted'}`}><IconBuildings size={18} /></span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{d.to}</p>
                      <p className="font-mono text-[11px] text-ink-muted">{d.id} · {d.rider}</p>
                    </div>
                    <div className="text-right">
                      <Badge size="sm" severity={d.onRoute ? 'primary' : 'secondary'} dot>{d.onRoute ? tt('console.deliv.onroute') : tt('console.deliv.preparing')}</Badge>
                      <p className="mt-1 font-mono text-[11px] text-ink-muted">{tt('console.deliv.min', { n: d.eta })}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex items-center gap-2 border-t border-line-soft bg-canvas px-6 py-3 text-xs text-ink-muted">
                <IconCalendar size={14} className="shrink-0" /> {tt('console.deliv.footer')}
              </div>
            </Panel>
          </div>
        </div>
      </div>
      <ToastStack toasts={toasts} onDismiss={(id) => setToasts((x) => x.filter((t) => t.id !== id))} />
    </div>
  )
}
