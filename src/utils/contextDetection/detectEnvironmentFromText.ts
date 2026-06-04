import type { DetectedEnvironment, DetectedField } from '../../types/contextDetection'

const ENVIRONMENT_PATTERNS: { value: DetectedEnvironment; pattern: RegExp }[] = [
  { value: 'production', pattern: /\b(production|prod)\b/i },
  { value: 'staging', pattern: /\b(staging|stage)\b/i },
  { value: 'beta', pattern: /\bbeta\b/i },
  { value: 'canary', pattern: /\bcanary\b/i },
  { value: 'qa', pattern: /\b(qa|test environment)\b/i },
  { value: 'development', pattern: /\b(development|dev|local)\b/i },
]

export function detectEnvironmentFromText(
  text: string,
): DetectedField<DetectedEnvironment> | null {
  const normalized = text.trim()
  if (!normalized) return null

  for (const { value, pattern } of ENVIRONMENT_PATTERNS) {
    if (pattern.test(normalized)) {
      return { value, source: 'user' }
    }
  }

  return null
}
