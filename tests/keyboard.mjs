// Keyboard + ARIA smoke tests for the WAI-ARIA patterns in src/components.
// Run against a built preview:  pnpm build && pnpm preview --port 4173  then  node tests/keyboard.mjs [baseUrl]
import { chromium } from 'playwright'

const BASE = process.argv[2] ?? 'http://localhost:4173/en'
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {})
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const results = []
const test = async (name, fn) => {
  try { await fn(); results.push(['✓', name]) } catch (e) { results.push(['✗', name, e.message.split('\n')[0]]) }
}
const assert = (c, msg) => { if (!c) throw new Error(msg) }
// Polls until fn() returns the expected value (CSS transitions, React state) or times out.
const settle = async (fn, expected, ms = 1500) => {
  let v
  for (const end = Date.now() + ms; Date.now() < end; await page.waitForTimeout(50)) if ((v = await fn()) === expected) return v
  return v
}
const active = () => page.evaluate(() => {
  const a = document.activeElement
  return { role: a?.getAttribute('role'), tag: a?.tagName, id: a?.id, text: a?.textContent?.trim().slice(0, 40), inDialog: !!a?.closest('[role="dialog"]') }
})

await page.goto(`${BASE}/overlays`, { waitUntil: 'networkidle' })

await test('Modal: focus moves in, Tab is trapped, Escape closes and focus returns', async () => {
  const opener = page.locator('main button', { hasText: /delete|eliminar/i }).first()
  await opener.focus()
  await page.keyboard.press('Enter')
  await page.locator('[role="dialog"][aria-modal="true"]').first().waitFor()
  assert((await active()).inDialog, 'focus not inside dialog on open')
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press(i % 3 === 0 ? 'Shift+Tab' : 'Tab')
    assert((await active()).inDialog, `focus escaped the dialog after ${i + 1} Tab presses`)
  }
  await page.keyboard.press('Escape')
  assert((await settle(() => page.locator('[role="dialog"][aria-modal="true"]').count(), 0)) === 0, 'dialog still open after Escape')
  assert(await opener.evaluate((el) => el === document.activeElement), 'focus did not return to the opener')
})

await test('Modal: labelled by its title', async () => {
  const opener = page.locator('main button', { hasText: /delete|eliminar/i }).first()
  await opener.click()
  const dlg = page.locator('[role="dialog"][aria-modal="true"]').first()
  const labelledby = await dlg.getAttribute('aria-labelledby')
  assert(labelledby && (await page.locator(`[id="${labelledby}"]`).textContent())?.trim(), 'aria-labelledby missing or empty')
  await page.keyboard.press('Escape')
})

await test('DropdownMenu: ArrowDown opens on first item, arrows move, Escape returns focus', async () => {
  const trigger = page.locator('[aria-haspopup="menu"]').first()
  await trigger.focus()
  await page.keyboard.press('ArrowDown')
  await page.locator('[role="menu"]').first().waitFor()
  let a = await active()
  assert(a.role === 'menuitem', `expected menuitem focused, got ${a.role}`)
  const first = a.text
  await page.keyboard.press('ArrowDown')
  a = await active()
  assert(a.role === 'menuitem' && a.text !== first, 'ArrowDown did not move to the next item')
  await page.keyboard.press('End')
  await page.keyboard.press('Home')
  assert((await active()).text === first, 'Home did not return to the first item')
  await page.keyboard.press('Escape')
  assert((await page.locator('[role="menu"]').count()) === 0, 'menu still open')
  assert(await trigger.evaluate((el) => el === document.activeElement || el.contains(document.activeElement)), 'focus not back on trigger')
})

await test('Tooltip: shows on keyboard focus and is referenced by aria-describedby', async () => {
  const el = page.locator('.group\\/tt > [aria-describedby]').first()
  await el.focus()
  const id = await el.getAttribute('aria-describedby')
  const tip = page.locator(`[id="${id}"][role="tooltip"]`)
  const opacity = () => tip.evaluate((n) => getComputedStyle(n).opacity)
  const op = await settle(opacity, '1')
  assert(op === '1', `tooltip opacity ${op} on focus`)
  await page.keyboard.press('Escape')
  assert((await settle(opacity, '0')) === '0', 'Escape did not dismiss tooltip')
})

