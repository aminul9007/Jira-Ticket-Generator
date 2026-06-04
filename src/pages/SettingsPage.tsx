import { QaContextForm } from '../components/settings/QaContextForm'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { PageHeader } from '../components/layout/PageHeader'

interface SettingsPageProps {
  onBack: () => void
}

export function SettingsPage({ onBack }: SettingsPageProps) {
  return (
    <DashboardLayout
      activePage="settings"
      onNavigate={(page) => {
        if (page === 'dashboard') onBack()
      }}
    >
      <PageHeader
        title="Project Knowledge Base"
        description="Configure project context, testing standards, and terminology so AI-generated tickets match your team's patterns."
      />

      <div className="max-w-2xl">
        <QaContextForm />
      </div>

      <p className="mt-6 text-sm text-text-muted">
        <button
          type="button"
          className="font-medium text-brand hover:text-brand-hover"
          onClick={onBack}
        >
          ← Back to dashboard
        </button>
      </p>
    </DashboardLayout>
  )
}
