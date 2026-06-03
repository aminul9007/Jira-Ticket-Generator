import type { GeneratedTicket } from '../../types/bugReport'

/** Structured response expected from the Senior QA Lead AI prompt. */
export interface AiTicketResponse
  extends Omit<GeneratedTicket, 'titleSuggestions' | 'confidenceScore'> {
  titleSuggestions: string[]
  confidenceScore: number
}
