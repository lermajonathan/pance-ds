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
    tokens.set(path.join('.'), { value: node.$value, dark: node.$extensions?.['pance.modes']?.dark, deprecated: node.$deprecated })
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
  ['color.dataviz.diverging-negative', 'color.dataviz.surface', UI, 'diverging bar, below the baseline (orange pole)'],
  ...['good', 'warning', 'critical'].map((k) => [`color.dataviz.status.${k}`, 'color.dataviz.surface', UI, `chart status colour: ${k}`]),
  // Spinner and EmptyState
  ['spinner.arc', 'color.bg.surface', UI, 'spinner arc vs surface'],
  ['spinner.arc', 'color.bg.page', UI, 'spinner arc vs page'],
  ['empty-state.title-text', 'color.bg.surface', TEXT, 'empty state title'],
  ['empty-state.description-text', 'color.bg.surface', TEXT, 'empty state description'],
  ['empty-state.icon-color', 'empty-state.icon-bg', UI, 'empty state icon on its chip'],
  // Meter
  ...['default', 'warning', 'danger'].map((k) => [`meter.color.${k}`, 'meter.color.track', UI, `meter ${k} fill vs track`]),
  ...['default', 'warning', 'danger'].map((k) => [`meter.color.${k}`, 'color.bg.surface', UI, `meter ${k} fill vs surface`]),
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

/* ── Gradients that carry text: every stop, composited over the base layer, must keep 4.5:1 with the text colours ── */
const GRADIENT_TEXT = { hero: ['color.fg.default', 'color.fg.soft'], 'surface-soft': ['color.fg.default', 'color.fg.soft'] }
const stopColour = (c, mode) => {
  if (c === 'transparent') return null
  const m = String(c).match(/^\{([^}]+)\}$/)
  return parse(m ? resolve(m[1], mode) : c)
}
const gradientChecks = (mode) => {
  const out = []
  for (const [name, texts] of Object.entries(GRADIENT_TEXT)) {
    const t = tokens.get(`gradient.${name}`)
    const layers = mode === 'dark' && t.dark !== undefined ? t.dark : t.value
    const bases = layers.at(-1).stops.map((st) => stopColour(st.color, mode)).filter(Boolean)
    for (const layer of layers) for (const st of layer.stops) {
      const c = stopColour(st.color, mode)
      if (!c) continue
      for (const base of bases) {
        const bg = over([c[0], c[1], c[2], (st.opacity ?? 1) * c[3]], base)
        for (const text of texts) {
          const fg = over(parse(resolve(text, mode)), bg)
          const [hi, lo] = [lum(fg), lum(bg)].sort((x, y) => y - x)
          out.push({ r: (hi + 0.05) / (lo + 0.05), what: `${text} on gradient.${name} (${st.position} stop)` })
        }
      }
    }
  }
  return out
}

/* ── Perceptual colour (OKLab): lightness for the data palettes, distance for "does it read as X" ── */
const oklab = ([r, g, b]) => {
  const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }
  const [R, G, B] = [r, g, b].map(lin)
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B)
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B)
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B)
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s]
}
const oklabLightness = (rgb) => oklab(rgb)[0]
const distance = (a, b) => 100 * Math.hypot(...oklab(a).map((v, i) => v - oklab(b)[i]))

/* ── Categorical data colours in dark mode must sit in one lightness band (DDR-DS-027) ──
   Perceptual lightness (OKLCH L) is what keeps eight series reading as equals on the dark chart surface. */
const DARK_BAND = { min: 0.48, max: 0.67 }
const SERIES_SLOTS = [1, 2, 3, 4, 5, 6, 7, 8]
const lightnessBandChecks = (mode) => {
  if (mode !== 'dark') return []
  return SERIES_SLOTS.map((n) => {
    const path = `color.dataviz.series.${n}`
    const L = oklabLightness(parse(resolve(path, mode)))
    return { L, ok: L >= DARK_BAND.min && L <= DARK_BAND.max, what: `${path} lightness in the dark band (OKLCH L ${DARK_BAND.min}–${DARK_BAND.max})`, colour: resolve(path, mode) }
  })
}

/* ── Diverging data ramp (DDR-DS-027): aqua ↔ neutral ↔ orange ──
   Steps 1–5 run from the aqua pole to the centre, step 6 is the neutral centre, steps 7–11 run from the centre
   to the warm pole. Lightness must fall monotonically away from the centre, both arms must match each other
   (so the ramp is not louder on one side), and the warm pole must not read as the danger colour. */
