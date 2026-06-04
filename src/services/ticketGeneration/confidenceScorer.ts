import type { ResolvedBugInput } from '../../types/bugReport'
import type { InputQualityReport } from '../../types/inputQuality'

const REPRODUCTION_KEYWORDS =
  /\b(click|tap|navigate|open|submit|refresh|scroll|login|browser|device|steps?|repro|when|after|expected|actual)\b/i

export function calculateConfidenceScore(
  values: ResolvedBugInput,
  qualityReport: InputQualityReport,
): number {
  let score = 40
  const description = values.issueDescription.trim()

  score += values.environments.length * 8
  if (values.affectedFeaturePage.trim()) score += 12
  if (description.length >= 40) score += 10
  if (description.length >= 100) score += 8
  if (REPRODUCTION_KEYWORDS.test(description)) score += 10

  score += Math.round(qualityReport.completenessScore * 0.15)
  score -= qualityReport.issues.length * 6

  return Math.max(35, Math.min(98, Math.round(score)))
}
