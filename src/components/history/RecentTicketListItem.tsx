import type { RecentTicketRecord } from '../../types/recentTicket'
import {
  formatRecentTicketDate,
  formatRecentTicketRelative,
} from '../../utils/formatRecentTicketDate'
import { cn } from '../../utils/cn'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'

interface RecentTicketListItemProps {
  record: RecentTicketRecord
  isActive: boolean
  onOpen: (record: RecentTicketRecord) => void
  onDelete: (id: string) => void
}

export function RecentTicketListItem({
  record,
  isActive,
  onOpen,
  onDelete,
}: RecentTicketListItemProps) {
  const { ticket } = record

  return (
    <article
      className={cn(
        'rounded-xl border p-4 transition-colors',
        isActive
          ? 'border-brand/50 bg-brand-subtle/40 ring-1 ring-brand/20'
          : 'border-border/80 bg-surface-subtle/30 hover:border-hover-border hover:bg-surface-elevated',
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="type-body line-clamp-2 font-medium leading-snug">
            {ticket.title}
          </p>
          <p className="type-helper mt-1.5">
            <time dateTime={record.createdAt} title={formatRecentTicketDate(record.createdAt)}>
              {formatRecentTicketRelative(record.createdAt)}
              <span className="mx-1.5 text-border-strong">·</span>
              {formatRecentTicketDate(record.createdAt)}
            </time>
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Badge variant="brand">{ticket.category}</Badge>
            {ticket.environments.map((env) => (
              <Badge key={env} variant="neutral">
                {env}
              </Badge>
            ))}
            <Badge variant="default">{ticket.severity}</Badge>
            <Badge variant="default">{ticket.priority}</Badge>
            {record.usedAi && <Badge variant="brand">AI</Badge>}
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          <Button variant="secondary" size="sm" onClick={() => onOpen(record)}>
            Open
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-danger hover:text-danger"
            onClick={() => onDelete(record.id)}
            aria-label={`Delete ticket ${ticket.title}`}
          >
            Delete
          </Button>
        </div>
      </div>
    </article>
  )
}
