// Smoke test for the publishable packages, as a consumer would install them.
// 1. npm pack @pance/tokens and @pance/react  2. install both tarballs in a fresh project
// 3. server-render components, check the stylesheet and the token exports, and type-check a consumer file.
// Run after `pnpm build:packages`.
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pance-consumer-'))
const sh = (cmd, cwd = tmp) => execSync(cmd, { cwd, stdio: ['ignore', 'pipe', 'inherit'] }).toString().trim()
const checks = []
const check = (name, ok, detail = '') => { checks.push([ok ? '✓' : '✗', name, detail]); }

const tarballs = ['tokens', 'react'].map((p) => path.join(tmp, sh(`npm pack --silent --pack-destination ${tmp}`, path.join(root, 'packages', p)).split('\n').pop()))
fs.writeFileSync(path.join(tmp, 'package.json'), JSON.stringify({ name: 'consumer', private: true, type: 'module' }))
sh(`npm install --silent --no-audit --no-fund ${tarballs.join(' ')} react@19 react-dom@19 typescript@5 @types/react@19 @types/react-dom@19`)

// Server render
fs.writeFileSync(path.join(tmp, 'render.mjs'), `
import { createElement as h } from 'react'
import { renderToString } from 'react-dom/server'
import { Button, Badge, Field, Input, Modal, Tabs, PanceProvider, IconPlus, MetricCard, Delta, Sparkline, DataTable, Pagination, LineChart, BarChart, DonutChart, DatePicker, Calendar, RangeCalendar, ScatterChart, Meter, NotificationCenter, ConfirmDialog, Spinner, EmptyState, Link, ThemeToggle, ThemeProvider, themeInitScript } from '@pance/react'
const html = renderToString(h(PanceProvider, { labels: { close: 'Cerrar' } },
  h(Field, { label: 'Name', hint: 'Help', required: true }, h(Input, { placeholder: 'x' })),
  h(Button, { severity: 'primary', Icon: IconPlus }, 'Create'),
  h(Badge, { severity: 'success', dot: true }, 'Flowing'),
  h(Tabs, { tabs: ['One', 'Two'], value: 'One', onChange() {}, label: 'Sections' }),
  h(Modal, { open: true, onClose() {}, title: 'Delete stream?' }, 'Body'),
  h(MetricCard, { label: 'Error rate', value: '0.42', unit: '%', delta: 18.6, upIsGood: false, trend: [4, 5, 6, 9] }),
  h(DataTable, { caption: 'Streams', columns: [{ key: 'name', header: 'Name', sortable: true }, { key: 'region', header: 'Region' }], rows: [{ name: 'checkout', region: 'us-east-1' }, { name: 'auth', region: 'eu-west-2' }], rowKey: (r) => r.name, rowLabel: (r) => r.name, selectable: true }),
  h(LineChart, { title: 'Throughput', labels: ['Jan', 'Feb', 'Mar'], series: [{ name: 'US', data: [1, 2, 3] }, { name: 'EU', data: [2, 2, 4] }] }),
  h(BarChart, { title: 'Events', labels: ['Q1', 'Q2'], series: [{ name: 'A', data: [3, 4] }, { name: 'B', data: [1, 2] }], mode: 'stacked' }),
  h(DonutChart, { title: 'Types', slices: [{ label: 'REST', value: 3 }, { label: 'gRPC', value: 1 }] }),
  h(DatePicker, { value: '2026-10-15', onChange() {}, label: 'Due' }),
  h(PanceProvider, { labels: { locale: 'es-CO', firstDayOfWeek: 1 } }, h(Calendar, { value: '2026-10-15', onChange() {} })),
  h(Spinner, { size: 'sm' }),
  h(EmptyState, { Icon: IconPlus, title: 'Nothing yet', description: 'Create one.', action: h(Button, null, 'New') }),
  h(Link, { href: 'https://example.com', external: true }, 'Docs'),
  h(ThemeProvider, null, h(ThemeToggle)),
  h(ScatterChart, { title: 'Latency vs throughput', xLabel: 'Throughput', yLabel: 'Latency', points: [{ label: 'a', x: 1, y: 2 }, { label: 'b', x: 3, y: 1 }] }),
  h(Meter, { label: 'Storage', value: 91, max: 100, unit: '%', severity: 'danger' }),
  h(NotificationCenter, { items: [{ id: '1', title: 'Deploy done', read: false, severity: 'success' }], onRead() {} }),
  h(ConfirmDialog, { open: true, onClose() {}, onConfirm() {}, title: 'Delete?', confirmLabel: 'Delete', requireText: 'checkout' }),
  h(DataTable, { caption: 'Events', columns: [{ key: 'name', header: 'Name' }, { key: 'region', header: 'Region' }], rows: [{ name: 'x', region: 'y' }], rowKey: (r) => r.name, rowLabel: (r) => r.name, renderExpanded: () => 'Detail', columnToggle: true }),
  h(RangeCalendar, { value: { start: '2026-10-05', end: '2026-10-08' }, onChange() {}, months: 2 }),
))
console.log(html)
`)
const html = sh('node render.mjs')
check('components render on the server', html.includes('Create') && html.includes('role="tablist"'))
check('Field associates its label', /<label[^>]*for="([^"]+)"[\s\S]*<input[^>]*id="\1"/.test(html))
check('MetricCard speaks its delta', html.includes('Up 18.6%') && html.includes('worse'))
check('DataTable renders a labelled, sortable table', html.includes('aria-sort="none"') && html.includes('role="checkbox"') && html.includes('scope="row"'))
check('Charts are focusable groups with a table alternative', html.includes('role="group"') && html.includes('View as table'))
check('DatePicker is a dialog button named by its label and value', html.includes('aria-haspopup="dialog"') && html.includes('Due: Oct 15, 2026'))
check('Calendar is a labelled grid with localised month names', html.includes('role="grid"') && html.includes('octubre de 2026') && html.includes('abbr="lunes"'))
check('RangeCalendar announces both ends of the range', html.includes('start of range') && html.includes('end of range') && html.includes('October 2026') && html.includes('November 2026'))
check('Spinner is a labelled status', html.includes('role="status"') && html.includes('>Loading<'))
check('EmptyState renders a heading', html.includes('<h3') && html.includes('Nothing yet'))
check('external Link is safe and announced', html.includes('rel="noopener noreferrer"') && html.includes('opens in a new tab'))
check('ThemeToggle renders a radio group', html.includes('aria-label="Theme"') && html.includes('Dark') && html.includes('System'))
check('themeInitScript is exported', /themeInitScript/.test(fs.readFileSync(path.join(tmp, 'node_modules/@pance/react/dist/index.js'), 'utf8')))
check('ScatterChart is a focusable group with a table alternative', html.includes('Latency vs throughput') && html.includes('View as table'))
check('Meter exposes role=meter with status text', html.includes('role="meter"') && html.includes('aria-valuetext="91% / 100%, Critical"'))
check('NotificationCenter bell announces unread count', html.includes('Notifications, 1 unread'))
check('ConfirmDialog asks for the phrase', html.includes('Type checkout to confirm') && html.includes('disabled'))
check('DataTable has expand and Columns controls', html.includes('Show details for x') && html.includes('>Columns<'))
check('PanceProvider translates built-in strings', html.includes('aria-label="Cerrar"'))
check('Modal is an accessible dialog', html.includes('role="dialog"') && html.includes('aria-modal="true"'))

