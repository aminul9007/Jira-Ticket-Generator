import { describe, expect, it } from 'vitest'
import { extractContextFromVoice } from './extractContextFromVoice'
import { getMissingContextFields } from './getMissingContextFields'
import { matchContextFieldFromUserInput } from './matchContextFieldInput'
import { createUnknownContext } from './extractContext'

describe('extractContextFromVoice', () => {
  it('does not fall back to session defaults', () => {
    const context = extractContextFromVoice('checkout button is broken')
    expect(context.browser.value).toBe('Unknown')
    expect(context.os.value).toBe('Unknown')
    expect(context.device.value).toBe('Unknown')
    expect(context.environment.value).toBe('unknown')
  })
})

describe('getMissingContextFields', () => {
  it('lists all unknown fields after voice with no context', () => {
    const qaContext = createUnknownContext()
    expect(getMissingContextFields(qaContext, [])).toEqual([
      'environment',
      'browser',
      'os',
      'device',
    ])
  })

  it('omits fields that were detected', () => {
    const qaContext = extractContextFromVoice('Safari on production desktop')
    expect(getMissingContextFields(qaContext, ['Production'])).toEqual(['os'])
  })
})

describe('matchContextFieldFromUserInput', () => {
  it('fuzzy-matches browser typos', () => {
    expect(matchContextFieldFromUserInput('browser', 'suffer')?.browser).toBe('Safari')
  })

  it('fuzzy-matches environment terms', () => {
    expect(matchContextFieldFromUserInput('environment', 'prod')?.environment).toBe('production')
  })

  it('fuzzy-matches device terms', () => {
    expect(matchContextFieldFromUserInput('device', 'moble')?.device).toBe('Mobile')
  })

  it('returns null for unrelated input', () => {
    expect(matchContextFieldFromUserInput('browser', 'checkout')).toBeNull()
  })
})
