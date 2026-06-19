import type { AppSettings } from '../../types/appSettings'
import { getSpeechRecognitionConstructor } from '../../utils/voiceTranscript'
import { getApiBaseUrl } from '../config/extensionConfig'
import { loadExtensionAppSettings } from './extensionSettingsService'

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

function isJiraConfigured(settings: AppSettings): boolean {
  return Boolean(
    settings.jira.domain.trim() &&
      settings.jira.email.trim() &&
      settings.jira.apiToken.trim(),
  )
}

function hasStorageAccess(): boolean {
  return typeof chrome !== 'undefined' && Boolean(chrome.storage?.local)
}

async function isApiReachable(): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeoutId = window.setTimeout(() => controller.abort(), 5000)
    const response = await fetch(`${getApiBaseUrl()}/health`, {
      method: 'GET',
      signal: controller.signal,
    })
    window.clearTimeout(timeoutId)
    return response.ok
  } catch {
    return false
  }
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

  if (!isJiraConfigured(resolvedSettings)) {
    warnings.push({
      code: 'jira_not_configured',
      message: 'Jira is not configured yet.',
    })
  }

  const apiOk = await isApiReachable()
  if (!apiOk) {
    warnings.push({
      code: 'api_unreachable',
      message: 'API backend is not reachable. Start the server or update the API URL in settings.',
    })
    warnings.push({
      code: 'ai_unreachable',
      message: 'AI ticket generation may be unavailable until the API backend is running.',
    })
  }

  return warnings
}
