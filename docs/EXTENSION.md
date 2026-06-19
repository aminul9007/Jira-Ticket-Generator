# QA Bug Assistant — Chrome Extension

**Version:** `1.1.0` — see [docs/extension/README.md](./extension/README.md) for full documentation.

## Build

```bash
npm run extension:build
```

Output: **`dist-extension/`** — load directly in Chrome as an unpacked extension.

## Quick load

1. `npm run extension:build`
2. `npm run api:dev` (or `npm run dev:local`)
3. Chrome → `chrome://extensions` → Load unpacked → `dist-extension/`

## Docs

- [Installation](./extension/installation.md)
- [Configuration](./extension/configuration.md)
- [Jira Setup](./extension/jira-setup.md)
- [Voice Usage](./extension/voice-usage.md)
- [Troubleshooting](./extension/troubleshooting.md)
