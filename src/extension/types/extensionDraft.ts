import type { GeneratedTicket } from '../../types/bugReport'
import type { ExtractedContext } from '../../types/contextDetection'
import type { ExtensionJiraDefaults } from './extensionJiraDefaults'

export type ExtensionDraftView = 'input' | 'review'

export interface ExtensionDraft {
  description: string
  view: ExtensionDraftView
  workflowView: ExtensionDraftView
  ticket: GeneratedTicket | null
  qaContext: ExtractedContext | null
  usedAi: boolean
  jiraDefaults: ExtensionJiraDefaults | null
  voiceTranscript: string
  includePageTitle: boolean
  updatedAt: number
}

export const EMPTY_EXTENSION_DRAFT: ExtensionDraft = {
  description: '',
  view: 'input',
  workflowView: 'input',
  ticket: null,
  qaContext: null,
  usedAi: false,
  jiraDefaults: null,
  voiceTranscript: '',
  includePageTitle: true,
  updatedAt: 0,
}
