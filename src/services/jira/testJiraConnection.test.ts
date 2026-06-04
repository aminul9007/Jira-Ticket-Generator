import { describe, expect, it } from 'vitest'
import { validateJiraSettingsFields } from './testJiraConnection'

describe('testJiraConnection', () => {
  it('rejects incomplete credentials', () => {
    const result = validateJiraSettingsFields({
      domain: '',
      email: '',
      apiToken: '',
    })
    expect(result?.status).toBe('incomplete')
  })

  it('rejects invalid domain format', () => {
    const result = validateJiraSettingsFields({
      domain: 'not-a-valid-domain.com',
      email: 'qa@company.com',
      apiToken: 'token',
    })
    expect(result?.status).toBe('invalid')
  })
})
