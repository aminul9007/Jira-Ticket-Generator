import type { GeneratedTicket } from '../types/bugReport'

export function formatJiraTicket(ticket: GeneratedTicket): string {
  const lines: string[] = [
    'h2. Summary',
    ticket.issueSummary.replace(/\*/g, ''),
    '',
    'h2. Title suggestions',
    ...ticket.titleSuggestions.map((t, i) => `# ${i + 1}. ${t}`),
    '',
    `*Recommended title:* ${ticket.title}`,
    '',
    'h2. Environment',
    ticket.environments.join(', '),
    ...(ticket.affectedFeaturePage
      ? ['', `*Affected feature/page:* ${ticket.affectedFeaturePage}`]
      : []),
    '',
    'h2. Steps to Reproduce',
    ...ticket.stepsToReproduce.map((step, i) => `# ${i + 1}. ${step.replace(/\*/g, '')}`),
    '',
    'h2. Expected Result',
    ticket.expectedResult.replace(/\*/g, ''),
    '',
    'h2. Actual Result',
    ticket.actualResult.replace(/\*/g, ''),
    '',
    'h2. Severity / Priority',
    `Severity: ${ticket.severity}`,
    `Priority: ${ticket.priority}`,
    '',
    'h2. Severity reasoning',
    ticket.severityReasoning.replace(/\*/g, ''),
    '',
    'h2. Possible root causes',
    ...ticket.possibleRootCauses.map((c) => `* ${c.replace(/\*/g, '')}`),
  ]

  return lines.join('\n')
}
