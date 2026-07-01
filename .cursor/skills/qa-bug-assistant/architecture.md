# QA Bug Assistant — Architecture Graphs

## System overview

```mermaid
flowchart TB
  subgraph WebClient["Web app (React :5173)"]
    APP[App.tsx]
    DASH[DashboardPage]
    SET[SettingsPage]
    ASST[useBugReportAssistant]
    GEN_HOOK[useGeneratedTicket]
    JIRA_HOOK[useJiraIssueCreation]
  end

  subgraph ExtClient["Chrome extension (MV3 popup)"]
    POP[Popup.tsx]
    SM[useExtensionStateManager]
    IN[InputScreen]
    RV[ReviewScreen]
    BC[browserContextService]
  end

  subgraph SharedGen["Shared generation"]
    GT[generateTicket]
    BFI[buildFormValuesFromInput]
    BJP[buildJiraCreatePayload]
    POL[polishIssueTitle]
  end

  subgraph AI["src/ai/"]
    OAI[OpenAI provider]
    LLM[llama.cpp provider]
    PROMPT[jiraBugReportPrompt]
  end

  subgraph API["Node API (:3001)"]
    RJ[POST /api/jira/issues]
    RT[POST /api/jira/mcp/test]
    BCfg[GET /api/config/bootstrap]
    MCP[McpClient stdio]
  end

  subgraph JiraCloud["Jira Cloud"]
    ISSUE[Created issue]
  end

  APP --> DASH
  APP --> SET
  DASH --> ASST
  ASST --> GEN_HOOK
  ASST --> JIRA_HOOK
  GEN_HOOK --> GT
  JIRA_HOOK --> BJP

  POP --> SM
  SM --> IN
  SM --> RV
  SM --> BC
  SM --> GT
  SM --> BJP

  GT --> AI
  GT --> POL
  SM --> BFI
  BFI --> GT

  JIRA_HOOK --> RJ
  SM -->|extensionJiraApi| RJ
  SM --> BCfg
  RJ --> MCP
  RT --> MCP
  MCP --> ISSUE
```

## Web app ticket generation sequence

```mermaid
sequenceDiagram
  participant U as User
  participant F as BugReportForm
  participant A as useBugReportAssistant
  participant G as generateTicket
  participant AI as AI provider
  participant E as TicketEditor

  U->>F: Type / voice description
  F->>A: Validated form values
  A->>G: generateFromForm
  alt AI configured
    G->>AI: Chat completion + JSON schema
    AI-->>G: AiTicketResponse
    G->>G: validateAiResponse + polishIssueTitle
  else Rules engine
    G->>G: seniorQaTicketGenerator
  end
  G-->>A: GeneratedTicket
  A->>E: loadTicket
  A->>A: save ticket history
```

## Extension popup sequence

```mermaid
sequenceDiagram
  participant U as User
  participant P as Popup
  participant S as useExtensionStateManager
  participant B as bootstrap API
  participant G as generateTicket
  participant J as extensionJiraApi
  participant API as server/jira.ts

  U->>P: Open popup
  P->>S: hydrate draft + health checks
  S->>B: GET /api/config/bootstrap
  B-->>S: domain, email, project

  U->>P: Enter description + Generate
  S->>G: resilientGenerateExtensionTicket
  G-->>S: ticket + qaContext
  S->>P: ReviewScreen

  U->>P: Create in Jira
  S->>J: POST /api/jira/issues
  J->>API: createIssueViaMcp
  API-->>J: issueKey, issueUrl
  S->>P: SuccessScreen
```

## Jira create via MCP

```mermaid
sequenceDiagram
  participant C as Web or Extension
  participant R as routes/jira.ts
  participant V as validatePayload
  participant M as createIssueViaMcp
  participant MC as McpClient
  participant AT as mcp-atlassian

  C->>R: POST /api/jira/issues
  R->>V: Zod parse CreateJiraIssuePayload
  R->>M: buildMcpCreateIssueArgs
  M->>MC: callMcpTool jira_create_issue
  MC->>AT: stdio MCP
  AT-->>MC: issue key
  MC-->>R: parseMcpIssueResult
  R-->>C: 201 { issueKey, issueUrl }
```

## Extension state views

```mermaid
stateDiagram-v2
  [*] --> loading: popup open
  loading --> input: HYDRATE
  input --> review: GENERATION_SUCCESS
  review --> input: goBackToInput
  review --> success: JIRA_SUCCESS
  input --> settings: OPEN_SETTINGS
  review --> settings: OPEN_SETTINGS
  settings --> input: CLOSE_SETTINGS
  success --> input: RESET_WORKFLOW / New ticket
  input --> input: startNewTicket clears draft
```

## File → responsibility matrix

| Path | Responsibility |
|------|----------------|
| `src/pages/DashboardPage.tsx` | Web main workflow UI |
| `src/hooks/useBugReportAssistant.ts` | Web orchestration |
| `src/services/ticketGeneration/index.ts` | `generateTicket()` entry |
| `src/utils/polishIssueTitle.ts` | Formal title grammar + context |
| `src/utils/buildJiraCreatePayload.ts` | Client → API payload |
| `src/extension/popup/Popup.tsx` | Extension view router |
| `src/extension/hooks/useExtensionStateManager.ts` | Extension orchestration |
| `src/extension/state/extensionStateReducer.ts` | Popup state machine |
| `server/src/routes/jira.ts` | Jira HTTP endpoints |
| `server/src/jira/createIssueViaMcp.ts` | MCP tool argument mapping |
| `server/src/mcp/McpClient.ts` | Stdio MCP transport |
| `shared/jiraApi.ts` | Shared request/response types |
| `shared/generation/` | TicketContext, compose description |
| `about/about.html` | About + structure overview |
| `graphify/project-structure.mmd` | Module dependency graph |
