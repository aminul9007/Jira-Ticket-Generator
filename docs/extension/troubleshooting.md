# Troubleshooting

## Extension will not load

- Confirm you selected the **`dist-extension/`** folder (not the repo root)
- Run `npm run extension:build` and check for errors
- Enable **Developer mode** on `chrome://extensions`

## "Jira is not configured yet"

Configure Jira in **Settings**, or set credentials in `server/.env`. See [Jira Setup](./jira-setup.md).

## "API backend is not reachable"

1. Start the API: `npm run api:dev`
2. Verify health: open `http://localhost:3001/health` in a browser
3. If using a custom URL, set `VITE_API_BASE_URL` in `.env` and rebuild

## Test Connection shows "Unable to Connect"

- Check domain, email, and token in Settings
- Direct browser → Jira calls may fail due to CORS even when server-side creation works
- Ensure the API backend is running for issue creation

## Unable to generate ticket

- Description must be at least 10 characters
- Check API backend is running
- Click **Retry Generation** — your text is preserved

## Unable to create Jira ticket

- Enter a **Jira project key** on the review screen
- Verify API backend and Jira MCP configuration
- Click **Retry Jira Creation** — ticket edits are preserved

## Draft not restored

- Drafts clear after successful Jira creation
- Use **Clear Drafts** in Settings only when intentional
- Check `chrome.storage.local` is available (storage permission)

## Keyboard shortcut does not open popup

Chrome may block programmatic popup open. Fallback:

1. Click the **QA Bug Assistant** toolbar icon
2. Re-bind the shortcut at `chrome://extensions/shortcuts`

## Voice not working

- Use Chrome or Edge on desktop
- Allow microphone permission for the extension
- Check network connectivity

## Large extension package

Icon PNGs may be large in development builds. Optimize icons before Chrome Web Store submission.
