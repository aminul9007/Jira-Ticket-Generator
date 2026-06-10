# Jira MCP Server Integration

The QA Bug Report Assistant creates Jira issues through a **Node.js API backend** that talks to an **external Jira MCP Server**. Credentials never live in the React frontend.

## Architecture

```
React app (browser)
    ↓  POST /api/jira/issues
Node.js API (server/)
    ↓  MCP stdio transport
Jira MCP Server (external process)
    ↓  Jira REST API
Jira Cloud
```

## Quick start (local development)

### 1. Install dependencies

```bash
npm run api:install
npm run mcp:install
```

`mcp:install` installs the Python **mcp-atlassian** package (`pip install mcp-atlassian`). The API spawns `mcp-atlassian` as a child process — **not** `npx mcp-atlassian` (that npm package is broken).

### 2. Configure the API server

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

| Variable | Description |
|----------|-------------|
| `JIRA_DOMAIN` | Your site, e.g. `company.atlassian.net` (used for browse URLs) |
| `JIRA_URL` | Full URL, e.g. `https://company.atlassian.net` |
| `JIRA_USERNAME` | Atlassian account email |
| `JIRA_API_TOKEN` | API token from [id.atlassian.com](https://id.atlassian.com) |
| `JIRA_DEFAULT_PROJECT_KEY` | Fallback project key (e.g. `QA`) |
| `MCP_SERVER_COMMAND` | Command to start MCP server (default: `npx`) |
| `MCP_SERVER_ARGS` | Comma-separated args (default: `-y,mcp-atlassian`) |
| `MCP_JIRA_CREATE_TOOL` | MCP tool name (default: `jira_create_issue`) |

**UI testing without MCP:** set `JIRA_MCP_MOCK=true` to return a fake `QA-123` issue.

### 3. Start both servers

Terminal 1 — API:

```bash
npm run api:dev
```

Terminal 2 — frontend:

```bash
npm run dev
```

The Vite dev server proxies `/api` → `http://localhost:3001`.

### 4. Configure ticket defaults in the app

Open **Settings → Ticket Defaults** and set:

- **Project key** (required unless `JIRA_DEFAULT_PROJECT_KEY` is set on the server)
- **Issue type** (default: Bug)
- Optional labels and assignee

### 5. Verify MCP connection

In the app, open **Settings → Jira Integration** and click **Test API & MCP connection**.

You should see: `Connected to Jira MCP (49 tools available).`

### 6. Create an issue

1. Set **Ticket Defaults → Project key** in Settings.
2. Generate a ticket on the dashboard.
3. Click **Create Jira Ticket**.
4. On success, open the issue with **Open Jira Ticket**.

Credentials from Settings are forwarded to the API backend when creating issues. For production, prefer `server/.env` only.

## API contract

### `POST /api/jira/issues`

**Request body:**

```json
{
  "title": "Login button unresponsive",
  "summary": "Users cannot sign in on production.",
  "steps": ["Open login page", "Submit credentials"],
  "expected": "User reaches dashboard",
  "actual": "Button does nothing",
  "severity": "High",
  "priority": "P1",
  "environment": "Production",
  "browser": "Chrome",
  "os": "Windows",
  "device": "Desktop",
  "projectKey": "QA",
  "issueType": "Bug",
  "labels": ["regression"]
}
```

**Success (`201`):**

```json
{
  "issueKey": "QA-123",
  "issueUrl": "https://company.atlassian.net/browse/QA-123"
}
```

**Error:**

```json
{
  "error": "Human-readable message",
  "code": "VALIDATION_ERROR | MCP_CONNECTION_ERROR | JIRA_AUTH_ERROR | ..."
}
```

## Supported MCP servers

The backend uses the MCP SDK **stdio transport** and calls a configurable tool name. It is tested against [mcp-atlassian](https://github.com/sooperset/mcp-atlassian) but should work with any server that exposes a compatible `jira_create_issue` (or similarly named) tool.

If your MCP server uses different argument names, adjust `server/src/jira/createIssueViaMcp.ts` or set `MCP_JIRA_CREATE_TOOL` to match your server's tool.

## Production deployment

1. Deploy the `server/` package to your Node host.
2. Run the Jira MCP server alongside it (or configure `MCP_SERVER_COMMAND` / `MCP_SERVER_ARGS`).
3. Set `VITE_API_BASE_URL` at frontend build time to your API origin, e.g. `https://api.yourcompany.com`.
4. Configure `CORS_ORIGIN` on the API to your frontend URL.

## Security notes

- Never put `JIRA_API_TOKEN` in `VITE_*` variables or frontend code.
- The browser only sends ticket content and non-secret defaults (project key, labels).
- Rotate API tokens regularly and scope them to the minimum Jira permissions needed.
