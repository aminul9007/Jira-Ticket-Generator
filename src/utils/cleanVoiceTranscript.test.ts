import { describe, expect, it } from 'vitest'
import { cleanVoiceTranscript } from './cleanVoiceTranscript'

describe('cleanVoiceTranscript', () => {
  it('collapses whitespace and capitalizes', () => {
    expect(cleanVoiceTranscript('  checkout   fails  on mobile  ')).toBe(
      'Checkout fails on mobile',
    )
  })

  it('trims to max length', () => {
    expect(cleanVoiceTranscript('a'.repeat(3000), 100).length).toBe(100)
  })
})
