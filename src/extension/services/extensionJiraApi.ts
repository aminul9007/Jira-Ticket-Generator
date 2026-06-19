import type {
  CreateJiraIssuePayload,
  CreateJiraIssueResponse,
  JiraApiErrorBody,
  JiraConnectionConfig,
  McpStatusResponse,
} from '../../../shared/jiraApi'
import { JiraCreateIssueError } from '../../services/jira/createJiraIssue'
import { mapJiraApiError } from '../../services/jira/mapJiraApiError'
import { getApiBaseUrl, resolveExtensionApiBaseUrl } from '../config/extensionConfig'

export async function testExtensionMcpConnection(
  connection?: JiraConnectionConfig,
): Promise<McpStatusResponse> {
  const baseUrl = (await resolveExtensionApiBaseUrl()) ?? getApiBaseUrl()
  let response: Response

  try {
    response = await fetch(`${baseUrl}/api/jira/mcp/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ connection }),
    })
  } catch {
    return {
      connected: false,
      mockMode: false,
      hasCreateTool: false,
      toolCount: 0,
      createTool: 'jira_create_issue',
      message:
        'Could not reach the API backend. Start it with npm run api:dev in a separate terminal.',
    }
  }

  const body = (await response.json().catch(() => null)) as
    | McpStatusResponse
    | { error?: string; code?: string }
    | null

  if (!response.ok) {
    return {
      connected: false,
      mockMode: false,
      hasCreateTool: false,
      toolCount: 0,
      createTool: 'jira_create_issue',
      message: mapJiraApiError(response.status, {
        error:
          body && typeof body === 'object' && 'error' in body && typeof body.error === 'string'
            ? body.error
            : 'Request failed',
      }),
    }
  }

  return body as McpStatusResponse
}

export async function createExtensionJiraIssue(
  payload: CreateJiraIssuePayload,
): Promise<CreateJiraIssueResponse> {
  const baseUrl = (await resolveExtensionApiBaseUrl()) ?? getApiBaseUrl()
  let response: Response

  try {
    response = await fetch(`${baseUrl}/api/jira/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new JiraCreateIssueError(
      mapJiraApiError(0, { error: '', code: 'NETWORK_ERROR' }),
      0,
      'NETWORK_ERROR',
    )
  }

  const body = (await response.json().catch(() => null)) as
    | (CreateJiraIssueResponse & JiraApiErrorBody)
    | null

  if (!response.ok) {
    throw new JiraCreateIssueError(
      mapJiraApiError(response.status, body),
      response.status,
      body?.code,
    )
  }

  if (!body?.issueKey || !body.issueUrl) {
    throw new JiraCreateIssueError(
      'The server response did not include issue details.',
      response.status,
    )
  }

  return { issueKey: body.issueKey, issueUrl: body.issueUrl }
}
