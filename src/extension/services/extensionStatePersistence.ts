import type { ExtensionDraft } from '../types/extensionDraft'
import { saveExtensionDraft } from './extensionDraftService'
import { logger } from '../utils/logger'

const PERSIST_DEBOUNCE_MS = 500

let pendingDraft: ExtensionDraft | null = null
let debounceTimer: ReturnType<typeof setTimeout> | null = null
let lastSerialized = ''

function serializeDraft(draft: ExtensionDraft): string {
  return JSON.stringify({
    description: draft.description,
    view: draft.view,
    workflowView: draft.workflowView,
    ticket: draft.ticket,
    qaContext: draft.qaContext,
    usedAi: draft.usedAi,
    jiraDefaults: draft.jiraDefaults,
    voiceTranscript: draft.voiceTranscript,
  })
}

export function scheduleExtensionStatePersist(draft: ExtensionDraft): void {
  pendingDraft = draft

  if (debounceTimer !== null) {
    clearTimeout(debounceTimer)
  }

  debounceTimer = setTimeout(() => {
    debounceTimer = null
    void flushExtensionStatePersist()
  }, PERSIST_DEBOUNCE_MS)
}

export async function flushExtensionStatePersist(): Promise<void> {
  if (debounceTimer !== null) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }

  if (!pendingDraft) return

  const serialized = serializeDraft(pendingDraft)
  if (serialized === lastSerialized) {
    pendingDraft = null
    return
  }

  lastSerialized = serialized
  const draft = pendingDraft
  pendingDraft = null

  try {
    await saveExtensionDraft(draft)
  } catch (error) {
    logger.warn('Debounced draft flush failed', error)
  }
}

export function resetExtensionStatePersistenceCache(): void {
  lastSerialized = ''
  pendingDraft = null
  if (debounceTimer !== null) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }
}
