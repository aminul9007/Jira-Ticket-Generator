import type { BugReportFormValues, GeneratedTicket } from './bugReport'
import type { EditableTicketField } from './ticketEditor'

export interface TicketHistoryFormSnapshot {
  issueDescription: string
  environments: BugReportFormValues['environments']
}

export interface TicketHistoryRecord {
  id: string
  createdAt: string
  formInput: TicketHistoryFormSnapshot
  generatedTicket: GeneratedTicket
  finalTicket: GeneratedTicket
  selectedTitle: string
  editedFields: EditableTicketField[]
  severityChanged: boolean
  priorityChanged: boolean
  usedAi: boolean
}

export const TICKET_HISTORY_STORAGE_KEY = 'qa-bug-report-ticket-history'
export const MAX_TICKET_HISTORY = 50
