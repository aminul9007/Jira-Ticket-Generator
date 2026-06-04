export type BugCategory =
  | 'UI Bug'
  | 'Functional Bug'
  | 'Mobile Bug'
  | 'SEO Issue'
  | 'Accessibility Issue'
  | 'Performance Issue'

export type Environment = 'Canary' | 'Beta' | 'Production'

export type TicketSeverity = 'Critical' | 'High' | 'Medium' | 'Low'

export type TicketPriority = 'P1' | 'P2' | 'P3' | 'P4'

export interface BugReportFormValues {
  issueDescription: string
  environments: Environment[]
}

/** Form values ready for ticket generation. */
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

/** Internal shape used by the rules engine after inferring metadata from description. */
export interface ResolvedBugInput extends ValidatedBugReportFormValues {
  category: BugCategory
  affectedFeaturePage: string
  shortTitle: string
}
