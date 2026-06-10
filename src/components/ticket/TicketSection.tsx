import type { ReactNode } from 'react'

interface TicketSectionProps {
  title: string
  children: ReactNode
}

export function TicketSection({ title, children }: TicketSectionProps) {
  return (
    <section className="rounded-xl border border-border/80 bg-surface-subtle/30 p-4 sm:p-5">
      <h3 className="type-ticket-label mb-3">{title}</h3>
      <div className="type-ticket-content">{children}</div>
    </section>
  )
}
