import { useCallback, useMemo, useState } from 'react'
import type { GeneratedTicket } from '../types/bugReport'
import type { RecentTicketFilters, RecentTicketRecord } from '../types/recentTicket'
import { filterRecentTickets } from '../utils/filterRecentTickets'
import {
  addRecentTicket,
  loadRecentTickets,
  removeRecentTicket,
} from '../utils/recentTicketsStorage'

const DEFAULT_FILTERS: RecentTicketFilters = {
  search: '',
  category: 'all',
  environment: 'all',
}

export function useRecentTickets() {
  const [records, setRecords] = useState<RecentTicketRecord[]>(loadRecentTickets)
  const [filters, setFilters] = useState<RecentTicketFilters>(DEFAULT_FILTERS)
  const [activeId, setActiveId] = useState<string | null>(null)

  const filteredRecords = useMemo(
    () => filterRecentTickets(records, filters),
    [records, filters],
  )

  const saveTicket = useCallback((ticket: GeneratedTicket, usedAi: boolean) => {
    setRecords((prev) => addRecentTicket(ticket, usedAi, prev))
  }, [])

  const deleteTicket = useCallback((id: string) => {
    setRecords((prev) => removeRecentTicket(id, prev))
    setActiveId((current) => (current === id ? null : current))
  }, [])

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
    setFilters(DEFAULT_FILTERS)
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
  }
}

export type RecentTicketsState = ReturnType<typeof useRecentTickets>
