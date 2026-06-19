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
import { LoadingButton } from './LoadingButton'

interface ReviewScreenProps {
  ticket: GeneratedTicket
  usedAi: boolean
  onTicketChange: (ticket: GeneratedTicket) => void
  onBack: () => void
  initialJiraDefaults?: ExtensionJiraDefaults | null
  onJiraDefaultsChange?: (defaults: ExtensionJiraDefaults) => void
  jiraErrorMessage: string | null
  isCreatingJira: boolean
  onCreateJira: (jiraFields: ExtensionJiraDefaults) => void
  onRetryJira: () => void
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
  initialJiraDefaults,
  onJiraDefaultsChange,
  jiraErrorMessage,
  isCreatingJira,
  onCreateJira,
  onRetryJira,
}: ReviewScreenProps) {
  const [jiraDefaults, setJiraDefaults] = useState<ExtensionJiraDefaults | null>(
    initialJiraDefaults ?? null,
  )
  const [validationAttempted, setValidationAttempted] = useState(false)

  useEffect(() => {
    if (initialJiraDefaults) {
      setJiraDefaults(initialJiraDefaults)
      return
    }

    void loadExtensionAppSettings().then((settings) => {
      void loadExtensionJiraDefaults(settings.ticketDefaults).then(setJiraDefaults)
    })
  }, [initialJiraDefaults])

  const updateField = <K extends keyof GeneratedTicket>(field: K, value: GeneratedTicket[K]) => {
    onTicketChange({ ...ticket, [field]: value })
  }

  const updateJiraDefaults = (patch: Partial<ExtensionJiraDefaults>) => {
    setJiraDefaults((current) => {
      if (!current) return current
      const next = { ...current, ...patch }
      void saveExtensionJiraDefaults(next)
      onJiraDefaultsChange?.(next)
      return next
    })
  }

  const projectMissing = !jiraDefaults?.projectKey.trim()
  const issueTypeMissing = !jiraDefaults?.issueType

  const handleCreateClick = () => {
    setValidationAttempted(true)
    if (!jiraDefaults || projectMissing || issueTypeMissing) return
    onCreateJira(jiraDefaults)
  }

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
        <JiraFieldsSection
          defaults={jiraDefaults}
          onChange={updateJiraDefaults}
          projectError={
            validationAttempted && projectMissing
              ? 'Please enter a Jira project key.'
              : null
          }
          issueTypeError={
            validationAttempted && issueTypeMissing ? 'Please select an issue type.' : null
          }
        />
      )}

      {jiraErrorMessage && (
        <div className="popup__error-block" role="alert">
          <p className="popup__error">{jiraErrorMessage}</p>
          <button
            type="button"
            className="popup__retry-button"
            disabled={isCreatingJira}
            onClick={onRetryJira}
          >
            Retry Jira Creation
          </button>
        </div>
      )}

      <section className="popup__section popup__section--sticky">
        <LoadingButton
          isLoading={isCreatingJira}
          loadingLabel="Creating ticket in Jira…"
          idleLabel="Create Jira"
          disabled={!jiraDefaults}
          onClick={handleCreateClick}
        />
      </section>
    </>
  )
}
