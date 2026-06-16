import { useEffect, useMemo, useState } from 'react'
import type { ExtractedContext } from '../../types/contextDetection'
import {
  DETECTED_BROWSER_OPTIONS,
  DETECTED_DEVICE_OPTIONS,
  DETECTED_ENVIRONMENT_OPTIONS,
  DETECTED_OS_OPTIONS,
  formatDetectedEnvironmentLabel,
  formatDetectionSourceBadge,
  type DetectedEnvironment,
} from '../../types/contextDetection'
import {
  MISSING_CONTEXT_FIELD_LABELS,
  type MissingContextField,
} from '../../utils/contextDetection/getMissingContextFields'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { Select } from '../ui/Select'

export type ContextCompletionSelections = Partial<Record<MissingContextField, string>>

interface ContextCompletionModalProps {
  fields: MissingContextField[]
  context: ExtractedContext
  onContinue: (selections: ContextCompletionSelections) => void
  onSkip: () => void
}

function optionsForField(field: MissingContextField): readonly string[] {
  switch (field) {
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

function formatOptionLabel(field: MissingContextField, option: string): string {
  if (field === 'environment') {
    return formatDetectedEnvironmentLabel(option as DetectedEnvironment)
  }
  return option
}

function initialSelectionForField(
  field: MissingContextField,
  context: ExtractedContext,
): string {
  const current = context[field].value
  if (current === 'Unknown' || current === 'unknown') return ''
  return current
}

export function ContextCompletionModal({
  fields,
  context,
  onContinue,
  onSkip,
}: ContextCompletionModalProps) {
  const isOpen = fields.length > 0

  const initialSelections = useMemo(() => {
    const next: ContextCompletionSelections = {}
    for (const field of fields) {
      next[field] = initialSelectionForField(field, context)
    }
    return next
  }, [context, fields])

  const [selections, setSelections] = useState<ContextCompletionSelections>(initialSelections)

  useEffect(() => {
    setSelections(initialSelections)
  }, [initialSelections])

  if (!isOpen) return null

  const canContinue = fields.every((field) => Boolean(selections[field]?.trim()))

  const handleContinue = () => {
    onContinue(selections)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onSkip}
      title="Additional context"
      description="We couldn't detect everything from your description. Fill in what's missing or skip to continue."
      footer={
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onSkip}>
            Skip
          </Button>
          <Button size="sm" onClick={handleContinue} disabled={!canContinue}>
            Continue
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {fields.map((field) => {
          const meta = MISSING_CONTEXT_FIELD_LABELS[field]
          const selectId = `context-completion-${field}`
          const detected = context[field]
          const badge = formatDetectionSourceBadge(detected.source)

          return (
            <div key={field} className="space-y-2">
              <label htmlFor={selectId} className="type-label block">
                {meta.title}
                {badge && (
                  <span className="type-micro ml-2 font-normal text-text-muted">
                    ({badge})
                  </span>
                )}
              </label>
              <Select
                id={selectId}
                value={selections[field] ?? ''}
                onChange={(e) => {
                  setSelections((prev) => ({ ...prev, [field]: e.target.value }))
                }}
              >
                <option value="">Select…</option>
                {optionsForField(field).map((option) => (
                  <option key={option} value={option}>
                    {formatOptionLabel(field, option)}
                  </option>
                ))}
              </Select>
            </div>
          )
        })}
      </div>
    </Modal>
  )
}
