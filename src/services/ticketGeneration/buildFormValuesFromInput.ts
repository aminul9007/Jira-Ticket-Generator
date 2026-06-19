import type { BugReportFormValues } from '../../types/bugReport'
import { mapDetectedEnvironmentToLegacy } from '../../utils/contextDetection/mapDetectedEnvironment'
import { resolveSmartContext } from '../../utils/contextDetection/resolveSmartContext'
import { composeIssueDescription } from '../../../shared/generation/composeIssueDescription'
import type { TicketGenerationInput } from '../../../shared/generation/types'

/** Build web-compatible form values from extension input + browser context. */
export function buildFormValuesFromGenerationInput(
  input: TicketGenerationInput,
): BugReportFormValues {
  const issueDescription = composeIssueDescription(input.description, input.context)
  const qaContext = resolveSmartContext(issueDescription, {
    fuzzy: false,
    fillSession: true,
  })
  const envDetected = qaContext.environment.value !== 'unknown'

  return {
    issueDescription,
    environments: envDetected
      ? mapDetectedEnvironmentToLegacy(qaContext.environment.value)
      : [],
    qaContext,
  }
}
