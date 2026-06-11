/** Shared QA ticket standards — used by settings UI and AI prompt generation. */

export type QaStandardRuleKey =
  | 'clearBugTitles'
  | 'reproducibleSteps'
  | 'separateExpectedActual'
  | 'noAssumptions'
  | 'severityStandards'
  | 'priorityStandards'
  | 'professionalLanguage'
  | 'environmentAwareness'
  | 'releaseContextAwareness'
  | 'confidenceBasedGeneration'

export type QaStandardsPreset = 'standard' | 'enterprise' | 'agile' | 'custom'

/** Verbosity of AI-generated ticket content — tied to standards presets. */
export type QaGenerationOutputStyle = 'concise' | 'standard' | 'detailed'

export interface QaStandardRuleMeta {
  label: string
  description: string
  /** Prompt text injected when the rule is enabled. */
  prompt: string
}

export interface QaTicketStandardsSettings {
  preset: QaStandardsPreset
  rules: Record<QaStandardRuleKey, boolean>
  customRules: string
}

export const QA_STANDARD_RULE_ORDER: QaStandardRuleKey[] = [
  'clearBugTitles',
  'reproducibleSteps',
  'separateExpectedActual',
  'noAssumptions',
  'severityStandards',
  'priorityStandards',
  'professionalLanguage',
  'environmentAwareness',
  'releaseContextAwareness',
  'confidenceBasedGeneration',
]

export const QA_STANDARD_RULE_META: Record<QaStandardRuleKey, QaStandardRuleMeta> = {
  clearBugTitles: {
    label: 'Clear bug titles',
    description: 'Concise, action-oriented titles without vague words like "issue" or "problem".',
    prompt: [
      '### Clear bug titles',
      '- Titles must be concise, action-oriented, and descriptive.',
      '- Avoid vague terms: "issue", "bug", "problem", "error occurred".',
      '- Good: "Header Logo Edit Modal Fails to Open on Mobile"',
      '- Bad: "Header Issue"',
      '- Never end titles with ellipsis (...).',
    ].join('\n'),
  },
  reproducibleSteps: {
    label: 'Reproducible steps',
    description: 'Numbered, user-action-focused steps developers can follow without assumptions.',
    prompt: [
      '### Reproducible steps',
      '- Provide numbered stepsToReproduce focused on user actions.',
      '- Each step must be easy for a developer to follow without tribal knowledge.',
      '- Use imperative verbs: Open, Navigate, Click, Enter, Observe.',
      '- Do not skip steps or assume prior setup unless stated in the report.',
    ].join('\n'),
  },
  separateExpectedActual: {
    label: 'Separate expected vs actual result',
    description: 'Always generate distinct Expected Result and Actual Result sections.',
    prompt: [
      '### Separate expected vs actual result',
      '- Always populate expectedResult and actualResult as separate fields.',
      '- Never combine expected and actual into one paragraph or field.',
      '- expectedResult: what should happen; actualResult: what happened instead.',
    ].join('\n'),
  },
  noAssumptions: {
    label: 'No assumptions',
    description: 'Never invent environments, browsers, devices, or steps not in the report.',
    prompt: [
      '### No assumptions',
      '- Never invent environments, browsers, devices, OS versions, or reproduction steps.',
      '- Only use facts from the user report and extracted QA context.',
      '- When a detail is missing, write "Not Specified" — do not guess or fabricate.',
    ].join('\n'),
  },
  severityStandards: {
    label: 'Severity standards',
    description: 'Map severity using industry definitions for crash, outage, and cosmetic issues.',
    prompt: [
      '### Severity standards',
      '- Critical: crash, data loss, payment failure, complete outage, login blocked.',
      '- High: major functionality broken with no practical workaround.',
      '- Medium: feature partially broken but a workaround exists.',
      '- Low: cosmetic, visual, or minor usability issues.',
      '- severityReasoning must justify the chosen severity using these definitions.',
    ].join('\n'),
  },
  priorityStandards: {
    label: 'Priority standards',
    description: 'Align P0–P3 priority logically with severity and business impact.',
    prompt: [
      '### Priority standards',
      '- P0: critical business blocker.',
      '- P1: high business impact.',
      '- P2: normal bug.',
      '- P3: minor issue.',
      '- Align priority with severity and business impact logically (Critical/High severity rarely maps to P3).',
    ].join('\n'),
  },
  professionalLanguage: {
    label: 'Professional QA language',
    description: 'Objective, testable wording — no emotion, opinions, or speculation.',
    prompt: [
      '### Professional QA language',
      '- Use objective, testable language suitable for Jira triage.',
      '- Avoid emotional language, opinions, and unfounded speculation.',
      '- possibleRootCauses are hypotheses — phrase as possibilities, not confirmed facts.',
    ].join('\n'),
  },
  environmentAwareness: {
    label: 'Environment awareness',
    description: 'Use extracted browser/OS/device context; state "Not Specified" when missing.',
    prompt: [
      '### Environment awareness',
      '- Use extracted QA context (environment, browser, OS, device) when provided.',
      '- Reflect user-selected environments (Canary, Beta, Production) in the ticket.',
      '- When context is unavailable, state "Not Specified" — do not fabricate values.',
    ].join('\n'),
  },
  releaseContextAwareness: {
    label: 'Release context awareness',
    description: 'Mention deployment/release timing in the summary when relevant.',
    prompt: [
      '### Release context awareness',
      '- When the report mentions deployment, release, update, or hotfix timing, include that context in issueSummary.',
      '- Phrases like "after deployment", "after release", "after update", or "after hotfix" belong in the summary when relevant.',
      '- Do not invent release timing if the report does not mention it.',
    ].join('\n'),
  },
  confidenceBasedGeneration: {
    label: 'Confidence-based generation',
    description: 'Use "Not Specified" instead of guessing when input is incomplete.',
    prompt: [
      '### Confidence-based generation',
      '- When input is complete, generate full ticket content with appropriate confidenceScore.',
      '- When input is incomplete or ambiguous, lower confidenceScore and use "Not Specified" for missing details.',
      '- Never fill gaps with invented data to appear confident.',
    ].join('\n'),
  },
}

