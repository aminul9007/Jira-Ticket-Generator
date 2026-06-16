import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { detectBrowserFromText } from './detectBrowserFromText'
import { detectDeviceFromText } from './detectDeviceFromText'
import { detectOsFromText } from './detectOsFromText'
import { extractContextFromText } from './extractContextFromText'
import { resolveSmartContext } from './resolveSmartContext'

const WINDOWS_CHROME_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

describe('strict context detection (typing)', () => {
  it('does not detect device from partial word matches', () => {
    expect(detectDeviceFromText('property')).toBeNull()
    expect(detectDeviceFromText('microphone')).toBeNull()
  })

  it('does not fuzzy-match without explicit fuzzy option', () => {
    expect(detectBrowserFromText('Checkout broken on suffer only')).toBeNull()
    expect(detectDeviceFromText('Issue happens on moble')).toBeNull()
    expect(detectOsFromText('Only on windoze laptops')).toBeNull()
  })

  it('detects nothing from unrelated issue text', () => {
    const ctx = extractContextFromText('property')
    expect(ctx.browser.value).toBe('Unknown')
    expect(ctx.os.value).toBe('Unknown')
    expect(ctx.device.value).toBe('Unknown')
    expect(ctx.environment.value).toBe('unknown')
  })

  it('detects staging, Chrome, and macOS from explicit keywords', () => {
    const ctx = extractContextFromText(
      'In staging login button is not working on Chrome Mac',
    )
    expect(ctx.environment).toEqual({ value: 'staging', source: 'auto-detected' })
    expect(ctx.browser).toEqual({ value: 'Chrome', source: 'auto-detected' })
    expect(ctx.os).toEqual({ value: 'macOS', source: 'auto-detected' })
    expect(ctx.device.value).toBe('Unknown')
  })

  it('detects only production environment when explicitly mentioned', () => {
    const ctx = extractContextFromText('Checkout page is broken in production')
    expect(ctx.environment).toEqual({ value: 'production', source: 'auto-detected' })
    expect(ctx.browser.value).toBe('Unknown')
    expect(ctx.os.value).toBe('Unknown')
    expect(ctx.device.value).toBe('Unknown')
  })
})

describe('resolveSmartContext', () => {
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

  it('fills browser, OS, and device from session when text has no matches', () => {
    const ctx = resolveSmartContext('Layer panel appears broken', { fillSession: true })
    expect(ctx.environment.value).toBe('unknown')
    expect(ctx.browser).toEqual({ value: 'Chrome', source: 'auto-detected' })
    expect(ctx.os).toEqual({ value: 'Windows', source: 'auto-detected' })
    expect(ctx.device).toEqual({ value: 'Desktop', source: 'auto-detected' })
  })

  it('never auto-detects environment from session', () => {
    const ctx = resolveSmartContext('Layer panel appears broken', { fillSession: true })
    expect(ctx.environment).toEqual({ value: 'unknown', source: 'unknown' })
  })

  it('uses default environment chip when text has no environment', () => {
    const ctx = resolveSmartContext('Checkout button broken', {
      fillSession: false,
      defaultEnvironments: ['Production'],
    })
    expect(ctx.environment).toEqual({ value: 'production', source: 'default' })
  })
})
