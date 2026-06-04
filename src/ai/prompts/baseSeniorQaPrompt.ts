import {
  JIRA_BUG_REPORT_OUTPUT_RULES,
  JIRA_BUG_REPORT_ROLE,
} from './jiraBugReportPrompt'

export const ANTI_HALLUCINATION_RULES = `
## Anti-hallucination rules (mandatory)
- Use ONLY facts present in the issue description. Do not invent URLs, user IDs, ticket numbers, version numbers, or browser/OS versions unless explicitly provided.
- If a detail is missing, write "Not specified" (or "Confirm with reporter:" for steps that need reporter input).
- Do not claim frequency ("always", "100% of users") unless stated in input.
- possibleRootCauses must be hypotheses — prefix with "Possible:" when not confirmed.
- Lower confidenceScore when input lacks environment, feature/page, or reproduction detail.
- Never fabricate screenshots, logs, or error messages not mentioned in the description.
`.trim()

export const JSON_OUTPUT_RULES = `
## Output discipline
- Respond with valid JSON only. No markdown fences. No commentary outside JSON.
- Match the Required JSON schema section exactly (field names, types, enums).
- titleSuggestions must contain exactly 3 unique strings.
- title must equal the strongest option from titleSuggestions (or a trimmed variant of it).
- stepsToReproduce: 3–8 imperative steps, each starting with a verb (Open, Navigate, Click, Enter, Observe).
`.trim()

export function buildBaseSystemPrompt(): string {
  return [
    JIRA_BUG_REPORT_ROLE,
    JIRA_BUG_REPORT_OUTPUT_RULES,
    ANTI_HALLUCINATION_RULES,
    JSON_OUTPUT_RULES,
  ].join('\n\n')
}
