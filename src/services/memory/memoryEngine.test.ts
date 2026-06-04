import { describe, expect, it } from 'vitest'
import { findSimilarTickets, scoreTicketSimilarity } from './memoryEngine'
import type { TicketHistoryRecord } from '../../types/ticketHistory'
import type { ValidatedBugReportFormValues } from '../../types/bugReport'
import { extractContext } from '../../utils/contextDetection/extractContext'

const baseForm: ValidatedBugReportFormValues = {
  environments: ['Production'],
  issueDescription:
    'On Production checkout, the pay button stays disabled after entering a valid address on iPhone Safari.',
  qaContext: extractContext(
    'On Production checkout, the pay button stays disabled after entering a valid address on iPhone Safari.',
  ),
}

function makeRecord(overrides: Partial<TicketHistoryRecord> = {}): TicketHistoryRecord {
  return {
    id: '1',
    createdAt: new Date().toISOString(),
    formInput: {
      issueDescription: 'Checkout pay button disabled on mobile Safari after valid address',
      environments: ['Production'],
      qaContext: baseForm.qaContext,
    },
    generatedTicket: {
      title: 'UI Bug: Checkout pay button disabled',
      titleSuggestions: ['A', 'B', 'C'],
      issueSummary: 'Summary',
      stepsToReproduce: ['Step 1'],
      expectedResult: 'Aligned',
      actualResult: 'Misaligned',
      severity: 'Medium',
      priority: 'P3',
      severityReasoning: 'Reason',
      possibleRootCauses: ['CSS'],
      confidenceScore: 80,
      category: 'UI Bug',
      environments: ['Production'],
      affectedFeaturePage: 'Checkout',
    },
    finalTicket: {
      title: 'UI Bug: Checkout pay button disabled',
      titleSuggestions: ['A', 'B', 'C'],
      issueSummary: 'Summary',
      stepsToReproduce: ['Step 1'],
      expectedResult: 'Aligned',
      actualResult: 'Misaligned',
      severity: 'Medium',
      priority: 'P3',
      severityReasoning: 'Reason',
      possibleRootCauses: ['CSS'],
      confidenceScore: 80,
      category: 'UI Bug',
      environments: ['Production'],
      affectedFeaturePage: 'Checkout',
    },
    selectedTitle: 'UI Bug: Checkout pay button disabled',
    editedFields: [],
    severityChanged: false,
    priorityChanged: false,
    usedAi: true,
    ...overrides,
  }
}

describe('memoryEngine', () => {
  it('scores similar descriptions higher', () => {
    const score = scoreTicketSimilarity(baseForm, makeRecord())
    expect(score).toBeGreaterThan(5)
  })

  it('returns similar tickets sorted by relevance', () => {
    const unrelated = makeRecord({
      id: '2',
      formInput: {
        issueDescription: 'Blog page missing meta description tags in search results',
        environments: ['Beta'],
        qaContext: extractContext('Blog page missing meta description tags'),
      },
      finalTicket: {
        ...makeRecord().finalTicket,
        category: 'SEO Issue',
        title: 'SEO Issue: Missing meta tags',
        affectedFeaturePage: 'Blog',
      },
    })

    const matches = findSimilarTickets(baseForm, [unrelated, makeRecord()])
    expect(matches).toHaveLength(1)
    expect(matches[0]?.id).toBe('1')
  })
})
