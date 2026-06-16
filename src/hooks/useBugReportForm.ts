import { useCallback, useState } from 'react'
import type { BugReportFormValues, Environment } from '../types/bugReport'
import type { ExtractedContext } from '../types/contextDetection'
import type { DetectedEnvironment } from '../types/contextDetection'
import { inferEnvironmentsFromText } from '../utils/inferBugDetails'
import { mapDetectedEnvironmentToLegacy } from '../utils/contextDetection/mapDetectedEnvironment'
import {
  mergeExtractedContext,
} from '../utils/contextDetection/extractContext'
import { createUnknownContext } from '../utils/contextDetection/extractContextFromText'
import { applyTypingContextUpdate } from '../utils/contextDetection/applyTypingContextUpdate'
import {
  getMissingContextFields,
  type MissingContextField,
} from '../utils/contextDetection/getMissingContextFields'
import { normalizeContextTermsInText } from '../utils/contextDetection/fuzzyContextMatch'
import { resolveSmartContext } from '../utils/contextDetection/resolveSmartContext'
import { isBugReportFormComplete } from '../utils/validateForm'
import type { ContextCompletionSelections } from '../components/forms/ContextCompletionModal'

/** Synchronous voice payload — safe to pass to generate before React state flushes. */
export function buildVoiceFormValues(
  issueDescription: string,
  options?: { finalizeTrailingWord?: boolean },
): BugReportFormValues {
  const normalized = normalizeContextTermsInText(issueDescription, options)
  const qaContext = resolveSmartContext(normalized, { fuzzy: true, fillSession: true })
  const envDetected = qaContext.environment.value !== 'unknown'
  return {
    issueDescription: normalized,
    environments: envDetected
      ? mapDetectedEnvironmentToLegacy(qaContext.environment.value)
      : [],
    qaContext,
  }
}

function resolveEnvironments(
  issueDescription: string,
  qaContext: ExtractedContext,
  previous: Environment[],
): Environment[] {
  const inferred = inferEnvironmentsFromText(issueDescription)
  if (inferred.length > 0) return inferred
  if (qaContext.environment.value !== 'unknown') {
    return mapDetectedEnvironmentToLegacy(qaContext.environment.value)
  }
  return previous
}

function finalizeFormValues(prev: BugReportFormValues): BugReportFormValues {
  const resolved = resolveSmartContext(prev.issueDescription, {
    fuzzy: false,
    fillSession: true,
    defaultEnvironments: prev.environments,
  })
  const qaContext = mergeExtractedContext(prev.qaContext, resolved)
  return {
    ...prev,
    qaContext,
    environments: resolveEnvironments(prev.issueDescription, qaContext, prev.environments),
  }
}

export function useBugReportForm() {
  const [values, setValues] = useState<BugReportFormValues>(() => ({
    issueDescription: '',
    environments: [],
    qaContext: createUnknownContext(),
  }))
  const [missingContextFields, setMissingContextFields] = useState<MissingContextField[]>([])
  const [pendingGenerateAfterContext, setPendingGenerateAfterContext] = useState(false)

  const syncContextFromTranscript = useCallback((transcript: string) => {
    const trimmed = transcript.trim()
    if (!trimmed) return

    setValues((prev) => applyTypingContextUpdate(prev, trimmed))
  }, [])

  const setIssueDescription = useCallback((issueDescription: string) => {
    setValues((prev) => applyTypingContextUpdate(prev, issueDescription))
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
    setPendingGenerateAfterContext(false)
    return next
  }, [])

  const applyContextCompletion = useCallback((selections: ContextCompletionSelections) => {
    setValues((prev) => {
      const qaContext = { ...prev.qaContext }
      let environments = prev.environments

      if (selections.environment) {
        qaContext.environment = {
          value: selections.environment as DetectedEnvironment,
          source: 'user',
        }
        environments = mapDetectedEnvironmentToLegacy(qaContext.environment.value)
      }
      if (selections.browser) {
        qaContext.browser = {
          value: selections.browser as ExtractedContext['browser']['value'],
          source: 'user',
        }
      }
      if (selections.os) {
        qaContext.os = {
          value: selections.os as ExtractedContext['os']['value'],
          source: 'user',
        }
      }
      if (selections.device) {
        qaContext.device = {
          value: selections.device as ExtractedContext['device']['value'],
          source: 'user',
        }
      }

      return { ...prev, qaContext, environments }
    })
    setMissingContextFields([])
  }, [])

  const prepareForGenerate = useCallback((): {
    ready: boolean
    values: BugReportFormValues
  } => {
    const nextValues = finalizeFormValues(values)
    setValues(nextValues)
    const missing = getMissingContextFields(nextValues.qaContext, nextValues.environments)
    setMissingContextFields(missing)
    const ready = missing.length === 0
    setPendingGenerateAfterContext(!ready)
    return { ready, values: nextValues }
  }, [values])

  const completeContextCompletion = useCallback(
    (selections: ContextCompletionSelections): BugReportFormValues => {
      const base = finalizeFormValues(values)
      const qaContext = { ...base.qaContext }
      let environments = base.environments

      if (selections.environment) {
        qaContext.environment = {
          value: selections.environment as DetectedEnvironment,
          source: 'user',
        }
        environments = mapDetectedEnvironmentToLegacy(qaContext.environment.value)
      }
      if (selections.browser) {
        qaContext.browser = {
          value: selections.browser as ExtractedContext['browser']['value'],
          source: 'user',
        }
      }
      if (selections.os) {
        qaContext.os = {
          value: selections.os as ExtractedContext['os']['value'],
          source: 'user',
        }
      }
      if (selections.device) {
        qaContext.device = {
          value: selections.device as ExtractedContext['device']['value'],
          source: 'user',
        }
      }

      const nextValues = { ...base, qaContext, environments }
      setValues(nextValues)
      setMissingContextFields([])
      setPendingGenerateAfterContext(false)
      return nextValues
    },
    [values],
  )

  const dismissMissingContextPrompt = useCallback(() => {
    setMissingContextFields([])
    setPendingGenerateAfterContext(false)
  }, [])

  const reset = useCallback(() => {
    setValues({
      issueDescription: '',
      environments: [],
      qaContext: createUnknownContext(),
    })
    setMissingContextFields([])
    setPendingGenerateAfterContext(false)
  }, [])

  const isValid = isBugReportFormComplete(values)

  return {
    values,
    isValid,
    missingContextFields,
    pendingGenerateAfterContext,
    setIssueDescription,
    setEnvironments,
    toggleEnvironment,
    setContextField,
    clearContextField,
    applyVoiceResult,
    applyContextCompletion,
    prepareForGenerate,
    completeContextCompletion,
    dismissMissingContextPrompt,
    buildVoiceFormValues,
    syncContextFromTranscript,
    reset,
  }
}
