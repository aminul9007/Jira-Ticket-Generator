import type { BugCategory } from '../../types/bugReport'

export interface PromptBundle {
  systemPrompt: string
  userPrompt: string
  category: BugCategory
}

export interface CategoryPromptGuide {
  category: BugCategory
  prefix: string
  focusAreas: string[]
  titleRules: string[]
  titleExamples: [string, string, string]
  stepsRules: string[]
  stepsExample: string[]
  severityRules: string[]
  priorityRules: string[]
  rootCauseRules: string[]
}

export interface ReportContext {
  issueDescription: string
  environments: string
  hasEnvironmentHint: boolean
  isProduction: boolean
}
