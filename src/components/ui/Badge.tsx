import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

type BadgeVariant = 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'neutral'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-slate-100/90 text-slate-700 ring-1 ring-inset ring-slate-200/80',
  brand: 'bg-brand-muted text-brand ring-1 ring-inset ring-brand/10',
  success: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200/60',
  warning: 'bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200/60',
  danger: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200/60',
  neutral: 'bg-slate-50 text-text-secondary ring-1 ring-inset ring-slate-200/70',
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
