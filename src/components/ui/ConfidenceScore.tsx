import { cn } from '../../utils/cn'

interface ConfidenceScoreProps {
  score: number
  className?: string
}

function scoreVariant(score: number): 'success' | 'warning' | 'danger' {
  if (score >= 75) return 'success'
  if (score >= 50) return 'warning'
  return 'danger'
}

const barColors = {
  success: 'bg-confidence-success',
  warning: 'bg-confidence-warning',
  danger: 'bg-confidence-danger',
}

export function ConfidenceScore({ score, className }: ConfidenceScoreProps) {
  const variant = scoreVariant(score)
  const clamped = Math.min(100, Math.max(0, score))

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="min-w-[3.5rem] text-right">
        <span className="text-lg font-bold tabular-nums text-text-primary">
          {clamped}
        </span>
        <span className="text-xs text-text-muted">%</span>
      </div>
      <div className="flex-1">
        <div className="h-2 overflow-hidden rounded-full bg-confidence-track">
          <div
            className={cn('h-full rounded-full transition-all duration-500', barColors[variant])}
            style={{ width: `${clamped}%` }}
            role="progressbar"
            aria-valuenow={clamped}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Confidence score ${clamped} percent`}
          />
        </div>
        <p className="mt-1 text-xs text-text-muted">Ticket confidence</p>
      </div>
    </div>
  )
}
