import type { JiraApiErrorCode } from '../../shared/jiraApi.js'

export class ApiError extends Error {
  readonly status: number
  readonly code: JiraApiErrorCode

  constructor(status: number, code: JiraApiErrorCode, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

export function mapUnknownError(error: unknown): ApiError {
  if (error instanceof ApiError) return error

  const message = error instanceof Error ? error.message : String(error)
  const lower = message.toLowerCase()

  if (
    lower.includes('401') ||
    lower.includes('403') ||
    lower.includes('unauthorized') ||
    lower.includes('authentication') ||
    lower.includes('invalid credentials')
  ) {
    return new ApiError(
      502,
      'JIRA_AUTH_ERROR',
      'Jira authentication failed. Check JIRA_USERNAME and JIRA_API_TOKEN on the API server.',
    )
  }

  if (
    lower.includes('econnrefused') ||
    lower.includes('spawn') ||
    lower.includes('enoent') ||
    lower.includes('mcp') ||
    lower.includes('transport')
  ) {
    return new ApiError(
      502,
      'MCP_CONNECTION_ERROR',
      'Could not connect to the Jira MCP server. Verify MCP_SERVER_COMMAND and MCP_SERVER_ARGS.',
    )
  }

  if (lower.includes('network') || lower.includes('fetch failed')) {
    return new ApiError(503, 'NETWORK_ERROR', 'Network error while contacting Jira.')
  }

  return new ApiError(500, 'UNKNOWN_ERROR', message || 'An unexpected error occurred.')
}
