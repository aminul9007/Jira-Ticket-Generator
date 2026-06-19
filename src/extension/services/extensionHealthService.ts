import type { AppSettings } from '../../types/appSettings'
import { getApiBaseUrl } from '../config/extensionConfig'
import { loadExtensionAppSettings } from './extensionSettingsService'

export type HealthWarningCode =
  | 'settings_unavailable'
  | 'jira_not_configured'
  | 'api_unreachable'
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
    const response = await fetch(`${getApiBaseUrl()}/health`, { method: 'GET' })
    return response.ok
  } catch {
    return false
  }
}

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
  }

  return warnings
}
