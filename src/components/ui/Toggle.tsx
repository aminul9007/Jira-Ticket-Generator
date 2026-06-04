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
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <label htmlFor={id} className="text-sm font-medium text-text-primary">
          {label}
        </label>
        {description && (
          <p className="mt-1 text-xs leading-relaxed text-text-muted">{description}</p>
        )}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          checked
            ? 'border-brand bg-brand'
            : 'border-border-strong bg-surface-subtle',
        )}
      >
        <span
          className={cn(
            'inline-block size-5 rounded-full bg-white shadow-sm transition-transform',
            checked ? 'translate-x-5' : 'translate-x-1',
          )}
        />
      </button>
    </div>
  )
}
