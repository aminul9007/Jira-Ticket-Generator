import { z } from 'zod'
import type { CreateJiraIssuePayload } from '../../../shared/jiraApi.js'
import { ApiError } from '../errors.js'

const createIssueSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  summary: z.string().trim().min(1, 'Summary is required'),
  steps: z.array(z.string()).default([]),
  expected: z.string().default(''),
  actual: z.string().default(''),
  severity: z.string().default(''),
  priority: z.string().default(''),
  environment: z.string().default(''),
  browser: z.string().default(''),
  os: z.string().default(''),
  device: z.string().default(''),
  projectKey: z.string().trim().optional(),
  issueType: z.string().trim().optional(),
  labels: z.array(z.string()).optional(),
  assignee: z.string().trim().optional(),
  connection: z
    .object({
      domain: z.string().trim().min(1),
      email: z.string().trim().min(1),
      apiToken: z.string().trim().min(1),
    })
    .optional(),
})

export function parseCreateIssuePayload(body: unknown): CreateJiraIssuePayload {
  const parsed = createIssueSchema.safeParse(body)
  if (!parsed.success) {
    const message = parsed.error.issues.map((issue) => issue.message).join(' ')
    throw new ApiError(400, 'VALIDATION_ERROR', message)
  }
  return parsed.data
}
