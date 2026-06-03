import { useId, useState, type ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface CollapsibleProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
  badge?: ReactNode
  className?: string
}

export function Collapsible({
  title,
  children,
  defaultOpen = false,
  badge,
  className,
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const panelId = useId()

  return (
    <div className={cn('rounded-xl border border-border/80 bg-surface-subtle/30', className)}>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">
          {title}
        </span>
        <span className="flex items-center gap-2">
          {badge}
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className={cn(
              'shrink-0 text-text-muted transition-transform duration-200',
              isOpen && 'rotate-180',
            )}
            aria-hidden="true"
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
      </button>
      {isOpen && (
        <div id={panelId} className="border-t border-border/60 px-4 py-3 text-sm leading-relaxed text-text-primary">
          {children}
        </div>
      )}
    </div>
  )
}
