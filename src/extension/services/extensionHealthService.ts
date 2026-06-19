import type { AppSettings } from '../../types/appSettings'
import { getSpeechRecognitionConstructor } from '../../utils/voiceTranscript'
import { buildJiraConnectionConfig } from '../../utils/buildJiraConnectionConfig'
import { getApiBaseUrl, resolveExtensionApiBaseUrl } from '../config/extensionConfig'
import { isServerJiraConfigured } from './extensionBootstrapService'
import { loadExtensionAppSettings } from './extensionSettingsService'
import { isExtensionJiraReady } from './extensionJiraTestService'

export type HealthWarningCode =
  | 'settings_unavailable'
  | 'jira_not_configured'
  | 'api_unreachable'
  | 'ai_unreachable'
  | 'voice_not_supported'
  | 'permissions_missing'

export interface HealthWarning {
  code: HealthWarningCode
  message: string
}

function hasStorageAccess(): boolean {
  return typeof chrome !== 'undefined' && Boolean(chrome.storage?.local)
}

function hasLocalJiraCredentials(jira: AppSettings['jira']): boolean {
  return Boolean(buildJiraConnectionConfig(jira))
}

/** Pre-release readiness checks — non-blocking warnings for the popup. */
export async function runExtensionHealthChecks(
  settings?: AppSettings,
): Promise<HealthWarning[]> {
  const warnings: HealthWarning[] = []

  if (!hasStorageAccess()) {
    warnings.push({
      code: 'permissions_missing',
      message: 'Extension storage is unavailable. Reload the extension and try again.',
    })
    return warnings
  }

  if (!getSpeechRecognitionConstructor()) {
    warnings.push({
      code: 'voice_not_supported',
      message: 'Voice input is not supported in this browser.',
    })
  }

  let resolvedSettings = settings
  try {
    resolvedSettings ??= await loadExtensionAppSettings()
  } catch {
    warnings.push({
      code: 'settings_unavailable',
      message: 'Settings could not be loaded. Defaults will be used until storage is available.',
    })
    return warnings
  }

  const apiBaseUrl = await resolveExtensionApiBaseUrl()
  if (!apiBaseUrl) {
    warnings.push({
      code: 'api_unreachable',
      message: `API backend is not running. Start it with "npm run api:dev" (${getApiBaseUrl()}).`,
    })
    warnings.push({
      code: 'ai_unreachable',
      message: 'AI ticket generation and Jira creation require the API backend.',
    })
    return warnings
  }

  const serverJiraConfigured = await isServerJiraConfigured()
  const localJiraConfigured = hasLocalJiraCredentials(resolvedSettings.jira)

  if (!serverJiraConfigured && !localJiraConfigured) {
    warnings.push({
      code: 'jira_not_configured',
      message: 'Jira is not configured yet. Add credentials in server/.env or extension Settings.',
    })
    return warnings
  }

  const jiraReady = await isExtensionJiraReady(resolvedSettings.jira)
  if (!jiraReady) {
    warnings.push({
      code: 'jira_not_configured',
      message:
        'Jira MCP is not ready. Check server/.env credentials and run Test API & MCP Connection in Settings.',
    })
  }

  return warnings
}
