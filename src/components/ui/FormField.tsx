import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface FormFieldProps {
  children: ReactNode
  className?: string
}

export function FormField({ children, className }: FormFieldProps) {
  return <div className={cn('space-y-3', className)}>{children}</div>
}

interface FormSectionProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export function FormSection({
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <section className={cn('space-y-4', className)}>
      <div className="border-b border-border pb-3.5">
        <h3 className="type-overline">{title}</h3>
        {description && (
          <p className="type-body-secondary mt-1.5">{description}</p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  )
}
