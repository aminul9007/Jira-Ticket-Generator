import { describe, expect, it } from 'vitest'
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
  })

  it('preserves valid voice and AI overrides', () => {
    const settings = normalizeAppSettings({
      ai: { outputStyle: 'concise', autoGenerateAfterVoice: false },
      voice: { language: 'en-GB', silenceTimeoutSeconds: 10 },
      data: { historyRetention: 100 },
    } as Partial<AppSettings>)
    expect(settings.ai.outputStyle).toBe('concise')
    expect(settings.ai.autoGenerateAfterVoice).toBe(false)
    expect(settings.voice.language).toBe('en-GB')
    expect(settings.data.historyRetention).toBe(100)
  })

  it('falls back invalid enums to defaults', () => {
    const settings = normalizeAppSettings({
      ai: { outputStyle: 'verbose' as unknown as 'concise' },
      voice: { silenceTimeoutSeconds: 99 as unknown as 5 },
    } as Partial<AppSettings>)
    expect(settings.ai.outputStyle).toBe(DEFAULT_APP_SETTINGS.ai.outputStyle)
    expect(settings.voice.silenceTimeoutSeconds).toBe(5)
  })
})
