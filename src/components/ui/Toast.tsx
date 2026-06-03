import { cn } from '../../utils/cn'

interface ToastState {
  message: string
  id: number
}

interface ToastProps {
  toast: ToastState | null
}

export function Toast({ toast }: ToastProps) {
  if (!toast) return null

  return (
    <div
      className="pointer-events-none fixed bottom-5 left-1/2 z-[200] -translate-x-1/2 px-4 sm:bottom-6"
      role="status"
      aria-live="polite"
    >
      <div
        className={cn(
          'flex items-center gap-2 rounded-xl border border-border bg-surface-elevated px-4 py-3 shadow-card-hover ring-card',
          'animate-fade-in',
        )}
      >
        <span className="flex size-6 items-center justify-center rounded-full bg-badge-success-bg text-badge-success-text">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M3.5 8.5L6.5 11.5L12.5 4.5"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <p className="text-sm font-medium text-text-primary">{toast.message}</p>
      </div>
    </div>
  )
}

export type { ToastState }
