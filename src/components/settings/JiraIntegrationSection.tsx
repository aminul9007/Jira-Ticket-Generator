import { useState } from 'react'
import { useAppSettings } from '../../hooks/useAppSettings'
import {
  testJiraConnection,
  type JiraConnectionResult,
} from '../../services/jira/testJiraConnection'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { PasswordInput } from './PasswordInput'
import { SettingsField } from './SettingsField'

export function JiraIntegrationSection() {
  const { settings, updateJira } = useAppSettings()
  const { jira } = settings
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState<JiraConnectionResult | null>(null)

  const handleTest = async () => {
    setTesting(true)
    setResult(null)
    const connection = await testJiraConnection(jira)
    setResult(connection)
    setTesting(false)
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
        hint="Create at id.atlassian.com → Security → API tokens. Stored locally only."
      >
        <PasswordInput
          id="jira-token"
          value={jira.apiToken}
          placeholder="••••••••••••••••"
          onChange={(value) => updateJira({ apiToken: value })}
        />
      </SettingsField>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          type="button"
          variant="secondary"
          size="md"
          isLoading={testing}
          onClick={() => void handleTest()}
        >
          Test Jira Connection
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

      <p className="text-xs leading-relaxed text-text-muted">
        Issue creation from this app is prepared for a future release. Credentials are saved
        locally for when server-side Jira API calls are added.
      </p>
    </>
  )
}
