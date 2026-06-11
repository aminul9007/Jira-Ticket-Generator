import { describe, expect, it } from 'vitest'
import { applyQaStandardsPreset, createDefaultQaTicketStandards } from '../../shared/qaTicketStandards'
import { DEFAULT_APP_SETTINGS } from '../data/defaultAppSettings'
import type { AppSettings } from '../types/appSettings'
import { normalizeAppSettings } from './appSettingsStorage'

describe('appSettingsStorage', () => {
  it('normalizes defaults for empty payload', () => {
    const settings = normalizeAppSettings(null)
    expect(settings.ai.outputStyle).toBe('standard')
    expect(settings.ai.autoGenerateAfterVoice).toBe(true)
    expect(settings.voice.silenceTimeoutSeconds).toBe(5)
    expect(settings.data.historyRetention).toBe(50)
    expect(settings.ticketTemplate.preset).toBe('full')
    expect(settings.ticketTemplate.fields.issueSummary).toBe(true)
    expect(settings.qaTicketStandards.preset).toBe('standard')
    expect(settings.qaTicketStandards.rules.reproducibleSteps).toBe(true)
  })

  it('migrates legacy ticketGuidelines to qaTicketStandards.customRules', () => {
    const settings = normalizeAppSettings({
      ai: { ticketGuidelines: 'Use formal tone' },
    } as unknown as Partial<AppSettings>)
    expect(settings.qaTicketStandards.customRules).toBe('Use formal tone')
    expect(settings.ai).not.toHaveProperty('ticketGuidelines')
  })

  it('preserves custom output style when preset is custom', () => {
    const settings = normalizeAppSettings({
      qaTicketStandards: {
        preset: 'custom',
        rules: { ...createDefaultQaTicketStandards().rules, clearBugTitles: false },
      },
      ai: { outputStyle: 'concise' },
    } as unknown as Partial<AppSettings>)
    expect(settings.qaTicketStandards.preset).toBe('custom')
    expect(settings.ai.outputStyle).toBe('concise')
  })

  it('falls back invalid enums to defaults', () => {
    const settings = normalizeAppSettings({
      ai: { outputStyle: 'verbose' as unknown as 'concise' },
      voice: { silenceTimeoutSeconds: 99 as unknown as 5 },
    } as Partial<AppSettings>)
    expect(settings.ai.outputStyle).toBe(DEFAULT_APP_SETTINGS.ai.outputStyle)
    expect(settings.voice.silenceTimeoutSeconds).toBe(5)
  })

  it('syncs output style with standards preset on load', () => {
    const settings = normalizeAppSettings({
      qaTicketStandards: applyQaStandardsPreset('enterprise'),
      ai: { outputStyle: 'concise' },
    } as unknown as Partial<AppSettings>)
    expect(settings.ai.outputStyle).toBe('detailed')
  })
})
