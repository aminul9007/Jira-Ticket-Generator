import type { BugCategory, ValidatedBugReportFormValues } from '../../types/bugReport'
import { deriveTicketMetadata } from '../../utils/deriveTicketMetadata'

export function formatEnvironmentList(
  environments: ValidatedBugReportFormValues['environments'],
): string {
  return environments.join(', ')
}

export function buildIssueSummary(
  values: ValidatedBugReportFormValues,
  envList: string,
): string {
  const title = values.title.trim()
  const feature = values.affectedFeaturePage.trim()
  const notes = values.additionalNotes.trim()

  const location = feature
    ? `on *${feature}*`
    : 'in the affected area (feature not specified — confirm during triage)'

  let summary = `*Summary:* A ${values.category.toLowerCase()} was observed ${location} in *${envList}*.\n\n`
  summary += `*Reported behavior:* ${title}`

  if (notes) {
    summary += `\n\n*Reporter notes:* ${notes}`
  }

  return summary
}

export function buildStepsToReproduce(
  values: ValidatedBugReportFormValues,
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

  steps.push(`Perform the actions related to: "${values.title.trim()}".`)
  steps.push('Observe the actual behavior and compare with the expected result below.')

  const notes = values.additionalNotes.trim()
  if (notes) {
    steps.push(`*Additional context:* ${notes}`)
  }

  return steps
}

export function buildExpectedResult(
  category: BugCategory,
  values: ValidatedBugReportFormValues,
): string {
  const title = values.title.trim()
  const feature = values.affectedFeaturePage.trim()
  const scope = feature ? ` on ${feature}` : ''

  const templates: Record<BugCategory, string> = {
    'UI Bug': `UI${scope} should match design specs and behave correctly for: "${title}". All interactive states and layouts should be consistent across supported viewports.`,
    'Functional Bug': `The workflow${scope} should complete successfully for: "${title}". Validations, API responses, and persisted state should align with requirements.`,
    'Mobile Bug': `Mobile experience${scope} should be fully usable for: "${title}". Touch interactions, layout, and device-specific behavior should work as designed.`,
    'SEO Issue': `SEO elements${scope} should be correctly configured for: "${title}". Metadata, indexing signals, and URL structure should meet standards.`,
    'Accessibility Issue': `The experience${scope} should be accessible for: "${title}". Keyboard, screen reader, and contrast requirements should be satisfied (WCAG-aligned).`,
    'Performance Issue': `Performance${scope} should meet targets for: "${title}". Load time, responsiveness, and resource usage should stay within agreed thresholds.`,
  }
  return templates[category]
}

export function buildActualResult(
  values: ValidatedBugReportFormValues,
  envList: string,
): string {
  const title = values.title.trim()
  const feature = values.affectedFeaturePage.trim()
  const notes = values.additionalNotes.trim()

  let result = `In *${envList}*`
  if (feature) result += ` on *${feature}*`
  result += `, the following occurs: "${title}".\n\n`
  result += `*Observed:* Behavior does not meet expected ${values.category.toLowerCase()} standards.`

  if (notes) {
    result += `\n\n*Evidence / notes:* ${notes}`
  } else {
    result +=
      '\n\n*Evidence / notes:* Attach screenshots, video, console logs, or HAR before Jira submission.'
  }

  return result
}

export function buildSeverityReasoning(
  values: ValidatedBugReportFormValues,
): string {
  const { severity, priority } = deriveTicketMetadata(
    values.category,
    values.environments,
  )
  const envList = formatEnvironmentList(values.environments)
  const prod = values.environments.includes('Production')

  let reasoning = `*${severity}* severity and *${priority}* priority were assigned based on `

  reasoning += `bug category (*${values.category}*), environment (*${envList}*)`

  if (prod) {
    reasoning +=
      ', and *Production* impact — live users may be affected, warranting elevated urgency.'
  } else {
    reasoning +=
      '. No Production environment was selected; impact is likely limited to pre-production validation.'
  }

  if (!values.affectedFeaturePage.trim()) {
    reasoning +=
      ' Feature scope is unclear — severity may be revised after triage identifies affected surface area.'
  }

  return reasoning
}
