import { describe, expect, it } from 'vitest'
import type { GeneratedTicket } from '../types/bugReport'
import { applyTicketTemplatePreset } from '../../shared/ticketTemplate'
import { formatJiraTicket } from './formatJiraTicket'

const ticket: GeneratedTicket = {
  title: 'Login button unresponsive',
  titleSuggestions: ['A', 'B', 'C'],
  issueSummary: 'Users cannot log in.',
  stepsToReproduce: ['Open login', 'Click submit'],
  expectedResult: 'Dashboard loads',
  actualResult: 'Nothing happens',
  severity: 'High',
  priority: 'P1',
  severityReasoning: 'Blocks all users',
  possibleRootCauses: ['JS error'],
  confidenceScore: 80,
  category: 'Functional Bug',
  environments: ['Production'],
  affectedFeaturePage: 'Login',
}

describe('formatJiraTicket', () => {
  it('includes all sections for the full template', () => {
    const text = formatJiraTicket(ticket, applyTicketTemplatePreset('full'))
    expect(text).toContain('h2. Summary')
    expect(text).toContain('h2. Title suggestions')
    expect(text).toContain('h2. Possible root causes')
    expect(text).toContain('Affected feature/page')
  })

  it('omits disabled sections for the minimal template', () => {
    const text = formatJiraTicket(ticket, applyTicketTemplatePreset('minimal'))
    expect(text).toContain('h2. Summary')
    expect(text).toContain('h2. Steps to Reproduce')
    expect(text).not.toContain('h2. Title suggestions')
    expect(text).not.toContain('h2. Environment')
    expect(text).not.toContain('h2. Severity reasoning')
    expect(text).not.toContain('h2. Possible root causes')
  })
})
