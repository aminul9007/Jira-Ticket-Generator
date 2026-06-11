import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { DEFAULT_APP_SETTINGS } from '../data/defaultAppSettings'
import type { AppSettings } from '../types/appSettings'
import { normalizeTicketTemplateSettings } from '../../shared/ticketTemplate'
import { loadAppSettings, normalizeAppSettings, saveAppSettings } from '../utils/appSettingsStorage'
import { AppSettingsContext, type AppSettingsContextValue } from './AppSettings'

function mergeSettings(prev: AppSettings, patch: Partial<AppSettings>): AppSettings {
  return normalizeAppSettings({
    ai: { ...prev.ai, ...patch.ai },
    voice: { ...prev.voice, ...patch.voice },
    jira: { ...prev.jira, ...patch.jira },
    ticketDefaults: { ...prev.ticketDefaults, ...patch.ticketDefaults },
    ticketTemplate: { ...prev.ticketTemplate, ...patch.ticketTemplate },
    data: { ...prev.data, ...patch.data },
  })
}

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(loadAppSettings)

  const updateSettings = useCallback(
    (patch: Partial<AppSettings> | ((prev: AppSettings) => Partial<AppSettings>)) => {
      setSettings((prev) => {
        const resolved = typeof patch === 'function' ? patch(prev) : patch
        const next = mergeSettings(prev, resolved)
        saveAppSettings(next)
        return next
      })
    },
    [],
  )

  const updateAi = useCallback(
    (patch: Partial<AppSettings['ai']>) => {
      updateSettings((prev) => ({ ai: { ...prev.ai, ...patch } }))
    },
    [updateSettings],
  )

  const updateVoice = useCallback(
    (patch: Partial<AppSettings['voice']>) => {
      updateSettings((prev) => ({ voice: { ...prev.voice, ...patch } }))
    },
    [updateSettings],
  )

  const updateJira = useCallback(
    (patch: Partial<AppSettings['jira']>) => {
      updateSettings((prev) => ({ jira: { ...prev.jira, ...patch } }))
    },
    [updateSettings],
  )

  const updateTicketDefaults = useCallback(
    (patch: Partial<AppSettings['ticketDefaults']>) => {
      updateSettings((prev) => ({
        ticketDefaults: { ...prev.ticketDefaults, ...patch },
      }))
    },
    [updateSettings],
  )

  const updateTicketTemplate = useCallback(
    (patch: Partial<AppSettings['ticketTemplate']>) => {
      updateSettings((prev) => ({
        ticketTemplate: normalizeTicketTemplateSettings({
          ...prev.ticketTemplate,
          ...patch,
          fields: { ...prev.ticketTemplate.fields, ...patch.fields },
        }),
      }))
    },
    [updateSettings],
  )

  const updateData = useCallback(
    (patch: Partial<AppSettings['data']>) => {
      updateSettings((prev) => ({ data: { ...prev.data, ...patch } }))
    },
    [updateSettings],
  )

  const resetSettings = useCallback(() => {
    const next = normalizeAppSettings(DEFAULT_APP_SETTINGS)
    saveAppSettings(next)
    setSettings(next)
  }, [])

  const value = useMemo<AppSettingsContextValue>(
    () => ({
      settings,
      updateSettings,
      updateAi,
      updateVoice,
      updateJira,
      updateTicketDefaults,
      updateTicketTemplate,
      updateData,
      resetSettings,
    }),
    [
      settings,
      updateSettings,
      updateAi,
      updateVoice,
      updateJira,
      updateTicketDefaults,
      updateTicketTemplate,
      updateData,
      resetSettings,
    ],
  )

  return (
    <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>
  )
}
