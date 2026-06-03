import type {
  TicketPriority,
  TicketSeverity,
} from '../types/bugReport'

export const TICKET_SEVERITIES: readonly TicketSeverity[] = [
  'Critical',
  'High',
  'Medium',
  'Low',
] as const

export const TICKET_PRIORITIES: readonly TicketPriority[] = [
  'P1',
  'P2',
  'P3',
  'P4',
] as const
