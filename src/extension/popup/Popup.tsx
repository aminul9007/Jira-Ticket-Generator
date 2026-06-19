import { useEffect, useRef, useState } from 'react'
import type { GeneratedTicket } from '../../types/bugReport'
import type { ExtractedContext } from '../../types/contextDetection'
import { InputScreen } from '../components/InputScreen'
import { PopupHeader } from '../components/PopupHeader'
import { ReviewScreen } from '../components/ReviewScreen'
import { SuccessScreen } from '../components/SuccessScreen'
import { useBrowserContext } from '../hooks/useBrowserContext'
import { useExtensionJiraCreation } from '../hooks/useExtensionJiraCreation'
import { useExtensionTicketGeneration } from '../hooks/useExtensionTicketGeneration'
import {
  clearExtensionDraft,
  loadExtensionDraft,
  saveExtensionDraft,
} from '../services/extensionDraftService'
import type { ExtensionJiraDefaults } from '../types/extensionJiraDefaults'
import './Popup.css'

type PopupView = 'input' | 'review' | 'success'

export function Popup() {
  const browserContext = useBrowserContext()
  const {
    status,
    errorMessage,
    ticket,
    usedAi,
    qaContext,
    generate,
    retry,
    resetError,
  } = useExtensionTicketGeneration()
  const { state: jiraState, createIssue, reset: resetJiraCreation } =
    useExtensionJiraCreation()

  const [hydrated, setHydrated] = useState(false)
  const [view, setView] = useState<PopupView>('input')
  const [description, setDescription] = useState('')
  const [reviewTicket, setReviewTicket] = useState<GeneratedTicket | null>(null)
  const [reviewQaContext, setReviewQaContext] = useState<ExtractedContext | null>(null)
  const [draftUsedAi, setDraftUsedAi] = useState(false)
  const [jiraDefaults, setJiraDefaults] = useState<ExtensionJiraDefaults | null>(null)
  const lastJiraFieldsRef = useRef<ExtensionJiraDefaults | null>(null)

  useEffect(() => {
    void loadExtensionDraft().then((draft) => {
      setDescription(draft.description)
      setDraftUsedAi(draft.usedAi)
      setJiraDefaults(draft.jiraDefaults)

      if (draft.ticket && draft.qaContext && draft.view === 'review') {
        setReviewTicket(draft.ticket)
        setReviewQaContext(draft.qaContext)
        setView('review')
      }

      setHydrated(true)
    })
  }, [])

  useEffect(() => {
    if (!hydrated) return

    const timer = window.setTimeout(() => {
      void saveExtensionDraft({
        description,
        view: view === 'success' ? 'review' : view,
        ticket: reviewTicket,
        qaContext: reviewQaContext,
        usedAi: reviewTicket ? (ticket ? usedAi : draftUsedAi) : false,
        jiraDefaults,
      })
    }, 200)

    return () => window.clearTimeout(timer)
  }, [
    hydrated,
    description,
    view,
    reviewTicket,
    reviewQaContext,
    ticket,
    usedAi,
    draftUsedAi,
    jiraDefaults,
  ])

  useEffect(() => {
    if (!hydrated || status !== 'success' || !ticket || !qaContext) return

    setReviewTicket(ticket)
    setReviewQaContext(qaContext)
    setDraftUsedAi(usedAi)
    setView('review')
  }, [hydrated, status, ticket, qaContext, usedAi])

  useEffect(() => {
    if (jiraState.status === 'success') {
      void clearExtensionDraft()
      setView('success')
    }
  }, [jiraState.status])

  const handleGenerate = () => {
    void generate(description, browserContext)
  }

  const handleRetryGenerate = () => {
    void retry(description, browserContext)
  }

  const handleBack = () => {
    resetJiraCreation()
    setView('input')
  }

  const handleCreateJira = (jiraFields: ExtensionJiraDefaults) => {
    if (!reviewTicket || !reviewQaContext) return
    lastJiraFieldsRef.current = jiraFields
    setJiraDefaults(jiraFields)
    resetJiraCreation()
    void createIssue(reviewTicket, reviewQaContext, jiraFields)
  }

  const handleRetryJira = () => {
    if (!reviewTicket || !reviewQaContext || !lastJiraFieldsRef.current) return
    resetJiraCreation()
    void createIssue(reviewTicket, reviewQaContext, lastJiraFieldsRef.current)
  }

  const handleCreateAnother = () => {
    resetJiraCreation()
    resetError()
    setReviewTicket(null)
    setReviewQaContext(null)
    setJiraDefaults(null)
    setDraftUsedAi(false)
    setDescription('')
    lastJiraFieldsRef.current = null
    setView('input')
    void clearExtensionDraft()
  }

  if (!hydrated) {
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

  if (view === 'success' && jiraState.status === 'success') {
    return (
      <div className="popup">
        <div className="popup__layout">
          <PopupHeader subtitle="Your ticket is ready in Jira" />

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
          <PopupHeader subtitle="Review and edit before creating in Jira" />

          <div className="popup__scroll">
            <ReviewScreen
              ticket={reviewTicket}
              usedAi={ticket ? usedAi : draftUsedAi}
              onTicketChange={setReviewTicket}
              onBack={handleBack}
              initialJiraDefaults={jiraDefaults}
              onJiraDefaultsChange={setJiraDefaults}
              jiraErrorMessage={
                jiraState.status === 'error' ? jiraState.message : null
              }
              isCreatingJira={jiraState.status === 'creating'}
              onCreateJira={handleCreateJira}
              onRetryJira={handleRetryJira}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="popup">
      <div className="popup__layout">
        <PopupHeader subtitle="Describe the bug — context is captured automatically" />

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
          onRetry={handleRetryGenerate}
        />
      </div>
    </div>
  )
}
