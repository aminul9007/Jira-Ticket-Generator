import { cn } from '../../utils/cn'

interface ToggleProps {
  id: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  label: string
  description?: string
}

export function Toggle({
  id,
  checked,
  onChange,
  disabled = false,
  label,
  description,
}: ToggleProps) {
  const descriptionId = description ? `${id}-description` : undefined

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <span id={`${id}-label`} className="text-sm font-medium text-text-primary">
          {label}
        </span>
        {description && (
          <p id={descriptionId} className="mt-1 text-xs leading-relaxed text-text-muted">
            {description}
          </p>
        )}
      </div>
      <label
        htmlFor={id}
        className={cn(
          'relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border transition-colors',
          'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand/40 has-[:focus-visible]:ring-offset-2',
          disabled && 'cursor-not-allowed opacity-50',
          checked
            ? 'border-brand bg-brand'
            : 'border-border-strong bg-surface-subtle',
        )}
      >
        <input
          id={id}
          type="checkbox"
          role="switch"
          checked={checked}
          disabled={disabled}
          aria-labelledby={`${id}-label`}
          aria-describedby={descriptionId}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none inline-block size-5 rounded-full bg-white shadow-sm transition-transform',
            checked ? 'translate-x-5' : 'translate-x-1',
          )}
        />
      </label>
    </div>
  )
}
