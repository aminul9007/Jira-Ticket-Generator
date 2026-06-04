import { buildTicketGenerationPrompt } from '../services/promptBuilder'
import type { GeneratedTicket, ValidatedBugReportFormValues } from '../../types/bugReport'
import type { AiGenerationContext } from '../types/generationContext'
import {
  buildChatCompletionPayload,
  parseTicketFromChatContent,
  requestChatCompletion,
} from './parseChatCompletion'

const OPENAI_API_URL = 'https://api.openai.com/v1'

export function isOpenAiConfigured(): boolean {
  const key = import.meta.env.VITE_OPENAI_API_KEY
  return typeof key === 'string' && key.length > 0
}

/** @deprecated Use isOpenAiConfigured or isAiProviderConfigured */
export const isAiProviderConfigured = isOpenAiConfigured

export async function generateTicketWithOpenAi(
  values: ValidatedBugReportFormValues,
  generationContext: AiGenerationContext,
): Promise<GeneratedTicket | null> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  if (!apiKey) return null

  const model = import.meta.env.VITE_OPENAI_MODEL ?? 'gpt-4o-mini'
  const { systemPrompt, userPrompt } = buildTicketGenerationPrompt(values, generationContext)
  const payload = buildChatCompletionPayload(model, systemPrompt, userPrompt)

  const content = await requestChatCompletion(
    OPENAI_API_URL,
    apiKey,
    payload,
    'OpenAI',
  )

  if (!content) return null

  return parseTicketFromChatContent(content, values, 'OpenAI')
}
