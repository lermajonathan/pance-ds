// @pance/mcp: a read-only MCP server that describes Pance to coding agents (DDR-DS-029).
// Starts the real server over stdio, as an agent would, and checks every tool against the sources.
// Run after `pnpm build:mcp` (the server reads a snapshot generated from the sources).
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { extractComponents } from '../scripts/lib/extract-components.mjs'
import { readDecisions } from '../scripts/lib/agent-docs.mjs'

const root = path.resolve(import.meta.dirname, '..')
const pkgDir = path.join(root, 'packages/mcp')
const bin = path.join(pkgDir, 'bin/pance-mcp.mjs')
const failures = []
const check = (ok, msg) => { if (!ok) failures.push(msg) }
const json = (res) => JSON.parse(res.content[0].text)

if (!fs.existsSync(path.join(pkgDir, 'dist/snapshot.json')) || !fs.existsSync(bin)) {
  console.error('✗ packages/mcp is not built (run `pnpm build:mcp`)')
  process.exit(1)
}

// A scratch working directory: a read-only server must leave it empty.
const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'pance-mcp-'))
const client = new Client({ name: 'pance-mcp-test', version: '0.0.0' })
await client.connect(new StdioClientTransport({ command: process.execPath, args: [bin], cwd, stderr: 'pipe' }))

try {
  // Tools: exactly the six named in DDR-DS-029.
  const tools = (await client.listTools()).tools.map((t) => t.name).sort()
  const expected = ['get_component', 'get_decision', 'get_token', 'list_components', 'list_decisions', 'search_tokens']
  check(JSON.stringify(tools) === JSON.stringify(expected), `tools are ${tools.join(', ')}; expected ${expected.join(', ')}`)
  for (const t of (await client.listTools()).tools) check(t.annotations?.readOnlyHint === true, `${t.name} must be marked read-only`)
  check(/@pance\/react/.test(client.getInstructions() ?? ''), 'the server must send usage instructions that name @pance/react')

  // list_components matches the source exactly.
  const comps = extractComponents()
  const listed = json(await client.callTool({ name: 'list_components', arguments: {} }))
  check(JSON.stringify(listed.map((c) => c.name)) === JSON.stringify(comps.map((c) => c.name)), 'list_components does not match extractComponents()')
  check(listed.every((c) => c.category && c.summary), 'every listed component needs a category and a summary')
  const forms = json(await client.callTool({ name: 'list_components', arguments: { category: listed.find((c) => c.name === 'Input').category } }))
  check(forms.length > 0 && forms.length < listed.length && forms.some((c) => c.name === 'Input'), 'list_components must filter by category')

  // get_component carries the props from the TypeScript source, plus guidance and an example.
  const button = comps.find((c) => c.name === 'Button')
  const got = json(await client.callTool({ name: 'get_component', arguments: { name: 'Button' } }))
  check(JSON.stringify(got.props.map((p) => p.name)) === JSON.stringify(button.props.map((p) => p.name)), 'get_component(Button) props differ from the source')
  check(got.source === button.file && got.example.includes('<Button') && got.a11y.length > 0 && got.use.length > 0, 'get_component(Button) is missing source, example, use or a11y')
  check(got.import === "import { Button } from '@pance/react'", 'get_component must give the import line')

  // An unknown name is an error with the closest names, never a guess.
  const bad = await client.callTool({ name: 'get_component', arguments: { name: 'Buton' } })
  check(bad.isError === true && /Button/.test(bad.content[0].text) && !/"props"/.test(bad.content[0].text), 'get_component(Buton) must fail and suggest Button')

  // Tokens: search, then read one with its CSS variable.
  const found = json(await client.callTool({ name: 'search_tokens', arguments: { query: 'intent primary solid', limit: 5 } }))
  check(found.length > 0 && found.length <= 5 && found.some((t) => t.name === 'color.intent.primary.solid'), 'search_tokens must find color.intent.primary.solid')
  const token = json(await client.callTool({ name: 'get_token', arguments: { name: 'color.intent.primary.solid' } }))
  check(token.cssVariable === '--pance-color-intent-primary-solid' && token.tier === 'semantic' && /^#[0-9a-f]{6}$/i.test(token.value), 'get_token returned a wrong CSS variable, tier or value')
  const tierOnly = json(await client.callTool({ name: 'search_tokens', arguments: { query: 'button', tier: 'components', limit: 50 } }))
  check(tierOnly.length > 0 && tierOnly.every((t) => t.tier === 'components'), 'search_tokens must filter by tier')
  const noToken = await client.callTool({ name: 'get_token', arguments: { name: 'color.intent.primary.solidd' } })
  check(noToken.isError === true, 'get_token must fail for an unknown token')

  // Decisions come from the register and the records.
  const decisions = readDecisions()
  const listedDecisions = json(await client.callTool({ name: 'list_decisions', arguments: {} }))
  check(JSON.stringify(listedDecisions.map((d) => d.id)) === JSON.stringify(decisions.map((d) => d.id)), 'list_decisions does not match the register')
  const ddr = await client.callTool({ name: 'get_decision', arguments: { id: 'DDR-DS-029' } })
  check(!ddr.isError && ddr.content[0].text.startsWith('# DDR-DS-029'), 'get_decision(DDR-DS-029) must return the record')
  check((await client.callTool({ name: 'get_decision', arguments: { id: 'DDR-DS-999' } })).isError === true, 'get_decision must fail for an unknown record')
} finally {
  await client.close()
}

// Read-only: the working directory is still empty.
check(fs.readdirSync(cwd).length === 0, `the server wrote files in its working directory: ${fs.readdirSync(cwd).join(', ')}`)
fs.rmSync(cwd, { recursive: true, force: true })

// Package shape: what npm would publish.
const pkg = JSON.parse(fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf8'))
const react = JSON.parse(fs.readFileSync(path.join(root, 'packages/react/package.json'), 'utf8'))
check(pkg.name === '@pance/mcp' && pkg.license === 'MIT', 'package must be @pance/mcp under MIT')
check(pkg.version === react.version, `@pance/mcp ${pkg.version} must share the version of @pance/react ${react.version}`)
check(pkg.bin?.['pance-mcp'] === './bin/pance-mcp.mjs', 'package needs the pance-mcp bin')
check(JSON.stringify(Object.keys(pkg.dependencies ?? {}).sort()) === JSON.stringify(['@modelcontextprotocol/sdk', 'zod']), 'runtime dependencies must be only the MCP SDK and zod')
const packed = JSON.parse(execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], { cwd: pkgDir, stdio: ['ignore', 'pipe', 'ignore'] }).toString())[0].files.map((f) => f.path)
for (const f of ['bin/pance-mcp.mjs', 'dist/snapshot.json', 'dist/skills/pance/SKILL.md', 'package.json', 'README.md']) check(packed.includes(f), `the package does not include ${f}`)
check(packed.every((f) => !f.startsWith('test')), 'tests must not be published')
for (const f of packed.filter((f) => /\.(mjs|json|md)$/.test(f))) {
  const text = fs.readFileSync(path.join(pkgDir, f), 'utf8')
  check(!new RegExp(['cl', 'aude|anthr', 'opic'].join(''), 'i').test(text), `${f} must not name the agent vendors`)
}

