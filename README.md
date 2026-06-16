# QA Bug Report Assistant

A modern web app that helps QA engineers create Jira-ready bug tickets in under one minute — with voice dictation, AI-assisted generation, and one-click issue creation via Jira MCP.

## Tech stack

### Frontend

| Layer | Technology |
| ----- | ---------- |
| UI framework | **React 19** |
| Language | **TypeScript 6** |
| Build tool | **Vite 8** |
| Styling | **Tailwind CSS v4** (`@tailwindcss/vite` plugin) |
| Dev HTTPS (LAN) | `@vitejs/plugin-basic-ssl` |
| State & settings | React Context + `localStorage` |
| Voice input | **Web Speech API** (`SpeechRecognition` / `webkitSpeechRecognition`) |
| Testing | **Vitest** |

### Backend API (`server/`)

| Layer | Technology |
| ----- | ---------- |
| Runtime | **Node.js** (ES modules) |
| Framework | **Express 5** |
| Language | **TypeScript 6** |
| Dev runner | **tsx** (watch mode) |
| Validation | **Zod** |
| CORS | `cors` middleware |
| Config | `dotenv` (`.env`) |
| Testing | **Vitest** + **Supertest** |

### Jira integration

| Layer | Technology |
| ----- | ---------- |
| Protocol | **Model Context Protocol (MCP)** — stdio transport |
| MCP SDK | `@modelcontextprotocol/sdk` |
| MCP server | **mcp-atlassian** (Python, spawned as child process) |
| Target | **Jira Cloud REST API** |

### AI providers (frontend)

| Provider | Technology |
| -------- | ---------- |
| Local (recommended) | **llama.cpp** — OpenAI-compatible HTTP API (`llama-server`) |
| Cloud (optional) | **OpenAI** Chat Completions API |
| Default model | Qwen 2.5 3B Instruct (GGUF via llama.cpp) |

### Tooling & scripts

| Tool | Purpose |
| ---- | ------- |
| **ESLint 10** | Linting (TypeScript ESLint, React Hooks) |
| **PowerShell scripts** | Dev server lifecycle, LAN sharing, Windows Firewall |
| **Shared types** | `shared/` — API contracts used by frontend and backend |

## Architecture

```
Browser (React + Vite, port 5173)
    │
    ├─► AI provider (llama.cpp or OpenAI) — ticket generation
    ├─► Web Speech API — voice dictation
    ├─► localStorage — settings, history, theme
    │
    └─► POST /api/jira/*  (Vite dev proxy → port 3001)
            │
            ▼
        Node.js API (Express, port 3001)
            │
            └─► MCP stdio → mcp-atlassian → Jira Cloud
```

Credentials (Jira API token, MCP env) stay on the **server** — never in the browser.

## Project structure

```
├── src/                        # React frontend
│   ├── ai/                     # Prompts, providers (llama.cpp, OpenAI), JSON schema
│   ├── components/             # UI, forms, ticket preview, settings, history
│   ├── hooks/                  # Voice, form, Jira creation, theme
│   ├── pages/                  # Dashboard, Settings
│   ├── services/               # Ticket generation, Jira client, history, memory
│   ├── utils/                  # Context detection, voice transcript, Jira formatting
│   └── types/
├── server/                     # Node.js API
│   └── src/
│       ├── routes/jira.ts      # POST /issues, MCP test
│       ├── jira/               # Payload validation, MCP issue creation
│       └── mcp/                # MCP connection helpers
├── shared/                     # Shared TypeScript types (jiraApi, qaTicketStandards)
├── scripts/                    # Dev, LAN share, firewall, llama.cpp helpers
└── docs/                       # Jira MCP setup guide
```

## Getting started

### Prerequisites

