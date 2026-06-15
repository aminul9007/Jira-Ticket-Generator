import { useCallback, useState } from 'react'
import type { BugReportFormValues, Environment } from '../types/bugReport'
import type { ExtractedContext } from '../types/contextDetection'
import { resolveEnvironmentsFromVoice } from '../utils/inferBugDetails'
import { mapDetectedEnvironmentToLegacy } from '../utils/contextDetection/mapDetectedEnvironment'
import {
  extractContext,
  mergeExtractedContext,
} from '../utils/contextDetection/extractContext'
import { normalizeContextTermsInText } from '../utils/contextDetection/fuzzyContextMatch'
import { isBugReportFormComplete } from '../utils/validateForm'

/** Synchronous voice payload — safe to pass to generate before React state flushes. */
export function buildVoiceFormValues(
  issueDescription: string,
  options?: { finalizeTrailingWord?: boolean },
): BugReportFormValues {
  const normalized = normalizeContextTermsInText(issueDescription, options)
  return {
    issueDescription: normalized,
    environments: resolveEnvironmentsFromVoice(normalized),
    qaContext: extractContext(normalized),
  }
}

export function useBugReportForm() {
  const [values, setValues] = useState<BugReportFormValues>(() => ({
    issueDescription: '',
    environments: [],
    qaContext: extractContext(''),
  }))

  const syncContextFromTranscript = useCallback((transcript: string) => {
    const trimmed = transcript.trim()
    if (!trimmed) return

    setValues((prev) => {
      const normalized = normalizeContextTermsInText(trimmed, { finalizeTrailingWord: false })
      const extracted = extractContext(normalized)
      const qaContext = mergeExtractedContext(prev.qaContext, extracted)
      return {
        ...prev,
        issueDescription: normalized,
        qaContext,
        environments: resolveEnvironmentsFromVoice(normalized),
      }
    })
  }, [])

  const setIssueDescription = useCallback((issueDescription: string) => {
    setValues((prev) => {
      const normalized = normalizeContextTermsInText(issueDescription, {
        finalizeTrailingWord: false,
      })
      const extracted = extractContext(normalized)
      const qaContext = mergeExtractedContext(prev.qaContext, extracted)
      return {
        ...prev,
        issueDescription: normalized,
        qaContext,
        environments: resolveEnvironmentsFromVoice(normalized),
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
    return next
  }, [])

  const reset = useCallback(() => {
    setValues({
      issueDescription: '',
      environments: [],
      qaContext: extractContext(''),
    })
  }, [])

  const isValid = isBugReportFormComplete(values)

  return {
    values,
    isValid,
    setIssueDescription,
    setEnvironments,
    toggleEnvironment,
    setContextField,
    clearContextField,
    applyVoiceResult,
    buildVoiceFormValues,
    syncContextFromTranscript,
    reset,
  }
}
