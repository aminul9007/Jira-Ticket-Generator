# QA Bug Assistant — Chrome Extension (Phase 2)

**Version:** `0.2.0` — Phase 2 Step 1 — Extension Foundation

Phase 2 Step 1 provides the browser extension foundation only. AI generation and Jira creation are not wired yet.

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
2. Open `chrome://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked**
5. Select the `dist/extension` folder

## Popup

- Width: 400px
- Min height: 600px
- Captures active tab URL, title, and timestamp on open
- **Generate Ticket** shows **Coming Soon**

## Keyboard shortcut

Suggested shortcut: **Ctrl+Shift+B** (Mac: **Command+Shift+B**)

Configure under `chrome://extensions/shortcuts`. Command handling is a placeholder in the background worker.

## Permissions

- `activeTab` — read URL/title of the active tab when the popup opens
- `storage` — reserved for upcoming settings sync

No `host_permissions`, `scripting`, `debugger`, or `webRequest`.

## Assumptions

- Extension build is isolated from the web app Vite config (`vite.extension.config.ts`)
- Shared app services will be imported in later Phase 2 steps; no web app code was modified
- Icons use the Chrome default puzzle piece until a branded icon set is added
