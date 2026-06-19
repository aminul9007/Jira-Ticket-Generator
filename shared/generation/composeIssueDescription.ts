import type { TicketContext } from './types'

/** Combine user description with captured browser context for AI + rules engines. */
export function composeIssueDescription(
  description: string,
  context: TicketContext,
): string {
  const trimmed = description.trim()
  const lines = [trimmed]

  if (context.url) {
    lines.push('', `Page: ${context.url}`)
  }
  if (context.title) {
    lines.push(`Title: ${context.title}`)
  }
  if (context.timestamp) {
    lines.push(`Captured: ${context.timestamp}`)
  }

  return lines.join('\n').trim()
}
