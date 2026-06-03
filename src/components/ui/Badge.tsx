import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

type BadgeVariant = 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'neutral'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    'bg-badge-default-bg text-badge-default-text ring-1 ring-inset ring-badge-default-ring',
  brand: 'bg-brand-muted text-brand ring-1 ring-inset ring-brand/20',
  success:
    'bg-badge-success-bg text-badge-success-text ring-1 ring-inset ring-badge-success-ring',
  warning:
    'bg-badge-warning-bg text-badge-warning-text ring-1 ring-inset ring-badge-warning-ring',
  danger:
    'bg-badge-danger-bg text-badge-danger-text ring-1 ring-inset ring-badge-danger-ring',
  neutral:
    'bg-badge-neutral-bg text-text-secondary ring-1 ring-inset ring-badge-neutral-ring',
}

export function Badge({
  children,
  variant = 'default',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
