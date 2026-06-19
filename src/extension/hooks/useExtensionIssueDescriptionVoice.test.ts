import { describe, expect, it } from 'vitest'
import { cleanVoiceTranscript } from '../../utils/cleanVoiceTranscript'

function mergeBaseWithSpoken(base: string, spoken: string): string {
  const trimmedBase = base.trim()
  const trimmedSpoken = spoken.trim()
  if (trimmedBase && trimmedSpoken) {
    return `${trimmedBase} ${trimmedSpoken}`.trim()
  }
  return trimmedSpoken || trimmedBase
}

describe('extension voice transcript merge', () => {
  it('appends spoken text to existing description', () => {
    const merged = mergeBaseWithSpoken(
      'Already typed context.',
      cleanVoiceTranscript('login button does nothing'),
    )

    expect(merged).toBe('Already typed context. Login button does nothing')
  })

  it('uses spoken text when description was empty', () => {
    const merged = mergeBaseWithSpoken('', cleanVoiceTranscript('dashboard fails to load'))

    expect(merged).toBe('Dashboard fails to load')
  })
})
