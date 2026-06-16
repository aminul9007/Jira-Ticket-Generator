import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import type { Environment } from '../../types/bugReport'
import { createUnknownContext } from './extractContextFromText'
import { applyTypingContextUpdate } from './applyTypingContextUpdate'

const WINDOWS_CHROME_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

function emptyForm() {
  return {
    issueDescription: '',
    environments: [] as Environment[],
    qaContext: createUnknownContext(),
  }
}

describe('applyTypingContextUpdate', () => {
  beforeEach(() => {
    vi.stubGlobal('navigator', {
      userAgent: WINDOWS_CHROME_UA,
      platform: 'Win32',
      userAgentData: {
        brands: [{ brand: 'Chromium' }, { brand: 'Google Chrome' }],
        mobile: false,
      },
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('starts with no detected context before the user types', () => {
    const form = emptyForm()
    expect(form.qaContext.browser.value).toBe('Unknown')
    expect(form.qaContext.device.value).toBe('Unknown')
  })

  it('does not detect device from partial word matches while typing', () => {
    const next = applyTypingContextUpdate(emptyForm(), 'property')
    expect(next.qaContext.device.value).toBe('Unknown')
    expect(next.qaContext.browser.value).toBe('Unknown')
    expect(next.qaContext.os.value).toBe('Unknown')
    expect(next.qaContext.environment.value).toBe('unknown')
  })

  it('detects explicit keywords as the user types', () => {
    const next = applyTypingContextUpdate(
      emptyForm(),
      'In staging login button is not working on Chrome Mac',
    )
    expect(next.qaContext.environment).toEqual({ value: 'staging', source: 'auto-detected' })
    expect(next.qaContext.browser).toEqual({ value: 'Chrome', source: 'auto-detected' })
    expect(next.qaContext.os).toEqual({ value: 'macOS', source: 'auto-detected' })
    expect(next.qaContext.device.value).toBe('Unknown')
    expect(next.environments).toEqual(['Beta'])
  })

  it('does not use session auto-detection while typing', () => {
    const next = applyTypingContextUpdate(emptyForm(), 'Layer panel appears broken')
    expect(next.qaContext.browser.value).toBe('Unknown')
    expect(next.qaContext.os.value).toBe('Unknown')
    expect(next.qaContext.device.value).toBe('Unknown')
  })

  it('updates browser when the user changes keywords in the description', () => {
    const withSafari = applyTypingContextUpdate(emptyForm(), 'Broken on Safari in production')
    expect(withSafari.qaContext.browser).toEqual({ value: 'Safari', source: 'auto-detected' })

    const withChrome = applyTypingContextUpdate(
      withSafari,
      'Broken on Chrome in production',
    )
    expect(withChrome.qaContext.browser).toEqual({ value: 'Chrome', source: 'auto-detected' })
  })

  it('clears auto-detected values when keywords are removed', () => {
    const withChrome = applyTypingContextUpdate(emptyForm(), 'Broken on Chrome')
    expect(withChrome.qaContext.browser.value).toBe('Chrome')

    const cleared = applyTypingContextUpdate(withChrome, 'Broken button')
    expect(cleared.qaContext.browser.value).toBe('Unknown')
  })

  it('clears text-inferred environment chips when the keyword is removed', () => {
    const withStaging = applyTypingContextUpdate(emptyForm(), 'Staging checkout broken')
    expect(withStaging.environments).toEqual(['Beta'])

    const cleared = applyTypingContextUpdate(withStaging, 'Checkout broken')
    expect(cleared.environments).toEqual([])
    expect(cleared.qaContext.environment.value).toBe('unknown')
  })

  it('keeps manually selected environment chips when text does not mention environment', () => {
    const manual = {
      ...emptyForm(),
      environments: ['Production'] as Environment[],
    }
    const next = applyTypingContextUpdate(manual, 'Checkout button stays disabled')
    expect(next.environments).toEqual(['Production'])
    expect(next.qaContext.environment.value).toBe('unknown')
  })

  it('preserves user chip overrides while typing', () => {
    const withUserBrowser = applyTypingContextUpdate(emptyForm(), 'Broken on Chrome')
    withUserBrowser.qaContext.browser = { value: 'Firefox', source: 'user' }

    const next = applyTypingContextUpdate(withUserBrowser, 'Broken on Chrome again')
    expect(next.qaContext.browser).toEqual({ value: 'Firefox', source: 'user' })
  })
})
