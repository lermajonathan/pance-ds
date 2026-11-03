// Motion must respect prefers-reduced-motion (DDR-DS-030).
// 1. A global guard in the stylesheet neutralises every transition and animation.
// 2. Every Tailwind animate-* utility in components is itself gated (motion-safe / motion-reduce).
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const failures = []
const check = (ok, msg) => { if (!ok) failures.push(msg) }

const css = fs.readFileSync(path.join(root, 'src/styles/index.css'), 'utf8')
const guard = css.match(/@media \(prefers-reduced-motion: reduce\)\s*\{([\s\S]*?)\n\}/g) ?? []
const global = guard.find((b) => /\*/.test(b) && /transition-duration/.test(b) && /animation-duration/.test(b))
check(Boolean(global), 'src/styles/index.css has no global prefers-reduced-motion guard that zeroes transition-duration and animation-duration for all elements')

const dir = path.join(root, 'src/components')
for (const f of fs.readdirSync(dir).filter((n) => n.endsWith('.tsx'))) {
  fs.readFileSync(path.join(dir, f), 'utf8').split('\n').forEach((line, i) => {
    for (const m of line.matchAll(/(?<![\w:-])animate-(spin|pulse|ping|bounce)\b/g)) {
      const gated = line.includes(`motion-safe:animate-${m[1]}`) || line.includes('motion-reduce:animate-none')
      check(gated, `${f}:${i + 1} animate-${m[1]} is not gated by motion-safe / motion-reduce`)
    }
  })
}

// 3. Token: counting up has its own motion token, and the hook's default duration matches it.
const semantic = JSON.parse(fs.readFileSync(path.join(root, 'tokens/semantic.json'), 'utf8'))
const primitives = JSON.parse(fs.readFileSync(path.join(root, 'tokens/primitives.json'), 'utf8'))
const count = semantic.motion?.transition?.count
check(Boolean(count), 'tokens/semantic.json has no motion.transition.count')
const tokenMs = count ? parseInt(primitives.duration[count.$value.duration.replace(/[{}]/g, '').split('.')[1]].$value, 10) : null

// 4. Hook logic (DDR-DS-030): startCountUp is framework-free so it can be tested with a fake clock.
let mod = null
try { mod = await import('../src/components/motion.ts') } catch (e) { check(false, `src/components/motion.ts cannot be imported: ${e.message.split('\n')[0]}`) }
if (mod) {
  check(mod.COUNT_UP_MS === tokenMs, `COUNT_UP_MS (${mod.COUNT_UP_MS}) must equal motion.transition.count (${tokenMs}ms)`)
  check(mod.countUpValue(0, 100, 0, 500) === 0, 'countUpValue starts at the origin')
  check(mod.countUpValue(0, 100, 500, 500) === 100, 'countUpValue ends exactly at the target')
  check(mod.countUpValue(0, 100, 900, 500) === 100, 'countUpValue clamps after the duration')
  const mid = mod.countUpValue(0, 100, 250, 500)
  check(mid > 50 && mid < 100, `countUpValue eases out (got ${mid} at half time)`)
  check(mod.countUpValue(100, 0, 250, 500) < 50, 'countUpValue counts down too')

  const run = (reduced) => {
    let t = 0
    const frames = []
    const queue = []
    const stop = mod.startCountUp(0, 100, { duration: 500, reduced, now: () => t, raf: (cb) => (queue.push(cb), queue.length), caf: () => { queue.length = 0 }, onFrame: (v) => frames.push(v) })
    while (queue.length && t <= 1000) { t += 100; queue.shift()() }
    return { frames, stop }
  }
  const reduced = run(true)
  check(reduced.frames.length === 1 && reduced.frames[0] === 100, `under reduced motion the target is set at once (got ${JSON.stringify(reduced.frames)})`)
  const normal = run(false)
  check(normal.frames.at(-1) === 100 && normal.frames.length > 2, 'without reduced motion it animates and ends at the target')
  check(normal.frames.every((v, i, a) => i === 0 || v >= a[i - 1]), 'frames never go backwards')

  const { renderToString } = await import('react-dom/server')
  const { createElement: h } = await import('react')
  const Probe = () => h('span', null, mod.useCountUp(1234))
  check(renderToString(h(Probe)) === '<span>1234</span>', 'the server render already shows the final value')
}

// 5. Chart entrance (DDR-DS-030): line, bar and donut charts animate in through CSS classes that use the motion tokens.
const charts = fs.readFileSync(path.join(root, 'src/components/charts.tsx'), 'utf8')
const fn = (name) => charts.slice(charts.indexOf(`export function ${name}(`)).split(/\n\/\* ── /)[0]
for (const [name, cls] of [['LineChart', 'pance-chart-reveal'], ['BarChart', 'pance-chart-grow'], ['DonutChart', 'pance-chart-fade']]) {
  check(fn(name).includes(cls), `${name} does not use ${cls}`)
  const rule = css.match(new RegExp(`\\.${cls}\\s*\\{([^}]*)\\}`))
  check(Boolean(rule), `src/styles/index.css does not define .${cls}`)
  if (rule) check(/var\(--pance-duration-slower\)/.test(rule[1]) && /var\(--pance-easing-out-expo\)/.test(rule[1]), `.${cls} must use the duration and easing tokens, not raw values`)
}
check(/@media \(prefers-reduced-motion: reduce\)[\s\S]*\.pance-chart-(reveal|grow|fade)/.test(css), 'the chart entrance classes are turned off under prefers-reduced-motion')
// Highlight on hover moves smoothly (opacity / stroke width), never carries data.
check(/transition-opacity/.test(fn('BarChart')), 'BarChart hover highlight does not transition opacity')

if (failures.length) { console.error(failures.map((f) => `✗ ${f}`).join('\n')); process.exit(1) }
console.log('motion ok')
