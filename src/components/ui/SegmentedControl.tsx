import { cn } from '../../utils/cn'

interface SegmentedControlOption<T extends string> {
  value: T
  label: string
}

interface SegmentedControlProps<T extends string> {
  value: T
  options: SegmentedControlOption<T>[]
  onChange: (value: T) => void
  ariaLabel: string
  className?: string
}

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
  className,
}: SegmentedControlProps<T>) {
  const groupName = ariaLabel.replace(/\s+/g, '-').toLowerCase()

  return (
    <div
      className={cn(
        'inline-flex rounded-xl border border-border bg-surface-subtle p-1',
        className,
      )}
      role="radiogroup"
      aria-label={ariaLabel}
    >
      {options.map((option) => {
        const isActive = option.value === value
        const inputId = `${groupName}-${option.value}`
        return (
          <label
            key={option.value}
            htmlFor={inputId}
            className={cn(
              'cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition-all sm:px-4 sm:text-sm',
              'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand has-[:focus-visible]:ring-offset-1 has-[:focus-visible]:ring-offset-surface-elevated',
              isActive
                ? 'bg-surface-elevated text-text-primary shadow-sm'
                : 'text-text-muted hover:text-text-secondary',
            )}
          >
            <input
              id={inputId}
              type="radio"
              name={groupName}
              checked={isActive}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        )
      })}
    </div>
  )
}