await page.goto(`${BASE}/forms`, { waitUntil: 'networkidle' })

await test('Select: listbox opens with Enter, arrows move active option, Enter selects', async () => {
  const btn = page.locator('button[aria-haspopup="listbox"]').first()
  const before = (await btn.textContent())?.trim()
  await btn.focus()
  await page.keyboard.press('Enter')
  const lb = page.locator('[role="listbox"]').first()
  await lb.waitFor()
  assert(await lb.evaluate((el) => el === document.activeElement), 'listbox not focused')
  const a1 = await lb.getAttribute('aria-activedescendant')
  await page.keyboard.press('ArrowDown')
  const a2 = await lb.getAttribute('aria-activedescendant')
  assert(a1 !== a2, 'aria-activedescendant did not move')
  await page.keyboard.press('Enter')
  assert((await page.locator('[role="listbox"]').count()) === 0, 'listbox still open')
  assert(await btn.evaluate((el) => el === document.activeElement), 'focus not returned to the select')
  assert((await btn.textContent())?.trim() !== before, 'value did not change')
})

await test('Field: label is programmatically associated with its control', async () => {
  const bad = await page.evaluate(() => [...document.querySelectorAll('main label[for]')].filter((l) => !document.getElementById(l.getAttribute('for'))).length)
  assert(bad === 0, `${bad} <label for> point at no element`)
})

await test('Password toggle is in the Tab order with aria-pressed', async () => {
  const t = page.locator('button[aria-pressed][aria-label*="assword"], button[aria-pressed][aria-label*="ontraseña"]').first()
  assert((await t.getAttribute('tabindex')) !== '-1', 'toggle removed from Tab order')
  await t.focus()
  await page.keyboard.press('Enter')
  assert((await t.getAttribute('aria-pressed')) === 'true', 'aria-pressed did not toggle')
})

await page.goto(`${BASE}/navigation`, { waitUntil: 'networkidle' })

await test('Tabs: roving tabindex, ArrowRight selects next, Home/End', async () => {
  const list = page.locator('[role="tablist"]').first()
  const tabs = list.locator('[role="tab"]')
  const inOrder = await tabs.evaluateAll((els) => els.filter((e) => e.tabIndex === 0).length)
  assert(inOrder === 1, `${inOrder} tabs in Tab order (expected 1)`)
  await list.locator('[aria-selected="true"]').focus()
  const start = (await active()).text
  await page.keyboard.press('ArrowRight')
  const a = await active()
  assert(a.role === 'tab' && a.text !== start, 'ArrowRight did not move focus')
  assert((await list.locator('[role="tab"]:focus').getAttribute('aria-selected')) === 'true', 'focused tab not selected')
  await page.keyboard.press('End')
  await page.keyboard.press('Home')
  const first = await list.locator('[role="tab"]:not([disabled])').first().textContent()
  assert((await active()).text === first?.trim().slice(0, 40), 'Home did not move to the first tab')
})

await test('Breadcrumb: last item has aria-current="page"', async () => {
  const n = await page.locator('nav[aria-label] [aria-current="page"]').count()
  assert(n > 0, 'no aria-current="page" found')
})

await test('Accordion: trigger exposes aria-expanded and controls a region', async () => {
  await page.goto(`${BASE}/content`, { waitUntil: 'networkidle' })
  const t = page.locator('h3 > button[aria-expanded]').first()
  await t.focus()
  const before = await t.getAttribute('aria-expanded')
  await page.keyboard.press('Enter')
  const after = await t.getAttribute('aria-expanded')
  assert(before !== after, 'aria-expanded did not change')
  if (after === 'true') {
    const region = page.locator(`[id="${await t.getAttribute('aria-controls')}"]`)
    assert((await region.getAttribute('role')) === 'region', 'controlled panel is not a labelled region')
  }
})

