import { useBrowserContext } from '../hooks/useBrowserContext'
import { useExtensionStateManager } from '../hooks/useExtensionStateManager'
import { HealthBanner } from '../components/HealthBanner'
import { InputScreen } from '../components/InputScreen'
import { PopupHeader } from '../components/PopupHeader'
import { ReviewScreen } from '../components/ReviewScreen'
import { SettingsScreen } from '../components/SettingsScreen'
import { SuccessScreen } from '../components/SuccessScreen'
import './Popup.css'

export function Popup() {
  const browserContext = useBrowserContext()
  const {
    state,
    healthWarnings,
    isGenerating,
    isCreatingJira,
    setDescription,
    setIncludePageTitle,
    setVoiceStatus,
    updateTicket,
    setJiraConfig,
    generateTicket,
    retryGenerate,
    createJiraTicket,
    retryJira,
    createAnother,
    openSettings,
    closeSettings,
    dismissHealth,
    goBackToInput,
  } = useExtensionStateManager(browserContext)

  if (!state.hydrated) {
    return (
      <div className="popup">
        <div className="popup__layout popup__layout--loading">
          <PopupHeader subtitle="Loading your draft…" />
          <div className="popup__loading-state" role="status" aria-live="polite">
            <span className="popup__spinner popup__spinner--large" aria-hidden="true" />
          </div>
        </div>
      </div>
    )
  }

  if (state.ui.view === 'settings') {
    return (
      <div className="popup">
        <div className="popup__layout">
          <PopupHeader subtitle="Configure Jira, defaults, and voice" />
          <div className="popup__scroll">
            <SettingsScreen onBack={() => void closeSettings()} />
          </div>
        </div>
      </div>
    )
  }

  if (state.ui.view === 'success' && state.ui.jira.result) {
    return (
      <div className="popup">
        <div className="popup__layout">
          <PopupHeader subtitle="Your ticket is ready in Jira" onOpenSettings={openSettings} />

          <SuccessScreen
            result={state.ui.jira.result}
            onOpenTicket={() => {
              window.open(state.ui.jira.result!.issueUrl, '_blank', 'noopener,noreferrer')
            }}
            onCreateAnother={() => void createAnother()}
          />
        </div>
      </div>
    )
  }

  if (state.ui.view === 'review' && state.ticket.generated) {
    return (
      <div className="popup">
        <div className="popup__layout">
          <PopupHeader
            subtitle="Review and edit before creating in Jira"
            onOpenSettings={openSettings}
          />

          <HealthBanner
            warnings={healthWarnings}
            onDismiss={dismissHealth}
            onOpenSettings={openSettings}
          />

          <div className="popup__scroll">
            <ReviewScreen
              ticket={state.ticket.generated}
              usedAi={state.ticket.usedAi}
              onTicketChange={updateTicket}
              onBack={goBackToInput}
              initialJiraDefaults={state.jiraConfig}
              onJiraDefaultsChange={setJiraConfig}
              jiraErrorMessage={state.ui.jira.errorMessage}
              isCreatingJira={isCreatingJira}
              onCreateJira={(fields) => void createJiraTicket(fields)}
              onRetryJira={() => void retryJira()}
            />
          </div>
        </div>
      </div>
    )
  }

  const generationStatus =
    state.ui.generation.status === 'success' ? 'idle' : state.ui.generation.status

  return (
    <div className="popup">
      <div className="popup__layout">
        <PopupHeader
          subtitle="Describe the bug — context is captured automatically"
          onOpenSettings={openSettings}
        />

        <HealthBanner
          warnings={healthWarnings}
          onDismiss={dismissHealth}
          onOpenSettings={openSettings}
        />

        <InputScreen
          description={state.input.description}
          browserContext={browserContext}
          includePageTitle={state.input.includePageTitle}
          status={isGenerating ? 'loading' : generationStatus}
          errorMessage={state.ui.generation.errorMessage}
          onDescriptionChange={setDescription}
          onIncludePageTitleChange={setIncludePageTitle}
          onVoiceStatusChange={setVoiceStatus}
          onGenerate={() => void generateTicket()}
          onRetry={() => void retryGenerate()}
        />
      </div>
    </div>
  )
}
