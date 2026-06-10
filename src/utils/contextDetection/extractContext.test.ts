import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { extractContext, mergeExtractedContext } from './extractContext'

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
    expect(ctx.environment).toEqual({ value: 'staging', source: 'user' })
  })

  it('maps production stage to production environment', () => {
    const ctx = extractContext('production stage checkout is broken')
    expect(ctx.environment).toEqual({ value: 'production', source: 'user' })
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
    expect(ctx.browser).toEqual({ value: 'Firefox', source: 'user' })
  })

  it('mergeExtractedContext keeps user overrides', () => {
    const previous = extractContext('staging bug on safari')
    const userOverride = {
      ...previous,
      browser: { value: 'Firefox' as const, source: 'user' as const },
    }
    const next = extractContext('staging bug on chrome')
    const merged = mergeExtractedContext(userOverride, next)
    expect(merged.browser).toEqual({ value: 'Firefox', source: 'user' })
    expect(merged.environment).toEqual({ value: 'staging', source: 'user' })
  })
})
