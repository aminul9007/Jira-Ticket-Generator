import { generateTicketWithAi, isAiProviderConfigured } from '../../ai/providers/aiProvider'
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
    const aiResult = await generateTicketWithAi(values, generationContext)
    if (aiResult) {
      return { ticket: aiResult.ticket, usedAi: true }
    }
  }

  return {
    ticket: generateSeniorQaTicket(values, qualityReport),
    usedAi: false,
  }
}
