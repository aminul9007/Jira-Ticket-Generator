import { useCallback } from 'react'
import { BugReportForm } from '../components/forms/BugReportForm'
import { RecentTicketsPanel } from '../components/history/RecentTicketsPanel'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { PageHeader } from '../components/layout/PageHeader'
import { TicketPreviewPanel } from '../components/ticket/TicketPreviewPanel'
import { Toast } from '../components/ui/Toast'
import { useToast } from '../hooks/useToast'
import { useBugReportAssistant } from '../hooks/useBugReportAssistant'
import type { RecentTicketRecord } from '../types/recentTicket'

export function DashboardPage() {
  const { form, inputQuality, ticket, editor, recentTickets, reopenRecentTicket } =
    useBugReportAssistant()
  const { generate: generateTicket, isGenerating, hasGenerated, usedAi } = ticket
  const { toast, showToast } = useToast()

  const onGenerate = useCallback(async () => {
    const success = await generateTicket()
    if (success) {
      document
        .getElementById('ticket-preview')
        ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [generateTicket])

  const onCopySuccess = useCallback(() => {
    showToast('Jira ticket copied to clipboard')
  }, [showToast])

  const onOpenRecentTicket = useCallback(
    (record: RecentTicketRecord) => {
      reopenRecentTicket(record)
      document
        .getElementById('ticket-preview')
        ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    },
    [reopenRecentTicket],
  )

  return (
    <DashboardLayout>
      <PageHeader
        title="Create a bug report"
        description="Generate a ticket, edit inline, copy to Jira, and revisit recent tickets saved on this device."
      />

      <div className="grid gap-6 xl:grid-cols-2 xl:gap-8 xl:items-start">
        <div className="xl:sticky xl:top-24">
          <BugReportForm
            values={form.values}
            inputQuality={inputQuality}
            isGenerating={isGenerating}
            isValid={form.isValid}
            onCategoryChange={form.setCategory}
            onEnvironmentToggle={form.toggleEnvironment}
            onTitleChange={form.setTitle}
            onAffectedFeatureChange={form.setAffectedFeaturePage}
            onNotesChange={form.setAdditionalNotes}
            onGenerate={onGenerate}
          />
        </div>

        <TicketPreviewPanel
          editor={editor}
          hasGenerated={hasGenerated}
          isGenerating={isGenerating}
          usedAi={usedAi}
          onCopySuccess={onCopySuccess}
        />
      </div>

      <RecentTicketsPanel
        recentTickets={recentTickets}
        onOpen={onOpenRecentTicket}
      />
      <Toast toast={toast} />
    </DashboardLayout>
  )
}
