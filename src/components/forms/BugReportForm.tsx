import type { FormEvent } from 'react'
import type { BugCategory, BugReportFormValues, Environment } from '../../types/bugReport'
import { Button } from '../ui/Button'
import { Card, CardHeader } from '../ui/Card'
import { FormField, FormSection } from '../ui/FormField'
import { Label } from '../ui/Label'
import { Textarea } from '../ui/Textarea'
import { CategorySelect } from './CategorySelect'
import { EnvironmentMultiSelect } from './EnvironmentMultiSelect'

interface BugReportFormProps {
  values: BugReportFormValues
  isGenerating: boolean
  isValid: boolean
  onCategoryChange: (category: BugCategory | '') => void
  onEnvironmentToggle: (env: Environment) => void
  onTitleChange: (title: string) => void
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
  isGenerating,
  isValid,
  onCategoryChange,
  onEnvironmentToggle,
  onTitleChange,
  onNotesChange,
  onGenerate,
}: BugReportFormProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (isValid) onGenerate()
  }

  return (
    <Card id="bug-report-form" variant="elevated" className="h-full">
      <CardHeader
        title="New Bug Report"
        description="Describe the issue. Fields below drive the generated ticket preview."
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
        </FormSection>

        <FormSection
          title="Details"
          description="What happened and any extra context."
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
              hint="Optional context for the report"
            >
              Additional Notes
            </Label>
            <Textarea
              id="additional-notes"
              rows={3}
              placeholder="Browser version, device, screenshots links, related tickets..."
              value={values.additionalNotes}
              onChange={(e) => onNotesChange(e.target.value)}
              maxLength={1000}
            />
          </FormField>
        </FormSection>

        <div className="space-y-3 border-t border-border pt-6">
          <Button
            type="submit"
            size="lg"
            fullWidth
            isLoading={isGenerating}
            disabled={!isValid}
          >
            {isGenerating ? 'Generating preview…' : 'Generate Ticket'}
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
