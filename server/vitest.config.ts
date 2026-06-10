import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    env: {
      JIRA_MCP_MOCK: 'true',
      JIRA_DOMAIN: 'company.atlassian.net',
      JIRA_DEFAULT_PROJECT_KEY: 'QA',
    },
  },
})
