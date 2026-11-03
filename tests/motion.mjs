// Motion must respect prefers-reduced-motion (DDR-DS-030).
// 1. A global guard in the stylesheet neutralises every transition and animation.
// 2. Every Tailwind animate-* utility in components is itself gated (motion-safe / motion-reduce).
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const failures = []
const check = (ok, msg) => { if (!ok) failures.push(msg) }

const css = fs.readFileSync(path.join(root, 'src/styles/index.css'), 'utf8')
const guard = css.match(/@media \(prefers-reduced-motion: reduce\)\s*\{([\s\S]*?)\n\}/g) ?? []
const global = guard.find((b) => /\*/.test(b) && /transition-duration/.test(b) && /animation-duration/.test(b))
check(Boolean(global), 'src/styles/index.css has no global prefers-reduced-motion guard that zeroes transition-duration and animation-duration for all elements')

const dir = path.join(root, 'src/components')
for (const f of fs.readdirSync(dir).filter((n) => n.endsWith('.tsx'))) {
  fs.readFileSync(path.join(dir, f), 'utf8').split('\n').forEach((line, i) => {
    for (const m of line.matchAll(/(?<![\w:-])animate-(spin|pulse|ping|bounce)\b/g)) {
      const gated = line.includes(`motion-safe:animate-${m[1]}`) || line.includes('motion-reduce:animate-none')
      check(gated, `${f}:${i + 1} animate-${m[1]} is not gated by motion-safe / motion-reduce`)
    }
  })
}

if (failures.length) { console.error(failures.map((f) => `✗ ${f}`).join('\n')); process.exit(1) }
console.log('motion ok')
