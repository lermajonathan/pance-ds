// Builds the two publishable packages from the repo sources:
//   packages/tokens  → @pance/tokens  (CSS variables, Tailwind theme, typed JS object, JSON)
//   packages/react   → @pance/react   (components + icons, precompiled CSS, Tailwind entry, types)
// Run with `pnpm build:packages` (tokens are rebuilt first).
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const run = (cmd) => execSync(cmd, { cwd: root, stdio: 'inherit' })
const rel = (p) => path.join(root, p)
const copy = (from, to) => { fs.mkdirSync(path.dirname(rel(to)), { recursive: true }); fs.copyFileSync(rel(from), rel(to)) }
const read = (p) => fs.readFileSync(rel(p), 'utf8')
const write = (p, s) => { fs.mkdirSync(path.dirname(rel(p)), { recursive: true }); fs.writeFileSync(rel(p), s) }

/* ── @pance/tokens ── */
fs.rmSync(rel('packages/tokens/dist'), { recursive: true, force: true })
copy('src/styles/tokens.css', 'packages/tokens/dist/tokens.css')
copy('src/styles/theme.css', 'packages/tokens/dist/theme.css')
copy('tokens/dist/tokens.json', 'packages/tokens/dist/tokens.json')
for (const f of ['primitives', 'semantic', 'components']) copy(`tokens/${f}.json`, `packages/tokens/dist/json/${f}.json`)
run('npx tsc src/tokens.ts --declaration --module esnext --target es2020 --skipLibCheck --outDir packages/tokens/dist')

/* ── @pance/react ── */
run('npx vite build -c vite.lib.config.ts --logLevel warn')
run('npx tsc -p tsconfig.lib.json')
// The stylesheet is shipped as a separate file, so drop the CSS import from the type entry.
write('packages/react/dist/types/lib.d.ts', read('packages/react/dist/types/lib.d.ts').replace(/^import '\.\/styles\/pance\.css';\n/m, ''))
// Tailwind entry: tokens + theme + component rules, and tell Tailwind to scan the package.
write('packages/react/dist/tailwind.css', [
  '/* @pance/react/tailwind.css — for apps that already use Tailwind v4.',
  '   Use after `@import "tailwindcss";` in your stylesheet. */',
  '@source "./index.js";',
  read('src/styles/tokens.css'),
  read('src/styles/theme.css'),
  read('src/styles/components.css'),
].join('\n'))

for (const pkg of ['tokens', 'react']) copy('LICENSE', `packages/${pkg}/LICENSE`)
const sizes = (dir) => fs.readdirSync(rel(dir), { recursive: true }).filter((f) => fs.statSync(rel(path.join(dir, f))).isFile()).length
console.log(`\n✓ @pance/tokens (${sizes('packages/tokens/dist')} files) · @pance/react (${sizes('packages/react/dist')} files)`)
