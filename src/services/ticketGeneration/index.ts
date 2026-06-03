import { generateTicketWithOpenAi, isAiProviderConfigured } from '../../ai/providers/openAiProvider'
import type { GeneratedTicket, ValidatedBugReportFormValues } from '../../types/bugReport'
import { analyzeInputQuality } from './inputQualityAnalyzer'
import { generateSeniorQaTicket } from './seniorQaTicketGenerator'

export { analyzeInputQuality } from './inputQualityAnalyzer'

export interface TicketGenerationResult {
  ticket: GeneratedTicket
  usedAi: boolean
}

export async function generateTicket(
  values: ValidatedBugReportFormValues,
): Promise<TicketGenerationResult> {
  const qualityReport = analyzeInputQuality(values)

  if (isAiProviderConfigured()) {
    const aiTicket = await generateTicketWithOpenAi(values)
    if (aiTicket) {
      return { ticket: aiTicket, usedAi: true }
    }
  }

  return {
    ticket: generateSeniorQaTicket(values, qualityReport),
    usedAi: false,
  }
}
