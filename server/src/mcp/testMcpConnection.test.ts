import { describe, expect, it } from 'vitest'
import { getMissingJiraConfig } from './mcpEnv.js'

describe('getMissingJiraConfig', () => {
  it('returns empty when connection is complete', () => {
    expect(
      getMissingJiraConfig({
        domain: 'company.atlassian.net',
        email: 'qa@company.com',
        apiToken: 'secret',
      }),
    ).toEqual([])
  })
})
