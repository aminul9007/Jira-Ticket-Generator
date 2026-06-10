/** Shared contract between the React app and the Jira API backend. */

/** Optional per-request Jira credentials from app Settings (sent only to your API backend). */
export interface JiraConnectionConfig {
  domain: string
  email: string
  apiToken: string
}

export interface CreateJiraIssuePayload {
  title: string
  summary: string
  steps: string[]
  expected: string
  actual: string
  severity: string
  priority: string
  environment: string
  browser: string
  os: string
  device: string
  /** Optional Jira defaults from app settings (non-secret). */
  projectKey?: string
  issueType?: string
  labels?: string[]
  assignee?: string
  /** When set, the API uses these credentials for the MCP child process. */
  connection?: JiraConnectionConfig
}

export interface McpStatusResponse {
  connected: boolean
  mockMode: boolean
  hasCreateTool: boolean
  toolCount: number
  createTool: string
  message: string
  missingConfig?: string[]
}

export interface CreateJiraIssueResponse {
  issueKey: string
  issueUrl: string
}

export interface JiraApiErrorBody {
  error: string
  code?: JiraApiErrorCode
}

export type JiraApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'MCP_CONNECTION_ERROR'
  | 'JIRA_AUTH_ERROR'
  | 'JIRA_API_ERROR'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR'
