import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../utils/cn'

type CardVariant = 'default' | 'elevated' | 'outline'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
  variant?: CardVariant
}

const paddingStyles = {
  none: '',
  sm: 'p-4 sm:p-5',
  md: 'p-5 sm:p-6 lg:p-7',
  lg: 'p-6 sm:p-8',
}

const variantStyles: Record<CardVariant, string> = {
  default:
    'border border-border bg-surface-elevated shadow-[var(--shadow-card)] ring-1 ring-black/[0.03]',
  elevated:
    'border border-border/80 bg-surface-elevated shadow-[var(--shadow-card-hover)] ring-1 ring-black/[0.04]',
  outline:
    'border border-dashed border-border-strong bg-brand-subtle/40 shadow-none',
}

export function Card({
  children,
  padding = 'md',
  variant = 'default',
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl transition-shadow duration-200',
        variantStyles[variant],
        paddingStyles[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  title: string
  description?: string
  action?: ReactNode
  icon?: ReactNode
}

export function CardHeader({ title, description, action, icon }: CardHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex gap-3">
        {icon && (
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-muted text-brand">
            {icon}
          </div>
        )}
        <div>
          <h2 className="text-base font-semibold tracking-tight text-text-primary sm:text-lg">
            {title}
          </h2>
          {description && (
            <p className="mt-1 max-w-prose text-sm leading-relaxed text-text-secondary">
              {description}
            </p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
