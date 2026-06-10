import { describe, expect, it } from 'vitest'
import { parseMcpIssueResult } from './parseMcpIssueResult.js'

describe('parseMcpIssueResult', () => {
  it('parses JSON object with key field', () => {
    expect(parseMcpIssueResult({ key: 'QA-42' })).toEqual({ issueKey: 'QA-42' })
  })

  it('parses text content array from MCP SDK', () => {
    expect(
      parseMcpIssueResult({
        content: [{ type: 'text', text: 'Created issue QA-99 successfully.' }],
      }),
    ).toEqual({ issueKey: 'QA-99' })
  })

  it('throws when no issue key is found', () => {
    expect(() => parseMcpIssueResult({ ok: true })).toThrow(/issue key/i)
  })
})
