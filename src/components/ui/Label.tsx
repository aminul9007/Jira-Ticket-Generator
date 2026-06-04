import type { LabelHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode
  required?: boolean
  hint?: string
  hintId?: string
}

export function Label({
  children,
  required,
  hint,
  hintId,
  className,
  ...props
}: LabelProps) {
  return (
    <div>
      <label
        className={cn(
          'block text-sm font-medium tracking-tight text-text-primary',
          className,
        )}
        {...props}
      >
        {children}
        {required && (
          <span className="ml-1 text-xs font-normal text-danger" aria-hidden="true">
            Required
          </span>
        )}
      </label>
      {hint && (
        <p id={hintId} className="mt-1.5 text-xs leading-relaxed text-text-muted">
          {hint}
        </p>
      )}
    </div>
  )
}
