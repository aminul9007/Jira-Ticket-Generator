import type { QaContextSettings } from '../../types/qaContext'
import { hasQaContext } from '../../utils/qaContextStorage'

export function formatQaContextForPrompt(settings: QaContextSettings): string {
  if (!hasQaContext(settings)) {
    return ''
  }

  const lines = [
    '## Team / product QA context',
    'Use this organizational context to improve title specificity, feature naming, and environment labels.',
    'Do NOT override bug report facts. Do NOT invent details not supported by the report.',
    '',
  ]

  if (settings.productName) {
    lines.push(`Product name: ${settings.productName}`)
  }
  if (settings.commonEnvironments.length > 0) {
    lines.push(`Common environments: ${settings.commonEnvironments.join(', ')}`)
  }
  if (settings.commonFeatures.length > 0) {
    lines.push(`Common features/pages: ${settings.commonFeatures.join(', ')}`)
  }
  if (settings.commonBugCategories.length > 0) {
    lines.push(`Common bug categories: ${settings.commonBugCategories.join(', ')}`)
  }

  lines.push(
    '',
    'When the report aligns with this context, prefer these names in titles and summaries.',
    'If the report conflicts with context, trust the report and note any mismatch briefly in severityReasoning.',
  )

  return lines.join('\n')
}
