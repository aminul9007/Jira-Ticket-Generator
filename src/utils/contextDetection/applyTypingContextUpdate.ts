import type { BugReportFormValues, Environment } from '../../types/bugReport'
import type { ExtractedContext } from '../../types/contextDetection'
import { inferEnvironmentsFromText } from '../inferBugDetails'
import { mapDetectedEnvironmentToLegacy } from './mapDetectedEnvironment'
import { mergeExtractedContext } from './extractContext'
import { extractContextFromText } from './extractContextFromText'

/**
 * Sync environment chips while typing.
 * Auto-infers from text when keywords appear; drops text-inferred chips when keywords are removed.
 * Manual chip selections are preserved unless they were only inferred from earlier text.
 */
export function resolveEnvironmentsForTyping(
  issueDescription: string,
  previousDescription: string,
  qaContext: ExtractedContext,
  previousEnvironments: Environment[],
): Environment[] {
  const inferred = inferEnvironmentsFromText(issueDescription)
  if (inferred.length > 0) {
    return inferred
  }

  if (qaContext.environment.value !== 'unknown') {
    return mapDetectedEnvironmentToLegacy(qaContext.environment.value)
  }

  const previouslyInferred = inferEnvironmentsFromText(previousDescription)
  if (previouslyInferred.length > 0) {
    return previousEnvironments.filter((env) => !previouslyInferred.includes(env))
  }

  return previousEnvironments
}

/** Apply strict text-only context detection for live typing (no fuzzy, no session). */
export function applyTypingContextUpdate(
  prev: BugReportFormValues,
  issueDescription: string,
): BugReportFormValues {
  const extracted = extractContextFromText(issueDescription)
  const qaContext = mergeExtractedContext(prev.qaContext, extracted)
  const environments = resolveEnvironmentsForTyping(
    issueDescription,
    prev.issueDescription,
    qaContext,
    prev.environments,
  )

  return {
    ...prev,
    issueDescription,
    qaContext,
    environments,
  }
}
