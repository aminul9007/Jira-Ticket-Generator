import { useCallback, useState } from 'react'
import type { CreateJiraIssueResponse } from '../../../shared/jiraApi'
import { createJiraIssue, JiraCreateIssueError } from '../../services/jira/createJiraIssue'
import type { GeneratedTicket } from '../../types/bugReport'
import type { ExtractedContext } from '../../types/contextDetection'
import { buildJiraCreatePayload } from '../../utils/buildJiraCreatePayload'
import { saveExtensionJiraDefaults } from '../services/extensionJiraDefaultsService'
import { loadExtensionAppSettings } from '../services/extensionSettingsService'
import type { ExtensionJiraDefaults } from '../types/extensionJiraDefaults'

export type ExtensionJiraCreationState =
  | { status: 'idle' }
  | { status: 'creating' }
  | { status: 'success'; result: CreateJiraIssueResponse }
  | { status: 'error'; message: string }

function mapCreationError(error: unknown): string {
  if (error instanceof JiraCreateIssueError) {
    if (error.code === 'JIRA_AUTH_ERROR' || error.code === 'VALIDATION_ERROR') {
      if (error.message.toLowerCase().includes('project')) {
        return 'Please enter a Jira project key.'
      }
      return 'Please verify Jira configuration.'
    }
    if (error.code === 'NETWORK_ERROR') {
      return 'Network error while creating the Jira ticket. Check your connection and API URL.'
    }
    if (error.code === 'MCP_CONNECTION_ERROR') {
      return 'Could not reach the Jira API. Make sure the backend server is running.'
    }
    return error.message
  }

  return 'Unable to create Jira ticket.'
}

export function useExtensionJiraCreation() {
  const [state, setState] = useState<ExtensionJiraCreationState>({ status: 'idle' })

  const reset = useCallback(() => {
    setState({ status: 'idle' })
  }, [])

  const createIssue = useCallback(
    async (
      ticket: GeneratedTicket,
      qaContext: ExtractedContext,
      jiraFields: ExtensionJiraDefaults,
    ) => {
      const projectKey = jiraFields.projectKey.trim()

      if (!projectKey) {
        setState({
          status: 'error',
          message: 'Please enter a Jira project key.',
        })
        return null
      }

      if (!jiraFields.issueType) {
        setState({
          status: 'error',
          message: 'Please select an issue type.',
        })
        return null
      }

      setState({ status: 'creating' })

      try {
        const settings = await loadExtensionAppSettings()

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

        const result = await createJiraIssue(payload)
        await saveExtensionJiraDefaults(jiraFields)
        setState({ status: 'success', result })
        return result
      } catch (error) {
        const message = mapCreationError(error)
        setState({ status: 'error', message })
        return null
      }
    },
    [],
  )

  return { state, createIssue, reset }
}
