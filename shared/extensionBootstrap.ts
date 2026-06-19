/** Non-secret config exposed to the Chrome extension at startup. */
export interface ExtensionBootstrapResponse {
  jira: {
    domain: string
    email: string
    /** True when server/.env has URL, username, and API token. */
    configured: boolean
  }
  ticketDefaults: {
    projectKey: string
    issueType: string
  }
}
