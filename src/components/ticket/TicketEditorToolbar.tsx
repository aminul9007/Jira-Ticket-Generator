import { formatJiraTicket } from '../../utils/formatJiraTicket'
import type { TicketEditor } from '../../hooks/useTicketEditor'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { SegmentedControl } from '../ui/SegmentedControl'

interface TicketEditorToolbarProps {
  editor: TicketEditor
  onCopySuccess: () => void
  usedAi?: boolean
}

export function TicketEditorToolbar({
  editor,
  onCopySuccess,
  usedAi = false,
}: TicketEditorToolbarProps) {
  const { viewMode, setViewMode, editedTicket, hasModifications, resetToGenerated } =
    editor

  const handleCopy = async () => {
    if (!editedTicket) return
    try {
      await navigator.clipboard.writeText(formatJiraTicket(editedTicket))
      onCopySuccess()
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="mb-5 space-y-3 rounded-xl border border-border/80 bg-surface-subtle/40 p-3 sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SegmentedControl
          ariaLabel="Ticket view mode"
          value={viewMode}
          options={[
            { value: 'preview', label: 'Preview' },
            { value: 'edit', label: 'Edit' },
          ]}
          onChange={setViewMode}
        />

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            variant="secondary"
            size="sm"
            fullWidth
            className="sm:w-auto"
            disabled={!hasModifications}
            onClick={resetToGenerated}
          >
            Reset to generated
          </Button>
          <Button
            variant="primary"
            size="sm"
            fullWidth
            className="sm:w-auto"
            disabled={!editedTicket}
            onClick={handleCopy}
          >
            Copy Jira ticket
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        {usedAi && <Badge variant="brand">AI enhanced</Badge>}
        {hasModifications ? (
          <Badge variant="warning">
            {editor.modifiedFields.size} field
            {editor.modifiedFields.size === 1 ? '' : 's'} modified
          </Badge>
        ) : (
          <Badge variant="success">Matches generated version</Badge>
        )}
        {viewMode === 'edit' && (
          <span className="text-text-muted">Changes save automatically</span>
        )}
      </div>
    </div>
  )
}
