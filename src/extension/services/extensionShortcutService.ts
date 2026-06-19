export const OPEN_ASSISTANT_COMMAND = 'open-assistant'

export const OPEN_ASSISTANT_COMMAND_LABEL = 'Open QA Bug Assistant'

export const SUGGESTED_OPEN_ASSISTANT_SHORTCUT = 'Ctrl+Shift+B'

export const SUGGESTED_OPEN_ASSISTANT_SHORTCUT_MAC = 'Command+Shift+B'

export interface ExtensionCommandInfo {
  name: string
  description: string
  shortcut: string
  isAssigned: boolean
}

function readCommands(): Promise<chrome.commands.Command[]> {
  return new Promise((resolve, reject) => {
    if (!chrome.commands?.getAll) {
      reject(new Error('Keyboard shortcuts are not available in this browser.'))
      return
    }

    chrome.commands.getAll((commands) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message))
        return
      }
      resolve(commands)
    })
  })
}

/** Normalize Chrome shortcut strings for display in the popup. */
export function formatShortcutLabel(shortcut: string | undefined): string {
  if (!shortcut?.trim()) return 'Not assigned'

  return shortcut
    .replace(/MacCtrl/gi, 'Cmd')
    .replace(/Command/gi, 'Cmd')
    .replace(/\+/g, ' + ')
}

export async function loadExtensionCommands(): Promise<ExtensionCommandInfo[]> {
  const commands = await readCommands()

  return commands
    .filter((command) => Boolean(command.name))
    .map((command) => ({
      name: command.name ?? '',
      description: command.description?.trim() || OPEN_ASSISTANT_COMMAND_LABEL,
      shortcut: command.shortcut?.trim() ?? '',
      isAssigned: Boolean(command.shortcut?.trim()),
    }))
}

export async function getOpenAssistantShortcut(): Promise<ExtensionCommandInfo | null> {
  const commands = await loadExtensionCommands()
  return commands.find((command) => command.name === OPEN_ASSISTANT_COMMAND) ?? null
}

/** Open Chrome's extension shortcut configuration page. */
export function openExtensionShortcutSettings(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!chrome.tabs?.create) {
      reject(new Error('Unable to open shortcut settings in this browser.'))
      return
    }

    chrome.tabs.create({ url: 'chrome://extensions/shortcuts' }, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message))
        return
      }
      resolve()
    })
  })
}

export function getSuggestedShortcutHint(): string {
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/i.test(navigator.platform)
  return isMac ? SUGGESTED_OPEN_ASSISTANT_SHORTCUT_MAC : SUGGESTED_OPEN_ASSISTANT_SHORTCUT
}
