import { useCallback, useMemo, useState } from 'react'
import type { RecentTicketRecord } from '../types/recentTicket'
import { MAX_RECENT_TICKETS } from '../types/recentTicket'
import {
  deleteTicketHistoryRecord,
  getTicketHistory,
  historyRecordToRecentTicket,
} from '../services/history/ticketHistoryService'
import { filterRecentTickets } from '../utils/filterRecentTickets'
import type { RecentTicketFilters } from '../types/recentTicket'

export function useRecentTickets() {
  const [records, setRecords] = useState<RecentTicketRecord[]>(() =>
    getTicketHistory()
      .slice(0, MAX_RECENT_TICKETS)
      .map(historyRecordToRecentTicket),
  )
  const [filters, setFilters] = useState<RecentTicketFilters>({
    search: '',
    category: 'all',
    environment: 'all',
  })
  const [activeId, setActiveId] = useState<string | null>(null)

  const refreshFromHistory = useCallback(() => {
    setRecords(
      getTicketHistory()
        .slice(0, MAX_RECENT_TICKETS)
        .map(historyRecordToRecentTicket),
    )
  }, [])

  const saveTicket = useCallback(() => {
    refreshFromHistory()
  }, [refreshFromHistory])

  const deleteTicket = useCallback(
    (id: string) => {
      deleteTicketHistoryRecord(id)
      setRecords((prev) => prev.filter((record) => record.id !== id))
      if (activeId === id) setActiveId(null)
    },
    [activeId],
  )

  const filteredRecords = useMemo(
    () => filterRecentTickets(records, filters),
    [records, filters],
  )

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }))
  }, [])

  const setCategoryFilter = useCallback(
    (category: RecentTicketFilters['category']) => {
      setFilters((prev) => ({ ...prev, category }))
    },
    [],
  )

  const setEnvironmentFilter = useCallback(
    (environment: RecentTicketFilters['environment']) => {
      setFilters((prev) => ({ ...prev, environment }))
    },
    [],
  )

  const resetFilters = useCallback(() => {
    setFilters({ search: '', category: 'all', environment: 'all' })
  }, [])

  const markActive = useCallback((id: string | null) => {
    setActiveId(id)
  }, [])

  return {
    records,
    filteredRecords,
    filters,
    activeId,
    saveTicket,
    deleteTicket,
    setSearch,
    setCategoryFilter,
    setEnvironmentFilter,
    resetFilters,
    markActive,
    refreshFromHistory,
  }
}

export type RecentTicketsState = ReturnType<typeof useRecentTickets>
