/* Extra DataTable compositions for the Data table page: the arrangements
   product teams reach for most often, all built from the public API. */
import { useMemo, useState } from 'react'
import { Avatar, Badge, Button, Card, DataTable, DropdownMenu, IconButton, SegmentedControl, type Column, type Severity } from '../components'
import { IconCheckCircle, IconDots, IconDownload, IconEdit, IconPlus, IconTrash, IconUsers } from '../icons'
import { useI18n, type Key } from '../i18n'
import { photo } from './media'

/* ── 1. Team members: people, roles, filters, bulk actions ─────────────── */
type Role = 'owner' | 'admin' | 'editor' | 'viewer'
type MemberStatus = 'active' | 'invited' | 'suspended'
type Member = { id: string; name: string; email: string; avatar?: string; role: Role; status: MemberStatus; lastActive: Key; mfa: boolean }

const MEMBERS: Member[] = [
  { id: 'u1', name: 'Ines Halvorsen', email: 'ines@river-labs.io', avatar: 'photo-1438761681033-6461ffad8d80', role: 'owner', status: 'active', lastActive: 'table.upd.min2', mfa: true },
  { id: 'u2', name: 'Devon Achebe', email: 'devon@river-labs.io', avatar: 'photo-1500648767791-00dcc994a43e', role: 'admin', status: 'active', lastActive: 'table.upd.min9', mfa: true },
  { id: 'u3', name: 'Priya Ramanathan', email: 'priya@river-labs.io', avatar: 'photo-1544005313-94ddf0286df2', role: 'editor', status: 'active', lastActive: 'table.upd.hr1', mfa: false },
  { id: 'u4', name: 'Kai Fenwick', email: 'kai@river-labs.io', avatar: 'photo-1507003211169-0a1dd7228f2d', role: 'editor', status: 'suspended', lastActive: 'table.upd.days2', mfa: true },
  { id: 'u5', name: 'Sofia Marchetti', email: 'sofia@river-labs.io', avatar: 'photo-1534528741775-53994a69daeb', role: 'viewer', status: 'active', lastActive: 'table.upd.hr5', mfa: false },
  { id: 'u6', name: 'Omar Haddad', email: 'omar@partner.dev', role: 'viewer', status: 'invited', lastActive: 'table.team.never', mfa: false },
  { id: 'u7', name: 'Lena Björk', email: 'lena@river-labs.io', avatar: 'photo-1517841905240-472988babdf9', role: 'admin', status: 'active', lastActive: 'table.upd.yesterday', mfa: true },
]
const ROLE_TONE: Record<Role, Severity> = { owner: 'primary', admin: 'help', editor: 'info', viewer: 'secondary' }
const STATUS_TONE: Record<MemberStatus, Severity> = { active: 'success', invited: 'warning', suspended: 'danger' }

