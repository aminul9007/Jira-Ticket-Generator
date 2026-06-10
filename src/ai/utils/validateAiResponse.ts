import type { AiTicketResponse } from '../schemas/ticketJsonSchema'
import {
  TICKET_PRIORITIES,
  TICKET_SEVERITIES,
} from '../../data/ticketOptions'
import type { Environment, GeneratedTicket, ValidatedBugReportFormValues } from '../../types/bugReport'
import { isBugCategory, isEnvironment, mergeEnvironments } from '../../utils/inferBugDetails'
import { cleanTitleText } from '../../utils/titleText'
import { normalizeAiPayloadKeys } from './normalizeAiPayload'

const SEVERITY_SET = new Set<string>(TICKET_SEVERITIES)
const PRIORITY_SET = new Set<string>(TICKET_PRIORITIES)

export interface AiValidationResult {
  valid: boolean
  errors: string[]
  data: AiTicketResponse | null
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((item) => typeof item === 'string')
  )
}

function parseEnvironments(value: unknown): Environment[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is Environment => isEnvironment(String(item)))
}

export function validateAiTicketResponse(raw: unknown): AiValidationResult {
  const errors: string[] = []

  if (!raw || typeof raw !== 'object') {
    return { valid: false, errors: ['Response is not an object'], data: null }
  }

  const data = normalizeAiPayloadKeys(raw as Record<string, unknown>)

  if (!isBugCategory(String(data.category))) {
    errors.push('category must be a valid bug category')
  }

  if (!isNonEmptyString(data.affectedFeaturePage)) {
    errors.push('affectedFeaturePage is required')
  }

  const environments = parseEnvironments(data.environments)
  if (environments.length === 0) {
    errors.push('environments must contain at least one valid environment')
  }

  if (!isStringArray(data.titleSuggestions) || data.titleSuggestions.length < 3) {
    errors.push('titleSuggestions must be an array of at least 3 strings')
  }

  if (!isNonEmptyString(data.title)) errors.push('title is required')
  if (!isNonEmptyString(data.issueSummary)) errors.push('issueSummary is required')
  if (!isStringArray(data.stepsToReproduce) || data.stepsToReproduce.length < 3) {
    errors.push('stepsToReproduce must contain at least 3 steps')
  }
  if (!isNonEmptyString(data.expectedResult)) errors.push('expectedResult is required')
  if (!isNonEmptyString(data.actualResult)) errors.push('actualResult is required')
  if (!isNonEmptyString(data.severityReasoning)) {
    errors.push('severityReasoning is required')
  }

  if (!SEVERITY_SET.has(String(data.severity))) {
    errors.push('severity must be Critical, High, Medium, or Low')
  }
  if (!PRIORITY_SET.has(String(data.priority))) {
    errors.push('priority must be P0, P1, P2, P3, or P4')
  }

  if (!isStringArray(data.possibleRootCauses) || data.possibleRootCauses.length < 1) {
    errors.push('possibleRootCauses must be a non-empty array')
  }

  if (typeof data.confidenceScore !== 'number' || Number.isNaN(data.confidenceScore)) {
    errors.push('confidenceScore must be a number')
  }

  if (errors.length > 0) {
    return { valid: false, errors, data: null }
  }

  const titles = (data.titleSuggestions as string[])
    .map((t) => cleanTitleText(t))
    .filter(Boolean)

  while (titles.length < 3) {
    titles.push(String(data.title).trim())
  }

  return {
    valid: true,
    errors: [],
    data: {
      category: data.category as AiTicketResponse['category'],
      affectedFeaturePage: String(data.affectedFeaturePage).trim(),
      environments,
      titleSuggestions: titles.slice(0, 3),
      title: cleanTitleText(String(data.title)),
      issueSummary: String(data.issueSummary).trim(),
      stepsToReproduce: (data.stepsToReproduce as string[]).map((s) => s.trim()),
      expectedResult: String(data.expectedResult).trim(),
      actualResult: String(data.actualResult).trim(),
      severity: data.severity as AiTicketResponse['severity'],
      priority: data.priority as AiTicketResponse['priority'],
      severityReasoning: String(data.severityReasoning).trim(),
      possibleRootCauses: (data.possibleRootCauses as string[]).map((s) => s.trim()),
      confidenceScore: Math.min(100, Math.max(0, Math.round(data.confidenceScore as number))),
    },
  }
}

export function normalizeAiResponse(
  raw: AiTicketResponse,
  values: ValidatedBugReportFormValues,
): GeneratedTicket {
  const titles = raw.titleSuggestions.slice(0, 3) as [string, string, string]
  const recommended =
    titles.includes(raw.title) ? raw.title : titles[0] ?? raw.title

  const featureLabel = raw.affectedFeaturePage.trim()
  const feature =
    featureLabel === 'Confirm with reporter' ||
    featureLabel === 'Not specified'
      ? undefined
      : featureLabel || undefined

  const environments = mergeEnvironments(values.environments, raw.environments)

  return {
    title: recommended,
    titleSuggestions: titles,
    issueSummary: raw.issueSummary,
    stepsToReproduce: raw.stepsToReproduce,
    expectedResult: raw.expectedResult,
    actualResult: raw.actualResult,
    severity: raw.severity,
    priority: raw.priority,
    severityReasoning: raw.severityReasoning,
    possibleRootCauses: raw.possibleRootCauses.slice(0, 5),
    confidenceScore: raw.confidenceScore,
    category: raw.category,
    environments: environments.length > 0 ? environments : ['Beta'],
    affectedFeaturePage: feature,
  }
}
