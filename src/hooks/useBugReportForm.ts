import { useCallback, useState } from 'react'
import type { BugReportFormValues, Environment } from '../types/bugReport'
import type { ExtractedContext } from '../types/contextDetection'
import { inferEnvironmentsFromText } from '../utils/inferBugDetails'
import { mapDetectedEnvironmentToLegacy } from '../utils/contextDetection/mapDetectedEnvironment'
import {
  extractContext,
  mergeExtractedContext,
} from '../utils/contextDetection/extractContext'
import { extractContextFromVoice } from '../utils/contextDetection/extractContextFromVoice'
import {
  getMissingContextFields,
  type MissingContextField,
} from '../utils/contextDetection/getMissingContextFields'
import { normalizeContextTermsInText } from '../utils/contextDetection/fuzzyContextMatch'
import { matchContextFieldFromUserInput } from '../utils/contextDetection/matchContextFieldInput'
import { isBugReportFormComplete } from '../utils/validateForm'

/** Synchronous voice payload — safe to pass to generate before React state flushes. */
export function buildVoiceFormValues(
  issueDescription: string,
  options?: { finalizeTrailingWord?: boolean },
): BugReportFormValues {
  const normalized = normalizeContextTermsInText(issueDescription, options)
  const qaContext = extractContextFromVoice(normalized)
  const envDetected = qaContext.environment.value !== 'unknown'
  return {
    issueDescription: normalized,
    environments: envDetected
      ? mapDetectedEnvironmentToLegacy(qaContext.environment.value)
      : [],
    qaContext,
  }
}

export function useBugReportForm() {
  const [values, setValues] = useState<BugReportFormValues>(() => ({
    issueDescription: '',
    environments: [],
    qaContext: extractContext(''),
  }))
  const [missingContextFields, setMissingContextFields] = useState<MissingContextField[]>([])

  const syncContextFromTranscript = useCallback((transcript: string) => {
    const trimmed = transcript.trim()
    if (!trimmed) return

    setValues((prev) => {
      const extracted = extractContextFromVoice(trimmed)
      const qaContext = mergeExtractedContext(prev.qaContext, extracted)
      const inferred = inferEnvironmentsFromText(trimmed)
      return {
        ...prev,
        issueDescription: trimmed,
        qaContext,
        environments: inferred.length > 0 ? inferred : prev.environments,
      }
    })
  }, [])

  const setIssueDescription = useCallback((issueDescription: string) => {
    setValues((prev) => {
      const extracted = extractContextFromVoice(issueDescription)
      const qaContext = mergeExtractedContext(prev.qaContext, extracted)
      const inferred = inferEnvironmentsFromText(issueDescription)
      return {
        ...prev,
        issueDescription,
        qaContext,
        environments: inferred.length > 0 ? inferred : prev.environments,
      }
    })
  }, [])

  const toggleEnvironment = useCallback((env: Environment) => {
    setValues((prev) => {
      const exists = prev.environments.includes(env)
      return {
        ...prev,
        environments: exists
          ? prev.environments.filter((e) => e !== env)
          : [...prev.environments, env],
      }
    })
  }, [])

  const setEnvironments = useCallback((environments: Environment[]) => {
    setValues((prev) => ({ ...prev, environments }))
  }, [])

  const setContextField = useCallback(
    <K extends keyof ExtractedContext>(
      field: K,
      value: ExtractedContext[K]['value'],
    ) => {
      setValues((prev) => {
        const qaContext: ExtractedContext = {
          ...prev.qaContext,
          [field]: { value, source: 'user' as const },
        }
        return {
          ...prev,
          qaContext,
          environments:
            field === 'environment'
              ? mapDetectedEnvironmentToLegacy(value as ExtractedContext['environment']['value'])
              : prev.environments,
        }
      })
    },
    [],
  )

  const clearContextField = useCallback((field: keyof ExtractedContext) => {
    setValues((prev) => {
      const unknownValue =
        field === 'environment'
          ? ({ value: 'unknown' as const, source: 'unknown' as const })
          : ({ value: 'Unknown' as const, source: 'unknown' as const })

      return {
        ...prev,
        qaContext: {
          ...prev.qaContext,
          [field]: unknownValue,
        },
        environments: field === 'environment' ? [] : prev.environments,
      }
    })
  }, [])

  const applyVoiceResult = useCallback((issueDescription: string) => {
    const next = buildVoiceFormValues(issueDescription, { finalizeTrailingWord: true })
    setValues(next)
    setMissingContextFields(getMissingContextFields(next.qaContext, next.environments))
    return next
  }, [])

  const applyMissingContextAnswer = useCallback((field: MissingContextField, input: string) => {
    const matched = matchContextFieldFromUserInput(field, input)
    if (!matched) return null

    setValues((prev) => {
      const qaContext = { ...prev.qaContext }

      if (matched.environment) {
        qaContext.environment = { value: matched.environment, source: 'user' }
      }
      if (matched.browser) {
        qaContext.browser = { value: matched.browser, source: 'user' }
      }
      if (matched.os) {
        qaContext.os = { value: matched.os, source: 'user' }
      }
      if (matched.device) {
        qaContext.device = { value: matched.device, source: 'user' }
      }

      return {
        ...prev,
        qaContext,
        environments: matched.environments ?? prev.environments,
      }
    })

    setMissingContextFields((prev) => {
      const remaining = prev.filter((f) => f !== field)
      return remaining
    })

    return matched
  }, [])

  const dismissMissingContextPrompt = useCallback(() => {
    setMissingContextFields([])
  }, [])

  const reset = useCallback(() => {
    setValues({
      issueDescription: '',
      environments: [],
      qaContext: extractContext(''),
    })
    setMissingContextFields([])
  }, [])

  const isValid = isBugReportFormComplete(values)

  return {
    values,
    isValid,
    missingContextFields,
    setIssueDescription,
    setEnvironments,
    toggleEnvironment,
    setContextField,
    clearContextField,
    applyVoiceResult,
    applyMissingContextAnswer,
    dismissMissingContextPrompt,
    buildVoiceFormValues,
    syncContextFromTranscript,
    reset,
  }
}
