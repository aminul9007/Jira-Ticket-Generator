import type {
  DetectedBrowser,
  DetectedDevice,
  DetectedField,
  DetectedOs,
} from '../../types/contextDetection'

function readUserAgent(): string {
  if (typeof navigator === 'undefined') return ''
  return navigator.userAgent ?? ''
}

function readPlatform(): string {
  if (typeof navigator === 'undefined') return ''
  return navigator.platform ?? ''
}

export function detectBrowserFromSession(): DetectedField<DetectedBrowser> {
  const ua = readUserAgent()
  if (!ua) {
    return { value: 'Unknown', source: 'unknown' }
  }

  const brands = navigator.userAgentData?.brands
  if (brands?.length) {
    const names = brands.map((b) => b.brand.toLowerCase())
    if (names.some((n) => n.includes('edge'))) {
      return { value: 'Edge', source: 'auto-detected' }
    }
    if (names.some((n) => n.includes('chrome') || n.includes('chromium'))) {
      return { value: 'Chrome', source: 'auto-detected' }
    }
  }

  if (/\bedg(e|a|ios)?\//i.test(ua)) {
    return { value: 'Edge', source: 'auto-detected' }
  }
  if (/\bfirefox\//i.test(ua)) {
    return { value: 'Firefox', source: 'auto-detected' }
  }
  if (/\bsafari\//i.test(ua) && !/\bchrome\//i.test(ua)) {
    return { value: 'Safari', source: 'auto-detected' }
  }
  if (/\bchrome\//i.test(ua) || /\bcrios\//i.test(ua)) {
    return { value: 'Chrome', source: 'auto-detected' }
  }

  return { value: 'Unknown', source: 'unknown' }
}

export function detectOsFromSession(): DetectedField<DetectedOs> {
  const ua = readUserAgent()
  const platform = readPlatform()
  const combined = `${platform} ${ua}`.trim()

  if (!combined) {
    return { value: 'Unknown', source: 'unknown' }
  }

  if (/\bwindows\b/i.test(combined)) {
    return { value: 'Windows', source: 'auto-detected' }
  }
  if (/\b(android)\b/i.test(combined)) {
    return { value: 'Android', source: 'auto-detected' }
  }
  if (/\b(iphone|ipad|ipod|ios)\b/i.test(combined)) {
    return { value: 'iOS', source: 'auto-detected' }
  }
  if (/\b(macintosh|mac os x|macos)\b/i.test(combined)) {
    return { value: 'macOS', source: 'auto-detected' }
  }
  if (/\blinux\b/i.test(combined)) {
    return { value: 'Linux', source: 'auto-detected' }
  }

  return { value: 'Unknown', source: 'unknown' }
}

export function detectDeviceFromSession(): DetectedField<DetectedDevice> {
  const ua = readUserAgent()

  if (!ua) {
    return { value: 'Unknown', source: 'unknown' }
  }

  const uaDataMobile = navigator.userAgentData?.mobile
  if (uaDataMobile === true) {
    return { value: 'Mobile', source: 'auto-detected' }
  }
  if (uaDataMobile === false) {
    return { value: 'Desktop', source: 'auto-detected' }
  }

  if (/\b(ipad|tablet)\b/i.test(ua)) {
    return { value: 'Tablet', source: 'auto-detected' }
  }
  if (/\b(mobile|iphone|ipod|android).*(mobile)?\b/i.test(ua)) {
    return { value: 'Mobile', source: 'auto-detected' }
  }
  if (/\bwindows|macintosh|linux\b/i.test(ua)) {
    return { value: 'Desktop', source: 'auto-detected' }
  }

  return { value: 'Unknown', source: 'unknown' }
}
