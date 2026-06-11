import { describe, expect, it } from 'vitest'
import {
  applyTicketTemplatePreset,
  detectTemplatePreset,
  normalizeTicketTemplateSettings,
} from '../../shared/ticketTemplate'

describe('ticketTemplate', () => {
  it('creates full preset by default', () => {
    const settings = normalizeTicketTemplateSettings(null)
    expect(settings.preset).toBe('full')
    expect(settings.fields.titleSuggestions).toBe(true)
  })

  it('applies minimal preset fields', () => {
    const settings = applyTicketTemplatePreset('minimal')
    expect(settings.fields.qaContext).toBe(false)
    expect(settings.fields.stepsToReproduce).toBe(true)
  })

  it('detects custom preset when fields diverge', () => {
    const fields = { ...applyTicketTemplatePreset('standard').fields, severity: false }
    expect(detectTemplatePreset(fields)).toBe('custom')
  })

  it('always keeps issue summary enabled', () => {
    const settings = normalizeTicketTemplateSettings({
      preset: 'custom',
      fields: {
        ...applyTicketTemplatePreset('minimal').fields,
        issueSummary: false,
      },
    })
    expect(settings.fields.issueSummary).toBe(true)
  })
})
