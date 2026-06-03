import { useCallback } from 'react'
import { BugReportForm } from '../components/forms/BugReportForm'
import { DashboardLayout } from '../components/layout/DashboardLayout'
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
      <div className="mb-6">
        <p className="max-w-2xl text-sm text-text-secondary">
          Capture bug details in under a minute. Fill in the form on the left and
          generate a Jira-style preview on the right from your input. AI
          enhancement is planned for a later phase.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
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
        <TicketPreviewPanel ticket={data} hasGenerated={hasGenerated} />
      </div>
    </DashboardLayout>
  )
}
