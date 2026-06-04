import { generateTicketWithOpenAi, isAiProviderConfigured } from '../../ai/providers/openAiProvider'
import { buildAiGenerationContext } from '../../ai/services/generationContextService'
import type { GeneratedTicket, ValidatedBugReportFormValues } from '../../types/bugReport'
import type { ProjectKnowledgeSettings } from '../../types/projectKnowledge'
import { analyzeInputQuality } from './inputQualityAnalyzer'
import { generateSeniorQaTicket } from './seniorQaTicketGenerator'

export { analyzeInputQuality } from './inputQualityAnalyzer'

export interface TicketGenerationResult {
  ticket: GeneratedTicket
  usedAi: boolean
}

export async function generateTicket(
  values: ValidatedBugReportFormValues,
  knowledgeSettings: ProjectKnowledgeSettings,
): Promise<TicketGenerationResult> {
  const qualityReport = analyzeInputQuality(values)
  const generationContext = buildAiGenerationContext(values, knowledgeSettings)

  if (isAiProviderConfigured()) {
    const aiTicket = await generateTicketWithOpenAi(values, generationContext)
    if (aiTicket) {
      return { ticket: aiTicket, usedAi: true }
    }
  }

  return {
    ticket: generateSeniorQaTicket(values, qualityReport),
    usedAi: false,
  }
}
