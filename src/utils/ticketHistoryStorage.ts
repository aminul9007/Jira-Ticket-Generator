import type { BugReportFormValues, GeneratedTicket } from '../types/bugReport'
import type {
  TicketHistoryFormSnapshot,
  TicketHistoryRecord,
} from '../types/ticketHistory'
import { TICKET_HISTORY_STORAGE_KEY } from '../types/ticketHistory'
import { getHistoryRetentionLimit } from './appSettingsStorage'
import { cloneTicket } from './cloneTicket'
import { getModifiedFields } from './ticketDiff'

export function buildFormSnapshot(
  values: BugReportFormValues,
): TicketHistoryFormSnapshot {
  return {
    issueDescription: values.issueDescription.trim(),
    environments: [...values.environments],
    qaContext: values.qaContext,
  }
}

export function buildHistoryRecord(
  formInput: TicketHistoryFormSnapshot,
  generatedTicket: GeneratedTicket,
  finalTicket: GeneratedTicket,
  usedAi: boolean,
): TicketHistoryRecord {
  const generated = cloneTicket(generatedTicket)
  const final = cloneTicket(finalTicket)
  const editedFields = [...getModifiedFields(generated, final)]

  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    formInput,
    generatedTicket: generated,
    finalTicket: final,
    selectedTitle: final.title,
    editedFields,
    severityChanged: generated.severity !== final.severity,
    priorityChanged: generated.priority !== final.priority,
    usedAi,
  }
}

export function loadTicketHistory(): TicketHistoryRecord[] {
  try {
    const raw = localStorage.getItem(TICKET_HISTORY_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as TicketHistoryRecord[]
    if (!Array.isArray(parsed)) return []
    return parsed.slice(0, getHistoryRetentionLimit())
  } catch {
    return []
  }
}

function persist(records: TicketHistoryRecord[]): TicketHistoryRecord[] {
  const trimmed = records.slice(0, getHistoryRetentionLimit())
  try {
    localStorage.setItem(TICKET_HISTORY_STORAGE_KEY, JSON.stringify(trimmed))
  } catch {
    /* storage unavailable */
  }
  return trimmed
}

export function addTicketHistoryRecord(
  record: TicketHistoryRecord,
  existing: TicketHistoryRecord[] = loadTicketHistory(),
): TicketHistoryRecord[] {
  const next = [record, ...existing].slice(0, getHistoryRetentionLimit())
  return persist(next)
}

export function updateTicketHistoryRecord(
  id: string,
  patch: Partial<Pick<TicketHistoryRecord, 'finalTicket' | 'selectedTitle' | 'editedFields' | 'severityChanged' | 'priorityChanged'>>,
  existing: TicketHistoryRecord[] = loadTicketHistory(),
): TicketHistoryRecord[] {
  const next = existing.map((record) => {
    if (record.id !== id) return record

    const finalTicket = patch.finalTicket
      ? cloneTicket(patch.finalTicket)
      : record.finalTicket
    const editedFields = patch.editedFields ?? [...getModifiedFields(record.generatedTicket, finalTicket)]

    return {
      ...record,
      finalTicket,
      selectedTitle: patch.selectedTitle ?? finalTicket.title,
      editedFields,
      severityChanged:
        patch.severityChanged ??
        record.generatedTicket.severity !== finalTicket.severity,
      priorityChanged:
        patch.priorityChanged ??
        record.generatedTicket.priority !== finalTicket.priority,
    }
  })

  return persist(next)
}

export function removeTicketHistoryRecord(
  id: string,
  existing: TicketHistoryRecord[] = loadTicketHistory(),
): TicketHistoryRecord[] {
  const next = existing.filter((record) => record.id !== id)
  return persist(next)
}

export function trimTicketHistoryToRetention(): void {
  persist(loadTicketHistory())
}

export function clearTicketHistoryStorage(): void {
  try {
    localStorage.removeItem(TICKET_HISTORY_STORAGE_KEY)
  } catch {
    /* storage unavailable */
  }
}

export function historyRecordToRecentTicket(record: TicketHistoryRecord) {
  return {
    id: record.id,
    createdAt: record.createdAt,
    ticket: cloneTicket(record.finalTicket),
    usedAi: record.usedAi,
  }
}
