import type { JiraConnectionConfig } from '../../../shared/jiraApi.js'
import { appConfig } from '../config.js'

function normalizeDomain(domain: string): string {
  return domain
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/\/.*$/, '')
}

export function buildMcpJiraEnv(
  connection?: JiraConnectionConfig,
): Record<string, string> {
  const domain = connection?.domain
    ? normalizeDomain(connection.domain)
    : ''
  const urlFromConnection = domain ? `https://${domain}` : ''
  const url = urlFromConnection || appConfig.mcp.env.JIRA_URL
  const username = connection?.email?.trim() || appConfig.mcp.env.JIRA_USERNAME
  const token = connection?.apiToken?.trim() || appConfig.mcp.env.JIRA_API_TOKEN

  return {
    ...process.env,
    JIRA_URL: url,
    JIRA_USERNAME: username,
    JIRA_API_TOKEN: token,
  }
}

export function getMissingJiraConfig(
  connection?: JiraConnectionConfig,
): string[] {
  const env = buildMcpJiraEnv(connection)
  const missing: string[] = []
  if (!env.JIRA_URL) missing.push('JIRA_URL / domain')
  if (!env.JIRA_USERNAME) missing.push('JIRA_USERNAME / email')
  if (!env.JIRA_API_TOKEN) missing.push('JIRA_API_TOKEN')
  return missing
}

export function resolveJiraDomain(connection?: JiraConnectionConfig): string {
  if (connection?.domain?.trim()) {
    return normalizeDomain(connection.domain)
  }
  return appConfig.jiraDomain.replace(/^https?:\/\//, '').replace(/\/$/, '')
}
