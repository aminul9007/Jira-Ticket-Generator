import { createApp } from './app.js'
import { appConfig } from './config.js'

const app = createApp()

app.listen(appConfig.port, () => {
  console.log(`QA Bug Report API listening on http://localhost:${appConfig.port}`)
  if (appConfig.mcpMock) {
    console.log('JIRA_MCP_MOCK=true — issue creation returns a fake QA-123 response')
  }
})
