import type { BugCategory, ResolvedBugInput } from '../../types/bugReport'
import { deriveTicketMetadata } from '../../utils/deriveTicketMetadata'

export function formatEnvironmentList(environments: ResolvedBugInput['environments']): string {
  return environments.length > 0 ? environments.join(', ') : 'Beta (inferred — confirm with reporter)'
}

export function buildIssueSummary(
  values: ResolvedBugInput,
  envList: string,
): string {
  const feature = values.affectedFeaturePage.trim()
  const location = feature
    ? `on *${feature}*`
    : 'in the affected area (feature inferred — confirm during triage)'

  let summary = `*Summary:* A ${values.category.toLowerCase()} was observed ${location} in *${envList}*.\n\n`
  summary += `*Reported behavior:* ${values.shortTitle}`
  summary += `\n\n*Reporter description:* ${values.issueDescription.trim()}`

  return summary
}

export function buildStepsToReproduce(
  values: ResolvedBugInput,
  envList: string,
): string[] {
  const feature = values.affectedFeaturePage.trim()
  const steps: string[] = [
    `Access the application in the *${envList}* environment.`,
  ]

  if (feature) {
    steps.push(`Navigate to *${feature}*.`)
  } else {
    steps.push('Navigate to the area where the issue occurs (confirm exact page with reporter).')
  }

  steps.push('Follow the actions described in the issue report below.')
  steps.push(`*Issue description:* ${values.issueDescription.trim()}`)
  steps.push('Observe the actual behavior and compare with the expected result below.')

  return steps
}

export function buildExpectedResult(
  category: BugCategory,
  values: ResolvedBugInput,
): string {
  const feature = values.affectedFeaturePage.trim()
  const scope = feature ? ` on ${feature}` : ''

  const templates: Record<BugCategory, string> = {
    'UI Bug': `UI${scope} should match design specs for: "${values.shortTitle}". Layout and interactive states should be consistent.`,
    'Functional Bug': `The workflow${scope} should complete successfully for: "${values.shortTitle}". State and API responses should align with requirements.`,
    'Mobile Bug': `Mobile experience${scope} should work as designed for: "${values.shortTitle}".`,
    'SEO Issue': `SEO elements${scope} should be correctly configured for: "${values.shortTitle}".`,
    'Accessibility Issue': `The experience${scope} should be accessible for: "${values.shortTitle}" (WCAG-aligned).`,
    'Performance Issue': `Performance${scope} should meet targets for: "${values.shortTitle}".`,
  }
  return templates[category]
}

export function buildActualResult(
  values: ResolvedBugInput,
  envList: string,
): string {
  const feature = values.affectedFeaturePage.trim()

  let result = `In *${envList}*`
  if (feature) result += ` on *${feature}*`
  result += `, the following occurs: "${values.shortTitle}".\n\n`
  result += `*Observed:* ${values.issueDescription.trim()}`

  return result
}

export function buildSeverityReasoning(
  values: ResolvedBugInput,
): string {
  const { severity, priority } = deriveTicketMetadata(
    values.category,
    values.environments,
  )
  const envList = formatEnvironmentList(values.environments)
  const prod = values.environments.includes('Production')

  let reasoning = `*${severity}* severity and *${priority}* priority were inferred from `

  reasoning += `bug category (*${values.category}*), environment (*${envList}*), and issue description.`

  if (prod) {
    reasoning += ' *Production* impact may affect live users, warranting elevated urgency.'
  }

  if (!values.affectedFeaturePage.trim()) {
    reasoning += ' Feature scope was inferred — revise after triage if needed.'
  }

  return reasoning
}
