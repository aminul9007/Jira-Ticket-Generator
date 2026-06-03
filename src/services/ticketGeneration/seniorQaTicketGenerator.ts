import type { GeneratedTicket, ValidatedBugReportFormValues } from '../../types/bugReport'
import type { InputQualityReport } from '../../types/inputQuality'
import { deriveTicketMetadata } from '../../utils/deriveTicketMetadata'
import { calculateConfidenceScore } from './confidenceScorer'
import { ROOT_CAUSE_HINTS } from './categoryConfig'
import {
  buildActualResult,
  buildExpectedResult,
  buildIssueSummary,
  buildSeverityReasoning,
  buildStepsToReproduce,
  formatEnvironmentList,
} from './contentBuilders'
import { buildTitleSuggestions } from './titleSuggestions'

function buildRootCauses(values: ValidatedBugReportFormValues): string[] {
  const base = [...ROOT_CAUSE_HINTS[values.category]]
  const feature = values.affectedFeaturePage.trim()

  if (feature) {
    base.unshift(
      `Regression introduced in recent deploy affecting *${feature}*`,
    )
  }

  if (values.environments.includes('Production')) {
    base.push('Configuration or feature flag difference between environments')
  }

  return base.slice(0, 5)
}

/** Rule-based Senior QA Lead generator (frontend). Uses same schema as AI output. */
export function generateSeniorQaTicket(
  values: ValidatedBugReportFormValues,
  qualityReport: InputQualityReport,
): GeneratedTicket {
  const envList = formatEnvironmentList(values.environments)
  const { severity, priority } = deriveTicketMetadata(
    values.category,
    values.environments,
  )
  const titleSuggestions = buildTitleSuggestions(values)
  const confidenceScore = calculateConfidenceScore(values, qualityReport)
  const feature = values.affectedFeaturePage.trim()

  return {
    title: titleSuggestions[0],
    titleSuggestions,
    issueSummary: buildIssueSummary(values, envList),
    stepsToReproduce: buildStepsToReproduce(values, envList),
    expectedResult: buildExpectedResult(values.category, values),
    actualResult: buildActualResult(values, envList),
    severity,
    priority,
    severityReasoning: buildSeverityReasoning(values),
    possibleRootCauses: buildRootCauses(values),
    confidenceScore,
    category: values.category,
    environments: [...values.environments],
    affectedFeaturePage: feature || undefined,
  }
}
