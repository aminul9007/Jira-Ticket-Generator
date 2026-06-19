import type { JiraSettings } from '../../types/appSettings'
import {
  testJiraConnection,
  validateJiraSettingsFields,
} from '../../services/jira/testJiraConnection'

export interface ExtensionJiraTestResult {
  ok: boolean
  message: 'Connected Successfully' | 'Unable to Connect'
}

/** User-friendly Jira connection test for the extension settings page. */
export async function testExtensionJiraConnection(
  jira: JiraSettings,
): Promise<ExtensionJiraTestResult> {
  const fieldError = validateJiraSettingsFields(jira)
  if (fieldError) {
    return { ok: false, message: 'Unable to Connect' }
  }

  const result = await testJiraConnection(jira)
  if (result.status === 'success') {
    return { ok: true, message: 'Connected Successfully' }
  }

  return { ok: false, message: 'Unable to Connect' }
}
