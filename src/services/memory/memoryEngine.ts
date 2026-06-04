import type { ValidatedBugReportFormValues } from '../../types/bugReport'
import type { TicketHistoryRecord } from '../../types/ticketHistory'
import { countTokenOverlap, tokenize } from './textSimilarity'

const DEFAULT_LIMIT = 3
const MIN_SCORE = 5

export interface SimilarTicketMatch {
  record: TicketHistoryRecord
  score: number
}

export function scoreTicketSimilarity(
  values: ValidatedBugReportFormValues,
  record: TicketHistoryRecord,
): number {
  let score = 0

  for (const env of values.environments) {
    if (record.formInput.environments.includes(env)) {
      score += 10
    }
  }

  const currentTokens = tokenize(values.issueDescription)
  const historyTokens = tokenize(
    [
      record.formInput.issueDescription,
      record.finalTicket.title,
      record.finalTicket.issueSummary,
      record.finalTicket.category,
      record.finalTicket.affectedFeaturePage ?? '',
    ].join(' '),
  )
  score += countTokenOverlap(currentTokens, historyTokens) * 4

  if (record.finalTicket.category) {
    const categoryTokens = tokenize(record.finalTicket.category)
    score += countTokenOverlap(currentTokens, categoryTokens) * 5
  }

  return score
}

export function findSimilarTickets(
  values: ValidatedBugReportFormValues,
  history: TicketHistoryRecord[],
  limit = DEFAULT_LIMIT,
): TicketHistoryRecord[] {
  const ranked = history
    .map((record) => ({
      record,
      score: scoreTicketSimilarity(values, record),
    }))
    .filter((match) => match.score >= MIN_SCORE)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)

  return ranked.map((match) => match.record)
}

export function formatHistoricalTicketsForPrompt(
  records: TicketHistoryRecord[],
): string {
  if (records.length === 0) return ''

  const examples = records.map((record, index) => {
    const ticket = record.finalTicket
    return [
      `### Example ${index + 1} (${ticket.category})`,
      `Input: ${record.formInput.issueDescription.slice(0, 200)}`,
      `Title used: ${record.selectedTitle}`,
      `Summary: ${ticket.issueSummary}`,
      `Severity/Priority: ${ticket.severity} / ${ticket.priority}`,
      `Steps: ${ticket.stepsToReproduce.slice(0, 3).join(' → ')}`,
      record.editedFields.length > 0
        ? `User-edited fields: ${record.editedFields.join(', ')}`
        : '',
    ]
      .filter(Boolean)
      .join('\n')
  })

  return [
    '## Relevant historical tickets',
    'Reuse terminology and writing patterns from these past tickets when consistent with the current description.',
    'Do NOT copy facts from examples — only style, structure, and team phrasing.',
    '',
    ...examples,
  ].join('\n\n')
}
