import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { GeneratedTicket } from '../../types/bugReport'
import {
  clearExtensionDraft,
  loadExtensionDraft,
  saveExtensionDraft,
} from './extensionDraftService'

const sampleTicket: GeneratedTicket = {
  title: 'Login broken',
  titleSuggestions: ['A', 'B', 'C'],
  issueSummary: 'Users cannot log in.',
  stepsToReproduce: ['Open login'],
  expectedResult: 'Dashboard',
  actualResult: 'Error',
  severity: 'High',
  priority: 'P1',
  severityReasoning: 'Blocks users',
  possibleRootCauses: ['API'],
  confidenceScore: 80,
  category: 'Functional Bug',
  environments: ['Production'],
}

describe('extensionDraftService', () => {
  beforeEach(() => {
    let stored: Record<string, unknown> = {}

    vi.stubGlobal('chrome', {
      storage: {
        local: {
          get: vi.fn((_keys, callback: (items: Record<string, unknown>) => void) => {
            callback(stored)
          }),
          set: vi.fn((items, callback?: () => void) => {
            stored = { ...stored, ...items }
            callback?.()
          }),
          remove: vi.fn((keys, callback?: () => void) => {
            if (typeof keys === 'string') {
              delete stored[keys]
            }
            callback?.()
          }),
        },
      },
      runtime: {
        lastError: undefined,
      },
    })
  })

  it('persists and restores draft state', async () => {
    await saveExtensionDraft({
      description: 'Button does nothing on dashboard',
      view: 'review',
      workflowView: 'review',
      ticket: sampleTicket,
      qaContext: {
        environment: { value: 'production', source: 'auto-detected' },
        browser: { value: 'Chrome', source: 'auto-detected' },
        os: { value: 'Windows', source: 'auto-detected' },
        device: { value: 'Desktop', source: 'auto-detected' },
      },
      usedAi: true,
      jiraDefaults: {
        projectKey: 'QA',
        issueType: 'Bug',
        assignee: 'dev@company.com',
        reporter: '',
      },
      voiceTranscript: 'Button does nothing on dashboard',
      includePageTitle: false,
      updatedAt: Date.now(),
    })

    const draft = await loadExtensionDraft()
    expect(draft.description).toBe('Button does nothing on dashboard')
    expect(draft.view).toBe('review')
    expect(draft.ticket?.title).toBe('Login broken')
    expect(draft.jiraDefaults?.projectKey).toBe('QA')
    expect(draft.includePageTitle).toBe(false)
  })

  it('clears draft after successful workflow reset', async () => {
    await saveExtensionDraft({
      description: 'Saved draft',
      view: 'input',
      workflowView: 'input',
      ticket: null,
      qaContext: null,
      usedAi: false,
      jiraDefaults: null,
      voiceTranscript: '',
      includePageTitle: true,
      updatedAt: Date.now(),
    })

    await clearExtensionDraft()
    const draft = await loadExtensionDraft()
    expect(draft.description).toBe('')
    expect(draft.ticket).toBeNull()
  })
})
