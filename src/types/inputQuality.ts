export type InputQualityIssueType =
  | 'missing_environment'
  | 'missing_feature'
  | 'missing_reproduction'

export interface InputQualityIssue {
  type: InputQualityIssueType
  message: string
  suggestion: string
}

export interface InputQualityReport {
  issues: InputQualityIssue[]
  completenessScore: number
  isReadyForHighQualityGeneration: boolean
}
