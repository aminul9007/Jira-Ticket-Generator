import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { cn } from '../../utils/cn'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Label } from '../ui/Label'

interface TagListEditorProps {
  id: string
  label: string
  hint?: string
  placeholder?: string
  values: string[]
  onChange: (values: string[]) => void
  className?: string
}

export function TagListEditor({
  id,
  label,
  hint,
  placeholder = 'Type and press Enter',
  values,
  onChange,
  className,
}: TagListEditorProps) {
  const [draft, setDraft] = useState('')

  const addValue = () => {
    const trimmed = draft.trim()
    if (!trimmed) return
    const exists = values.some((v) => v.toLowerCase() === trimmed.toLowerCase())
    if (!exists) {
      onChange([...values, trimmed])
    }
    setDraft('')
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      addValue()
    }
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    addValue()
  }

  const removeValue = (index: number) => {
    onChange(values.filter((_, i) => i !== index))
  }

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id} hint={hint}>
        {label}
      </Label>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          id={id}
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button type="submit" variant="secondary" size="md" disabled={!draft.trim()}>
          Add
        </Button>
      </form>

      {values.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {values.map((value, index) => (
            <li key={`${value}-${index}`}>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-elevated py-1 pl-3 pr-1.5 text-sm text-text-primary">
                {value}
                <button
                  type="button"
                  className="rounded-full p-0.5 text-text-muted transition-colors hover:bg-hover-surface hover:text-text-primary"
                  aria-label={`Remove ${value}`}
                  onClick={() => removeValue(index)}
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                      d="M4 4L12 12M12 4L4 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-text-muted">No items yet.</p>
      )}
    </div>
  )
}
