// RTL readiness: the library must use logical properties, not physical left/right.
// Components are checked token by token (Tailwind utilities, with or without variants).
// Allowed without listing: symmetric centering (left-1/2, right-1/2), which looks the same in both directions.
// Every other physical utility needs an entry in EXCEPTIONS, with the reason it stays.
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
  for (const s of stringsIn(src)) {
    for (const raw of s.text.split(/\s+/)) {
      if (!raw) continue
      const u = utility(raw.replace(/['"`}{,;]+$/, ''))
      if (!PHYSICAL.test(u) || SYMMETRIC.has(u)) continue
      if (EXCEPTIONS.some((e) => e.file === f && e.token === u)) continue
      failures.push(`${f}:${lineOf(src, s.index)} physical utility "${u}" (use the logical one, or list it in EXCEPTIONS with a reason)`)
    }
  }
}

for (const e of EXCEPTIONS) {
  if (!e.reason || e.reason.length < 10) failures.push(`EXCEPTIONS entry ${e.file}:${e.token} has no reason`)
}

if (failures.length) {
  console.error(failures.join('\n'))
  console.error(`\nrtl FAILED: ${failures.length} physical utilities in ${new Set(failures.map((x) => x.split(':')[0])).size} files`)
  process.exit(1)
}
console.log(`rtl ok (${files.length} component files)`)
