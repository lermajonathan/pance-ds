// WCAG 2.2 contrast check for every token pair Pance promises, in light and dark mode.
// Pure Node (no browser): reads tokens/*.json, resolves aliases per mode and computes ratios.
//   node tests/contrast.mjs            → light is blocking (exit 1 on failure), dark is reported
//   node tests/contrast.mjs --strict   → dark is blocking too
import fs from 'node:fs'

const STRICT = process.argv.includes('--strict')
const read = (f) => JSON.parse(fs.readFileSync(new URL(`../tokens/${f}.json`, import.meta.url), 'utf8'))

/* ── Flatten tokens (value + optional dark value) ── */
const tokens = new Map()
const walk = (node, path) => {
  if (node && typeof node === 'object' && '$value' in node) {
    tokens.set(path.join('.'), { value: node.$value, dark: node.$extensions?.['pance.modes']?.dark })
    return
  }
  for (const [k, v] of Object.entries(node)) if (!k.startsWith('$') && v && typeof v === 'object') walk(v, [...path, k])
}
for (const tier of ['primitives', 'semantic', 'components']) walk(read(tier), [])

const resolve = (path, mode, depth = 0) => {
  const t = tokens.get(path)
  if (!t) throw new Error(`Unknown token ${path}`)
  if (depth > 20) throw new Error(`Alias loop at ${path}`)
  const raw = mode === 'dark' && t.dark !== undefined ? t.dark : t.value
  const m = typeof raw === 'string' && raw.match(/^\{([^}]+)\}$/)
  return m ? resolve(m[1], mode, depth + 1) : raw
}

/* ── Colour maths (sRGB relative luminance, alpha composited over the background) ── */
const parse = (c) => {
  c = String(c).trim()
  if (c.startsWith('#')) {
    const h = c.length === 4 ? [...c.slice(1)].map((x) => x + x).join('') : c.slice(1)
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).concat(h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1)
  }
  const m = c.match(/rgba?\(([^)]+)\)/)
  if (m) { const p = m[1].split(',').map(Number); return [p[0], p[1], p[2], p[3] ?? 1] }
  throw new Error(`Cannot parse colour ${c}`)
}
const over = (fg, bg) => fg.slice(0, 3).map((v, i) => v * fg[3] + bg[i] * (1 - fg[3])).concat(1)
const lum = ([r, g, b]) => {
  const ch = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b)
}
const ratio = (fgPath, bgPath, mode, base = 'color.bg.surface') => {
  const page = parse(resolve(base, mode))
  const bg = over(parse(resolve(bgPath, mode)), page)
  const fg = over(parse(resolve(fgPath, mode)), bg)
  const [a, b] = [lum(fg), lum(bg)].sort((x, y) => y - x)
  return (a + 0.05) / (b + 0.05)
}

