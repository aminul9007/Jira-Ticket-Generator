import { DEFAULT_APP_SETTINGS } from '../../data/defaultAppSettings'
import type { AppSettings } from '../../types/appSettings'
import type { AiGenerationContextSource } from '../../ai/services/generationContextService'
import { normalizeAppSettings } from '../../utils/appSettingsStorage'
import { logger } from '../utils/logger'

const EXTENSION_SETTINGS_KEY = 'qa-bug-assistant-app-settings'

function readChromeStorageLocal(): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(EXTENSION_SETTINGS_KEY, (result) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message))
        return
      }
      resolve(result)
    })
  })
}

function writeChromeStorageLocal(settings: AppSettings): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [EXTENSION_SETTINGS_KEY]: settings }, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message))
        return
      }
      resolve()
    })
  })
}

function removeChromeStorageLocal(): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.remove(EXTENSION_SETTINGS_KEY, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message))
        return
      }
      resolve()
    })
  })
}

/** Load extension settings from chrome.storage with normalized defaults. */
export async function loadExtensionAppSettings(): Promise<AppSettings> {
  try {
    const stored = await readChromeStorageLocal()
    const raw = stored[EXTENSION_SETTINGS_KEY]
    if (raw && typeof raw === 'object') {
      return normalizeAppSettings(raw as Partial<AppSettings>)
    }
  } catch (error) {
    logger.warn('Failed to load extension settings', error)
  }

  return DEFAULT_APP_SETTINGS
}

/** Persist extension settings to chrome.storage.local. */
export async function saveExtensionAppSettings(
  settings: AppSettings,
): Promise<AppSettings> {
  const normalized = normalizeAppSettings(settings)

  try {
    await writeChromeStorageLocal(normalized)
    logger.info('Extension settings saved')
    return normalized
  } catch (error) {
    logger.error('Failed to save extension settings', error)
    throw error
  }
}

/** Reset extension app settings to defaults. */
export async function resetExtensionAppSettings(): Promise<AppSettings> {
  try {
    await removeChromeStorageLocal()
    logger.info('Extension app settings reset')
  } catch (error) {
    logger.warn('Failed to reset extension app settings', error)
  }

  return DEFAULT_APP_SETTINGS
}

/** Context source for extension — no web localStorage history or feedback. */
export function createExtensionContextSource(
  settings: AppSettings,
): AiGenerationContextSource {
  return {
    loadAppSettings: () => settings,
    getTicketHistory: () => [],
    loadTicketFeedback: () => [],
  }
}
