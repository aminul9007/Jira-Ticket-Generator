# QA Bug Assistant — Chrome Extension (V1)

**Version:** `1.0.0` — Production-ready for daily QA use

Target workflow: describe or dictate a bug → generate → review → create in Jira (~20–30 seconds).

## Build

```bash
npm run build:extension
```

Output: `dist/extension/`

Watch mode:

```bash
npm run dev:extension
```

## Load in Chrome

1. Run `npm run build:extension`
2. Start the API backend: `npm run api:dev` (or `npm run dev:local`)
3. Open `chrome://extensions` → **Developer mode** → **Load unpacked** → select `dist/extension`

## Keyboard shortcut

**Ctrl+Shift+B** (Mac: **Command+Shift+B**)

Configure at `chrome://extensions/shortcuts`.

### Shortcut behavior

The background worker calls `chrome.action.openPopup()` when the command fires. Chrome may block programmatic popup opening in some cases (no active user gesture, popup already open, or browser policy).

**Fallback:** Click the **QA Bug Assistant** toolbar icon, or re-bind the shortcut at `chrome://extensions/shortcuts`.

## Popup flow

```
Input (type or voice) → Generate → Review → Create Jira → Success
```

## V1 polish features

| Feature | Behavior |
|---------|----------|
| Auto-focus | Description textarea focused on open |
| Draft persistence | Description, ticket, and Jira fields restored from `chrome.storage.local` |
| Draft clear | Cleared only after successful Jira creation or **Create Another Ticket** |
| Jira preferences | Project, issue type, assignee, reporter remembered |
| Loading UX | Spinners + progress text during generate and Jira create |
| Validation | Friendly messages before generate (description) and Jira create (project) |
| Error recovery | **Retry** buttons preserve all form state |
| Branding | Extension icons + consistent header |

## Permissions

- `activeTab` — page URL/title capture
- `storage` — settings, drafts, Jira preferences
- `host_permissions` — API backend (`localhost:3001`)

## Assumptions

- Voice dictation requires Chrome or Edge (Web Speech API)
- Jira API backend must be running and reachable
- Icons ship in `src/extension/icons/` and copy to `dist/extension/icons/` on build
