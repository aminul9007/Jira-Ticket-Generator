import type { GeneratedTicket } from './bugReport'

export type TicketViewMode = 'preview' | 'edit'

export type EditableTicketField =
  | 'title'
  | 'titleSuggestions'
  | 'issueSummary'
  | 'stepsToReproduce'
  | 'expectedResult'
  | 'actualResult'
  | 'severity'
  | 'priority'
  | 'severityReasoning'
  | 'possibleRootCauses'
  | 'affectedFeaturePage'

export interface TicketEditorState {
  viewMode: TicketViewMode
  originalTicket: GeneratedTicket | null
  editedTicket: GeneratedTicket | null
  modifiedFields: Set<EditableTicketField>
  hasModifications: boolean
}
