import { useCallback } from 'react'
import { BugReportForm } from '../components/forms/BugReportForm'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { TicketPreviewCard } from '../components/ticket/TicketPreviewCard'
import { MOCK_TICKET } from '../data/mockTicket'
import { useBugReportForm } from '../hooks/useBugReportForm'

export function DashboardPage() {
  const {
    values,
    isGenerating,
    isValid,
    setCategory,
    toggleEnvironment,
    setTitle,
    setAdditionalNotes,
    handleGenerate,
  } = useBugReportForm()

  const onGenerate = useCallback(async () => {
    const success = await handleGenerate()
    if (success) {
      document
        .getElementById('ticket-preview')
        ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [handleGenerate])

  return (
    <DashboardLayout>
      <div className="mb-6">
        <p className="max-w-2xl text-sm text-text-secondary">
          Capture bug details in under a minute. Fill in the form on the left;
          the Jira-style preview on the right shows sample output until AI
          generation is enabled.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <BugReportForm
          values={values}
          isGenerating={isGenerating}
          isValid={isValid}
          onCategoryChange={setCategory}
          onEnvironmentToggle={toggleEnvironment}
          onTitleChange={setTitle}
          onNotesChange={setAdditionalNotes}
          onGenerate={onGenerate}
        />
        <TicketPreviewCard ticket={MOCK_TICKET} />
      </div>
    </DashboardLayout>
  )
}
