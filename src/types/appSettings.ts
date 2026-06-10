export type AiOutputStyle = 'concise' | 'standard' | 'detailed'

export type VoiceLanguage = 'en-US' | 'en-GB'

export type SilenceTimeoutSeconds = 5 | 10 | 15

export type HistoryRetentionCount = 30 | 50 | 100

export type DefaultIssueType = 'Bug' | 'Task' | 'Story'

export interface AiSettings {
  projectContext: string
  /** Project-specific ticket writing rules, terminology, and tone — injected into AI prompts. */
  ticketGuidelines: string
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
  data: DataSettings
}

export const APP_SETTINGS_STORAGE_KEY = 'qa-bug-report-app-settings'
