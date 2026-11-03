// The agent skill (skills/pance/SKILL.md) tells coding agents how to use Pance (DDR-DS-029).
// Every component, hook, token, utility, tool and package it names must exist, so the skill cannot drift.
// Run after `pnpm build:packages` (it checks the names against the built package and the MCP snapshot).
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const file = path.join(root, 'skills/pance/SKILL.md')
const failures = []
const check = (ok, msg) => { if (!ok) failures.push(msg) }

if (!fs.existsSync(file)) {
  console.error('✗ skills/pance/SKILL.md does not exist')
  process.exit(1)
}
const md = fs.readFileSync(file, 'utf8')

// Frontmatter: name and a description that says when to use it.
const fm = md.match(/^---\nname: (.+)\ndescription: (.+)\n---\n/)
check(!!fm, 'SKILL.md must start with frontmatter holding name and description')
if (fm) {
  check(fm[1] === 'pance', `skill name must be "pance", got "${fm[1]}"`)
  check(fm[2].length >= 60 && fm[2].length <= 400, `description must be 60 to 400 characters, got ${fm[2].length}`)
  check(/^Use when/.test(fm[2]), 'description must start with "Use when"')
}
check(md.split('\n').length <= 120, 'SKILL.md must stay short (120 lines at most): it points to facts, it does not copy them')

// It sends the agent to the live sources instead of copying facts.
check(md.includes('https://pance-ds.jonathanlerma.com/llms-full.txt'), 'SKILL.md must link llms-full.txt')
check(/MCP/.test(md), 'SKILL.md must mention the MCP server')

// The repo never names the tools or companies behind the agents (project rule).
check(!new RegExp(['cl', 'aude|anthr', 'opic'].join(''), 'i').test(md), 'SKILL.md must not name the agent vendors')

// Every inline-code name must be real.
const exportsOfPackage = Object.keys(await import(path.join(root, 'packages/react/dist/index.js')))
const snapshot = JSON.parse(fs.readFileSync(path.join(root, 'packages/mcp/dist/snapshot.json'), 'utf8'))
const tokenNames = snapshot.tokens.map((t) => t.name)
const cssVars = snapshot.tokens.map((t) => t.cssVariable)
const groups = new Set(tokenNames.map((n) => n.split('.')[0]))
const theme = fs.readFileSync(path.join(root, 'src/styles/theme.css'), 'utf8')
const tools = [...fs.readFileSync(path.join(root, 'packages/mcp/src/server.mjs'), 'utf8').matchAll(/registerTool\('([a-z_]+)'/g)].map((m) => m[1])
const packages = fs.readdirSync(path.join(root, 'packages')).map((p) => JSON.parse(fs.readFileSync(path.join(root, 'packages', p, 'package.json'), 'utf8')).name)

const seen = new Set()
for (const [, raw] of md.replace(/```[\s\S]*?```/g, '').matchAll(/`([^`\n]+)`/g)) {
  const s = raw.replace(/\(\)$/, '')
  if (seen.has(s)) continue
  seen.add(s)
  if (/^[A-Z][A-Za-z0-9]+$/.test(s) || /^(use[A-Z]\w*|themeInitScript)$/.test(s)) check(exportsOfPackage.includes(s), `\`${s}\` is not exported by @pance/react`)
  else if (/^--pance-/.test(s)) check(s.endsWith('*') ? cssVars.some((v) => v.startsWith(s.slice(0, -1))) : cssVars.includes(s), `CSS variable \`${s}\` does not exist`)
  else if (/^[a-z]+(\.[a-z0-9-]+)+(\.\*)?$/.test(s) && groups.has(s.split('.')[0])) check(s.endsWith('.*') ? tokenNames.some((n) => n.startsWith(s.slice(0, -1))) : tokenNames.includes(s), `token \`${s}\` does not exist`)
  else if (/^(bg|text|border|ring)-[a-z-]+$/.test(s)) check(theme.includes(`--color-${s.replace(/^(bg|text|border|ring)-/, '')}:`), `utility \`${s}\` has no matching colour in the Tailwind theme`)
  else if (/^[a-z]+(_[a-z]+)+$/.test(s)) check(tools.includes(s), `MCP tool \`${s}\` does not exist`)
  else if (/^@pance\/[a-z]+$/.test(s)) check(packages.includes(s), `package \`${s}\` does not exist`)
}

if (failures.length) {
  console.error(failures.map((f) => `✗ ${f}`).join('\n'))
  console.error(`\n${failures.length} problem(s)`)
  process.exit(1)
}
console.log(`skill ok (${seen.size} names checked)`)
