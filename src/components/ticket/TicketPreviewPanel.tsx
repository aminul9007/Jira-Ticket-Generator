import type { JiraCreationState } from '../../hooks/useJiraIssueCreation'
import type { TicketEditor } from '../../hooks/useTicketEditor'
import type { TicketFeedbackRating } from '../../types/ticketFeedback'
import { Card, CardHeader } from '../ui/Card'
import { LoadingOverlay } from '../ui/LoadingOverlay'
import { TicketEditorCard } from './TicketEditorCard'
import { TicketPreviewEmpty } from './TicketPreviewEmpty'
import { TicketPreviewSkeleton } from './TicketPreviewSkeleton'

interface TicketPreviewPanelProps {
  editor: TicketEditor
  hasGenerated: boolean
  isGenerating: boolean
  usedAi?: boolean
  feedback?: {
    rating: TicketFeedbackRating | null
    canSubmit: boolean
    submit: (rating: TicketFeedbackRating) => void
  }
  jiraCreation: JiraCreationState
  isCreatingJira?: boolean
  onCreateJira: () => void
  onCopySuccess: () => void
  onDismissJiraStatus?: () => void
}

const PreviewIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
    <path
      d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V5C15 6.10457 14.1046 7 13 7H11C9.89543 7 9 6.10457 9 5V5Z"
      stroke="currentColor"
      strokeWidth="1.75"
    />
    <path
      d="M9 12H15M9 16H13"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
  </svg>
)

export function TicketPreviewPanel({
  editor,
  hasGenerated,
  isGenerating,
  usedAi = false,
  feedback,
  jiraCreation,
  isCreatingJira = false,
  onCreateJira,
  onCopySuccess,
  onDismissJiraStatus,
}: TicketPreviewPanelProps) {
  if (isGenerating && !hasGenerated) {
    return (
      <Card id="ticket-preview" variant="elevated" className="min-h-[420px] lg:min-h-[520px]">
        <CardHeader
          title="Ticket Editor"
          description="Senior QA Lead is drafting your ticket…"
          icon={PreviewIcon}
        />
        <LoadingOverlay isLoading label="Analyzing input and generating ticket…">
          <TicketPreviewSkeleton />
        </LoadingOverlay>
      </Card>
    )
  }

  if (!hasGenerated || !editor.editedTicket) {
    return (
      <LoadingOverlay
        isLoading={isGenerating}
        label="Regenerating ticket…"
        className="h-full"
      >
        <TicketPreviewEmpty />
      </LoadingOverlay>
    )
  }

  return (
    <LoadingOverlay
      isLoading={isGenerating}
      label="Regenerating ticket…"
      className="h-full"
    >
      <TicketEditorCard
        editor={editor}
        usedAi={usedAi}
        feedback={
          feedback
            ? {
                rating: feedback.rating,
                canSubmit: feedback.canSubmit,
                onSubmit: feedback.submit,
              }
            : undefined
        }
        jiraCreation={jiraCreation}
        isCreatingJira={isCreatingJira}
        onCreateJira={onCreateJira}
        onCopySuccess={onCopySuccess}
        onDismissJiraStatus={onDismissJiraStatus}
      />
    </LoadingOverlay>
  )
}
