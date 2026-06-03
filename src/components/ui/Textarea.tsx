import type { TextareaHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean
}

export function Textarea({
  className,
  hasError,
  ...props
}: TextareaProps) {
  return (
    <textarea
      className={cn(
        'w-full resize-y rounded-lg border bg-surface-elevated px-3 py-2.5 text-sm text-text-primary',
        'placeholder:text-text-muted transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1',
        'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60',
        hasError
          ? 'border-danger focus-visible:ring-danger'
          : 'border-border-strong hover:border-slate-400',
        className,
      )}
      {...props}
    />
  )
}
