import type { GeneratedTicket } from '../types/bugReport'
import type { TicketTemplateSettings } from '../../shared/ticketTemplate'
import {
  createDefaultTicketTemplateSettings,
  isTemplateFieldEnabled,
} from '../../shared/ticketTemplate'

function stripMarkdown(text: string): string {
  return text.replace(/\*/g, '')
}

export function formatJiraTicket(
  ticket: GeneratedTicket,
  template: TicketTemplateSettings = createDefaultTicketTemplateSettings(),
): string {
  const lines: string[] = []
  const include = (field: Parameters<typeof isTemplateFieldEnabled>[1]) =>
    isTemplateFieldEnabled(template, field)

  if (include('issueSummary')) {
    lines.push('h2. Summary', stripMarkdown(ticket.issueSummary), '')
  }

  if (include('titleSuggestions')) {
    lines.push(
      'h2. Title suggestions',
      ...ticket.titleSuggestions.map((t, i) => `# ${i + 1}. ${t}`),
      '',
      `*Recommended title:* ${ticket.title}`,
      '',
    )
  }

  if (include('environment') || include('affectedFeaturePage')) {
    lines.push('h2. Environment')
    if (include('environment')) {
      lines.push(ticket.environments.join(', '))
    }
    if (include('affectedFeaturePage') && ticket.affectedFeaturePage) {
      lines.push('', `*Affected feature/page:* ${ticket.affectedFeaturePage}`)
    }
    lines.push('')
  }

  if (include('stepsToReproduce')) {
    lines.push(
      'h2. Steps to Reproduce',
      ...ticket.stepsToReproduce.map(
        (step, i) => `# ${i + 1}. ${stripMarkdown(step)}`,
      ),
      '',
    )
  }

  if (include('expectedResult')) {
    lines.push('h2. Expected Result', stripMarkdown(ticket.expectedResult), '')
  }

  if (include('actualResult')) {
    lines.push('h2. Actual Result', stripMarkdown(ticket.actualResult), '')
  }

  if (include('severity') || include('priority')) {
    lines.push('h2. Severity / Priority')
    if (include('severity')) {
      lines.push(`Severity: ${ticket.severity}`)
    }
    if (include('priority')) {
      lines.push(`Priority: ${ticket.priority}`)
    }
    lines.push('')
  }

  if (include('severityReasoning')) {
    lines.push('h2. Severity reasoning', stripMarkdown(ticket.severityReasoning), '')
  }

  if (include('possibleRootCauses') && ticket.possibleRootCauses.length > 0) {
    lines.push(
      'h2. Possible root causes',
      ...ticket.possibleRootCauses.map((c) => `* ${stripMarkdown(c)}`),
    )
  }

  return lines.join('\n').trimEnd()
}
