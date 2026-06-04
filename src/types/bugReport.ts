import type { ExtractedContext } from './contextDetection'

export type BugCategory =
  | 'UI Bug'
  | 'Functional Bug'
  | 'Mobile Bug'
  | 'SEO Issue'
  | 'Accessibility Issue'
  | 'Performance Issue'

export type Environment = 'Canary' | 'Beta' | 'Production'

export type TicketSeverity = 'Critical' | 'High' | 'Medium' | 'Low'

export type TicketPriority = 'P0' | 'P1' | 'P2' | 'P3' | 'P4'

/** Minimal dashboard form state — only user-entered fields. */
export interface BugReportFormValues {
  issueDescription: string
  environments: Environment[]
  qaContext: ExtractedContext
}

/** Valid form state (non-empty issue description). No inferred fields. */
export interface ValidatedBugReportFormValues extends BugReportFormValues {
  issueDescription: string
}

export interface GeneratedTicket {
  /** Recommended primary title (best of titleSuggestions). */
  title: string
  titleSuggestions: [string, string, string]
  issueSummary: string
  stepsToReproduce: string[]
  expectedResult: string
  actualResult: string
  severity: TicketSeverity
  priority: TicketPriority
  severityReasoning: string
  possibleRootCauses: string[]
  confidenceScore: number
  category: BugCategory
  environments: Environment[]
  affectedFeaturePage?: string
}

/** Rules-engine input after inferring category, feature, and title from description. */
export interface ResolvedBugInput extends ValidatedBugReportFormValues {
  category: BugCategory
  affectedFeaturePage: string
  shortTitle: string
}
