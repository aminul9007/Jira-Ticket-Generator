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

interface DashboardPageProps {
  onOpenSettings: () => void
}

export function DashboardPage({ onOpenSettings }: DashboardPageProps) {
  const { form, inputQuality, ticket, editor, recentTickets, feedback, reopenRecentTicket } =
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
    <DashboardLayout
      activePage="dashboard"
      onNavigate={(page) => {
        if (page === 'settings') onOpenSettings()
      }}
    >
      <PageHeader
        title="Quick bug ticket"
        description="Describe the issue (type or mic), generate a Jira-ready ticket, edit if needed, then create in Jira."
      />

      <div className="grid gap-6 xl:grid-cols-2 xl:gap-8 xl:items-start">
        <div className="xl:sticky xl:top-24">
          <BugReportForm
            values={form.values}
            inputQuality={inputQuality}
            isGenerating={isGenerating}
            isValid={form.isValid}
            onEnvironmentToggle={form.toggleEnvironment}
            onSetEnvironments={form.setEnvironments}
            onIssueDescriptionChange={form.setIssueDescription}
            onGenerate={onGenerate}
          />
        </div>

        <TicketPreviewPanel
          editor={editor}
          hasGenerated={hasGenerated}
          isGenerating={isGenerating}
          usedAi={usedAi}
          feedback={feedback}
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
