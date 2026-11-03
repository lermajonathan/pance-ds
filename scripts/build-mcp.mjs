// Builds the @pance/mcp package: the snapshot the server reads (generated from the sources) and the licence.
// Run with `pnpm build:mcp`. The server code itself lives in packages/mcp/src and is not bundled.
import fs from 'node:fs'
import path from 'node:path'
import { extractComponents } from './lib/extract-components.mjs'
import { content } from './docs/index.mjs'
import { buildSnapshot } from './lib/mcp-snapshot.mjs'

const root = path.resolve(import.meta.dirname, '..')
const dist = path.join(root, 'packages/mcp/dist')
fs.rmSync(dist, { recursive: true, force: true })
fs.mkdirSync(dist, { recursive: true })
const snapshot = buildSnapshot({ comps: extractComponents(), content })
fs.writeFileSync(path.join(dist, 'snapshot.json'), JSON.stringify(snapshot))
fs.copyFileSync(path.join(root, 'LICENSE'), path.join(root, 'packages/mcp/LICENSE'))
console.log(`✓ @pance/mcp snapshot: ${snapshot.components.length} components, ${snapshot.tokens.length} tokens, ${snapshot.decisions.length} decisions`)
