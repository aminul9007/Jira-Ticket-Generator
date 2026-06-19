import type { TicketContext } from './types'

export interface TicketContextOptions {
  includePageTitle?: boolean
}

/** Apply user preferences to captured browser context before ticket generation. */
export function applyTicketContextOptions(
  context: TicketContext,
  options?: TicketContextOptions,
): TicketContext {
  if (options?.includePageTitle === false) {
    return { ...context, title: '' }
  }

  return context
}
