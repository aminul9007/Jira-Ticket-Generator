import type { GeneratedTicket } from '../../types/bugReport'
import { TicketPreviewCard } from './TicketPreviewCard'
import { TicketPreviewEmpty } from './TicketPreviewEmpty'

interface TicketPreviewPanelProps {
  ticket: GeneratedTicket | null
  hasGenerated: boolean
}

export function TicketPreviewPanel({
  ticket,
  hasGenerated,
}: TicketPreviewPanelProps) {
  if (!hasGenerated || !ticket) {
    return <TicketPreviewEmpty />
  }

  return <TicketPreviewCard ticket={ticket} isGenerated />
}
