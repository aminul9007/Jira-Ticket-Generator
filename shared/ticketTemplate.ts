/** Shared ticket template config — used by the React app and Jira API backend. */

export type TicketTemplateFieldKey =
  | 'issueSummary'
  | 'titleSuggestions'
  | 'environment'
  | 'affectedFeaturePage'
  | 'stepsToReproduce'
  | 'expectedResult'
  | 'actualResult'
  | 'severity'
  | 'priority'
  | 'severityReasoning'
  | 'possibleRootCauses'
  | 'qaContext'

export type TicketTemplatePreset = 'full' | 'standard' | 'minimal' | 'custom'

export interface TicketTemplateFieldMeta {
  label: string
  description: string
  /** Always included in Jira issues — toggle is disabled in settings. */
  required?: boolean
  /** Only affects wiki export / preview, not the Jira issue title field. */
  wikiOnly?: boolean
}

export interface TicketTemplateSettings {
  preset: TicketTemplatePreset
  fields: Record<TicketTemplateFieldKey, boolean>
}

export const TICKET_TEMPLATE_FIELD_ORDER: TicketTemplateFieldKey[] = [
  'issueSummary',
  'titleSuggestions',
  'environment',
  'affectedFeaturePage',
  'stepsToReproduce',
  'expectedResult',
  'actualResult',
  'severity',
  'priority',
  'severityReasoning',
  'possibleRootCauses',
  'qaContext',
]

export const TICKET_TEMPLATE_FIELD_META: Record<TicketTemplateFieldKey, TicketTemplateFieldMeta> =
  {
    issueSummary: {
      label: 'Issue summary',
      description: 'High-level description of the bug and its impact.',
      required: true,
    },
    titleSuggestions: {
      label: 'Title suggestions',
      description: 'Alternative titles generated for the issue.',
      wikiOnly: true,
    },
    environment: {
      label: 'Environment',
      description: 'Canary, Beta, Production, and detected deployment context.',
    },
    affectedFeaturePage: {
      label: 'Affected feature / page',
      description: 'Product area or URL path impacted by the bug.',
    },
    stepsToReproduce: {
      label: 'Steps to reproduce',
      description: 'Numbered steps to recreate the issue.',
    },
    expectedResult: {
      label: 'Expected result',
      description: 'What should happen when steps are followed.',
    },
    actualResult: {
      label: 'Actual result',
      description: 'What actually happened instead.',
    },
    severity: {
      label: 'Severity',
      description: 'Critical, High, Medium, or Low impact rating.',
    },
    priority: {
      label: 'Priority',
      description: 'P0–P3 priority for triage.',
    },
    severityReasoning: {
      label: 'Severity reasoning',
      description: 'Explanation for the chosen severity level.',
    },
    possibleRootCauses: {
      label: 'Possible root causes',
      description: 'Hypotheses about why the bug may occur.',
    },
    qaContext: {
      label: 'QA context',
      description: 'Browser, OS, and device detected from the report.',
    },
  }

const ALL_FIELDS_ENABLED = Object.fromEntries(
  TICKET_TEMPLATE_FIELD_ORDER.map((key) => [key, true]),
) as Record<TicketTemplateFieldKey, boolean>

export const TICKET_TEMPLATE_PRESET_FIELDS: Record<
  Exclude<TicketTemplatePreset, 'custom'>,
  Record<TicketTemplateFieldKey, boolean>
> = {
  full: { ...ALL_FIELDS_ENABLED },
  standard: {
    ...ALL_FIELDS_ENABLED,
    titleSuggestions: false,
    possibleRootCauses: false,
  },
  minimal: {
    issueSummary: true,
    titleSuggestions: false,
    environment: false,
    affectedFeaturePage: false,
    stepsToReproduce: true,
    expectedResult: true,
    actualResult: true,
    severity: true,
    priority: true,
    severityReasoning: false,
    possibleRootCauses: false,
    qaContext: false,
  },
}

export const TICKET_TEMPLATE_PRESET_LABELS: Record<
  Exclude<TicketTemplatePreset, 'custom'>,
  { label: string; description: string }
> = {
  full: {
    label: 'Full QA report',
    description: 'Include every generated field — best for detailed bug reports.',
  },
  standard: {
    label: 'Standard bug',
    description: 'Core reproduction details plus environment and QA context.',
  },
  minimal: {
    label: 'Minimal',
    description: 'Summary, reproduction steps, results, and severity only.',
  },
}

export function createDefaultTicketTemplateSettings(): TicketTemplateSettings {
  return {
    preset: 'full',
    fields: { ...TICKET_TEMPLATE_PRESET_FIELDS.full },
  }
}

function fieldsMatchPreset(
  fields: Record<TicketTemplateFieldKey, boolean>,
  preset: Exclude<TicketTemplatePreset, 'custom'>,
): boolean {
  return TICKET_TEMPLATE_FIELD_ORDER.every(
    (key) => fields[key] === TICKET_TEMPLATE_PRESET_FIELDS[preset][key],
  )
}

export function detectTemplatePreset(
  fields: Record<TicketTemplateFieldKey, boolean>,
): TicketTemplatePreset {
  if (fieldsMatchPreset(fields, 'full')) return 'full'
  if (fieldsMatchPreset(fields, 'standard')) return 'standard'
  if (fieldsMatchPreset(fields, 'minimal')) return 'minimal'
  return 'custom'
}

export function normalizeTicketTemplateSettings(
  raw: Partial<TicketTemplateSettings> | null | undefined,
): TicketTemplateSettings {
  const defaults = createDefaultTicketTemplateSettings()
  const rawFields = (raw?.fields ?? {}) as Partial<Record<TicketTemplateFieldKey, boolean>>
  const fields = { ...defaults.fields }

  for (const key of TICKET_TEMPLATE_FIELD_ORDER) {
    const value = rawFields[key]
    if (typeof value === 'boolean') {
      fields[key] = value
    }
  }

  fields.issueSummary = true

  const preset =
    raw?.preset === 'full' ||
    raw?.preset === 'standard' ||
    raw?.preset === 'minimal' ||
    raw?.preset === 'custom'
      ? raw.preset
      : detectTemplatePreset(fields)

  return { preset, fields }
}

export function applyTicketTemplatePreset(
  preset: Exclude<TicketTemplatePreset, 'custom'>,
): TicketTemplateSettings {
  return {
    preset,
    fields: { ...TICKET_TEMPLATE_PRESET_FIELDS[preset] },
  }
}

export function isTemplateFieldEnabled(
  template: TicketTemplateSettings,
  field: TicketTemplateFieldKey,
): boolean {
  return template.fields[field]
}
