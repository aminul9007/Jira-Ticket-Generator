import type { JiraSettings } from '../types/appSettings'
import type { JiraConnectionConfig } from '../../shared/jiraApi'

/** Build optional Jira credentials for the API backend / MCP server. */
export function buildJiraConnectionConfig(
  jira: JiraSettings,
): JiraConnectionConfig | undefined {
  const domain = jira.domain.trim()
  const email = jira.email.trim()
  const apiToken = jira.apiToken.trim()
  if (!domain || !email || !apiToken) return undefined
  return { domain, email, apiToken }
}
