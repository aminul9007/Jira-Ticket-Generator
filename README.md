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

## Ticket generation features

- **3 Jira title suggestions** + recommended primary title
- **Confidence score** (0–100) from input completeness
- **Pre-generation hints** for missing environment, feature/page, or reproduction details
- **Affected Feature/Page** optional form field
- **Senior QA output:** summary, steps, expected/actual, severity, priority, severity reasoning
- **Collapsible root causes** for developers
- **Jira wiki export** block in preview

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start development server |
| `npm run llama:server` | Start local llama.cpp with Qwen GGUF |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests |

## Out of scope

- Backend / REST APIs
- Authentication
- Jira API integration
