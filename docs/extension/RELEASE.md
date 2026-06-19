# QA Bug Assistant Extension — Release Build

**Version:** `1.2.0` — V1 Release

Production build output for Chrome **Load unpacked** installation.

## Build commands

```bash
# Full release pipeline (recommended)
npm run extension:release

# Build only
npm run extension:build

# Verify existing build
npm run extension:verify
```

**Output folder:** `dist-extension/`

## Load in Chrome

1. Run `npm run extension:release` (or `npm run extension:build`)
2. Start the API backend: `npm run api:dev` (or `npm run dev:local`)
3. Open [chrome://extensions/](chrome://extensions/)
4. Enable **Developer mode** (top right)
5. Click **Load unpacked**
6. Select the **`dist-extension`** folder from this repository

## Keyboard shortcut

**Ctrl+Shift+B** (Mac: **Command+Shift+B**)

Configure or change at [chrome://extensions/shortcuts](chrome://extensions/shortcuts).

If the shortcut does not open the popup, click the **QA Bug Assistant** toolbar icon instead (Chrome may restrict programmatic popup open).

## Final QA checklist

Before sharing with QA team:

- [ ] Popup opens without a blank screen
- [ ] Description field auto-focuses
- [ ] Voice button visible (Chrome/Edge only)
- [ ] Generate ticket works (API running on port 3001)
- [ ] Review screen shows editable fields
- [ ] Jira creation succeeds with configured credentials
- [ ] Draft restores after closing and reopening popup
- [ ] Settings page opens and saves
- [ ] No errors in popup DevTools console (right-click popup → Inspect)
- [ ] Shortcut configured at `chrome://extensions/shortcuts`

## dist-extension structure

```
dist-extension/
├── manifest.json           # Manifest V3 (version injected at build)
├── background/
│   └── background.js       # MV3 service worker (module)
├── icons/
│   ├── icon-16.png
│   ├── icon-32.png
│   ├── icon-48.png
│   └── icon-128.png
└── popup/
    ├── index.html          # Popup entry
    └── assets/
        ├── popup-*.js      # Bundled React app
        ├── popup-*.css
        └── logger-*.js       # Shared logger chunk
```

## Manifest permissions

| Key | Values | Purpose |
|-----|--------|---------|
| `permissions` | `storage`, `activeTab` | Settings/drafts; page URL/title capture |
| `commands` | `open-assistant` | Ctrl+Shift+B shortcut |
| `host_permissions` | `localhost:3001` | Local API backend only |

No `scripting`, `tabs`, `debugger`, or `webRequest` permissions.

## Known issues

| Issue | Workaround |
|-------|------------|
| Large icon PNGs (~1.1 MB each) | Functional for Load unpacked; optimize before Chrome Web Store |
| API requires localhost | Run `npm run api:dev`; set `VITE_API_BASE_URL` before build for other hosts |
| Jira browser test may fail (CORS) | Server-side creation still works via API |
| Shortcut may not open popup | Use toolbar icon |

## Production readiness

See [README.md](./README.md) for configuration and troubleshooting.
