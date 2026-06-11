import type { CreateJiraIssuePayload } from '../../../shared/jiraApi.js'
import {
  createDefaultTicketTemplateSettings,
  isTemplateFieldEnabled,
} from '../../../shared/ticketTemplate.js'

function formatSteps(steps: string[]): string {
  if (steps.length === 0) return '_No steps provided._'
  return steps
    .map((step, index) => `${index + 1}. ${step.replace(/\*/g, '')}`)
    .join('\n')
}

function contextLine(label: string, value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed || trimmed.toLowerCase() === 'unknown') return null
  return `- **${label}:** ${trimmed}`
}

/** Markdown description for mcp-atlassian jira_create_issue. */
export function buildJiraIssueDescription(payload: CreateJiraIssuePayload): string {
  const template = payload.template ?? createDefaultTicketTemplateSettings()
  const include = (field: Parameters<typeof isTemplateFieldEnabled>[1]) =>
    isTemplateFieldEnabled(template, field)

  const sections: string[] = []

  if (include('issueSummary')) {
    sections.push('## Summary', payload.summary.replace(/\*/g, ''))
  }

  if (include('stepsToReproduce')) {
    sections.push('', '## Steps to Reproduce', formatSteps(payload.steps))
  }

  if (include('expectedResult')) {
    sections.push(
      '',
      '## Expected Result',
      payload.expected.replace(/\*/g, '') || '_Not specified._',
    )
  }

  if (include('actualResult')) {
    sections.push(
      '',
      '## Actual Result',
      payload.actual.replace(/\*/g, '') || '_Not specified._',
    )
  }

  const contextLines = [
    include('environment') ? contextLine('Environment', payload.environment) : null,
    include('qaContext') ? contextLine('Browser', payload.browser) : null,
    include('qaContext') ? contextLine('OS', payload.os) : null,
    include('qaContext') ? contextLine('Device', payload.device) : null,
    include('severity') ? contextLine('Severity', payload.severity) : null,
    include('priority') ? contextLine('Priority', payload.priority) : null,
  ].filter(Boolean)

  if (contextLines.length > 0) {
    sections.push('', '## QA Context', ...contextLines)
  }

  return sections.join('\n').trim()
}
