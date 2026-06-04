import type { KeyboardEvent } from 'react'
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition'
import type { VoiceInputMode } from '../../utils/voiceTranscript'
import { cn } from '../../utils/cn'
import { Label } from '../ui/Label'
import { Textarea } from '../ui/Textarea'

interface IssueDescriptionVoiceInputProps {
  id: string
  value: string
  maxLength: number
  minHintLength: number
  placeholder: string
  disabled?: boolean
  onChange: (value: string) => void
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

const statusLabels = {
  idle: 'Voice input ready',
  listening: 'Listening… speak now',
  processing: 'Processing speech…',
  unsupported: 'Voice input unavailable',
} as const

function ModeToggle({
  mode,
  onChange,
  disabled,
}: {
  mode: VoiceInputMode
  onChange: (mode: VoiceInputMode) => void
  disabled?: boolean
}) {
  return (
    <div
      className="inline-flex rounded-lg border border-border-strong bg-surface-subtle/50 p-0.5"
      role="group"
      aria-label="Voice input text mode"
    >
      {(['append', 'replace'] as const).map((option) => (
        <button
          key={option}
          type="button"
          disabled={disabled}
          aria-pressed={mode === option}
          onClick={() => onChange(option)}
          className={cn(
            'rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40',
            'disabled:cursor-not-allowed disabled:opacity-50',
            mode === option
              ? 'bg-surface-elevated text-text-primary shadow-sm'
              : 'text-text-muted hover:text-text-secondary',
          )}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

export function IssueDescriptionVoiceInput({
  id,
  value,
  maxLength,
  minHintLength,
  placeholder,
  disabled = false,
  onChange,
  onKeyDown,
}: IssueDescriptionVoiceInputProps) {
  const voice = useSpeechRecognition({ value, onChange, maxLength })

  const voiceDisabled =
    disabled || !voice.isSupported || voice.isProcessing
  const micLabel =
    voice.status === 'listening'
      ? 'Stop voice input'
      : voice.isProcessing
        ? 'Processing voice input'
        : 'Start voice input'

  return (
    <div className="space-y-3">
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
          aria-describedby={`${id}-voice-status`}
        />
        <button
          type="button"
          disabled={voiceDisabled}
          onClick={voice.toggleListening}
          aria-label={micLabel}
          aria-pressed={voice.isListening}
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
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <ModeToggle
            mode={voice.mode}
            onChange={voice.setMode}
            disabled={disabled || voice.isListening || voice.isProcessing}
          />
          <p
            id={`${id}-voice-status`}
            role="status"
            aria-live="polite"
            className={cn(
              'text-xs font-medium',
              voice.isListening ? 'text-brand' : 'text-text-muted',
            )}
          >
            {statusLabels[voice.status]}
          </p>
        </div>
        <span className="text-xs tabular-nums text-text-muted sm:text-right">
          {value.length}/{maxLength}
        </span>
      </div>

      {voice.error && (
        <p
          role="alert"
          className="rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 text-xs leading-relaxed text-danger"
        >
          {voice.error}
        </p>
      )}

      {!voice.isSupported && (
        <p className="text-xs text-text-muted">
          Voice input works best in Chrome and Edge on desktop.
        </p>
      )}

      {voice.isListening && (
        <p className="text-xs text-text-muted">
          {voice.mode === 'append'
            ? 'New speech will be added after your existing text.'
            : 'New speech will replace the field content for this session.'}
        </p>
      )}

      {value.trim().length > 0 && value.trim().length < minHintLength && !voice.isListening && (
        <p className="text-xs text-text-muted">
          Add a bit more detail (at least {minHintLength} characters) or use the mic.
        </p>
      )}
    </div>
  )
}
