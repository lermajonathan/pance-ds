// Fails if a library component uses a raw palette step, hex or rgba colour instead of a token.
// Components must use semantic utilities (bg-primary-solid, text-ink-muted, border-line…) or
// component tokens (bg-(--pance-button-color-primary-filled-bg)), so token edits and themes reach them.
import fs from 'node:fs'
import path from 'node:path'

const dir = 'src/components'
const rules = [
  [/\b(?:bg|text|border|ring|outline|decoration|fill|stroke|from|via|to|divide|shadow)-(?:brand|slate|emerald|sky|amber|violet|rose|orange|gray|zinc|neutral|red|green|blue|cyan|teal|yellow|purple|pink)-\d{2,3}\b/g, 'palette step'],
  [/#[0-9a-fA-F]{3,8}\b(?![^'"`]*\}\})/g, 'hex colour'],
  [/rgba?\(/g, 'rgb() colour'],
]
let problems = 0
for (const file of fs.readdirSync(dir).filter((f) => /\.(tsx?|ts)$/.test(f))) {
  const lines = fs.readFileSync(path.join(dir, file), 'utf8').split('\n')
  lines.forEach((line, i) => {
    if (line.trim().startsWith('//') || line.trim().startsWith('*')) return
    for (const [re, what] of rules) for (const m of line.matchAll(re)) {
      problems++
      console.log(`${dir}/${file}:${i + 1}  ${what}: ${m[0]}`)
    }
  })
}
if (problems) {
  console.log(`\n${problems} hard-coded colour(s). Use a semantic utility or a component token instead (see docs/tokens.md).`)
  process.exit(1)
}
console.log('✓ Components only use tokens')
