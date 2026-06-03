import { ENVIRONMENTS } from '../../data/constants'
import type { Environment } from '../../types/bugReport'
import { cn } from '../../utils/cn'

interface EnvironmentMultiSelectProps {
  selected: Environment[]
  onToggle: (env: Environment) => void
}

export function EnvironmentMultiSelect({
  selected,
  onToggle,
}: EnvironmentMultiSelectProps) {
  return (
    <fieldset>
      <legend className="mb-1.5 block text-sm font-medium text-text-primary">
        Environment
        <span className="ml-0.5 text-danger" aria-hidden="true">
          *
        </span>
      </legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {ENVIRONMENTS.map((env) => {
          const isSelected = selected.includes(env)
          return (
            <button
              key={env}
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              onClick={() => onToggle(env)}
              className={cn(
                'rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
                isSelected
                  ? 'border-brand bg-brand-muted text-brand'
                  : 'border-border-strong bg-surface-elevated text-text-secondary hover:border-slate-400 hover:text-text-primary',
              )}
            >
              {env}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
