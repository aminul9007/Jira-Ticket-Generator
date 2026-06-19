# Installation

## Requirements

- Google Chrome or Microsoft Edge (Chromium)
- QA Bug Assistant API backend running locally or on your network
- Jira Cloud credentials (optional if configured on the API server)

## Build

From the repository root:

```bash
npm install
npm run extension:build
```

Output directory: **`dist-extension/`**

## Load in Chrome

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `dist-extension/` folder

## Update after code changes

1. Run `npm run extension:build` again
2. Open `chrome://extensions`
3. Click the **Reload** button on QA Bug Assistant

## Watch mode (development)

```bash
npm run dev:extension
```

Rebuilds on file changes. Reload the extension manually after each build.

## Keyboard shortcut

Default: **Ctrl+Shift+B** (Mac: **Command+Shift+B**)

Configure or change at `chrome://extensions/shortcuts`.

**Note:** Chrome may not open the popup from the keyboard command in all cases. Use the toolbar icon as a fallback.
