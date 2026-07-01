import { useBrowserContext } from '../hooks/useBrowserContext'
import { useExtensionStateManager } from '../hooks/useExtensionStateManager'
import { HealthBanner } from '../components/HealthBanner'
import { InputScreen } from '../components/InputScreen'
import { PopupFrame } from '../components/PopupFrame'
import { PopupHeader } from '../components/PopupHeader'
import { ReviewScreen } from '../components/ReviewScreen'
import { SettingsScreen } from '../components/SettingsScreen'
import { SuccessScreen } from '../components/SuccessScreen'
import { openExtensionAboutPage } from '../services/extensionAboutService'
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
    startNewTicket,
  } = useExtensionStateManager(browserContext)

  if (!state.hydrated) {
    return (
      <PopupFrame
        header={<PopupHeader subtitle="Loading your draft…" />}
      >
        <div className="popup__loading-state" role="status" aria-live="polite">
          <span className="popup__spinner popup__spinner--large" aria-hidden="true" />
        </div>
      </PopupFrame>
    )
  }

  if (state.ui.view === 'settings') {
    return (
      <PopupFrame
        scroll
        header={
          <PopupHeader
            subtitle="Configure Jira, defaults, and voice"
            onOpenAbout={openExtensionAboutPage}
          />
        }
      >
        <SettingsScreen onBack={() => void closeSettings()} />
      </PopupFrame>
    )
  }

  if (state.ui.view === 'success' && state.ui.jira.result) {
    return (
      <PopupFrame
        header={
          <PopupHeader
            subtitle="Your ticket is ready in Jira"
            onOpenAbout={openExtensionAboutPage}
            onOpenSettings={openSettings}
          />
        }
      >
        <SuccessScreen
          result={state.ui.jira.result}
          onOpenTicket={() => {
            window.open(state.ui.jira.result!.issueUrl, '_blank', 'noopener,noreferrer')
          }}
          onCreateAnother={() => void createAnother()}
        />
      </PopupFrame>
    )
  }

  if (state.ui.view === 'review' && state.ticket.generated) {
    return (
      <PopupFrame
        scroll
        header={
          <PopupHeader
            subtitle="Review and edit before creating in Jira"
            onOpenAbout={openExtensionAboutPage}
            onOpenSettings={openSettings}
          />
        }
      >
        <>
          <HealthBanner
            warnings={healthWarnings}
            onDismiss={dismissHealth}
            onOpenSettings={openSettings}
          />
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
        </>
      </PopupFrame>
    )
  }

  const generationStatus =
    state.ui.generation.status === 'success' ? 'idle' : state.ui.generation.status

  return (
    <PopupFrame
      header={
        <PopupHeader
          subtitle="Describe the bug — context is captured automatically"
          onOpenAbout={openExtensionAboutPage}
          onOpenSettings={openSettings}
          onCreateTicket={() => void startNewTicket()}
        />
      }
    >
      <>
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
      </>
    </PopupFrame>
  )
}