await page.goto(`${BASE}/selection`, { waitUntil: 'networkidle' })

await test('SegmentedControl / RadioGroup: one stop in Tab order, arrows select', async () => {
  const group = page.locator('main [role="radiogroup"]').first()
  const radios = group.locator('[role="radio"]')
  const stops = await radios.evaluateAll((els) => els.filter((e) => e.tabIndex === 0).length)
  assert(stops === 1, `${stops} radios in Tab order (expected 1)`)
  await group.locator('[aria-checked="true"]').focus()
  const start = (await active()).text
  await page.keyboard.press('ArrowRight')
  const now = await group.locator('[role="radio"]:focus')
  assert((await now.getAttribute('aria-checked')) === 'true' && (await active()).text !== start, 'arrow did not move selection')
})

await page.goto(`${BASE}/table`, { waitUntil: 'networkidle' })

await test('DataTable: sortable headers expose aria-sort and cycle with the keyboard', async () => {
  const th = page.locator('main table th[aria-sort]').first()
  assert((await th.getAttribute('aria-sort')) === 'none', 'unsorted column should be aria-sort="none"')
  const btn = th.locator('button')
  await btn.focus()
  await page.keyboard.press('Enter')
  assert((await settle(() => th.getAttribute('aria-sort'), 'ascending')) === 'ascending', 'first activation should sort ascending')
  await page.keyboard.press('Enter')
  assert((await settle(() => th.getAttribute('aria-sort'), 'descending')) === 'descending', 'second activation should sort descending')
})

await test('DataTable: row checkbox is named, toggles with Space and marks the row selected', async () => {
  const table = page.locator('main table').first()
  const box = table.locator('tbody [role="checkbox"]').first()
  assert(((await box.getAttribute('aria-label')) ?? '').length > 2, 'row checkbox has no accessible name')
  await box.focus()
  await page.keyboard.press('Space')
  assert((await settle(() => box.getAttribute('aria-checked'), 'true')) === 'true', 'Space did not check the row')
  assert((await box.locator('xpath=ancestor::tr').getAttribute('aria-selected')) === 'true', 'row is not aria-selected')
  const all = table.locator('thead [role="checkbox"]').first()
  assert((await all.getAttribute('aria-checked')) === 'mixed', 'select-all should be mixed when some rows are selected')
})

await test('Pagination: is a labelled navigation and marks the current page', async () => {
  const nav = page.locator('main nav[aria-label]').first()
  assert(await nav.locator('[aria-current="page"]').count() === 1, 'current page is not marked with aria-current')
})

await page.goto(`${BASE}/dataviz`, { waitUntil: 'networkidle' })

await test('Chart: arrow keys move through data points and announce the value', async () => {
  const group = page.locator('main figure [role="group"][tabindex="0"]').first()
  await group.focus()
  await page.keyboard.press('ArrowRight')
  const status = group.locator('xpath=following-sibling::*[@role="status"]').first()
  assert((await settle(async () => ((await status.textContent()) ?? '').trim().length > 0, true)) === true, 'no value announced after ArrowRight')
  await page.keyboard.press('Escape')
  assert((((await status.textContent()) ?? '').trim().length) === 0, 'Escape should clear the readout')
})

await test('Chart: "View as table" swaps the graphic for a real table', async () => {
  const fig = page.locator('main figure').first()
  await fig.getByRole('button', { name: /table|tabla/i }).click()
  assert((await fig.locator('table th[scope="row"]').count()) > 0, 'no data table rendered')
  assert((await fig.getByRole('button', { pressed: true }).count()) === 1, 'toggle should be aria-pressed')
})

await page.goto(`${BASE}/metrics`, { waitUntil: 'networkidle' })

