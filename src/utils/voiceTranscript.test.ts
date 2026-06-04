import { describe, expect, it } from 'vitest'
import { applyVoiceTranscript, parseRecognitionResults } from './voiceTranscript'

describe('voiceTranscript', () => {
  it('appends spoken text to existing description', () => {
    expect(
      applyVoiceTranscript(
        'Checkout fails',
        'on mobile Safari',
        'after submit',
        'append',
      ),
    ).toBe('Checkout fails on mobile Safari after submit')
  })

  it('replaces field content with spoken text', () => {
    expect(
      applyVoiceTranscript(
        'Old text',
        'New bug description',
        '',
        'replace',
      ),
    ).toBe('New bug description')
  })

  it('parses final and interim recognition segments', () => {
    const results = {
      length: 2,
      item: (index: number) => results[index],
      0: {
        length: 1,
        isFinal: true,
        item: () => ({ transcript: 'Hello ', confidence: 1 }),
        0: { transcript: 'Hello ', confidence: 1 },
      },
      1: {
        length: 1,
        isFinal: false,
        item: () => ({ transcript: 'world', confidence: 0.5 }),
        0: { transcript: 'world', confidence: 0.5 },
      },
    } as unknown as SpeechRecognitionResultList

    expect(parseRecognitionResults(results)).toEqual({
      finalTranscript: 'Hello ',
      interimTranscript: 'world',
    })
  })
})
