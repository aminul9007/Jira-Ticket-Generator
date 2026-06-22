import type { ResolvedBugInput } from '../../types/bugReport'
import { trimTitleAtWord } from '../../utils/titleText'
import { polishIssueTitle } from '../../utils/polishIssueTitle'
import { CATEGORY_PREFIX } from './categoryConfig'

const JIRA_TITLE_MAX = 200

function envTag(values: ResolvedBugInput): string {
  if (values.environments.includes('Production')) return 'Production'
  if (values.environments.includes('Beta')) return 'Beta'
  return values.environments[0] ?? 'Beta'
}

export function buildTitleSuggestions(
  values: ResolvedBugInput,
): [string, string, string] {
  const prefix = CATEGORY_PREFIX[values.category]
  const shortTitle = polishIssueTitle(values.shortTitle)
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
    ? `[${categoryShort}] ${feature}: ${shortTitle}`
    : `[${categoryShort}] ${shortTitle}`

  return [
    trimTitleAtWord(option1, JIRA_TITLE_MAX),
    trimTitleAtWord(option2, JIRA_TITLE_MAX),
    trimTitleAtWord(option3, JIRA_TITLE_MAX),
  ]
}
