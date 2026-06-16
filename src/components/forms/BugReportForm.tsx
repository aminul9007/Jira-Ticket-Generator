import type { FormEvent, KeyboardEvent } from 'react'
import type { BugReportFormValues, Environment } from '../../types/bugReport'
import type { InputQualityReport } from '../../types/inputQuality'
import { MIN_ISSUE_DESCRIPTION_LENGTH } from '../../utils/validateForm'
import { Button } from '../ui/Button'
import { Card, CardHeader } from '../ui/Card'
import { FormField } from '../ui/FormField'
import type { ExtractedContext } from '../../types/contextDetection'
import { ContextMetadataChips } from './ContextMetadataChips'
import { EnvironmentMultiSelect } from './EnvironmentMultiSelect'
import { InputQualityAlerts } from './InputQualityAlerts'
import { IssueDescriptionInput } from './IssueDescriptionInput'
import { MissingContextPrompt } from './MissingContextPrompt'
import type { MissingContextField } from '../../utils/contextDetection/getMissingContextFields'

interface BugReportFormProps {
  values: BugReportFormValues
  inputQuality: InputQualityReport
  isGenerating: boolean
  isValid: boolean
  onEnvironmentToggle: (env: Environment) => void
  onIssueDescriptionChange: (value: string) => void
  onVoiceComplete: (payload: Pick<BugReportFormValues, 'issueDescription'>) => void
  onVoiceTranscriptUpdate?: (transcript: string) => void
  onContextFieldChange: <K extends keyof ExtractedContext>(
    field: K,
    value: ExtractedContext[K]['value'],
  ) => void
  onContextFieldClear: (field: keyof ExtractedContext) => void
  onGenerate: () => void
  onVoiceAutoGenerate?: (payload: Pick<BugReportFormValues, 'issueDescription'>) => void
  missingContextFields?: MissingContextField[]
  onMissingContextAnswer?: (
    field: MissingContextField,
    input: string,
  ) => { matchedLabel: string } | null
  onDismissMissingContext?: () => void
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
  onVoiceComplete,
  onVoiceTranscriptUpdate,
  onContextFieldChange,
  onContextFieldClear,
  onGenerate,
  onVoiceAutoGenerate,
  missingContextFields = [],
  onMissingContextAnswer,
  onDismissMissingContext,
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
    <>
    <Card id="bug-report-form" variant="elevated" className="h-full">
      <CardHeader
        title="Quick Bug Report"
        description="Describe the bug — type or use the mic — then generate a Jira-ready ticket."
        icon={FormIcon}
      />
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField>
          <IssueDescriptionInput
            id="issue-description"
            value={values.issueDescription}
            maxLength={2000}
            minHintLength={MIN_ISSUE_DESCRIPTION_LENGTH}
            disabled={isGenerating}
            placeholder="Describe the bug in plain language. Include what you did, what happened, browser/device, and environment if known.

Example: On Production, checkout button stays disabled after entering a valid address on iPhone Safari 17."
            onChange={onIssueDescriptionChange}
            onVoiceComplete={onVoiceComplete}
            onVoiceTranscriptUpdate={onVoiceTranscriptUpdate}
            onVoiceAutoGenerate={onVoiceAutoGenerate}
            onKeyDown={handleKeyDown}
          />
          <p className="text-xs text-text-muted">Ctrl+Enter to generate</p>
        </FormField>

        <ContextMetadataChips
          context={values.qaContext}
          onFieldChange={onContextFieldChange}
          onFieldClear={onContextFieldClear}
        />

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
            <p className="type-helper text-center" role="status">
              Enter at least {MIN_ISSUE_DESCRIPTION_LENGTH} characters describing the issue.
            </p>
          )}
        </div>
      </form>
    </Card>

    {onMissingContextAnswer && onDismissMissingContext && (
      <MissingContextPrompt
        fields={missingContextFields}
        onAnswer={onMissingContextAnswer}
        onDismiss={onDismissMissingContext}
      />
    )}
    </>
  )
}
