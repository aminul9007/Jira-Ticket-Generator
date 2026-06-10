import type { CreateJiraIssuePayload } from '../../../shared/jiraApi.js'

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
  const contextLines = [
    contextLine('Environment', payload.environment),
    contextLine('Browser', payload.browser),
    contextLine('OS', payload.os),
    contextLine('Device', payload.device),
    contextLine('Severity', payload.severity),
    contextLine('Priority', payload.priority),
  ].filter(Boolean)

  const sections = [
    '## Summary',
    payload.summary.replace(/\*/g, ''),
    '',
    '## Steps to Reproduce',
    formatSteps(payload.steps),
    '',
    '## Expected Result',
    payload.expected.replace(/\*/g, '') || '_Not specified._',
    '',
    '## Actual Result',
    payload.actual.replace(/\*/g, '') || '_Not specified._',
  ]

  if (contextLines.length > 0) {
    sections.push('', '## QA Context', ...contextLines)
  }

  return sections.join('\n')
}
