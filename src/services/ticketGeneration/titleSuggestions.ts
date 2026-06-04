import type { ResolvedBugInput } from '../../types/bugReport'
import { CATEGORY_PREFIX } from './categoryConfig'

function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  return `${text.slice(0, max - 1).trim()}…`
}

function envTag(values: ResolvedBugInput): string {
  if (values.environments.includes('Production')) return 'Production'
  if (values.environments.includes('Beta')) return 'Beta'
  return values.environments[0] ?? 'Beta'
}

export function buildTitleSuggestions(
  values: ResolvedBugInput,
): [string, string, string] {
  const prefix = CATEGORY_PREFIX[values.category]
  const shortTitle = truncate(values.shortTitle, 72)
  const feature = values.affectedFeaturePage.trim() || null
  const env = envTag(values)

  const option1 = feature
    ? `${prefix} ${feature} — ${shortTitle}`
    : `${prefix} ${shortTitle}`

  const option2 = feature
    ? `${env}: ${feature} — ${shortTitle}`
    : `${env}: ${shortTitle}`

  const categoryShort = values.category.replace(' Bug', '').replace(' Issue', '')
  const option3 = feature
    ? `[${categoryShort}][${env}] ${feature}: ${truncate(values.shortTitle, 55)}`
    : `[${categoryShort}][${env}] ${truncate(values.shortTitle, 60)}`

  return [
    truncate(option1, 120),
    truncate(option2, 120),
    truncate(option3, 120),
  ]
}
