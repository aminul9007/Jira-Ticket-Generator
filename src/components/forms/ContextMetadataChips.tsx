import type { DetectedEnvironment, ExtractedContext } from '../../types/contextDetection'
import {
  DETECTED_BROWSER_OPTIONS,
  DETECTED_DEVICE_OPTIONS,
  DETECTED_ENVIRONMENT_OPTIONS,
  DETECTED_OS_OPTIONS,
  formatDetectedEnvironmentLabel,
  formatDetectionSourceBadge,
} from '../../types/contextDetection'
import { cn } from '../../utils/cn'

type ContextFieldKey = keyof ExtractedContext

interface ContextMetadataChipsProps {
  context: ExtractedContext
  onFieldChange: <K extends ContextFieldKey>(
    field: K,
    value: ExtractedContext[K]['value'],
  ) => void
  onFieldClear: (field: ContextFieldKey) => void
}

const FIELD_META: {
  key: ContextFieldKey
  icon: string
  label: string
}[] = [
  { key: 'environment', icon: '🏷', label: 'Environment' },
  { key: 'browser', icon: '🌐', label: 'Browser' },
  { key: 'os', icon: '💻', label: 'OS' },
  { key: 'device', icon: '🖥', label: 'Device' },
]

function isHiddenValue(value: string): boolean {
  return value === 'Unknown' || value === 'unknown'
}

function optionsForField(key: ContextFieldKey): readonly string[] {
  switch (key) {
    case 'environment':
      return DETECTED_ENVIRONMENT_OPTIONS.filter((v) => v !== 'unknown')
    case 'browser':
      return DETECTED_BROWSER_OPTIONS.filter((v) => v !== 'Unknown')
    case 'os':
      return DETECTED_OS_OPTIONS.filter((v) => v !== 'Unknown')
    case 'device':
      return DETECTED_DEVICE_OPTIONS.filter((v) => v !== 'Unknown')
    default:
      return []
  }
}

export function ContextMetadataChips({
  context,
  onFieldChange,
  onFieldClear,
}: ContextMetadataChipsProps) {
  const visibleFields = FIELD_META.filter(({ key }) => {
    const field = context[key]
    return !isHiddenValue(field.value)
  })

  if (visibleFields.length === 0) {
    return null
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-text-muted">Detected context</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Detected QA context">
        {visibleFields.map(({ key, icon, label }) => {
          const field = context[key]
          const sourceBadge = formatDetectionSourceBadge(field.source)
          const selectId = `context-${key}`

          return (
            <div
              key={key}
              className={cn(
                'inline-flex items-center gap-1 rounded-full border border-border-strong',
                'bg-surface-subtle/60 pl-2.5 pr-1 py-1 text-xs text-text-primary',
              )}
            >
              <span aria-hidden="true">{icon}</span>
              <label htmlFor={selectId} className="sr-only">
                {label}
              </label>
              <select
                id={selectId}
                aria-label={`${label}${sourceBadge ? ` (${sourceBadge})` : ''}`}
                className="max-w-[9rem] cursor-pointer border-0 bg-transparent py-0.5 text-xs font-medium text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 rounded"
                value={field.value}
                onChange={(e) =>
                  onFieldChange(
                    key,
                    e.target.value as ExtractedContext[typeof key]['value'],
                  )
                }
              >
                {optionsForField(key).map((option) => (
                  <option key={option} value={option}>
                    {key === 'environment'
                      ? formatDetectedEnvironmentLabel(option as DetectedEnvironment)
                      : option}
                  </option>
                ))}
              </select>
              {sourceBadge && (
                <span className="text-[10px] text-text-muted">({sourceBadge})</span>
              )}
              <button
                type="button"
                className="ml-0.5 rounded-full p-1 text-text-muted hover:bg-surface-elevated hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
                aria-label={`Remove ${label}`}
                onClick={() => onFieldClear(key)}
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
