import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  Badge, BarChart, Button, Calendar, Card, ConfirmDialog, DataTable, DivergingBarChart, DonutChart, LineChart,
  MetricCard, NotificationCenter, Progress, ScatterChart, SegmentedControl, Steps,
  type Column, type NotificationItem,
} from '../components'
import { IconStream } from '../icons'
import { useI18n, type Key } from '../i18n'
import { Page } from './showcase'
import { GALLERY_CARDS } from './gallery-cards'

/* ═══════════════════════════════════════════════════════════════════════
   Gallery of live cards (DDR-DS-030)
   Only library components and tokens. Motion comes from the components
   themselves, which already switch it off under prefers-reduced-motion.
   ═══════════════════════════════════════════════════════════════════════ */
function GalleryCard({ id, children }: { id: string; children: ReactNode }) {
  const { t } = useI18n()
  const titleId = `gallery-${id}-title`
  return (
    <Card className="flex h-full flex-col gap-4 p-6">
      <section id={`gallery-${id}`} aria-labelledby={titleId} className="flex h-full flex-col gap-4">
        <header>
          <h2 id={titleId} className="font-display text-base font-bold tracking-tight text-ink">{t(`gallery.${id}.title` as Key)}</h2>
          <p className="mt-1 text-13 leading-relaxed text-ink-muted">{t(`gallery.${id}.desc` as Key)}</p>
        </header>
        <div className="min-w-0 flex-1">{children}</div>
      </section>
    </Card>
  )
}

const localeOf = (lang: string) => (lang === 'es' ? 'es-CO' : 'en-US')

function useMonths(count = 6) {
  const { lang } = useI18n()
  return useMemo(() => {
    const f = new Intl.DateTimeFormat(localeOf(lang), { month: 'short' })
    return Array.from({ length: count }, (_, i) => f.format(new Date(2026, i, 1)))
  }, [lang, count])
}

function MetricDemo() {
  const { t, lang } = useI18n()
  const fmt = (n: number) => Math.round(n).toLocaleString(localeOf(lang))
  return (
    <MetricCard
      label={t('gallery.ui.activeStreams')}
      value={fmt(18204)} countTo={18204} format={fmt}
      Icon={IconStream} delta={12.4} trend={[8, 12, 9, 14, 13, 18, 17, 22]} trendLabel={t('gallery.ui.trendLabel')}
    />
  )
}

function LineDemo() {
  const { t } = useI18n()
  const labels = useMonths()
  return (
    <LineChart
      title={t('gallery.ui.chartVisits')} labels={labels} height={220}
      series={[
        { name: t('gallery.ui.thisYear'), data: [120, 150, 138, 190, 210, 245] },
        { name: t('gallery.ui.lastYear'), data: [100, 118, 130, 142, 160, 171] },
      ]}
    />
  )
}

function BarDemo() {
  const { t } = useI18n()
  const labels = useMonths()
  return <BarChart title={t('gallery.ui.chartOrders')} labels={labels} height={220} series={[{ name: t('gallery.ui.chartOrders'), data: [320, 410, 380, 520, 470, 610] }]} />
}

function DonutDemo() {
  const { t } = useI18n()
  return (
    <DonutChart
      title={t('gallery.ui.chartChannels')} size={160}
      slices={[
        { label: t('gallery.ui.channelWeb'), value: 54 },
        { label: t('gallery.ui.channelApp'), value: 31 },
        { label: t('gallery.ui.channelStore'), value: 15 },
      ]}
    />
  )
}

function DivergingDemo() {
  const { t } = useI18n()
  return (
    <DivergingBarChart
      title={t('gallery.ui.chartChange')}
      data={[
        { label: t('gallery.ui.regionNorth'), value: 14 },
        { label: t('gallery.ui.regionSouth'), value: -8 },
        { label: t('gallery.ui.regionEast'), value: 5 },
        { label: t('gallery.ui.regionWest'), value: -12 },
      ]}
    />
  )
}

const SCATTER = [[10, 120], [18, 135], [25, 150], [31, 148], [40, 190], [47, 205], [55, 240], [63, 255]]
function ScatterDemo() {
  const { t } = useI18n()
  return (
    <ScatterChart
      title={t('gallery.ui.chartScatter')} height={220}
      xLabel={t('gallery.ui.axisVolume')} yLabel={t('gallery.ui.axisLatency')}
      points={SCATTER.map(([x, y], i) => ({ label: `#${i + 1}`, x, y }))}
    />
  )
}

function ProgressDemo() {
  const { t } = useI18n()
  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <Progress value={72} showValue label={t('gallery.ui.progressUpload')} />
        <Progress value={91} severity="warning" showValue label={t('gallery.ui.progressQuota')} />
      </div>
      <Steps
        label={t('gallery.ui.stepFlow')} current={1}
        statusText={{ complete: t('gallery.ui.stepDone'), error: t('gallery.ui.stepError') }}
        steps={[{ label: t('gallery.ui.stepDraft') }, { label: t('gallery.ui.stepReview') }, { label: t('gallery.ui.stepLive') }]}
      />
    </div>
  )
}