// Stylesheets
const css = fs.readFileSync(path.join(tmp, 'node_modules/@pance/react/dist/styles.css'), 'utf8')
check('styles.css has component utilities', css.includes('.bg-primary-solid') && css.includes('--pance-button-size-md-height'))
check('styles.css has data-viz tokens and chart utilities', css.includes('--pance-color-dataviz-series-3') && css.includes('--pance-sparkline-width-md'))
check('styles.css has spinner and empty-state tokens', css.includes('--pance-spinner-size-md') && css.includes('--pance-empty-state-icon-box'))
check('styles.css has meter tokens', css.includes('--pance-meter-height') && css.includes('--pance-meter-color-danger'))
check('styles.css has calendar tokens', css.includes('--pance-calendar-day-size') && css.includes('--pance-calendar-selected-bg'))
check('styles.css has tokens and dark mode', css.includes('--pance-color-intent-primary-solid') && css.includes("data-theme"))
check('tailwind.css points Tailwind at the package', fs.readFileSync(path.join(tmp, 'node_modules/@pance/react/dist/tailwind.css'), 'utf8').includes('@source "./index.js"'))

// Tokens package
const tok = sh(`node -e "import('@pance/tokens').then(m => console.log(m.tokens.color.intent.primary.solid, m.default === m.tokens))"`)
check('@pance/tokens exports resolved values', /^#[0-9a-f]{6} true$/i.test(tok), tok)
for (const f of ['tokens.css', 'theme.css', 'tokens.json', 'json/semantic.json']) check(`@pance/tokens/${f} resolves`, fs.existsSync(path.join(tmp, 'node_modules/@pance/tokens/dist', f)))

// Types, as a TypeScript consumer sees them
fs.writeFileSync(path.join(tmp, 'app.tsx'), `
import { Button, Field, Input, Select, type Severity, type PanceLabels } from '@pance/react'
import { tokens } from '@pance/tokens'
const s: Severity = 'danger'
const l: Partial<PanceLabels> = { close: 'Cerrar' }
export const App = () => (<Field label="Region"><Select label="Region" options={['a', 'b']} value="a" onChange={() => {}} /></Field>)
export const B = () => <Button severity={s}>{l.close}{tokens.color.intent.primary.solid}</Button>
// @ts-expect-error unknown severity must be rejected
export const C = () => <Button severity="purple">x</Button>
export const D = () => <Input inputSize="lg" />
`)
fs.writeFileSync(path.join(tmp, 'tsconfig.json'), JSON.stringify({ compilerOptions: { strict: true, jsx: 'react-jsx', module: 'esnext', moduleResolution: 'bundler', target: 'es2022', noEmit: true, skipLibCheck: false, types: [] }, files: ['app.tsx'] }))
let typeErr = ''
try { sh('npx tsc -p tsconfig.json') } catch (e) { typeErr = e.stdout?.toString() || String(e) }
check('types work for a TypeScript consumer', !typeErr, typeErr.slice(0, 400))

for (const c of checks) console.log(c.filter(Boolean).join('  '))
const failed = checks.filter((c) => c[0] === '✗').length
console.log(`\n${checks.length - failed}/${checks.length} package checks passed`)
fs.rmSync(tmp, { recursive: true, force: true })
process.exit(failed ? 1 : 0)
