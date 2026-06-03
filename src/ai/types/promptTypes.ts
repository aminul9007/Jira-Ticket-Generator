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
  category: BugCategory
  environments: string
  affectedFeaturePage: string
  title: string
  additionalNotes: string
  hasFeature: boolean
  hasNotes: boolean
  isProduction: boolean
}
