import type { BugReportFormValues } from '../../types/bugReport'
import type { InputQualityIssue, InputQualityReport } from '../../types/inputQuality'

const REPRODUCTION_KEYWORDS =
  /\b(click|tap|navigate|open|submit|refresh|scroll|login|logout|browser|device|ios|android|safari|chrome|firefox|steps?|repro|reproduce|when|after|before|expected|actual|broken|error|fail)\b/i

function hasReproductionDetail(description: string): boolean {
  const trimmed = description.trim()
  if (trimmed.length < 40) return false
  return REPRODUCTION_KEYWORDS.test(trimmed) || trimmed.length >= 120
}

export function analyzeInputQuality(
  values: BugReportFormValues,
): InputQualityReport {
  const issues: InputQualityIssue[] = []
  const description = values.issueDescription.trim()

  if (values.environments.length === 0) {
    issues.push({
      type: 'missing_environment',
      message: 'No environment selected',
      suggestion:
        'Mention Production/Beta/Canary in your description or select one — it helps severity and priority.',
    })
  }

  if (!hasReproductionDetail(description)) {
    issues.push({
      type: 'missing_reproduction',
      message: 'Add a bit more reproduction detail',
      suggestion:
        'Include what you clicked, device/browser, and expected vs actual behavior for higher confidence.',
    })
  }

  const completenessScore = calculateCompletenessScore(values, issues.length)

  return {
    issues,
    completenessScore,
    isReadyForHighQualityGeneration:
      issues.length <= 1 && description.length >= 40,
  }
}

function calculateCompletenessScore(
  values: BugReportFormValues,
  issueCount: number,
): number {
  const description = values.issueDescription.trim()
  let score = 0

  if (description.length >= 15) score += 30
  if (description.length >= 60) score += 20
  if (description.length >= 120) score += 15
  if (values.environments.length > 0) score += 20
  if (hasReproductionDetail(description)) score += 15
  score -= issueCount * 8

  return Math.max(0, Math.min(100, score))
}
