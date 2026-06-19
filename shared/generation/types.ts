/** Browser page context captured when the extension popup opens. */
export interface TicketContext {
  url: string
  title: string
  timestamp: string
}

/** Extension input payload passed into the shared ticket generation pipeline. */
export interface TicketGenerationInput {
  description: string
  context: TicketContext
}
