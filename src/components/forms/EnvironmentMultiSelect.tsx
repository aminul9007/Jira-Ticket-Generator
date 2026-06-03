import { ENVIRONMENTS } from '../../data/constants'
import type { Environment } from '../../types/bugReport'
import { cn } from '../../utils/cn'
import { FormField } from '../ui/FormField'

interface EnvironmentMultiSelectProps {
  selected: Environment[]
  onToggle: (env: Environment) => void
}

export function EnvironmentMultiSelect({
  selected,
  onToggle,
}: EnvironmentMultiSelectProps) {
  return (
    <FormField>
      <fieldset>
        <legend className="text-sm font-medium tracking-tight text-text-primary">
          Environment
          <span className="ml-1 text-xs font-normal text-danger">Required</span>
        </legend>
        <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-3">
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
                  'group relative flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
                  isSelected
                    ? 'border-brand bg-brand-muted text-brand shadow-sm shadow-brand/10'
                    : 'border-border-strong bg-surface-subtle/40 text-text-secondary hover:border-hover-border hover:bg-surface-elevated hover:text-text-primary',
                )}
              >
                <span
                  className={cn(
                    'flex size-4 shrink-0 items-center justify-center rounded-md border transition-colors',
                    isSelected
                      ? 'border-brand bg-brand text-white'
                      : 'border-border-strong bg-surface-elevated group-hover:border-hover-border',
                  )}
                  aria-hidden="true"
                >
                  {isSelected && (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2.5 6L5 8.5L9.5 3.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                {env}
              </button>
            )
          })}
        </div>
      </fieldset>
    </FormField>
  )
}
