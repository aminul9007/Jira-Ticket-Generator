# QA Bug Report Assistant

A modern web app to help QA engineers create Jira-ready bug tickets in under one minute.

## Tech stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Senior QA Lead rules engine (default)
- Optional **local llama.cpp** (Qwen GGUF) or **OpenAI** (`VITE_OPENAI_API_KEY`)
- Light / Dark / System theme with localStorage persistence
- Recent tickets (last 20) saved in localStorage with search and filters

## Project structure

```
src/
├── ai/                    # Prompt builder, category guides, OpenAI provider, JSON schema
├── components/
│   ├── layout/
│   ├── forms/
│   ├── ticket/
│   └── ui/
├── pages/
├── services/ticketGeneration/  # Input quality, confidence, ticket builder
├── types/
├── hooks/
├── utils/
└── App.tsx
```

## Getting started

```bash
npm install
npm run dev
```

### Local AI with llama.cpp (recommended)

1. Download [llama.cpp](https://llama-cpp.com/download/) and add `llama-server` to your PATH.
2. Place your model at `D:\Software\qwen2.5-3b-instruct-q4_k_m.gguf` (or set `LLAMACPP_MODEL_PATH`).
3. Start the server (terminal 1):

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

## Voice dictation (optional)

Use the **microphone** on the Issue Description field to dictate your bug (Chrome / Edge). Tap again to stop; text and **Environment** chips update automatically (say production, beta, staging, or canary — otherwise all three are selected). Click **Generate Jira Ticket** when ready, or enable **auto-generate after voice** in Settings.

## Settings

Open **Settings** from the dashboard to configure:

- **AI** — project context textarea (injected into prompts), output style, auto-generate after voice
- **Voice** — language, silence timeout, live transcript
- **Jira** — domain, email, API token, connection test
- **Defaults** — project key, issue type, labels, assignee (sent to API when creating issues)
- **Data** — history retention, export JSON, clear history

All settings persist in `localStorage`.

## Ticket generation features

- **3 Jira title suggestions** + recommended primary title
- **Confidence score** (0–100) from input completeness
- **Pre-generation hints** for missing environment, feature/page, or reproduction details
- **Affected Feature/Page** optional form field
- **Senior QA output:** summary, steps, expected/actual, severity, priority, severity reasoning
- **Collapsible root causes** for developers
- **Jira wiki export** block in preview

## Jira issue creation (MCP)

Create issues in Jira Cloud from the ticket preview via a **Node.js API** and an external **Jira MCP Server**. Credentials stay on the server — never in the browser.

```bash
npm run api:install
cp server/.env.example server/.env   # configure Jira + MCP
npm run api:dev                       # terminal 1
npm run dev                           # terminal 2
```

Set ticket defaults in **Settings → Ticket Defaults**, generate a ticket, then click **Create Jira Ticket**.

Full setup: [docs/JIRA_MCP_SETUP.md](docs/JIRA_MCP_SETUP.md)

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start development server |
| `npm run api:dev` | Start Jira API backend (port 3001) |
| `npm run api:install` | Install API server dependencies |
| `npm run llama:server` | Start local llama.cpp with Qwen GGUF |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests |

## Out of scope

- Authentication / multi-user accounts
- Hosting the Jira MCP server itself (use an external MCP process)
