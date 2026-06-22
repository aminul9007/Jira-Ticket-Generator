import { describe, expect, it } from 'vitest'
import { buildMcpCreateIssueArgs } from './createIssueViaMcp.js'

const basePayload = {
  title: 'Login button broken',
  summary: 'Users cannot log in',
  steps: ['Open login'],
  expected: 'Dashboard loads',
  actual: 'Button does nothing',
  severity: 'High',
  priority: 'P1',
  environment: 'Production',
  browser: 'Chrome',
  os: 'Windows',
  device: 'Desktop',
  projectKey: 'PRESTO',
  issueType: 'Bug',
}

describe('buildMcpCreateIssueArgs', () => {
  it('does not pass reporter as a top-level MCP argument', () => {
    const args = buildMcpCreateIssueArgs({
      ...basePayload,
      reporter: 'Aminul',
    })

    expect(args).not.toHaveProperty('reporter')
  })

  it('includes reporter in additional_fields JSON', () => {
    const args = buildMcpCreateIssueArgs({
      ...basePayload,
      reporter: 'Aminul',
    })

    expect(typeof args.additional_fields).toBe('string')
    const fields = JSON.parse(args.additional_fields as string) as Record<string, unknown>
    expect(fields.reporter).toBe('Aminul')
    expect(fields.priority).toEqual({ name: 'High' })
  })

  it('omits additional_fields when no optional fields are set', () => {
    const args = buildMcpCreateIssueArgs({
      ...basePayload,
      priority: '',
    })

    expect(args.additional_fields).toBeUndefined()
  })
})
