// Prepares dist/ for GitHub Pages: one index.html per route (so deep links return 200),
// a 404.html fallback for anything else, and the CNAME for the custom domain.
import fs from 'node:fs'
import path from 'node:path'

const dist = path.resolve('dist')
const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
const app = fs.readFileSync(path.resolve('src/site/App.tsx'), 'utf8')
const pages = [...app.matchAll(/key: '([a-z0-9-]+)'/g)].map((m) => m[1]).filter((k) => k !== 'home')
const langs = ['en', 'es']
let n = 0
for (const lang of langs) {
  for (const route of ['', ...pages]) {
    const dir = path.join(dist, lang, route)
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(path.join(dir, 'index.html'), html)
    n++
  }
}
fs.writeFileSync(path.join(dist, '404.html'), html)
if (process.env.PAGES_CNAME) fs.writeFileSync(path.join(dist, 'CNAME'), process.env.PAGES_CNAME + '\n')
console.log(`pages: ${n} routes, 404.html${process.env.PAGES_CNAME ? ', CNAME ' + process.env.PAGES_CNAME : ''}`)
