import type {
  BugCategory,
  GeneratedTicket,
  ValidatedBugReportFormValues,
} from '../types/bugReport'
import { deriveTicketMetadata } from './deriveTicketMetadata'

const CATEGORY_PREFIX: Record<BugCategory, string> = {
  'UI Bug': '[UI]',
  'Functional Bug': '[FUNC]',
  'Mobile Bug': '[MOBILE]',
  'SEO Issue': '[SEO]',
  'Accessibility Issue': '[A11Y]',
  'Performance Issue': '[PERF]',
}

function formatEnvironmentList(environments: ValidatedBugReportFormValues['environments']): string {
  return environments.join(', ')
}

function buildIssueSummary(
  values: ValidatedBugReportFormValues,
  envList: string,
): string {
  const title = values.title.trim()
  const notes = values.additionalNotes.trim()
  const base = `A ${values.category.toLowerCase()} was reported in ${envList}: "${title}".`

  if (notes) {
    return `${base} Additional context: ${notes}`
  }

  return `${base} Impact and scope should be confirmed during triage.`
}

function buildStepsToReproduce(
  values: ValidatedBugReportFormValues,
  envList: string,
): string[] {
  const steps = [
    `Deploy or access the application in the ${envList} environment.`,
    `Reproduce the scenario described in the bug report: "${values.title.trim()}".`,
    `Observe the application behavior related to this ${values.category.toLowerCase()}.`,
    'Document the result and compare against expected behavior.',
  ]

  const notes = values.additionalNotes.trim()
  if (notes) {
    steps.push(`Reference notes from reporter: ${notes}`)
  }

  return steps
}

function buildExpectedResult(category: BugCategory, title: string): string {
  const templates: Record<BugCategory, string> = {
    'UI Bug': `The UI should render and behave correctly for: "${title}". Visual layout, interactions, and states should match design specifications.`,
    'Functional Bug': `The feature should complete its intended workflow for: "${title}". All business rules and validations should pass without errors.`,
    'Mobile Bug': `Mobile experience should be consistent and usable for: "${title}". Touch targets, layout, and device-specific behavior should work as designed.`,
    'SEO Issue': `Search-related metadata, indexing, and page structure should meet SEO requirements for: "${title}".`,
    'Accessibility Issue': `The experience should be perceivable, operable, and understandable for all users regarding: "${title}". WCAG-aligned behavior is expected.`,
    'Performance Issue': `The system should meet performance targets (load time, responsiveness, resource usage) when handling: "${title}".`,
  }
  return templates[category]
}

function buildActualResult(
  values: ValidatedBugReportFormValues,
  envList: string,
): string {
  const title = values.title.trim()
  const notes = values.additionalNotes.trim()
  let result = `In ${envList}, the reported issue occurs: "${title}". Behavior deviates from expected ${values.category.toLowerCase()} standards.`

  if (notes) {
    result += ` Reporter notes: ${notes}`
  } else {
    result +=
      ' Detailed reproduction evidence (screenshots, logs, HAR) should be attached before submission to Jira.'
  }

  return result
}

export function generateTicketFromForm(
  values: ValidatedBugReportFormValues,
): GeneratedTicket {
  const envList = formatEnvironmentList(values.environments)
  const { severity, priority } = deriveTicketMetadata(
    values.category,
    values.environments,
  )
  const trimmedTitle = values.title.trim()

  return {
    title: `${CATEGORY_PREFIX[values.category]} ${trimmedTitle}`,
    issueSummary: buildIssueSummary(values, envList),
    stepsToReproduce: buildStepsToReproduce(values, envList),
    expectedResult: buildExpectedResult(values.category, trimmedTitle),
    actualResult: buildActualResult(values, envList),
    severity,
    priority,
    category: values.category,
    environments: [...values.environments],
  }
}
