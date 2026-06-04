import { useCallback, useMemo, useState } from 'react'
import type { Environment } from '../types/bugReport'
import { cleanVoiceTranscript } from '../utils/cleanVoiceTranscript'
import { resolveEnvironmentsFromVoice } from '../utils/inferBugDetails'
import { getSpeechRecognitionConstructor } from '../utils/voiceTranscript'
import { MIN_ISSUE_DESCRIPTION_LENGTH } from '../utils/validateForm'
import { useVoiceSession } from './useVoiceSession'

interface UseIssueDescriptionVoiceOptions {
  onApplyTranscript: (text: string) => void
  onApplyEnvironments: (environments: Environment[]) => void
}

export function useIssueDescriptionVoice({
  onApplyTranscript,
  onApplyEnvironments,
}: UseIssueDescriptionVoiceOptions) {
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
      onApplyTranscript(cleaned)
      onApplyEnvironments(resolveEnvironmentsFromVoice(rawTranscript))
    },
    [onApplyEnvironments, onApplyTranscript],
  )

  const session = useVoiceSession({ onSessionComplete: handleSessionComplete })

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
