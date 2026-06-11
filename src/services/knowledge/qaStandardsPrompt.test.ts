import { describe, expect, it } from 'vitest'
import { createDefaultQaTicketStandards } from '../../../shared/qaTicketStandards'
import { formatQaStandardsForPrompt } from './qaStandardsPrompt'

describe('qaStandardsPrompt', () => {
  it('orders standards before custom rules', () => {
    const { standardsSection, customRulesSection } = formatQaStandardsForPrompt({
      ...createDefaultQaTicketStandards(),
      customRules: 'Always include browser info',
    })

    expect(standardsSection).toContain('mandatory')
    expect(standardsSection).toContain('Standard QA')
    expect(customRulesSection).toContain('Custom project rules')
    expect(customRulesSection).toContain('Always include browser info')
  })

  it('returns empty custom section when no custom rules', () => {
    const { customRulesSection } = formatQaStandardsForPrompt(createDefaultQaTicketStandards())
    expect(customRulesSection).toBe('')
  })
})
