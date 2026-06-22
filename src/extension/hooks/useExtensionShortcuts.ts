import { useCallback, useEffect, useState } from 'react'
import {
  getEffectiveAssistantShortcut,
  openExtensionShortcutSettings,
  type EffectiveAssistantShortcut,
} from '../services/extensionShortcutService'
import { logger } from '../utils/logger'

interface UseExtensionShortcutsResult {
  loaded: boolean
  effectiveShortcut: EffectiveAssistantShortcut | null
  errorMessage: string | null
  refresh: () => Promise<void>
  openShortcutSettings: () => Promise<void>
}

export function useExtensionShortcuts(): UseExtensionShortcutsResult {
  const [loaded, setLoaded] = useState(false)
  const [effectiveShortcut, setEffectiveShortcut] = useState<EffectiveAssistantShortcut | null>(
    null,
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      const shortcut = await getEffectiveAssistantShortcut()
      setEffectiveShortcut(shortcut)
      setErrorMessage(null)
    } catch (error) {
      logger.warn('Failed to load extension shortcuts', error)
      setErrorMessage('Could not read keyboard shortcuts.')
    } finally {
      setLoaded(true)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const openShortcutSettings = useCallback(async () => {
    try {
      await openExtensionShortcutSettings()
      setErrorMessage(null)
    } catch (error) {
      logger.warn('Failed to open shortcut settings', error)
      setErrorMessage(
        'Open chrome://extensions/shortcuts in a new tab to customize your shortcut.',
      )
    }
  }, [])

  return {
    loaded,
    effectiveShortcut,
    errorMessage,
    refresh,
    openShortcutSettings,
  }
}
