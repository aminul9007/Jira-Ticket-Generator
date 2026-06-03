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
        title="QA Context Settings"
        description="Configure product-specific context so AI-generated tickets use your team's naming, environments, and categories."
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
