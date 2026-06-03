import type { GeneratedTicket } from '../types/bugReport'
import {
  MAX_RECENT_TICKETS,
  RECENT_TICKETS_STORAGE_KEY,
  type RecentTicketRecord,
} from '../types/recentTicket'
import { cloneTicket } from './cloneTicket'

function createRecord(ticket: GeneratedTicket, usedAi: boolean): RecentTicketRecord {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ticket: cloneTicket(ticket),
    usedAi,
  }
}

export function loadRecentTickets(): RecentTicketRecord[] {
  try {
    const raw = localStorage.getItem(RECENT_TICKETS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as RecentTicketRecord[]
    if (!Array.isArray(parsed)) return []
    return parsed.slice(0, MAX_RECENT_TICKETS)
  } catch {
    return []
  }
}

function persist(records: RecentTicketRecord[]): RecentTicketRecord[] {
  const trimmed = records.slice(0, MAX_RECENT_TICKETS)
  try {
    localStorage.setItem(RECENT_TICKETS_STORAGE_KEY, JSON.stringify(trimmed))
  } catch {
    /* storage full or unavailable */
  }
  return trimmed
}

export function addRecentTicket(
  ticket: GeneratedTicket,
  usedAi: boolean,
  existing: RecentTicketRecord[] = loadRecentTickets(),
): RecentTicketRecord[] {
  const record = createRecord(ticket, usedAi)
  const next = [record, ...existing].slice(0, MAX_RECENT_TICKETS)
  return persist(next)
}

export function removeRecentTicket(
  id: string,
  existing: RecentTicketRecord[] = loadRecentTickets(),
): RecentTicketRecord[] {
  const next = existing.filter((record) => record.id !== id)
  return persist(next)
}

export function clearRecentTickets(): RecentTicketRecord[] {
  return persist([])
}
