import { useCallback, useEffect, useRef, useState } from 'react'
import {
  applyVoiceTranscript,
  getSpeechRecognitionConstructor,
  mapSpeechError,
  parseRecognitionResults,
  type VoiceInputMode,
} from '../utils/voiceTranscript'

export type VoiceStatus = 'idle' | 'listening' | 'processing' | 'unsupported'

interface UseSpeechRecognitionOptions {
  value: string
  onChange: (value: string) => void
  maxLength?: number
}

export function useSpeechRecognition({
  value,
  onChange,
  maxLength = 2000,
}: UseSpeechRecognitionOptions) {
  const [status, setStatus] = useState<VoiceStatus>(() =>
    getSpeechRecognitionConstructor() ? 'idle' : 'unsupported',
  )
  const [mode, setMode] = useState<VoiceInputMode>('append')
  const [error, setError] = useState<string | null>(null)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const baseAtStartRef = useRef('')
  const finalTranscriptRef = useRef('')
  const modeRef = useRef(mode)
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const pushTranscript = useCallback(
    (finalTranscript: string, interimTranscript: string) => {
      const next = applyVoiceTranscript(
        baseAtStartRef.current,
        finalTranscript,
        interimTranscript,
        modeRef.current,
        maxLength,
      )
      onChangeRef.current(next)
    },
    [maxLength],
  )

  const cleanupRecognition = useCallback(() => {
    recognitionRef.current = null
  }, [])

  const startListening = useCallback(() => {
    const SpeechRecognitionCtor = getSpeechRecognitionConstructor()
    if (!SpeechRecognitionCtor) {
      setStatus('unsupported')
      setError('Voice input is not supported in this browser. Use Chrome or Edge.')
      return
    }

    setError(null)
    baseAtStartRef.current = value
    finalTranscriptRef.current = ''

    const recognition = new SpeechRecognitionCtor()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = navigator.language || 'en-US'
    recognition.maxAlternatives = 1

    recognition.onresult = (event) => {
      const { finalTranscript, interimTranscript } = parseRecognitionResults(
        event.results,
      )
      finalTranscriptRef.current = finalTranscript
      pushTranscript(finalTranscript, interimTranscript)
    }

    recognition.onerror = (event) => {
      if (event.error === 'aborted') return
      setError(mapSpeechError(event.error))
      setStatus('idle')
      cleanupRecognition()
    }

    recognition.onend = () => {
      setStatus((current) => {
        if (current === 'listening') {
          pushTranscript(finalTranscriptRef.current, '')
          return 'idle'
        }
        return current === 'processing' ? 'idle' : current
      })
      cleanupRecognition()
    }

    recognitionRef.current = recognition

    try {
      recognition.start()
      setStatus('listening')
    } catch {
      setError('Could not start voice input. Wait a moment and try again.')
      setStatus('idle')
      cleanupRecognition()
    }
  }, [value, pushTranscript, cleanupRecognition])

  const stopListening = useCallback(() => {
    const recognition = recognitionRef.current
    if (!recognition) return

    setStatus('processing')
    try {
      recognition.stop()
    } catch {
      setStatus('idle')
      cleanupRecognition()
    }
  }, [cleanupRecognition])

  const toggleListening = useCallback(() => {
    if (status === 'listening') {
      stopListening()
    } else if (status === 'idle') {
      startListening()
    }
  }, [status, startListening, stopListening])

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort()
      cleanupRecognition()
    }
  }, [cleanupRecognition])

  return {
    status,
    mode,
    setMode,
    error,
    setError,
    isSupported: status !== 'unsupported',
    isListening: status === 'listening',
    isProcessing: status === 'processing',
    startListening,
    stopListening,
    toggleListening,
  }
}
