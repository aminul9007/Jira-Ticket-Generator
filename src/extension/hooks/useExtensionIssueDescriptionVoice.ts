import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { DEFAULT_APP_SETTINGS } from '../../data/defaultAppSettings'
import { useVoiceSession } from '../../hooks/useVoiceSession'
import type { VoiceSettings } from '../../types/appSettings'
import { cleanVoiceTranscript } from '../../utils/cleanVoiceTranscript'
import { MIN_ISSUE_DESCRIPTION_LENGTH } from '../../utils/validateForm'
import { getSpeechRecognitionConstructor } from '../../utils/voiceTranscript'
import { loadExtensionAppSettings } from '../services/extensionSettingsService'
import type { ExtensionVoiceStatus } from '../types/extensionState'

const UNSUPPORTED_BROWSER_MESSAGE = 'Voice input is not supported in this browser.'
const COMPLETED_FLASH_MS = 2000
const MAX_DESCRIPTION_LENGTH = 2000

interface UseExtensionIssueDescriptionVoiceOptions {
  description: string
  onDescriptionChange: (value: string) => void
  onVoiceStatusChange?: (status: ExtensionVoiceStatus, transcript?: string) => void
}

function mergeBaseWithSpoken(base: string, spoken: string): string {
  const trimmedBase = base.trim()
  const trimmedSpoken = spoken.trim()
  if (trimmedBase && trimmedSpoken) {
    return `${trimmedBase} ${trimmedSpoken}`.trim()
  }
  return trimmedSpoken || trimmedBase
}

export function useExtensionIssueDescriptionVoice({
  description,
  onDescriptionChange,
  onVoiceStatusChange,
}: UseExtensionIssueDescriptionVoiceOptions) {
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>(
    DEFAULT_APP_SETTINGS.voice,
  )
  const [flowError, setFlowError] = useState<string | null>(null)
  const [completedFlash, setCompletedFlash] = useState(false)
  const baseAtStartRef = useRef('')

  useEffect(() => {
    void loadExtensionAppSettings().then((settings) => {
      setVoiceSettings(settings.voice)
    })
  }, [])

  const speechSupported = useMemo(
    () => getSpeechRecognitionConstructor() !== null,
    [],
  )

  const handleSessionComplete = useCallback(
    (rawTranscript: string) => {
      const spoken = cleanVoiceTranscript(rawTranscript)
      const merged = mergeBaseWithSpoken(baseAtStartRef.current, spoken).slice(
        0,
        MAX_DESCRIPTION_LENGTH,
      )

      onDescriptionChange(merged)
      onVoiceStatusChange?.('processing', merged)

      if (merged.length < MIN_ISSUE_DESCRIPTION_LENGTH) {
        setFlowError(
          `Speak at least ${MIN_ISSUE_DESCRIPTION_LENGTH} characters worth of detail, then try again.`,
        )
        onVoiceStatusChange?.('error', merged)
        return
      }

      setFlowError(null)
      setCompletedFlash(true)
      onVoiceStatusChange?.('completed', merged)
      window.setTimeout(() => {
        setCompletedFlash(false)
        onVoiceStatusChange?.('idle', merged)
      }, COMPLETED_FLASH_MS)
    },
    [onDescriptionChange, onVoiceStatusChange],
  )

  const handleTranscriptUpdate = useCallback(
    (liveTranscript: string) => {
      const merged = mergeBaseWithSpoken(baseAtStartRef.current, liveTranscript).slice(
        0,
        MAX_DESCRIPTION_LENGTH,
      )
      onDescriptionChange(merged)
      onVoiceStatusChange?.('listening', merged)
    },
    [onDescriptionChange, onVoiceStatusChange],
  )

  const session = useVoiceSession({
    onSessionComplete: handleSessionComplete,
    onTranscriptUpdate: handleTranscriptUpdate,
    silenceTimeoutMs: voiceSettings.silenceTimeoutSeconds * 1000,
    language: voiceSettings.language,
    maxLength: MAX_DESCRIPTION_LENGTH,
  })

  useEffect(() => {
    return () => {
      session.resetSession()
    }
  }, [session.resetSession])

  const startRecording = useCallback(() => {
    if (!speechSupported) {
      setFlowError(UNSUPPORTED_BROWSER_MESSAGE)
      onVoiceStatusChange?.('error')
      return
    }

    if (session.isListening || session.isFinalizing) return

    setFlowError(null)
    baseAtStartRef.current = description
    onVoiceStatusChange?.('listening', description)
    session.startSpeaking()
  }, [description, onVoiceStatusChange, session, speechSupported])

  const stopRecording = useCallback(() => {
    onVoiceStatusChange?.('processing', description)
    session.stopSpeaking()
  }, [description, onVoiceStatusChange, session])

  const displayError =
    flowError ??
    (session.error && !speechSupported ? UNSUPPORTED_BROWSER_MESSAGE : session.error)

  const displayStatus: ExtensionVoiceStatus = useMemo(() => {
    if (displayError) return 'error'
    if (session.isFinalizing) return 'processing'
    if (session.isListening) return 'listening'
    if (completedFlash) return 'completed'
    return 'idle'
  }, [completedFlash, displayError, session.isFinalizing, session.isListening])

  return {
    speechSupported,
    displayStatus,
    isListening: session.isListening,
    isProcessing: session.isFinalizing,
    error: displayError,
    startRecording,
    stopRecording,
  }
}
