import { describe, expect, it } from 'vitest'
import { normalizeAiPayloadKeys, normalizeAiPriority } from './normalizeAiPayload'
import { validateAiTicketResponse } from './validateAiResponse'

const minimalValid = {
  category: 'Functional Bug',
  affectedFeaturePage: 'Checkout',
  environments: ['Beta'],
  titleSuggestions: ['[Functional] Checkout — fails', 'B', 'C'],
  title: '[Functional] Checkout — fails',
  summary: 'Payment fails after submit.',
  steps: ['Open checkout', 'Submit payment', 'Observe error'],
  expected: 'Payment succeeds',
  actual: 'Error shown',
  severity: 'High',
  priority: 'P0',
  severityReasoning: 'Blocks checkout.',
  possibleRootCauses: ['Possible: API timeout'],
  confidence: 85,
}

describe('normalizeAiPayload', () => {
  it('maps compact JSON field names to app schema', () => {
    const normalized = normalizeAiPayloadKeys(minimalValid)
    expect(normalized.issueSummary).toBe(minimalValid.summary)
    expect(normalized.stepsToReproduce).toEqual(minimalValid.steps)
    expect(normalized.expectedResult).toBe(minimalValid.expected)
    expect(normalized.actualResult).toBe(minimalValid.actual)
    expect(normalized.confidenceScore).toBe(85)
    expect(normalized.priority).toBe('P0')
  })

  it('validates compact alias payload end-to-end', () => {
    const result = validateAiTicketResponse(minimalValid)
    expect(result.valid).toBe(true)
    expect(result.data?.priority).toBe('P0')
    expect(result.data?.issueSummary).toContain('Payment fails')
  })

  it('maps legacy P4 to P3', () => {
    expect(normalizeAiPriority('P4')).toBe('P3')
  })
})
