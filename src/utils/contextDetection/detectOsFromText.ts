import type { DetectedField, DetectedOs } from '../../types/contextDetection'
import { findContextMatchInText } from './fuzzyContextMatch'
import type { TextDetectionOptions } from './detectBrowserFromText'

const OS_PATTERNS: { value: DetectedOs; pattern: RegExp }[] = [
  { value: 'Windows', pattern: /\b(windows|win32)\b/i },
  { value: 'macOS', pattern: /\b(mac\s?os|macos|osx|os x)\b/i },
  { value: 'macOS', pattern: /\bmac\b/i },
  { value: 'Linux', pattern: /\blinux\b/i },
  { value: 'Android', pattern: /\bandroid\b/i },
  { value: 'iOS', pattern: /\b(ios|iphone|ipad)\b/i },
]

export function detectOsFromText(
  text: string,
  options: TextDetectionOptions = {},
): DetectedField<DetectedOs> | null {
  const normalized = text.trim()
  if (!normalized) return null

  for (const { value, pattern } of OS_PATTERNS) {
    if (pattern.test(normalized)) {
      return { value, source: 'auto-detected' }
    }
  }

  if (options.fuzzy) {
    const fuzzy = findContextMatchInText<DetectedOs>(normalized, 'os')
    if (fuzzy) {
      return { value: fuzzy.value, source: 'auto-detected' }
    }
  }

  return null
}
