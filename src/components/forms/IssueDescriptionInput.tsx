import type { KeyboardEvent } from 'react'
import type { Environment } from '../../types/bugReport'
import { useIssueDescriptionVoice } from '../../hooks/useIssueDescriptionVoice'
import { cn } from '../../utils/cn'
import { Label } from '../ui/Label'
import { Textarea } from '../ui/Textarea'

interface IssueDescriptionInputProps {
  id: string
  value: string
  maxLength: number
  minHintLength: number
  placeholder: string
  disabled?: boolean
  onChange: (value: string) => void
  onEnvironmentsFromVoice: (environments: Environment[]) => void
  onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void
}

const MicIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Z"
      stroke="currentColor"
      strokeWidth="1.75"
    />
    <path
      d="M6 11v1a6 6 0 0 0 12 0v-1M12 18v3M9 21h6"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
  </svg>
)

const StopIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="7" y="7" width="10" height="10" rx="1.5" fill="currentColor" />
  </svg>
)

export function IssueDescriptionInput({
  id,
  value,
  maxLength,
  minHintLength,
  placeholder,
  disabled = false,
  onChange,
  onEnvironmentsFromVoice,
  onKeyDown,
}: IssueDescriptionInputProps) {
  const voice = useIssueDescriptionVoice({
    onApplyTranscript: onChange,
    onApplyEnvironments: onEnvironmentsFromVoice,
  })

  const voiceDisabled = disabled || !voice.speechSupported || voice.isFinalizing
  const micLabel = voice.isListening ? 'Stop voice input' : 'Dictate issue description'

  const showLivePreview = voice.isListening && voice.liveTranscript.length > 0

  return (
    <div className="space-y-2">
      <Label htmlFor={id} required>
        Issue Description
      </Label>

      <div className="relative">
        <Textarea
          id={id}
          rows={8}
          autoFocus
          placeholder={placeholder}
          value={value}
          disabled={disabled || voice.isListening}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          maxLength={maxLength}
          className={cn('min-h-[180px] pr-14', voice.isListening && 'border-brand/60')}
          aria-describedby={`${id}-voice-hint`}
        />
        {voice.speechSupported && (
          <button
            type="button"
            disabled={voiceDisabled}
            onClick={voice.toggleVoice}
            aria-label={micLabel}
            aria-pressed={voice.isListening}
            title={micLabel}
            className={cn(
              'absolute right-3 top-3 inline-flex size-10 items-center justify-center rounded-xl border transition-all',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-elevated',
              'disabled:cursor-not-allowed disabled:opacity-40',
              voice.isListening
                ? 'border-danger/40 bg-danger/10 text-danger animate-pulse'
                : 'border-border-strong bg-surface-elevated text-text-secondary hover:border-brand/40 hover:text-brand',
            )}
          >
            {voice.isListening ? StopIcon : MicIcon}
          </button>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 text-xs text-text-muted">
        <p id={`${id}-voice-hint`}>
          {voice.isListening ? (
            <span className="font-medium text-brand" role="status" aria-live="polite">
              Listening… tap mic to stop
            </span>
          ) : (
            <span>
              Type or tap the mic — say production, beta, or canary to set environment
            </span>
          )}
        </p>
        <span className="shrink-0 tabular-nums">
          {value.length}/{maxLength}
        </span>
      </div>

      {showLivePreview && (
        <p
          className="rounded-lg border border-brand/30 bg-brand/5 px-3 py-2 text-sm leading-relaxed text-text-secondary"
          role="status"
          aria-live="polite"
        >
          {voice.liveTranscript}
        </p>
      )}

      {voice.error && (
        <p
          role="alert"
          className="rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 text-xs leading-relaxed text-danger"
        >
          {voice.error}
        </p>
      )}

      {!voice.speechSupported && (
        <p className="text-xs text-text-muted">
          Voice dictation works in Chrome and Edge on desktop.
        </p>
      )}

      {value.trim().length > 0 &&
        value.trim().length < minHintLength &&
        !voice.isListening && (
          <p className="text-xs text-text-muted">
            Add a bit more detail (at least {minHintLength} characters).
          </p>
        )}
    </div>
  )
}
