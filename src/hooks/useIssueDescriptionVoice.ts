import { useCallback, useMemo, useState } from 'react'
import type { BugReportFormValues } from '../types/bugReport'
import { useAppSettings } from './useAppSettings'
import { getSilenceTimeoutMs } from '../utils/appSettingsStorage'
import { cleanVoiceTranscript } from '../utils/cleanVoiceTranscript'
import { getSpeechRecognitionConstructor } from '../utils/voiceTranscript'
import { MIN_ISSUE_DESCRIPTION_LENGTH } from '../utils/validateForm'
import { useVoiceSession } from './useVoiceSession'

interface UseIssueDescriptionVoiceOptions {
  onVoiceComplete: (payload: Pick<BugReportFormValues, 'issueDescription'>) => void
  onTranscriptUpdate?: (transcript: string) => void
  onAutoGenerate?: (payload: Pick<BugReportFormValues, 'issueDescription'>) => void
}

export function useIssueDescriptionVoice({
  onVoiceComplete,
  onTranscriptUpdate,
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
      const payload = { issueDescription: cleaned }
      onVoiceComplete(payload)
      if (settings.ai.autoGenerateAfterVoice) {
        onAutoGenerate?.(payload)
      }
    },
    [onAutoGenerate, onVoiceComplete, settings.ai.autoGenerateAfterVoice],
  )

  const session = useVoiceSession({
    onSessionComplete: handleSessionComplete,
    onTranscriptUpdate,
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
