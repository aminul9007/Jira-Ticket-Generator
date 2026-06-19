# QA Bug Assistant — Chrome Extension (Phase 2)

**Version:** `0.2.0` — Phase 2 Step 3 — Jira Creation

The extension popup generates tickets with the shared AI pipeline and creates Jira issues through the existing API backend.

## Build

```bash
npm run build:extension
```

Output: `dist/extension/`

Watch mode during development:

```bash
npm run dev:extension
```

## Load in Chrome

1. Run `npm run build:extension`
2. Start the API backend: `npm run api:dev` (or `npm run dev:local` for web + API)
3. Open `chrome://extensions`
4. Enable **Developer mode**
5. Click **Load unpacked**
6. Select the `dist/extension` folder

## Popup flow

```
Input → Generate → Review → Create Jira → Success
```

- Width: 400px, min height: 600px
- Captures active tab URL, title, and timestamp on open
- **Generate Ticket** calls the same `generateTicket()` service as the web app
- Review screen allows editing ticket fields plus Jira project, issue type, assignee, and reporter
- **Create Jira** calls the same `createJiraIssue()` service as the web app
- Last-used Jira field selections are stored in `chrome.storage.local`

## Jira creation flow

```
Extension popup
  → buildJiraCreatePayload()  (shared)
  → createJiraIssue()         (shared)
  → POST /api/jira/issues     (existing API)
  → createIssueViaMcp()       (server)
  → Jira Cloud
```

Set `VITE_API_BASE_URL` in `.env` if the API is not on `http://localhost:3001`.

## Keyboard shortcut

Suggested shortcut: **Ctrl+Shift+B** (Mac: **Command+Shift+B**)

Configure under `chrome://extensions/shortcuts`.

## Permissions

- `activeTab` — read URL/title of the active tab when the popup opens
- `storage` — app settings and last-used Jira field selections
- `host_permissions` — `http://localhost:3001/*` and `http://127.0.0.1:3001/*` for the API backend

No `scripting`, `debugger`, or `webRequest`.

## Assumptions

- Extension build is isolated from the web app Vite config (`vite.extension.config.ts`)
- Jira credentials can live in extension settings (synced from web app settings key) or on the API server via `.env`
- Icons use the Chrome default puzzle piece until a branded icon set is added
