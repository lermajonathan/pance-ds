// axe-core audit of every docs page at desktop and mobile widths (WCAG 2.0–2.2 A/AA + best practices).
// Usage: pnpm build && pnpm preview --port 4173 &  node tests/axe.mjs [baseUrl]
// Fails on any violation except color-contrast, which is reported against a baseline
// (remaining nodes are disabled-state text, which WCAG 1.4.3 exempts, and colour swatch labels).
import { chromium } from 'playwright'
import { createRequire } from 'node:module'
import fs from 'node:fs'

const BASE = process.argv[2] ?? 'http://localhost:4173/en'
const CONTRAST_BASELINE = 36
const axeSrc = fs.readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8')
const pages = ['', 'colors', 'type', 'spacing', 'gradients', 'icons', 'layout', 'buttons', 'forms', 'selection', 'badges', 'feedback', 'navigation', 'overlays', 'table', 'cards', 'content', 'metrics', 'dataviz', 'dashboard', 'afterquake']
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {})
const agg = {}
for (const vp of [{ name: 'desktop', width: 1440, height: 900 }, { name: 'mobile', width: 390, height: 844 }]) {
  const page = await browser.newPage({ viewport: vp })
  for (const pg of pages) {
    await page.goto(`${BASE}/${pg}`, { waitUntil: 'networkidle' })
    await page.addScriptTag({ content: axeSrc })
    const violations = await page.evaluate(async () =>
      (await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] }, resultTypes: ['violations'] })).violations
        .map((v) => ({ id: v.id, help: v.help, nodes: v.nodes.map((n) => n.target.join(' ')) })))
    for (const v of violations) {
      agg[v.id] ??= { help: v.help, nodes: 0, where: [] }
      agg[v.id].nodes += v.nodes.length
      if (agg[v.id].where.length < 5) agg[v.id].where.push(`${vp.name}:${pg || 'home'} ${v.nodes[0]}`)
    }
  }
  await page.close()
}

// Floating panels are only in the DOM while open, so audit them in that state.
for (const vp of [{ name: 'desktop', width: 1440, height: 900 }, { name: 'mobile', width: 390, height: 844 }]) {
  const page = await browser.newPage({ viewport: vp })
  await page.goto(`${BASE}/forms`, { waitUntil: 'networkidle' })
  await page.addScriptTag({ content: axeSrc })
  for (const name of [/^Delivery date/, /^Report period/]) {
    await page.getByRole('button', { name }).first().click()
    await page.locator('[role="dialog"] [role="grid"]').first().waitFor()
    const violations = await page.evaluate(async () =>
      (await window.axe.run(document.querySelector('[role="dialog"]'), { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] }, resultTypes: ['violations'] })).violations
        .map((v) => ({ id: v.id, help: v.help, nodes: v.nodes.map((n) => n.target.join(' ')) })))
    for (const v of violations) {
      agg[v.id] ??= { help: v.help, nodes: 0, where: [] }
      agg[v.id].nodes += v.nodes.length
      if (agg[v.id].where.length < 5) agg[v.id].where.push(`${vp.name}:forms(open ${name.source}) ${v.nodes[0]}`)
    }
    await page.keyboard.press('Escape')
  }
  await page.close()
}
await browser.close()

let failed = false
if (Object.keys(agg).length === 0) console.log('No violations.')
for (const [id, a] of Object.entries(agg)) {
  const blocking = id !== 'color-contrast' || a.nodes > CONTRAST_BASELINE
  failed ||= blocking
  console.log(`${blocking ? '✗' : '•'} ${id.padEnd(28)} ${String(a.nodes).padStart(4)} nodes  ${a.help}`)
  if (blocking) a.where.forEach((w) => console.log(`    ${w}`))
}
process.exit(failed ? 1 : 0)
