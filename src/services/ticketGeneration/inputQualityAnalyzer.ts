import type { BugReportFormValues } from '../../types/bugReport'
import type { InputQualityIssue, InputQualityReport } from '../../types/inputQuality'

const REPRODUCTION_KEYWORDS =
  /\b(click|tap|navigate|open|submit|refresh|scroll|login|logout|browser|device|ios|android|safari|chrome|firefox|steps?|repro|reproduce|when|after|before)\b/i

function hasReproductionDetail(values: BugReportFormValues): boolean {
  const combined = `${values.title} ${values.additionalNotes}`.trim()
  if (combined.length < 40) return false
  return REPRODUCTION_KEYWORDS.test(combined) || values.additionalNotes.trim().length >= 80
}

export function analyzeInputQuality(
  values: BugReportFormValues,
): InputQualityReport {
  const issues: InputQualityIssue[] = []

  if (values.environments.length === 0) {
    issues.push({
      type: 'missing_environment',
      message: 'No environment selected',
      suggestion:
        'Select at least one environment (Canary, Beta, or Production) so engineers know where to reproduce.',
    })
  }

  if (!values.affectedFeaturePage.trim()) {
    issues.push({
      type: 'missing_feature',
      message: 'Affected feature or page not specified',
      suggestion:
        'Add the feature, screen, or URL (e.g. "Checkout", "/cart", "Login modal") for clearer titles and routing.',
    })
  }

  if (!hasReproductionDetail(values)) {
    issues.push({
      type: 'missing_reproduction',
      message: 'Limited reproduction details',
      suggestion:
        'Include how to trigger the bug: user actions, device/browser, and what you observed vs. expected.',
    })
  }

  const completenessScore = calculateCompletenessScore(values, issues.length)

  return {
    issues,
    completenessScore,
    isReadyForHighQualityGeneration:
      issues.length === 0 && values.title.trim().length >= 15,
  }
}

function calculateCompletenessScore(
  values: BugReportFormValues,
  issueCount: number,
): number {
  let score = 0
  if (values.category) score += 15
  if (values.environments.length > 0) score += 25
  if (values.title.trim().length >= 15) score += 20
  if (values.affectedFeaturePage.trim()) score += 20
  if (hasReproductionDetail(values)) score += 20
  score -= issueCount * 8
  return Math.max(0, Math.min(100, score))
}
