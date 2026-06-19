# QA Bug Assistant — Chrome Extension

Production-ready Chrome extension for fast QA bug reporting with AI ticket generation and Jira creation.

**Version:** `1.1.0` — V1 RC — Release Preparation

## Quick start

```bash
npm run extension:build
```

Load `dist-extension/` in Chrome via **Load unpacked**.

Start the API backend:

```bash
npm run api:dev
# or
npm run dev:local
```

## Documentation

| Guide | Description |
|-------|-------------|
| [Installation](./installation.md) | Load and update the extension |
| [Configuration](./configuration.md) | Settings, API URL, storage |
| [Jira Setup](./jira-setup.md) | Credentials and connection test |
| [Voice Usage](./voice-usage.md) | Dictation workflow |
| [Troubleshooting](./troubleshooting.md) | Common issues and fixes |

## Architecture

```
Extension popup
  → Settings / Health checks (chrome.storage.local)
  → Voice (useVoiceSession)
  → generateTicket() (shared)
  → createJiraIssue() (shared)
  → API backend → Jira Cloud
```

## Build output

| Script | Output |
|--------|--------|
| `npm run extension:build` | `dist-extension/` |
| `npm run build:extension` | Alias for `extension:build` |
| `npm run dev:extension` | Watch mode rebuild |

## Keyboard shortcut

**Ctrl+Shift+B** (Mac: **Command+Shift+B**) — configure at `chrome://extensions/shortcuts`.

If the shortcut does not open the popup, click the toolbar icon instead (Chrome may restrict programmatic popup open).
