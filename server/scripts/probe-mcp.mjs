import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'

const command = process.env.MCP_SERVER_COMMAND || 'mcp-atlassian'
const args = process.env.MCP_SERVER_ARGS
  ? process.env.MCP_SERVER_ARGS.split(',').map((s) => s.trim()).filter(Boolean)
  : []

const transport = new StdioClientTransport({
  command,
  args,
  env: { ...process.env },
})

const client = new Client({ name: 'probe', version: '1.0.0' }, { capabilities: {} })
await client.connect(transport)
const tools = await client.listTools()
console.log(JSON.stringify({ toolCount: tools.tools.length, tools: tools.tools.map((t) => t.name) }, null, 2))
await client.close()
