import type { JiraApiErrorBody, JiraApiErrorCode } from '../../../shared/jiraApi'

const FRIENDLY_MESSAGES: Record<JiraApiErrorCode, string> = {
  VALIDATION_ERROR: 'Some ticket fields are missing or invalid.',
  MCP_CONNECTION_ERROR:
    'Could not reach the Jira MCP server. Make sure the API backend is running and MCP is configured.',
  JIRA_AUTH_ERROR:
    'Jira authentication failed on the server. Check API server credentials.',
  JIRA_API_ERROR: 'Jira rejected the issue creation request.',
  NETWORK_ERROR:
    'Network error while creating the Jira ticket. Check your connection and API URL.',
  UNKNOWN_ERROR: 'Something went wrong while creating the Jira ticket.',
}

export function mapJiraApiError(
  status: number,
  body: JiraApiErrorBody | null,
  fallbackMessage?: string,
): string {
  if (body?.error) {
    return body.error
  }

  if (body?.code && FRIENDLY_MESSAGES[body.code]) {
    return FRIENDLY_MESSAGES[body.code]
  }

  if (status === 404) {
    return 'Jira API endpoint not found. Is the backend server running?'
  }

  if (status >= 500) {
    return FRIENDLY_MESSAGES.UNKNOWN_ERROR
  }

  return fallbackMessage ?? FRIENDLY_MESSAGES.UNKNOWN_ERROR
}
