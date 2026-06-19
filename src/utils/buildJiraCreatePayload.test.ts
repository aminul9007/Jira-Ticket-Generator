import { describe, expect, it } from 'vitest'
import { DEFAULT_APP_SETTINGS } from '../data/defaultAppSettings'
import type { GeneratedTicket } from '../types/bugReport'
import type { ExtractedContext } from '../types/contextDetection'
import { applyTicketTemplatePreset } from '../../shared/ticketTemplate'
import { buildJiraCreatePayload } from './buildJiraCreatePayload'

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
}

const qaContext: ExtractedContext = {
  environment: { value: 'production', source: 'auto-detected' },
  browser: { value: 'Chrome', source: 'auto-detected' },
  os: { value: 'Windows', source: 'auto-detected' },
  device: { value: 'Desktop', source: 'auto-detected' },
}

describe('buildJiraCreatePayload', () => {
  it('maps ticket and QA context to API payload', () => {
    const payload = buildJiraCreatePayload(
      ticket,
      qaContext,
      {
        ...DEFAULT_APP_SETTINGS.ticketDefaults,
        projectKey: 'QA',
        issueType: 'Bug',
        labels: ['regression'],
        assignee: '',
      },
      {
        domain: 'company.atlassian.net',
        email: 'qa@company.com',
        apiToken: 'token',
      },
    )

    expect(payload.title).toBe('Login button unresponsive')
    expect(payload.summary).toBe('Users cannot log in.')
    expect(payload.steps).toHaveLength(2)
    expect(payload.environment).toContain('Production')
    expect(payload.browser).toBe('Chrome')
    expect(payload.projectKey).toBe('QA')
    expect(payload.labels).toEqual(['regression'])
    expect(payload.connection?.domain).toBe('company.atlassian.net')
  })

  it('includes optional reporter when provided', () => {
    const payload = buildJiraCreatePayload(
      ticket,
      qaContext,
      DEFAULT_APP_SETTINGS.ticketDefaults,
      DEFAULT_APP_SETTINGS.jira,
      undefined,
      { reporter: 'qa@company.com' },
    )

    expect(payload.reporter).toBe('qa@company.com')
  })

  it('omits QA context fields when disabled in template', () => {
    const payload = buildJiraCreatePayload(
      ticket,
      qaContext,
      DEFAULT_APP_SETTINGS.ticketDefaults,
      DEFAULT_APP_SETTINGS.jira,
      applyTicketTemplatePreset('minimal'),
    )

    expect(payload.browser).toBe('')
    expect(payload.environment).toBe('')
    expect(payload.template?.preset).toBe('minimal')
  })
})
