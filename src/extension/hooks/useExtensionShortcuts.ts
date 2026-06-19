import { useCallback, useEffect, useState } from 'react'
import {
  getOpenAssistantShortcut,
  loadExtensionCommands,
  openExtensionShortcutSettings,
  type ExtensionCommandInfo,
} from '../services/extensionShortcutService'
import { logger } from '../utils/logger'

interface UseExtensionShortcutsResult {
  loaded: boolean
  commands: ExtensionCommandInfo[]
  openAssistant: ExtensionCommandInfo | null
  errorMessage: string | null
  refresh: () => Promise<void>
  openShortcutSettings: () => Promise<void>
}

export function useExtensionShortcuts(): UseExtensionShortcutsResult {
  const [loaded, setLoaded] = useState(false)
  const [commands, setCommands] = useState<ExtensionCommandInfo[]>([])
  const [openAssistant, setOpenAssistant] = useState<ExtensionCommandInfo | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      const [allCommands, assistantCommand] = await Promise.all([
        loadExtensionCommands(),
        getOpenAssistantShortcut(),
      ])
      setCommands(allCommands)
      setOpenAssistant(assistantCommand)
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
    commands,
    openAssistant,
    errorMessage,
    refresh,
    openShortcutSettings,
  }
}
