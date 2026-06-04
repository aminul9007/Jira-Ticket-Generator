import { buildTicketGenerationPrompt } from '../services/promptBuilder'
import type { GeneratedTicket, ValidatedBugReportFormValues } from '../../types/bugReport'
import type { AiGenerationContext } from '../types/generationContext'
import {
  buildChatCompletionPayload,
  parseTicketFromChatContent,
  requestChatCompletion,
} from './parseChatCompletion'

const DEFAULT_BASE_URL = 'http://127.0.0.1:8080/v1'
const DEFAULT_API_KEY = 'no-key'
const DEFAULT_MODEL = 'qwen2.5-3b-instruct'

export function getLlamaCppBaseUrl(): string {
  const url = import.meta.env.VITE_LLAMACPP_BASE_URL
  return typeof url === 'string' && url.length > 0 ? url : DEFAULT_BASE_URL
}

export function isLlamaCppConfigured(): boolean {
  const provider = import.meta.env.VITE_AI_PROVIDER
  if (provider === 'openai') return false
  if (provider === 'llama-cpp') return true

  const enabled = import.meta.env.VITE_LLAMACPP_ENABLED
  if (enabled === 'true' || enabled === '1') return true
  if (enabled === 'false' || enabled === '0') return false

  const baseUrl = import.meta.env.VITE_LLAMACPP_BASE_URL
  return typeof baseUrl === 'string' && baseUrl.length > 0
}

export async function generateTicketWithLlamaCpp(
  values: ValidatedBugReportFormValues,
  generationContext: AiGenerationContext,
): Promise<GeneratedTicket | null> {
  if (!isLlamaCppConfigured()) return null

  const baseUrl = getLlamaCppBaseUrl()
  const apiKey = import.meta.env.VITE_LLAMACPP_API_KEY ?? DEFAULT_API_KEY
  const model = import.meta.env.VITE_LLAMACPP_MODEL ?? DEFAULT_MODEL
  const { systemPrompt, userPrompt } = buildTicketGenerationPrompt(values, generationContext)
  const payload = buildChatCompletionPayload(model, systemPrompt, userPrompt)

  const content = await requestChatCompletion(
    baseUrl,
    apiKey,
    payload,
    'llama.cpp',
  )

  if (!content) return null

  return parseTicketFromChatContent(content, values, 'llama.cpp')
}
