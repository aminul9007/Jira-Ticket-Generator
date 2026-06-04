import type { DetectedField, ExtractedContext } from '../../types/contextDetection'
import { formatDetectedEnvironmentLabel } from '../../types/contextDetection'

function formatFieldForPrompt<T extends string>(
  label: string,
  field: DetectedField<T>,
  formatValue: (value: T) => string = (v) => v,
): string {
  const display =
    field.source === 'unknown' || field.value === 'Unknown' || field.value === 'unknown'
      ? 'Not Specified'
      : formatValue(field.value)

  return `${label}: ${display} (source: ${field.source})`
}

export function formatExtractedContextForPrompt(context: ExtractedContext): string {
  return [
    '### Detected QA context (metadata — do not invent missing values)',
    formatFieldForPrompt('Environment', context.environment, formatDetectedEnvironmentLabel),
    formatFieldForPrompt('Browser', context.browser),
    formatFieldForPrompt('Operating System', context.os),
    formatFieldForPrompt('Device Type', context.device),
    '',
    'Rules:',
    '- Treat source "user" as highest confidence.',
    '- Treat source "auto-detected" as secondary context only.',
    '- Do not override metadata unless the issue description explicitly contradicts it.',
    '- When a field is Not Specified, write "Not specified" in the ticket — never guess browser, OS, or device.',
  ].join('\n')
}
