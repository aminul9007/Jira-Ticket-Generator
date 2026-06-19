import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_APP_SETTINGS } from '../../data/defaultAppSettings'
import type {
  AppSettings,
  DefaultIssueType,
  JiraSettings,
  SilenceTimeoutSeconds,
  VoiceLanguage,
} from '../../types/appSettings'
import { clearExtensionDraft } from '../services/extensionDraftService'
import {
  clearExtensionJiraDefaults,
  loadExtensionJiraDefaults,
  saveExtensionJiraDefaults,
} from '../services/extensionJiraDefaultsService'
import {
  loadExtensionAppSettings,
  resetExtensionAppSettings,
  saveExtensionAppSettings,
} from '../services/extensionSettingsService'
import type { ExtensionJiraDefaults } from '../types/extensionJiraDefaults'

interface UseExtensionSettingsResult {
  loaded: boolean
  settings: AppSettings
  defaultReporter: string
  updateJira: (patch: Partial<JiraSettings>) => void
  updateTicketDefaults: (patch: Partial<AppSettings['ticketDefaults']>) => void
  updateVoice: (patch: Partial<AppSettings['voice']>) => void
  setDefaultReporter: (reporter: string) => void
  saveSettings: () => Promise<void>
  reloadSettings: () => Promise<void>
}

export function useExtensionSettings(): UseExtensionSettingsResult {
  const [loaded, setLoaded] = useState(false)
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_APP_SETTINGS)
  const [defaultReporter, setDefaultReporterState] = useState('')

  const reloadSettings = useCallback(async () => {
    const [appSettings, jiraDefaults] = await Promise.all([
      loadExtensionAppSettings(),
      loadExtensionJiraDefaults(),
    ])
    setSettings(appSettings)
    setDefaultReporterState(jiraDefaults.reporter)
    setLoaded(true)
  }, [])

  useEffect(() => {
    void reloadSettings()
  }, [reloadSettings])

  const persistJiraDefaults = useCallback(
    async (nextSettings: AppSettings, reporter: string) => {
      const defaults: ExtensionJiraDefaults = {
        projectKey: nextSettings.ticketDefaults.projectKey,
        issueType: nextSettings.ticketDefaults.issueType,
        assignee: nextSettings.ticketDefaults.assignee,
        reporter,
      }
      await saveExtensionJiraDefaults(defaults)
    },
    [],
  )

  const saveSettings = useCallback(async () => {
    const saved = await saveExtensionAppSettings(settings)
    setSettings(saved)
    await persistJiraDefaults(saved, defaultReporter)
  }, [defaultReporter, persistJiraDefaults, settings])

  const updateJira = useCallback((patch: Partial<JiraSettings>) => {
    setSettings((current) => ({
      ...current,
      jira: { ...current.jira, ...patch },
    }))
  }, [])

  const updateTicketDefaults = useCallback(
    (patch: Partial<AppSettings['ticketDefaults']>) => {
      setSettings((current) => ({
        ...current,
        ticketDefaults: {
          ...current.ticketDefaults,
          ...patch,
          ...(patch.projectKey !== undefined
            ? { projectKey: patch.projectKey.toUpperCase() }
            : {}),
          ...(patch.issueType !== undefined
            ? { issueType: patch.issueType as DefaultIssueType }
            : {}),
        },
      }))
    },
    [],
  )

  const updateVoice = useCallback((patch: Partial<AppSettings['voice']>) => {
    setSettings((current) => ({
      ...current,
      voice: {
        ...current.voice,
        ...patch,
        ...(patch.language !== undefined
          ? { language: patch.language as VoiceLanguage }
          : {}),
        ...(patch.silenceTimeoutSeconds !== undefined
          ? { silenceTimeoutSeconds: patch.silenceTimeoutSeconds as SilenceTimeoutSeconds }
          : {}),
      },
    }))
  }, [])

  const setDefaultReporter = useCallback((reporter: string) => {
    setDefaultReporterState(reporter)
  }, [])

  return {
    loaded,
    settings,
    defaultReporter,
    updateJira,
    updateTicketDefaults,
    updateVoice,
    setDefaultReporter,
    saveSettings,
    reloadSettings,
  }
}

export async function clearExtensionDraftsAndPreferences(): Promise<void> {
  await Promise.all([
    clearExtensionDraft(),
    clearExtensionJiraDefaults(),
    resetExtensionAppSettings(),
  ])
}

export async function resetExtensionPreferencesOnly(): Promise<void> {
  await Promise.all([clearExtensionJiraDefaults(), resetExtensionAppSettings()])
}
