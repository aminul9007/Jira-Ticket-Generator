import type { JiraSettings, TicketDefaultSettings } from '../types/appSettings'
import type { GeneratedTicket } from '../types/bugReport'
import type { ExtractedContext } from '../types/contextDetection'
import type { CreateJiraIssuePayload } from '../../shared/jiraApi'

function contextValue(value: string): string {
  const trimmed = value.trim()
  if (!trimmed || trimmed.toLowerCase() === 'unknown') return ''
  return trimmed
}

function formatEnvironment(
  ticketEnvironments: GeneratedTicket['environments'],
  detectedEnvironment: string,
): string {
  const fromTicket = ticketEnvironments.join(', ')
  const fromDetection = contextValue(detectedEnvironment)
  if (fromTicket && fromDetection) {
    return `${fromTicket} (${fromDetection})`
  }
  return fromTicket || fromDetection
}

function buildConnection(jira: JiraSettings): CreateJiraIssuePayload['connection'] {
  const domain = jira.domain.trim()
  const email = jira.email.trim()
  const apiToken = jira.apiToken.trim()
  if (!domain || !email || !apiToken) return undefined
  return { domain, email, apiToken }
}

export function buildJiraCreatePayload(
  ticket: GeneratedTicket,
  qaContext: ExtractedContext,
  ticketDefaults: TicketDefaultSettings,
  jira: JiraSettings,
): CreateJiraIssuePayload {
  return {
    title: ticket.title.trim(),
    summary: ticket.issueSummary.trim(),
    steps: ticket.stepsToReproduce,
    expected: ticket.expectedResult,
    actual: ticket.actualResult,
    severity: ticket.severity,
    priority: ticket.priority,
    environment: formatEnvironment(ticket.environments, qaContext.environment.value),
    browser: contextValue(qaContext.browser.value),
    os: contextValue(qaContext.os.value),
    device: contextValue(qaContext.device.value),
    projectKey: ticketDefaults.projectKey.trim() || undefined,
    issueType: ticketDefaults.issueType,
    labels: ticketDefaults.labels.length > 0 ? ticketDefaults.labels : undefined,
    assignee: ticketDefaults.assignee.trim() || undefined,
    connection: buildConnection(jira),
  }
}
