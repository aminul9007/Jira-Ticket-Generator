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
        'rounded-xl border border-amber-200/80 bg-amber-50/60 p-4',
        className,
      )}
      role="status"
    >
      <p className="text-sm font-medium text-amber-900">
        Improve ticket accuracy before generating
      </p>
      <ul className="mt-3 space-y-2.5">
        {report.issues.map((issue) => (
          <li key={issue.type} className="text-sm text-amber-950/90">
            <span className="mr-2 inline-flex rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
              {issueIcons[issue.type]}
            </span>
            <span className="font-medium">{issue.message}</span>
            <span className="mt-0.5 block text-xs leading-relaxed text-amber-900/80">
              {issue.suggestion}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-amber-800/70">
        Completeness: {report.completenessScore}% — you can still generate, but
        filling gaps raises confidence.
      </p>
    </div>
  )
}
