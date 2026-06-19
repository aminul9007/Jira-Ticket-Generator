import { describe, expect, it, vi, beforeEach } from 'vitest'
import {
  loadExtensionJiraDefaults,
  saveExtensionJiraDefaults,
} from './extensionJiraDefaultsService'

describe('extensionJiraDefaultsService', () => {
  beforeEach(() => {
    vi.stubGlobal('chrome', {
      storage: {
        local: {
          get: vi.fn((_keys, callback: (items: Record<string, unknown>) => void) => {
            callback({})
          }),
          set: vi.fn((_items, callback?: () => void) => {
            callback?.()
          }),
        },
      },
      runtime: {
        lastError: undefined,
      },
    })
  })

  it('falls back to app ticket defaults when storage is empty', async () => {
    const defaults = await loadExtensionJiraDefaults({
      projectKey: 'WEB',
      issueType: 'Task',
      labels: [],
      assignee: 'qa@company.com',
    })

    expect(defaults.projectKey).toBe('WEB')
    expect(defaults.issueType).toBe('Task')
    expect(defaults.assignee).toBe('qa@company.com')
    expect(defaults.reporter).toBe('')
  })

  it('persists last-used Jira field selections', async () => {
    let stored: Record<string, unknown> = {}

    vi.stubGlobal('chrome', {
      storage: {
        local: {
          get: vi.fn((_keys, callback: (items: Record<string, unknown>) => void) => {
            callback(stored)
          }),
          set: vi.fn((items, callback?: () => void) => {
            stored = { ...stored, ...items }
            callback?.()
          }),
        },
      },
      runtime: {
        lastError: undefined,
      },
    })

    await saveExtensionJiraDefaults({
      projectKey: 'qa',
      issueType: 'Bug',
      assignee: 'dev@company.com',
      reporter: 'reporter@company.com',
    })

    const loaded = await loadExtensionJiraDefaults()
    expect(loaded.projectKey).toBe('QA')
    expect(loaded.assignee).toBe('dev@company.com')
    expect(loaded.reporter).toBe('reporter@company.com')
  })
})
