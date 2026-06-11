import { describe, expect, it } from 'vitest'
import {
  applyQaStandardsPreset,
  createDefaultQaTicketStandards,
  detectPresetFromRules,
  formatQaStandardsPreview,
  formatQaStandardsRulesPrompt,
  normalizeQaTicketStandards,
  resolveEffectiveOutputStyle,
  rulesMatchPreset,
} from '../../shared/qaTicketStandards'

describe('qaTicketStandards', () => {
  it('uses standard preset rules by default', () => {
    const settings = createDefaultQaTicketStandards()
    expect(settings.preset).toBe('standard')
    expect(settings.rules.clearBugTitles).toBe(true)
    expect(settings.rules.releaseContextAwareness).toBe(false)
    expect(rulesMatchPreset(settings.rules, 'standard')).toBe(true)
  })

  it('applies distinct rules per preset', () => {
    const agile = applyQaStandardsPreset('agile')
    const enterprise = applyQaStandardsPreset('enterprise')

    expect(agile.rules.environmentAwareness).toBe(false)
    expect(agile.rules.professionalLanguage).toBe(false)
    expect(enterprise.rules.environmentAwareness).toBe(true)
    expect(enterprise.rules.releaseContextAwareness).toBe(true)
    expect(detectPresetFromRules(agile.rules)).toBe('agile')
    expect(detectPresetFromRules(enterprise.rules)).toBe('enterprise')
  })

  it('migrates legacy ticketGuidelines into customRules', () => {
    const settings = normalizeQaTicketStandards(null, 'Always mention Layer Panel')
    expect(settings.customRules).toBe('Always mention Layer Panel')
  })

  it('marks preset as custom when rules diverge', () => {
    const settings = normalizeQaTicketStandards({
      preset: 'enterprise',
      rules: {
        ...createDefaultQaTicketStandards().rules,
        clearBugTitles: false,
      },
    })
    expect(settings.preset).toBe('custom')
    expect(detectPresetFromRules(settings.rules)).toBe('custom')
  })

  it('omits disabled agile rules from prompt output', () => {
    const prompt = formatQaStandardsRulesPrompt(applyQaStandardsPreset('agile'))
    expect(prompt).toContain('Reproducible steps')
    expect(prompt).not.toContain('Environment awareness')
    expect(prompt).not.toContain('Release context awareness')
  })

  it('preview combines rules, preset, and custom rules', () => {
    const settings = {
      ...applyQaStandardsPreset('agile'),
      customRules: '- Mention affected module',
    }
    const preview = formatQaStandardsPreview(settings)
    expect(preview).toContain('Agile team')
    expect(preview).toContain('Mention affected module')
  })

  it('resolves output style from preset', () => {
    expect(resolveEffectiveOutputStyle('agile', 'detailed')).toBe('concise')
    expect(resolveEffectiveOutputStyle('enterprise', 'concise')).toBe('detailed')
    expect(resolveEffectiveOutputStyle('custom', 'detailed')).toBe('detailed')
  })
})
