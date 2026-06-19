import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_APP_SETTINGS } from '../../data/defaultAppSettings'
import { runExtensionHealthChecks } from './extensionHealthService'

vi.mock('./extensionSettingsService', () => ({
  loadExtensionAppSettings: vi.fn(async () => DEFAULT_APP_SETTINGS),
}))

describe('runExtensionHealthChecks', () => {
  beforeEach(() => {
    vi.stubGlobal('chrome', {
      storage: { local: {} },
    })
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false })))
  })

  it('warns when Jira is not configured', async () => {
    const warnings = await runExtensionHealthChecks()
    expect(warnings.some((warning) => warning.code === 'jira_not_configured')).toBe(true)
  })

  it('warns when API backend is unreachable', async () => {
    const warnings = await runExtensionHealthChecks()
    expect(warnings.some((warning) => warning.code === 'api_unreachable')).toBe(true)
  })
})
