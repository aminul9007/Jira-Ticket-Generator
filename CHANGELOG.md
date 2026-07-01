# Changelog

All notable changes to **QA Bug Assistant** are documented here.
Version numbers follow [semver](https://semver.org/) (`major.minor.patch`), matching the Chrome extension manifest and `package.json`.

---

## [1.2.2] — 2026-07-01

### Added

- **Attribution footer** on web dashboard and every extension popup screen (`PopupFrame`, `PopupAttributionFooter`)
- Shared **`AuthorLink`** component — links Md Aminul Islam to LinkedIn
- **`git-release-commit`** Cursor skill — release commit and versioning checklist

### Changed

- About page footer — author name links to LinkedIn (credit + copyright lines)
- Tighter extension footer spacing; popup height follows content

### Fixed

- `about.js` — null guard before `backBtn.addEventListener`

---

## [1.2.1] — 2026-06-17

### Added

- Shared **about page** (`about/`) for web app and Chrome extension — project overview, structure tree, features, stack, and runtime flow
- **ⓘ info control** in extension popup header and web dashboard header to open the about page
- **Copyright footer** on about page — Designed, Developed & Built by Md Aminul Islam
- **graphify/** Mermaid architecture diagrams (web + extension + server)
- **`.cursor/skills/qa-bug-assistant/`** agent skill — architecture, API reference, and dev workflows
- `scripts/viteAboutPlugin.ts` — serves `/about/*` in web dev and copies assets into `dist/` and `dist-extension/`
- `extensionAboutService.ts` — opens about page in a new tab from the extension
- Footer link to about page on the web dashboard

### Changed

- Extension and settings UI show **semver only** (e.g. `1.2.1`) — matches Chrome extensions page numbering
- About page version reads from extension manifest or `package.json` at build time
- Extension verify script checks for bundled about assets

---

## [1.2.0] — 2026-06 (V1 Release)

### Added

- Chrome extension MV3 popup — capture page URL/title, generate ticket, create Jira issue
- `GET /api/config/bootstrap` — sync Jira domain, project, and defaults to extension
- Draft persistence across popup closes; **New ticket** control
- Customizable keyboard shortcut; settings screen with Jira connection test
- Extension icons (bug + Jira ticket design, 16–512px)
- Formal issue title polishing with environment/browser/OS context

### Fixed

- Jira reporter field via MCP `additional_fields`
- Extension logger — `warn`/`error` always log in production builds
- TypeScript build and unused import cleanup

---

## [1.1.x] — Extension foundation

- Extension popup screens (input, review, success, settings)
- Shared `generateTicket()` with web app
- Health banner, API URL resolution, analytics hooks

---

## [1.0.x] — Web app foundation

- React dashboard with voice input and AI/rules ticket generation
- Node API on port 3001 with MCP Jira bridge
- Ticket history, templates, QA standards engine
