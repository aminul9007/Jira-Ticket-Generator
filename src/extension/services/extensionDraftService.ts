import type { GeneratedTicket } from '../../types/bugReport'
import type { ExtractedContext } from '../../types/contextDetection'
import {
  EMPTY_EXTENSION_DRAFT,
  type ExtensionDraft,
  type ExtensionDraftView,
} from '../types/extensionDraft'
import { normalizeExtensionJiraDefaults } from './extensionJiraDefaultsService'
import { logger } from '../utils/logger'

const EXTENSION_DRAFT_KEY = 'qa-bug-assistant-extension-draft'

function readStorage(): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(EXTENSION_DRAFT_KEY, (result) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message))
        return
      }
      resolve(result)
    })
  })
}

function writeStorage(draft: ExtensionDraft): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [EXTENSION_DRAFT_KEY]: draft }, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message))
        return
      }
      resolve()
    })
  })
}

function removeStorage(): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.remove(EXTENSION_DRAFT_KEY, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message))
        return
      }
      resolve()
    })
  })
}

function isGeneratedTicket(value: unknown): value is GeneratedTicket {
  if (!value || typeof value !== 'object') return false
  const record = value as Partial<GeneratedTicket>
  return (
    typeof record.title === 'string' &&
    Array.isArray(record.stepsToReproduce) &&
    typeof record.issueSummary === 'string'
  )
}

function isExtractedContext(value: unknown): value is ExtractedContext {
  if (!value || typeof value !== 'object') return false
  const record = value as Partial<ExtractedContext>
  return (
    typeof record.environment === 'object' &&
    typeof record.browser === 'object' &&
    typeof record.os === 'object' &&
    typeof record.device === 'object'
  )
}

function normalizeDraftView(value: unknown): ExtensionDraftView {
  return value === 'review' ? 'review' : 'input'
}

function normalizeDraft(raw: unknown): ExtensionDraft | null {
  if (!raw || typeof raw !== 'object') return null

  const record = raw as Partial<ExtensionDraft>
  const ticket = isGeneratedTicket(record.ticket) ? record.ticket : null
  const qaContext = isExtractedContext(record.qaContext) ? record.qaContext : null
  const view = normalizeDraftView(record.view)
  const workflowView = normalizeDraftView(record.workflowView ?? record.view)
  const jiraDefaults = record.jiraDefaults
    ? normalizeExtensionJiraDefaults(record.jiraDefaults)
    : null

  const description = typeof record.description === 'string' ? record.description : ''
  const voiceTranscript =
    typeof record.voiceTranscript === 'string' ? record.voiceTranscript : description

  return {
    description,
    view: ticket && qaContext ? view : 'input',
    workflowView: ticket && qaContext ? workflowView : 'input',
    ticket,
    qaContext,
    usedAi: Boolean(record.usedAi),
    jiraDefaults,
    voiceTranscript,
    updatedAt: typeof record.updatedAt === 'number' ? record.updatedAt : 0,
  }
}

export async function loadExtensionDraft(): Promise<ExtensionDraft> {
  try {
    const stored = await readStorage()
    const parsed = normalizeDraft(stored[EXTENSION_DRAFT_KEY])
    if (parsed) return parsed
  } catch (error) {
    logger.warn('Failed to load extension draft', error)
  }

  return { ...EMPTY_EXTENSION_DRAFT }
}

export async function saveExtensionDraft(draft: ExtensionDraft): Promise<void> {
  const normalized = normalizeDraft(draft)
  if (!normalized) return

  const isEmpty =
    !normalized.description.trim() &&
    !normalized.ticket &&
    !normalized.qaContext &&
    !normalized.jiraDefaults &&
    !normalized.voiceTranscript.trim()

  try {
    if (isEmpty) {
      await removeStorage()
      return
    }
    await writeStorage(normalized)
  } catch (error) {
    logger.warn('Failed to save extension draft', error)
  }
}

export async function clearExtensionDraft(): Promise<void> {
  try {
    await removeStorage()
  } catch (error) {
    logger.warn('Failed to clear extension draft', error)
  }
}
