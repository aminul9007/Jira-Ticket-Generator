import type { ExtensionBootstrapResponse } from '../../../shared/extensionBootstrap'
import type { AppSettings } from '../../types/appSettings'
import { getApiBaseUrl, resolveExtensionApiBaseUrl } from '../config/extensionConfig'
import {
  loadExtensionAppSettings,
  saveExtensionAppSettings,
} from './extensionSettingsService'
import { saveExtensionJiraDefaults } from './extensionJiraDefaultsService'
import { logger } from '../utils/logger'

async function fetchBootstrap(baseUrl: string): Promise<ExtensionBootstrapResponse | null> {
  try {
    const controller = new AbortController()
    const timeoutId = globalThis.setTimeout(() => controller.abort(), 5000)
    const response = await fetch(`${baseUrl}/api/config/bootstrap`, {
      method: 'GET',
      signal: controller.signal,
    })
    globalThis.clearTimeout(timeoutId)

    if (!response.ok) return null
    return (await response.json()) as ExtensionBootstrapResponse
  } catch {
    return null
  }
}

function mergeBootstrapSettings(
  current: AppSettings,
  bootstrap: ExtensionBootstrapResponse,
): AppSettings {
  return {
    ...current,
    jira: {
      ...current.jira,
      domain: current.jira.domain.trim() || bootstrap.jira.domain.trim(),
      email: current.jira.email.trim() || bootstrap.jira.email.trim(),
    },
    ticketDefaults: {
      ...current.ticketDefaults,
      projectKey:
        current.ticketDefaults.projectKey.trim() || bootstrap.ticketDefaults.projectKey.trim(),
      issueType:
        current.ticketDefaults.issueType || (bootstrap.ticketDefaults.issueType as AppSettings['ticketDefaults']['issueType']),
    },
  }
}

/** Pull Jira domain, email, and ticket defaults from the API server (server/.env). */
export async function syncExtensionSettingsFromServer(): Promise<AppSettings | null> {
  const baseUrl = await resolveExtensionApiBaseUrl()
  if (!baseUrl) return null

  const bootstrap = await fetchBootstrap(baseUrl)
  if (!bootstrap) return null

  const current = await loadExtensionAppSettings()
  const merged = mergeBootstrapSettings(current, bootstrap)

  const changed =
    merged.jira.domain !== current.jira.domain ||
    merged.jira.email !== current.jira.email ||
    merged.ticketDefaults.projectKey !== current.ticketDefaults.projectKey ||
    merged.ticketDefaults.issueType !== current.ticketDefaults.issueType

  if (changed) {
    await saveExtensionAppSettings(merged)
    if (merged.ticketDefaults.projectKey.trim()) {
      await saveExtensionJiraDefaults({
        projectKey: merged.ticketDefaults.projectKey,
        issueType: merged.ticketDefaults.issueType,
        assignee: merged.ticketDefaults.assignee,
        reporter: '',
      })
    }
    logger.info('Extension settings synced from API server')
  }

  return merged
}

export async function isServerJiraConfigured(): Promise<boolean> {
  const baseUrl = (await resolveExtensionApiBaseUrl()) ?? getApiBaseUrl()
  const bootstrap = await fetchBootstrap(baseUrl)
  return Boolean(bootstrap?.jira.configured)
}
