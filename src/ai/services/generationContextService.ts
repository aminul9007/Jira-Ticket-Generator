import type { ValidatedBugReportFormValues } from '../../types/bugReport'
import type { ProjectKnowledgeSettings } from '../../types/projectKnowledge'
import type { AiGenerationContext, PromptGenerationInput } from '../types/generationContext'
import { formatFeedbackPatternsForPrompt, loadTicketFeedback } from '../../services/feedback/ticketFeedbackService'
import {
  buildKnowledgeContext,
  formatKnowledgeForPrompt,
} from '../../services/knowledge/knowledgeContextService'
import { isCustomProjectKnowledge } from '../../utils/qaContextStorage'
import { getTicketHistory } from '../../services/history/ticketHistoryService'
import {
  findSimilarTickets,
  formatHistoricalTicketsForPrompt,
} from '../../services/memory/memoryEngine'

export function buildAiGenerationContext(
  values: ValidatedBugReportFormValues,
  knowledgeSettings: ProjectKnowledgeSettings,
): AiGenerationContext {
  const history = getTicketHistory()
  const feedback = loadTicketFeedback()

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

  return { knowledge, knowledgeSettings: knowledgeSettings, similarTickets, feedbackSummary }
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
