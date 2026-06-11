import { formatJiraTicket } from '../../utils/formatJiraTicket'
import { useAppSettings } from '../../hooks/useAppSettings'
import type { TicketEditor } from '../../hooks/useTicketEditor'
import type { JiraCreationState } from '../../hooks/useJiraIssueCreation'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { SegmentedControl } from '../ui/SegmentedControl'
import { JiraCreationStatus } from './JiraCreationStatus'

interface TicketEditorToolbarProps {
  editor: TicketEditor
  usedAi?: boolean
  jiraCreation: JiraCreationState
  isCreatingJira?: boolean
  onCreateJira: () => void
  onCopySuccess: () => void
  onDismissJiraStatus?: () => void
}

export function TicketEditorToolbar({
  editor,
  usedAi = false,
  jiraCreation,
  isCreatingJira = false,
  onCreateJira,
  onCopySuccess,
  onDismissJiraStatus,
}: TicketEditorToolbarProps) {
  const { settings } = useAppSettings()
  const { viewMode, setViewMode, editedTicket, hasModifications, resetToGenerated } =
    editor

  const handleCopy = async () => {
    if (!editedTicket) return
    try {
      await navigator.clipboard.writeText(
        formatJiraTicket(editedTicket, settings.ticketTemplate),
      )
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
            variant="ghost"
            size="sm"
            fullWidth
            className="sm:w-auto"
            disabled={!editedTicket}
            onClick={() => void handleCopy()}
          >
            Copy wiki text
          </Button>
          <Button
            variant="primary"
            size="sm"
            fullWidth
            className="sm:w-auto"
            disabled={!editedTicket || isCreatingJira}
            isLoading={isCreatingJira}
            onClick={onCreateJira}
          >
            Create Jira Ticket
          </Button>
        </div>
      </div>

      <JiraCreationStatus state={jiraCreation} onDismiss={onDismissJiraStatus} />

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
