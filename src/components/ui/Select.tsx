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
          'w-full appearance-none rounded-xl border bg-surface-subtle/50 px-3.5 py-3 pr-11 text-sm text-text-primary',
          'transition-all duration-150 focus-visible:outline-none focus-visible:border-brand focus-visible:bg-surface-elevated focus-visible:ring-[3px] focus-visible:ring-brand/15',
          'disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-60',
          hasError
            ? 'border-danger focus-visible:ring-danger/15'
            : 'border-border-strong hover:border-slate-300 hover:bg-surface-elevated',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <span
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted"
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
