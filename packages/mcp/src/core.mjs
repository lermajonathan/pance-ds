// Pure lookups over the snapshot. No I/O, so every behaviour can be tested without a server.

const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '')

function distance(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0]
    row[0] = i
    for (let j = 1; j <= b.length; j++) {
      const tmp = row[j]
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1))
      prev = tmp
    }
  }
  return row[b.length]
}

// The closest names to a mistyped one: substring matches first, then small edit distance.
export function suggest(name, candidates, max = 3) {
  const n = norm(name)
  return candidates
    .map((c) => ({ c, d: norm(c).includes(n) || n.includes(norm(c)) ? 0 : distance(n, norm(c)) }))
    .filter(({ d }) => d <= Math.max(2, Math.floor(n.length / 4)))
    .sort((x, y) => x.d - y.d || x.c.length - y.c.length)
    .slice(0, max)
    .map(({ c }) => c)
}

export function listComponents(snap, category) {
  return snap.components
    .filter((c) => !category || c.category.toLowerCase() === category.toLowerCase())
    .map(({ name, category: cat, summary }) => ({ name, category: cat, summary }))
}

export function categories(snap) {
  return [...new Set(snap.components.map((c) => c.category))]
}

// "Button", "button" and "date-picker" all work; a wrong spelling does not.
export function getComponent(snap, name) {
  const found = snap.components.find((c) => norm(c.name) === norm(name))
  if (found) return { ok: true, value: found }
  const near = suggest(name, snap.components.map((c) => c.name))
  return { ok: false, error: `No component named "${name}".${near.length ? ` Did you mean: ${near.join(', ')}?` : ''} Call list_components for the full list.` }
}

export function searchTokens(snap, { query = '', tier, limit = 20 } = {}) {
  const terms = String(query).toLowerCase().split(/[\s._-]+/).filter(Boolean)
  const max = Math.min(Math.max(limit, 1), 100)
  const hits = []
  for (const t of snap.tokens) {
    if (tier && t.tier !== tier) continue
    const hay = `${t.name} ${t.description ?? ''}`.toLowerCase().replace(/[-]/g, '.')
    if (!terms.every((w) => hay.includes(w))) continue
    const nameHits = terms.filter((w) => t.name.toLowerCase().includes(w)).length
    hits.push({ t, score: nameHits * 10 - t.name.length / 100 })
  }
  return hits
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .map(({ t }) => ({ name: t.name, tier: t.tier, type: t.type, value: t.value, cssVariable: t.cssVariable }))
}

// A token by its path, or by its CSS variable.
export function getToken(snap, name) {
  const key = String(name).trim()
  const found = snap.tokens.find((t) => t.name === key || t.cssVariable === key)
  if (found) return { ok: true, value: found }
  const near = suggest(key, snap.tokens.map((t) => t.name))
  return { ok: false, error: `No token named "${name}".${near.length ? ` Did you mean: ${near.join(', ')}?` : ''} Use search_tokens to look one up.` }
}

export function listDecisions(snap) {
  return snap.decisions.map(({ id, title, date, status }) => ({ id, title, date, status }))
}

// "DDR-DS-029", "ddr-ds-29" and "29" all work.
export function getDecision(snap, id) {
  const n = String(id).match(/(\d+)\s*$/)?.[1]
  const found = n && snap.decisions.find((d) => Number(d.id.match(/(\d+)$/)[1]) === Number(n))
  if (found) return { ok: true, value: found }
  return { ok: false, error: `No decision "${id}". Call list_decisions for the register.` }
}
