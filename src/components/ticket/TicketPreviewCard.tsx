import type { GeneratedTicket } from '../../types/bugReport'
import { formatJiraTicket } from '../../utils/formatJiraTicket'
import { Badge } from '../ui/Badge'
import { Card, CardHeader } from '../ui/Card'
import { Collapsible } from '../ui/Collapsible'
import { ConfidenceScore } from '../ui/ConfidenceScore'
import {
  FormattedTicketBlock,
  FormattedTicketList,
  FormattedTicketText,
} from './FormattedTicketText'
import { TicketSection } from './TicketSection'
import { TitleSuggestions } from './TitleSuggestions'

interface TicketPreviewCardProps {
  ticket: GeneratedTicket
  isGenerated?: boolean
  usedAi?: boolean
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
  usedAi = false,
}: TicketPreviewCardProps) {
  return (
    <Card
      id="ticket-preview"
      variant="elevated"
      className="h-full animate-fade-in"
    >
      <CardHeader
        title="Ticket Preview"
        description="Jira-ready format — Senior QA Lead output"
        icon={PreviewIcon}
        action={
          isGenerated ? (
            <div className="flex flex-wrap items-center gap-2">
              {usedAi && <Badge variant="brand">AI enhanced</Badge>}
              <Badge variant="success">Ready to copy</Badge>
            </div>
          ) : undefined
        }
      />

      <div className="mb-5 rounded-xl border border-border/70 bg-surface-subtle/40 p-4">
        <ConfidenceScore score={ticket.confidenceScore} />
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <Badge variant="brand">{ticket.category}</Badge>
        {ticket.environments.map((env) => (
          <Badge key={env} variant="neutral">
            {env}
          </Badge>
        ))}
        {ticket.affectedFeaturePage && (
          <Badge variant="default">{ticket.affectedFeaturePage}</Badge>
        )}
        <Badge variant={severityVariant(ticket.severity)}>
          {ticket.severity}
        </Badge>
        <Badge variant="default">Priority {ticket.priority}</Badge>
      </div>

      <div className="space-y-3">
        <TicketSection title="Title suggestions">
          <TitleSuggestions
            suggestions={ticket.titleSuggestions}
            recommendedTitle={ticket.title}
          />
        </TicketSection>

        <TicketSection title="Recommended title">
          <p className="font-semibold tracking-tight">{ticket.title}</p>
        </TicketSection>

        <TicketSection title="Issue Summary">
          <FormattedTicketBlock text={ticket.issueSummary} />
        </TicketSection>

        <TicketSection title="Steps to Reproduce">
          <FormattedTicketList items={ticket.stepsToReproduce} />
        </TicketSection>

        <TicketSection title="Expected Result">
          <FormattedTicketBlock text={ticket.expectedResult} />
        </TicketSection>

        <TicketSection title="Actual Result">
          <FormattedTicketBlock text={ticket.actualResult} />
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

        <TicketSection title="Severity reasoning">
          <FormattedTicketBlock text={ticket.severityReasoning} />
        </TicketSection>

        <Collapsible
          title="Possible root causes"
          badge={
            <Badge variant="neutral">{ticket.possibleRootCauses.length}</Badge>
          }
        >
          <ul className="list-disc space-y-2 pl-5 marker:text-text-muted">
            {ticket.possibleRootCauses.map((cause, index) => (
              <li key={index}>
                <FormattedTicketText text={cause} />
              </li>
            ))}
          </ul>
        </Collapsible>

        <Collapsible title="Jira wiki export" defaultOpen={false}>
          <pre className="max-h-48 overflow-auto rounded-lg bg-code-bg p-3 text-xs leading-relaxed text-code-text">
            {formatJiraTicket(ticket)}
          </pre>
        </Collapsible>
      </div>
    </Card>
  )
}
