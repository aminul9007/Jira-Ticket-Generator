import { describe, expect, it, vi } from 'vitest'
import { testExtensionJiraConnection } from './extensionJiraTestService'

vi.mock('../../services/jira/testJiraConnection', () => ({
  validateJiraSettingsFields: vi.fn(() => null),
  testJiraConnection: vi.fn(async () => ({ status: 'success', message: 'Connected successfully' })),
}))

describe('testExtensionJiraConnection', () => {
  it('returns friendly success message', async () => {
    const result = await testExtensionJiraConnection({
      domain: 'company.atlassian.net',
      email: 'qa@company.com',
      apiToken: 'token',
    })

    expect(result.ok).toBe(true)
    expect(result.message).toBe('Connected Successfully')
  })
})

describe('testExtensionJiraConnection failures', () => {
  it('returns friendly failure message', async () => {
    const module = await import('../../services/jira/testJiraConnection')
    vi.mocked(module.validateJiraSettingsFields).mockReturnValueOnce({
      status: 'incomplete',
      message: 'Enter Jira domain, email, and API token.',
    })

    const result = await testExtensionJiraConnection({
      domain: '',
      email: '',
      apiToken: '',
    })

    expect(result.ok).toBe(false)
    expect(result.message).toBe('Unable to Connect')
  })
})
