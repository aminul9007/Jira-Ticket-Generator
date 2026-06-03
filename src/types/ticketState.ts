import type { GeneratedTicket } from './bugReport'

export interface TicketGenerationState {
  ticket: GeneratedTicket | null
  hasGenerated: boolean
}

export const INITIAL_TICKET_STATE: TicketGenerationState = {
  ticket: null,
  hasGenerated: false,
}
