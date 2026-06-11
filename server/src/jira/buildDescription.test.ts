import { describe, expect, it } from 'vitest'
import { buildJiraIssueDescription } from './buildDescription.js'
import { applyTicketTemplatePreset } from '../../../shared/ticketTemplate.js'

describe('buildJiraIssueDescription', () => {
  it('includes summary, steps, and QA context', () => {
    const description = buildJiraIssueDescription({
      title: 'Login fails',
      summary: 'Users cannot sign in on production.',
      steps: ['Open login page', 'Submit valid credentials'],
      expected: 'User is signed in',
      actual: 'Error banner appears',
      severity: 'High',
      priority: 'P1',
      environment: 'Production',
      browser: 'Chrome',
      os: 'Windows',
      device: 'Desktop',
    })

    expect(description).toContain('## Summary')
    expect(description).toContain('Users cannot sign in on production.')
    expect(description).toContain('1. Open login page')
    expect(description).toContain('**Browser:** Chrome')
    expect(description).toContain('**Severity:** High')
  })

  it('respects template field toggles', () => {
    const description = buildJiraIssueDescription({
      title: 'Login fails',
      summary: 'Users cannot sign in on production.',
      steps: ['Open login page'],
      expected: 'User is signed in',
      actual: 'Error banner appears',
      severity: 'High',
      priority: 'P1',
      environment: 'Production',
      browser: 'Chrome',
      os: 'Windows',
      device: 'Desktop',
      template: applyTicketTemplatePreset('minimal'),
    })

    expect(description).toContain('## Summary')
    expect(description).not.toContain('**Browser:** Chrome')
    expect(description).not.toContain('**Environment:** Production')
    expect(description).toContain('**Severity:** High')
  })
})