await test('MetricCard: delta is spoken, including whether it is better or worse', async () => {
  const spoken = await page.locator('main article .sr-only').allTextContents()
  assert(spoken.some((t) => /(up|sube).+(better|mejor)/i.test(t)), 'no "up … better" announcement')
  assert(spoken.some((t) => /(up|sube).+(worse|peor)/i.test(t)), 'no "up … worse" announcement (error-rate style metric)')
})

await test('MetricCard: sparkline is an image with a text alternative; loading card is aria-busy', async () => {
  const unnamed = await page.locator('main svg[role="img"]:not([aria-label])').count()
  assert(unnamed === 0, `${unnamed} sparkline(s) without an accessible name`)
  assert((await page.locator('main article[aria-busy="true"]').count()) >= 1, 'loading metric card is not aria-busy')
})


/* ── Date pickers ── */
await page.goto(`${BASE}/forms`, { waitUntil: 'networkidle' })
const dateTrigger = () => page.getByRole('button', { name: /^Delivery date/ })
const dayLabel = async () => page.evaluate(() => document.activeElement?.getAttribute('aria-label'))

await test('DatePicker: Enter opens a dialog with focus on the selected day, Escape returns focus', async () => {
  await dateTrigger().scrollIntoViewIfNeeded()
  await dateTrigger().focus()
  await page.keyboard.press('Enter')
  await page.locator('[role="dialog"] [role="grid"]').first().waitFor()
  assert((await dayLabel())?.includes('October 15, 2026'), `focus not on the selected day: ${await dayLabel()}`)
  assert((await dateTrigger().getAttribute('aria-expanded')) === 'true', 'aria-expanded not true')
  await page.keyboard.press('Escape')
  assert((await settle(() => page.locator('[role="dialog"] [role="grid"]').count(), 0)) === 0, 'calendar still open')
  assert(await dateTrigger().evaluate((el) => el === document.activeElement), 'focus did not return to the trigger')
})

await test('Calendar: arrows, Home/End, PageDown move focus; Enter selects, closes and names the value', async () => {
  await dateTrigger().focus()
  await page.keyboard.press('Enter')
  await page.locator('[role="grid"]').first().waitFor()
  await page.keyboard.press('ArrowRight'); assert((await dayLabel())?.includes('October 16'), `ArrowRight → ${await dayLabel()}`)
  await page.keyboard.press('ArrowDown'); assert((await dayLabel())?.includes('October 23'), `ArrowDown → ${await dayLabel()}`)
  await page.keyboard.press('Home'); assert((await dayLabel())?.includes('Sunday, October 18'), `Home → ${await dayLabel()}`)
  await page.keyboard.press('End'); assert((await dayLabel())?.includes('Saturday, October 24'), `End → ${await dayLabel()}`)
  await page.keyboard.press('PageDown'); assert((await dayLabel())?.includes('November 24'), `PageDown → ${await dayLabel()}`)
  assert((await page.locator('[role="dialog"] [role="grid"] [tabindex="0"]').count()) === 1, 'roving tabindex must leave exactly one tab stop')
  await page.keyboard.press('Enter')
  assert((await settle(() => page.locator('[role="dialog"] [role="grid"]').count(), 0)) === 0, 'calendar did not close after selecting')
  assert(await page.getByRole('button', { name: /^Delivery date.*Nov 24, 2026/ }).count(), 'accessible name must carry the label and the chosen value')
  assert(await dateTrigger().evaluate((el) => el === document.activeElement), 'focus did not return to the trigger')
})

await test('Calendar: today is aria-current, weekday headers are abbreviations, disabled days refuse selection', async () => {
  const inline = page.locator('section', { hasText: 'Inline calendar' }).locator('[role="grid"]').first()
  assert((await inline.locator('th[abbr]').count()) === 7, 'expected 7 weekday headers with abbr')
  const cur = inline.locator('[aria-current="date"]')
  assert((await cur.count()) === 1, 'expected one aria-current="date"')
  const disabled = inline.locator('button[aria-disabled="true"]').first()
  assert(await disabled.count(), 'expected past days to be aria-disabled')
  await disabled.click({ force: true })
  assert((await inline.locator('td[aria-selected="true"]').count()) === 0, 'a disabled day became selected')
})

