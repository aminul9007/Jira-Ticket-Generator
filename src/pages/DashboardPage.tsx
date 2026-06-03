import { useCallback } from 'react'
import { TicketHistoryPanel } from '../components/history/TicketHistoryPanel'
import { BugReportForm } from '../components/forms/BugReportForm'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { PageHeader } from '../components/layout/PageHeader'
import { TicketPreviewPanel } from '../components/ticket/TicketPreviewPanel'
import { useBugReportAssistant } from '../hooks/useBugReportAssistant'

export function DashboardPage() {
  const { form, inputQuality, ticket } = useBugReportAssistant()
  const { generate: generateTicket, isGenerating, data, hasGenerated, usedAi } =
    ticket

  const onGenerate = useCallback(async () => {
    const success = await generateTicket()
    if (success) {
      document
        .getElementById('ticket-preview')
        ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [generateTicket])

  return (
    <DashboardLayout>
      <PageHeader
        title="Create a bug report"
        description="Enter minimal details and get a Senior QA–quality Jira ticket with title options, confidence score, and developer-ready root-cause hints."
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
          ticket={data}
          hasGenerated={hasGenerated}
          isGenerating={isGenerating}
          usedAi={usedAi}
        />
      </div>

      <TicketHistoryPanel />
    </DashboardLayout>
  )
}
