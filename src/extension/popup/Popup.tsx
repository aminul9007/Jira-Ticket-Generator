import { useEffect, useState } from 'react'
import type { GeneratedTicket } from '../../types/bugReport'
import { InputScreen } from '../components/InputScreen'
import { ReviewScreen } from '../components/ReviewScreen'
import { useBrowserContext } from '../hooks/useBrowserContext'
import { useExtensionTicketGeneration } from '../hooks/useExtensionTicketGeneration'
import './Popup.css'

type PopupView = 'input' | 'review'

export function Popup() {
  const browserContext = useBrowserContext()
  const { status, errorMessage, ticket, usedAi, generate, resetError } =
    useExtensionTicketGeneration()
  const [view, setView] = useState<PopupView>('input')
  const [description, setDescription] = useState('')
  const [reviewTicket, setReviewTicket] = useState<GeneratedTicket | null>(null)

  useEffect(() => {
    if (status === 'success' && ticket) {
      setReviewTicket(ticket)
      setView('review')
    }
  }, [status, ticket])

  const handleGenerate = () => {
    void generate(description, browserContext)
  }

  const handleBack = () => {
    setView('input')
  }

  if (view === 'review' && reviewTicket) {
    return (
      <div className="popup">
        <div className="popup__layout">
          <header className="popup__header">
            <h1 className="popup__title">QA Bug Assistant</h1>
            <p className="popup__subtitle">Review and edit before creating in Jira</p>
          </header>

          <ReviewScreen
            ticket={reviewTicket}
            usedAi={usedAi}
            onTicketChange={setReviewTicket}
            onBack={handleBack}
          />
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
