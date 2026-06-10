import { useState } from 'react'
import { useAppSettings } from '../../hooks/useAppSettings'
import { testMcpViaApi } from '../../services/jira/testMcpConnection'
import {
  testJiraConnection,
  type JiraConnectionResult,
} from '../../services/jira/testJiraConnection'
import type { McpStatusResponse } from '../../../shared/jiraApi'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { PasswordInput } from './PasswordInput'
import { SettingsField } from './SettingsField'

export function JiraIntegrationSection() {
  const { settings, updateJira } = useAppSettings()
  const { jira } = settings
  const [testing, setTesting] = useState(false)
  const [testingMcp, setTestingMcp] = useState(false)
  const [result, setResult] = useState<JiraConnectionResult | null>(null)
  const [mcpStatus, setMcpStatus] = useState<McpStatusResponse | null>(null)

  const handleTest = async () => {
    setTesting(true)
    setResult(null)
    const connection = await testJiraConnection(jira)
    setResult(connection)
    setTesting(false)
  }

  const handleTestMcp = async () => {
    setTestingMcp(true)
    setMcpStatus(null)
    const domain = jira.domain.trim()
    const email = jira.email.trim()
    const apiToken = jira.apiToken.trim()
    const status = await testMcpViaApi(
      domain && email && apiToken ? { domain, email, apiToken } : undefined,
    )
    setMcpStatus(status)
    setTestingMcp(false)
  }

  return (
    <>
      <SettingsField
        id="jira-domain"
        label="Jira domain"
        hint="Your Atlassian Cloud site, e.g. company.atlassian.net"
      >
        <Input
          id="jira-domain"
          value={jira.domain}
          placeholder="company.atlassian.net"
          onChange={(e) => updateJira({ domain: e.target.value })}
        />
      </SettingsField>

      <SettingsField id="jira-email" label="Jira email" hint="Account email for API authentication.">
        <Input
          id="jira-email"
          type="email"
          value={jira.email}
          placeholder="you@company.com"
          autoComplete="email"
          onChange={(e) => updateJira({ email: e.target.value })}
        />
      </SettingsField>

      <SettingsField
        id="jira-token"
        label="Jira API token"
        hint="Create at id.atlassian.com → Security → API tokens. Sent only to your local API backend."
      >
        <PasswordInput
          id="jira-token"
          value={jira.apiToken}
          placeholder="••••••••••••••••"
          onChange={(value) => updateJira({ apiToken: value })}
        />
      </SettingsField>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            type="button"
            variant="secondary"
            size="md"
            isLoading={testing}
            onClick={() => void handleTest()}
          >
            Test Jira (browser)
          </Button>
          {result && (
            <p
              role="status"
              className={
                result.status === 'success'
                  ? 'text-sm font-medium text-[var(--color-success)]'
                  : 'text-sm font-medium text-danger'
              }
            >
              {result.status === 'success' ? '✅' : '❌'} {result.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            type="button"
            variant="primary"
            size="md"
            isLoading={testingMcp}
            onClick={() => void handleTestMcp()}
          >
            Test API & MCP connection
          </Button>
          {mcpStatus && (
            <p
              role="status"
              className={
                mcpStatus.connected && mcpStatus.hasCreateTool
                  ? 'text-sm font-medium text-[var(--color-success)]'
                  : 'text-sm font-medium text-danger'
              }
            >
              {mcpStatus.connected && mcpStatus.hasCreateTool ? '✅' : '❌'} {mcpStatus.message}
            </p>
          )}
        </div>
      </div>

      <p className="type-helper leading-6">
        Credentials are stored locally and forwarded to your API backend when creating issues.
        The backend spawns the Jira MCP server (<code className="text-text-secondary">mcp-atlassian</code>)
        with these values. For production, prefer setting credentials only in <code className="text-text-secondary">server/.env</code>.
      </p>
    </>
  )
}
