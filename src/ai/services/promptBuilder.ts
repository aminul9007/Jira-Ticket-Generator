import type { ValidatedBugReportFormValues } from '../../types/bugReport'
import type { QaContextSettings } from '../../types/qaContext'
import type { PromptBundle, ReportContext } from '../types/promptTypes'
import { AI_TICKET_JSON_SCHEMA } from '../schemas/ticketJsonSchema'
import { buildBaseSystemPrompt } from '../prompts/baseSeniorQaPrompt'
import {
  formatCategoryPromptSection,
  getCategoryPromptGuide,
} from '../prompts/categoryPrompts'
import { formatQaContextForPrompt } from '../prompts/qaContextSection'

function buildReportContext(values: ValidatedBugReportFormValues): ReportContext {
  return {
    category: values.category,
    environments: values.environments.join(', '),
    affectedFeaturePage: values.affectedFeaturePage.trim() || '(not specified)',
    title: values.title.trim(),
    additionalNotes: values.additionalNotes.trim() || '(none)',
    hasFeature: values.affectedFeaturePage.trim().length > 0,
    hasNotes: values.additionalNotes.trim().length > 0,
    isProduction: values.environments.includes('Production'),
  }
}

function buildJsonSchemaSection(): string {
  return [
    '## Required JSON schema',
    JSON.stringify(AI_TICKET_JSON_SCHEMA, null, 2),
  ].join('\n')
}

function buildInputSection(ctx: ReportContext): string {
  const gaps: string[] = []
  if (!ctx.hasFeature) gaps.push('Affected feature/page is missing — use "Confirm with reporter" in steps.')
  if (!ctx.hasNotes) gaps.push('Reproduction detail is limited — keep steps high-level and flag gaps in severityReasoning.')
  if (!ctx.isProduction) gaps.push('Production not selected — cap priority at P3 unless impact warrants higher.')

  return [
    '## Bug report input (only source of truth)',
    `Category: ${ctx.category}`,
    `Environments: ${ctx.environments}`,
    `Affected Feature/Page: ${ctx.affectedFeaturePage}`,
    `Short Description: ${ctx.title}`,
    `Additional Notes: ${ctx.additionalNotes}`,
    '',
    gaps.length > 0 ? '### Input gaps to acknowledge\n' + gaps.map((g) => `- ${g}`).join('\n') : '',
  ]
    .filter(Boolean)
    .join('\n')
}

function buildQualityChecklist(): string {
  return [
    '## Pre-submit checklist',
    '- [ ] All 3 titles are unique and use the correct category prefix',
    '- [ ] Steps are testable and derived from input (no invented URLs/versions)',
    '- [ ] severityReasoning explains BOTH severity and priority with environment impact',
    '- [ ] confidenceScore reflects missing fields',
    '- [ ] possibleRootCauses are hypotheses, not stated as facts',
  ].join('\n')
}

/**
 * Centralized prompt builder for Senior QA Lead ticket generation.
 */
export function buildTicketGenerationPrompt(
  values: ValidatedBugReportFormValues,
  qaContext?: QaContextSettings,
): PromptBundle {
  const guide = getCategoryPromptGuide(values.category)
  const ctx = buildReportContext(values)
  const qaContextSection = qaContext ? formatQaContextForPrompt(qaContext) : ''

  const systemPrompt = [
    buildBaseSystemPrompt(),
    qaContextSection,
    formatCategoryPromptSection(guide),
    buildJsonSchemaSection(),
  ]
    .filter(Boolean)
    .join('\n\n')

  const userPrompt = [
    'Generate a Jira-ready bug ticket JSON from the report below.',
    qaContextSection ? 'Apply team QA context above when consistent with the report.' : '',
    buildInputSection(ctx),
    buildQualityChecklist(),
    '',
    'Return JSON only.',
  ]
    .filter(Boolean)
    .join('\n\n')

  return {
    systemPrompt,
    userPrompt,
    category: values.category,
  }
}

export { buildBaseSystemPrompt } from '../prompts/baseSeniorQaPrompt'
export { getCategoryPromptGuide, formatCategoryPromptSection } from '../prompts/categoryPrompts'
