# Configuration

## In-extension settings

Open the extension popup and click the **⚙ Settings** button.

### Jira Settings

| Field | Description |
|-------|-------------|
| Jira Base URL | Your Atlassian Cloud domain, e.g. `company.atlassian.net` |
| Email / User | Jira account email |
| API Token | API token from [id.atlassian.com](https://id.atlassian.com) |

Use **Test Connection** to verify credentials. Results show only:

- **Connected Successfully**
- **Unable to Connect**

### Ticket Defaults

Pre-fill review screen fields:

- Default Project
- Default Issue Type
- Default Assignee (optional)
- Default Reporter (optional)

### Voice Settings

| Setting | Options |
|---------|---------|
| Language | English (US), English (UK) |
| Auto Stop | 5, 10, or 15 seconds of silence |

### Extension Settings

| Action | Effect |
|--------|--------|
| Clear Drafts | Removes saved in-progress report |
| Reset Preferences | Restores default settings and Jira preferences |
| Clear Drafts & Preferences | Both actions combined |

## Storage

All settings are stored in **`chrome.storage.local`** under:

- `qa-bug-assistant-app-settings` — full app settings schema
- `qa-bug-assistant-jira-defaults` — last-used Jira field selections
- `qa-bug-assistant-extension-draft` — in-progress report draft

Drafts are cleared automatically after successful Jira creation.

## API URL

Set in the project `.env` file before building:

```env
VITE_API_BASE_URL=http://localhost:3001
```

Rebuild the extension after changing this value:

```bash
npm run extension:build
```

The active API URL is shown in **Settings → Extension Settings**.

## Version

Displayed at the bottom of the Settings page. Read from `package.json` at build time — not hardcoded in source.
