import type {
  CreateJiraIssuePayload,
  CreateJiraIssueResponse,
} from '../../../shared/jiraApi.js'
import { appConfig } from '../config.js'
import { ApiError } from '../errors.js'
import { getMissingJiraConfig, resolveJiraDomain } from '../mcp/mcpEnv.js'
import { callMcpTool } from '../mcp/McpClient.js'
import { buildJiraIssueDescription } from './buildDescription.js'
import { parseMcpIssueResult } from './parseMcpIssueResult.js'

function buildIssueUrl(issueKey: string, connection?: CreateJiraIssuePayload['connection']): string {
  const domain = resolveJiraDomain(connection)
  if (!domain) {
    return `https://your-domain.atlassian.net/browse/${issueKey}`
  }
  return `https://${domain}/browse/${issueKey}`
}

function mapPriorityToJiraName(priority: string): string | undefined {
  const map: Record<string, string> = {
    P0: 'Highest',
    P1: 'High',
    P2: 'Medium',
    P3: 'Low',
    P4: 'Lowest',
  }
  return map[priority.trim().toUpperCase()]
}

function buildToolArguments(payload: CreateJiraIssuePayload): Record<string, unknown> {
  const projectKey = payload.projectKey?.trim() || appConfig.defaultProjectKey
  if (!projectKey) {
    throw new ApiError(
      400,
      'VALIDATION_ERROR',
      'projectKey is required. Configure it in Settings → Ticket Defaults or set JIRA_DEFAULT_PROJECT_KEY on the API server.',
    )
  }

  const issueType = payload.issueType?.trim() || appConfig.defaultIssueType
  const description = buildJiraIssueDescription(payload)

  const additionalFields: Record<string, unknown> = {}
  if (payload.labels && payload.labels.length > 0) {
    additionalFields.labels = payload.labels
  }
  const jiraPriority = mapPriorityToJiraName(payload.priority)
  if (jiraPriority) {
    additionalFields.priority = { name: jiraPriority }
  }

  const args: Record<string, unknown> = {
    project_key: projectKey,
    issue_type: issueType,
    summary: payload.title.trim(),
    description,
  }

  if (payload.assignee?.trim()) {
    args.assignee = payload.assignee.trim()
  }

  if (payload.reporter?.trim()) {
    args.reporter = payload.reporter.trim()
  }

  if (Object.keys(additionalFields).length > 0) {
    args.additional_fields = JSON.stringify(additionalFields)
  }

  return args
}

export async function createIssueViaMcp(
  payload: CreateJiraIssuePayload,
): Promise<CreateJiraIssueResponse> {
  const { connection, ...issuePayload } = payload

  if (process.env.JIRA_MCP_MOCK === 'true') {
    const mockKey = `${issuePayload.projectKey?.trim() || appConfig.defaultProjectKey || 'QA'}-123`
    return {
      issueKey: mockKey,
      issueUrl: buildIssueUrl(mockKey, connection),
    }
  }

  const missing = getMissingJiraConfig(connection)
  if (missing.length > 0) {
    throw new ApiError(
      400,
      'VALIDATION_ERROR',
      `Missing Jira configuration: ${missing.join(', ')}. Add credentials in Settings or server/.env.`,
    )
  }

  const toolArgs = buildToolArguments(issuePayload)
  const rawResult = await callMcpTool(
    appConfig.mcp.createTool,
    toolArgs,
    connection,
  )
  const { issueKey } = parseMcpIssueResult(rawResult)

  return {
    issueKey,
    issueUrl: buildIssueUrl(issueKey, connection),
  }
}
