import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import type { TicketContext } from '../../../shared/generation/types'
import { buildFormValuesFromGenerationInput } from '../../services/ticketGeneration/buildFormValuesFromInput'
import { buildJiraCreatePayload } from '../../utils/buildJiraCreatePayload'
import { analytics } from '../services/analytics'
import { clearExtensionDraft, loadExtensionDraft } from '../services/extensionDraftService'
import {
  runExtensionHealthChecks,
  type HealthWarning,
} from '../services/extensionHealthService'
import { loadExtensionAppSettings } from '../services/extensionSettingsService'
import { saveExtensionJiraDefaults } from '../services/extensionJiraDefaultsService'
import {
  resilientCreateJiraIssue,
  resilientGenerateExtensionTicket,
} from '../services/resilientExtensionApi'
import {
  extensionStateReducer,
  extensionStateToDraft,
} from '../state/extensionStateReducer'
import {
  flushExtensionStatePersist,
  resetExtensionStatePersistenceCache,
  scheduleExtensionStatePersist,
} from '../services/extensionStatePersistence'
import { INITIAL_EXTENSION_STATE, type ExtensionVoiceStatus } from '../types/extensionState'
import type { ExtensionJiraDefaults } from '../types/extensionJiraDefaults'
import { RequestLock } from '../utils/requestLock'
import { logger } from '../utils/logger'

