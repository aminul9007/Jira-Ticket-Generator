# QA Bug Report Assistant

A modern web app to help QA engineers create Jira-ready bug tickets in under one minute.

**Phase 1** delivers the frontend foundation only: responsive dashboard, bug report form, and ticket preview with mock data. AI, backend APIs, authentication, and Jira integration are planned for later phases.

## Tech stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4

## Project structure

```
src/
├── components/
│   ├── layout/     # Header, Footer, DashboardLayout
│   ├── forms/      # Bug report form fields
│   ├── ticket/     # Ticket preview card
│   └── ui/         # Reusable UI primitives
├── pages/          # DashboardPage
├── types/          # TypeScript domain types
├── data/           # Constants and mock ticket
├── hooks/          # Form state hook
├── utils/          # Utilities (cn)
├── assets/
└── App.tsx
```

## Getting started

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Start development server |
| `npm run build`| Production build         |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint               |

## Phase 1 scope

- Single-page responsive dashboard
- Bug category, environment multi-select, title, and notes fields
- Generate Ticket button with loading state (scrolls to preview)
- Jira-style ticket preview with mock data

## Out of scope (Phase 1)

- AI ticket generation
- Backend / REST APIs
- Authentication
- Jira API integration
