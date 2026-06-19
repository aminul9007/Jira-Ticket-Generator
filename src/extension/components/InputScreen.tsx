import type { TicketContext } from '../../../shared/generation/types'

interface InputScreenProps {
  description: string
  browserContext: TicketContext
  status: 'idle' | 'loading' | 'error'
  errorMessage: string | null
  onDescriptionChange: (value: string) => void
  onGenerate: () => void
}

export function InputScreen({
  description,
  browserContext,
  status,
  errorMessage,
  onDescriptionChange,
  onGenerate,
}: InputScreenProps) {
  const isLoading = status === 'loading'
  const canGenerate = description.trim().length >= 10 && !isLoading

  return (
    <>
      <section className="popup__section">
        <label className="popup__label" htmlFor="voice-placeholder">
          Voice input
        </label>
        <button
          id="voice-placeholder"
          type="button"
          className="popup__voice-button"
          disabled
          aria-disabled="true"
        >
          Voice Button Placeholder
        </button>
      </section>

      <section className="popup__section">
        <label className="popup__label" htmlFor="issue-description">
          Issue description
        </label>
        <textarea
          id="issue-description"
          className="popup__textarea"
          placeholder="Describe the bug you found on this page…"
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
          rows={6}
          disabled={isLoading}
        />
      </section>

      {errorMessage && (
        <p className="popup__error" role="alert">
          {errorMessage}
        </p>
      )}

      <section className="popup__section">
        <button
          type="button"
          className="popup__generate-button popup__generate-button--active"
          disabled={!canGenerate}
          aria-disabled={!canGenerate}
          onClick={onGenerate}
        >
          {isLoading ? 'Generating…' : 'Generate Ticket'}
        </button>
      </section>

      <footer className="popup__footer">
        <p className="popup__footer-title">Captured context</p>
        <div className="popup__meta">
          <p className="popup__meta-row">
            <span className="popup__meta-label">Page</span>
            <span className="popup__meta-value">{browserContext.url || 'Unavailable'}</span>
          </p>
          <p className="popup__meta-row">
            <span className="popup__meta-label">Title</span>
            <span className="popup__meta-value">{browserContext.title || 'Unavailable'}</span>
          </p>
          <p className="popup__meta-row">
            <span className="popup__meta-label">Captured</span>
            <span className="popup__meta-value">{browserContext.timestamp || '—'}</span>
          </p>
        </div>
      </footer>
    </>
  )
}
