import type { InputQualityReport } from '../../types/inputQuality'
import { cn } from '../../utils/cn'

interface InputQualityAlertsProps {
  report: InputQualityReport
  className?: string
}

const issueIcons: Record<InputQualityReport['issues'][0]['type'], string> = {
  missing_environment: 'Environment',
  missing_feature: 'Feature',
  missing_reproduction: 'Repro',
}

export function InputQualityAlerts({ report, className }: InputQualityAlertsProps) {
  if (report.issues.length === 0) return null

  return (
    <div
      className={cn(
        'rounded-xl border border-warning-border bg-warning-surface p-4',
        className,
      )}
      role="status"
    >
      <p className="text-sm font-medium text-warning-text">
        Improve ticket accuracy before generating
      </p>
      <ul className="mt-3 space-y-2.5">
        {report.issues.map((issue) => (
          <li key={issue.type} className="text-sm text-warning-text">
            <span className="mr-2 inline-flex rounded-md bg-warning-badge-bg px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-warning-badge-text">
              {issueIcons[issue.type]}
            </span>
            <span className="font-medium">{issue.message}</span>
            <span className="mt-0.5 block text-xs leading-relaxed text-warning-text-muted">
              {issue.suggestion}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-warning-text-muted">
        Completeness: {report.completenessScore}% — you can still generate, but
        filling gaps raises confidence.
      </p>
    </div>
  )
}
