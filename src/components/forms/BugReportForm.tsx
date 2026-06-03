import type { FormEvent } from 'react'
import type { BugCategory, BugReportFormValues, Environment } from '../../types/bugReport'
import type { InputQualityReport } from '../../types/inputQuality'
import { Button } from '../ui/Button'
import { Card, CardHeader } from '../ui/Card'
import { FormField, FormSection } from '../ui/FormField'
import { Label } from '../ui/Label'
import { Textarea } from '../ui/Textarea'
import { AffectedFeatureField } from './AffectedFeatureField'
import { CategorySelect } from './CategorySelect'
import { EnvironmentMultiSelect } from './EnvironmentMultiSelect'
import { InputQualityAlerts } from './InputQualityAlerts'

interface BugReportFormProps {
  values: BugReportFormValues
  inputQuality: InputQualityReport
  isGenerating: boolean
  isValid: boolean
  onCategoryChange: (category: BugCategory | '') => void
  onEnvironmentToggle: (env: Environment) => void
  onTitleChange: (title: string) => void
  onAffectedFeatureChange: (value: string) => void
  onNotesChange: (notes: string) => void
  onGenerate: () => void
}

const FormIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 20H20M4 4H20V16H8L4 20V4Z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export function BugReportForm({
  values,
  inputQuality,
  isGenerating,
  isValid,
  onCategoryChange,
  onEnvironmentToggle,
  onTitleChange,
  onAffectedFeatureChange,
  onNotesChange,
  onGenerate,
}: BugReportFormProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (isValid) onGenerate()
  }

  const showQualityHints =
    values.title.trim().length > 0 || values.category !== ''

  return (
    <Card id="bug-report-form" variant="elevated" className="h-full">
      <CardHeader
        title="New Bug Report"
        description="Minimal input → Senior QA–quality Jira ticket. Fill gaps below for higher confidence."
        icon={FormIcon}
      />
      <form onSubmit={handleSubmit} className="space-y-8">
        <FormSection
          title="Classification"
          description="How and where the issue appears."
        >
          <CategorySelect value={values.category} onChange={onCategoryChange} />
          <EnvironmentMultiSelect
            selected={values.environments}
            onToggle={onEnvironmentToggle}
          />
          <AffectedFeatureField
            value={values.affectedFeaturePage}
            onChange={onAffectedFeatureChange}
          />
        </FormSection>

        <FormSection
          title="Details"
          description="What happened and how to reproduce it."
        >
          <FormField>
            <Label htmlFor="bug-title" required>
              Bug Title / Short Description
            </Label>
            <Textarea
              id="bug-title"
              rows={3}
              placeholder="e.g. Checkout button stays disabled after valid address on mobile Safari"
              value={values.title}
              onChange={(e) => onTitleChange(e.target.value)}
              maxLength={500}
            />
            <p className="text-right text-xs tabular-nums text-text-muted">
              {values.title.length}/500
            </p>
          </FormField>

          <FormField>
            <Label
              htmlFor="additional-notes"
              hint="Steps, browser/device, expected vs actual behavior"
            >
              Additional Notes
            </Label>
            <Textarea
              id="additional-notes"
              rows={3}
              placeholder="1. Open checkout on iOS Safari 17… 2. Enter address… 3. Button stays disabled"
              value={values.additionalNotes}
              onChange={(e) => onNotesChange(e.target.value)}
              maxLength={1000}
            />
          </FormField>
        </FormSection>

        {showQualityHints && (
          <InputQualityAlerts report={inputQuality} />
        )}

        <div className="space-y-3 border-t border-border pt-6">
          <Button
            type="submit"
            size="lg"
            fullWidth
            isLoading={isGenerating}
            disabled={!isValid}
          >
            {isGenerating ? 'Generating ticket…' : 'Generate Ticket'}
          </Button>

          {!isValid && (
            <p
              className="text-center text-xs leading-relaxed text-text-muted"
              role="status"
            >
              Select category, at least one environment, and enter a title to
              continue.
            </p>
          )}
        </div>
      </form>
    </Card>
  )
}
