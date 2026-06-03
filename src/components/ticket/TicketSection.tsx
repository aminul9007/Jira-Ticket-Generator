import type { ReactNode } from 'react'

interface TicketSectionProps {
  title: string
  children: ReactNode
}

export function TicketSection({ title, children }: TicketSectionProps) {
  return (
    <section className="rounded-xl border border-border/80 bg-surface-subtle/30 p-4">
      <h3 className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest text-text-muted">
        {title}
      </h3>
      <div className="text-sm leading-relaxed text-text-primary">{children}</div>
    </section>
  )
}
