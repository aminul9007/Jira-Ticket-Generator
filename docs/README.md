# Documentation

Central index for the **QA Bug Report Assistant** project.

---

## Start here

| I want to… | Read |
|------------|------|
| Understand the whole project | [../README.md](../README.md) |
| Run the web app locally | [../README.md#quick-start](../README.md#quick-start) |
| Connect Jira (web app) | [JIRA_MCP_SETUP.md](./JIRA_MCP_SETUP.md) |
| Install the Chrome extension | [extension/installation.md](./extension/installation.md) |
| Fix extension Jira errors | [extension/jira-setup.md](./extension/jira-setup.md) |
| Build a release extension | [extension/RELEASE.md](./extension/RELEASE.md) |

---

## Architecture

### Components

```
┌─────────────────┐     ┌─────────────────┐
│   Web App       │     │ Chrome Extension │
│   (React/Vite)  │     │ (MV3 popup)      │
└────────┬────────┘     └────────┬─────────┘
         │                       │
         │    POST /api/jira/*   │
         │    GET /api/config/bootstrap (extension only)
         ▼                       ▼
┌─────────────────────────────────────────┐
│         Node API (server/)              │
│         Express · port 3001             │
└────────────────────┬────────────────────┘
                     │ MCP stdio
                     ▼
┌─────────────────────────────────────────┐
│         mcp-atlassian                   │
└────────────────────┬────────────────────┘
                     │ REST
                     ▼
              Jira Cloud
```

### Key directories

| Path | Role |
|------|------|
| `src/` | Web application source |
| `src/extension/` | Chrome extension (shared services with web) |
| `server/` | API backend, MCP bridge |
| `shared/` | Cross-package TypeScript contracts |
| `scripts/` | Dev automation, extension verify |
| `dist-extension/` | Extension build output (generated) |

---

## Guides

### Platform

- [JIRA_MCP_SETUP.md](./JIRA_MCP_SETUP.md) — API server, MCP, Jira Cloud credentials, mock mode

### Chrome extension

- [EXTENSION.md](./EXTENSION.md) — Extension overview and release command
- [extension/README.md](./extension/README.md) — Extension hub
- [extension/installation.md](./extension/installation.md) — Load unpacked
- [extension/configuration.md](./extension/configuration.md) — Settings and storage
- [extension/jira-setup.md](./extension/jira-setup.md) — Jira via API + server/.env
- [extension/voice-usage.md](./extension/voice-usage.md) — Voice in the popup
- [extension/troubleshooting.md](./extension/troubleshooting.md) — Common errors
- [extension/RELEASE.md](./extension/RELEASE.md) — Release build and QA checklist

---

## API endpoints

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/health` | API liveness |
| `GET` | `/api/config/bootstrap` | Extension sync (domain, email, project — no token) |
| `POST` | `/api/jira/issues` | Create Jira issue via MCP |
| `POST` | `/api/jira/mcp/test` | Test MCP connection and tools |

Request/response shapes: `shared/jiraApi.ts`, `shared/extensionBootstrap.ts`

---

## Environment files

| File | Used by |
|------|---------|
| `server/.env` | API — Jira credentials, MCP, CORS |
| `.env.local` | Web app — AI provider, optional API URL |
| `server/.env.example` | Template for `server/.env` |
| `.env.example` | Template for web AI settings |

**Never commit** `.env` or `.env.local` with real tokens.
