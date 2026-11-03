// Builds the data the @pance/mcp server reads: components, tokens and decisions, all generated
// from the same sources as the docs (TypeScript props, token files, DDR records). Nothing is typed twice.
import fs from 'node:fs'
import path from 'node:path'
import { readDecisions } from './agent-docs.mjs'

const root = path.resolve(import.meta.dirname, '../..')
const json = (f) => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'))
const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

export function readTokens() {
  const resolved = json('tokens/dist/tokens.json')
  const out = []
  for (const tier of ['primitives', 'semantic', 'components']) {
    const walk = (node, p, inheritedType) => {
      const type = node.$type ?? inheritedType
      if ('$value' in node) {
        const name = p.join('.')
        const raw = node.$value
        out.push({
          name,
          tier,
          type,
          value: resolved[name],
          ...(typeof raw === 'string' && raw.startsWith('{') ? { alias: raw.slice(1, -1) } : {}),
          ...(node.$extensions?.['pance.modes']?.dark !== undefined ? { dark: node.$extensions['pance.modes'].dark } : {}),
          ...(node.$description ? { description: node.$description } : {}),
          cssVariable: `--pance-${kebab(p.join('-'))}`,
        })
        return
      }
      for (const [k, v] of Object.entries(node)) if (!k.startsWith('$') && v && typeof v === 'object') walk(v, [...p, k], type)
    }
    walk(json(`tokens/${tier}.json`), [], undefined)
  }
  return out
}

export function buildSnapshot({ comps, content }) {
  const version = json('packages/react/package.json').version
  const components = comps.map((c) => {
    const g = content[c.name]
    return {
      name: c.name,
      category: g.cat,
      summary: g.summary,
      import: `import { ${c.name} } from '@pance/react'`,
      source: c.file,
      ...(g.figma ? { figma: g.figma } : {}),
      ...(g.tokens ? { tokenGroup: g.tokens } : {}),
      props: c.props.map((p) => ({ name: p.name, type: p.type.replace(/ \| undefined$/, ''), required: !p.optional, ...(p.default ? { default: p.default } : {}), description: p.doc || g.props?.[p.name] || '' })),
      ...(g.native ? { alsoAccepts: g.native } : {}),
      use: g.use,
      avoid: g.avoid,
      a11y: g.a11y,
      ...(g.content?.length ? { content: g.content } : {}),
      related: g.related ?? [],
      example: g.example.trim(),
    }
  })
  const decisions = readDecisions().map((d) => ({ ...d, text: fs.readFileSync(path.join(root, 'docs/decisions', `${d.id}.md`), 'utf8') }))
  return { version, components, tokens: readTokens(), decisions }
}
