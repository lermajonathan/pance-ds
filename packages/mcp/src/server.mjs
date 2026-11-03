// The @pance/mcp server: six read-only tools over a snapshot generated at build time.
// No network, no keys, no telemetry, and it never writes a file (DDR-DS-029).
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { categories, getComponent, getDecision, getToken, listComponents, listDecisions, searchTokens } from './core.mjs'

const INSTRUCTIONS = [
  'Pance is a React design system. Ask this server before writing UI code; do not guess component names, props or token names.',
  'Import components from `@pance/react`; never copy component source into a project.',
  'Call list_components, then get_component for the exact props, accessibility notes and a working example.',
  'Colours and sizes come from tokens: use the semantic utilities or the `--pance-*` CSS variables, never a raw colour. Use search_tokens and get_token to find them.',
  'Wrap every form control in `Field`. Status always carries an icon and a label. A chart never mixes status colours with categorical ones, and scatter charts take at most two series.',
  'list_decisions and get_decision return the design decisions (DDR-DS) behind these rules. Check the deprecation policy before using anything marked deprecated.',
].join('\n')

const readOnly = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }
const ok = (value) => ({ content: [{ type: 'text', text: JSON.stringify(value, null, 2) }] })
const fail = (message) => ({ isError: true, content: [{ type: 'text', text: message }] })
const lookup = (r) => (r.ok ? ok(r.value) : fail(r.error))

export function createServer(snapshot) {
  const server = new McpServer({ name: 'pance', version: snapshot.version }, { instructions: INSTRUCTIONS })
  const cats = categories(snapshot)

  server.registerTool('list_components', {
    title: 'List components',
    description: `Lists every Pance component with its category and a one-line summary. Optional category filter: ${cats.join(', ')}.`,
    inputSchema: { category: z.string().optional().describe('Only components in this category') },
    annotations: readOnly,
  }, async ({ category }) => {
    const list = listComponents(snapshot, category)
    return list.length ? ok(list) : fail(`No components in category "${category}". Categories: ${cats.join(', ')}.`)
  })

  server.registerTool('get_component', {
    title: 'Get a component',
    description: 'Returns one component: import line, source file, props with types and defaults (generated from the TypeScript source), when to use it and when not, accessibility behaviour, related components and a working example.',
    inputSchema: { name: z.string().describe('Component name, for example Button or DatePicker') },
    annotations: readOnly,
  }, async ({ name }) => lookup(getComponent(snapshot, name)))

  server.registerTool('search_tokens', {
    title: 'Search tokens',
    description: 'Searches design tokens by words in their name or description, for example "intent primary solid" or "focus ring". Returns name, tier, type, resolved value and CSS variable.',
    inputSchema: {
      query: z.string().describe('Words to look for'),
      tier: z.enum(['primitives', 'semantic', 'components']).optional().describe('Only this tier. Product code should read semantic and component tokens'),
      limit: z.number().int().min(1).max(100).optional().describe('Maximum results, default 20'),
    },
    annotations: readOnly,
  }, async (args) => ok(searchTokens(snapshot, args)))

  server.registerTool('get_token', {
    title: 'Get a token',
    description: 'Returns one token by its path (color.intent.primary.solid) or its CSS variable (--pance-color-intent-primary-solid): tier, type, resolved value, alias, dark-mode value and notes.',
    inputSchema: { name: z.string().describe('Token path or CSS variable') },
    annotations: readOnly,
  }, async ({ name }) => lookup(getToken(snapshot, name)))

  server.registerTool('list_decisions', {
    title: 'List design decisions',
    description: 'Lists the DDR-DS design decision records with id, title, date and status.',
    inputSchema: {},
    annotations: readOnly,
  }, async () => ok(listDecisions(snapshot)))

  server.registerTool('get_decision', {
    title: 'Get a design decision',
    description: 'Returns the full text of one decision record, for example DDR-DS-029.',
    inputSchema: { id: z.string().describe('Record id, for example DDR-DS-029 or 29') },
    annotations: readOnly,
  }, async ({ id }) => {
    const r = getDecision(snapshot, id)
    return r.ok ? { content: [{ type: 'text', text: r.value.text }] } : fail(r.error)
  })

  return server
}
