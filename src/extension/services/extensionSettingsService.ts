import { DEFAULT_APP_SETTINGS } from '../../data/defaultAppSettings'
import type { AppSettings } from '../../types/appSettings'
import type { AiGenerationContextSource } from '../../ai/services/generationContextService'

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

/** Load extension settings from chrome.storage with defaults fallback. */
export async function loadExtensionAppSettings(): Promise<AppSettings> {
  try {
    const stored = await readChromeStorageLocal()
    const raw = stored[EXTENSION_SETTINGS_KEY]
    if (raw && typeof raw === 'object') {
      return { ...DEFAULT_APP_SETTINGS, ...(raw as AppSettings) }
    }
  } catch {
    // Fall back to defaults when storage is unavailable.
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