const ALL_RULES_ENABLED = Object.fromEntries(
  QA_STANDARD_RULE_ORDER.map((key) => [key, true]),
) as Record<QaStandardRuleKey, boolean>

/** Default enabled rules for each built-in preset. */
export const QA_STANDARDS_PRESET_RULES: Record<
  Exclude<QaStandardsPreset, 'custom'>,
  Record<QaStandardRuleKey, boolean>
> = {
  standard: {
    ...ALL_RULES_ENABLED,
    releaseContextAwareness: false,
  },
  enterprise: { ...ALL_RULES_ENABLED },
  agile: {
    clearBugTitles: true,
    reproducibleSteps: true,
    separateExpectedActual: true,
    noAssumptions: true,
    severityStandards: true,
    priorityStandards: true,
    professionalLanguage: false,
    environmentAwareness: false,
    releaseContextAwareness: false,
    confidenceBasedGeneration: true,
  },
}

export const QA_STANDARDS_PRESET_RULE_COUNTS: Record<
  Exclude<QaStandardsPreset, 'custom'>,
  number
> = {
  standard: QA_STANDARD_RULE_ORDER.filter((key) => QA_STANDARDS_PRESET_RULES.standard[key])
    .length,
  enterprise: QA_STANDARD_RULE_ORDER.filter((key) => QA_STANDARDS_PRESET_RULES.enterprise[key])
    .length,
  agile: QA_STANDARD_RULE_ORDER.filter((key) => QA_STANDARDS_PRESET_RULES.agile[key]).length,
}

export const QA_STANDARDS_PRESET_LABELS: Record<
  Exclude<QaStandardsPreset, 'custom'>,
  { label: string; description: string }
> = {
  standard: {
    label: 'Standard QA',
    description: 'Balanced daily triage — core rules without release-context emphasis.',
  },
  enterprise: {
    label: 'Enterprise QA',
    description: 'Full rule set including environment and release context.',
  },
  agile: {
    label: 'Agile team',
    description: 'Core repro and severity rules only — faster sprint triage.',
  },
}

export const QA_STANDARDS_PRESET_OUTPUT_STYLE: Record<
  Exclude<QaStandardsPreset, 'custom'>,
  QaGenerationOutputStyle
> = {
  standard: 'standard',
  enterprise: 'detailed',
  agile: 'concise',
}

export const QA_OUTPUT_STYLE_LABELS: Record<QaGenerationOutputStyle, string> = {
  concise: 'Concise',
  standard: 'Standard',
  detailed: 'Detailed',
}

export function getOutputStyleForQaStandardsPreset(
  preset: QaStandardsPreset,
): QaGenerationOutputStyle | null {
  if (preset === 'custom') return null
  return QA_STANDARDS_PRESET_OUTPUT_STYLE[preset]
}

/** Resolves the output style used at generation time. Built-in presets override stored style. */
export function resolveEffectiveOutputStyle(
  preset: QaStandardsPreset,
  storedOutputStyle: QaGenerationOutputStyle,
): QaGenerationOutputStyle {
  return getOutputStyleForQaStandardsPreset(preset) ?? storedOutputStyle
}

export const QA_STANDARDS_PRESET_INSTRUCTIONS: Record<
  Exclude<QaStandardsPreset, 'custom'>,
  string
