import type { ValidatedBugReportFormValues } from '../../types/bugReport'
import type { PromptBundle, ReportContext } from '../types/promptTypes'
import type { AiGenerationContext } from '../types/generationContext'
import { AI_TICKET_JSON_SCHEMA } from '../schemas/ticketJsonSchema'
import { buildBaseSystemPrompt } from '../prompts/baseSeniorQaPrompt'
import { buildUserBugDescriptionSection } from '../prompts/jiraBugReportPrompt'
import { formatCategoryInferenceSection } from '../prompts/categoryPrompts'
import { formatHistoricalTicketsForPrompt } from './generationContextService'
import { formatAiOutputStyleInstruction } from '../../services/knowledge/projectContextPrompt'

function buildReportContext(values: ValidatedBugReportFormValues): ReportContext {
  const description = values.issueDescription.trim()
  const envHint =
    values.environments.length > 0
      ? values.environments.join(', ')
      : '(not specified — infer from description)'

  return {
    issueDescription: description,
    environments: envHint,
    hasEnvironmentHint: values.environments.length > 0,
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
  if (!ctx.hasEnvironmentHint) {
    gaps.push('No environment selected — infer from description or default to Beta.')
  }
  if (ctx.issueDescription.length < 60) {
    gaps.push('Description is brief — expand steps from available details and flag gaps in severityReasoning.')
  }

  return [
    buildUserBugDescriptionSection(ctx.issueDescription),
    '',
    `User-selected environments: ${ctx.environments}`,
    '',
    gaps.length > 0 ? '### Input gaps to acknowledge\n' + gaps.map((g) => `- ${g}`).join('\n') : '',
  ]
    .filter(Boolean)
    .join('\n')
}

function buildQualityChecklist(): string {
  return [
    '## Pre-submit checklist',
    '- [ ] Inferred category matches the description',
    '- [ ] All 3 titles use the correct category prefix',
    '- [ ] Steps are testable and derived from the description (no invented URLs/versions)',
    '- [ ] severityReasoning explains inferred category, severity, and priority',
    '- [ ] confidenceScore reflects missing environment or reproduction detail',
    '- [ ] possibleRootCauses are hypotheses, not stated as facts',
  ].join('\n')
}

/**
 * Centralized prompt builder for Senior QA Lead ticket generation.
 */
export function buildTicketGenerationPrompt(
  values: ValidatedBugReportFormValues,
  generationContext: AiGenerationContext,
): PromptBundle {
  const ctx = buildReportContext(values)

  const historySection = formatHistoricalTicketsForPrompt(generationContext.similarTickets)
  const feedbackSection = generationContext.feedbackSummary
  const outputStyleSection = formatAiOutputStyleInstruction(generationContext.aiOutputStyle)

  const contextSections = [
    generationContext.projectContextSection,
    outputStyleSection,
    historySection,
    feedbackSection,
  ].filter(Boolean)

  const systemPrompt = [
    buildBaseSystemPrompt(),
    ...contextSections,
    formatCategoryInferenceSection(),
    buildJsonSchemaSection(),
  ]
    .filter(Boolean)
    .join('\n\n')

  const userPrompt = [
    'Generate a complete Jira-ready bug ticket JSON from the issue description below.',
    'Infer category, affected feature, environments, severity, and priority from the text.',
    contextSections.length > 0
      ? 'Apply project knowledge, historical patterns, and feedback insights when consistent with the description.'
      : '',
    buildInputSection(ctx),
    buildQualityChecklist(),
    '',
    'Return JSON only. No extra text.',
  ]
    .filter(Boolean)
    .join('\n\n')

  return {
    systemPrompt,
    userPrompt,
    category: 'Functional Bug',
  }
}

export { buildBaseSystemPrompt } from '../prompts/baseSeniorQaPrompt'
export { getCategoryPromptGuide, formatCategoryPromptSection, formatCategoryInferenceSection } from '../prompts/categoryPrompts'
