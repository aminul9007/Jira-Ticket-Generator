import { useEffect, useState } from 'react'
import { TICKET_PRIORITIES, TICKET_SEVERITIES } from '../../data/ticketOptions'
import type { GeneratedTicket, TicketPriority, TicketSeverity } from '../../types/bugReport'
import { loadExtensionAppSettings } from '../services/extensionSettingsService'
import {
  loadExtensionJiraDefaults,
  saveExtensionJiraDefaults,
} from '../services/extensionJiraDefaultsService'
import type { ExtensionJiraDefaults } from '../types/extensionJiraDefaults'
import { JiraFieldsSection } from './JiraFieldsSection'

interface ReviewScreenProps {
  ticket: GeneratedTicket
  usedAi: boolean
  onTicketChange: (ticket: GeneratedTicket) => void
  onBack: () => void
  jiraErrorMessage: string | null
  isCreatingJira: boolean
  onCreateJira: (jiraFields: ExtensionJiraDefaults) => void
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
  jiraErrorMessage,
  isCreatingJira,
  onCreateJira,
}: ReviewScreenProps) {
  const [jiraDefaults, setJiraDefaults] = useState<ExtensionJiraDefaults | null>(null)

  useEffect(() => {
    void loadExtensionAppSettings().then((settings) => {
      void loadExtensionJiraDefaults(settings.ticketDefaults).then(setJiraDefaults)
    })
  }, [])

  const updateField = <K extends keyof GeneratedTicket>(field: K, value: GeneratedTicket[K]) => {
    onTicketChange({ ...ticket, [field]: value })
  }

  const updateJiraDefaults = (patch: Partial<ExtensionJiraDefaults>) => {
    setJiraDefaults((current) => {
      if (!current) return current
      const next = { ...current, ...patch }
      void saveExtensionJiraDefaults(next)
      return next
    })
  }

  const canCreateJira =
    Boolean(jiraDefaults?.projectKey.trim()) && !isCreatingJira

  return (
    <>
      <div className="popup__review-header">
        <button
          type="button"
          className="popup__back-button"
          onClick={onBack}
          disabled={isCreatingJira}
        >
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
          disabled={isCreatingJira}
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
          disabled={isCreatingJira}
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
          disabled={isCreatingJira}
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
          disabled={isCreatingJira}
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
          disabled={isCreatingJira}
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
            disabled={isCreatingJira}
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
            disabled={isCreatingJira}
          >
            {TICKET_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>
      </section>

      {jiraDefaults && (
        <JiraFieldsSection defaults={jiraDefaults} onChange={updateJiraDefaults} />
      )}

      {jiraErrorMessage && (
        <p className="popup__error" role="alert">
          {jiraErrorMessage}
        </p>
      )}

      <section className="popup__section popup__section--sticky">
        <button
          type="button"
          className="popup__generate-button popup__generate-button--active"
          disabled={!canCreateJira}
          aria-disabled={!canCreateJira}
          onClick={() => {
            if (jiraDefaults) {
              onCreateJira(jiraDefaults)
            }
          }}
        >
          {isCreatingJira ? 'Creating Ticket...' : 'Create Jira'}
        </button>
      </section>
    </>
  )
}
