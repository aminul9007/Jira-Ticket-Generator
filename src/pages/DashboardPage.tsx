import { useCallback } from 'react'
import { BugReportForm } from '../components/forms/BugReportForm'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { PageHeader } from '../components/layout/PageHeader'
import { TicketPreviewPanel } from '../components/ticket/TicketPreviewPanel'
import { useBugReportAssistant } from '../hooks/useBugReportAssistant'

export function DashboardPage() {
  const { form, ticket } = useBugReportAssistant()
  const { generate: generateTicket, isGenerating, data, hasGenerated } = ticket

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
        description="Capture bug details in under a minute. Fill in the form and generate a Jira-style preview from your input—AI enhancement is planned for a later phase."
      />

      <div className="grid gap-6 xl:grid-cols-2 xl:gap-8 xl:items-start">
        <div className="xl:sticky xl:top-24">
          <BugReportForm
            values={form.values}
            isGenerating={isGenerating}
            isValid={form.isValid}
            onCategoryChange={form.setCategory}
            onEnvironmentToggle={form.toggleEnvironment}
            onTitleChange={form.setTitle}
            onNotesChange={form.setAdditionalNotes}
            onGenerate={onGenerate}
          />
        </div>

        <TicketPreviewPanel
          ticket={data}
          hasGenerated={hasGenerated}
          isGenerating={isGenerating}
        />
      </div>
    </DashboardLayout>
  )
}
