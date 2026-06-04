import {
  normalizeAiResponse,
  validateAiTicketResponse,
} from '../utils/validateAiResponse'
import type { GeneratedTicket, ValidatedBugReportFormValues } from '../../types/bugReport'

export interface ChatCompletionPayload {
  model: string
  temperature: number
  response_format: { type: 'json_object' }
  messages: { role: 'system' | 'user'; content: string }[]
}

export function buildChatCompletionPayload(
  model: string,
  systemPrompt: string,
  userPrompt: string,
): ChatCompletionPayload {
  return {
    model,
    temperature: 0.15,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  }
}

export async function requestChatCompletion(
  baseUrl: string,
  apiKey: string,
  payload: ChatCompletionPayload,
  providerLabel: string,
): Promise<string | null> {
  const url = `${baseUrl.replace(/\/$/, '')}/chat/completions`

  const controller = new AbortController()
  const timeoutMs = 120_000
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  let response: Response
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
  } catch (error) {
    console.warn(`[AI] ${providerLabel} request error:`, error)
    return null
  } finally {
    clearTimeout(timeoutId)
  }

  if (!response.ok) {
    console.warn(`[AI] ${providerLabel} request failed:`, response.status)
    return null
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[]
  }

  return data.choices?.[0]?.message?.content ?? null
}

export function parseTicketFromChatContent(
  content: string,
  values: ValidatedBugReportFormValues,
  providerLabel: string,
): GeneratedTicket | null {
  try {
    const parsed = JSON.parse(content) as unknown
    const validation = validateAiTicketResponse(parsed)

    if (!validation.valid || !validation.data) {
      console.warn(`[AI] ${providerLabel} invalid response schema:`, validation.errors)
      return null
    }

    return normalizeAiResponse(validation.data, values)
  } catch {
    console.warn(`[AI] ${providerLabel} failed to parse JSON response`)
    return null
  }
}
