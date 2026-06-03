import type { ReactNode } from 'react'

interface TicketSectionProps {
  title: string
  children: ReactNode
}

export function TicketSection({ title, children }: TicketSectionProps) {
  return (
    <section className="border-b border-border pb-4 last:border-b-0 last:pb-0">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
        {title}
      </h3>
      <div className="text-sm leading-relaxed text-text-primary">{children}</div>
    </section>
  )
}
