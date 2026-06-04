export interface ProjectKnowledgeSettings {
  projectName: string
  projectOverview: string
  productDescription: string
  productGoals: string
  testingGuidelines: string
  commonEnvironments: string[]
  commonFeatures: string[]
  teamTerminology: string[]
  bugReportingStandards: string
}

/** @deprecated Use ProjectKnowledgeSettings */
export type QaContextSettings = ProjectKnowledgeSettings

export const PROJECT_KNOWLEDGE_STORAGE_KEY = 'qa-bug-report-context-settings'

/** @deprecated Use PROJECT_KNOWLEDGE_STORAGE_KEY */
export const QA_CONTEXT_STORAGE_KEY = PROJECT_KNOWLEDGE_STORAGE_KEY
