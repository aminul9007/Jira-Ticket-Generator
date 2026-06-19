import type { CreateJiraIssueResponse } from '../../../shared/jiraApi'
import type { GeneratedTicket } from '../../types/bugReport'
import type { ExtractedContext } from '../../types/contextDetection'
import type { ExtensionJiraDefaults } from './extensionJiraDefaults'

export type ExtensionView = 'input' | 'review' | 'success' | 'settings'

export type ExtensionWorkflowView = 'input' | 'review'

export type ExtensionGenerationStatus = 'idle' | 'loading' | 'success' | 'error'

export type ExtensionJiraStatus = 'idle' | 'creating' | 'success' | 'error'

export type ExtensionVoiceStatus =
  | 'idle'
  | 'listening'
  | 'processing'
  | 'completed'
  | 'error'

export interface ExtensionInputState {
  description: string
}

export interface ExtensionTicketState {
  generated: GeneratedTicket | null
  qaContext: ExtractedContext | null
  usedAi: boolean
}

export interface ExtensionVoiceState {
  status: ExtensionVoiceStatus
  /** Backup transcript segment for recovery (mirrors description during voice). */
  transcript: string
}

export interface ExtensionGenerationState {
  status: ExtensionGenerationStatus
  errorMessage: string | null
}

export interface ExtensionJiraUiState {
  status: ExtensionJiraStatus
  errorMessage: string | null
  result: CreateJiraIssueResponse | null
}

export interface ExtensionUiState {
  view: ExtensionView
  /** Screen to restore after closing settings. */
  workflowView: ExtensionWorkflowView
  healthDismissed: boolean
  generation: ExtensionGenerationState
  jira: ExtensionJiraUiState
}

/** Single source of truth for extension popup workflow state. */
export interface ExtensionState {
  hydrated: boolean
  input: ExtensionInputState
  ticket: ExtensionTicketState
  jiraConfig: ExtensionJiraDefaults | null
  voice: ExtensionVoiceState
  ui: ExtensionUiState
}

export const INITIAL_EXTENSION_STATE: ExtensionState = {
  hydrated: false,
  input: { description: '' },
  ticket: { generated: null, qaContext: null, usedAi: false },
  jiraConfig: null,
  voice: { status: 'idle', transcript: '' },
  ui: {
    view: 'input',
    workflowView: 'input',
    healthDismissed: false,
    generation: { status: 'idle', errorMessage: null },
    jira: { status: 'idle', errorMessage: null, result: null },
  },
}
