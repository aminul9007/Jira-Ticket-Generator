import type {
  JiraApiErrorCode,
  JiraConnectionConfig,
  McpStatusResponse,
} from '../../../shared/jiraApi'
import { mapJiraApiError } from './mapJiraApiError'

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? ''

export async function testMcpViaApi(
  connection?: JiraConnectionConfig,
): Promise<McpStatusResponse> {
  let response: Response

  try {
    response = await fetch(`${API_BASE}/api/jira/mcp/test`, {
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
    | { error?: string }
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
        code:
          body && typeof body === 'object' && 'code' in body
            ? (body.code as JiraApiErrorCode | undefined)
            : undefined,
      }),
    }
  }

  return body as McpStatusResponse
}
