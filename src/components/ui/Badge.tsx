import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

type BadgeVariant = 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'neutral'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-700',
  brand: 'bg-brand-muted text-brand',
  success: 'bg-emerald-50 text-success',
  warning: 'bg-amber-50 text-warning',
  danger: 'bg-red-50 text-danger',
  neutral: 'bg-slate-100 text-text-secondary',
}

export function Badge({
  children,
  variant = 'default',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
