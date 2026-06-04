import { useCallback, useMemo, useState } from 'react'
import type { Environment } from '../types/bugReport'
import { useAppSettings } from './useAppSettings'
import { getSilenceTimeoutMs } from '../utils/appSettingsStorage'
import { cleanVoiceTranscript } from '../utils/cleanVoiceTranscript'
import { resolveEnvironmentsFromVoice } from '../utils/inferBugDetails'
import { getSpeechRecognitionConstructor } from '../utils/voiceTranscript'
import { MIN_ISSUE_DESCRIPTION_LENGTH } from '../utils/validateForm'
import { useVoiceSession } from './useVoiceSession'

interface UseIssueDescriptionVoiceOptions {
  onApplyTranscript: (text: string) => void
  onApplyEnvironments: (environments: Environment[]) => void
  onAutoGenerate?: (payload: {
    text: string
    environments: Environment[]
  }) => void
}

export function useIssueDescriptionVoice({
  onApplyTranscript,
  onApplyEnvironments,
  onAutoGenerate,
}: UseIssueDescriptionVoiceOptions) {
  const { settings } = useAppSettings()
  const speechSupported = useMemo(
    () => getSpeechRecognitionConstructor() !== null,
    [],
  )

  const [flowError, setFlowError] = useState<string | null>(null)

  const handleSessionComplete = useCallback(
    (rawTranscript: string) => {
      const cleaned = cleanVoiceTranscript(rawTranscript)
      if (cleaned.length < MIN_ISSUE_DESCRIPTION_LENGTH) {
        setFlowError(
          `Speak at least ${MIN_ISSUE_DESCRIPTION_LENGTH} characters worth of detail, then try again.`,
        )
        return
      }

      setFlowError(null)
      const environments = resolveEnvironmentsFromVoice(rawTranscript)
      onApplyTranscript(cleaned)
      onApplyEnvironments(environments)
      if (settings.ai.autoGenerateAfterVoice) {
        onAutoGenerate?.({ text: cleaned, environments })
      }
    },
    [
      onApplyEnvironments,
      onApplyTranscript,
      onAutoGenerate,
      settings.ai.autoGenerateAfterVoice,
    ],
  )

  const session = useVoiceSession({
    onSessionComplete: handleSessionComplete,
    silenceTimeoutMs: getSilenceTimeoutMs(settings),
    language: settings.voice.language,
  })

  const toggleVoice = useCallback(() => {
    if (session.isListening) {
      session.stopSpeaking()
    } else if (session.status === 'idle') {
      setFlowError(null)
      session.startSpeaking()
    }
  }, [session])

  const displayError = flowError ?? session.error

  return {
    speechSupported,
    isListening: session.isListening,
    isFinalizing: session.isFinalizing,
    liveTranscript: session.transcript,
    error: displayError,
    toggleVoice,
  }
}
