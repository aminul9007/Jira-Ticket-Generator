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
  category: BugCategory | ''
  environments: Environment[]
  title: string
  additionalNotes: string
}

/** Form values after required fields pass validation. */
export interface ValidatedBugReportFormValues
  extends Omit<BugReportFormValues, 'category'> {
  category: BugCategory
}

export interface GeneratedTicket {
  title: string
  issueSummary: string
  stepsToReproduce: string[]
  expectedResult: string
  actualResult: string
  severity: TicketSeverity
  priority: TicketPriority
  category: BugCategory
  environments: Environment[]
}
