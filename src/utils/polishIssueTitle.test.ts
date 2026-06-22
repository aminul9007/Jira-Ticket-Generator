import { describe, expect, it } from 'vitest'
import { buildGrammaticalContextSuffix, polishIssueTitle } from './polishIssueTitle'

describe('polishIssueTitle', () => {
  it('polishes grammar and appends environment, browser, and OS context', () => {
    expect(
      polishIssueTitle(
        'Research button appears broken on production from Browser Windows Chrome',
      ),
    ).toBe('Research button is unresponsive on Production in Chrome on Windows')
  })

  it('fixes informal grammar and keeps browser context', () => {
    expect(polishIssueTitle('Pay button broken on Safari')).toBe(
      'Pay button is broken in Safari',
    )
    expect(polishIssueTitle('checkout doesnt work on prod')).toBe(
      'Checkout does not work on Production',
    )
  })

  it('is idempotent when titles are polished more than once', () => {
    const once = polishIssueTitle('Pay button broken on Safari')
    expect(polishIssueTitle(once)).toBe(once)
  })

  it('strips trailing punctuation for title fragments', () => {
    expect(polishIssueTitle('Login form fails after submit.')).toBe(
      'Login form fails after submit',
    )
  })

  it('ignores extension metadata lines', () => {
    expect(
      polishIssueTitle('Save button is unresponsive\nPage: https://example.com/dashboard'),
    ).toBe('Save button is unresponsive')
  })

  it('normalizes click-related phrasing', () => {
    expect(polishIssueTitle('Submit button clicking does nothing')).toBe(
      'Submit button does not respond to clicks',
    )
  })

  it('includes mobile device context when OS is not specified', () => {
    expect(polishIssueTitle('Checkout fails on mobile in Chrome')).toBe(
      'Checkout fails in Chrome on mobile',
    )
  })
})

describe('buildGrammaticalContextSuffix', () => {
  it('orders environment, browser, and OS naturally', () => {
    expect(
      buildGrammaticalContextSuffix({
        environment: 'production',
        browser: 'Chrome',
        os: 'Windows',
        device: 'Desktop',
      }),
    ).toBe('on Production in Chrome on Windows')
  })
})
