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
      <label className={cn('type-label', className)} {...props}>
        {children}
        {required && (
          <span className="type-helper ml-1.5 font-normal text-danger" aria-hidden="true">
            Required
          </span>
        )}
      </label>
      {hint && (
        <p id={hintId} className="type-field-hint">
          {hint}
        </p>
      )}
    </div>
  )
}
