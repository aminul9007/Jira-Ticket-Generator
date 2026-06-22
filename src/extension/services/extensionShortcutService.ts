export const OPEN_ASSISTANT_COMMAND = 'open-assistant'

export const EXECUTE_ACTION_COMMAND = '_execute_action'

export const OPEN_ASSISTANT_COMMAND_LABEL = 'Open QA Bug Assistant'

export const SUGGESTED_OPEN_ASSISTANT_SHORTCUT = 'Ctrl+Shift+B'

export const SUGGESTED_OPEN_ASSISTANT_SHORTCUT_MAC = 'Command+Shift+B'

export interface ExtensionCommandInfo {
  name: string
  description: string
  shortcut: string
  isAssigned: boolean
}

export type EffectiveShortcutSource = 'open-assistant' | '_execute_action' | 'none'

export interface EffectiveAssistantShortcut {
  label: string
  shortcut: string
  isAssigned: boolean
  source: EffectiveShortcutSource
  /** Human-readable note shown under the shortcut. */
  statusMessage: string
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

function mapCommand(command: chrome.commands.Command): ExtensionCommandInfo {
  const name = command.name ?? ''
  const description =
    name === EXECUTE_ACTION_COMMAND
      ? 'Activate extension (toolbar action)'
      : command.description?.trim() || OPEN_ASSISTANT_COMMAND_LABEL

  return {
    name,
    description,
    shortcut: command.shortcut?.trim() ?? '',
    isAssigned: Boolean(command.shortcut?.trim()),
  }
}

export async function loadExtensionCommands(): Promise<ExtensionCommandInfo[]> {
  const commands = await readCommands()
  return commands.filter((command) => Boolean(command.name)).map(mapCommand)
}

export function getSuggestedShortcutHint(): string {
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/i.test(navigator.platform)
  return isMac ? SUGGESTED_OPEN_ASSISTANT_SHORTCUT_MAC : SUGGESTED_OPEN_ASSISTANT_SHORTCUT
}

/**
 * Chrome exposes both `open-assistant` (custom) and `_execute_action` (built-in).
 * Users often assign a key to one but not the other — merge into one display value.
 */
export function resolveEffectiveAssistantShortcut(
  commands: ExtensionCommandInfo[],
): EffectiveAssistantShortcut {
  const openAssistant = commands.find((command) => command.name === OPEN_ASSISTANT_COMMAND)
  const executeAction = commands.find((command) => command.name === EXECUTE_ACTION_COMMAND)

  if (openAssistant?.isAssigned) {
    return {
      label: OPEN_ASSISTANT_COMMAND_LABEL,
      shortcut: openAssistant.shortcut,
      isAssigned: true,
      source: 'open-assistant',
      statusMessage: 'This shortcut opens the QA Bug Assistant popup.',
    }
  }

  if (executeAction?.isAssigned) {
    return {
      label: OPEN_ASSISTANT_COMMAND_LABEL,
      shortcut: executeAction.shortcut,
      isAssigned: true,
      source: '_execute_action',
      statusMessage:
        'Shortcut is assigned via Chrome’s “Activate extension” action and opens the popup.',
    }
  }

  return {
    label: OPEN_ASSISTANT_COMMAND_LABEL,
    shortcut: '',
    isAssigned: false,
    source: 'none',
    statusMessage: 'No shortcut assigned yet. Click Customize Shortcut to choose a key combination.',
  }
}

export async function getEffectiveAssistantShortcut(): Promise<EffectiveAssistantShortcut> {
  const commands = await loadExtensionCommands()
  return resolveEffectiveAssistantShortcut(commands)
}

/** @deprecated Use getEffectiveAssistantShortcut instead. */
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
