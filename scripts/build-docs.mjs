// Generates docs/components/<name>.md for every exported component.
// Props come from the TypeScript source (scripts/lib/extract-components.mjs);
// guidance (use, accessibility, content, examples) comes from scripts/docs/*.mjs.
// `node scripts/build-docs.mjs --check` fails when a file is stale or a component has no guidance.
import fs from 'node:fs'
import path from 'node:path'
import { extractComponents } from './lib/extract-components.mjs'
import { content } from './docs/index.mjs'

const root = path.resolve(import.meta.dirname, '..')
const outDir = path.join(root, 'docs/components')
const check = process.argv.includes('--check')
const tokenGroups = new Set(Object.keys(JSON.parse(fs.readFileSync(path.join(root, 'tokens/components.json'), 'utf8'))).filter((k) => !k.startsWith('$')))
const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
const esc = (s) => s.replace(/\|/g, '\\|')
const clean = (t) => t.replace(/ \| undefined$/, '').replace(/ \| undefined \|/g, ' |')

const comps = extractComponents()
const errors = []
for (const c of comps) if (!content[c.name]) errors.push(`No guidance for ${c.name} (add it in scripts/docs/)`)
for (const k of Object.keys(content)) if (!comps.some((c) => c.name === k)) errors.push(`Guidance for unknown component ${k}`)

const list = (items) => items.map((i) => `- ${i}`).join('\n')
const files = new Map()

for (const c of comps) {
  const g = content[c.name]
  if (!g) continue
  const f = kebab(c.name)
  if (g.tokens && !tokenGroups.has(g.tokens)) errors.push(`${c.name}: unknown token group "${g.tokens}"`)
  for (const r of g.related ?? []) if (!comps.some((x) => x.name === r)) errors.push(`${c.name}: related "${r}" is not a component`)
  for (const k of ['summary', 'use', 'avoid', 'a11y', 'example', 'cat']) if (!g[k] || (Array.isArray(g[k]) && !g[k].length)) errors.push(`${c.name}: missing ${k}`)
  const src = path.basename(c.file)
  const meta = [`Source: [\`${c.file}\`](../../${c.file})`]
  if (g.figma) meta.push(`Figma: ${g.figma}`)
  if (g.tokens) meta.push(`Tokens: \`${g.tokens}.*\` in [tokens.md](../tokens.md)`)
  const rows = c.props.map((p) => `| \`${p.name}\` | \`${esc(clean(p.type))}\` | ${p.optional ? (p.default ? `\`${esc(p.default)}\`` : '') : '**required**'} | ${esc(p.doc || (g.props?.[p.name] ?? ''))} |`)
  const missingDoc = c.props.filter((p) => !p.doc && !g.props?.[p.name]).map((p) => p.name)
  const md = [
    `# ${c.name}`,
    '',
    `> ${g.summary}`,
    '',
    '```tsx',
    `import { ${c.name} } from '@pance/react'`,
    '```',
    '',
    meta.join(' · '),
    '',
    '## When to use',
    '',
    list(g.use),
    '',
    '## When not to use',
    '',
    list(g.avoid),
    '',
    '## Props',
    '',
    c.props.length ? '| Prop | Type | Default | Notes |\n|---|---|---|---|\n' + rows.join('\n') : 'No props.',
    ...(g.native ? ['', `Also accepts ${g.native}.`] : []),
    '',
    '## Accessibility',
    '',
    list(g.a11y),
    ...(g.content?.length ? ['', '## Content', '', list(g.content)] : []),
    ...(g.related?.length ? ['', '## Related', '', g.related.map((r) => `[\`${r}\`](${kebab(r)}.md)`).join(' · ')] : []),
    '',
    '## Example',
    '',
    '```tsx',
    g.example.trim(),
    '```',
    '',
  ].join('\n')
  files.set(`${f}.md`, md)
  void src; void missingDoc
}

const cats = [...new Set(comps.map((c) => content[c.name]?.cat).filter(Boolean))]
const index = [
  '# Components',
  '',
  `${comps.length} components, one page each. Every page has a short summary, when to use it and when not to, props (generated from the TypeScript source, so they cannot drift), accessibility behaviour, content guidance, related components and a working example.`,
  '',
  'Cross-cutting reference stays in [components.md](../components.md) (shared model, keyboard contract, built-in strings) and [tokens.md](../tokens.md). Figma component names and prop mapping are in [figma-code-map.md](../figma-code-map.md).',
  '',
  ...cats.flatMap((cat) => [
    `## ${cat}`,
    '',
    '| Component | Use it for |',
    '|---|---|',
    ...comps.filter((c) => content[c.name]?.cat === cat).map((c) => `| [\`${c.name}\`](${kebab(c.name)}.md) | ${esc(content[c.name].summary.split(/(?<=\.)\s/)[0])} |`),
    '',
  ]),
].join('\n')
files.set('README.md', index)

if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}
if (check) {
  let stale = 0
  for (const [n, md] of files) {
    const p = path.join(outDir, n)
    if (!fs.existsSync(p) || fs.readFileSync(p, 'utf8') !== md) { console.error(`stale: docs/components/${n}`); stale++ }
  }
  for (const n of fs.existsSync(outDir) ? fs.readdirSync(outDir) : []) if (!files.has(n)) { console.error(`orphan: docs/components/${n}`); stale++ }
  if (stale) { console.error('Run `pnpm docs` and commit the result.'); process.exit(1) }
  console.log(`docs ok (${comps.length} components)`)
} else {
  fs.mkdirSync(outDir, { recursive: true })
  for (const n of fs.readdirSync(outDir)) if (!files.has(n)) fs.unlinkSync(path.join(outDir, n))
  for (const [n, md] of files) fs.writeFileSync(path.join(outDir, n), md)
  console.log(`wrote ${files.size} files`)
}
