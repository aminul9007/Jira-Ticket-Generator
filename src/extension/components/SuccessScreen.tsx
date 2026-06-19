import type { CreateJiraIssueResponse } from '../../../shared/jiraApi'
import { LoadingButton } from './LoadingButton'

interface SuccessScreenProps {
  result: CreateJiraIssueResponse
  onOpenTicket: () => void
  onCreateAnother: () => void
}

export function SuccessScreen({
  result,
  onOpenTicket,
  onCreateAnother,
}: SuccessScreenProps) {
  return (
    <div className="popup__success">
      <div className="popup__success-icon" aria-hidden="true">
        ✓
      </div>
      <p className="popup__success-title">Ticket Created Successfully</p>

      <dl className="popup__success-details">
        <div className="popup__success-detail">
          <dt>Ticket Key</dt>
          <dd className="popup__success-key">{result.issueKey}</dd>
        </div>
        <div className="popup__success-detail">
          <dt>Ticket Link</dt>
          <dd>
            <a
              className="popup__success-link"
              href={result.issueUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {result.issueUrl}
            </a>
          </dd>
        </div>
      </dl>

      <div className="popup__success-actions">
        <LoadingButton
          isLoading={false}
          loadingLabel="Open Ticket"
          idleLabel="Open Ticket"
          onClick={onOpenTicket}
        />
        <LoadingButton
          isLoading={false}
          loadingLabel="Create Another"
          idleLabel="Create Another Ticket"
          variant="secondary"
          onClick={onCreateAnother}
        />
      </div>
    </div>
  )
}
