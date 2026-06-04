export type TicketFeedbackRating = 'helpful' | 'needs_improvement'

export interface TicketFeedbackRecord {
  id: string
  historyId: string
  rating: TicketFeedbackRating
  createdAt: string
}

export const TICKET_FEEDBACK_STORAGE_KEY = 'qa-bug-report-ticket-feedback'
