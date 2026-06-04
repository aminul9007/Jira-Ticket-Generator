import type { ValidatedBugReportFormValues } from '../../types/bugReport'
import type { TicketHistoryRecord } from '../../types/ticketHistory'
import type { TicketFeedbackRecord } from '../../types/ticketFeedback'
import type { ProjectKnowledgeSettings } from '../../types/projectKnowledge'

export interface KnowledgeContext {
  project: {
    name: string
    overview: string
    description: string
    goals: string
  }
  testing: {
    guidelines: string
    bugReportingStandards: string
  }
  taxonomy: {
    environments: string[]
    features: string[]
    terminology: string[]
  }
}

export interface AiGenerationContext {
  knowledge: KnowledgeContext
  knowledgeSettings: ProjectKnowledgeSettings
  similarTickets: TicketHistoryRecord[]
  feedbackSummary: string
}

export interface PromptGenerationInput {
  values: ValidatedBugReportFormValues
  knowledgeSettings: ProjectKnowledgeSettings
  history?: TicketHistoryRecord[]
  feedback?: TicketFeedbackRecord[]
}
