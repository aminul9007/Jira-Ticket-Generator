import { config as loadEnv } from 'dotenv'
import { resolve } from 'node:path'

loadEnv({ path: resolve(process.cwd(), '.env') })

function parseArgs(raw: string | undefined): string[] {
  if (!raw?.trim()) return []
  return raw.split(',').map((part) => part.trim()).filter(Boolean)
}

function parseCorsOrigins(raw: string | undefined): string | string[] {
  const origins = raw
    ?.split(',')
    .map((part) => part.trim())
    .filter(Boolean)

  if (!origins?.length) return 'http://localhost:5173'
  if (origins.length === 1) return origins[0]
  return origins
}

export const appConfig = {
  port: Number(process.env.PORT ?? 3001),
  corsOrigin: parseCorsOrigins(process.env.CORS_ORIGIN),
  jiraDomain: process.env.JIRA_DOMAIN?.trim() ?? '',
  defaultProjectKey: process.env.JIRA_DEFAULT_PROJECT_KEY?.trim() ?? '',
  defaultIssueType: process.env.JIRA_DEFAULT_ISSUE_TYPE?.trim() || 'Bug',
  mcpMock: process.env.JIRA_MCP_MOCK === 'true',
  mcp: {
    command: process.env.MCP_SERVER_COMMAND?.trim() || 'mcp-atlassian',
    args: parseArgs(process.env.MCP_SERVER_ARGS),
    createTool: process.env.MCP_JIRA_CREATE_TOOL?.trim() || 'jira_create_issue',
    env: {
      JIRA_URL: process.env.JIRA_URL?.trim() ?? '',
      JIRA_USERNAME: process.env.JIRA_USERNAME?.trim() ?? '',
      JIRA_API_TOKEN: process.env.JIRA_API_TOKEN?.trim() ?? '',
      JIRA_API_TOKEN_ALT: process.env.JIRA_API_TOKEN?.trim() ?? '',
    },
  },
} as const
