// RTL readiness: the library must use logical properties, not physical left/right.
// Components are checked token by token (Tailwind utilities, with or without variants).
// Allowed without listing: symmetric centering (left-1/2, right-1/2), which looks the same in both directions.
// Every other physical utility needs a reason it stays: either an entry in EXCEPTIONS, or an
// `rtl-exempt: <reason>` comment on the same line (used for the physical 'left' / 'right' placement API).
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const dir = path.join(root, 'src/components')

// { file, token (exact utility, variants stripped), reason }
const EXCEPTIONS = []

const PHYSICAL = /^-?(?:(?:pl|pr|ml|mr|left|right|scroll-ml|scroll-mr|scroll-pl|scroll-pr)-[^\s]+|text-(?:left|right)|float-(?:left|right)|border-[lr](?:-[^\s]+)?|rounded-(?:l|r|tl|tr|bl|br)(?:-[^\s]+)?)$/
const SYMMETRIC = new Set(['left-1/2', 'right-1/2'])

// Strip variants: everything up to the last ':' that is outside [...] / (...)
const utility = (token) => {
  let depth = 0, cut = -1
  for (let i = 0; i < token.length; i++) {
    const c = token[i]
    if (c === '[' || c === '(') depth++
    else if (c === ']' || c === ')') depth--
    else if (c === ':' && depth === 0) cut = i
  }
  return token.slice(cut + 1).replace(/^!|!$/g, '')
}

const stringsIn = (src) => [...src.matchAll(/(['"`])((?:\\.|(?!\1)[^\\\n])*)\1/g)].map((m) => ({ text: m[2], index: m.index }))
const lineOf = (src, index) => src.slice(0, index).split('\n').length

const failures = []
const files = fs.readdirSync(dir).filter((n) => n.endsWith('.tsx'))
for (const f of files) {
  const src = fs.readFileSync(path.join(dir, f), 'utf8')
  const lines = src.split('\n')
  lines.forEach((ln, i) => {
    const m = ln.match(/rtl-exempt:\s*(.*)$/)
    if (m && m[1].replace(/\*\/\s*$/, '').trim().length < 10) failures.push(`${f}:${i + 1} rtl-exempt needs a reason`)
  })
  for (const s of stringsIn(src)) {
    if (lines[lineOf(src, s.index) - 1].includes('rtl-exempt:')) continue
    for (const raw of s.text.split(/\s+/)) {
      if (!raw) continue
      const u = utility(raw.replace(/['"`}{,;]+$/, ''))
      // Centering with -translate-x-1/2 only works with left-1/2 / right-1/2: start-1/2 shifts the wrong way in RTL.
      if ((u === 'start-1/2' || u === 'end-1/2') && s.text.split(/\s+/).some((t) => utility(t).replace(/^-/, '') === 'translate-x-1/2')) {
        failures.push(`${f}:${lineOf(src, s.index)} "${u}" with translate-x-1/2 is not centred in RTL (use left-1/2)`)
      }
      if (!PHYSICAL.test(u) || SYMMETRIC.has(u)) continue
      if (EXCEPTIONS.some((e) => e.file === f && e.token === u)) continue
      failures.push(`${f}:${lineOf(src, s.index)} physical utility "${u}" (use the logical one, or list it in EXCEPTIONS with a reason)`)
    }
  }
}

for (const e of EXCEPTIONS) {
  if (!e.reason || e.reason.length < 10) failures.push(`EXCEPTIONS entry ${e.file}:${e.token} has no reason`)
}

// API: Tooltip and Drawer accept 'start' / 'end' (they follow the page direction); 'left' / 'right' stay as they are.
const overlays = fs.readFileSync(path.join(dir, 'overlays.tsx'), 'utf8')
const union = (name) => (overlays.match(new RegExp(`export type ${name} = ([^\\n]+)`)) ?? [])[1] ?? ''
for (const [name, all] of [['TooltipPlacement', ['left', 'right', 'start', 'end']], ['DrawerSide', ['left', 'right', 'start', 'end']]]) {
  for (const v of all) if (!union(name).includes(`'${v}'`)) failures.push(`overlays.tsx ${name} must include '${v}'`)
}

// Keyboard: in RTL the horizontal arrows follow the visual direction (ArrowRight goes to the previous item).
let a11y = null
try { a11y = await import('../src/components/a11y.ts') } catch (e) { failures.push(`src/components/a11y.ts cannot be imported: ${e.message.split('\n')[0]}`) }
if (a11y) {
  const nav = a11y.listKeyNav
  const eq = (got, want, msg) => { if (got !== want) failures.push(`listKeyNav ${msg}: expected ${want}, got ${got}`) }
  eq(nav('ArrowRight', 1, 3, undefined, 'horizontal'), 2, 'LTR ArrowRight moves forward')
  eq(nav('ArrowLeft', 1, 3, undefined, 'horizontal'), 0, 'LTR ArrowLeft moves back')
  eq(nav('ArrowRight', 1, 3, undefined, 'horizontal', true), 0, 'RTL ArrowRight moves back')
  eq(nav('ArrowLeft', 1, 3, undefined, 'horizontal', true), 2, 'RTL ArrowLeft moves forward')
  eq(nav('ArrowLeft', 0, 3, undefined, 'both', true), 1, 'RTL ArrowLeft moves forward in a two-axis list')
  eq(nav('ArrowDown', 0, 3, undefined, 'both', true), 1, 'RTL ArrowDown is unchanged')
  eq(nav('Home', 2, 3, undefined, 'horizontal', true), 0, 'RTL Home is unchanged')
  eq(typeof a11y.isRtl, 'function', 'isRtl is exported:')
  eq(typeof a11y.flipArrow, 'function', 'flipArrow is exported:')
  if (typeof a11y.flipArrow === 'function') {
    eq(a11y.flipArrow('ArrowLeft', true), 'ArrowRight', 'flipArrow swaps left in RTL')
    eq(a11y.flipArrow('ArrowLeft', false), 'ArrowLeft', 'flipArrow keeps left in LTR')
    eq(a11y.flipArrow('ArrowUp', true), 'ArrowUp', 'flipArrow keeps vertical keys')
  }
}

if (failures.length) {
  console.error(failures.join('\n'))
  console.error(`\nrtl FAILED: ${failures.length} physical utilities in ${new Set(failures.map((x) => x.split(':')[0])).size} files`)
  process.exit(1)
}
console.log(`rtl ok (${files.length} component files)`)