/* ── The promises: [foreground, background, minimum, what it is] ── */
const TEXT = 4.5, UI = 3
const INTENTS = ['primary', 'secondary', 'success', 'info', 'warning', 'help', 'danger', 'contrast']
const pairs = []
const I = (i, k) => `color.intent.${i}.${k}`
for (const i of INTENTS) {
  pairs.push(
    [I(i, 'fg'), 'color.bg.surface', TEXT, `${i} text on surface (outlined badge, text button)`],
    [I(i, 'fg'), I(i, 'soft'), TEXT, `${i} text on its soft fill (soft badge/alert)`],
    [I(i, 'fg'), I(i, 'soft-hover'), TEXT, `${i} text on soft hover`],
    [I(i, 'on-solid'), I(i, 'solid'), TEXT, `text on ${i} solid fill`],
    [I(i, 'on-solid'), I(i, 'solid-hover'), TEXT, `text on ${i} solid hover`],
    [I(i, 'on-solid'), I(i, 'solid-active'), TEXT, `text on ${i} solid active`],
  )
}
for (const bg of ['page', 'surface', 'sunken']) {
  for (const fg of ['default', 'soft', 'muted']) pairs.push([`color.fg.${fg}`, `color.bg.${bg}`, TEXT, `fg.${fg} on bg.${bg}`])
  pairs.push(['color.fg.link', `color.bg.${bg}`, TEXT, `link on bg.${bg}`], ['color.fg.brand', `color.bg.${bg}`, TEXT, `brand text on bg.${bg}`])
}
pairs.push(
  ['color.fg.subtle', 'color.bg.surface', TEXT, 'fg.subtle on surface (placeholders, chart axes)'],
  ['color.fg.inverse', 'color.bg.inverse', TEXT, 'inverse text on inverse bg'],
  ['tooltip.text', 'tooltip.bg', TEXT, 'tooltip'],
  // Non-text contrast (WCAG 1.4.11): focus indicator and the boundaries that identify controls
  ['color.border.focus', 'color.bg.surface', UI, 'focus ring on surface'],
  ['color.border.focus', 'color.bg.page', UI, 'focus ring on page'],
  ['checkbox.color.border', 'color.bg.surface', UI, 'unchecked checkbox boundary'],
  ['radio.color.border', 'color.bg.surface', UI, 'unselected radio boundary'],
  ['toggle.color.track-off', 'color.bg.surface', UI, 'switch track (off)'],
  ['toggle.color.track-on', 'color.bg.surface', UI, 'switch track (on)'],
  ['toggle.color.thumb', 'toggle.color.track-on', UI, 'switch thumb on track (on)'],
  ['checkbox.color.checked', 'color.bg.surface', UI, 'checked checkbox fill'],
  ['range-slider.color.primary', 'range-slider.color.track', UI, 'slider fill vs track'],
  // Data visualisation: text on the chart surface and every categorical slot (WCAG 1.4.3 / 1.4.11)
  ['color.dataviz.ink', 'color.dataviz.surface', TEXT, 'chart title and values'],
  ['color.dataviz.ink-muted', 'color.dataviz.surface', TEXT, 'chart subtitle and legend'],
  ['color.dataviz.axis-label', 'color.dataviz.surface', TEXT, 'chart axis labels'],
  ['color.dataviz.positive', 'color.dataviz.surface', UI, 'positive series'],
  ['color.dataviz.negative', 'color.dataviz.surface', UI, 'negative series'],
  ...[1, 2, 3, 4, 5, 6, 7, 8].map((n) => [`color.dataviz.series.${n}`, 'color.dataviz.surface', UI, `chart series ${n}`]),
  // Spinner and EmptyState
  ['spinner.arc', 'color.bg.surface', UI, 'spinner arc vs surface'],
  ['spinner.arc', 'color.bg.page', UI, 'spinner arc vs page'],
  ['empty-state.title-text', 'color.bg.surface', TEXT, 'empty state title'],
  ['empty-state.description-text', 'color.bg.surface', TEXT, 'empty state description'],
  ['empty-state.icon-color', 'empty-state.icon-bg', UI, 'empty state icon on its chip'],
  // Calendar (DatePicker, DateRangePicker)
  ['calendar.day-text', 'calendar.bg', TEXT, 'calendar day number'],
  ['calendar.day-text', 'calendar.day-bg-hover', TEXT, 'calendar day number on hover'],
  ['calendar.weekday-text', 'calendar.bg', TEXT, 'calendar weekday header'],
  ['calendar.selected-text', 'calendar.selected-bg', TEXT, 'selected day number'],
  ['calendar.range-text', 'calendar.range-bg', TEXT, 'day number inside a range'],
  ['calendar.selected-bg', 'calendar.bg', UI, 'selected day marker vs calendar'],
  ['calendar.today-border', 'calendar.bg', UI, "today's ring vs calendar"],
)
for (const v of ['filled', 'outlined', 'text', 'link']) {
  for (const i of INTENTS) {
    const B = (k) => `button.color.${i}.${v}.${k}`
    if (v === 'filled') pairs.push([B('text'), B('bg'), TEXT, `button ${i} filled`], [B('text'), B('bg-hover'), TEXT, `button ${i} filled hover`])
    if (v === 'outlined') {
      pairs.push([B('text'), 'color.bg.surface', TEXT, `button ${i} outlined`])
      if (tokens.has(B('text-hover'))) pairs.push([B('text-hover'), B('bg-hover'), TEXT, `button ${i} outlined hover`])
      else pairs.push([B('text'), B('bg-hover'), TEXT, `button ${i} outlined hover`])
    }
    if (v === 'text') pairs.push([B('text'), B('bg-hover'), TEXT, `button ${i} text hover`])
    if (v === 'link') pairs.push([B('text'), 'color.bg.surface', TEXT, `button ${i} link`])
  }
}
for (const i of INTENTS) {
  const B = (k) => `badge.color.${i}.${k.replace("-", ".")}`
  pairs.push([B('soft-text'), B('soft-bg'), TEXT, `badge ${i} soft`], [B('solid-text'), B('solid-bg'), TEXT, `badge ${i} solid`], [B('outlined-text'), B('outlined-bg'), TEXT, `badge ${i} outlined`])
}

/* ── Run ── */
let blocking = 0
const report = {}
for (const mode of ['light', 'dark']) {
  const fails = []
  for (const [fg, bg, min, what] of pairs) {
    const r = ratio(fg, bg, mode)
    if (r + 1e-9 < min) fails.push({ what, r, min, fg: resolve(fg, mode), bg: resolve(bg, mode) })
  }
  report[mode] = fails
  const blocks = mode === 'light' || STRICT
  if (blocks) blocking += fails.length
  console.log(`\n${mode.toUpperCase()} · ${pairs.length - fails.length}/${pairs.length} pairs pass${fails.length && !blocks ? ' (draft mode, not blocking)' : ''}`)
  for (const f of fails) console.log(`  ${blocks ? '✗' : '•'} ${f.r.toFixed(2)}:1 < ${f.min}:1  ${f.what}  (${f.fg} on ${f.bg})`)
}
process.exit(blocking ? 1 : 0)
