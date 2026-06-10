import type { TicketFeedbackRating } from '../../types/ticketFeedback'
import { Button } from '../ui/Button'

interface TicketFeedbackBarProps {
  rating: TicketFeedbackRating | null
  canSubmit: boolean
  onSubmit: (rating: TicketFeedbackRating) => void
}

export function TicketFeedbackBar({
  rating,
  canSubmit,
  onSubmit,
}: TicketFeedbackBarProps) {
  if (!canSubmit) return null

  return (
    <div className="mb-5 rounded-xl border border-border/70 bg-surface-subtle/40 p-4">
      <p className="type-section-title mb-3">
        Was this ticket helpful?
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant={rating === 'helpful' ? 'primary' : 'secondary'}
          onClick={() => onSubmit('helpful')}
          disabled={rating !== null}
        >
          Helpful
        </Button>
        <Button
          type="button"
          size="sm"
          variant={rating === 'needs_improvement' ? 'primary' : 'secondary'}
          onClick={() => onSubmit('needs_improvement')}
          disabled={rating !== null}
        >
          Needs Improvement
        </Button>
      </div>
      {rating && (
        <p className="type-helper mt-2.5">
          Thanks — feedback saved locally to improve future tickets.
        </p>
      )}
    </div>
  )
}
