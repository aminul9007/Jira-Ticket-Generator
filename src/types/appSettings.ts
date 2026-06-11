import type { QaTicketStandardsSettings } from '../../shared/qaTicketStandards'
import type { TicketTemplateSettings } from '../../shared/ticketTemplate'

export type {
  QaGenerationOutputStyle,
  QaStandardRuleKey,
  QaStandardsPreset,
  QaTicketStandardsSettings,
} from '../../shared/qaTicketStandards'
export type { TicketTemplateFieldKey, TicketTemplatePreset, TicketTemplateSettings } from '../../shared/ticketTemplate'

export type AiOutputStyle = 'concise' | 'standard' | 'detailed'

export type VoiceLanguage = 'en-US' | 'en-GB'

export type SilenceTimeoutSeconds = 5 | 10 | 15

export type HistoryRetentionCount = 30 | 50 | 100

export type DefaultIssueType = 'Bug' | 'Task' | 'Story'

export interface AiSettings {
  projectContext: string
  outputStyle: AiOutputStyle
  autoGenerateAfterVoice: boolean
}

export interface VoiceSettings {
  language: VoiceLanguage
  silenceTimeoutSeconds: SilenceTimeoutSeconds
  showLiveTranscript: boolean
}

export interface JiraSettings {
  domain: string
  email: string
  apiToken: string
}

export interface TicketDefaultSettings {
  projectKey: string
  issueType: DefaultIssueType
  labels: string[]
  assignee: string
}

export interface DataSettings {
  historyRetention: HistoryRetentionCount
}

export interface AppSettings {
  ai: AiSettings
  voice: VoiceSettings
  jira: JiraSettings
  ticketDefaults: TicketDefaultSettings
  ticketTemplate: TicketTemplateSettings
  qaTicketStandards: QaTicketStandardsSettings
  data: DataSettings
}

export const APP_SETTINGS_STORAGE_KEY = 'qa-bug-report-app-settings'

/** @deprecated Legacy field — migrated to qaTicketStandards.customRules on load. */
export interface LegacyAiSettings {
  ticketGuidelines?: string
}
