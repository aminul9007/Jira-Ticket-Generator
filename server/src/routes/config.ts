import { Router } from 'express'
import type { ExtensionBootstrapResponse } from '../../../shared/extensionBootstrap.js'
import { appConfig } from '../config.js'

export const configRouter = Router()

configRouter.get('/bootstrap', (_req, res) => {
  const { JIRA_URL, JIRA_USERNAME, JIRA_API_TOKEN } = appConfig.mcp.env

  const payload: ExtensionBootstrapResponse = {
    jira: {
      domain: appConfig.jiraDomain,
      email: JIRA_USERNAME,
      configured: Boolean(JIRA_URL && JIRA_USERNAME && JIRA_API_TOKEN),
    },
    ticketDefaults: {
      projectKey: appConfig.defaultProjectKey,
      issueType: appConfig.defaultIssueType,
    },
  }

  res.json(payload)
})
