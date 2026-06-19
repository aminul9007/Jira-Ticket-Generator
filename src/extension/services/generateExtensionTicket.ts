import { generateTicket } from '../../services/ticketGeneration'
import { buildFormValuesFromGenerationInput } from '../../services/ticketGeneration/buildFormValuesFromInput'
import type { TicketGenerationResult } from '../../services/ticketGeneration'
import type { TicketGenerationInput } from '../../../shared/generation/types'
import { isBugReportFormComplete } from '../../utils/validateForm'
import {
  createExtensionContextSource,
  loadExtensionAppSettings,
} from './extensionSettingsService'

export async function generateExtensionTicket(
  input: TicketGenerationInput,
): Promise<TicketGenerationResult> {
  const formValues = buildFormValuesFromGenerationInput(input)

  if (!isBugReportFormComplete(formValues)) {
    throw new Error('Description must be at least 10 characters.')
  }

  const settings = await loadExtensionAppSettings()
  const contextSource = createExtensionContextSource(settings)

  return generateTicket(formValues, { contextSource })
}
