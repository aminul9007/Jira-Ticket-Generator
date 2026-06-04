import type { FormEvent, KeyboardEvent } from 'react'
import type { BugReportFormValues, Environment } from '../../types/bugReport'
import type { InputQualityReport } from '../../types/inputQuality'
import { MIN_ISSUE_DESCRIPTION_LENGTH } from '../../utils/validateForm'
import { Button } from '../ui/Button'
import { Card, CardHeader } from '../ui/Card'
import { FormField } from '../ui/FormField'
import { Label } from '../ui/Label'
import { Textarea } from '../ui/Textarea'
import { EnvironmentMultiSelect } from './EnvironmentMultiSelect'
import { InputQualityAlerts } from './InputQualityAlerts'

interface BugReportFormProps {
  values: BugReportFormValues
  inputQuality: InputQualityReport
  isGenerating: boolean
  isValid: boolean
  onEnvironmentToggle: (env: Environment) => void
  onIssueDescriptionChange: (value: string) => void
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
  onEnvironmentToggle,
  onIssueDescriptionChange,
  onGenerate,
}: BugReportFormProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (isValid) onGenerate()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && isValid && !isGenerating) {
      e.preventDefault()
      onGenerate()
    }
  }

  const descriptionLength = values.issueDescription.trim().length
  const showQualityHints = descriptionLength >= MIN_ISSUE_DESCRIPTION_LENGTH

  return (
    <Card id="bug-report-form" variant="elevated" className="h-full">
      <CardHeader
        title="Quick Bug Report"
        description="Paste what you found — AI infers category, feature, severity, and priority."
        icon={FormIcon}
      />
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField>
          <Label htmlFor="issue-description" required>
            Issue Description
          </Label>
          <Textarea
            id="issue-description"
            rows={8}
            autoFocus
            placeholder="Describe the bug in plain language. Include what you did, what happened, browser/device, and environment if known.

Example: On Production, checkout button stays disabled after entering a valid address on iPhone Safari 17."
            value={values.issueDescription}
            onChange={(e) => onIssueDescriptionChange(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={2000}
            className="min-h-[180px]"
          />
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span>Ctrl+Enter to generate</span>
            <span className="tabular-nums">{values.issueDescription.length}/2000</span>
          </div>
        </FormField>

        <EnvironmentMultiSelect
          selected={values.environments}
          onToggle={onEnvironmentToggle}
          optional
        />

        {showQualityHints && <InputQualityAlerts report={inputQuality} />}

        <div className="space-y-3 border-t border-border pt-5">
          <Button
            type="submit"
            size="lg"
            fullWidth
            isLoading={isGenerating}
            disabled={!isValid}
          >
            {isGenerating ? 'Generating ticket…' : 'Generate Jira Ticket'}
          </Button>

          {!isValid && (
            <p className="text-center text-xs leading-relaxed text-text-muted" role="status">
              Enter at least {MIN_ISSUE_DESCRIPTION_LENGTH} characters describing the issue.
            </p>
          )}
        </div>
      </form>
    </Card>
  )
}
