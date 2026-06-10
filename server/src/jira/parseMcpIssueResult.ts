interface ParsedIssue {
  issueKey: string
}

function extractIssueKeyFromText(text: string): string | null {
  const match = text.match(/\b[A-Z][A-Z0-9]+-\d+\b/)
  return match?.[0] ?? null
}

function extractFromObject(value: unknown): string | null {
  if (!value || typeof value !== 'object') return null
  const record = value as Record<string, unknown>
  const candidates = [record.key, record.issueKey, record.issue_key, record.id]
  for (const candidate of candidates) {
    if (typeof candidate === 'string') {
      const key = extractIssueKeyFromText(candidate) ?? candidate
      if (/^[A-Z][A-Z0-9]+-\d+$/.test(key)) return key
    }
  }
  return null
}

/** Parse MCP tool output from common Jira MCP server response shapes. */
export function parseMcpIssueResult(result: unknown): ParsedIssue {
  if (typeof result === 'string') {
    const key = extractIssueKeyFromText(result)
    if (key) return { issueKey: key }
    try {
      return parseMcpIssueResult(JSON.parse(result))
    } catch {
      throw new Error('MCP response did not include a Jira issue key.')
    }
  }

  if (Array.isArray(result)) {
    for (const item of result) {
      if (item && typeof item === 'object' && 'text' in item) {
        const text = (item as { text?: string }).text
        if (text) {
          const key = extractIssueKeyFromText(text)
          if (key) return { issueKey: key }
          try {
            return parseMcpIssueResult(JSON.parse(text))
          } catch {
            /* continue */
          }
        }
      }
      const nested = extractFromObject(item)
      if (nested) return { issueKey: nested }
    }
  }

  const direct = extractFromObject(result)
  if (direct) return { issueKey: direct }

  if (result && typeof result === 'object') {
    const record = result as Record<string, unknown>
    if ('content' in record) {
      return parseMcpIssueResult(record.content)
    }
    if ('structuredContent' in record) {
      return parseMcpIssueResult(record.structuredContent)
    }
  }

  throw new Error('MCP response did not include a Jira issue key.')
}
