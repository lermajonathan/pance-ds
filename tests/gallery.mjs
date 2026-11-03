// Gallery of live cards (DDR-DS-030): 12 cards built only from library components and tokens,
// safe under prefers-reduced-motion, registered in the site, bilingual, and covered by axe and visual tests.
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const failures = []
const check = (ok, msg) => { if (!ok) failures.push(msg) }
const read = (p) => (fs.existsSync(path.join(root, p)) ? fs.readFileSync(path.join(root, p), 'utf8') : null)

// 1. The card list: 12 unique cards, each naming a library component that really exists.
let cards = []
try {
  const mod = await import('../src/site/gallery-cards.ts')
  cards = mod.GALLERY_CARDS ?? []
} catch (e) { check(false, `src/site/gallery-cards.ts cannot be imported: ${e.message.split('\n')[0]}`) }
check(cards.length === 12, `the gallery must have 12 cards (got ${cards.length})`)
check(new Set(cards.map((c) => c.id)).size === cards.length, 'card ids must be unique')
const libSrc = fs.readdirSync(path.join(root, 'src/components')).filter((f) => f.endsWith('.tsx')).map((f) => read(`src/components/${f}`)).join('\n')
for (const c of cards) {
  check(/^[a-z][a-zA-Z0-9]*$/.test(c.id), `card id "${c.id}" must be camelCase letters and digits`)
  for (const name of c.uses ?? []) check(new RegExp(`export (?:function|const) ${name}\\b`).test(libSrc), `card "${c.id}" uses ${name}, which @pance/react does not export`)
  check((c.uses ?? []).length > 0, `card "${c.id}" must list the library components it uses`)
}

// 2. The page: only library components and tokens, no raw colours or sizes, motion gated.
const page = read('src/site/gallery.tsx')
check(page !== null, 'src/site/gallery.tsx does not exist')
if (page) {
  check(/export function GalleryPage\b/.test(page), 'gallery.tsx must export GalleryPage')
  const rules = [
    [/\b(?:bg|text|border|ring|outline|decoration|fill|stroke|from|via|to|divide|shadow)-(?:brand|slate|emerald|sky|amber|violet|rose|orange|gray|zinc|neutral|red|green|blue|cyan|teal|yellow|purple|pink)-\d{2,3}\b/g, 'palette step'],
    [/#[0-9a-fA-F]{3,8}\b/g, 'hex colour'],
    [/rgba?\(/g, 'rgb() colour'],
    [/\b(?:min-|max-)?(?:w|h|size|p[trblxy]?|gap(?:-[xy])?|text|rounded(?:-[a-z]+)?|leading|tracking)-\[[0-9.]+(?:px|rem)\]/g, 'magic dimension'],
    [/\bduration-(?:\d|\[)/g, 'raw duration (use the motion tokens)'],
  ]
  page.split('\n').forEach((line, i) => {
    if (line.trim().startsWith('//') || line.trim().startsWith('*')) return
    for (const [re, what] of rules) for (const m of line.matchAll(re)) check(false, `gallery.tsx:${i + 1} ${what}: ${m[0]}`)
    for (const m of line.matchAll(/(?<![\w:-])animate-(spin|pulse|ping|bounce)\b/g)) check(line.includes(`motion-safe:animate-${m[1]}`) || line.includes('motion-reduce:animate-none'), `gallery.tsx:${i + 1} animate-${m[1]} is not gated by motion-safe / motion-reduce`)
  })
  for (const c of cards) check(new RegExp(`\\b${c.id}\\s*:\\s*\\w+Demo\\b`).test(page), `gallery.tsx has no demo registered for card "${c.id}"`)
  // The metric card counts up with the hook-backed props (value stays the final text for screen readers).
  check(/countTo=/.test(page) && /format=/.test(page), 'the metric card must use MetricCard countTo and format')
  check(/<GalleryCard\b/.test(page), 'gallery.tsx must wrap every card in GalleryCard')
}

// 3. Registered in the site and tests.
const app = read('src/site/App.tsx') ?? ''
check(/key: 'gallery'/.test(app) && /GalleryPage/.test(app), "App.tsx must register the 'gallery' page")
for (const f of ['tests/axe.mjs', 'tests/visual.mjs']) check(/'gallery'/.test(read(f) ?? ''), `${f} must include the 'gallery' page`)
const shell = read('src/i18n/shell.ts') ?? ''
check((shell.match(/'nav\.gallery'/g) ?? []).length === 2, "src/i18n/shell.ts must define 'nav.gallery' in English and Spanish")
const index = read('src/i18n/index.tsx') ?? ''
check(/\.\.\.gallery\.en/.test(index) && /\.\.\.gallery\.es/.test(index), 'src/i18n/index.tsx must register the gallery dictionary in both languages')

// 4. Bilingual copy: each card has a title and a description in both languages, plus the page headings.
const dict = read('src/i18n/gallery.ts') ?? ''
check(dict !== '', 'src/i18n/gallery.ts does not exist')
const need = ['gallery.lead', ...cards.flatMap((c) => [`gallery.${c.id}.title`, `gallery.${c.id}.desc`])]
for (const k of need) check((dict.match(new RegExp(`'${k.replace(/\./g, '\\.')}'`, 'g')) ?? []).length === 2, `src/i18n/gallery.ts needs '${k}' once in English and once in Spanish`)

if (failures.length) { console.error(failures.map((f) => `✗ ${f}`).join('\n')); process.exit(1) }
console.log(`gallery ok (${cards.length} cards)`)
