import type { GeneratedTicket } from '../types/bugReport'
import type { EditableTicketField } from '../types/ticketEditor'

function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false
  return a.every((value, index) => value === b[index])
}

export function getModifiedFields(
  original: GeneratedTicket | null,
  edited: GeneratedTicket | null,
): Set<EditableTicketField> {
  const modified = new Set<EditableTicketField>()
  if (!original || !edited) return modified

  if (original.title !== edited.title) modified.add('title')
  if (!arraysEqual(original.titleSuggestions, edited.titleSuggestions)) {
    modified.add('titleSuggestions')
  }
  if (original.issueSummary !== edited.issueSummary) modified.add('issueSummary')
  if (!arraysEqual(original.stepsToReproduce, edited.stepsToReproduce)) {
    modified.add('stepsToReproduce')
  }
  if (original.expectedResult !== edited.expectedResult) {
    modified.add('expectedResult')
  }
  if (original.actualResult !== edited.actualResult) modified.add('actualResult')
  if (original.severity !== edited.severity) modified.add('severity')
  if (original.priority !== edited.priority) modified.add('priority')
  if (original.severityReasoning !== edited.severityReasoning) {
    modified.add('severityReasoning')
  }
  if (!arraysEqual(original.possibleRootCauses, edited.possibleRootCauses)) {
    modified.add('possibleRootCauses')
  }
  if ((original.affectedFeaturePage ?? '') !== (edited.affectedFeaturePage ?? '')) {
    modified.add('affectedFeaturePage')
  }

  return modified
}
