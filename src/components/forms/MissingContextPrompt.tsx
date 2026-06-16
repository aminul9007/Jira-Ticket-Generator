import { useEffect, useState } from 'react'
import {
  MISSING_CONTEXT_FIELD_LABELS,
  type MissingContextField,
} from '../../utils/contextDetection/getMissingContextFields'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'

interface MissingContextPromptProps {
  fields: MissingContextField[]
  onAnswer: (field: MissingContextField, input: string) => { matchedLabel: string } | null
  onDismiss: () => void
}

export function MissingContextPrompt({
  fields,
  onAnswer,
  onDismiss,
}: MissingContextPromptProps) {
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)

  const currentField = fields[0]
  const isOpen = currentField !== undefined
  const meta = currentField ? MISSING_CONTEXT_FIELD_LABELS[currentField] : null

  useEffect(() => {
    setInput('')
    setError(null)
  }, [currentField])

  if (!isOpen || !meta) return null

  const handleSubmit = () => {
    const result = onAnswer(currentField, input)
    if (!result) {
      setError(`Couldn't match that. Try something like: ${meta.examples}`)
      return
    }
    setInput('')
    setError(null)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onDismiss}
      title="A few more details"
      description="We couldn't detect everything from your voice input. Please fill in the missing context."
      footer={
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onDismiss}>
            Skip for now
          </Button>
          <Button size="sm" onClick={handleSubmit} disabled={!input.trim()}>
            {fields.length > 1 ? 'Next' : 'Done'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {fields.length > 1 && (
          <p className="type-helper">{fields.length} details still needed</p>
        )}

        <div className="space-y-2">
          <label htmlFor="missing-context-input" className="type-label block">
            {meta.hint}
          </label>
          <input
            id="missing-context-input"
            type="text"
            autoFocus
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              setError(null)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleSubmit()
              }
            }}
            placeholder={meta.examples}
            className="w-full rounded-xl border border-border-strong bg-surface-elevated px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          />
          <p className="type-micro text-text-muted">{meta.examples}</p>
        </div>

        {error && (
          <p className="type-helper text-danger" role="alert">
            {error}
          </p>
        )}
      </div>
    </Modal>
  )
}
