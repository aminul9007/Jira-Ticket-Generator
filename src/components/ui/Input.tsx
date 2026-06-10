import type { InputHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean
}

export function Input({ className, hasError, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'w-full rounded-xl border bg-surface-subtle/50 px-3.5 py-3 text-[0.9375rem] leading-6 text-text-primary',
        'placeholder:text-text-muted/80 transition-all duration-150',
        'focus-visible:outline-none focus-visible:border-brand focus-visible:bg-surface-elevated focus-visible:ring-[3px] focus-visible:ring-brand/15',
        'disabled:cursor-not-allowed disabled:bg-disabled-surface disabled:opacity-60',
        hasError
          ? 'border-danger focus-visible:ring-danger/15'
          : 'border-border-strong hover:border-hover-border hover:bg-surface-elevated',
        className,
      )}
      {...props}
    />
  )
}
