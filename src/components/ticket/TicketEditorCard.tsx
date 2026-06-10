import type { GeneratedTicket } from '../../types/bugReport'
import { TICKET_PRIORITIES, TICKET_SEVERITIES } from '../../data/ticketOptions'
import type { TicketEditor } from '../../hooks/useTicketEditor'
import type { TicketFeedbackRating } from '../../types/ticketFeedback'
import { formatJiraTicket } from '../../utils/formatJiraTicket'
import { Badge } from '../ui/Badge'
import { Card, CardHeader } from '../ui/Card'
import { Collapsible } from '../ui/Collapsible'
import { ConfidenceScore } from '../ui/ConfidenceScore'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Textarea } from '../ui/Textarea'
import { EditableTicketSection } from './EditableTicketSection'
import {
  FormattedTicketBlock,
  FormattedTicketList,
  FormattedTicketText,
} from './FormattedTicketText'
import { TicketFeedbackBar } from './TicketFeedbackBar'
import { TicketEditorToolbar } from './TicketEditorToolbar'
import { TitleSuggestions } from './TitleSuggestions'

interface TicketEditorCardProps {
  editor: TicketEditor
  usedAi?: boolean
  onCopySuccess: () => void
  feedback?: {
    rating: TicketFeedbackRating | null
    canSubmit: boolean
    onSubmit: (rating: TicketFeedbackRating) => void
  }
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

const EditorIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 20H20M4 4H20V16H8L4 20V4Z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export function TicketEditorCard({
  editor,
  usedAi = false,
  onCopySuccess,
  feedback,
}: TicketEditorCardProps) {
  const ticket = editor.editedTicket
  if (!ticket) return null

  const { viewMode, isFieldModified, updateField, updateTitleSuggestion, updateStep, updateRootCause } =
    editor

  return (
    <Card id="ticket-preview" variant="elevated" className="h-full animate-fade-in">
      <CardHeader
        title="Ticket Editor"
        description="Preview or edit your Jira-ready ticket before copying"
        icon={EditorIcon}
      />

      <TicketEditorToolbar
        editor={editor}
        usedAi={usedAi}
        onCopySuccess={onCopySuccess}
      />

      {feedback && (
        <TicketFeedbackBar
          rating={feedback.rating}
          canSubmit={feedback.canSubmit}
          onSubmit={feedback.onSubmit}
        />
      )}

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
        <Badge variant={severityVariant(ticket.severity)}>{ticket.severity}</Badge>
        <Badge variant="default">Priority {ticket.priority}</Badge>
      </div>

      <div className="space-y-4">
        <EditableTicketSection
          title="Title suggestions"
          viewMode={viewMode}
          isModified={isFieldModified('titleSuggestions')}
          preview={
            <TitleSuggestions
              suggestions={ticket.titleSuggestions}
              recommendedTitle={ticket.title}
            />
          }
          edit={
            <div className="space-y-2">
              {ticket.titleSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="mt-3 shrink-0 text-xs font-semibold tabular-nums text-text-muted">
                    {index + 1}.
                  </span>
                  <Input
                    value={suggestion}
                    onChange={(e) => updateTitleSuggestion(index, e.target.value)}
                    aria-label={`Title suggestion ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          }
        />

        <EditableTicketSection
          title="Recommended title"
          viewMode={viewMode}
          isModified={isFieldModified('title')}
          preview={
            <p className="type-ticket-title">{ticket.title}</p>
          }
          edit={
            <Input
              value={ticket.title}
              onChange={(e) => updateField('title', e.target.value)}
              aria-label="Recommended title"
            />
          }
        />

        <EditableTicketSection
          title="Affected feature / page"
          viewMode={viewMode}
          isModified={isFieldModified('affectedFeaturePage')}
          preview={<p>{ticket.affectedFeaturePage || '—'}</p>}
          edit={
            <Input
              value={ticket.affectedFeaturePage ?? ''}
              onChange={(e) =>
                updateField('affectedFeaturePage', e.target.value || undefined)
              }
              placeholder="e.g. Checkout, /settings"
              aria-label="Affected feature or page"
            />
          }
        />

        <EditableTicketSection
          title="Issue Summary"
          viewMode={viewMode}
          isModified={isFieldModified('issueSummary')}
          preview={<FormattedTicketBlock text={ticket.issueSummary} />}
          edit={
            <Textarea
              rows={5}
              value={ticket.issueSummary}
              onChange={(e) => updateField('issueSummary', e.target.value)}
              aria-label="Issue summary"
            />
          }
        />

        <EditableTicketSection
          title="Steps to Reproduce"
          viewMode={viewMode}
          isModified={isFieldModified('stepsToReproduce')}
          preview={<FormattedTicketList items={ticket.stepsToReproduce} />}
          edit={
            <div className="space-y-2">
              {ticket.stepsToReproduce.map((step, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="mt-3 shrink-0 text-xs font-semibold tabular-nums text-text-muted">
                    {index + 1}.
                  </span>
                  <Textarea
                    rows={2}
                    value={step}
                    onChange={(e) => updateStep(index, e.target.value)}
                    aria-label={`Step ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          }
        />

        <EditableTicketSection
          title="Expected Result"
          viewMode={viewMode}
          isModified={isFieldModified('expectedResult')}
          preview={<FormattedTicketBlock text={ticket.expectedResult} />}
          edit={
            <Textarea
              rows={4}
              value={ticket.expectedResult}
              onChange={(e) => updateField('expectedResult', e.target.value)}
              aria-label="Expected result"
            />
          }
        />

        <EditableTicketSection
          title="Actual Result"
          viewMode={viewMode}
          isModified={isFieldModified('actualResult')}
          preview={<FormattedTicketBlock text={ticket.actualResult} />}
          edit={
            <Textarea
              rows={4}
              value={ticket.actualResult}
              onChange={(e) => updateField('actualResult', e.target.value)}
              aria-label="Actual result"
            />
          }
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <EditableTicketSection
            title="Severity"
            viewMode={viewMode}
            isModified={isFieldModified('severity')}
            preview={
              <Badge variant={severityVariant(ticket.severity)}>
                {ticket.severity}
              </Badge>
            }
            edit={
              <Select
                value={ticket.severity}
                onChange={(e) =>
                  updateField('severity', e.target.value as GeneratedTicket['severity'])
                }
                aria-label="Severity"
              >
                {TICKET_SEVERITIES.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </Select>
            }
          />

          <EditableTicketSection
            title="Priority"
            viewMode={viewMode}
            isModified={isFieldModified('priority')}
            preview={<Badge variant="default">{ticket.priority}</Badge>}
            edit={
              <Select
                value={ticket.priority}
                onChange={(e) =>
                  updateField('priority', e.target.value as GeneratedTicket['priority'])
                }
                aria-label="Priority"
              >
                {TICKET_PRIORITIES.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </Select>
            }
          />
        </div>

        <EditableTicketSection
          title="Severity reasoning"
          viewMode={viewMode}
          isModified={isFieldModified('severityReasoning')}
          preview={<FormattedTicketBlock text={ticket.severityReasoning} />}
          edit={
            <Textarea
              rows={4}
              value={ticket.severityReasoning}
              onChange={(e) => updateField('severityReasoning', e.target.value)}
              aria-label="Severity reasoning"
            />
          }
        />

        <Collapsible
          title="Possible root causes"
          badge={<Badge variant="neutral">{ticket.possibleRootCauses.length}</Badge>}
        >
          {viewMode === 'preview' ? (
            <ul className="list-disc space-y-2 pl-5 marker:text-text-muted">
              {ticket.possibleRootCauses.map((cause, index) => (
                <li key={index} className={isFieldModified('possibleRootCauses') ? 'text-brand' : undefined}>
                  <FormattedTicketText text={cause} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="space-y-2">
              {ticket.possibleRootCauses.map((cause, index) => (
                <Textarea
                  key={index}
                  rows={2}
                  value={cause}
                  onChange={(e) => updateRootCause(index, e.target.value)}
                  aria-label={`Root cause ${index + 1}`}
                />
              ))}
            </div>
          )}
          {viewMode === 'edit' && isFieldModified('possibleRootCauses') && (
            <p className="mt-2 text-xs font-medium text-brand">Modified</p>
          )}
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
