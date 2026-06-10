import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import type { JiraConnectionConfig } from '../../../shared/jiraApi.js'
import { appConfig } from '../config.js'
import { ApiError } from '../errors.js'
import { buildMcpJiraEnv } from './mcpEnv.js'

export async function withMcpClient<T>(
  operation: (client: Client) => Promise<T>,
  connection?: JiraConnectionConfig,
): Promise<T> {
  const transport = new StdioClientTransport({
    command: appConfig.mcp.command,
    args: [...appConfig.mcp.args],
    env: buildMcpJiraEnv(connection),
  })

  const client = new Client(
    { name: 'qa-bug-report-api', version: '1.0.0' },
    { capabilities: {} },
  )

  try {
    await client.connect(transport)
    return await operation(client)
  } catch (error) {
    throw new ApiError(
      502,
      'MCP_CONNECTION_ERROR',
      error instanceof Error
        ? error.message
        : 'Failed to start or communicate with the Jira MCP server.',
    )
  } finally {
    try {
      await client.close()
    } catch {
      /* ignore */
    }
  }
}

export async function callMcpTool(
  toolName: string,
  args: Record<string, unknown>,
  connection?: JiraConnectionConfig,
): Promise<unknown> {
  return withMcpClient(async (client) => {
    const result = await client.callTool({ name: toolName, arguments: args })

    if (result.isError) {
      const message =
        typeof result.content?.[0] === 'object' &&
        result.content[0] &&
        'text' in result.content[0]
          ? String((result.content[0] as { text: string }).text)
          : 'Jira MCP tool returned an error.'
      throw new ApiError(502, 'JIRA_API_ERROR', message)
    }

    return result
  }, connection)
}

export async function listMcpTools(connection?: JiraConnectionConfig) {
  return withMcpClient(async (client) => {
    const result = await client.listTools()
    return result.tools
  }, connection)
}
