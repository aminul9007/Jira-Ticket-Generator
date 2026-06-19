import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_APP_SETTINGS } from '../../data/defaultAppSettings'
import * as extensionConfig from '../config/extensionConfig'
import * as bootstrapService from './extensionBootstrapService'
import * as jiraTestService from './extensionJiraTestService'
import { runExtensionHealthChecks } from './extensionHealthService'

vi.mock('./extensionSettingsService', () => ({
  loadExtensionAppSettings: vi.fn(async () => DEFAULT_APP_SETTINGS),
}))

describe('runExtensionHealthChecks', () => {
  beforeEach(() => {
    vi.spyOn(extensionConfig, 'resolveExtensionApiBaseUrl').mockReset()
    vi.spyOn(bootstrapService, 'isServerJiraConfigured').mockReset()
    vi.spyOn(jiraTestService, 'isExtensionJiraReady').mockReset()
    vi.spyOn(jiraTestService, 'isExtensionJiraReady').mockResolvedValue(true)
    vi.stubGlobal('chrome', {
      storage: { local: {} },
    })
  })

  it('warns when API backend is unreachable', async () => {
    vi.spyOn(extensionConfig, 'resolveExtensionApiBaseUrl').mockResolvedValue(null)

    const warnings = await runExtensionHealthChecks()
    expect(warnings.some((warning) => warning.code === 'api_unreachable')).toBe(true)
  })

  it('warns when Jira MCP is not ready', async () => {
    vi.spyOn(extensionConfig, 'resolveExtensionApiBaseUrl').mockResolvedValue('http://localhost:3001')
    vi.spyOn(bootstrapService, 'isServerJiraConfigured').mockResolvedValue(true)
    vi.spyOn(jiraTestService, 'isExtensionJiraReady').mockResolvedValue(false)

    const warnings = await runExtensionHealthChecks()
    expect(warnings.some((warning) => warning.code === 'jira_not_configured')).toBe(true)
  })
})
