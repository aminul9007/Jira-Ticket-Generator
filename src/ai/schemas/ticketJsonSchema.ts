import type {
  GeneratedTicket,
  TicketPriority,
  TicketSeverity,
  BugCategory,
  Environment,
} from '../../types/bugReport'

/** Structured JSON schema returned by the Senior QA Lead AI prompt. */
export interface AiTicketResponse {
  category: BugCategory
  affectedFeaturePage: string
  environments: Environment[]
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
    'category',
    'affectedFeaturePage',
    'environments',
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
    category: {
      type: 'string',
      enum: [
        'UI Bug',
        'Functional Bug',
        'Mobile Bug',
        'SEO Issue',
        'Accessibility Issue',
        'Performance Issue',
      ],
      description: 'Inferred bug category from the issue description.',
    },
    affectedFeaturePage: {
      type: 'string',
      description: 'Inferred feature, page, or module. Use "Confirm with reporter" if unclear.',
    },
    environments: {
      type: 'array',
      items: { type: 'string', enum: ['Canary', 'Beta', 'Production'] },
      minItems: 1,
      description: 'Inferred from description and optional user selection. Default to Beta if unknown.',
    },
    titleSuggestions: {
      type: 'array',
      items: { type: 'string' },
      minItems: 3,
      maxItems: 3,
      description:
        'Exactly 3 distinct, complete Jira titles (max ~200 chars each, no ellipsis). Include category prefix, feature when known, environment if Production.',
    },
    title: {
      type: 'string',
      description:
        'Best recommended title — complete sentence fragment, no ellipsis; must match one of the 3 suggestions or a refined variant.',
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
      description: 'Numbered, testable steps derived from the issue description.',
    },
    expectedResult: { type: 'string' },
    actualResult: { type: 'string' },
    severity: { type: 'string', enum: ['Critical', 'High', 'Medium', 'Low'] },
    priority: {
      type: 'string',
      enum: ['P0', 'P1', 'P2', 'P3', 'P4'],
      description:
        'P0 production blocker; P1 high impact; P2 normal; P3 minor. Map from severity: Critical→P0, High→P1, Medium→P2, Low→P3.',
    },
    severityReasoning: {
      type: 'string',
      description:
        'Explain inferred category, severity AND priority using environment, user impact, and data gaps.',
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
      description: 'Lower when environment, feature, or repro details are missing from input.',
    },
  },
} as const

export const AI_RESPONSE_FIELD_KEYS: (keyof AiTicketResponse)[] = [
  'category',
  'affectedFeaturePage',
  'environments',
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
