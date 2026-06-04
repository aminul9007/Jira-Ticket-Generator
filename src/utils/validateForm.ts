import type { BugReportFormValues, ValidatedBugReportFormValues } from '../types/bugReport'

const MIN_DESCRIPTION_LENGTH = 10

export function isBugReportFormComplete(
  values: BugReportFormValues,
): values is ValidatedBugReportFormValues {
  return values.issueDescription.trim().length >= MIN_DESCRIPTION_LENGTH
}

export const MIN_ISSUE_DESCRIPTION_LENGTH = MIN_DESCRIPTION_LENGTH
