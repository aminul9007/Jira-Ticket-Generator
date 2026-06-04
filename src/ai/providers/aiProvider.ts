import type { GeneratedTicket, ValidatedBugReportFormValues } from '../../types/bugReport'
import type { AiGenerationContext } from '../types/generationContext'
import { generateTicketWithLlamaCpp, isLlamaCppConfigured } from './llamaCppProvider'
import { generateTicketWithOpenAi, isOpenAiConfigured } from './openAiProvider'

export type AiProviderId = 'llama-cpp' | 'openai' | 'none'

export function getActiveAiProvider(): AiProviderId {
  const forced = import.meta.env.VITE_AI_PROVIDER

  if (forced === 'llama-cpp' && isLlamaCppConfigured()) return 'llama-cpp'
  if (forced === 'openai' && isOpenAiConfigured()) return 'openai'

  if (forced === 'openai') return isOpenAiConfigured() ? 'openai' : 'none'
  if (forced === 'llama-cpp') return isLlamaCppConfigured() ? 'llama-cpp' : 'none'

  if (isLlamaCppConfigured()) return 'llama-cpp'
  if (isOpenAiConfigured()) return 'openai'
  return 'none'
}

export function isAiProviderConfigured(): boolean {
  return getActiveAiProvider() !== 'none'
}

export async function generateTicketWithAi(
  values: ValidatedBugReportFormValues,
  generationContext: AiGenerationContext,
): Promise<{ ticket: GeneratedTicket; provider: AiProviderId } | null> {
  const provider = getActiveAiProvider()

  if (provider === 'llama-cpp') {
    const ticket = await generateTicketWithLlamaCpp(values, generationContext)
    return ticket ? { ticket, provider } : null
  }

  if (provider === 'openai') {
    const ticket = await generateTicketWithOpenAi(values, generationContext)
    return ticket ? { ticket, provider } : null
  }

  return null
}

export {
  generateTicketWithLlamaCpp,
  isLlamaCppConfigured,
  getLlamaCppBaseUrl,
} from './llamaCppProvider'
export { generateTicketWithOpenAi, isOpenAiConfigured } from './openAiProvider'