> = {
  standard: [
    '## Preset: Standard QA',
    'Generate balanced, professional bug reports suitable for daily triage.',
    'Include all standard sections with clear but concise wording.',
  ].join('\n'),
  enterprise: [
    '## Preset: Enterprise QA',
    'Generate detailed, formal bug reports for enterprise workflows.',
    '- Include prerequisites or setup context in steps when the report implies them.',
    '- Explicitly mention environment, browser, OS, and device in issueSummary or severityReasoning when available.',
    '- Include release/deployment context when mentioned in the report.',
    '- Use formal, precise QA language throughout.',
  ].join('\n'),
  agile: [
    '## Preset: Agile team',
    'Generate concise bug reports optimized for fast sprint triage.',
    '- Keep issueSummary to 1–2 sentences focused on user impact.',
    '- Limit stepsToReproduce to essential steps only (3–5 when possible).',
    '- Prioritize clarity of expectedResult and actualResult over verbose reasoning.',
    '- Keep severityReasoning brief (1–2 sentences).',
  ].join('\n'),
}

export function createDefaultQaTicketStandards(): QaTicketStandardsSettings {
  return {
    preset: 'standard',
    rules: { ...QA_STANDARDS_PRESET_RULES.standard },
    customRules: '',
  }
}

export function rulesMatchPreset(
  rules: Record<QaStandardRuleKey, boolean>,
  preset: Exclude<QaStandardsPreset, 'custom'>,
): boolean {
  const expected = QA_STANDARDS_PRESET_RULES[preset]
  return QA_STANDARD_RULE_ORDER.every((key) => rules[key] === expected[key])
}

export function detectPresetFromRules(
  rules: Record<QaStandardRuleKey, boolean>,
): QaStandardsPreset {
  if (rulesMatchPreset(rules, 'standard')) return 'standard'
  if (rulesMatchPreset(rules, 'enterprise')) return 'enterprise'
  if (rulesMatchPreset(rules, 'agile')) return 'agile'
  return 'custom'
}

/** @deprecated Use rulesMatchPreset or detectPresetFromRules instead. */
export function rulesDivergeFromDefaults(rules: Record<QaStandardRuleKey, boolean>): boolean {
  return detectPresetFromRules(rules) === 'custom'
}

export function normalizeQaTicketStandards(
  raw: Partial<QaTicketStandardsSettings> | null | undefined,
  legacyGuidelines?: string,
): QaTicketStandardsSettings {
  const defaults = createDefaultQaTicketStandards()
  const rawRules = (raw?.rules ?? {}) as Partial<Record<QaStandardRuleKey, boolean>>
  const rules = { ...defaults.rules }

  for (const key of QA_STANDARD_RULE_ORDER) {
    const value = rawRules[key]
    if (typeof value === 'boolean') {
      rules[key] = value
    }
  }

  const customRules =
    typeof raw?.customRules === 'string'
      ? raw.customRules
      : legacyGuidelines?.trim() ?? defaults.customRules

  const detectedPreset = detectPresetFromRules(rules)

  return { preset: detectedPreset, rules, customRules }
}

export function applyQaStandardsPreset(
  preset: Exclude<QaStandardsPreset, 'custom'>,
  existingCustomRules = '',
): QaTicketStandardsSettings {
  return {
    preset,
    rules: { ...QA_STANDARDS_PRESET_RULES[preset] },
    customRules: existingCustomRules,
  }
}

export function isQaStandardRuleEnabled(
  settings: QaTicketStandardsSettings,
  rule: QaStandardRuleKey,
): boolean {
  return settings.rules[rule]
}

export function formatQaStandardsRulesPrompt(settings: QaTicketStandardsSettings): string {
  const enabledRules = QA_STANDARD_RULE_ORDER.filter((key) => settings.rules[key])
  if (enabledRules.length === 0) {
    return ''
  }

  const ruleBlocks = enabledRules.map((key) => QA_STANDARD_RULE_META[key].prompt)

  return [
    '## QA Ticket Standards (mandatory — highest priority)',
    'These industry-standard QA rules MUST be followed. They override custom rules and project context when conflicts arise.',
    '',
    ...ruleBlocks,
  ].join('\n\n')
}

export function formatQaStandardsPresetPrompt(settings: QaTicketStandardsSettings): string {
  if (settings.preset === 'custom') {
    return ''
  }
  return QA_STANDARDS_PRESET_INSTRUCTIONS[settings.preset]
}

export function formatQaStandardsCustomRulesPrompt(customRules: string): string {
  const trimmed = customRules.trim()
  if (!trimmed) return ''

  return [
    '## Custom project rules (supplementary)',
    'Apply these project-specific rules AFTER the QA Ticket Standards above.',
    'Do NOT override mandatory QA standards. Do NOT invent facts unsupported by the report.',
    '',
    trimmed,
  ].join('\n')
}

/** Full standards preview for the settings UI. */
export function formatQaStandardsPreview(settings: QaTicketStandardsSettings): string {
  const sections = [
    formatQaStandardsRulesPrompt(settings),
    formatQaStandardsPresetPrompt(settings),
    formatQaStandardsCustomRulesPrompt(settings.customRules),
  ].filter(Boolean)

  return sections.join('\n\n') || 'No standards enabled. Enable rules or add custom instructions.'
}
