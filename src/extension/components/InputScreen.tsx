import { useEffect, useRef, useState } from 'react'
import type { TicketContext } from '../../../shared/generation/types'
import type { ExtensionVoiceStatus } from '../types/extensionState'
import { MIN_ISSUE_DESCRIPTION_LENGTH } from '../../utils/validateForm'
import { useExtensionIssueDescriptionVoice } from '../hooks/useExtensionIssueDescriptionVoice'
import { LoadingButton } from './LoadingButton'

interface InputScreenProps {
  description: string
  browserContext: TicketContext
  status: 'idle' | 'loading' | 'error'
  errorMessage: string | null
  onDescriptionChange: (value: string) => void
  onVoiceStatusChange?: (status: ExtensionVoiceStatus, transcript?: string) => void
  onGenerate: () => void
  onRetry: () => void
}

export function InputScreen({
  description,
  browserContext,
  status,
  errorMessage,
  onDescriptionChange,
  onVoiceStatusChange,
  onGenerate,
  onRetry,
}: InputScreenProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [validationAttempted, setValidationAttempted] = useState(false)
  const isLoading = status === 'loading'
  const voice = useExtensionIssueDescriptionVoice({
    description,
    onDescriptionChange,
    onVoiceStatusChange,
  })

  const isVoiceBusy = voice.isListening || voice.isProcessing
  const descriptionValid = description.trim().length >= MIN_ISSUE_DESCRIPTION_LENGTH
  const voiceDisabled = isLoading || voice.isProcessing || !voice.speechSupported

  useEffect(() => {
    if (!isLoading && !isVoiceBusy) {
      textareaRef.current?.focus()
    }
  }, [isLoading, isVoiceBusy])

  const voiceStatusLabel = (() => {
    switch (voice.displayStatus) {
      case 'listening':
        return 'Recording… speak your bug description'
      case 'processing':
        return 'Processing speech…'
      case 'completed':
        return 'Recording complete — edit if needed, then generate'
      case 'error':
        return 'Voice input unavailable'
      default:
        return 'Tap the microphone to dictate your bug description'
    }
  })()

  const handleGenerateClick = () => {
    setValidationAttempted(true)
    if (!descriptionValid) return
    onGenerate()
  }

  const descriptionError =
    validationAttempted && !descriptionValid
      ? `Please describe the bug (at least ${MIN_ISSUE_DESCRIPTION_LENGTH} characters).`
      : null

  return (
    <>
      <section className="popup__section">
        <label className="popup__label" htmlFor="voice-input">
          Voice input
        </label>
        <p
          id="voice-input-status"
          className={`popup__voice-status popup__voice-status--${voice.displayStatus}`}
          role="status"
          aria-live="polite"
        >
          {voiceStatusLabel}
        </p>
        {voice.isListening ? (
          <button
            id="voice-input"
            type="button"
            className="popup__voice-button popup__voice-button--recording"
            disabled={isLoading}
            onClick={voice.stopRecording}
          >
            🔴 Recording… — Stop Recording
          </button>
        ) : (
          <button
            id="voice-input"
            type="button"
            className="popup__voice-button popup__voice-button--active"
            disabled={voiceDisabled}
            aria-disabled={voiceDisabled}
            onClick={voice.startRecording}
          >
            {voice.isProcessing ? 'Processing…' : '🎤 Start Recording'}
          </button>
        )}
        {!voice.speechSupported && (
          <p className="popup__voice-hint" role="note">
            Voice input is not supported in this browser.
          </p>
        )}
        {voice.error && (
          <p className="popup__error popup__error--voice" role="alert">
            {voice.error}
          </p>
        )}
      </section>

      <section className="popup__section">
        <label className="popup__label" htmlFor="issue-description">
          Issue description
        </label>
        <textarea
          ref={textareaRef}
          id="issue-description"
          className={`popup__textarea${isVoiceBusy ? ' popup__textarea--listening' : ''}${descriptionError ? ' popup__textarea--invalid' : ''}`}
          placeholder="Describe the bug you found on this page…"
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
          rows={6}
          disabled={isLoading || voice.isListening}
          aria-describedby="voice-input-status"
          aria-invalid={Boolean(descriptionError)}
        />
        {descriptionError && (
          <p className="popup__field-error" role="alert">
            {descriptionError}
          </p>
        )}
      </section>

      {errorMessage && (
        <div className="popup__error-block" role="alert">
          <p className="popup__error">{errorMessage}</p>
          <button
            type="button"
            className="popup__retry-button"
            disabled={isLoading || !descriptionValid}
            onClick={onRetry}
          >
            Retry Generation
          </button>
        </div>
      )}

      <section className="popup__section">
        <LoadingButton
          isLoading={isLoading}
          loadingLabel="Generating ticket…"
          idleLabel="Generate Ticket"
          disabled={isLoading || isVoiceBusy}
          onClick={handleGenerateClick}
        />
      </section>

      <footer className="popup__footer">
        <p className="popup__footer-title">Captured context</p>
        <div className="popup__meta">
          <p className="popup__meta-row">
            <span className="popup__meta-label">Page</span>
            <span className="popup__meta-value">{browserContext.url || 'Unavailable'}</span>
          </p>
          <p className="popup__meta-row">
            <span className="popup__meta-label">Title</span>
            <span className="popup__meta-value">{browserContext.title || 'Unavailable'}</span>
          </p>
          <p className="popup__meta-row">
            <span className="popup__meta-label">Captured</span>
            <span className="popup__meta-value">{browserContext.timestamp || '—'}</span>
          </p>
        </div>
      </footer>
    </>
  )
}