export function useExtensionStateManager(browserContext: TicketContext) {
  const [state, dispatch] = useReducer(extensionStateReducer, INITIAL_EXTENSION_STATE)
  const [healthWarnings, setHealthWarnings] = useState<HealthWarning[]>([])
  const lastJiraFieldsRef = useRef<ExtensionJiraDefaults | null>(null)
  const generationLock = useRef(new RequestLock())
  const jiraLock = useRef(new RequestLock())

  useEffect(() => {
    analytics.track('popup_opened')

    void (async () => {
      const [draft, warnings] = await Promise.all([
        loadExtensionDraft(),
        runExtensionHealthChecks(),
      ])
      dispatch({ type: 'HYDRATE', draft })
      setHealthWarnings(warnings)
    })()
  }, [])

  useEffect(() => {
    if (!state.hydrated) return

    scheduleExtensionStatePersist(extensionStateToDraft(state))
  }, [state])

  useEffect(() => {
    if (!state.hydrated) return

    const flushOnHide = () => {
      if (document.visibilityState === 'hidden') {
        void flushExtensionStatePersist()
      }
    }

    const flushOnUnload = () => {
      void flushExtensionStatePersist()
    }

    document.addEventListener('visibilitychange', flushOnHide)
    window.addEventListener('pagehide', flushOnUnload)

    return () => {
      document.removeEventListener('visibilitychange', flushOnHide)
      window.removeEventListener('pagehide', flushOnUnload)
      void flushExtensionStatePersist()
    }
  }, [state.hydrated])

  const setDescription = useCallback((description: string) => {
    dispatch({ type: 'SET_DESCRIPTION', description })
    if (state.ui.generation.status === 'error') {
      dispatch({ type: 'GENERATION_RESET_ERROR' })
    }
  }, [state.ui.generation.status])

  const setVoiceStatus = useCallback((status: ExtensionVoiceStatus, transcript?: string) => {
    dispatch({ type: 'SET_VOICE', status, transcript })
  }, [])

  const generateTicket = useCallback(async () => {
    await generationLock.current.run(async () => {
      dispatch({ type: 'GENERATION_START' })

      try {
        const input = { description: state.input.description, context: browserContext }
        const formValues = buildFormValuesFromGenerationInput(input)
        const result = await resilientGenerateExtensionTicket(input)

        dispatch({
          type: 'GENERATION_SUCCESS',
          ticket: result.ticket,
          qaContext: formValues.qaContext,
          usedAi: result.usedAi,
        })
        analytics.track('ticket_generated', { usedAi: result.usedAi })
      } catch (error) {
        logger.error('Ticket generation failed', error)
        dispatch({
          type: 'GENERATION_ERROR',
          message: 'Unable to generate ticket. Check your connection and try again.',
        })
      }
    })
  }, [browserContext, state.input.description])

  const createJiraTicket = useCallback(
    async (jiraFields: ExtensionJiraDefaults) => {
      const ticket = state.ticket.generated
      const qaContext = state.ticket.qaContext
      if (!ticket || !qaContext) return

      await jiraLock.current.run(async () => {
        lastJiraFieldsRef.current = jiraFields
        dispatch({ type: 'SET_JIRA_CONFIG', jiraConfig: jiraFields })
        dispatch({ type: 'JIRA_START' })

        try {
          const settings = await loadExtensionAppSettings()
          const projectKey = jiraFields.projectKey.trim()

          if (!projectKey) {
            dispatch({ type: 'JIRA_ERROR', message: 'Please enter a Jira project key.' })
            return
          }

          if (!jiraFields.issueType) {
            dispatch({ type: 'JIRA_ERROR', message: 'Please select an issue type.' })
            return
          }

          const mergedDefaults = {
            ...settings.ticketDefaults,
            projectKey,
            issueType: jiraFields.issueType,
            assignee: jiraFields.assignee,
          }

          const payload = buildJiraCreatePayload(
            ticket,
            qaContext,
            mergedDefaults,
            settings.jira,
            settings.ticketTemplate,
            { reporter: jiraFields.reporter },
          )

          const result = await resilientCreateJiraIssue(payload)
          await saveExtensionJiraDefaults(jiraFields)
          resetExtensionStatePersistenceCache()
          await clearExtensionDraft()
          dispatch({ type: 'JIRA_SUCCESS', result })
          analytics.track('jira_created')
        } catch (error) {
          logger.error('Jira creation failed', error)
          dispatch({
            type: 'JIRA_ERROR',
            message: 'Unable to create Jira ticket. Check your connection and try again.',
          })
        }
      })
    },
    [state.ticket.generated, state.ticket.qaContext],
  )

  const retryJira = useCallback(async () => {
    if (!lastJiraFieldsRef.current) return
    dispatch({ type: 'JIRA_RESET' })
    await createJiraTicket(lastJiraFieldsRef.current)
  }, [createJiraTicket])

  const createAnother = useCallback(async () => {
    resetExtensionStatePersistenceCache()
    await clearExtensionDraft()
    lastJiraFieldsRef.current = null
    dispatch({ type: 'RESET_WORKFLOW' })
    setHealthWarnings(await runExtensionHealthChecks())
  }, [])

  const openSettings = useCallback(() => {
    analytics.track('settings_opened')
    dispatch({ type: 'OPEN_SETTINGS' })
  }, [])

  const closeSettings = useCallback(async () => {
    dispatch({ type: 'CLOSE_SETTINGS' })
    setHealthWarnings(await runExtensionHealthChecks())
  }, [])

  const visibleWarnings = useMemo(
    () => (state.ui.healthDismissed ? [] : healthWarnings),
    [healthWarnings, state.ui.healthDismissed],
  )

  const isGenerating = state.ui.generation.status === 'loading'
  const isCreatingJira = state.ui.jira.status === 'creating'

  return {
    state,
    healthWarnings: visibleWarnings,
    isGenerating,
    isCreatingJira,
    setDescription,
    setVoiceStatus,
    updateTicket: (ticket: NonNullable<typeof state.ticket.generated>) => {
      dispatch({ type: 'UPDATE_TICKET', ticket })
    },
    setJiraConfig: (jiraConfig: ExtensionJiraDefaults | null) => {
      dispatch({ type: 'SET_JIRA_CONFIG', jiraConfig })
    },
    generateTicket,
    retryGenerate: generateTicket,
    createJiraTicket,
    retryJira,
    createAnother,
    openSettings,
    closeSettings,
    dismissHealth: () => dispatch({ type: 'DISMISS_HEALTH' }),
    goBackToInput: () => {
      dispatch({ type: 'JIRA_RESET' })
      dispatch({ type: 'SET_VIEW', view: 'input' })
      dispatch({ type: 'SET_WORKFLOW_VIEW', workflowView: 'input' })
    },
  }
}
