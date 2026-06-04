import type { QaContextSettings } from '../../types/qaContext'
import {
  formatKnowledgeForPrompt,
  buildKnowledgeContext,
} from '../../services/knowledge/knowledgeContextService'
import { hasProjectKnowledge } from '../../utils/qaContextStorage'

/** @deprecated Use formatKnowledgeForPrompt from knowledgeContextService */
export function formatQaContextForPrompt(settings: QaContextSettings): string {
  if (!hasProjectKnowledge(settings)) return ''
  return formatKnowledgeForPrompt(buildKnowledgeContext(settings))
}

export { loadKnowledgeContext } from '../../services/knowledge/knowledgeContextService'
