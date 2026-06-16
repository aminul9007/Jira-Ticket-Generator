import type { DetectedDevice, DetectedField } from '../../types/contextDetection'

import { findContextMatchInText } from './fuzzyContextMatch'

const DEVICE_PATTERNS: { value: DetectedDevice; pattern: RegExp }[] = [
  { value: 'Mobile', pattern: /\b(mobile|phone|iphone|android phone)\b/i },
  { value: 'Tablet', pattern: /\b(tablet|ipad)\b/i },
  { value: 'Desktop', pattern: /\b(desktop|laptop|pc)\b/i },
]

export function detectDeviceFromText(text: string): DetectedField<DetectedDevice> | null {
  const normalized = text.trim()
  if (!normalized) return null

  for (const { value, pattern } of DEVICE_PATTERNS) {
    if (pattern.test(normalized)) {
      return { value, source: 'auto-detected' }
    }
  }

  const fuzzy = findContextMatchInText<DetectedDevice>(normalized, 'device')
  if (fuzzy) {
    return { value: fuzzy.value, source: 'auto-detected' }
  }

  return null
}
