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
      <p className="type-helper font-medium text-text-secondary">
        Tips for a stronger ticket ({report.completenessScore}% complete)
      </p>
      <ul className="mt-2.5 space-y-2">
        {report.issues.map((issue) => (
          <li key={issue.type} className="type-helper leading-5">
            <span className="type-micro mr-1.5 inline-flex rounded-md bg-surface-subtle px-1.5 py-0.5 text-text-secondary">
              {issueIcons[issue.type]}
            </span>
            {issue.suggestion}
          </li>
        ))}
      </ul>
    </div>
  )
}
