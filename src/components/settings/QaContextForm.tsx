import { useQaContext } from '../../hooks/useQaContext'
import { Button } from '../ui/Button'
import { Card, CardHeader } from '../ui/Card'
import { FormField } from '../ui/FormField'
import { Input } from '../ui/Input'
import { Label } from '../ui/Label'
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
        title="QA Context"
        description="Saved locally and included in every AI ticket request to improve naming and accuracy."
        icon={SettingsIcon}
        action={
          isConfigured ? (
            <span className="rounded-full bg-brand-muted px-3 py-1 text-xs font-medium text-brand">
              Active
            </span>
          ) : undefined
        }
      />

      <div className="space-y-6">
        <FormField>
          <Label htmlFor="product-name" hint="Used in titles and summaries when relevant">
            Product Name
          </Label>
          <Input
            id="product-name"
            value={settings.productName}
            placeholder="e.g. Acme Commerce Platform"
            onChange={(e) => updateSettings({ productName: e.target.value })}
          />
        </FormField>

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
          id="common-categories"
          label="Common Bug Categories"
          hint="Categories your QA team uses most often"
          placeholder="e.g. UI Bug, Functional Bug"
          values={settings.commonBugCategories}
          onChange={(commonBugCategories) => updateSettings({ commonBugCategories })}
        />

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
