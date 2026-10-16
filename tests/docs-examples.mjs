// Type-checks every example in docs/components/*.md against the real components.
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const root = path.resolve(import.meta.dirname, '..')
const dir = path.join(root, 'docs/components')
const tmp = path.join(root, '.docs-check')
fs.rmSync(tmp, { recursive: true, force: true })
fs.mkdirSync(tmp)
const ICONS = new Set()
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md') && f !== 'README.md')
let n = 0
const bodies = []
for (const f of files) {
  const md = fs.readFileSync(path.join(dir, f), 'utf8')
  const blocks = [...md.matchAll(/```tsx\n([\s\S]*?)```/g)].map((m) => m[1]).filter((b) => !b.startsWith('import {'))
  blocks.forEach((b, i) => {
    for (const m of b.matchAll(/\bIcon([A-Z][A-Za-z]+)\b/g)) if (m[1] !== 'Button') ICONS.add('Icon' + m[1])
    bodies.push(`export function Ex${n++}_${f.replace(/\W/g, '_')}_${i}() {\n  return (\n    <>\n${b}\n    </>\n  )\n}\n`)
  })
}
const header = `import * as React from 'react'\nimport * as P from '../src/components'\nimport { ${[...ICONS].join(', ')} } from '../src/icons'\nconst { ${[...new Set(fs.readdirSync(dir).filter((f) => f !== 'README.md').map((f) => f.replace('.md', '').split('-').map((s) => s[0].toUpperCase() + s.slice(1)).join('')))].join(', ')} } = P\n// Values the examples assume exist\ndeclare function App(): any\ndeclare const save: () => void, restore: () => void, publish: () => void, saveDraft: () => void, schedule: () => void, copy: () => void, remove: (...a: any[]) => void, markRead: any, markAll: any, dismiss: any, go: any, verify: any, upload: any, deleting: boolean, open: boolean, setOpen: any, close: () => void\ndeclare const following: boolean, setFollowing: any, on: boolean, setOn: any, agree: boolean, setAgree: any, v: string, setV: any, plan: string, setPlan: any, r: string, setR: any, t: number, setT: any, bio: string, setBio: any, city: string, setCity: any, tags: string[], setTags: any, name: string, setName: any, selected: Set<string>, setSelected: any, channels: any[], items: any[], toasts: any[], setToasts: React.Dispatch<React.SetStateAction<any[]>>, tab: string, setTab: any, route: string, page: number, setPage: any, days: string[], values: number[], regions: string[], v2: number[], hours: string[], grid: number[][], date: string | null, setDate: any, range: any, setRange: any, presets: any[], d: string | null, setD: any, rows: any[], cities: any[]\n`
fs.writeFileSync(path.join(tmp, 'examples.tsx'), header + bodies.join('\n'))
fs.writeFileSync(path.join(tmp, 'tsconfig.json'), JSON.stringify({ extends: '../tsconfig.json', compilerOptions: { noEmit: true, noUnusedLocals: false, noUnusedParameters: false, composite: false, incremental: false, tsBuildInfoFile: null }, include: ['examples.tsx'] }))
try {
  execFileSync(path.join(root, 'node_modules/.bin/tsc'), ['-p', path.join(tmp, 'tsconfig.json')], { stdio: 'pipe', cwd: root })
  console.log(`docs examples ok (${n} blocks)`)
} catch (e) {
  console.error(String(e.stdout || e.message))
  process.exitCode = 1
} finally {
  if (!process.env.KEEP) fs.rmSync(tmp, { recursive: true, force: true })
}
