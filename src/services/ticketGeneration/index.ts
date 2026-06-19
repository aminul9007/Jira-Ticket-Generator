import { generateTicketWithAi, isAiProviderConfigured } from '../../ai/providers/aiProvider'
import type { AiGenerationContextSource } from '../../ai/services/generationContextService'
import { buildAiGenerationContext } from '../../ai/services/generationContextService'
import type { GeneratedTicket, ValidatedBugReportFormValues } from '../../types/bugReport'
import { analyzeInputQuality } from './inputQualityAnalyzer'
import { generateSeniorQaTicket } from './seniorQaTicketGenerator'

export { analyzeInputQuality } from './inputQualityAnalyzer'
export { buildFormValuesFromGenerationInput } from './buildFormValuesFromInput'

export interface TicketGenerationResult {
  ticket: GeneratedTicket
  usedAi: boolean
}

export interface GenerateTicketOptions {
  contextSource?: AiGenerationContextSource
}

export async function generateTicket(
  values: ValidatedBugReportFormValues,
  options?: GenerateTicketOptions,
): Promise<TicketGenerationResult> {
  const qualityReport = analyzeInputQuality(values)
  const generationContext = buildAiGenerationContext(values, options?.contextSource)

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
