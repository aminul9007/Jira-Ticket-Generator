import { hasProjectContextContent } from '../../utils/projectContextFormat'

export function formatProjectContextForPrompt(projectContext: string): string {
  const trimmed = projectContext.trim()
  if (!hasProjectContextContent(trimmed)) return ''

  return [
    '## Project Context / Knowledge Base',
    'Use this organizational context for naming, terminology, severity interpretation, and writing style.',
    'Do NOT override bug report facts. Do NOT invent details unsupported by the report.',
    '',
    trimmed,
    '',
    'When the report aligns with this context, prefer these names and patterns.',
    'If the report conflicts with context, trust the report and note mismatches briefly in severityReasoning.',
  ].join('\n')
}

export function formatTicketGuidelinesForPrompt(ticketGuidelines: string): string {
  const trimmed = ticketGuidelines.trim()
  if (!trimmed) return ''

  return [
    '## Ticket Writing Guidelines (project-specific training)',
    'Follow these rules for titles, summaries, steps, and tone when generating tickets for this project.',
    'These guidelines override generic style when they do not conflict with the bug report facts.',
    '',
    trimmed,
  ].join('\n')
}

export function formatAiOutputStyleInstruction(
  style: 'concise' | 'standard' | 'detailed',
): string {
  switch (style) {
    case 'concise':
      return '## AI output style: Concise\nKeep issueSummary brief (1–2 sentences). Use minimal steps (3–4) only when sufficient for reproduction.'
    case 'detailed':
      return '## AI output style: Detailed\nProvide thorough issueSummary, comprehensive stepsToReproduce (up to 8), and richer severityReasoning.'
    default:
      return '## AI output style: Standard\nBalance clarity and brevity suitable for Jira triage.'
  }
}
