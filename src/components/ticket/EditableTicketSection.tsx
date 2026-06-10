import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface EditableTicketSectionProps {
  title: string
  isModified?: boolean
  viewMode: 'preview' | 'edit'
  preview: ReactNode
  edit: ReactNode
  className?: string
}

export function EditableTicketSection({
  title,
  isModified = false,
  viewMode,
  preview,
  edit,
  className,
}: EditableTicketSectionProps) {
  return (
    <section
      className={cn(
        'rounded-xl border p-4 sm:p-5 transition-colors',
        isModified
          ? 'border-brand/40 bg-brand-subtle/50 ring-1 ring-brand/20'
          : 'border-border/80 bg-surface-subtle/30',
        className,
      )}
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h3 className="type-ticket-label">{title}</h3>
        {isModified && (
          <span className="type-micro rounded-full bg-brand-muted px-2 py-0.5 text-brand">
            Modified
          </span>
        )}
      </div>
      <div className="type-ticket-content">
        {viewMode === 'edit' ? edit : preview}
      </div>
    </section>
  )
}
