import type {
  BugCategory,
  Environment,
  ResolvedBugInput,
  ValidatedBugReportFormValues,
} from '../types/bugReport'
import { BUG_CATEGORIES, ENVIRONMENTS } from '../data/constants'

export function isBugCategory(value: string): value is BugCategory {
  return (BUG_CATEGORIES as readonly string[]).includes(value)
}

export function isEnvironment(value: string): value is Environment {
  return (ENVIRONMENTS as readonly string[]).includes(value)
}

export function inferCategory(description: string): BugCategory {
  const text = description.toLowerCase()

  if (/\b(a11y|accessibility|screen reader|wcag|aria|keyboard|contrast)\b/.test(text)) {
    return 'Accessibility Issue'
  }
  if (/\b(seo|meta tag|search engine|sitemap|canonical|indexing)\b/.test(text)) {
    return 'SEO Issue'
  }
  if (/\b(slow|performance|latency|load time|timeout|lag|spinner)\b/.test(text)) {
    return 'Performance Issue'
  }
  if (/\b(mobile|ios|android|iphone|ipad|responsive|touch)\b/.test(text)) {
    return 'Mobile Bug'
  }
  if (/\b(ui|layout|alignment|css|style|button|color|font|visual|misaligned|overlap)\b/.test(text)) {
    return 'UI Bug'
  }

  return 'Functional Bug'
}

export function inferFeature(description: string): string {
  const featurePatterns = [
    /\b(checkout|login|sign[- ]?in|sign[- ]?up|register|dashboard|settings|cart|profile|payment|onboarding|search|homepage|header|footer|modal|sidebar)\b/i,
    /(?:on|in|at|for)\s+(?:the\s+)?([A-Za-z][A-Za-z0-9\s/-]{2,30})(?:\s+(?:page|screen|flow|tab|modal))/i,
  ]

  for (const pattern of featurePatterns) {
    const match = description.match(pattern)
    if (match?.[1]) {
      return match[1].trim()
    }
    if (match?.[0]) {
      return match[0].trim()
    }
  }

  return ''
}

export function inferEnvironmentsFromText(description: string): Environment[] {
  const text = description.toLowerCase()
  const inferred: Environment[] = []

  if (/\b(production|prod)\b/.test(text)) inferred.push('Production')
  if (/\b(beta|staging|stage)\b/.test(text)) inferred.push('Beta')
  if (/\b(canary)\b/.test(text)) inferred.push('Canary')

  return inferred
}

export function mergeEnvironments(
  selected: Environment[],
  inferred: Environment[],
): Environment[] {
  const seen = new Set<Environment>()
  const merged: Environment[] = []

  for (const env of [...selected, ...inferred]) {
    if (!seen.has(env)) {
      seen.add(env)
      merged.push(env)
    }
  }

  return merged
}

export function extractShortTitle(description: string): string {
  const trimmed = description.trim()
  const firstLine = trimmed.split(/\n+/)[0]?.trim() ?? trimmed
  const sentence = firstLine.split(/(?<=[.!?])\s+/)[0]?.trim() ?? firstLine

  if (sentence.length <= 120) return sentence
  return `${sentence.slice(0, 117).trim()}…`
}

export function resolveBugInput(
  values: ValidatedBugReportFormValues,
): ResolvedBugInput {
  const description = values.issueDescription.trim()
  const inferredEnvironments = inferEnvironmentsFromText(description)

  return {
    ...values,
    category: inferCategory(description),
    affectedFeaturePage: inferFeature(description),
    shortTitle: extractShortTitle(description),
    environments: mergeEnvironments(values.environments, inferredEnvironments),
  }
}
