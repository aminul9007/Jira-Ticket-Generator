import type { JiraCreationState } from '../../hooks/useJiraIssueCreation'
import { Button } from '../ui/Button'

interface JiraCreationStatusProps {
  state: JiraCreationState
  onDismiss?: () => void
}

export function JiraCreationStatus({ state, onDismiss }: JiraCreationStatusProps) {
  if (state.status === 'idle') return null

  if (state.status === 'creating') {
    return (
      <div
        className="rounded-xl border border-brand/30 bg-brand/5 px-4 py-3"
        role="status"
        aria-live="polite"
      >
        <p className="type-body font-medium text-brand">Creating Ticket…</p>
      </div>
    )
  }

  if (state.status === 'success') {
    return (
      <div
        className="rounded-xl border border-success/30 bg-badge-success-bg px-4 py-4"
        role="status"
        aria-live="polite"
      >
        <p className="type-section-title text-badge-success-text">
          ✅ Ticket Created
        </p>
        <dl className="mt-3 space-y-1.5">
          <div>
            <dt className="type-helper font-medium text-text-muted">Issue Key</dt>
            <dd className="type-body font-semibold tabular-nums">{state.result.issueKey}</dd>
          </div>
        </dl>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => window.open(state.result.issueUrl, '_blank', 'noopener,noreferrer')}
          >
            Open Jira Ticket
          </Button>
          {onDismiss && (
            <Button variant="ghost" size="sm" onClick={onDismiss}>
              Dismiss
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className="rounded-xl border border-danger/30 bg-danger/5 px-4 py-3"
      role="alert"
    >
      <p className="type-section-title text-danger">Could not create Jira ticket</p>
      <p className="type-helper mt-1.5 leading-6 text-danger/90">{state.message}</p>
      {onDismiss && (
        <Button variant="ghost" size="sm" className="mt-3" onClick={onDismiss}>
          Dismiss
        </Button>
      )}
    </div>
  )
}
