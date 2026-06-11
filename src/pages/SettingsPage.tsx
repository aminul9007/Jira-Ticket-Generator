import { AiConfigSection } from '../components/settings/AiConfigSection'
import { DataHistorySection } from '../components/settings/DataHistorySection'
import { JiraIntegrationSection } from '../components/settings/JiraIntegrationSection'
import { QaTicketStandardsSection } from '../components/settings/QaTicketStandardsSection'
import { SettingsPageCard } from '../components/settings/SettingsPageCard'
import { TicketDefaultsSection } from '../components/settings/TicketDefaultsSection'
import { TicketTemplateSection } from '../components/settings/TicketTemplateSection'
import { VoiceSettingsSection } from '../components/settings/VoiceSettingsSection'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { PageHeader } from '../components/layout/PageHeader'
import { Button } from '../components/ui/Button'

interface SettingsPageProps {
  onBack: () => void
}

const AiIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinejoin="round"
    />
    <path d="M5 19h14M8 16h8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
)

const StandardsIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinejoin="round"
    />
    <path
      d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2Z"
      stroke="currentColor"
      strokeWidth="1.75"
    />
    <path d="M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
)

const VoiceIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Z"
      stroke="currentColor"
      strokeWidth="1.75"
    />
    <path d="M6 11v1a6 6 0 0 0 12 0v-1" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
)

const JiraIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M7 7h10v10H7V7Z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinejoin="round"
    />
    <path d="M12 7v10M7 12h10" stroke="currentColor" strokeWidth="1.75" />
  </svg>
)

const DefaultsIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M4 6h16M4 12h10M4 18h6"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
  </svg>
)

const TemplateIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
      stroke="currentColor"
      strokeWidth="1.75"
    />
    <path d="M8 9h8M8 13h5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
)

const DataIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M5 5h14v14H5V5Z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinejoin="round"
    />
    <path d="M9 9h6v6H9V9Z" stroke="currentColor" strokeWidth="1.75" />
  </svg>
)

const SECTION_LINKS = [
  { id: 'ai-config', label: 'AI' },
  { id: 'qa-standards', label: 'Standards' },
  { id: 'voice-settings', label: 'Voice' },
  { id: 'jira-integration', label: 'Jira' },
  { id: 'ticket-defaults', label: 'Defaults' },
  { id: 'ticket-template', label: 'Template' },
  { id: 'data-history', label: 'Data' },
] as const

export function SettingsPage({ onBack }: SettingsPageProps) {
  return (
    <DashboardLayout
      activePage="settings"
      onNavigate={(page) => {
        if (page === 'dashboard') onBack()
      }}
    >
      <PageHeader
        title="Settings"
        description="Tune AI quality, voice input, Jira integration, and defaults — built for fast QA workflows."
      />

      <nav
        aria-label="Settings sections"
        className="mb-6 flex flex-wrap gap-2"
      >
        {SECTION_LINKS.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            className="type-nav rounded-lg border border-border-strong bg-surface-elevated px-3 py-1.5 text-text-secondary transition-colors hover:border-brand/40 hover:text-brand"
          >
            {link.label}
          </a>
        ))}
      </nav>

      <div className="mx-auto flex max-w-3xl flex-col gap-6 pb-8">
        <SettingsPageCard
          id="ai-config"
          title="AI Configuration"
          description="Improve ticket quality and speed up generation with project-specific context."
          icon={AiIcon}
        >
          <AiConfigSection />
        </SettingsPageCard>

        <SettingsPageCard
          id="qa-standards"
          title="QA Ticket Standards"
          description="Structured QA writing rules that guide AI ticket generation — presets, toggles, and custom project rules."
          icon={StandardsIcon}
        >
          <QaTicketStandardsSection />
        </SettingsPageCard>

        <SettingsPageCard
          id="voice-settings"
          title="Voice Settings"
          description="Control dictation behavior on the Issue Description field."
          icon={VoiceIcon}
        >
          <VoiceSettingsSection />
        </SettingsPageCard>

        <SettingsPageCard
          id="jira-integration"
          title="Jira Integration"
          description="Connect Jira Cloud for future one-click issue creation."
          icon={JiraIcon}
        >
          <JiraIntegrationSection />
        </SettingsPageCard>

        <SettingsPageCard
          id="ticket-defaults"
          title="Ticket Defaults"
          description="Reduce repetitive fields when filing bugs to Jira."
          icon={DefaultsIcon}
        >
          <TicketDefaultsSection />
        </SettingsPageCard>

        <SettingsPageCard
          id="ticket-template"
          title="Ticket Template"
          description="Choose which fields appear in ticket previews, wiki exports, and Jira issues."
          icon={TemplateIcon}
        >
          <TicketTemplateSection />
        </SettingsPageCard>

        <SettingsPageCard
          id="data-history"
          title="Data & History"
          description="Manage locally stored ticket history on this device."
          icon={DataIcon}
        >
          <DataHistorySection />
        </SettingsPageCard>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
          <Button variant="ghost" size="sm" onClick={onBack}>
            ← Back to dashboard
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
