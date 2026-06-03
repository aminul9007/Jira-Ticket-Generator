# QA Bug Report Assistant

A modern web app to help QA engineers create Jira-ready bug tickets in under one minute.

## Tech stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Senior QA Lead rules engine (default)
- Optional OpenAI (`VITE_OPENAI_API_KEY`)
- Light / Dark / System theme with localStorage persistence

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

Optional AI (copy `.env.example` → `.env.local`):

```bash
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
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |

## Out of scope

- Backend / REST APIs
- Authentication
- Jira API integration
