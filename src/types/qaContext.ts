export interface QaContextSettings {
  productName: string
  commonEnvironments: string[]
  commonFeatures: string[]
  commonBugCategories: string[]
}

export const QA_CONTEXT_STORAGE_KEY = 'qa-bug-report-context-settings'