// As a consumer would get it: pack, install the tarball in a fresh project, and call a tool.
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pance-mcp-consumer-'))
try {
  const tgz = execFileSync('npm', ['pack', '--silent', '--ignore-scripts', '--pack-destination', tmp], { cwd: pkgDir, stdio: ['ignore', 'pipe', 'inherit'] }).toString().trim().split('\n').pop()
  fs.writeFileSync(path.join(tmp, 'package.json'), JSON.stringify({ name: 'consumer', private: true, type: 'module' }))
  execFileSync('npm', ['install', '--silent', '--no-audit', '--no-fund', path.join(tmp, tgz)], { cwd: tmp, stdio: ['ignore', 'pipe', 'inherit'] })
  const installed = new Client({ name: 'pance-mcp-consumer', version: '0.0.0' })
  await installed.connect(new StdioClientTransport({ command: process.execPath, args: [path.join(tmp, 'node_modules/@pance/mcp/bin/pance-mcp.mjs')], cwd: tmp, stderr: 'pipe' }))
  const names = json(await installed.callTool({ name: 'list_components', arguments: {} })).map((c) => c.name)
  check(names.length === extractComponents().length, 'the installed package lists a different number of components')
  await installed.close()
} catch (e) {
  failures.push(`the packed package does not work when installed: ${String(e.message).split('\n')[0]}`)
} finally {
  fs.rmSync(tmp, { recursive: true, force: true })
}

if (failures.length) {
  console.error(failures.map((f) => `✗ ${f}`).join('\n'))
  console.error(`\n${failures.length} problem(s)`)
  process.exit(1)
}
console.log('mcp ok')
