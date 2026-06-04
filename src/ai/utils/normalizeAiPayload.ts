import type { TicketPriority } from '../../types/bugReport'

/** Map alternate field names from compact LLM JSON into app schema keys. */
export function normalizeAiPayloadKeys(raw: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = { ...raw }

  if (out.issueSummary == null && typeof out.summary === 'string') {
    out.issueSummary = out.summary
  }
  if (out.stepsToReproduce == null && Array.isArray(out.steps)) {
    out.stepsToReproduce = out.steps
  }
  if (out.expectedResult == null && typeof out.expected === 'string') {
    out.expectedResult = out.expected
  }
  if (out.actualResult == null && typeof out.actual === 'string') {
    out.actualResult = out.actual
  }
  if (out.confidenceScore == null && typeof out.confidence === 'number') {
    out.confidenceScore = out.confidence
  }

  if (typeof out.priority === 'string') {
    out.priority = normalizeAiPriority(out.priority)
  }

  return out
}

export function normalizeAiPriority(value: string): TicketPriority {
  const upper = value.trim().toUpperCase()
  if (upper === 'P0') return 'P0'
  if (upper === 'P1') return 'P1'
  if (upper === 'P2') return 'P2'
  if (upper === 'P3') return 'P3'
  if (upper === 'P4') return 'P3'
  return value as TicketPriority
}
