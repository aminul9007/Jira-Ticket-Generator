import type { SelectHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean
}

export function Select({ className, hasError, children, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(
          'w-full appearance-none rounded-lg border bg-surface-elevated px-3 py-2.5 pr-10 text-sm text-text-primary',
          'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1',
          'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60',
          hasError
            ? 'border-danger focus-visible:ring-danger'
            : 'border-border-strong hover:border-slate-400',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <span
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
        aria-hidden="true"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  )
}
