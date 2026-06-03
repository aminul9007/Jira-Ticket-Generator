import type { GeneratedTicket } from './bugReport'

export interface RecentTicketRecord {
  id: string
  createdAt: string
  ticket: GeneratedTicket
  usedAi: boolean
}

export interface RecentTicketFilters {
  search: string
  category: GeneratedTicket['category'] | 'all'
  environment: GeneratedTicket['environments'][number] | 'all'
}

export const RECENT_TICKETS_STORAGE_KEY = 'qa-bug-report-recent-tickets'
export const MAX_RECENT_TICKETS = 20
