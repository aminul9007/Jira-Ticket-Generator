import type {
  CreateJiraIssuePayload,
  CreateJiraIssueResponse,
  JiraApiErrorBody,
} from '../../../shared/jiraApi'
import { mapJiraApiError } from './mapJiraApiError'

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? ''

export class JiraCreateIssueError extends Error {
  readonly status: number
  readonly code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = 'JiraCreateIssueError'
    this.status = status
    this.code = code
  }
}

export async function createJiraIssue(
  payload: CreateJiraIssuePayload,
): Promise<CreateJiraIssueResponse> {
  let response: Response

  try {
    response = await fetch(`${API_BASE}/api/jira/issues`, {
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
