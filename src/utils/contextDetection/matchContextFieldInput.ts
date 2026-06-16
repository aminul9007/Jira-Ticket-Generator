import type { Environment } from '../../types/bugReport'
import type {
  DetectedBrowser,
  DetectedDevice,
  DetectedEnvironment,
  DetectedOs,
} from '../../types/contextDetection'
import { levenshteinDistance } from './levenshteinDistance'
import { findFuzzyContextMatch } from './fuzzyContextMatch'
import type { MissingContextField } from './getMissingContextFields'
import { mapDetectedEnvironmentToLegacy } from './mapDetectedEnvironment'

interface EnvironmentTermEntry {
  value: DetectedEnvironment
  terms: readonly string[]
}

const ENVIRONMENT_TERM_CATALOG: readonly EnvironmentTermEntry[] = [
  { value: 'production', terms: ['production', 'prod'] },
  { value: 'staging', terms: ['staging', 'stage'] },
  { value: 'beta', terms: ['beta'] },
  { value: 'canary', terms: ['canary'] },
  { value: 'qa', terms: ['qa', 'test'] },
  { value: 'development', terms: ['development', 'dev', 'local'] },
]

const MIN_FUZZY_WORD_LENGTH = 3

function normalizeInput(input: string): string {
  return input.trim().toLowerCase().replace(/[^a-z0-9\s'-]/g, '')
}

function maxAllowedDistance(word: string, target: string): number {
  const maxLen = Math.max(word.length, target.length)
  return Math.ceil(maxLen / 2) + 1
}

function isCloseEnough(word: string, target: string): boolean {
  if (word === target) return true
  if (word.length < MIN_FUZZY_WORD_LENGTH || target.length < MIN_FUZZY_WORD_LENGTH) {
    return false
  }
  const distance = levenshteinDistance(word, target)
  return distance <= maxAllowedDistance(word, target) && distance < Math.max(word.length, target.length)
}

function findFuzzyEnvironmentMatch(input: string): DetectedEnvironment | null {
  const words = input.split(/\s+/).filter(Boolean)
  const candidates = words.length > 0 ? words : [input]

  let best: { value: DetectedEnvironment; distance: number } | null = null

  for (const word of candidates) {
    for (const entry of ENVIRONMENT_TERM_CATALOG) {
      for (const term of entry.terms) {
        if (word === term) {
          return entry.value
        }
        if (!isCloseEnough(word, term)) continue

        const distance = levenshteinDistance(word, term)
        if (!best || distance < best.distance) {
          best = { value: entry.value, distance }
        }
      }
    }
  }

  return best?.value ?? null
}

export interface MatchedContextField {
  field: MissingContextField
  environment?: DetectedEnvironment
  environments?: Environment[]
  browser?: DetectedBrowser
  os?: DetectedOs
  device?: DetectedDevice
  matchedLabel: string
}

export function matchContextFieldFromUserInput(
  field: MissingContextField,
  rawInput: string,
): MatchedContextField | null {
  const input = normalizeInput(rawInput)
  if (!input) return null

  if (field === 'environment') {
    const value = findFuzzyEnvironmentMatch(input)
    if (!value || value === 'unknown') return null
    return {
      field,
      environment: value,
      environments: mapDetectedEnvironmentToLegacy(value),
      matchedLabel: value,
    }
  }

  const words = input.match(/\b[\w']+\b/g) ?? [input]
  let bestMatch: ReturnType<typeof findFuzzyContextMatch> = null

  for (const word of words) {
    const match = findFuzzyContextMatch(word)
    if (!match) continue
    if (match.category !== field) continue
    if (!bestMatch || match.distance < bestMatch.distance) {
      bestMatch = match
    }
  }

  if (!bestMatch) return null

  const matchedLabel = String(bestMatch.value)

  switch (field) {
    case 'browser':
      return { field, browser: bestMatch.value as DetectedBrowser, matchedLabel }
    case 'os':
      return { field, os: bestMatch.value as DetectedOs, matchedLabel }
    case 'device':
      return { field, device: bestMatch.value as DetectedDevice, matchedLabel }
    default:
      return null
  }
}
