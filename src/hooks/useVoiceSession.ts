import { useCallback, useEffect, useRef, useState } from 'react'
import {
  getSpeechRecognitionConstructor,
  mapSpeechError,
  parseRecognitionResults,
} from '../utils/voiceTranscript'

const SILENCE_TIMEOUT_MS = 4000
const SILENCE_CHECK_INTERVAL_MS = 400

export type VoiceSessionStatus = 'idle' | 'listening' | 'finalizing'

interface UseVoiceSessionOptions {
  maxLength?: number
  silenceTimeoutMs?: number
  onSessionComplete?: (transcript: string) => void
}

function buildLiveTranscript(final: string, interim: string): string {
  return [final, interim].filter(Boolean).join(' ').trim()
}

export function useVoiceSession({
  maxLength = 2000,
  silenceTimeoutMs = SILENCE_TIMEOUT_MS,
  onSessionComplete,
}: UseVoiceSessionOptions = {}) {
  const [status, setStatus] = useState<VoiceSessionStatus>('idle')
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const finalTranscriptRef = useRef('')
  const intentionalStopRef = useRef(false)
  const keepListeningRef = useRef(false)
  const lastSpeechAtRef = useRef(0)
  const onCompleteRef = useRef(onSessionComplete)

  const isSupported = getSpeechRecognitionConstructor() !== null

  useEffect(() => {
    onCompleteRef.current = onSessionComplete
  }, [onSessionComplete])

  const finalizeSession = useCallback(() => {
    const text = buildLiveTranscript(finalTranscriptRef.current, '').slice(
      0,
      maxLength,
    )
    setTranscript(text)
    setStatus('idle')
    keepListeningRef.current = false
    recognitionRef.current = null
    onCompleteRef.current?.(text)
  }, [maxLength])

  const cleanupRecognition = useCallback(() => {
    recognitionRef.current = null
    keepListeningRef.current = false
  }, [])

  const attachRecognitionHandlers = useCallback(
    (recognition: SpeechRecognition) => {
      recognition.onresult = (event) => {
        lastSpeechAtRef.current = Date.now()
        const { finalTranscript, interimTranscript } = parseRecognitionResults(
          event.results,
        )
        finalTranscriptRef.current = finalTranscript
        setTranscript(
          buildLiveTranscript(finalTranscript, interimTranscript).slice(
            0,
            maxLength,
          ),
        )
      }

      recognition.onerror = (event) => {
        if (event.error === 'aborted') return
        setError(mapSpeechError(event.error))
        intentionalStopRef.current = true
        keepListeningRef.current = false
        setStatus('idle')
        cleanupRecognition()
      }

      recognition.onend = () => {
        if (intentionalStopRef.current) {
          setStatus('finalizing')
          finalizeSession()
          return
        }

        if (keepListeningRef.current && recognitionRef.current) {
          try {
            recognition.start()
          } catch {
            intentionalStopRef.current = true
            keepListeningRef.current = false
            setStatus('finalizing')
            finalizeSession()
          }
        }
      }
    },
    [cleanupRecognition, finalizeSession, maxLength],
  )

  const startSpeaking = useCallback(() => {
    const SpeechRecognitionCtor = getSpeechRecognitionConstructor()
    if (!SpeechRecognitionCtor) {
      setError('Voice input is not supported in this browser. Use Chrome or Edge.')
      return
    }

    setError(null)
    setTranscript('')
    finalTranscriptRef.current = ''
    intentionalStopRef.current = false
    keepListeningRef.current = true
    lastSpeechAtRef.current = Date.now()

    const recognition = new SpeechRecognitionCtor()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = navigator.language || 'en-US'
    recognition.maxAlternatives = 1

    attachRecognitionHandlers(recognition)
    recognitionRef.current = recognition

    try {
      recognition.start()
      setStatus('listening')
    } catch {
      setError('Could not start microphone. Wait a moment and try again.')
      setStatus('idle')
      cleanupRecognition()
    }
  }, [attachRecognitionHandlers, cleanupRecognition])

  const stopSpeaking = useCallback(() => {
    const recognition = recognitionRef.current
    if (!recognition || status !== 'listening') return

    intentionalStopRef.current = true
    keepListeningRef.current = false

    try {
      recognition.stop()
    } catch {
      setStatus('finalizing')
      finalizeSession()
    }
  }, [finalizeSession, status])

  const resetSession = useCallback(() => {
    intentionalStopRef.current = true
    keepListeningRef.current = false
    recognitionRef.current?.abort()
    cleanupRecognition()
    finalTranscriptRef.current = ''
    setTranscript('')
    setError(null)
    setStatus('idle')
  }, [cleanupRecognition])

  useEffect(() => {
    if (status !== 'listening') return

    const timer = window.setInterval(() => {
      if (
        keepListeningRef.current &&
        Date.now() - lastSpeechAtRef.current >= silenceTimeoutMs
      ) {
        stopSpeaking()
      }
    }, SILENCE_CHECK_INTERVAL_MS)

    return () => window.clearInterval(timer)
  }, [silenceTimeoutMs, status, stopSpeaking])

  useEffect(() => {
    return () => {
      intentionalStopRef.current = true
      keepListeningRef.current = false
      recognitionRef.current?.abort()
      cleanupRecognition()
    }
  }, [cleanupRecognition])

  return {
    isSupported,
    status,
    transcript,
    error,
    setError,
    isListening: status === 'listening',
    isFinalizing: status === 'finalizing',
    startSpeaking,
    stopSpeaking,
    resetSession,
  }
}
