import { afterEach, describe, expect, it, vi } from 'vitest'
import { captureBrowserContext } from '../services/browserContextService'

describe('captureBrowserContext', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('captures active tab url, title, and timestamp', async () => {
    vi.stubGlobal('chrome', {
      tabs: {
        query: (
          _queryInfo: { active?: boolean; currentWindow?: boolean },
          callback: (tabs: Array<{ url?: string; title?: string }>) => void,
        ) => {
          callback([
            {
              url: 'https://example.com/dashboard',
              title: 'Dashboard',
            },
          ])
        },
      },
      runtime: {
        lastError: undefined,
      },
    })

    const context = await captureBrowserContext()

    expect(context.url).toBe('https://example.com/dashboard')
    expect(context.title).toBe('Dashboard')
    expect(context.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })

  it('returns empty url and title when tab query fails', async () => {
    vi.stubGlobal('chrome', {
      tabs: {
        query: (
          _queryInfo: { active?: boolean; currentWindow?: boolean },
          callback: (tabs: Array<{ url?: string; title?: string }>) => void,
        ) => {
          callback([])
        },
      },
      runtime: {
        lastError: { message: 'No active tab' },
      },
    })

    const context = await captureBrowserContext()

    expect(context.url).toBe('')
    expect(context.title).toBe('')
    expect(context.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })
})