export function TeamTable() {
  const { t } = useI18n()
  const [filter, setFilter] = useState<'all' | MemberStatus>('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const q = search.trim().toLowerCase()
  const rows = MEMBERS.filter((m) => (filter === 'all' || m.status === filter) && (!q || m.name.toLowerCase().includes(q) || m.email.includes(q)))
  const columns: Column<Member>[] = [
    {
      key: 'name', header: t('table.team.member'), sortable: true,
      render: (m) => (
        <div className="flex items-center gap-3">
          <Avatar name={m.name} src={m.avatar ? photo(m.avatar) : undefined} size={32} decorative />
          <div className="flex min-w-0 flex-col">
            <span className="font-medium text-ink">{m.name}</span>
            <span className="truncate text-xs text-ink-muted">{m.email}</span>
          </div>
        </div>
      ),
    },
    { key: 'role', header: t('table.team.role'), sortable: true, sortValue: (m) => ['owner', 'admin', 'editor', 'viewer'].indexOf(m.role), render: (m) => <Badge severity={ROLE_TONE[m.role]} variant="outlined">{t(`table.team.role.${m.role}` as Key)}</Badge> },
    { key: 'status', header: t('table.col.status'), render: (m) => <Badge severity={STATUS_TONE[m.status]} dot>{t(`table.team.status.${m.status}` as Key)}</Badge> },
    {
      key: 'mfa', header: t('table.team.mfa'), hideOnMobile: true,
      render: (m) => m.mfa
        ? <span className="inline-flex items-center gap-1.5 text-success-fg"><IconCheckCircle aria-hidden className="size-4" />{t('table.team.mfaOn')}</span>
        : <span className="text-ink-muted">{t('table.team.mfaOff')}</span>,
    },
    { key: 'lastActive', header: t('table.team.lastActive'), render: (m) => <span className="text-ink-muted">{t(m.lastActive)}</span> },
  ]
  const counts = { all: MEMBERS.length, active: 0, invited: 0, suspended: 0 }
  MEMBERS.forEach((m) => counts[m.status]++)
  return (
    <div className="space-y-3">
      <SegmentedControl
        label={t('table.team.filter')}
        size="sm"
        value={filter}
        onChange={(v) => { setFilter(v); setSelected(new Set()) }}
        options={(['all', 'active', 'invited', 'suspended'] as const).map((k) => ({ value: k, label: `${t(`table.team.tab.${k}` as Key)} · ${counts[k]}` }))}
      />
      <DataTable
        caption={t('table.team.caption')}
        columns={columns}
        rows={rows}
        rowKey={(m) => m.id}
        rowLabel={(m) => m.name}
        selectable
        selected={selected}
        onSelectedChange={setSelected}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder={t('table.team.search')}
        rowActions={(m) => (
          <DropdownMenu
            align="end"
            label={t('table.actionsFor', { id: m.name })}
            trigger={<IconButton Icon={IconDots} label={t('table.actionsFor', { id: m.name })} />}
            items={[
              { label: t('table.team.changeRole'), Icon: IconEdit },
              { label: m.status === 'invited' ? t('table.team.resend') : t('table.team.resetMfa'), Icon: IconUsers },
              { type: 'separator' },
              { label: t('table.team.remove'), Icon: IconTrash, danger: true },
            ]}
          />
        )}
        actions={selected.size > 0 ? (
          <>
            <Button size="sm" severity="secondary" variant="outlined" Icon={IconEdit}>{t('table.team.changeRole')}</Button>
            <Button size="sm" severity="danger" variant="outlined" Icon={IconTrash}>{t('table.team.removeN', { n: selected.size })}</Button>
          </>
        ) : (
          <Button size="sm" Icon={IconPlus}>{t('table.team.invite')}</Button>
        )}
      />
    </div>
  )
}

/* ── 2. Invoices: compact, money columns, summary strip ────────────────── */
type InvoiceStatus = 'paid' | 'open' | 'overdue' | 'draft'
type Invoice = { id: string; customer: string; issued: string; due: string; amount: number; status: InvoiceStatus }
const INVOICES: Invoice[] = [
  { id: 'INV-2026-0142', customer: 'Northwind Logistics', issued: '2026-10-01', due: '2026-10-31', amount: 12480, status: 'open' },
  { id: 'INV-2026-0141', customer: 'Atlas Health', issued: '2026-09-28', due: '2026-10-12', amount: 4320.5, status: 'overdue' },
  { id: 'INV-2026-0140', customer: 'Quanta Retail', issued: '2026-09-25', due: '2026-10-25', amount: 28900, status: 'paid' },
  { id: 'INV-2026-0139', customer: 'Helios Energy', issued: '2026-09-20', due: '2026-10-20', amount: 7640, status: 'paid' },
  { id: 'INV-2026-0138', customer: 'Brightline Media', issued: '2026-09-18', due: '2026-10-02', amount: 1980, status: 'overdue' },
  { id: 'INV-2026-0137', customer: 'Cobalt Fintech', issued: '2026-09-15', due: '2026-10-15', amount: 15200, status: 'paid' },
  { id: 'INV-2026-0136', customer: 'Verde Foods', issued: '2026-09-12', due: '2026-10-12', amount: 3150, status: 'paid' },
  { id: 'INV-2026-0135', customer: 'Orbit Mobility', issued: '2026-10-05', due: '2026-11-04', amount: 9800, status: 'draft' },
  { id: 'INV-2026-0134', customer: 'Lumen Studio', issued: '2026-09-08', due: '2026-10-08', amount: 2240, status: 'paid' },
]
const INV_TONE: Record<InvoiceStatus, Severity> = { paid: 'success', open: 'info', overdue: 'danger', draft: 'secondary' }

export function InvoicesTable() {
  const { t, lang } = useI18n()
  const locale = lang === 'es' ? 'es-419' : 'en-US'
  const money = useMemo(() => new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }), [locale])
  const date = useMemo(() => new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }), [locale])
  const fmtDate = (iso: string) => date.format(new Date(`${iso}T00:00:00Z`))
  const columns: Column<Invoice>[] = [
    { key: 'id', header: t('table.inv.number'), render: (r) => <span className="font-mono text-13 font-medium text-ink">{r.id}</span> },
    { key: 'customer', header: t('table.inv.customer'), sortable: true },
    { key: 'issued', header: t('table.inv.issued'), sortable: true, hideOnMobile: true, render: (r) => <span className="tabular-nums">{fmtDate(r.issued)}</span> },
    { key: 'due', header: t('table.inv.due'), sortable: true, render: (r) => <span className={`tabular-nums ${r.status === 'overdue' ? 'font-medium text-danger-fg' : ''}`}>{fmtDate(r.due)}</span> },
    { key: 'status', header: t('table.col.status'), render: (r) => <Badge severity={INV_TONE[r.status]} size="sm">{t(`table.inv.status.${r.status}` as Key)}</Badge> },
    { key: 'amount', header: t('table.inv.amount'), align: 'end', sortable: true, render: (r) => <span className="font-mono text-13 font-semibold tabular-nums text-ink">{money.format(r.amount)}</span> },
  ]
  const sum = (s?: InvoiceStatus) => INVOICES.filter((r) => r.status !== 'draft' && (!s || r.status === s)).reduce((a, r) => a + r.amount, 0)
  const summary = [
    { label: t('table.inv.total'), value: sum(), tone: 'text-ink' },
    { label: t('table.inv.status.paid'), value: sum('paid'), tone: 'text-success-fg' },
    { label: t('table.inv.status.open'), value: sum('open'), tone: 'text-info-fg' },
    { label: t('table.inv.status.overdue'), value: sum('overdue'), tone: 'text-danger-fg' },
  ]
  return (
    <div className="space-y-3">
      <DataTable
        caption={t('table.inv.caption')}
        columns={columns}
        rows={INVOICES}
        rowKey={(r) => r.id}
        rowLabel={(r) => r.id}
        density="compact"
        pageSize={6}
        actions={<Button size="sm" severity="secondary" variant="outlined" Icon={IconDownload}>{t('table.inv.export')}</Button>}
      />
      <Card className="grid grid-cols-2 divide-line-soft sm:grid-cols-4 sm:divide-x">
        {summary.map((s) => (
          <div key={s.label} className="px-5 py-4">
            <p className="font-mono text-11 uppercase tracking-wider text-ink-muted">{s.label}</p>
            <p className={`mt-1 font-display text-lg font-bold tabular-nums ${s.tone}`}>{money.format(s.value)}</p>
          </div>
        ))}
      </Card>
    </div>
  )
}