type Stream = { id: string; name: string; status: 'live' | 'paused' | 'error' }
const STREAMS: Stream[] = [
  { id: '1', name: 'checkout-events', status: 'live' },
  { id: '2', name: 'inventory-sync', status: 'live' },
  { id: '3', name: 'email-queue', status: 'paused' },
  { id: '4', name: 'payments-audit', status: 'error' },
  { id: '5', name: 'search-index', status: 'live' },
]
const TONE = { live: 'primary', paused: 'secondary', error: 'danger' } as const

function TableDemo() {
  const { t } = useI18n()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | Stream['status']>('all')
  const label: Record<Stream['status'], Key> = { live: 'gallery.ui.statusLive', paused: 'gallery.ui.statusPaused', error: 'gallery.ui.statusError' }
  const rows = STREAMS.filter((r) => (status === 'all' || r.status === status) && r.name.includes(query.trim().toLowerCase()))
  const columns: Column<Stream>[] = [
    { key: 'name', header: t('gallery.ui.colName'), sortable: true, render: (r) => <span className="font-mono text-13">{r.name}</span> },
    { key: 'status', header: t('gallery.ui.colStatus'), sortable: true, render: (r) => <Badge severity={TONE[r.status]} dot>{t(label[r.status])}</Badge> },
  ]
  return (
    <div className="space-y-3">
      <SegmentedControl
        size="sm" label={t('gallery.ui.filterLabel')} value={status} onChange={setStatus}
        options={[
          { value: 'all', label: t('gallery.ui.filterAll') },
          { value: 'live', label: t('gallery.ui.statusLive') },
          { value: 'paused', label: t('gallery.ui.statusPaused') },
          { value: 'error', label: t('gallery.ui.statusError') },
        ]}
      />
      <DataTable
        caption={t('gallery.ui.tableCaption')} columns={columns} rows={rows} rowKey={(r) => r.id} rowLabel={(r) => r.name}
        density="compact" search={query} onSearchChange={setQuery} searchPlaceholder={t('gallery.ui.search')}
        empty={<p className="p-6 text-center text-sm text-ink-muted">{t('gallery.ui.noRows')}</p>}
      />
    </div>
  )
}

function CalendarDemo() {
  const { t, lang } = useI18n()
  const [value, setValue] = useState<string | null>(null)
  const shown = value ? new Intl.DateTimeFormat(localeOf(lang), { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`)) : null
  return (
    <div className="space-y-3">
      <Calendar value={value} onChange={setValue} bordered />
      <p aria-live="polite" className="text-13 text-ink-muted">{shown ? t('gallery.ui.selectedDate', { date: shown }) : t('gallery.ui.noDate')}</p>
    </div>
  )
}

function NotificationsDemo() {
  const { t } = useI18n()
  const [items, setItems] = useState<NotificationItem[]>([])
  useEffect(() => {
    setItems([
      { id: 'n1', title: t('gallery.ui.notif1'), body: t('gallery.ui.notif1Body'), time: t('gallery.ui.timeMin', { n: 5 }), read: false, severity: 'success' },
      { id: 'n2', title: t('gallery.ui.notif2'), body: t('gallery.ui.notif2Body'), time: t('gallery.ui.timeHour', { n: 1 }), read: false, severity: 'warning' },
      { id: 'n3', title: t('gallery.ui.notif3'), body: t('gallery.ui.notif3Body'), time: t('gallery.ui.timeHour', { n: 3 }), read: true, severity: 'primary' },
    ])
  }, [t])
  return (
    <NotificationCenter
      items={items} align="start"
      onRead={(id) => setItems((xs) => xs.map((n) => (n.id === id ? { ...n, read: true } : n)))}
      onReadAll={() => setItems((xs) => xs.map((n) => ({ ...n, read: true })))}
      onDismiss={(id) => setItems((xs) => xs.filter((n) => n.id !== id))}
    />
  )
}

function ConfirmDemo() {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button severity="danger" variant="outlined" onClick={() => setOpen(true)}>{t('gallery.ui.openConfirm')}</Button>
      <ConfirmDialog
        open={open} onClose={() => setOpen(false)} onConfirm={() => setOpen(false)}
        title={t('gallery.ui.confirmTitle')} description={t('gallery.ui.confirmDesc')} confirmLabel={t('gallery.ui.confirmAction')}
      />
    </>
  )
}

function LoadingDemo() {
  const { t } = useI18n()
  const [saving, setSaving] = useState(false)
  useEffect(() => {
    if (!saving) return
    const id = window.setTimeout(() => setSaving(false), 1800)
    return () => window.clearTimeout(id)
  }, [saving])
  return <Button loading={saving} onClick={() => setSaving(true)}>{saving ? t('gallery.ui.saving') : t('gallery.ui.save')}</Button>
}

const DEMOS: Record<string, () => ReactNode> = {
  metric: MetricDemo, line: LineDemo, bar: BarDemo, donut: DonutDemo, diverging: DivergingDemo, scatter: ScatterDemo,
  progress: ProgressDemo, table: TableDemo, calendar: CalendarDemo, notifications: NotificationsDemo, confirm: ConfirmDemo, loading: LoadingDemo,
}

export function GalleryPage() {
  const { t } = useI18n()
  return (
    <Page eyebrow={t('nav.group.patterns')} title={t('nav.gallery')} lead={t('gallery.lead')}>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {GALLERY_CARDS.map(({ id }) => {
          const Demo = DEMOS[id]
          return (
            <GalleryCard key={id} id={id}><Demo /></GalleryCard>
          )
        })}
      </div>
    </Page>
  )
}
