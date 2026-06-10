import type { JiraConnectionConfig, McpStatusResponse } from '../../../shared/jiraApi.js'
import { appConfig } from '../config.js'
import { getMissingJiraConfig } from './mcpEnv.js'
import { listMcpTools } from './McpClient.js'

export async function testMcpConnection(
  connection?: JiraConnectionConfig,
): Promise<McpStatusResponse> {
  if (process.env.JIRA_MCP_MOCK === 'true') {
    return {
      connected: true,
      mockMode: true,
      hasCreateTool: true,
      toolCount: 1,
      createTool: appConfig.mcp.createTool,
      message: 'Mock mode enabled — issue creation returns a fake QA-123 ticket.',
    }
  }

  const missing = getMissingJiraConfig(connection)
  if (missing.length > 0) {
    return {
      connected: false,
      mockMode: false,
      hasCreateTool: false,
      toolCount: 0,
      createTool: appConfig.mcp.createTool,
      message: `Missing Jira configuration: ${missing.join(', ')}. Add them in Settings or server/.env.`,
      missingConfig: missing,
    }
  }

  try {
    const tools = await listMcpTools(connection)
    const names = tools.map((tool) => tool.name)
    const hasCreateTool = names.includes(appConfig.mcp.createTool)

    return {
      connected: true,
      mockMode: false,
      hasCreateTool,
      toolCount: names.length,
      createTool: appConfig.mcp.createTool,
      message: hasCreateTool
        ? `Connected to Jira MCP (${names.length} tools available).`
        : `MCP connected but "${appConfig.mcp.createTool}" was not found. Set MCP_JIRA_CREATE_TOOL to a valid tool name.`,
    }
  } catch (error) {
    return {
      connected: false,
      mockMode: false,
      hasCreateTool: false,
      toolCount: 0,
      createTool: appConfig.mcp.createTool,
      message:
        error instanceof Error
          ? error.message
          : 'Could not connect to the Jira MCP server.',
    }
  }
}
