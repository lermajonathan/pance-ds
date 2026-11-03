// Builds llms.txt and llms-full.txt for coding agents (DDR-DS-029).
// Everything comes from the same sources as the human docs: the generated component pages,
// the token files and the DDR register. Nothing here is written by hand twice.
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '../..')
export const SITE = 'https://pance-ds.jonathanlerma.com'
export const REPO = 'https://github.com/lermajonathan/pance-ds/blob/main/'
const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
const json = (f) => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'))

const countTokens = (node) => Object.entries(node).reduce((n, [k, v]) => (k.startsWith('$') || typeof v !== 'object' ? n : n + ('$value' in v ? 1 : countTokens(v))), 0)

// Table rows of docs/decisions/README.md: | [DDR-DS-001](DDR-DS-001.md) | Title | date | Status |
export function readDecisions() {
  const md = fs.readFileSync(path.join(root, 'docs/decisions/README.md'), 'utf8')
  return [...md.matchAll(/^\| \[(DDR-DS-\d+)\]\([^)]+\) \| (.+?) \| (\d{4}-\d{2}-\d{2}) \| (.+?) \|$/gm)].map(([, id, title, date, status]) => ({ id, title, date, status }))
}

export function readTokenGroups() {
  return ['primitives', 'semantic', 'components'].map((tier) => {
    const tree = json(`tokens/${tier}.json`)
    return { tier, groups: Object.entries(tree).filter(([k]) => !k.startsWith('$')).map(([group, node]) => ({ group, count: countTokens(node) })) }
  })
}

// A generated component page becomes a section: headings move down two levels and
// repo-relative links become absolute, so the text still works when read on its own.
function pageToSection(md) {
  return md
    .replace(/^## /gm, '#### ')
    .replace(/^# /m, '### ')
    .replace(/\]\(\.\.\/\.\.\/([^)]+)\)/g, `](${REPO}$1)`)
    .replace(/\]\(\.\.\/([a-z-]+\.md)\)/g, `](${REPO}docs/$1)`)
    .replace(/\]\(([a-z0-9-]+\.md)\)/g, `](${REPO}docs/components/$1)`)
    .trimEnd()
}

export function buildAgentDocs({ comps, content, pages }) {
  const version = json('packages/react/package.json').version
  const tokenTiers = readTokenGroups()
  const total = tokenTiers.reduce((n, t) => n + t.groups.reduce((m, g) => m + g.count, 0), 0)
  const decisions = readDecisions()
  const cats = [...new Set(comps.map((c) => content[c.name]?.cat).filter(Boolean))]
  const first = (s) => s.split(/(?<=\.)\s/)[0]
  const intro = `Pance is an accessible React design system for social and data-heavy products: ${comps.length} components, ${total} design tokens, WCAG 2.2 AA, light and dark mode. Packages: @pance/react and @pance/tokens, version ${version}, MIT.`

  const rules = [
    'Import components from `@pance/react`. Do not copy component source into a project.',
    'Colours and sizes come from tokens. Use the semantic utilities (`bg-primary-solid`, `text-ink-muted`, `border-line`) or the CSS variables (`--pance-*`). Never write a raw colour or a palette step in product code.',
    'Wrap every form control in `Field` so it has a visible label, hint and error association.',
    'Severity says what a thing means (`primary`, `success`, `danger`…); variant says how loud it is. Do not pick a severity for its colour.',
    'Status always carries an icon and a label, never colour alone. A chart series that means good or bad uses the status tokens; any other series uses the categorical palette, and a chart never mixes both.',
    'Scatter charts take at most two series. Beyond two, group the rest as "Other" or use facets.',
    'Built-in strings are props or `PanceProvider` labels. The library has no router or i18n dependency.',
    'Deprecated APIs stay for two minor releases and 90 days. Check the component page and the changelog before using something marked `@deprecated`.',
  ]

  const shortTxt = [
    '# Pance Design System',
    '',
    `> ${intro}`,
    '',
    'Pance is MIT and open source. Read the full text in one file at the first link, or open one page per component.',
    '',
    '## Start here',
    '',
    `- [Full reference for agents](${SITE}/llms-full.txt): every component, every token group, the usage rules and the decision register in one file`,
    `- [Install and use](${REPO}packages/react/README.md): install, stylesheet, Tailwind, fonts, dark mode, translating strings`,
    `- [Component reference](${REPO}docs/components.md): shared model of severity, variant and size, keyboard contract, built-in strings`,
    `- [Tokens](${REPO}docs/tokens.md): every token with its value and CSS variable`,
    `- [Deprecation policy](${REPO}docs/deprecation.md): what counts as breaking and how long deprecated APIs stay`,
    `- [Design decisions](${REPO}docs/decisions/README.md): the DDR-DS register`,
    '',
    ...cats.flatMap((cat) => [
      `## ${cat}`,
      '',
      ...comps.filter((c) => content[c.name]?.cat === cat).map((c) => `- [${c.name}](${REPO}docs/components/${kebab(c.name)}.md): ${first(content[c.name].summary)}`),
      '',
    ]),
  ].join('\n')

  const fullTxt = [
    '# Pance Design System: full reference',
    '',
    `> ${intro}`,
    '',
    'This file is generated from the source (TypeScript props, token files and the decision register). Facts here match the published version above.',
    '',
    '## Install and use',
    '',
    '```bash',
    'npm install @pance/react',
    '```',
    '',
    'Requires React 19. Without Tailwind: `import \'@pance/react/styles.css\'`. With Tailwind v4: `@import "@pance/react/tailwind.css";` in your stylesheet. Dark mode: set `data-theme="dark"` on `<html>`. More in ' + `${REPO}packages/react/README.md.`,
    '',
    '## Rules for using Pance',
    '',
    ...rules.map((r) => `- ${r}`),
    '',
    '## Components',
    '',
    `${comps.length} components. Props are generated from the TypeScript source.`,
    '',
    ...comps.flatMap((c) => [pageToSection(pages.get(`${kebab(c.name)}.md`)), '']),
    '## Tokens',
    '',
    `${total} tokens in three tiers. CSS variable = \`--pance-\` + the token path in kebab-case (\`color.intent.primary.solid\` becomes \`--pance-color-intent-primary-solid\`). Product code reads semantic and component tokens; primitives are raw values. Every token with its value is in ${REPO}docs/tokens.md.`,
    '',
    ...tokenTiers.flatMap(({ tier, groups }) => [`## Tokens: ${tier}`, '', ...groups.map((g) => `- \`${g.group}.*\` — ${g.count} tokens`), '']),
    '## Design decisions',
    '',
    `Every decision is a DDR-DS record in ${REPO}docs/decisions/. Records are append-only.`,
    '',
    ...decisions.map((d) => `- ${d.id} (${d.status}, ${d.date}): ${d.title}`),
    '',
  ].join('\n')

  return new Map([['llms.txt', shortTxt + '\n'], ['llms-full.txt', fullTxt]])
}
