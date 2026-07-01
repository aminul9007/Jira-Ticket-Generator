---
name: qa-bug-assistant
description: >-
  QA Bug Assistant (Jira Ticket Generator) architecture for web app, Chrome MV3
  extension, Node API, MCP Jira integration, AI ticket generation, voice input,
  and shared generation logic. Use when working on ticket generation, Jira create,
  extension popup, server routes, polishIssueTitle, or project structure.
---

# QA Bug Assistant Project Skill

Dual-client QA toolkit: **React web dashboard** + **Chrome extension (MV3)** sharing `generateTicket()`, `buildJiraCreatePayload()`, and a **Node API** that creates Jira issues via **MCP stdio → mcp-atlassian**. Version: `package.json` + `src/extension/config/packageMetadata.json`.

## Before changing code

1. Read [architecture.md](architecture.md) for system graphs and sequences.
2. Read [reference.md](reference.md) for API routes, file map, and invariants.
3. Read [graphify/project-structure.md](../../graphify/project-structure.md) for module graph.
4. Match existing patterns — smallest safe diff; reuse `shared/` and `services/ticketGeneration/`.

## Quick orientation

| Layer | Entry | Role |
|-------|-------|------|
| Web UI | `src/pages/DashboardPage.tsx` | Form, preview, Jira create, history |
| Web orchestration | `src/hooks/useBugReportAssistant.ts` | Form + generation + editor + Jira |
| Extension UI | `src/extension/popup/Popup.tsx` | Input → review → success views |
| Extension state | `src/hooks/useExtensionStateManager.ts` | Drafts, bootstrap, generation, Jira |
| Generation | `src/services/ticketGeneration/index.ts` | AI if configured, else rules engine |
| Jira client (web) | `src/services/jira/createJiraIssue.ts` | `fetch` → API |
| Jira client (ext) | `src/extension/services/extensionJiraApi.ts` | Same API endpoints |
| API server | `server/src/routes/jira.ts` | Validate → MCP create |
| Shared payload | `src/utils/buildJiraCreatePayload.ts` | Ticket + QA context → API body |

## Critical invariants

- **Credentials stay off the client bundle** — prefer `server/.env`; extension syncs domain/email/project via `GET /api/config/bootstrap`, not the API token.
- **Same generation pipeline** — extension calls `generateTicket()` through `generateExtensionTicket.ts` → `buildFormValuesFromInput.ts`.
- **MCP reporter** — pass `reporter` via `additional_fields` JSON in `createIssueViaMcp.ts`, not top-level MCP arg.
- **Title polish** — `polishIssueTitle.ts` fixes grammar and appends environment/browser/OS when present in text.
- **Extension API URL** — resolved from stored URL, then `localhost:3001` / `127.0.0.1:3001`; requires `npm run api:dev`.
- **Two Vite configs** — web: `vite.config.ts`; extension: `vite.extension.config.ts` → `dist-extension/`.

## Validation commands

```bash
npm test                    # web + extension unit tests (vitest)
npm run api:test            # server tests
npm run extension:release   # test + extension build + verify
npm run lint
```

Reload extension at `chrome://extensions/` after extension changes.

## Common task routing

| Task | Start here |
|------|------------|
| Ticket generation / AI prompt | `src/services/ticketGeneration/`, `src/ai/prompts/` |
| Title grammar / context in titles | `src/utils/polishIssueTitle.ts` |
| Web form / voice / context chips | `src/hooks/useBugReportForm.ts`, `src/utils/contextDetection/` |
| Extension popup / drafts | `src/extension/hooks/useExtensionStateManager.ts`, `extensionDraftService.ts` |
| Jira create fails (MCP) | `server/src/jira/createIssueViaMcp.ts`, `server/.env` |
| Extension can't reach API | `extensionConfig.ts`, `extensionHealthService.ts`, `api:dev` |
| Bootstrap / extension Jira sync | `server/src/routes/config.ts`, `extensionBootstrapService.ts` |
| About page / project docs | `about/`, `graphify/` |

## Additional resources

- Structure graph: [graphify/project-structure.md](../../graphify/project-structure.md)
- Sequences and state: [architecture.md](architecture.md)
- API tables and rules: [reference.md](reference.md)
- Dev workflows: [workflows.md](workflows.md)
- User docs: [docs/README.md](../../docs/README.md)
- About UI: [about/about.html](../../about/about.html)
- Release commits: [.cursor/skills/git-release-commit/SKILL.md](../git-release-commit/SKILL.md)
