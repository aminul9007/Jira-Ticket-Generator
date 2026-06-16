import { createApp } from './app.js'
import { appConfig } from './config.js'

const app = createApp()

app.listen(appConfig.port, '0.0.0.0', () => {
  console.log(`QA Bug Report API listening on http://0.0.0.0:${appConfig.port}`)
  if (appConfig.mcpMock) {
    console.log('JIRA_MCP_MOCK=true — issue creation returns a fake QA-123 response')
  }
})
