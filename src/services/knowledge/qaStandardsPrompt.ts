import type { QaTicketStandardsSettings } from '../../../shared/qaTicketStandards'
import {
  formatQaStandardsCustomRulesPrompt,
  formatQaStandardsPresetPrompt,
  formatQaStandardsRulesPrompt,
} from '../../../shared/qaTicketStandards'

export interface QaStandardsPromptSections {
  /** Mandatory industry-standard rules + preset instructions. */
  standardsSection: string
  /** Optional project-specific rules — lower priority than standards. */
  customRulesSection: string
}

export function formatQaStandardsForPrompt(
  settings: QaTicketStandardsSettings,
): QaStandardsPromptSections {
  const rulesBlock = formatQaStandardsRulesPrompt(settings)
  const presetBlock = formatQaStandardsPresetPrompt(settings)

  const standardsSection = [rulesBlock, presetBlock].filter(Boolean).join('\n\n')

  return {
    standardsSection,
    customRulesSection: formatQaStandardsCustomRulesPrompt(settings.customRules),
  }
}
