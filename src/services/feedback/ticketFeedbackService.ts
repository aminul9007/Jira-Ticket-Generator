import type { TicketFeedbackRating, TicketFeedbackRecord } from '../../types/ticketFeedback'
import { TICKET_FEEDBACK_STORAGE_KEY } from '../../types/ticketFeedback'

export function loadTicketFeedback(): TicketFeedbackRecord[] {
  try {
    const raw = localStorage.getItem(TICKET_FEEDBACK_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as TicketFeedbackRecord[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function persist(records: TicketFeedbackRecord[]): TicketFeedbackRecord[] {
  try {
    localStorage.setItem(TICKET_FEEDBACK_STORAGE_KEY, JSON.stringify(records))
  } catch {
    /* storage unavailable */
  }
  return records
}

export function saveTicketFeedback(
  historyId: string,
  rating: TicketFeedbackRating,
  existing: TicketFeedbackRecord[] = loadTicketFeedback(),
): TicketFeedbackRecord {
  const withoutDuplicate = existing.filter((record) => record.historyId !== historyId)
  const record: TicketFeedbackRecord = {
    id: crypto.randomUUID(),
    historyId,
    rating,
    createdAt: new Date().toISOString(),
  }
  persist([record, ...withoutDuplicate])
  return record
}

export function getFeedbackForHistory(historyId: string): TicketFeedbackRecord | undefined {
  return loadTicketFeedback().find((record) => record.historyId === historyId)
}

export function formatFeedbackPatternsForPrompt(
  feedback: TicketFeedbackRecord[],
  history: { id: string; editedFields: string[]; severityChanged: boolean; priorityChanged: boolean }[],
): string {
  if (feedback.length === 0) return ''

  const helpful = feedback.filter((record) => record.rating === 'helpful').length
  const needsImprovement = feedback.filter((record) => record.rating === 'needs_improvement').length

  const historyById = new Map(history.map((record) => [record.id, record]))
  const improvementRecords = feedback.filter((record) => record.rating === 'needs_improvement')

  const editedFieldCounts = new Map<string, number>()
  let severityEdits = 0
  let priorityEdits = 0

  for (const item of improvementRecords) {
    const match = historyById.get(item.historyId)
    if (!match) continue
    for (const field of match.editedFields) {
      editedFieldCounts.set(field, (editedFieldCounts.get(field) ?? 0) + 1)
    }
    if (match.severityChanged) severityEdits++
    if (match.priorityChanged) priorityEdits++
  }

  const frequentEdits = [...editedFieldCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([field, count]) => `${field} (${count}x)`)

  const lines = [
    '## User feedback patterns',
    `Helpful: ${helpful} · Needs improvement: ${needsImprovement}`,
  ]

  if (frequentEdits.length > 0) {
    lines.push(
      `Users often revise these fields after generation: ${frequentEdits.join(', ')}.`,
      'Improve first-pass accuracy for those fields when possible.',
    )
  }
  if (severityEdits > 0) {
    lines.push(`Severity was adjusted on ${severityEdits} ticket(s) marked needs improvement — calibrate severity carefully.`)
  }
  if (priorityEdits > 0) {
    lines.push(`Priority was adjusted on ${priorityEdits} ticket(s) marked needs improvement — justify priority in severityReasoning.`)
  }

  return lines.join('\n')
}
