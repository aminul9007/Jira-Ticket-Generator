import type { DefaultIssueType } from '../../types/appSettings'

export interface ExtensionJiraDefaults {
  projectKey: string
  issueType: DefaultIssueType
  assignee: string
  reporter: string
}

export const EMPTY_EXTENSION_JIRA_DEFAULTS: ExtensionJiraDefaults = {
  projectKey: '',
  issueType: 'Bug',
  assignee: '',
  reporter: '',
}
