export type VoiceInputMode = 'replace' | 'append'

export function applyVoiceTranscript(
  baseAtStart: string,
  finalTranscript: string,
  interimTranscript: string,
  mode: VoiceInputMode,
  maxLength = 2000,
): string {
  const final = finalTranscript.trim()
  const interim = interimTranscript.trim()
  const spoken = [final, interim].filter(Boolean).join(' ').trim()

  let merged: string
  if (mode === 'replace') {
    merged = spoken || baseAtStart
  } else if (!spoken) {
    merged = baseAtStart
  } else {
    const base = baseAtStart.trimEnd()
    merged = base ? `${base} ${spoken}` : spoken
  }

  return merged.slice(0, maxLength)
}

export function parseRecognitionResults(
  results: SpeechRecognitionResultList,
): { finalTranscript: string; interimTranscript: string } {
  let finalTranscript = ''
  let interimTranscript = ''

  for (let i = 0; i < results.length; i++) {
    const result = results[i]
    const text = result[0]?.transcript ?? ''
    if (result.isFinal) {
      finalTranscript += text
    } else {
      interimTranscript += text
    }
  }

  return { finalTranscript, interimTranscript }
}

export function getSpeechRecognitionConstructor():
  | (new () => SpeechRecognition)
  | null {
  if (typeof window === 'undefined') return null
  const win = window as Window
  return win.SpeechRecognition ?? win.webkitSpeechRecognition ?? null
}

export function mapSpeechError(error: string): string {
  switch (error) {
    case 'not-allowed':
    case 'service-not-allowed':
      return 'Microphone access was denied. Allow microphone permission in your browser settings and try again.'
    case 'no-speech':
      return 'No speech was detected. Try speaking closer to the microphone.'
    case 'audio-capture':
      return 'No microphone was found. Connect a microphone and try again.'
    case 'network':
      return 'Speech recognition needs a network connection in this browser.'
    case 'aborted':
      return 'Voice input was cancelled.'
    default:
      return 'Voice input failed. Please try again or type your description.'
  }
}
