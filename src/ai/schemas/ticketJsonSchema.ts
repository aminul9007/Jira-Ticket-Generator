import type {
  GeneratedTicket,
  TicketPriority,
  TicketSeverity,
} from '../../types/bugReport'

/** Structured JSON schema returned by the Senior QA Lead AI prompt. */
export interface AiTicketResponse {
  titleSuggestions: string[]
  title: string
  issueSummary: string
  stepsToReproduce: string[]
  expectedResult: string
  actualResult: string
  severity: TicketSeverity
  priority: TicketPriority
  severityReasoning: string
  possibleRootCauses: string[]
  confidenceScore: number
}

export const AI_TICKET_JSON_SCHEMA = {
  type: 'object',
  required: [
    'titleSuggestions',
    'title',
    'issueSummary',
    'stepsToReproduce',
    'expectedResult',
    'actualResult',
    'severity',
    'priority',
    'severityReasoning',
    'possibleRootCauses',
    'confidenceScore',
  ],
  properties: {
    titleSuggestions: {
      type: 'array',
      items: { type: 'string' },
      minItems: 3,
      maxItems: 3,
      description:
        'Exactly 3 distinct Jira titles. Include prefix, feature/page when known, environment if Production.',
    },
    title: {
      type: 'string',
      description: 'Best recommended title — must be one of the 3 suggestions or a refined variant.',
    },
    issueSummary: {
      type: 'string',
      description: '2-4 sentences. Impact, scope, who is affected. No invented metrics.',
    },
    stepsToReproduce: {
      type: 'array',
      items: { type: 'string' },
      minItems: 3,
      maxItems: 8,
      description: 'Numbered, testable steps. Use only actions supported by input.',
    },
    expectedResult: { type: 'string' },
    actualResult: { type: 'string' },
    severity: { type: 'string', enum: ['Critical', 'High', 'Medium', 'Low'] },
    priority: { type: 'string', enum: ['P1', 'P2', 'P3', 'P4'] },
    severityReasoning: {
      type: 'string',
      description:
        'Explain severity AND priority using category, environment, user impact, and data gaps.',
    },
    possibleRootCauses: {
      type: 'array',
      items: { type: 'string' },
      minItems: 3,
      maxItems: 5,
      description: 'Developer hypotheses only — prefix uncertain items with "Possible:"',
    },
    confidenceScore: {
      type: 'number',
      minimum: 0,
      maximum: 100,
      description: 'Lower when environment, feature, or repro details are missing.',
    },
  },
} as const

export const AI_RESPONSE_FIELD_KEYS: (keyof AiTicketResponse)[] = [
  'titleSuggestions',
  'title',
  'issueSummary',
  'stepsToReproduce',
  'expectedResult',
  'actualResult',
  'severity',
  'priority',
  'severityReasoning',
  'possibleRootCauses',
  'confidenceScore',
]

/** Reference shape shared by AI and rules engine. */
export type TicketGenerationSchema = GeneratedTicket
