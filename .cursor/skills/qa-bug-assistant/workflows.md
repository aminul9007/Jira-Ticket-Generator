# QA Bug Assistant Development Workflows

## Setup

### Web app + API (daily use)

```bash
npm install
npm run api:install
npm run api:dev          # Terminal 1 — API :3001
npm run dev:vite         # Terminal 2 — Web :5173
# Or combined:
npm run dev
```

Configure `server/.env` (Jira URL, email, API token, project). See `docs/JIRA_MCP_SETUP.md`.

### Chrome extension

```bash
npm run api:dev          # Required for generation + Jira
npm run extension:build  # → dist-extension/
```

Load unpacked: `chrome://extensions` → `dist-extension/`

Watch mode: `npm run dev:extension`

---

## Commit format

Follow repository history — concise imperative subject, optional body explaining **why**:

```
Polish extension popup UX for shortcuts, new tickets, and context.
```

For release-style changes, mention web + extension + server impact when relevant.

---

## Release checklist (extension)

```
- [ ] npm test && npm run api:test
- [ ] npm run extension:release
- [ ] Reload extension in Chrome
- [ ] Smoke: describe bug → generate → create Jira (API running)
- [ ] Verify about page: Settings → About & Project Structure
- [ ] Update zip if distributing: qa-bug-assistant-extension-v1.2.0.zip
```

---

## Add a shared type or API field

1. Update `shared/jiraApi.ts` (or relevant `shared/` module).
2. Update `server/src/jira/validatePayload.ts` (Zod).
3. Update `src/utils/buildJiraCreatePayload.ts`.
4. Update web + extension consumers.
5. Add/adjust tests in `server/src/jira/*.test.ts` and client tests.

---

## Change ticket generation / AI output

1. Prompts: `src/ai/prompts/jiraBugReportPrompt.ts`, `baseSeniorQaPrompt.ts`.
2. Validation: `src/ai/utils/validateAiResponse.ts`.
3. Rules fallback: `src/services/ticketGeneration/seniorQaTicketGenerator.ts`.
4. Title polish: `src/utils/polishIssueTitle.ts` + tests.
5. Run `npm test`.

---

## Change extension popup UI

1. Components under `src/extension/components/`.
2. State: `extensionStateReducer.ts` + `useExtensionStateManager.ts`.
3. Styles: `src/extension/popup/Popup.css`.
4. `npm run extension:build` and reload extension.

---

## Add static extension page (like about/)

1. Create files under `about/` (or new folder).
2. Copy in `vite.extension.config.ts` `closeBundle` (use `copyAboutToExtension` pattern).
3. Add to `scripts/verify-extension-build.mjs` required files.
4. Open from extension via `chrome.runtime.getURL('about/...')`.

For **web app** access to the same page:

1. Files live in `about/` (single source).
2. `scripts/viteAboutPlugin.ts` serves `/about/*` in dev and copies to `dist/about/` on web build.
3. Link from web UI: `/about/about.html`.

---

## Debug extension → API connection

1. Confirm `npm run api:dev` is running on port 3001.
2. Open extension Settings — check API URL line.
3. Health banner warnings from `extensionHealthService.ts`.
4. DevTools → extension service worker / popup console (`[QA Bug Assistant]` logs).
5. Try `GET http://localhost:3001/health` in browser.

---

## Debug Jira create failure

1. Check `server/.env` credentials and project key.
2. `POST /api/jira/mcp/test` from Settings (web or extension).
3. Server logs — MCP stderr, Pydantic validation errors.
4. Reporter field — must use `additional_fields` in MCP args.
5. Run `npm run api:test`.

---

## Test commands

```bash
npm test                              # all root vitest (src + shared)
npm run api:test                      # server vitest
npm run test -- src/utils/polishIssueTitle.test.ts   # single file
npm run extension:release             # full extension gate
npm run lint
```

---

## Architecture docs in repo

| Path | Contents |
|------|----------|
| `README.md` | User-facing overview |
| `about/about.html` | About page (web + extension) |
| `graphify/project-structure.md` | Mermaid module graph |
| `.cursor/skills/qa-bug-assistant/architecture.md` | Sequences + state |
| `.cursor/skills/qa-bug-assistant/reference.md` | API + invariants |
| `docs/README.md` | Setup guides index |
