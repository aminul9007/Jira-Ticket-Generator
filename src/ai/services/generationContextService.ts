import type { ValidatedBugReportFormValues } from '../../types/bugReport'
import type { AiGenerationContext, PromptGenerationInput } from '../types/generationContext'
import { formatFeedbackPatternsForPrompt, loadTicketFeedback } from '../../services/feedback/ticketFeedbackService'
import {
  buildKnowledgeContext,
  formatKnowledgeForPrompt,
} from '../../services/knowledge/knowledgeContextService'
import {
  formatProjectContextForPrompt,
} from '../../services/knowledge/projectContextPrompt'
import { formatQaStandardsForPrompt } from '../../services/knowledge/qaStandardsPrompt'
import { hasProjectContextContent } from '../../utils/projectContextFormat'
import { resolveEffectiveOutputStyle } from '../../../shared/qaTicketStandards'
import { loadAppSettings } from '../../utils/appSettingsStorage'
import { isCustomProjectKnowledge, loadProjectKnowledge } from '../../utils/qaContextStorage'
import { getTicketHistory } from '../../services/history/ticketHistoryService'
import {
  findSimilarTickets,
  formatHistoricalTicketsForPrompt,
} from '../../services/memory/memoryEngine'

/** Resolve prompt context: App Settings textarea first, then legacy knowledge storage. */
export function resolveProjectContextSection(): string {
  const appSettings = loadAppSettings()
  const fromAppSettings = formatProjectContextForPrompt(appSettings.ai.projectContext)
  if (hasProjectContextContent(appSettings.ai.projectContext)) {
    return fromAppSettings
  }

  const legacyKnowledge = loadProjectKnowledge()
  if (isCustomProjectKnowledge(legacyKnowledge)) {
    return formatKnowledgeForPrompt(buildKnowledgeContext(legacyKnowledge))
  }

  return ''
}

export function buildAiGenerationContext(
  values: ValidatedBugReportFormValues,
): AiGenerationContext {
  const history = getTicketHistory()
  const feedback = loadTicketFeedback()
  const appSettings = loadAppSettings()

  const similarTickets = findSimilarTickets(values, history)
  const feedbackSummary = formatFeedbackPatternsForPrompt(
    feedback,
    history.map((record) => ({
      id: record.id,
      editedFields: record.editedFields,
      severityChanged: record.severityChanged,
      priorityChanged: record.priorityChanged,
    })),
  )

  const qaPrompt = formatQaStandardsForPrompt(appSettings.qaTicketStandards)

  return {
    projectContextSection: resolveProjectContextSection(),
    qaStandardsSection: qaPrompt.standardsSection,
    customRulesSection: qaPrompt.customRulesSection,
    aiOutputStyle: resolveEffectiveOutputStyle(
      appSettings.qaTicketStandards.preset,
      appSettings.ai.outputStyle,
    ),
    similarTickets,
    feedbackSummary,
  }
}

export function buildPromptSections(input: PromptGenerationInput): {
  knowledgeSection: string
  historySection: string
  feedbackSection: string
} {
  const history = input.history ?? getTicketHistory()
  const feedback = input.feedback ?? loadTicketFeedback()

  const similarTickets = findSimilarTickets(input.values, history)

  return {
    knowledgeSection: resolveProjectContextSection(),
    historySection: formatHistoricalTicketsForPrompt(similarTickets),
    feedbackSection: formatFeedbackPatternsForPrompt(
      feedback,
      history.map((record) => ({
        id: record.id,
        editedFields: record.editedFields,
        severityChanged: record.severityChanged,
        priorityChanged: record.priorityChanged,
      })),
    ),
  }
}

export { formatKnowledgeForPrompt } from '../../services/knowledge/knowledgeContextService'
export { formatHistoricalTicketsForPrompt } from '../../services/memory/memoryEngine'
