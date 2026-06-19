import type { CreateJiraIssueResponse } from '../../../shared/jiraApi'

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
      <p className="popup__success-title">Ticket Created Successfully</p>
      <p className="popup__success-key">{result.issueKey}</p>
      <p className="popup__success-url">{result.issueUrl}</p>

      <div className="popup__success-actions">
        <button
          type="button"
          className="popup__generate-button popup__generate-button--active"
          onClick={onOpenTicket}
        >
          Open Jira Ticket
        </button>
        <button
          type="button"
          className="popup__secondary-button"
          onClick={onCreateAnother}
        >
          Create Another Ticket
        </button>
      </div>
    </div>
  )
}
