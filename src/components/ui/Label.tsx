import type { LabelHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode
  required?: boolean
  hint?: string
}

export function Label({
  children,
  required,
  hint,
  className,
  ...props
}: LabelProps) {
  return (
    <div className="mb-1.5">
      <label
        className={cn(
          'block text-sm font-medium text-text-primary',
          className,
        )}
        {...props}
      >
        {children}
        {required && (
          <span className="ml-0.5 text-danger" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {hint && (
        <p className="mt-0.5 text-xs text-text-muted">{hint}</p>
      )}
    </div>
  )
}
