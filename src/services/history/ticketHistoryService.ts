import type { BugReportFormValues, GeneratedTicket } from '../../types/bugReport'
import type { TicketHistoryRecord } from '../../types/ticketHistory'
import {
  addTicketHistoryRecord,
  buildFormSnapshot,
  buildHistoryRecord,
  clearTicketHistoryStorage,
  trimTicketHistoryToRetention,
  loadTicketHistory,
  removeTicketHistoryRecord,
  updateTicketHistoryRecord,
} from '../../utils/ticketHistoryStorage'

export function getTicketHistory(): TicketHistoryRecord[] {
  return loadTicketHistory()
}

export function saveGeneratedTicketHistory(
  formValues: BugReportFormValues,
  generatedTicket: GeneratedTicket,
  usedAi: boolean,
): TicketHistoryRecord {
  const formInput = buildFormSnapshot(formValues)
  const record = buildHistoryRecord(formInput, generatedTicket, generatedTicket, usedAi)
  addTicketHistoryRecord(record)
  return record
}

export function finalizeTicketHistory(
  historyId: string,
  finalTicket: GeneratedTicket,
): TicketHistoryRecord | null {
  const existing = loadTicketHistory()
  const current = existing.find((record) => record.id === historyId)
  if (!current) return null

  updateTicketHistoryRecord(historyId, {
    finalTicket,
    selectedTitle: finalTicket.title,
  })

  return loadTicketHistory().find((record) => record.id === historyId) ?? null
}

export function deleteTicketHistoryRecord(id: string): void {
  removeTicketHistoryRecord(id)
}

export function clearAllTicketHistory(): void {
  clearTicketHistoryStorage()
}

export function exportTicketHistory() {
  return loadTicketHistory()
}

/** Re-trim stored history to the current retention setting. */
export function applyHistoryRetentionLimit(): void {
  trimTicketHistoryToRetention()
}

export { loadTicketHistory, historyRecordToRecentTicket } from '../../utils/ticketHistoryStorage'
