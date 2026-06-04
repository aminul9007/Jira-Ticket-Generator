import type { ValidatedBugReportFormValues } from '../../types/bugReport'
import type { ProjectKnowledgeSettings } from '../../types/projectKnowledge'
import type { AiGenerationContext, PromptGenerationInput } from '../types/generationContext'
import { formatFeedbackPatternsForPrompt, loadTicketFeedback } from '../../services/feedback/ticketFeedbackService'
import {
  buildKnowledgeContext,
  formatKnowledgeForPrompt,
} from '../../services/knowledge/knowledgeContextService'
import { loadAppSettings } from '../../utils/appSettingsStorage'
import { isCustomProjectKnowledge } from '../../utils/qaContextStorage'
import { formatProjectContextForPrompt } from '../../services/knowledge/projectContextPrompt'
import { hasProjectContextContent } from '../../utils/projectContextFormat'
import { getTicketHistory } from '../../services/history/ticketHistoryService'
import {
  findSimilarTickets,
  formatHistoricalTicketsForPrompt,
} from '../../services/memory/memoryEngine'

function resolveProjectContextSection(
  knowledgeSettings: ProjectKnowledgeSettings,
): string {
  const appSettings = loadAppSettings()
  const fromTextarea = formatProjectContextForPrompt(appSettings.ai.projectContext)
  if (hasProjectContextContent(appSettings.ai.projectContext)) {
    return fromTextarea
  }

  const knowledge = buildKnowledgeContext(knowledgeSettings)
  if (isCustomProjectKnowledge(knowledgeSettings)) {
    return formatKnowledgeForPrompt(knowledge)
  }

  return ''
}

export function buildAiGenerationContext(
  values: ValidatedBugReportFormValues,
  knowledgeSettings: ProjectKnowledgeSettings,
): AiGenerationContext {
  const history = getTicketHistory()
  const feedback = loadTicketFeedback()
  const appSettings = loadAppSettings()

  const knowledge = buildKnowledgeContext(knowledgeSettings)
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

  return {
    knowledge,
    knowledgeSettings,
    projectContextSection: resolveProjectContextSection(knowledgeSettings),
    aiOutputStyle: appSettings.ai.outputStyle,
    similarTickets,
    feedbackSummary,
  }
}

export function buildPromptSections(input: PromptGenerationInput): {
  knowledgeSection: string
  historySection: string
  feedbackSection: string
} {
  const knowledge = buildKnowledgeContext(input.knowledgeSettings)
  const history = input.history ?? getTicketHistory()
  const feedback = input.feedback ?? loadTicketFeedback()

  const similarTickets = findSimilarTickets(input.values, history)

  return {
    knowledgeSection: isCustomProjectKnowledge(input.knowledgeSettings)
      ? formatKnowledgeForPrompt(knowledge)
      : '',
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
