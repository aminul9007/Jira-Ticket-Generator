import type { TicketDefaultSettings } from '../../types/appSettings'
import {
  EMPTY_EXTENSION_JIRA_DEFAULTS,
  type ExtensionJiraDefaults,
} from '../types/extensionJiraDefaults'

const EXTENSION_JIRA_DEFAULTS_KEY = 'qa-bug-assistant-jira-defaults'

function readChromeStorageLocal(): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(EXTENSION_JIRA_DEFAULTS_KEY, (result) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message))
        return
      }
      resolve(result)
    })
  })
}

function writeChromeStorageLocal(value: ExtensionJiraDefaults): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [EXTENSION_JIRA_DEFAULTS_KEY]: value }, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message))
        return
      }
      resolve()
    })
  })
}

function normalizeIssueType(value: unknown): ExtensionJiraDefaults['issueType'] {
  if (value === 'Bug' || value === 'Task' || value === 'Story') {
    return value
  }
  return EMPTY_EXTENSION_JIRA_DEFAULTS.issueType
}

export function normalizeExtensionJiraDefaults(raw: unknown): ExtensionJiraDefaults | null {
  if (!raw || typeof raw !== 'object') return null

  const record = raw as Partial<ExtensionJiraDefaults>
  return {
    projectKey:
      typeof record.projectKey === 'string'
        ? record.projectKey.trim().toUpperCase()
        : '',
    issueType: normalizeIssueType(record.issueType),
    assignee: typeof record.assignee === 'string' ? record.assignee.trim() : '',
    reporter: typeof record.reporter === 'string' ? record.reporter.trim() : '',
  }
}

function normalizeDefaults(raw: unknown): ExtensionJiraDefaults | null {
  return normalizeExtensionJiraDefaults(raw)
}

/** Load last-used Jira field selections, falling back to app ticket defaults. */
export async function loadExtensionJiraDefaults(
  settingsFallback?: TicketDefaultSettings,
): Promise<ExtensionJiraDefaults> {
  try {
    const stored = await readChromeStorageLocal()
    const parsed = normalizeDefaults(stored[EXTENSION_JIRA_DEFAULTS_KEY])
    if (parsed) {
      return {
        projectKey: parsed.projectKey || settingsFallback?.projectKey || '',
        issueType: parsed.issueType || settingsFallback?.issueType || 'Bug',
        assignee: parsed.assignee || settingsFallback?.assignee || '',
        reporter: parsed.reporter,
      }
    }
  } catch {
    // Fall back when storage is unavailable.
  }

  return {
    projectKey: settingsFallback?.projectKey ?? '',
    issueType: settingsFallback?.issueType ?? EMPTY_EXTENSION_JIRA_DEFAULTS.issueType,
    assignee: settingsFallback?.assignee ?? '',
    reporter: '',
  }
}

export async function saveExtensionJiraDefaults(
  defaults: ExtensionJiraDefaults,
): Promise<void> {
  const normalized = normalizeDefaults(defaults)
  if (!normalized) return

  try {
    await writeChromeStorageLocal(normalized)
  } catch {
    // Non-fatal — creation can still succeed without persisting defaults.
  }
}
