import type { DetectedBrowser, DetectedField } from '../../types/contextDetection'
import { findContextMatchInText } from './fuzzyContextMatch'

export interface TextDetectionOptions {
  /** Enable fuzzy matching for voice transcripts (never for live typing). */
  fuzzy?: boolean
}

const BROWSER_PATTERNS: { value: DetectedBrowser; pattern: RegExp }[] = [
  { value: 'Chrome', pattern: /\b(chrome|chromium)\b/i },
  { value: 'Firefox', pattern: /\b(firefox|mozilla)\b/i },
  { value: 'Safari', pattern: /\bsafari\b/i },
  { value: 'Edge', pattern: /\b(edge|edg)\b/i },
]

export function detectBrowserFromText(
  text: string,
  options: TextDetectionOptions = {},
): DetectedField<DetectedBrowser> | null {
  const normalized = text.trim()
  if (!normalized) return null

  for (const { value, pattern } of BROWSER_PATTERNS) {
    if (pattern.test(normalized)) {
      return { value, source: 'auto-detected' }
    }
  }

  if (options.fuzzy) {
    const fuzzy = findContextMatchInText<DetectedBrowser>(normalized, 'browser')
    if (fuzzy) {
      return { value: fuzzy.value, source: 'auto-detected' }
    }
  }

  return null
}
