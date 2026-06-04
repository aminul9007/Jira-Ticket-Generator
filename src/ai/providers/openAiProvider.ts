import { buildTicketGenerationPrompt } from '../services/promptBuilder'
import {
  normalizeAiResponse,
  validateAiTicketResponse,
} from '../utils/validateAiResponse'
import type { GeneratedTicket, ValidatedBugReportFormValues } from '../../types/bugReport'
import type { AiGenerationContext } from '../types/generationContext'

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

export function isAiProviderConfigured(): boolean {
  const key = import.meta.env.VITE_OPENAI_API_KEY
  return typeof key === 'string' && key.length > 0
}

export async function generateTicketWithOpenAi(
  values: ValidatedBugReportFormValues,
  generationContext: AiGenerationContext,
): Promise<GeneratedTicket | null> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  if (!apiKey) return null

  const model = import.meta.env.VITE_OPENAI_MODEL ?? 'gpt-4o-mini'
  const { systemPrompt, userPrompt } = buildTicketGenerationPrompt(values, generationContext)

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.15,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  })

  if (!response.ok) {
    console.warn('[AI] OpenAI request failed:', response.status)
    return null
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[]
  }
  const content = data.choices?.[0]?.message?.content
  if (!content) return null

  try {
    const parsed = JSON.parse(content) as unknown
    const validation = validateAiTicketResponse(parsed)

    if (!validation.valid || !validation.data) {
      console.warn('[AI] Invalid response schema:', validation.errors)
      return null
    }

    return normalizeAiResponse(validation.data, values)
  } catch {
    console.warn('[AI] Failed to parse OpenAI JSON response')
    return null
  }
}
