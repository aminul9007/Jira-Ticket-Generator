import type { CreateJiraIssueResponse } from '../../../shared/jiraApi'
import type { GeneratedTicket } from '../../types/bugReport'
import type { ExtractedContext } from '../../types/contextDetection'
import type { ExtensionDraft } from '../types/extensionDraft'
import type { ExtensionJiraDefaults } from '../types/extensionJiraDefaults'
import {
  INITIAL_EXTENSION_STATE,
  type ExtensionState,
  type ExtensionView,
  type ExtensionVoiceStatus,
  type ExtensionWorkflowView,
} from '../types/extensionState'

export type ExtensionStateAction =
  | { type: 'HYDRATE'; draft: ExtensionDraft }
  | { type: 'SET_DESCRIPTION'; description: string }
  | { type: 'SET_INCLUDE_PAGE_TITLE'; includePageTitle: boolean }
  | { type: 'SET_VIEW'; view: ExtensionView }
  | { type: 'SET_WORKFLOW_VIEW'; workflowView: ExtensionWorkflowView }
  | { type: 'OPEN_SETTINGS' }
  | { type: 'CLOSE_SETTINGS' }
  | { type: 'SET_TICKET'; ticket: GeneratedTicket; qaContext: ExtractedContext; usedAi: boolean }
  | { type: 'UPDATE_TICKET'; ticket: GeneratedTicket }
  | { type: 'SET_JIRA_CONFIG'; jiraConfig: ExtensionJiraDefaults | null }
  | { type: 'SET_VOICE'; status: ExtensionVoiceStatus; transcript?: string }
  | { type: 'GENERATION_START' }
  | { type: 'GENERATION_SUCCESS'; ticket: GeneratedTicket; qaContext: ExtractedContext; usedAi: boolean }
  | { type: 'GENERATION_ERROR'; message: string }
  | { type: 'GENERATION_RESET_ERROR' }
  | { type: 'JIRA_START' }
  | { type: 'JIRA_SUCCESS'; result: CreateJiraIssueResponse }
  | { type: 'JIRA_ERROR'; message: string }
  | { type: 'JIRA_RESET' }
  | { type: 'DISMISS_HEALTH' }
  | { type: 'RESET_WORKFLOW' }

function resolveViewFromDraft(draft: ExtensionDraft): ExtensionView {
  if (draft.ticket && draft.qaContext && draft.workflowView === 'review') {
    return 'review'
  }
  return 'input'
}

export function extensionStateReducer(
  state: ExtensionState,
  action: ExtensionStateAction,
): ExtensionState {
  switch (action.type) {
    case 'HYDRATE': {
      const description =
        action.draft.description.trim() || action.draft.voiceTranscript.trim()
      return {
        ...INITIAL_EXTENSION_STATE,
        hydrated: true,
        input: {
          description,
          includePageTitle: action.draft.includePageTitle ?? true,
        },
        ticket: {
          generated: action.draft.ticket,
          qaContext: action.draft.qaContext,
          usedAi: action.draft.usedAi,
        },
        jiraConfig: action.draft.jiraDefaults,
        voice: {
          status: 'idle',
          transcript: action.draft.voiceTranscript || description,
        },
        ui: {
          ...INITIAL_EXTENSION_STATE.ui,
          view: resolveViewFromDraft(action.draft),
          workflowView: action.draft.workflowView,
        },
      }
    }

    case 'SET_DESCRIPTION':
      return {
        ...state,
        input: { ...state.input, description: action.description },
        voice: {
          ...state.voice,
          transcript: action.description,
        },
      }

    case 'SET_INCLUDE_PAGE_TITLE':
      return {
        ...state,
        input: { ...state.input, includePageTitle: action.includePageTitle },
      }

    case 'SET_VIEW':
      return {
        ...state,
        ui: { ...state.ui, view: action.view },
      }

    case 'SET_WORKFLOW_VIEW':
      return {
        ...state,
        ui: { ...state.ui, workflowView: action.workflowView },
      }

    case 'OPEN_SETTINGS':
      return {
        ...state,
        ui: {
          ...state.ui,
          view: 'settings',
        },
      }

    case 'CLOSE_SETTINGS':
      return {
        ...state,
        ui: {
          ...state.ui,
          view: state.ui.workflowView,
        },
      }

    case 'SET_TICKET':
      return {
        ...state,
        ticket: {
          generated: action.ticket,
          qaContext: action.qaContext,
          usedAi: action.usedAi,
        },
      }

    case 'UPDATE_TICKET':
      return {
        ...state,
        ticket: {
          ...state.ticket,
          generated: action.ticket,
        },
      }

    case 'SET_JIRA_CONFIG':
      return {
        ...state,
        jiraConfig: action.jiraConfig,
      }

    case 'SET_VOICE':
      return {
        ...state,
        voice: {
          status: action.status,
          transcript: action.transcript ?? state.voice.transcript,
        },
      }

    case 'GENERATION_START':
      return {
        ...state,
        ui: {
          ...state.ui,
          generation: { status: 'loading', errorMessage: null },
        },
      }

    case 'GENERATION_SUCCESS':
      return {
        ...state,
        ticket: {
          generated: action.ticket,
          qaContext: action.qaContext,
          usedAi: action.usedAi,
        },
        ui: {
          ...state.ui,
          view: 'review',
          workflowView: 'review',
          generation: { status: 'success', errorMessage: null },
        },
      }

    case 'GENERATION_ERROR':
      return {
        ...state,
        ui: {
          ...state.ui,
          generation: { status: 'error', errorMessage: action.message },
        },
      }

    case 'GENERATION_RESET_ERROR':
      return {
        ...state,
        ui: {
          ...state.ui,
          generation: { status: 'idle', errorMessage: null },
        },
      }

    case 'JIRA_START':
      return {
        ...state,
        ui: {
          ...state.ui,
          jira: { status: 'creating', errorMessage: null, result: null },
        },
      }

    case 'JIRA_SUCCESS':
      return {
        ...state,
        ui: {
          ...state.ui,
          view: 'success',
          jira: { status: 'success', errorMessage: null, result: action.result },
        },
      }

    case 'JIRA_ERROR':
      return {
        ...state,
        ui: {
          ...state.ui,
          jira: { status: 'error', errorMessage: action.message, result: null },
        },
      }

    case 'JIRA_RESET':
      return {
        ...state,
        ui: {
          ...state.ui,
          jira: { status: 'idle', errorMessage: null, result: null },
        },
      }

    case 'DISMISS_HEALTH':
      return {
        ...state,
        ui: { ...state.ui, healthDismissed: true },
      }

    case 'RESET_WORKFLOW':
      return {
        ...INITIAL_EXTENSION_STATE,
        hydrated: true,
      }

    default:
      return state
  }
}

export function extensionStateToDraft(state: ExtensionState): ExtensionDraft {
  const persistView =
    state.ui.view === 'settings' || state.ui.view === 'success'
      ? state.ui.workflowView
      : state.ui.view === 'review'
        ? 'review'
        : 'input'

  return {
    description: state.input.description,
    view: persistView,
    workflowView: state.ui.workflowView,
    ticket: state.ticket.generated,
    qaContext: state.ticket.qaContext,
    usedAi: state.ticket.usedAi,
    jiraDefaults: state.jiraConfig,
    voiceTranscript: state.voice.transcript || state.input.description,
    includePageTitle: state.input.includePageTitle,
    updatedAt: Date.now(),
  }
}
