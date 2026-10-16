// Visual regression: screenshots of every docs page (light and dark, desktop; a few on mobile)
// compared with tests/visual/baseline. Usage:
//   pnpm build && pnpm preview --port 4173 &
//   node tests/visual.mjs [baseUrl] --update [--baseline=dir]   capture screenshots as the baseline
//   node tests/visual.mjs [baseUrl] [--baseline=dir]            compare (writes tests/visual/__diff__ on failure)
// Baselines are never committed: CI builds the base commit, captures it, then compares the new build with it.
// Requests outside the site (web fonts, stock photos) are blocked so every machine renders the same fallbacks; time is frozen and motion is off.
import { chromium } from 'playwright'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import fs from 'node:fs'
import path from 'node:path'

const args = process.argv.slice(2)
const update = args.includes('--update')
const BASE = args.find((a) => a.startsWith('http')) ?? 'http://localhost:4173/en'
const only = args.find((a) => a.startsWith('--only='))?.slice(7)
const dir = path.resolve(import.meta.dirname, 'visual')
const baseline = path.resolve(args.find((a) => a.startsWith('--baseline='))?.slice(11) ?? path.join(dir, 'baseline'))
const diffDir = path.join(dir, '__diff__')
const MAX_DIFF_RATIO = 0.002 // 0.2% of pixels may differ
const PIXEL_THRESHOLD = 0.15

const pages = ['', 'colors', 'type', 'spacing', 'icons', 'layout', 'buttons', 'forms', 'selection', 'badges', 'feedback', 'navigation', 'overlays', 'table', 'cards', 'content', 'metrics', 'dataviz', 'dashboard', 'afterquake']
const mobilePages = new Set(['', 'forms', 'table', 'metrics', 'dataviz'])
const jobs = []
for (const pg of pages) for (const theme of ['light', 'dark']) {
  jobs.push({ pg, theme, vp: 'desktop', width: 1440, height: 900 })
  if (mobilePages.has(pg)) jobs.push({ pg, theme, vp: 'mobile', width: 390, height: 844 })
}
const name = (j) => `${j.pg || 'home'}-${j.theme}-${j.vp}.png`

fs.mkdirSync(baseline, { recursive: true })
fs.rmSync(diffDir, { recursive: true, force: true })
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {})
const failures = []
let checked = 0
for (const j of jobs) {
  if (only && !name(j).startsWith(only)) continue
  const ctx = await browser.newContext({ viewport: { width: j.width, height: j.height }, colorScheme: j.theme, reducedMotion: 'reduce', deviceScaleFactor: 1 })
  const origin = new URL(BASE).origin
  await ctx.route('**/*', (r) => (r.request().url().startsWith(origin) || r.request().url().startsWith('data:') ? r.continue() : r.abort()))
  const page = await ctx.newPage()
  await page.clock.install({ time: new Date('2026-10-15T12:00:00Z') })
  await page.addInitScript((t) => { try { localStorage.setItem('pance-theme', t) } catch { /* ignore */ } }, j.theme)
  await page.goto(`${BASE}/${j.pg}`, { waitUntil: 'networkidle' })
  await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}' })
  await page.evaluate(() => document.fonts.ready)
  const shot = await page.screenshot({ fullPage: true })
  await ctx.close()
  const file = path.join(baseline, name(j))
  if (update || !fs.existsSync(file)) {
    if (!update) { failures.push(`${name(j)}: no baseline (run with --update)`); continue }
    fs.writeFileSync(file, shot); checked++; continue
  }
  const a = PNG.sync.read(fs.readFileSync(file))
  const b = PNG.sync.read(shot)
  checked++
  if (a.width !== b.width || a.height !== b.height) {
    fs.mkdirSync(diffDir, { recursive: true })
    fs.writeFileSync(path.join(diffDir, name(j)), shot)
    failures.push(`${name(j)}: size ${b.width}×${b.height}, baseline ${a.width}×${a.height}`)
    continue
  }
  const out = new PNG({ width: a.width, height: a.height })
  const n = pixelmatch(a.data, b.data, out.data, a.width, a.height, { threshold: PIXEL_THRESHOLD })
  const ratio = n / (a.width * a.height)
  if (ratio > MAX_DIFF_RATIO) {
    fs.mkdirSync(diffDir, { recursive: true })
    fs.writeFileSync(path.join(diffDir, name(j)), PNG.sync.write(out))
    fs.writeFileSync(path.join(diffDir, name(j).replace('.png', '.actual.png')), shot)
    failures.push(`${name(j)}: ${(ratio * 100).toFixed(2)}% of pixels differ (limit ${MAX_DIFF_RATIO * 100}%)`)
  }
}
await browser.close()
if (update) console.log(`baseline written: ${checked} screenshots`)
else if (failures.length) { console.error(failures.join('\n')); console.error(`\n${failures.length} visual difference(s). Diffs in tests/visual/__diff__. If intended, put [visual-change] in the commit message or pull request title`); process.exit(1) }
else console.log(`visual ok (${checked} screenshots)`)
