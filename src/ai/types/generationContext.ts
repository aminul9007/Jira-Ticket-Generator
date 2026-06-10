import type { ValidatedBugReportFormValues } from '../../types/bugReport'
import type { TicketHistoryRecord } from '../../types/ticketHistory'
import type { TicketFeedbackRecord } from '../../types/ticketFeedback'
import type { AiOutputStyle } from '../../types/appSettings'

export interface AiGenerationContext {
  projectContextSection: string
  ticketGuidelinesSection: string
  aiOutputStyle: AiOutputStyle
  similarTickets: TicketHistoryRecord[]
  feedbackSummary: string
}

export interface PromptGenerationInput {
  values: ValidatedBugReportFormValues
  history?: TicketHistoryRecord[]
  feedback?: TicketFeedbackRecord[]
}
