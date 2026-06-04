import type { JiraSettings } from '../../types/appSettings'

export type JiraConnectionStatus = 'success' | 'invalid' | 'unreachable' | 'incomplete'

export interface JiraConnectionResult {
  status: JiraConnectionStatus
  message: string
}

const DOMAIN_PATTERN = /^[a-z0-9][a-z0-9-]*\.atlassian\.net$/i

function normalizeDomain(domain: string): string {
  return domain
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/\/.*$/, '')
    .toLowerCase()
}

export function validateJiraSettingsFields(jira: JiraSettings): JiraConnectionResult | null {
  const domain = normalizeDomain(jira.domain)
  const email = jira.email.trim()
  const token = jira.apiToken.trim()

  if (!domain || !email || !token) {
    return {
      status: 'incomplete',
      message: 'Enter Jira domain, email, and API token.',
    }
  }

  if (!DOMAIN_PATTERN.test(domain)) {
    return {
      status: 'invalid',
      message: 'Domain should look like company.atlassian.net',
    }
  }

  if (!email.includes('@')) {
    return {
      status: 'invalid',
      message: 'Enter a valid Jira account email.',
    }
  }

  return null
}

/** Test Jira Cloud credentials (browser may block CORS; architecture ready for server proxy). */
export async function testJiraConnection(jira: JiraSettings): Promise<JiraConnectionResult> {
  const fieldError = validateJiraSettingsFields(jira)
  if (fieldError) return fieldError

  const domain = normalizeDomain(jira.domain)
  const email = jira.email.trim()
  const token = jira.apiToken.trim()
  const auth = btoa(`${email}:${token}`)

  try {
    const response = await fetch(`https://${domain}/rest/api/3/myself`, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: 'application/json',
      },
    })

    if (response.ok) {
      return {
        status: 'success',
        message: 'Connected successfully',
      }
    }

    if (response.status === 401 || response.status === 403) {
      return {
        status: 'invalid',
        message: 'Invalid Jira credentials',
      }
    }

    return {
      status: 'unreachable',
      message: `Jira returned ${response.status}. Check domain and token permissions.`,
    }
  } catch {
    return {
      status: 'unreachable',
      message:
        'Could not reach Jira from the browser (network or CORS). Credentials are saved for future server-side issue creation.',
    }
  }
}
