import type { RecentTicketsState } from '../../hooks/useRecentTickets'
import type { RecentTicketRecord } from '../../types/recentTicket'
import { MAX_RECENT_TICKETS } from '../../types/recentTicket'
import { Card, CardHeader } from '../ui/Card'
import { RecentTicketFiltersBar } from './RecentTicketFiltersBar'
import { RecentTicketListItem } from './RecentTicketListItem'

interface RecentTicketsPanelProps {
  recentTickets: RecentTicketsState
  onOpen: (record: RecentTicketRecord) => void
}

const HistoryIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export function RecentTicketsPanel({
  recentTickets,
  onOpen,
}: RecentTicketsPanelProps) {
  const {
    records,
    filteredRecords,
    filters,
    activeId,
    deleteTicket,
    setSearch,
    setCategoryFilter,
    setEnvironmentFilter,
    resetFilters,
  } = recentTickets

  return (
    <Card variant="outline" className="mt-8" id="recent-tickets">
      <CardHeader
        title="Recent Tickets"
        description={`Last ${MAX_RECENT_TICKETS} generated tickets saved on this device.`}
        icon={HistoryIcon}
      />

      {records.length > 0 && (
        <div className="mb-5">
          <RecentTicketFiltersBar
            filters={filters}
            resultCount={filteredRecords.length}
            totalCount={records.length}
            onSearchChange={setSearch}
            onCategoryChange={setCategoryFilter}
            onEnvironmentChange={setEnvironmentFilter}
            onReset={resetFilters}
          />
        </div>
      )}

      {records.length === 0 ? (
        <p className="text-sm text-text-muted">
          No recent tickets yet. Generate a ticket to save it here automatically.
        </p>
      ) : filteredRecords.length === 0 ? (
        <p className="text-sm text-text-muted">
          No tickets match your search or filters. Try adjusting the filters above.
        </p>
      ) : (
        <ul className="space-y-3">
          {filteredRecords.map((record) => (
            <li key={record.id}>
              <RecentTicketListItem
                record={record}
                isActive={activeId === record.id}
                onOpen={onOpen}
                onDelete={deleteTicket}
              />
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
