import { ENVIRONMENTS } from '../../data/constants'
import type { Environment } from '../../types/bugReport'
import { cn } from '../../utils/cn'
import { FormField } from '../ui/FormField'

interface EnvironmentMultiSelectProps {
  selected: Environment[]
  onToggle: (env: Environment) => void
  optional?: boolean
}

export function EnvironmentMultiSelect({
  selected,
  onToggle,
  optional = false,
}: EnvironmentMultiSelectProps) {
  return (
    <FormField>
      <fieldset>
        <legend className="type-label">
          Environment
          {optional ? (
            <span className="type-helper ml-1.5 font-normal">Optional</span>
          ) : (
            <span className="type-helper ml-1.5 font-normal text-danger">Required</span>
          )}
        </legend>
        <p className="type-field-hint mt-0">
          {optional
            ? 'Leave blank to let AI infer from your description.'
            : 'Select where the issue was observed.'}
        </p>
        <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {ENVIRONMENTS.map((env) => {
            const isSelected = selected.includes(env)
            const inputId = `env-${env.toLowerCase()}`
            return (
              <label
                key={env}
                htmlFor={inputId}
                className={cn(
                  'group relative flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-150',
                  'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand has-[:focus-visible]:ring-offset-2',
                  isSelected
                    ? 'border-brand bg-brand-muted text-brand shadow-sm shadow-brand/10'
                    : 'border-border-strong bg-surface-subtle/40 text-text-secondary hover:border-hover-border hover:bg-surface-elevated hover:text-text-primary',
                )}
              >
                <input
                  id={inputId}
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggle(env)}
                  className="sr-only"
                />
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
              </label>
            )
          })}
        </div>
      </fieldset>
    </FormField>
  )
}
