import type {
  DetectedBrowser,
  DetectedDevice,
  DetectedEnvironment,
  DetectedOs,
} from '../types/contextDetection'
import { formatDetectedEnvironmentLabel } from '../types/contextDetection'
import { detectBrowserFromText } from './contextDetection/detectBrowserFromText'
import { detectDeviceFromText } from './contextDetection/detectDeviceFromText'
import { detectEnvironmentFromText } from './contextDetection/detectEnvironmentFromText'
import { detectOsFromText } from './contextDetection/detectOsFromText'
import { cleanTitleText } from './titleText'

const METADATA_LINE = /^(page|title|captured):\s*.+$/i

const RAW_CONTEXT_PATTERNS = [
  /\s+from\s+browser\b.*/i,
  /\s+from\s+(windows|mac|linux|chrome|safari|firefox|edge|android|ios|iphone|ipad|desktop|mobile|tablet)(\s+\1|\s+\w+)*\s*$/i,
  /\s+on\s+(production|prod|beta|staging|canary|chrome|safari|firefox|edge|android|ios|iphone|ipad|windows|macos|linux|desktop|mobile|tablet)(\s+(environment|env))?\s*$/i,
  /\s+in\s+(production|prod|beta|staging|canary)\s*$/i,
  /\s*[—–-]\s*(chrome|safari|firefox|edge|windows|mac|linux|android|ios|desktop|mobile).*$/i,
  /\s+\b(chrome|safari|firefox|edge|windows|macos|mac os x|linux|ubuntu|android|ios|iphone|ipad|desktop|mobile|tablet)\b(\s+\b(chrome|safari|firefox|edge|windows|macos|linux|android|ios|desktop|mobile|tablet)\b)*\s*$/i,
]

const INLINE_CONTEXT_PATTERN =
  /\s+(from|on|using|with)\s+(the\s+)?(browser|device|platform)\b(\s+\w+)*/gi

const FORMATTED_SUFFIX_PATTERNS = [
  /\s+on\s+(Windows|macOS|Linux|Android|iOS|desktop|mobile|tablet)\s*$/i,
  /\s+in\s+(Chrome|Firefox|Safari|Edge)\s*$/i,
  /\s+on\s+(Production|Staging|Beta|Canary|QA|Development)\s*$/i,
]

