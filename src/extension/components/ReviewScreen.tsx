import { TICKET_PRIORITIES, TICKET_SEVERITIES } from '../../data/ticketOptions'
import type { GeneratedTicket, TicketPriority, TicketSeverity } from '../../types/bugReport'

interface ReviewScreenProps {
  ticket: GeneratedTicket
  usedAi: boolean
  onTicketChange: (ticket: GeneratedTicket) => void
  onBack: () => void
}

function stepsToText(steps: string[]): string {
  return steps.join('\n')
}

function textToSteps(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

export function ReviewScreen({
  ticket,
  usedAi,
  onTicketChange,
  onBack,
}: ReviewScreenProps) {
  const updateField = <K extends keyof GeneratedTicket>(field: K, value: GeneratedTicket[K]) => {
    onTicketChange({ ...ticket, [field]: value })
  }

  return (
    <>
      <div className="popup__review-header">
        <button type="button" className="popup__back-button" onClick={onBack}>
          ← Back
        </button>
        <p className="popup__review-badge">{usedAi ? 'AI generated' : 'Rules generated'}</p>
      </div>

      <section className="popup__section">
        <label className="popup__label" htmlFor="ticket-title">
          Title
        </label>
        <input
          id="ticket-title"
          className="popup__input"
          value={ticket.title}
          onChange={(event) => updateField('title', event.target.value)}
        />
      </section>

      <section className="popup__section">
        <label className="popup__label" htmlFor="ticket-summary">
          Summary
        </label>
        <textarea
          id="ticket-summary"
          className="popup__textarea popup__textarea--compact"
          value={ticket.issueSummary}
          onChange={(event) => updateField('issueSummary', event.target.value)}
          rows={4}
        />
      </section>

      <section className="popup__section">
        <label className="popup__label" htmlFor="ticket-steps">
          Steps to Reproduce
        </label>
        <textarea
          id="ticket-steps"
          className="popup__textarea popup__textarea--compact"
          value={stepsToText(ticket.stepsToReproduce)}
          onChange={(event) => updateField('stepsToReproduce', textToSteps(event.target.value))}
          rows={4}
        />
      </section>

      <section className="popup__section">
        <label className="popup__label" htmlFor="ticket-expected">
          Expected Result
        </label>
        <textarea
          id="ticket-expected"
          className="popup__textarea popup__textarea--compact"
          value={ticket.expectedResult}
          onChange={(event) => updateField('expectedResult', event.target.value)}
          rows={2}
        />
      </section>

      <section className="popup__section">
        <label className="popup__label" htmlFor="ticket-actual">
          Actual Result
        </label>
        <textarea
          id="ticket-actual"
          className="popup__textarea popup__textarea--compact"
          value={ticket.actualResult}
          onChange={(event) => updateField('actualResult', event.target.value)}
          rows={2}
        />
      </section>

      <section className="popup__section popup__section--row">
        <div className="popup__field-half">
          <label className="popup__label" htmlFor="ticket-severity">
            Severity
          </label>
          <select
            id="ticket-severity"
            className="popup__select"
            value={ticket.severity}
            onChange={(event) =>
              updateField('severity', event.target.value as TicketSeverity)
            }
          >
            {TICKET_SEVERITIES.map((severity) => (
              <option key={severity} value={severity}>
                {severity}
              </option>
            ))}
          </select>
        </div>

        <div className="popup__field-half">
          <label className="popup__label" htmlFor="ticket-priority">
            Priority
          </label>
          <select
            id="ticket-priority"
            className="popup__select"
            value={ticket.priority}
            onChange={(event) =>
              updateField('priority', event.target.value as TicketPriority)
            }
          >
            {TICKET_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>
      </section>
    </>
  )
}
