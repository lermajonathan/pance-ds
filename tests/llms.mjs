// llms.txt and llms-full.txt are generated for coding agents (DDR-DS-029).
// They must list every component and every token group, link only to pages that exist, and stay in sync.
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { extractComponents } from '../scripts/lib/extract-components.mjs'

const root = path.resolve(import.meta.dirname, '..')
const pub = (f) => path.join(root, 'public', f)
const SITE = 'https://pance-ds.jonathanlerma.com'
const REPO = 'https://github.com/lermajonathan/pance-ds/blob/main/'
const failures = []
const check = (ok, msg) => { if (!ok) failures.push(msg) }
const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

const read = (f) => (fs.existsSync(pub(f)) ? fs.readFileSync(pub(f), 'utf8') : null)
const short = read('llms.txt')
const full = read('llms-full.txt')
check(short !== null, 'public/llms.txt does not exist (run `pnpm docs`)')
check(full !== null, 'public/llms-full.txt does not exist (run `pnpm docs`)')

if (short !== null && full !== null) {
  // Shape of llms.txt: H1, one-line summary in a blockquote, then sections of links.
  check(/^# .+\n\n> .+/.test(short), 'llms.txt must start with an H1 and a blockquote summary')

  // Every exported component has its own section in llms-full.txt and a link in llms.txt.
  const comps = extractComponents()
  for (const c of comps) {
    check(full.includes(`\n### ${c.name}\n`), `llms-full.txt has no section for ${c.name}`)
    check(short.includes(`${REPO}docs/components/${kebab(c.name)}.md`), `llms.txt does not link the page of ${c.name}`)
  }

  // Every token group, per tier, is listed with its real token count.
  const count = (node) => Object.entries(node).reduce((n, [k, v]) => (k.startsWith('$') || typeof v !== 'object' ? n : n + ('$value' in v ? 1 : count(v))), 0)
  for (const tier of ['primitives', 'semantic', 'components']) {
    const json = JSON.parse(fs.readFileSync(path.join(root, 'tokens', `${tier}.json`), 'utf8'))
    const start = full.indexOf(`\n## Tokens: ${tier}\n`)
    check(start !== -1, `llms-full.txt has no "Tokens: ${tier}" section`)
    if (start === -1) continue
    const next = full.indexOf('\n## ', start + 1)
    const section = full.slice(start, next === -1 ? undefined : next)
    for (const [group, node] of Object.entries(json)) {
      if (group.startsWith('$')) continue
      check(section.includes(`- \`${group}.*\` — ${count(node)} tokens\n`), `Tokens: ${tier} is missing or has a wrong count for ${group}`)
    }
  }

  // Every link points to something that exists.
  for (const [, url] of short.matchAll(/\]\(([^)]+)\)/g)) {
    if (url.startsWith(REPO)) check(fs.existsSync(path.join(root, url.slice(REPO.length))), `llms.txt links a file that does not exist: ${url}`)
    else if (url.startsWith(SITE + '/')) {
      const rel = url.slice(SITE.length + 1)
      check(rel === '' || fs.existsSync(pub(rel)) || /^(en|es)(\/|$)/.test(rel), `llms.txt links a site path that is not served: ${url}`)
    } else check(false, `llms.txt links outside the project: ${url}`)
  }
  check(short.includes(`${SITE}/llms-full.txt`), 'llms.txt must link llms-full.txt')

  // The repo never names the tools or companies behind the agents (project rule).
  const vendors = new RegExp(['cl', 'aude|anthr', 'opic'].join(''), 'i')
  for (const [name, text] of [['llms.txt', short], ['llms-full.txt', full]]) check(!vendors.test(text), `${name} must not name the agent vendors`)

  // The generated text is in sync with the sources.
  try {
    execFileSync('node', [path.join(root, 'scripts/build-docs.mjs'), '--check'], { stdio: 'pipe' })
  } catch (e) {
    failures.push(`docs are stale: ${String(e.stderr || e.message).trim().split('\n')[0]}`)
  }
}

if (failures.length) {
  console.error(failures.map((f) => `✗ ${f}`).join('\n'))
  console.error(`\n${failures.length} problem(s)`)
  process.exit(1)
}
console.log('llms ok')
