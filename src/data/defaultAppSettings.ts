import { createDefaultTicketTemplateSettings } from '../../shared/ticketTemplate'
import type { AppSettings } from '../types/appSettings'

export const PROJECT_CONTEXT_PLACEHOLDER = `Product: Website Builder

Environments:
- Production
- Beta
- Canary

Common Components:
- Layer Panel
- Header
- Site Settings
- Template Builder

Severity Rules:
- Critical = Site unusable
- High = Core functionality broken
- Medium = Functional issue with workaround
- Low = Cosmetic/UI issue`

export const TICKET_GUIDELINES_PLACEHOLDER = `Writing style for this project:
- Use clear, professional QA language — no casual phrasing or filler words.
- Titles must be complete thoughts (never end with "..." or ellipsis).
- Name features exactly as they appear in the product (e.g. "Layer Panel", not "sidebar").
- Summaries: start with user/business impact, then technical scope.
- Steps: imperative verbs (Open, Navigate, Click, Enter, Observe).
- Prefer "Unable to…" / "Fails to…" over vague "issue" or "problem".

Environment vocabulary:
- "Production stage" means Production only (not Beta).
- Use Canary / Beta / Production exactly as named above.`

export const DEFAULT_APP_SETTINGS: AppSettings = {
  ai: {
    projectContext: '',
    ticketGuidelines: '',
    outputStyle: 'standard',
    autoGenerateAfterVoice: true,
  },
  voice: {
    language: 'en-US',
    silenceTimeoutSeconds: 5,
    showLiveTranscript: true,
  },
  jira: {
    domain: '',
    email: '',
    apiToken: '',
  },
  ticketDefaults: {
    projectKey: '',
    issueType: 'Bug',
    labels: [],
    assignee: '',
  },
  ticketTemplate: createDefaultTicketTemplateSettings(),
  data: {
    historyRetention: 50,
  },
}
