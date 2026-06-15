import type {
  DetectedBrowser,
  DetectedDevice,
  DetectedOs,
} from '../../types/contextDetection'
import { levenshteinDistance } from './levenshteinDistance'

export type ContextCategory = 'browser' | 'os' | 'device'

type ContextValue = DetectedBrowser | DetectedOs | DetectedDevice

interface ContextTermEntry {
  category: ContextCategory
  value: ContextValue
  terms: readonly string[]
}

/** Canonical labels and common spoken/typed variants for fuzzy matching. */
const CONTEXT_TERM_CATALOG: readonly ContextTermEntry[] = [
  { category: 'browser', value: 'Chrome', terms: ['chrome', 'chromium'] },
  { category: 'browser', value: 'Firefox', terms: ['firefox', 'mozilla'] },
  { category: 'browser', value: 'Safari', terms: ['safari'] },
  { category: 'browser', value: 'Edge', terms: ['edge', 'edg'] },
  { category: 'os', value: 'Windows', terms: ['windows', 'win32', 'win'] },
  { category: 'os', value: 'macOS', terms: ['macos', 'mac', 'osx'] },
  { category: 'os', value: 'Linux', terms: ['linux'] },
  { category: 'os', value: 'Android', terms: ['android'] },
  { category: 'os', value: 'iOS', terms: ['ios', 'iphone', 'ipad'] },
  { category: 'device', value: 'Desktop', terms: ['desktop', 'laptop', 'pc'] },
  { category: 'device', value: 'Mobile', terms: ['mobile', 'phone'] },
  { category: 'device', value: 'Tablet', terms: ['tablet', 'ipad'] },
]

/** Known speech-to-text mishearings that fuzzy matching alone may miss. */
const VOICE_ALIASES: Readonly<Record<string, ContextValue>> = {
  suffer: 'Safari',
  safaree: 'Safari',
  chorme: 'Chrome',
  crowm: 'Chrome',
  krome: 'Chrome',
  firefoks: 'Firefox',
  firfox: 'Firefox',
  windoze: 'Windows',
  windws: 'Windows',
  macro: 'macOS',
  moble: 'Mobile',
  moblie: 'Mobile',
  andriod: 'Android',
  andorid: 'Android',
}

export interface FuzzyContextMatch {
  category: ContextCategory
  value: ContextValue
  distance: number
}

const MIN_FUZZY_WORD_LENGTH = 4

function normalizeWord(word: string): string {
  return word.toLowerCase().replace(/[^a-z0-9']/g, '')
}

function maxAllowedDistance(word: string, target: string): number {
  const maxLen = Math.max(word.length, target.length)
  return Math.ceil(maxLen / 2) + 1
}

function findCatalogEntry(value: ContextValue): ContextTermEntry | undefined {
  return CONTEXT_TERM_CATALOG.find((entry) => entry.value === value)
}

function isCloseEnough(word: string, target: string): boolean {
  if (word === target) return true
  if (word.length < MIN_FUZZY_WORD_LENGTH || target.length < MIN_FUZZY_WORD_LENGTH) {
    return false
  }

  const distance = levenshteinDistance(word, target)
  return distance <= maxAllowedDistance(word, target) && distance < Math.max(word.length, target.length)
}

export function findFuzzyContextMatch(rawWord: string): FuzzyContextMatch | null {
  const word = normalizeWord(rawWord)
  if (!word) return null

  const aliasValue = VOICE_ALIASES[word]
  if (aliasValue) {
    const entry = findCatalogEntry(aliasValue)
    if (entry) {
      return { category: entry.category, value: entry.value, distance: 0 }
    }
  }

  let best: FuzzyContextMatch | null = null
  let secondBestDistance = Number.POSITIVE_INFINITY

  for (const entry of CONTEXT_TERM_CATALOG) {
    for (const term of entry.terms) {
      if (word === term) {
        return { category: entry.category, value: entry.value, distance: 0 }
      }

      if (!isCloseEnough(word, term)) continue

      const distance = levenshteinDistance(word, term)
      if (!best || distance < best.distance) {
        secondBestDistance = best?.distance ?? Number.POSITIVE_INFINITY
        best = { category: entry.category, value: entry.value, distance }
      } else if (distance < secondBestDistance) {
        secondBestDistance = distance
      }
    }
  }

  if (!best) return null

  // Skip ambiguous matches where two categories are equally close.
  if (secondBestDistance !== Number.POSITIVE_INFINITY && secondBestDistance - best.distance < 2) {
    return null
  }

  return best
}

export function findContextMatchInText<T extends ContextValue>(
  text: string,
  category: ContextCategory,
): { value: T; distance: number } | null {
  const words = text.match(/\b[\w']+\b/g) ?? []
  let best: { value: T; distance: number } | null = null

  for (const word of words) {
    const match = findFuzzyContextMatch(word)
    if (!match || match.category !== category) continue

    if (!best || match.distance < best.distance) {
      best = { value: match.value as T, distance: match.distance }
    }
  }

  return best
}

export interface NormalizeContextTermsOptions {
  /** When true, also normalize the final word (voice session complete). */
  finalizeTrailingWord?: boolean
}

export function normalizeContextTermsInText(
  text: string,
  options: NormalizeContextTermsOptions = {},
): string {
  const pattern = options.finalizeTrailingWord
    ? /\b([a-zA-Z'][a-zA-Z0-9']{3,})\b/g
    : /\b([a-zA-Z'][a-zA-Z0-9']{3,})\b(?=\s|[.,!?;:]|$)/g

  return text.replace(pattern, (word) => {
    const normalizedWord = normalizeWord(word)
    const aliasValue = VOICE_ALIASES[normalizedWord]
    if (aliasValue) {
      return aliasValue
    }

    if (!options.finalizeTrailingWord && normalizedWord.length < 5) {
      return word
    }

    const match = findFuzzyContextMatch(word)
    if (!match) return word

    const canonical = String(match.value)
    if (normalizedWord === canonical.toLowerCase()) {
      return word
    }

    return canonical
  })
}
