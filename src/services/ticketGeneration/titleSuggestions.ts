import type { ValidatedBugReportFormValues } from '../../types/bugReport'
import { CATEGORY_PREFIX } from './categoryConfig'

function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  return `${text.slice(0, max - 1).trim()}…`
}

function featureLabel(values: ValidatedBugReportFormValues): string | null {
  const feature = values.affectedFeaturePage.trim()
  return feature || null
}

function envTag(values: ValidatedBugReportFormValues): string {
  if (values.environments.includes('Production')) return 'Production'
  if (values.environments.includes('Beta')) return 'Beta'
  return values.environments[0] ?? 'Env'
}

export function buildTitleSuggestions(
  values: ValidatedBugReportFormValues,
): [string, string, string] {
  const prefix = CATEGORY_PREFIX[values.category]
  const shortTitle = truncate(values.title.trim(), 72)
  const feature = featureLabel(values)
  const env = envTag(values)

  const option1 = feature
    ? `${prefix} ${feature} — ${shortTitle}`
    : `${prefix} ${shortTitle}`

  const option2 = feature
    ? `${env}: ${feature} — ${shortTitle}`
    : `${env}: ${shortTitle}`

  const categoryShort = values.category.replace(' Bug', '').replace(' Issue', '')
  const option3 = feature
    ? `[${categoryShort}][${env}] ${feature}: ${truncate(values.title.trim(), 55)}`
    : `[${categoryShort}][${env}] ${truncate(values.title.trim(), 60)}`

  return [
    truncate(option1, 120),
    truncate(option2, 120),
    truncate(option3, 120),
  ]
}
