import { useQaContext } from '../../hooks/useQaContext'
import { Button } from '../ui/Button'
import { Card, CardHeader } from '../ui/Card'
import { FormField } from '../ui/FormField'
import { Input } from '../ui/Input'
import { Label } from '../ui/Label'
import { Textarea } from '../ui/Textarea'
import { SettingsSection } from './SettingsSection'
import { TagListEditor } from './TagListEditor'

const SettingsIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 13.933 10.067 15.5 12 15.5Z"
      stroke="currentColor"
      strokeWidth="1.75"
    />
    <path
      d="M19.4 15A1.65 1.65 0 0 0 19.5 13.5L21 12L19.5 10.5A1.65 1.65 0 0 0 19.4 9L19.1 7.1L17.2 6.8A1.65 1.65 0 0 0 16 5.5L14.5 4L13 5.5A1.65 1.65 0 0 0 11.5 5.6L9.6 5.9L9.3 7.8A1.65 1.65 0 0 0 8 9L6.5 10.5L8 12A1.65 1.65 0 0 0 8.1 13.5L8.4 15.4L10.3 15.7A1.65 1.65 0 0 0 11.5 17L13 18.5L14.5 17A1.65 1.65 0 0 0 16 16.4L17.9 16.1L18.2 14.2A1.65 1.65 0 0 0 19.4 15Z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinejoin="round"
    />
  </svg>
)

export function QaContextForm() {
  const { settings, updateSettings, resetSettings, isConfigured } = useQaContext()

  return (
    <Card variant="elevated">
      <CardHeader
        title="Project Knowledge Base"
        description="Saved locally and included in every AI ticket request to improve consistency and quality."
        icon={SettingsIcon}
        action={
          isConfigured ? (
            <span className="rounded-full bg-brand-muted px-3 py-1 text-xs font-medium text-brand">
              Active
            </span>
          ) : undefined
        }
      />

      <div className="space-y-2">
        <SettingsSection
          title="Project"
          description="Core product identity and goals used in titles and summaries."
        >
          <FormField>
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              value={settings.projectName}
              placeholder="e.g. Acme Commerce Platform"
              onChange={(e) => updateSettings({ projectName: e.target.value })}
            />
          </FormField>

          <FormField>
            <Label htmlFor="project-overview" hint="Brief summary of what the project is">
              Project Overview
            </Label>
            <Textarea
              id="project-overview"
              rows={3}
              value={settings.projectOverview}
              placeholder="e.g. B2B SaaS platform for inventory and order management"
              onChange={(e) => updateSettings({ projectOverview: e.target.value })}
            />
          </FormField>

          <FormField>
            <Label htmlFor="product-description">Product Description</Label>
            <Textarea
              id="product-description"
              rows={4}
              value={settings.productDescription}
              placeholder="Key capabilities, user types, and main workflows"
              onChange={(e) => updateSettings({ productDescription: e.target.value })}
            />
          </FormField>

          <FormField>
            <Label htmlFor="product-goals">Product Goals</Label>
            <Textarea
              id="product-goals"
              rows={3}
              value={settings.productGoals}
              placeholder="Business or quality goals the team optimizes for"
              onChange={(e) => updateSettings({ productGoals: e.target.value })}
            />
          </FormField>
        </SettingsSection>

        <SettingsSection
          title="Testing & reporting"
          description="Guidelines the AI should follow when writing tickets."
        >
          <FormField>
            <Label htmlFor="testing-guidelines">Testing Guidelines</Label>
            <Textarea
              id="testing-guidelines"
              rows={4}
              value={settings.testingGuidelines}
              placeholder="e.g. Always test on Canary before Production; verify across Chrome and Safari"
              onChange={(e) => updateSettings({ testingGuidelines: e.target.value })}
            />
          </FormField>

          <FormField>
            <Label htmlFor="bug-reporting-standards">Bug Reporting Standards</Label>
            <Textarea
              id="bug-reporting-standards"
              rows={5}
              value={settings.bugReportingStandards}
              placeholder="Title format, required fields, severity rules, Jira conventions"
              onChange={(e) => updateSettings({ bugReportingStandards: e.target.value })}
            />
          </FormField>
        </SettingsSection>

        <SettingsSection
          title="Taxonomy"
          description="Common labels and terminology your team uses."
        >
          <TagListEditor
            id="common-environments"
            label="Common Environments"
            hint="Typical deployment environments for your product"
            placeholder="e.g. Staging, QA, Production"
            values={settings.commonEnvironments}
            onChange={(commonEnvironments) => updateSettings({ commonEnvironments })}
          />

          <TagListEditor
            id="common-features"
            label="Common Features"
            hint="Screens, modules, or flows your team reports bugs against"
            placeholder="e.g. Checkout, Login, Dashboard"
            values={settings.commonFeatures}
            onChange={(commonFeatures) => updateSettings({ commonFeatures })}
          />

          <TagListEditor
            id="team-terminology"
            label="Team Terminology"
            hint="Use term: definition format when helpful"
            placeholder="e.g. SSR: Server-side rendering"
            values={settings.teamTerminology}
            onChange={(teamTerminology) => updateSettings({ teamTerminology })}
          />
        </SettingsSection>

        <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-text-muted">
            Changes save automatically to this browser.
          </p>
          <Button variant="ghost" size="sm" onClick={resetSettings}>
            Reset to defaults
          </Button>
        </div>
      </div>
    </Card>
  )
}
