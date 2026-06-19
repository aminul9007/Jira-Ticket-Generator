import type { CreateJiraIssuePayload, CreateJiraIssueResponse } from '../../../shared/jiraApi'
import type { TicketGenerationInput } from '../../../shared/generation/types'
import type { TicketGenerationResult } from '../../services/ticketGeneration'
import { createExtensionJiraIssue } from './extensionJiraApi'
import { withApiResilience } from '../utils/apiResilience'
import { generateExtensionTicket } from './generateExtensionTicket'

export function resilientGenerateExtensionTicket(
  input: TicketGenerationInput,
): Promise<TicketGenerationResult> {
  return withApiResilience(() => generateExtensionTicket(input), {
    label: 'ticket generation',
    timeoutMs: 45_000,
    maxAttempts: 2,
  })
}

export function resilientCreateJiraIssue(
  payload: CreateJiraIssuePayload,
): Promise<CreateJiraIssueResponse> {
  return withApiResilience(() => createExtensionJiraIssue(payload), {
    label: 'Jira creation',
    timeoutMs: 30_000,
    maxAttempts: 2,
  })
}
