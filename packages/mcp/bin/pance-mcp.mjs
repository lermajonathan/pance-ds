#!/usr/bin/env node
// Starts the Pance MCP server on stdio. Read-only: it reads dist/snapshot.json and nothing else.
import { readFileSync } from 'node:fs'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { createServer } from '../src/server.mjs'

const snapshot = JSON.parse(readFileSync(new URL('../dist/snapshot.json', import.meta.url), 'utf8'))
await createServer(snapshot).connect(new StdioServerTransport())