const GRAMMAR_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bappears\s+to\s+be\s+broken\b/gi, 'is broken'],
  [/\bappears\s+broken\b/gi, 'is unresponsive'],
  [/\bappears\s+to\s+be\s+not\s+working\b/gi, 'does not work'],
  [/\bappears\s+not\s+to\s+work\b/gi, 'does not work'],
  [/\bappears\s+to\s+not\s+work\b/gi, 'does not work'],
  [/\bseems\s+to\s+be\s+broken\b/gi, 'is broken'],
  [/\bseems\s+broken\b/gi, 'is unresponsive'],
  [/\bis\s+not\s+working\b/gi, 'does not work'],
  [/\bisn't\s+working\b/gi, 'does not work'],
  [/\bdoesn't\s+work\b/gi, 'does not work'],
  [/\bdoesnt\s+work\b/gi, 'does not work'],
  [/\bdont\s+work\b/gi, 'do not work'],
  [/\bnothing\s+happens\b/gi, 'no action occurs'],
  [/\bno\s+response\b/gi, 'does not respond'],
  [/\bnot\s+responding\b/gi, 'is unresponsive'],
  [/\bnot\s+clickable\b/gi, 'is not clickable'],
  [/\bcan't\s+click\b/gi, 'cannot be clicked'],
  [/\bcannot\s+click\b/gi, 'cannot be clicked'],
  [/\bclick(?:ing)?\s+does\s+nothing\b/gi, 'does not respond to clicks'],
  [/\bclick(?:ing)?\s+has\s+no\s+effect\b/gi, 'does not respond to clicks'],
]

interface ExtractedTitleContext {
  environment: DetectedEnvironment | null
  browser: DetectedBrowser | null
  os: DetectedOs | null
  device: DetectedDevice | null
}

function capitalizeFirst(text: string): string {
  if (!text) return text
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function fixMissingCopula(text: string): string {
  return text
    .replace(
      /\b([A-Za-z][\w\s/-]{0,40}?)\s+(broken|unresponsive|disabled|missing|incorrect)\b/gi,
      (_, subject: string, adjective: string) => {
        const trimmedSubject = subject.trim()
        if (/\b(is|are|was|were|does|do|has|have)\b/i.test(trimmedSubject)) {
          return `${trimmedSubject} ${adjective}`
        }
        return `${trimmedSubject} is ${adjective.toLowerCase()}`
      },
    )
    .replace(/\bis is\b/gi, 'is')
}

function stripTrailingPunctuation(text: string): string {
  return text.replace(/[.!?]+\s*$/u, '').trim()
}

function extractTitleContextFromText(text: string): ExtractedTitleContext {
  return {
    environment: detectEnvironmentFromText(text)?.value ?? null,
    browser: detectBrowserFromText(text)?.value ?? null,
    os: detectOsFromText(text)?.value ?? null,
    device: detectDeviceFromText(text)?.value ?? null,
  }
}

function shouldIncludeDevice(
  device: DetectedDevice,
  os: DetectedOs | null,
): boolean {
  if (device === 'Unknown') return false
  if (device === 'Desktop' && os && os !== 'Unknown') return false
  if (device === 'Mobile' && (os === 'iOS' || os === 'Android')) return false
  if (device === 'Tablet' && os === 'iOS') return false
  return true
}

export function buildGrammaticalContextSuffix(ctx: ExtractedTitleContext): string {
  const parts: string[] = []

  if (ctx.environment && ctx.environment !== 'unknown') {
    parts.push(`on ${formatDetectedEnvironmentLabel(ctx.environment)}`)
  }

  if (ctx.browser && ctx.browser !== 'Unknown') {
    parts.push(`in ${ctx.browser}`)
  }

  if (ctx.os && ctx.os !== 'Unknown') {
    parts.push(`on ${ctx.os}`)
  } else if (ctx.device && shouldIncludeDevice(ctx.device, ctx.os)) {
    parts.push(`on ${ctx.device.toLowerCase()}`)
  }

  return parts.join(' ')
}

function stripFormattedContextSuffix(text: string): string {
  let result = text.trim()
  let changed = true

  while (changed) {
    changed = false
    for (const pattern of FORMATTED_SUFFIX_PATTERNS) {
      const next = result.replace(pattern, '').trim()
      if (next !== result) {
        result = next
        changed = true
      }
    }
  }

  return result
}

function stripRawContextPhrases(text: string): string {
  let result = text.trim()

  for (const pattern of RAW_CONTEXT_PATTERNS) {
    result = result.replace(pattern, '').trim()
  }

  return result.replace(INLINE_CONTEXT_PATTERN, '').trim()
}

function polishCoreGrammar(text: string): string {
  let result = text.trim()
  if (!result) return result

  for (const [pattern, replacement] of GRAMMAR_REPLACEMENTS) {
    result = result.replace(pattern, replacement)
  }

  result = fixMissingCopula(result)
  return result
}

/** Produce a formal, concise Jira title fragment from raw reporter text. */
export function polishIssueTitle(text: string): string {
  let result = text.trim()
  if (!result) return result

  const firstLine = result.split(/\n+/).find((line) => {
    const trimmed = line.trim()
    return trimmed.length > 0 && !METADATA_LINE.test(trimmed)
  })

  const source = firstLine?.trim() ?? result
  const context = extractTitleContextFromText(source)

  result = source.replace(METADATA_LINE, '').trim()
  result = result.split(/(?<=[.!?])\s+/)[0]?.trim() ?? result
  result = stripTrailingPunctuation(result)
  result = stripFormattedContextSuffix(result)
  result = stripRawContextPhrases(result)
  result = polishCoreGrammar(result)
  result = stripTrailingPunctuation(result)
  result = cleanTitleText(result)
  result = result.replace(/\s{2,}/g, ' ').trim()

  const suffix = buildGrammaticalContextSuffix(context)
  if (suffix) {
    result = result ? `${result} ${suffix}` : suffix
  }

  if (!result) return capitalizeFirst(cleanTitleText(source))

  return capitalizeFirst(result)
}
