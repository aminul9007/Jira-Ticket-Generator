# Jira Setup

## Option A — Extension settings (recommended for local QA)

1. Open the extension popup → **⚙ Settings**
2. Enter **Jira Base URL**, **Email**, and **API Token**
3. Click **Save Settings**
4. Click **Test Connection**

Expected result: **Connected Successfully**

If you see **Unable to Connect**:

- Verify domain format: `company.atlassian.net` (no `https://`)
- Confirm the API token is valid and not expired
- Browser CORS may block direct Jira calls — credentials are still used by the API backend for issue creation

## Option B — API server only

Configure `server/.env`:

```env
JIRA_DOMAIN=company.atlassian.net
JIRA_USERNAME=you@company.com
JIRA_API_TOKEN=your-token
JIRA_DEFAULT_PROJECT_KEY=QA
```

Extension Jira settings can remain empty; the backend uses server credentials.

## Ticket defaults

Set default **Project**, **Issue Type**, **Assignee**, and **Reporter** in Settings → Ticket Defaults to reduce repetitive input on the review screen.

## Create flow

1. Generate a ticket
2. Review and edit fields
3. Confirm Jira project and issue type on the review screen
4. Click **Create Jira**

The extension calls your local API at `POST /api/jira/issues`, which creates the issue via Jira MCP.

## Health warning

If Jira is not configured in the extension and not on the server, you will see:

> Jira is not configured yet.

Configure credentials in Settings or on the API server.
