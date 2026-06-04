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

export const DEFAULT_APP_SETTINGS: AppSettings = {
  ai: {
    projectContext: '',
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
  data: {
    historyRetention: 50,
  },
}