/* ── 3. Log: sticky header inside a fixed-height scroll area ───────────── */
type Level = 'info' | 'warn' | 'error' | 'debug'
type LogRow = { id: string; ts: string; level: Level; service: string; message: string }
const LEVEL_TONE: Record<Level, Severity> = { info: 'info', warn: 'warning', error: 'danger', debug: 'secondary' }
const SERVICES = ['api-gateway', 'payments', 'identity', 'ingest', 'search']
const MESSAGES: Record<Level, string[]> = {
  info: ['Consumer group rebalanced (8 partitions)', 'Schema checkout.v2 registered', 'Snapshot written to cold storage', 'Health check passed'],
  warn: ['Lag above 2s on partition 3', 'Retry 2/5 for webhook delivery', 'Disk usage at 81%'],
  error: ['Webhook endpoint returned 503', 'Schema mismatch: field "amount"'],
  debug: ['Offset committed at 1,204,991', 'Cache warm-up completed in 412 ms'],
}
const LOGS: LogRow[] = Array.from({ length: 28 }, (_, i) => {
  const level: Level = i % 9 === 4 ? 'error' : i % 5 === 2 ? 'warn' : i % 7 === 6 ? 'debug' : 'info'
  const pool = MESSAGES[level]
  const sec = 59 - ((i * 7) % 60)
  return { id: `log-${i}`, ts: `14:${String(32 - Math.floor(i / 3)).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String((i * 137) % 1000).padStart(3, '0')}`, level, service: SERVICES[i % SERVICES.length], message: pool[i % pool.length] }
})

export function LogTable() {
  const { t } = useI18n()
  const [level, setLevel] = useState<'all' | Level>('all')
  const rows = level === 'all' ? LOGS : LOGS.filter((r) => r.level === level)
  const columns: Column<LogRow>[] = [
    { key: 'ts', header: t('table.log.time'), render: (r) => <span className="font-mono text-xs text-ink-muted tabular-nums">{r.ts}</span> },
    { key: 'level', header: t('table.log.level'), render: (r) => <Badge severity={LEVEL_TONE[r.level]} size="sm" rounded={false}>{r.level.toUpperCase()}</Badge> },
    { key: 'service', header: t('table.log.service'), render: (r) => <span className="font-mono text-xs">{r.service}</span> },
    { key: 'message', header: t('table.log.message'), render: (r) => <span className="text-ink-soft">{r.message}</span> },
  ]
  return (
    <div className="max-h-[420px]">
      <DataTable
        caption={t('table.log.caption')}
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        rowLabel={(r) => `${r.ts} ${r.message}`}
        density="compact"
        actions={
          <SegmentedControl
            label={t('table.log.level')}
            size="sm"
            value={level}
            onChange={setLevel}
            options={(['all', 'error', 'warn', 'info'] as const).map((v) => ({ value: v, label: v === 'all' ? t('table.team.tab.all') : v.toUpperCase() }))}
          />
        }
      />
    </div>
  )
}
