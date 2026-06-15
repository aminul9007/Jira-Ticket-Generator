import type { DetectedBrowser, DetectedField } from '../../types/contextDetection'

import { findContextMatchInText } from './fuzzyContextMatch'

const BROWSER_PATTERNS: { value: DetectedBrowser; pattern: RegExp }[] = [
  { value: 'Chrome', pattern: /\b(chrome|chromium)\b/i },
  { value: 'Firefox', pattern: /\b(firefox|mozilla)\b/i },
  { value: 'Safari', pattern: /\bsafari\b/i },
  { value: 'Edge', pattern: /\b(edge|edg)\b/i },
]

export function detectBrowserFromText(text: string): DetectedField<DetectedBrowser> | null {
  const normalized = text.trim()
  if (!normalized) return null

  for (const { value, pattern } of BROWSER_PATTERNS) {
    if (pattern.test(normalized)) {
      return { value, source: 'user' }
    }
  }

  const fuzzy = findContextMatchInText<DetectedBrowser>(normalized, 'browser')
  if (fuzzy) {
    return { value: fuzzy.value, source: 'user' }
  }

  return null
}
