import { describe, expect, it } from 'vitest'
import { composeIssueDescription } from './composeIssueDescription'

describe('composeIssueDescription', () => {
  it('appends page context to the user description', () => {
    const result = composeIssueDescription('Login button does nothing when clicked', {
      url: 'https://example.com/dashboard',
      title: 'Dashboard',
      timestamp: '2026-06-19T10:00:00.000Z',
    })

    expect(result).toContain('Login button does nothing when clicked')
    expect(result).toContain('Page: https://example.com/dashboard')
    expect(result).toContain('Title: Dashboard')
    expect(result).toContain('Captured: 2026-06-19T10:00:00.000Z')
  })
})
