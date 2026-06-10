import { useCallback, useState } from 'react'
import type { CreateJiraIssueResponse } from '../../shared/jiraApi'
import { useAppSettings } from './useAppSettings'
import { createJiraIssue } from '../services/jira/createJiraIssue'
import type { GeneratedTicket } from '../types/bugReport'
import type { ExtractedContext } from '../types/contextDetection'
import { buildJiraCreatePayload } from '../utils/buildJiraCreatePayload'

export type JiraCreationState =
  | { status: 'idle' }
  | { status: 'creating' }
  | { status: 'success'; result: CreateJiraIssueResponse }
  | { status: 'error'; message: string }

export function useJiraIssueCreation() {
  const { settings } = useAppSettings()
  const [state, setState] = useState<JiraCreationState>({ status: 'idle' })

  const reset = useCallback(() => {
    setState({ status: 'idle' })
  }, [])

  const createIssue = useCallback(
    async (ticket: GeneratedTicket, qaContext: ExtractedContext) => {
      setState({ status: 'creating' })

      try {
        const payload = buildJiraCreatePayload(
          ticket,
          qaContext,
          settings.ticketDefaults,
          settings.jira,
        )
        const result = await createJiraIssue(payload)
        setState({ status: 'success', result })
        return result
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Failed to create the Jira ticket.'
        setState({ status: 'error', message })
        return null
      }
    },
    [settings.ticketDefaults, settings.jira],
  )

  return { state, createIssue, reset }
}
