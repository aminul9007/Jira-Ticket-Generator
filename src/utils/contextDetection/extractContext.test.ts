import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { extractContext, mergeExtractedContext } from './extractContext'
import { extractContextFromVoice } from './extractContextFromVoice'

const WINDOWS_CHROME_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

describe('extractContext', () => {
  beforeEach(() => {
    vi.stubGlobal('navigator', {
      userAgent: WINDOWS_CHROME_UA,
      platform: 'Win32',
      userAgentData: { brands: [{ brand: 'Chromium' }, { brand: 'Google Chrome' }], mobile: false },
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('detects environment from transcript keywords', () => {
    const ctx = extractContext('In staging login button is broken')
    expect(ctx.environment).toEqual({ value: 'staging', source: 'auto-detected' })
  })

  it('maps production stage to production environment', () => {
    const ctx = extractContext('production stage checkout is broken')
    expect(ctx.environment).toEqual({ value: 'production', source: 'auto-detected' })
  })

  it('auto-detects browser, OS, and device from session when not in transcript', () => {
    const ctx = extractContext('Layer panel appears broken when site is unlocked')
    expect(ctx.environment).toEqual({ value: 'unknown', source: 'unknown' })
    expect(ctx.browser.value).toBe('Chrome')
    expect(ctx.browser.source).toBe('auto-detected')
    expect(ctx.os.value).toBe('Windows')
    expect(ctx.device.value).toBe('Desktop')
  })

  it('prefers transcript browser over session', () => {
    const ctx = extractContext('Reproduced on Firefox only')
    expect(ctx.browser).toEqual({ value: 'Firefox', source: 'auto-detected' })
  })

  it('detects misheard browser names from voice transcripts', () => {
    const ctx = extractContext('Button broken on suffer in production')
    expect(ctx.browser).toEqual({ value: 'Safari', source: 'auto-detected' })
  })

  it('mergeExtractedContext keeps chip overrides (source: user)', () => {
    const previous = extractContext('staging bug on safari')
    const userOverride = {
      ...previous,
      browser: { value: 'Firefox' as const, source: 'user' as const },
    }
    const next = extractContext('staging bug on chrome')
    const merged = mergeExtractedContext(userOverride, next)
    expect(merged.browser).toEqual({ value: 'Firefox', source: 'user' })
    expect(merged.environment).toEqual({ value: 'staging', source: 'auto-detected' })
  })

  it('mergeExtractedContext updates text-detected fields when typing changes them', () => {
    const previous = extractContextFromVoice('broken on suffer in production')
    const next = extractContextFromVoice(
      'property search button broken on chrome broser in desktop windows in production',
    )
    const merged = mergeExtractedContext(previous, next)
    expect(merged.browser).toEqual({ value: 'Chrome', source: 'auto-detected' })
    expect(merged.device).toEqual({ value: 'Desktop', source: 'auto-detected' })
    expect(merged.os).toEqual({ value: 'Windows', source: 'auto-detected' })
    expect(merged.environment).toEqual({ value: 'production', source: 'auto-detected' })
  })
})
