import { useState } from 'react'
import type { DefaultIssueType } from '../../types/appSettings'
import { formatExtensionVersionLabel } from '../config/extensionVersion'
import { getApiBaseUrl } from '../config/extensionConfig'
import { LoadingButton } from './LoadingButton'
import {
  clearExtensionDraftsAndPreferences,
  resetExtensionPreferencesOnly,
  useExtensionSettings,
} from '../hooks/useExtensionSettings'
import { clearExtensionDraft } from '../services/extensionDraftService'
import { testExtensionJiraConnection } from '../services/extensionJiraTestService'
import { analytics } from '../services/analytics'
import { logger } from '../utils/logger'

interface SettingsScreenProps {
  onBack: () => void
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const {
    loaded,
    settings,
    defaultReporter,
    updateJira,
    updateTicketDefaults,
    updateVoice,
    setDefaultReporter,
    saveSettings,
    reloadSettings,
  } = useExtensionSettings()

  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [testingConnection, setTestingConnection] = useState(false)
  const [connectionMessage, setConnectionMessage] = useState<string | null>(null)
  const [connectionOk, setConnectionOk] = useState<boolean | null>(null)
  const [maintenanceMessage, setMaintenanceMessage] = useState<string | null>(null)

  if (!loaded) {
    return (
      <div className="popup__loading-state" role="status" aria-live="polite">
        <span className="popup__spinner popup__spinner--large" aria-hidden="true" />
      </div>
    )
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveMessage(null)
    try {
      await saveSettings()
      setSaveMessage('Settings saved.')
      analytics.track('settings_opened')
    } catch {
      setSaveMessage('Could not save settings. Try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleTestConnection = async () => {
    setTestingConnection(true)
    setConnectionMessage(null)
    setConnectionOk(null)

    try {
      const result = await testExtensionJiraConnection(settings.jira)
      setConnectionOk(result.ok)
      setConnectionMessage(result.message)
      analytics.track('connection_tested', { ok: result.ok })
    } catch (error) {
      logger.error('Jira connection test failed', error)
      setConnectionOk(false)
      setConnectionMessage('Unable to Connect')
    } finally {
      setTestingConnection(false)
    }
  }

  const handleClearDrafts = async () => {
    await clearExtensionDraft()
    setMaintenanceMessage('Draft cleared.')
  }

  const handleResetPreferences = async () => {
    await resetExtensionPreferencesOnly()
    await reloadSettings()
    setMaintenanceMessage('Preferences reset to defaults.')
  }

  const handleClearAll = async () => {
    await clearExtensionDraftsAndPreferences()
    await reloadSettings()
    setMaintenanceMessage('Drafts and preferences cleared.')
  }

  return (
    <div className="popup__settings">
      <div className="popup__review-header">
        <button type="button" className="popup__back-button" onClick={onBack}>
          ← Back
        </button>
        <p className="popup__review-badge">Settings</p>
      </div>

      <section className="popup__settings-section">
        <h2 className="popup__footer-title">Jira Settings</h2>
        <p className="popup__settings-hint">
          Credentials are stored locally and sent to your API backend when creating issues.
        </p>

        <label className="popup__label" htmlFor="settings-jira-domain">
          Jira Base URL
        </label>
        <input
          id="settings-jira-domain"
          className="popup__input"
          placeholder="company.atlassian.net"
          value={settings.jira.domain}
          onChange={(event) => updateJira({ domain: event.target.value })}
        />

        <label className="popup__label" htmlFor="settings-jira-email">
          Email / User
        </label>
        <input
          id="settings-jira-email"
          className="popup__input"
          type="email"
          placeholder="you@company.com"
          value={settings.jira.email}
          onChange={(event) => updateJira({ email: event.target.value })}
        />

        <label className="popup__label" htmlFor="settings-jira-token">
          API Token
        </label>
        <input
          id="settings-jira-token"
          className="popup__input"
          type="password"
          placeholder="••••••••••••••••"
          value={settings.jira.apiToken}
          onChange={(event) => updateJira({ apiToken: event.target.value })}
        />

        <div className="popup__settings-actions">
          <LoadingButton
            isLoading={testingConnection}
            loadingLabel="Testing…"
            idleLabel="Test Connection"
            variant="secondary"
            onClick={() => void handleTestConnection()}
          />
          {connectionMessage && (
            <p
              className={
                connectionOk
                  ? 'popup__settings-status popup__settings-status--success'
                  : 'popup__settings-status popup__settings-status--error'
              }
              role="status"
            >
              {connectionMessage}
            </p>
          )}
        </div>
      </section>

      <section className="popup__settings-section">
        <h2 className="popup__footer-title">Ticket Defaults</h2>

        <label className="popup__label" htmlFor="settings-default-project">
          Default Project
        </label>
        <input
          id="settings-default-project"
          className="popup__input"
          placeholder="WEB"
          value={settings.ticketDefaults.projectKey}
          onChange={(event) =>
            updateTicketDefaults({ projectKey: event.target.value.toUpperCase() })
          }
        />

        <label className="popup__label" htmlFor="settings-default-issue-type">
          Default Issue Type
        </label>
        <select
          id="settings-default-issue-type"
          className="popup__select"
          value={settings.ticketDefaults.issueType}
          onChange={(event) =>
            updateTicketDefaults({ issueType: event.target.value as DefaultIssueType })
          }
        >
          <option value="Bug">Bug</option>
          <option value="Task">Task</option>
          <option value="Story">Story</option>
        </select>

        <label className="popup__label" htmlFor="settings-default-assignee">
          Default Assignee
          <span className="popup__label-optional"> (optional)</span>
        </label>
        <input
          id="settings-default-assignee"
          className="popup__input"
          placeholder="Optional account ID or email"
          value={settings.ticketDefaults.assignee}
          onChange={(event) => updateTicketDefaults({ assignee: event.target.value })}
        />

        <label className="popup__label" htmlFor="settings-default-reporter">
          Default Reporter
          <span className="popup__label-optional"> (optional)</span>
        </label>
        <input
          id="settings-default-reporter"
          className="popup__input"
          placeholder="Optional account ID or email"
          value={defaultReporter}
          onChange={(event) => setDefaultReporter(event.target.value)}
        />
      </section>

      <section className="popup__settings-section">
        <h2 className="popup__footer-title">Voice Settings</h2>

        <label className="popup__label" htmlFor="settings-voice-language">
          Language
        </label>
        <select
          id="settings-voice-language"
          className="popup__select"
          value={settings.voice.language}
          onChange={(event) =>
            updateVoice({ language: event.target.value as typeof settings.voice.language })
          }
        >
          <option value="en-US">English (US)</option>
          <option value="en-GB">English (UK)</option>
        </select>

        <label className="popup__label" htmlFor="settings-voice-timeout">
          Auto Stop
        </label>
        <select
          id="settings-voice-timeout"
          className="popup__select"
          value={String(settings.voice.silenceTimeoutSeconds)}
          onChange={(event) =>
            updateVoice({
              silenceTimeoutSeconds: Number(event.target.value) as typeof settings.voice.silenceTimeoutSeconds,
            })
          }
        >
          <option value="5">5 seconds of silence</option>
          <option value="10">10 seconds of silence</option>
          <option value="15">15 seconds of silence</option>
        </select>
      </section>

      <section className="popup__settings-section">
        <h2 className="popup__footer-title">Extension Settings</h2>
        <p className="popup__settings-hint">API URL: {getApiBaseUrl()}</p>

        <div className="popup__settings-actions popup__settings-actions--stack">
          <LoadingButton
            isLoading={false}
            loadingLabel="Clear Drafts"
            idleLabel="Clear Drafts"
            variant="secondary"
            onClick={() => void handleClearDrafts()}
          />
          <LoadingButton
            isLoading={false}
            loadingLabel="Reset Preferences"
            idleLabel="Reset Preferences"
            variant="secondary"
            onClick={() => void handleResetPreferences()}
          />
          <LoadingButton
            isLoading={false}
            loadingLabel="Clear Drafts & Preferences"
            idleLabel="Clear Drafts & Preferences"
            variant="secondary"
            onClick={() => void handleClearAll()}
          />
        </div>

        {maintenanceMessage && (
          <p className="popup__settings-status popup__settings-status--neutral" role="status">
            {maintenanceMessage}
          </p>
        )}
      </section>

      <section className="popup__settings-section popup__settings-section--footer">
        <p className="popup__settings-version">Version {formatExtensionVersionLabel()}</p>
        <LoadingButton
          isLoading={saving}
          loadingLabel="Saving…"
          idleLabel="Save Settings"
          onClick={() => void handleSave()}
        />
        {saveMessage && (
          <p className="popup__settings-status popup__settings-status--neutral" role="status">
            {saveMessage}
          </p>
        )}
      </section>
    </div>
  )
}
