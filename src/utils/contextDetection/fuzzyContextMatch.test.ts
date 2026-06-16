import { describe, expect, it } from 'vitest'
import { detectBrowserFromText } from './detectBrowserFromText'
import { detectDeviceFromText } from './detectDeviceFromText'
import { detectOsFromText } from './detectOsFromText'
import {
  findFuzzyContextMatch,
  normalizeContextTermsInText,
} from './fuzzyContextMatch'
import { levenshteinDistance } from './levenshteinDistance'

describe('levenshteinDistance', () => {
  it('returns zero for identical strings', () => {
    expect(levenshteinDistance('safari', 'safari')).toBe(0)
  })

  it('measures edits between similar words', () => {
    expect(levenshteinDistance('suffer', 'safari')).toBe(4)
  })
})

describe('findFuzzyContextMatch', () => {
  it('maps suffer to Safari', () => {
    expect(findFuzzyContextMatch('suffer')).toEqual({
      category: 'browser',
      value: 'Safari',
      distance: 0,
    })
  })

  it('maps chorme to Chrome', () => {
    expect(findFuzzyContextMatch('chorme')?.value).toBe('Chrome')
  })

  it('ignores unrelated words', () => {
    expect(findFuzzyContextMatch('button')).toBeNull()
  })
})

describe('normalizeContextTermsInText', () => {
  it('corrects completed words while typing', () => {
    expect(
      normalizeContextTermsInText('Login fails on suffer in production', {
        finalizeTrailingWord: false,
      }),
    ).toBe('Login fails on Safari in production')
  })

  it('corrects the trailing word after voice completes', () => {
    expect(
      normalizeContextTermsInText('Login fails on suffer', {
        finalizeTrailingWord: true,
      }),
    ).toBe('Login fails on Safari')
  })

  it('does not rewrite partial words mid-typing', () => {
    expect(
      normalizeContextTermsInText('Login fails on suff', {
        finalizeTrailingWord: false,
      }),
    ).toBe('Login fails on suff')
  })
})

describe('detect*FromText fuzzy integration', () => {
  it('detects Safari from a misheard browser word', () => {
    expect(detectBrowserFromText('Checkout broken on suffer only')).toEqual({
      value: 'Safari',
      source: 'auto-detected',
    })
  })

  it('detects Mobile from a typo', () => {
    expect(detectDeviceFromText('Issue happens on moble')).toEqual({
      value: 'Mobile',
      source: 'auto-detected',
    })
  })

  it('detects Windows from a typo', () => {
    expect(detectOsFromText('Only on windoze laptops')).toEqual({
      value: 'Windows',
      source: 'auto-detected',
    })
  })
})
