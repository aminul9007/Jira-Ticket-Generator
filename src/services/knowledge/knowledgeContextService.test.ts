import { describe, expect, it } from 'vitest'
import { buildKnowledgeContext, formatKnowledgeForPrompt } from './knowledgeContextService'
import { DEFAULT_PROJECT_KNOWLEDGE } from '../../data/defaultQaContext'

describe('knowledgeContextService', () => {
  it('builds structured knowledge context from settings', () => {
    const context = buildKnowledgeContext({
      ...DEFAULT_PROJECT_KNOWLEDGE,
      projectName: 'Acme App',
      testingGuidelines: 'Test on staging first',
    })

    expect(context.project.name).toBe('Acme App')
    expect(context.testing.guidelines).toBe('Test on staging first')
  })

  it('formats knowledge for prompts when content exists', () => {
    const section = formatKnowledgeForPrompt(
      buildKnowledgeContext({
        ...DEFAULT_PROJECT_KNOWLEDGE,
        projectName: 'Acme App',
      }),
    )

    expect(section).toContain('Project Knowledge Base')
    expect(section).toContain('Acme App')
  })
})
