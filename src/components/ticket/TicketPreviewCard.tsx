import type { GeneratedTicket } from '../../types/bugReport'
import { Badge } from '../ui/Badge'
import { Card, CardHeader } from '../ui/Card'
import { TicketSection } from './TicketSection'

interface TicketPreviewCardProps {
  ticket: GeneratedTicket
  isGenerated?: boolean
}

function severityVariant(
  severity: GeneratedTicket['severity'],
): 'danger' | 'warning' | 'neutral' | 'success' {
  switch (severity) {
    case 'Critical':
      return 'danger'
    case 'High':
      return 'warning'
    case 'Medium':
      return 'neutral'
    case 'Low':
      return 'success'
  }
}

const PreviewIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export function TicketPreviewCard({
  ticket,
  isGenerated = false,
}: TicketPreviewCardProps) {
  return (
    <Card
      id="ticket-preview"
      variant="elevated"
      className="h-full animate-fade-in"
    >
      <CardHeader
        title="Ticket Preview"
        description="Jira-ready format generated from your report"
        icon={PreviewIcon}
        action={
          isGenerated ? (
            <Badge variant="success">Ready to copy</Badge>
          ) : undefined
        }
      />

      <div className="mb-5 flex flex-wrap gap-2">
        <Badge variant="brand">{ticket.category}</Badge>
        {ticket.environments.map((env) => (
          <Badge key={env} variant="neutral">
            {env}
          </Badge>
        ))}
        <Badge variant={severityVariant(ticket.severity)}>
          {ticket.severity}
        </Badge>
        <Badge variant="default">Priority {ticket.priority}</Badge>
      </div>

      <div className="space-y-3">
        <TicketSection title="Title">
          <p className="font-semibold tracking-tight">{ticket.title}</p>
        </TicketSection>

        <TicketSection title="Issue Summary">
          <p>{ticket.issueSummary}</p>
        </TicketSection>

        <TicketSection title="Steps to Reproduce">
          <ol className="list-decimal space-y-2 pl-5 marker:text-text-muted">
            {ticket.stepsToReproduce.map((step, index) => (
              <li key={index} className="pl-1">
                {step}
              </li>
            ))}
          </ol>
        </TicketSection>

        <TicketSection title="Expected Result">
          <p>{ticket.expectedResult}</p>
        </TicketSection>

        <TicketSection title="Actual Result">
          <p>{ticket.actualResult}</p>
        </TicketSection>

        <div className="grid gap-3 sm:grid-cols-2">
          <TicketSection title="Severity">
            <Badge variant={severityVariant(ticket.severity)}>
              {ticket.severity}
            </Badge>
          </TicketSection>
          <TicketSection title="Priority">
            <Badge variant="default">{ticket.priority}</Badge>
          </TicketSection>
        </div>
      </div>
    </Card>
  )
}
