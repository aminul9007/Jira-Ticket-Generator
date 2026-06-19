import { useEffect, useState } from 'react'
import type { GeneratedTicket } from '../../types/bugReport'
import type { ExtractedContext } from '../../types/contextDetection'
import { InputScreen } from '../components/InputScreen'
import { ReviewScreen } from '../components/ReviewScreen'
import { SuccessScreen } from '../components/SuccessScreen'
import { useBrowserContext } from '../hooks/useBrowserContext'
import { useExtensionJiraCreation } from '../hooks/useExtensionJiraCreation'
import { useExtensionTicketGeneration } from '../hooks/useExtensionTicketGeneration'
import type { ExtensionJiraDefaults } from '../types/extensionJiraDefaults'
import './Popup.css'

type PopupView = 'input' | 'review' | 'success'

export function Popup() {
  const browserContext = useBrowserContext()
  const { status, errorMessage, ticket, usedAi, qaContext, generate, resetError } =
    useExtensionTicketGeneration()
  const { state: jiraState, createIssue, reset: resetJiraCreation } =
    useExtensionJiraCreation()

  const [view, setView] = useState<PopupView>('input')
  const [description, setDescription] = useState('')
  const [reviewTicket, setReviewTicket] = useState<GeneratedTicket | null>(null)
  const [reviewQaContext, setReviewQaContext] = useState<ExtractedContext | null>(null)

  useEffect(() => {
    if (status === 'success' && ticket && qaContext) {
      setReviewTicket(ticket)
      setReviewQaContext(qaContext)
      setView('review')
    }
  }, [status, ticket, qaContext])

  useEffect(() => {
    if (jiraState.status === 'success') {
      setView('success')
    }
  }, [jiraState.status])

  const handleGenerate = () => {
    void generate(description, browserContext)
  }

  const handleBack = () => {
    resetJiraCreation()
    setView('input')
  }

  const handleCreateJira = (jiraFields: ExtensionJiraDefaults) => {
    if (!reviewTicket || !reviewQaContext) return
    resetJiraCreation()
    void createIssue(reviewTicket, reviewQaContext, jiraFields)
  }

  const handleCreateAnother = () => {
    resetJiraCreation()
    setReviewTicket(null)
    setReviewQaContext(null)
    setDescription('')
    setView('input')
  }

  if (view === 'success' && jiraState.status === 'success') {
    return (
      <div className="popup">
        <div className="popup__layout">
          <header className="popup__header">
            <h1 className="popup__title">QA Bug Assistant</h1>
            <p className="popup__subtitle">Your ticket is ready in Jira</p>
          </header>

          <SuccessScreen
            result={jiraState.result}
            onOpenTicket={() => {
              window.open(jiraState.result.issueUrl, '_blank', 'noopener,noreferrer')
            }}
            onCreateAnother={handleCreateAnother}
          />
        </div>
      </div>
    )
  }

  if (view === 'review' && reviewTicket) {
    return (
      <div className="popup">
        <div className="popup__layout">
          <header className="popup__header">
            <h1 className="popup__title">QA Bug Assistant</h1>
            <p className="popup__subtitle">Review and edit before creating in Jira</p>
          </header>

          <div className="popup__scroll">
            <ReviewScreen
              ticket={reviewTicket}
              usedAi={usedAi}
              onTicketChange={setReviewTicket}
              onBack={handleBack}
              jiraErrorMessage={
                jiraState.status === 'error' ? jiraState.message : null
              }
              isCreatingJira={jiraState.status === 'creating'}
              onCreateJira={handleCreateJira}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="popup">
      <div className="popup__layout">
        <header className="popup__header">
          <h1 className="popup__title">QA Bug Assistant</h1>
          <p className="popup__subtitle">Describe the bug — context is captured automatically</p>
        </header>

        <InputScreen
          description={description}
          browserContext={browserContext}
          status={status === 'success' ? 'idle' : status}
          errorMessage={errorMessage}
          onDescriptionChange={(value) => {
            setDescription(value)
            if (status === 'error') {
              resetError()
            }
          }}
          onGenerate={handleGenerate}
        />
      </div>
    </div>
  )
}