const DIVERGING = { steps: Array.from({ length: 11 }, (_, i) => `color.viz.diverging.${i + 1}`), centre: 5, mirrorTolerance: 0.06, minDistanceFromDanger: 8 }
const divergingChecks = (mode) => {
  if (mode !== 'light') return []
  const colours = DIVERGING.steps.map((p) => parse(resolve(p, mode)))
  const L = colours.map((c) => oklab(c)[0])
  const c = DIVERGING.centre
  const out = []
  for (let i = 0; i < c; i++) out.push({ ok: L[i] < L[i + 1], what: `diverging.${i + 1} is darker than diverging.${i + 2} (cool arm gets lighter toward the centre)` })
  for (let i = c; i < L.length - 1; i++) out.push({ ok: L[i] > L[i + 1], what: `diverging.${i + 1} is lighter than diverging.${i + 2} (warm arm gets darker away from the centre)` })
  for (let k = 1; k <= c; k++) {
    const gap = Math.abs(L[c - k] - L[c + k])
    out.push({ ok: gap <= DIVERGING.mirrorTolerance, what: `diverging.${c - k + 1} and diverging.${c + k + 1} match in lightness (Δ ${gap.toFixed(3)} ≤ ${DIVERGING.mirrorTolerance})` })
  }
  const pole = colours.at(-1), danger = parse(resolve('color.intent.danger.solid', mode))
  const d = distance(pole, danger)
  out.push({ ok: d >= DIVERGING.minDistanceFromDanger, what: `warm pole is ≥ ${DIVERGING.minDistanceFromDanger} ΔE from the danger colour (is ${d.toFixed(1)})` })
  return out
}

/* ── One status-colour system (DDR-DS-028) ──
   The old data-viz status tokens (color.viz.status.*) are deprecated aliases of the intent colours, so a chart and a
   button never disagree about what "good", "warning" or "critical" look like. "serious" has no intent and keeps its value. */
const STATUS_ALIASES = [
  ['color.viz.status.good.solid', 'color.intent.success.fg'], ['color.viz.status.good.soft', 'color.intent.success.soft'],
  ['color.viz.status.warning.solid', 'color.intent.warning.fg'], ['color.viz.status.warning.soft', 'color.intent.warning.soft'],
  ['color.viz.status.critical.solid', 'color.intent.danger.fg'], ['color.viz.status.critical.soft', 'color.intent.danger.soft'],
]
const statusChecks = (mode) => {
  const out = []
  for (const [old, intent] of STATUS_ALIASES) {
    const alias = typeof tokens.get(old)?.value === 'string' && /^\{[^}]+\}$/.test(tokens.get(old).value)
    out.push({ ok: alias && resolve(old, mode) === resolve(intent, mode), what: `${old} is an alias of ${intent}` })
  }
  for (const [path, t] of tokens) if (path.startsWith('color.viz.status.')) out.push({ ok: Boolean(t.deprecated), what: `${path} is marked $deprecated` })
  return out
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
  const gc = gradientChecks(mode)
  for (const g of gc) if (g.r + 1e-9 < TEXT) fails.push({ what: g.what, r: g.r, min: TEXT, fg: 'text', bg: 'gradient' })
  const bands = lightnessBandChecks(mode)
  for (const b of bands) if (!b.ok) fails.push({ what: b.what, r: b.L, min: DARK_BAND.min, fg: b.colour, bg: `L ${b.L.toFixed(3)}`, band: true })
  const diverging = divergingChecks(mode)
  for (const d of diverging) if (!d.ok) fails.push({ what: d.what, r: 0, min: 0, fg: '', bg: 'diverging', band: true })
  const status = statusChecks(mode)
  for (const c of status) if (!c.ok) fails.push({ what: c.what, r: 0, min: 0, fg: '', bg: 'status', band: true })
  const total = pairs.length + gc.length + bands.length + diverging.length + status.length
  report[mode] = fails
  const blocks = mode === 'light' || STRICT
  if (blocks) blocking += fails.length
  console.log(`\n${mode.toUpperCase()} · ${total - fails.length}/${total} pairs pass${fails.length && !blocks ? ' (draft mode, not blocking)' : ''}`)
  for (const f of fails) {
    const mark = blocks ? '✗' : '•'
    console.log(f.band ? `  ${mark} ${f.bg}  ${f.what}  (${f.fg})` : `  ${mark} ${f.r.toFixed(2)}:1 < ${f.min}:1  ${f.what}  (${f.fg} on ${f.bg})`)
  }
}
process.exit(blocking ? 1 : 0)
