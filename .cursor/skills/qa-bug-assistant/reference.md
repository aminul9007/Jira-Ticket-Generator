# QA Bug Assistant Reference

## Version

Check `package.json` and `src/extension/config/packageMetadata.json`. Extension manifest version is injected at build time from package metadata.

## API endpoints (server `:3001`)

| Method | Path | Client | Purpose |
|--------|------|--------|---------|
| `GET` | `/health` | Extension | API reachability ping |
| `GET` | `/api/config/bootstrap` | Extension | Sync Jira domain, email, project (no token) |
| `POST` | `/api/jira/mcp/test` | Web + Extension | Test MCP connection / list tools |
| `POST` | `/api/jira/issues` | Web + Extension | Create Jira issue via MCP |

Web dev proxy: Vite `:5173` proxies `/api` → `localhost:3001`.

## Shared types (`shared/jiraApi.ts`)

| Type | Use |
|------|-----|
| `CreateJiraIssuePayload` | POST body for issue create |
| `CreateJiraIssueResponse` | `{ issueKey, issueUrl }` |
| `JiraConnectionConfig` | Optional per-request credentials override |
| `McpStatusResponse` | MCP test result |
| `JiraApiErrorCode` | Normalized API errors |

## Generation pipeline

```
TicketGenerationInput { description, context }
  → buildFormValuesFromGenerationInput (shared/generation)
  → generateTicket()
      → if AI enabled: promptBuilder + provider + validateAiResponse
      → else: seniorQaTicketGenerator + inferBugDetails + polishIssueTitle
  → GeneratedTicket
```

## Title polish (`src/utils/polishIssueTitle.ts`)

- Fixes informal grammar (`appears broken` → `is unresponsive`, missing copula).
- Extracts environment, browser, OS, device from text.
- Appends context with natural phrasing: `on Production in Chrome on Windows`.
- `warn`/`error` logs always emit in extension production builds.

## Extension storage keys

| Key | Content |
|-----|---------|
| `qa-bug-assistant-extension-draft` | Draft description, ticket, view |
| `qa-bug-assistant-resolved-api-url` | Last working API base URL |
| Extension app settings | Jira fields, voice, defaults (`extensionSettingsService`) |

## Extension permissions (manifest)

| Permission | Purpose |
|------------|---------|
| `storage` | Drafts, settings, resolved API URL |
| `activeTab` | Page URL and title for bug context |
| `host_permissions` | `localhost:3001`, `127.0.0.1:3001` |

## MCP create issue notes

- Tool name from `server` config (default `jira_create_issue` via mcp-atlassian).
- **Reporter** must be in `additional_fields` JSON, not top-level MCP arg.
- Mock mode: `JIRA_MCP_MOCK=true` in `server/.env`.

## About page access

| Client | URL |
|--------|-----|
| Web app (dev/build) | `/about/about.html` |
| Extension | Settings → **About & Project Structure** → `chrome.runtime.getURL('about/about.html')` |

## Documentation map

| Path | Audience |
|------|----------|
| `README.md` | Project overview + quick start |
| `about/about.html` | Feature list + directory tree |
| `graphify/project-structure.md` | Mermaid module graph |
| `docs/README.md` | Setup index |
| `.cursor/skills/qa-bug-assistant/` | Agent architecture + workflows |

## Do not do (regression traps)

- Do not embed Jira API tokens in the extension bundle.
- Do not bypass `buildJiraCreatePayload` for Jira creates.
- Do not duplicate generation logic in extension — use `generateExtensionTicket.ts`.
- Do not pass top-level `reporter` to MCP `create_issue`.
- Do not edit `dist-extension/` directly — change source and run `extension:build`.
- When adding extension static pages, copy via `vite.extension.config.ts` (e.g. `about/`).
