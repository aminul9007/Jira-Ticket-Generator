import { Router } from 'express'
import type {
  CreateJiraIssueResponse,
  JiraConnectionConfig,
} from '../../../shared/jiraApi.js'
import { createIssueViaMcp } from '../jira/createIssueViaMcp.js'
import { parseCreateIssuePayload } from '../jira/validatePayload.js'
import { mapUnknownError } from '../errors.js'
import { testMcpConnection } from '../mcp/testMcpConnection.js'

export const jiraRouter = Router()

jiraRouter.post('/issues', async (req, res) => {
  try {
    const payload = parseCreateIssuePayload(req.body)
    const result: CreateJiraIssueResponse = await createIssueViaMcp(payload)
    res.status(201).json(result)
  } catch (error) {
    const apiError = mapUnknownError(error)
    res.status(apiError.status).json({
      error: apiError.message,
      code: apiError.code,
    })
  }
})

jiraRouter.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'qa-bug-report-api' })
})

jiraRouter.post('/mcp/test', async (req, res) => {
  try {
    const connection = req.body?.connection as JiraConnectionConfig | undefined
    const result = await testMcpConnection(connection)
    res.json(result)
  } catch (error) {
    const apiError = mapUnknownError(error)
    res.status(apiError.status).json({
      error: apiError.message,
      code: apiError.code,
    })
  }
})
