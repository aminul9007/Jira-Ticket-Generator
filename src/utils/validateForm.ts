import type { BugReportFormValues, ValidatedBugReportFormValues } from '../types/bugReport'

export function isBugReportFormComplete(
  values: BugReportFormValues,
): values is ValidatedBugReportFormValues {
  return (
    values.category !== '' &&
    values.environments.length > 0 &&
    values.title.trim().length > 0
  )
}
