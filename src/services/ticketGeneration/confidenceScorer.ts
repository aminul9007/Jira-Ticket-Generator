import type { ValidatedBugReportFormValues } from '../../types/bugReport'
import type { InputQualityReport } from '../../types/inputQuality'

const REPRODUCTION_KEYWORDS =
  /\b(click|tap|navigate|open|submit|refresh|scroll|login|browser|device|steps?|repro|when|after)\b/i

export function calculateConfidenceScore(
  values: ValidatedBugReportFormValues,
  qualityReport: InputQualityReport,
): number {
  let score = 45

  score += values.environments.length * 8
  if (values.affectedFeaturePage.trim()) score += 12
  if (values.title.trim().length >= 25) score += 10
  if (values.title.trim().length >= 50) score += 5
  if (REPRODUCTION_KEYWORDS.test(`${values.title} ${values.additionalNotes}`)) {
    score += 10
  }
  if (values.additionalNotes.trim().length >= 60) score += 8

  score += Math.round(qualityReport.completenessScore * 0.15)
  score -= qualityReport.issues.length * 6

  return Math.max(35, Math.min(98, Math.round(score)))
}
