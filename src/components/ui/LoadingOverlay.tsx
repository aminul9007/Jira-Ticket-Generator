import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { Spinner } from './Spinner'

interface LoadingOverlayProps {
  isLoading: boolean
  label?: string
  children: ReactNode
  className?: string
}

export function LoadingOverlay({
  isLoading,
  label = 'Loading',
  children,
  className,
}: LoadingOverlayProps) {
  return (
    <div className={cn('relative', className)}>
      {children}
      {isLoading && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-2xl bg-overlay backdrop-blur-[2px]"
          aria-busy="true"
          aria-live="polite"
        >
          <Spinner size="lg" className="text-brand" label={label} />
          <p className="text-sm font-medium text-text-secondary">{label}</p>
        </div>
      )}
    </div>
  )
}
