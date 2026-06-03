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

export function TicketPreviewCard({
  ticket,
  isGenerated = false,
}: TicketPreviewCardProps) {
  return (
    <Card id="ticket-preview" className="h-full">
      <CardHeader
        title="Ticket Preview"
        description="Jira-ready format generated from your report"
        action={
          isGenerated ? (
            <Badge variant="success">Generated</Badge>
          ) : undefined
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
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

      <div className="space-y-4">
        <TicketSection title="Title">
          <p className="font-semibold">{ticket.title}</p>
        </TicketSection>

        <TicketSection title="Issue Summary">
          <p>{ticket.issueSummary}</p>
        </TicketSection>

        <TicketSection title="Steps to Reproduce">
          <ol className="list-decimal space-y-1.5 pl-5">
            {ticket.stepsToReproduce.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </TicketSection>

        <TicketSection title="Expected Result">
          <p>{ticket.expectedResult}</p>
        </TicketSection>

        <TicketSection title="Actual Result">
          <p>{ticket.actualResult}</p>
        </TicketSection>

        <div className="grid gap-4 sm:grid-cols-2">
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
