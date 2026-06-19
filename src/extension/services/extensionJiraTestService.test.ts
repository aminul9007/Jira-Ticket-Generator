import { describe, expect, it, vi, beforeEach } from 'vitest'
import { testExtensionJiraConnection } from './extensionJiraTestService'

vi.mock('./extensionJiraApi', () => ({
  testExtensionMcpConnection: vi.fn(),
}))

describe('testExtensionJiraConnection', () => {
  beforeEach(async () => {
    const module = await import('./extensionJiraApi')
    vi.mocked(module.testExtensionMcpConnection).mockReset()
  })

  it('returns MCP success message when API and create tool are ready', async () => {
    const module = await import('./extensionJiraApi')
    vi.mocked(module.testExtensionMcpConnection).mockResolvedValueOnce({
      connected: true,
      mockMode: false,
      hasCreateTool: true,
      toolCount: 49,
      createTool: 'jira_create_issue',
      message: 'Connected to Jira MCP (49 tools available).',
    })

    const result = await testExtensionJiraConnection({
      domain: 'company.atlassian.net',
      email: 'qa@company.com',
      apiToken: 'token',
    })

    expect(result.ok).toBe(true)
    expect(result.message).toContain('Connected to Jira MCP')
    expect(result.usesServerCredentials).toBe(false)
  })

  it('allows server credentials when extension fields are blank', async () => {
    const module = await import('./extensionJiraApi')
    vi.mocked(module.testExtensionMcpConnection).mockResolvedValueOnce({
      connected: true,
      mockMode: false,
      hasCreateTool: true,
      toolCount: 49,
      createTool: 'jira_create_issue',
      message: 'Connected to Jira MCP (49 tools available).',
    })

    const result = await testExtensionJiraConnection({
      domain: '',
      email: '',
      apiToken: '',
    })

    expect(result.ok).toBe(true)
    expect(result.usesServerCredentials).toBe(true)
    expect(module.testExtensionMcpConnection).toHaveBeenCalledWith(undefined)
  })

  it('returns MCP failure message', async () => {
    const module = await import('./extensionJiraApi')
    vi.mocked(module.testExtensionMcpConnection).mockResolvedValueOnce({
      connected: false,
      mockMode: false,
      hasCreateTool: false,
      toolCount: 0,
      createTool: 'jira_create_issue',
      message: 'Missing Jira configuration: JIRA_API_TOKEN',
    })

    const result = await testExtensionJiraConnection({
      domain: '',
      email: '',
      apiToken: '',
    })

    expect(result.ok).toBe(false)
    expect(result.message).toContain('Missing Jira configuration')
  })
})
