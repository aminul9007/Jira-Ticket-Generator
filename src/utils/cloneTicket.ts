import type { GeneratedTicket } from '../types/bugReport'

export function cloneTicket(ticket: GeneratedTicket): GeneratedTicket {
  return {
    ...ticket,
    titleSuggestions: [...ticket.titleSuggestions] as GeneratedTicket['titleSuggestions'],
    stepsToReproduce: [...ticket.stepsToReproduce],
    possibleRootCauses: [...ticket.possibleRootCauses],
    environments: [...ticket.environments],
  }
}
