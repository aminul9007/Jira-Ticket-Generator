import { describe, expect, it } from 'vitest'
import { inferEnvironmentsFromText, resolveEnvironmentsFromVoice } from './inferBugDetails'
import { normalizeEnvironmentPhrases } from './normalizeEnvironmentText'
import { cleanTitleText, trimTitleAtWord } from './titleText'

describe('normalizeEnvironmentPhrases', () => {
  it('maps production stage to production only', () => {
    expect(normalizeEnvironmentPhrases('production stage has an issue')).toBe(
      'production has an issue',
    )
  })
})

describe('production stage environment inference', () => {
  it('selects only Production when user says production stage', () => {
    expect(inferEnvironmentsFromText('production stage has issue')).toEqual(['Production'])
    expect(resolveEnvironmentsFromVoice('production stage has issue')).toEqual(['Production'])
  })

  it('still detects staging as Beta', () => {
    expect(inferEnvironmentsFromText('found in staging environment')).toEqual(['Beta'])
  })
})

describe('titleText', () => {
  it('removes trailing ellipsis', () => {
    expect(cleanTitleText('Checkout button fails on submit...')).toBe(
      'Checkout button fails on submit',
    )
  })

  it('trims at word boundary without ellipsis suffix', () => {
    const long =
      'The checkout payment button becomes unresponsive after entering card details on the billing page'
    const trimmed = trimTitleAtWord(long, 60)
    expect(trimmed.length).toBeLessThanOrEqual(60)
    expect(trimmed.endsWith('…')).toBe(false)
    expect(trimmed.endsWith('...')).toBe(false)
  })
})
