import type { JiraSettings } from '../../types/appSettings'
import { buildJiraConnectionConfig } from '../../utils/buildJiraConnectionConfig'
import { testExtensionMcpConnection } from './extensionJiraApi'

export interface ExtensionJiraTestResult {
  ok: boolean
  message: string
  usesServerCredentials: boolean
}

/** Test Jira MCP via the same API backend as the web application. */
export async function testExtensionJiraConnection(
  jira: JiraSettings,
): Promise<ExtensionJiraTestResult> {
  const connection = buildJiraConnectionConfig(jira)
  const status = await testExtensionMcpConnection(connection)
  const ok = status.connected && status.hasCreateTool

  return {
    ok,
    message: status.message,
    usesServerCredentials: !connection,
  }
}

export async function isExtensionJiraReady(jira: JiraSettings): Promise<boolean> {
  const result = await testExtensionJiraConnection(jira)
  return result.ok
}
