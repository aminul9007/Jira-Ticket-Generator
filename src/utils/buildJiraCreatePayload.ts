import type { JiraSettings, TicketDefaultSettings } from '../types/appSettings'
import type { GeneratedTicket } from '../types/bugReport'
import type { ExtractedContext } from '../types/contextDetection'
import type { CreateJiraIssuePayload } from '../../shared/jiraApi'
import type { TicketTemplateSettings } from '../../shared/ticketTemplate'
import {
  createDefaultTicketTemplateSettings,
  isTemplateFieldEnabled,
} from '../../shared/ticketTemplate'

function contextValue(value: string): string {
  const trimmed = value.trim()
  if (!trimmed || trimmed.toLowerCase() === 'unknown') return ''
  return trimmed
}

function formatEnvironment(
  ticketEnvironments: GeneratedTicket['environments'],
  detectedEnvironment: string,
  includeEnvironment: boolean,
): string {
  if (!includeEnvironment) return ''
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
  template: TicketTemplateSettings = createDefaultTicketTemplateSettings(),
): CreateJiraIssuePayload {
  const include = (field: Parameters<typeof isTemplateFieldEnabled>[1]) =>
    isTemplateFieldEnabled(template, field)

  const summary = include('issueSummary')
    ? ticket.issueSummary.trim()
    : ticket.title.trim()

  return {
    title: ticket.title.trim(),
    summary,
    steps: include('stepsToReproduce') ? ticket.stepsToReproduce : [],
    expected: include('expectedResult') ? ticket.expectedResult : '',
    actual: include('actualResult') ? ticket.actualResult : '',
    severity: include('severity') ? ticket.severity : '',
    priority: include('priority') ? ticket.priority : '',
    environment: formatEnvironment(
      ticket.environments,
      qaContext.environment.value,
      include('environment'),
    ),
    browser: include('qaContext') ? contextValue(qaContext.browser.value) : '',
    os: include('qaContext') ? contextValue(qaContext.os.value) : '',
    device: include('qaContext') ? contextValue(qaContext.device.value) : '',
    projectKey: ticketDefaults.projectKey.trim() || undefined,
    issueType: ticketDefaults.issueType,
    labels: ticketDefaults.labels.length > 0 ? ticketDefaults.labels : undefined,
    assignee: ticketDefaults.assignee.trim() || undefined,
    connection: buildConnection(jira),
    template,
  }
}
