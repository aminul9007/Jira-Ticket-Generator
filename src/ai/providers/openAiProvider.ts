import {
  buildSeniorQaUserPrompt,
  SENIOR_QA_SYSTEM_PROMPT,
} from '../prompts/seniorQaLeadPrompt'
import type { AiTicketResponse } from '../types/aiTicketResponse'
import type { GeneratedTicket, ValidatedBugReportFormValues } from '../../types/bugReport'

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

function normalizeAiResponse(
  raw: AiTicketResponse,
  values: ValidatedBugReportFormValues,
): GeneratedTicket {
  const suggestions = raw.titleSuggestions?.filter(Boolean) ?? []
  const padded = [...suggestions]
  while (padded.length < 3) {
    padded.push(raw.title || values.title)
  }

  return {
    title: raw.title || padded[0],
    titleSuggestions: [padded[0], padded[1], padded[2]] as [string, string, string],
    issueSummary: raw.issueSummary,
    stepsToReproduce: raw.stepsToReproduce,
    expectedResult: raw.expectedResult,
    actualResult: raw.actualResult,
    severity: raw.severity,
    priority: raw.priority,
    severityReasoning: raw.severityReasoning,
    possibleRootCauses: raw.possibleRootCauses ?? [],
    confidenceScore: Math.min(100, Math.max(0, Math.round(raw.confidenceScore))),
    category: values.category,
    environments: [...values.environments],
    affectedFeaturePage: values.affectedFeaturePage.trim() || undefined,
  }
}

export function isAiProviderConfigured(): boolean {
  const key = import.meta.env.VITE_OPENAI_API_KEY
  return typeof key === 'string' && key.length > 0
}

export async function generateTicketWithOpenAi(
  values: ValidatedBugReportFormValues,
): Promise<GeneratedTicket | null> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  if (!apiKey) return null

  const model = import.meta.env.VITE_OPENAI_MODEL ?? 'gpt-4o-mini'

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SENIOR_QA_SYSTEM_PROMPT },
        { role: 'user', content: buildSeniorQaUserPrompt(values) },
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
    const parsed = JSON.parse(content) as AiTicketResponse
    return normalizeAiResponse(parsed, values)
  } catch {
    console.warn('[AI] Failed to parse OpenAI JSON response')
    return null
  }
}