await test('DateRangePicker: two picks make a range, band cells are aria-selected, start/end are announced', async () => {
  const trig = page.getByRole('button', { name: /^Report period/ })
  await trig.focus()
  await page.keyboard.press('Enter')
  const grid = page.locator('[role="dialog"] [role="grid"]').first()
  await grid.waitFor()
  await page.getByRole('button', { name: /Clear/ }).click()
  await trig.focus(); await page.keyboard.press('Enter'); await grid.waitFor()
  await page.locator('[role="dialog"] button[data-date$="-06"]').first().click()
  await page.locator('[role="dialog"] button[data-date$="-09"]').first().click()
  assert((await settle(() => page.locator('[role="dialog"] [role="grid"]').count(), 0)) === 0, 'range picker did not close after the second pick')
  assert(await page.getByRole('button', { name: /^Report period.* to / }).count(), 'accessible name must carry the label and the range')
  await trig.focus(); await page.keyboard.press('Enter'); await grid.waitFor()
  assert((await page.locator('[role="dialog"] td[aria-selected="true"]').count()) === 4, 'expected 4 selected cells for a 4-day range')
  assert((await page.locator('[role="dialog"] button[aria-label$="start of range"]').count()) === 1, 'start of range not announced')
  assert((await page.locator('[role="dialog"] button[aria-label$="end of range"]').count()) === 1, 'end of range not announced')
  await page.keyboard.press('Escape')
})

/* ── Theme, Spinner, EmptyState, Link ── */
await page.goto(`${BASE}/feedback`, { waitUntil: 'networkidle' })
await page.evaluate(() => localStorage.removeItem('pance-theme'))
await page.reload({ waitUntil: 'networkidle' })

await test('ThemeToggle: radio group, arrows select, <html data-theme> follows and the choice survives a reload', async () => {
  const group = page.getByRole('radiogroup', { name: 'Theme' })
  assert((await group.getByRole('radio').count()) === 3, 'expected Light, Dark and System')
  await group.getByRole('radio', { name: 'Light' }).click()
  assert((await page.locator('html').getAttribute('data-theme')) === 'light', 'light not applied')
  await page.keyboard.press('ArrowRight')
  assert((await settle(() => page.locator('html').getAttribute('data-theme'), 'dark')) === 'dark', 'ArrowRight did not switch to dark')
  assert((await group.getByRole('radio', { name: 'Dark' }).getAttribute('aria-checked')) === 'true', 'Dark not checked')
  await page.reload({ waitUntil: 'networkidle' })
  assert((await page.locator('html').getAttribute('data-theme')) === 'dark', 'dark did not survive the reload')
  await page.getByRole('radiogroup', { name: 'Theme' }).getByRole('radio', { name: 'Light' }).click()
})

await test('Spinner is a named status; EmptyState uses a real heading', async () => {
  const sp = page.getByRole('status').filter({ hasText: 'Syncing streams' })
  assert(await sp.count(), 'spinner status with its label not found')
  assert(await page.getByRole('heading', { name: 'No streams match your search' }).count(), 'empty state heading missing')
})

await page.goto(`${BASE}/navigation`, { waitUntil: 'networkidle' })
await test('Link: external links open safely and say so', async () => {
  const l = page.locator('a[target="_blank"]', { hasText: 'operational limits' }).first()
  const any = await page.locator('a[target="_blank"][rel~="noopener"]').count()
  assert(any > 0, 'no external link with rel=noopener found')
  assert(/opens in a new tab/.test((await page.locator('a[target="_blank"] .sr-only').first().textContent()) ?? ''), 'external link does not announce the new tab')
  void l
})

await browser.close()
for (const r of results) console.log(r.join('  '))
const failed = results.filter((r) => r[0] === '✗').length
console.log(`\n${results.length - failed}/${results.length} passed`)
process.exit(failed ? 1 : 0)
