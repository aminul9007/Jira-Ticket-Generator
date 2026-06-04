import type { InputQualityReport } from '../../types/inputQuality'

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
      className={className}
      role="status"
    >
      <p className="text-xs font-medium text-text-secondary">
        Tips for a stronger ticket ({report.completenessScore}% complete)
      </p>
      <ul className="mt-2 space-y-1.5">
        {report.issues.map((issue) => (
          <li key={issue.type} className="text-xs text-text-muted">
            <span className="mr-1.5 inline-flex rounded-md bg-surface-subtle px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
              {issueIcons[issue.type]}
            </span>
            {issue.suggestion}
          </li>
        ))}
      </ul>
    </div>
  )
}
