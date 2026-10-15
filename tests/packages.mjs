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
import { Button, Badge, Field, Input, Modal, Tabs, PanceProvider, IconPlus } from '@pance/react'
const html = renderToString(h(PanceProvider, { labels: { close: 'Cerrar' } },
  h(Field, { label: 'Name', hint: 'Help', required: true }, h(Input, { placeholder: 'x' })),
  h(Button, { severity: 'primary', Icon: IconPlus }, 'Create'),
  h(Badge, { severity: 'success', dot: true }, 'Flowing'),
  h(Tabs, { tabs: ['One', 'Two'], value: 'One', onChange() {}, label: 'Sections' }),
  h(Modal, { open: true, onClose() {}, title: 'Delete stream?' }, 'Body'),
))
console.log(html)
`)
const html = sh('node render.mjs')
check('components render on the server', html.includes('Create') && html.includes('role="tablist"'))
check('Field associates its label', /<label[^>]*for="([^"]+)"[\s\S]*<input[^>]*id="\1"/.test(html))
check('PanceProvider translates built-in strings', html.includes('aria-label="Cerrar"'))
check('Modal is an accessible dialog', html.includes('role="dialog"') && html.includes('aria-modal="true"'))

// Stylesheets
const css = fs.readFileSync(path.join(tmp, 'node_modules/@pance/react/dist/styles.css'), 'utf8')
check('styles.css has component utilities', css.includes('.bg-primary-solid') && css.includes('--pance-button-size-md-height'))
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