- **Node.js** 20+
- **npm**
- (Optional) **Python** + `pip install mcp-atlassian` for Jira issue creation
- (Optional) **llama.cpp** for local AI — [download](https://llama-cpp.com/download/)

### Install & run (local)

```bash
npm install
npm run dev
```

Open **http://localhost:5173**

### Full stack (frontend + Jira API)

```bash
npm run api:install
cp server/.env.example server/.env   # configure Jira + MCP
npm run api:dev                       # terminal 1 — API on port 3001
npm run dev                           # terminal 2 — frontend on port 5173
```

Or restart both in one step:

```bash
npm run dev:restart
```

Full Jira MCP setup: [docs/JIRA_MCP_SETUP.md](docs/JIRA_MCP_SETUP.md)

### Local AI with llama.cpp (recommended)

1. Download [llama.cpp](https://llama-cpp.com/download/) and add `llama-server` to your PATH.
2. Place your model at `D:\Software\qwen2.5-3b-instruct-q4_k_m.gguf` (or set `LLAMACPP_MODEL_PATH`).
3. Start the model server (terminal 1):

```bash
npm run llama:server
```

4. Copy `.env.example` → `.env.local` and run the app (terminal 2):

```bash
npm run dev
```

`.env.local` for local Qwen:

```bash
VITE_AI_PROVIDER=llama-cpp
VITE_LLAMACPP_BASE_URL=http://127.0.0.1:8080/v1
VITE_LLAMACPP_MODEL=qwen2.5-3b-instruct
```

### Optional OpenAI (cloud)

```bash
VITE_AI_PROVIDER=openai
VITE_OPENAI_API_KEY=sk-...
VITE_OPENAI_MODEL=gpt-4o-mini
```

## Share on LAN (other devices + voice)

Other phones or PCs on the same Wi-Fi can use the app, including the microphone.

```bash
npm run dev:share
```

This stops old servers, opens Windows Firewall (Admin prompt once), and starts **HTTP on 5173** plus **HTTPS on 5175** for phone voice.

| URL | Use |
| --- | --- |
| `http://localhost:5173/` | **This PC** — use this (no certificate errors) |
| `http://<your-lan-ip>:5173/` | Other devices on Wi-Fi (HTTP) |
| `https://<your-lan-ip>:5175/` | Phones/tablets for **voice** (accept cert warning) |

**Do not open `https://localhost:5173`** — port 5173 is HTTP only. HTTPS on 5173 causes `502 / self-signed certificate` behind corporate proxies.

**If you see `502 Bad Gateway` / `Certificate verify failed: self-signed certificate`:** you used an HTTPS URL. Switch to **http://localhost:5173/**

```bash
npm run dev:corp    # HTTP-only (no phone voice over LAN)
```

**On phones/tablets (voice over Wi-Fi):**

1. Use **HTTPS on port 5175** (not 5173) — required for microphone access.
2. Accept the self-signed certificate warning (Advanced → Proceed).
3. Allow microphone when prompted.
4. If you see a **squid-proxy** error, add `192.168.*` to proxy bypass on that machine (Settings → Network → Proxy).

```bash
npm run lan:diagnose    # check firewall, ports, and LAN IP
npm run dev:stop        # stop all dev servers
```

## Voice dictation

Use the **microphone** on the Issue Description field to dictate your bug (Chrome / Edge). Tap again to stop; text and **Environment** chips update automatically.

- Say **production**, **beta**, **staging**, or **canary** — otherwise all three are selected.
- **Fuzzy context detection** corrects misheard words (e.g. "suffer" → Safari) for browser, OS, and device.
- Enable **auto-generate after voice** in Settings to create a ticket when you stop speaking.

> Voice on phones/tablets over Wi-Fi requires **HTTPS** (`npm run dev:share`).

## Settings

Open **Settings** from the dashboard:

| Section | Options |
| ------- | ------- |
| **AI** | Project context, output style, auto-generate after voice |
| **Voice** | Language, silence timeout, live transcript |
| **Jira** | Domain, email, API token, connection test |
| **Ticket Defaults** | Project key, issue type, labels, assignee |
| **Ticket Template** | Choose which fields appear in previews and created issues |
| **QA Standards** | Structured ticket standards engine |
| **Data** | History retention, export JSON, clear history |

All settings persist in `localStorage`. Theme (Light / Dark / System) is also persisted.

## Ticket generation features

- **3 Jira title suggestions** + recommended primary title
- **Confidence score** (0–100) from input completeness
- **Pre-generation hints** for missing environment, feature/page, or reproduction details
- **Context metadata** — browser, OS, device from voice or typed input (with fuzzy matching)
- **Senior QA output:** summary, steps, expected/actual, severity, priority, severity reasoning
- **Collapsible root causes** for developers
- **Jira wiki export** block in preview
- **Recent tickets** (last 20) with search and filters in `localStorage`
- **Editable ticket preview** before export or Jira creation

## Jira issue creation (MCP)

Create issues in Jira Cloud from the ticket preview. Set defaults in **Settings → Ticket Defaults**, generate a ticket, then click **Create Jira Ticket**.

```bash
npm run api:install
npm run mcp:install          # installs mcp-atlassian (Python)
cp server/.env.example server/.env
npm run api:dev
npm run dev
```

Set `JIRA_MCP_MOCK=true` in `server/.env` to return a fake `QA-123` issue without calling MCP.

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start frontend (HTTP, LAN-friendly) |
| `npm run dev:lan` | Start frontend (HTTPS only, for LAN voice) |
| `npm run dev:share` | Stop → firewall → restart API + HTTPS frontend for LAN sharing |
| `npm run dev:restart` | Stop and restart API + HTTP frontend |
| `npm run dev:stop` | Kill processes on ports 5173, 5174, 5175, 3001 |
| `npm run lan:firewall` | Open Windows Firewall for ports 5173 and 3001 (Admin) |
| `npm run lan:diagnose` | LAN connectivity and firewall checklist |
| `npm run api:dev` | Start Jira API backend (port 3001) |
| `npm run api:install` | Install API server dependencies |
| `npm run api:test` | Run API unit tests |
| `npm run mcp:install` | Install Python mcp-atlassian package |
| `npm run llama:server` | Start local llama.cpp with Qwen GGUF |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run frontend unit tests |

## Out of scope

- Authentication / multi-user accounts
- Hosting the Jira MCP server itself (use an external MCP process)
- Jira Server / Data Center (Jira Cloud only via mcp-atlassian)
