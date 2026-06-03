import { Card, CardHeader } from '../ui/Card'

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

export function TicketHistoryPanel() {
  return (
    <Card variant="outline" className="mt-8">
      <CardHeader
        title="Ticket History"
        description="Previously generated tickets will appear here in a future update."
        icon={HistoryIcon}
      />
      <p className="text-sm text-text-muted">
        No history yet. Generate a ticket to start building your session log.
      </p>
    </Card>
  )
}
