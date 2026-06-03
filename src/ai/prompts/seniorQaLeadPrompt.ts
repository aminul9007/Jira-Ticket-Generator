import type { ValidatedBugReportFormValues } from '../../types/bugReport'

export const SENIOR_QA_SYSTEM_PROMPT = `You are a Senior QA Lead with 10+ years of experience writing Jira tickets for engineering teams.

Your job is to transform minimal bug reports into accurate, actionable, Jira-ready tickets.

Rules:
- Be precise and professional. No fluff.
- Infer reasonable QA details only when strongly supported by input; otherwise state assumptions briefly.
- Use clear, testable language in steps to reproduce.
- Severity and priority must align with business impact and environment (Production = higher urgency).
- Provide exactly 3 distinct Jira title suggestions (concise, scannable, include area/component when known).
- confidenceScore (0-100) reflects input completeness: environment, feature/page, reproduction detail, and clarity.
- possibleRootCauses are hypotheses for developers (3-5 items), not confirmed facts.
- Output valid JSON only, matching the required schema.`

export function buildSeniorQaUserPrompt(
  values: ValidatedBugReportFormValues,
): string {
  const envs =
    values.environments.length > 0
      ? values.environments.join(', ')
      : '(not specified)'

  return `Generate a Jira-ready bug ticket from this report.

Bug Category: ${values.category}
Environments: ${envs}
Affected Feature/Page: ${values.affectedFeaturePage.trim() || '(not specified)'}
Short Description: ${values.title.trim()}
Additional Notes: ${values.additionalNotes.trim() || '(none)'}

Return JSON with:
- titleSuggestions: string[3] (professional Jira titles)
- title: string (recommended primary title)
- issueSummary: string
- stepsToReproduce: string[]
- expectedResult: string
- actualResult: string
- severity: "Critical" | "High" | "Medium" | "Low"
- priority: "P1" | "P2" | "P3" | "P4"
- severityReasoning: string
- possibleRootCauses: string[]
- confidenceScore: number (0-100)`
}
