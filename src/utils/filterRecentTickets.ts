import type { RecentTicketFilters, RecentTicketRecord } from '../types/recentTicket'

export function filterRecentTickets(
  records: RecentTicketRecord[],
  filters: RecentTicketFilters,
): RecentTicketRecord[] {
  const query = filters.search.trim().toLowerCase()

  return records.filter((record) => {
    const { ticket } = record

    if (filters.category !== 'all' && ticket.category !== filters.category) {
      return false
    }

    if (
      filters.environment !== 'all' &&
      !ticket.environments.includes(filters.environment)
    ) {
      return false
    }

    if (!query) return true

    const haystack = [
      ticket.title,
      ticket.issueSummary,
      ticket.affectedFeaturePage ?? '',
      ticket.category,
      ...ticket.environments,
      ticket.severity,
      ticket.priority,
    ]
      .join(' ')
      .toLowerCase()

    return haystack.includes(query)
  })
}
