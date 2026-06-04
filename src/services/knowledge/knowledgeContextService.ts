import type { KnowledgeContext } from '../../ai/types/generationContext'
import type { ProjectKnowledgeSettings } from '../../types/projectKnowledge'
import {
  hasProjectKnowledge,
  loadProjectKnowledge,
} from '../../utils/qaContextStorage'

export function buildKnowledgeContext(
  settings: ProjectKnowledgeSettings,
): KnowledgeContext {
  return {
    project: {
      name: settings.projectName,
      overview: settings.projectOverview,
      description: settings.productDescription,
      goals: settings.productGoals,
    },
    testing: {
      guidelines: settings.testingGuidelines,
      bugReportingStandards: settings.bugReportingStandards,
    },
    taxonomy: {
      environments: settings.commonEnvironments,
      features: settings.commonFeatures,
      terminology: settings.teamTerminology,
    },
  }
}

export function loadKnowledgeContext(): KnowledgeContext {
  return buildKnowledgeContext(loadProjectKnowledge())
}

export function isKnowledgeConfigured(settings: ProjectKnowledgeSettings): boolean {
  return hasProjectKnowledge(settings)
}

export function formatKnowledgeForPrompt(context: KnowledgeContext): string {
  if (!hasKnowledgeContent(context)) {
    return ''
  }

  const lines = [
    '## Project Knowledge Base',
    'Use this organizational context for naming, terminology, and writing style.',
    'Do NOT override bug report facts. Do NOT invent details unsupported by the report.',
    '',
  ]

  const { project, testing, taxonomy } = context

  if (project.name) lines.push(`Project name: ${project.name}`)
  if (project.overview) lines.push(`Project overview: ${project.overview}`)
  if (project.description) lines.push(`Product description: ${project.description}`)
  if (project.goals) lines.push(`Product goals: ${project.goals}`)

  if (testing.guidelines) {
    lines.push('', 'Testing guidelines:', testing.guidelines)
  }
  if (testing.bugReportingStandards) {
    lines.push('', 'Bug reporting standards:', testing.bugReportingStandards)
  }

  if (taxonomy.environments.length > 0) {
    lines.push(`Common environments: ${taxonomy.environments.join(', ')}`)
  }
  if (taxonomy.features.length > 0) {
    lines.push(`Common features/pages: ${taxonomy.features.join(', ')}`)
  }
  if (taxonomy.terminology.length > 0) {
    lines.push(`Team terminology: ${taxonomy.terminology.join('; ')}`)
  }

  lines.push(
    '',
    'When the report aligns with this knowledge base, prefer these names and patterns.',
    'If the report conflicts with context, trust the report and note mismatches briefly in severityReasoning.',
  )

  return lines.join('\n')
}

function hasKnowledgeContent(context: KnowledgeContext): boolean {
  const { project, testing, taxonomy } = context
  return (
    project.name.length > 0 ||
    project.overview.length > 0 ||
    project.description.length > 0 ||
    project.goals.length > 0 ||
    testing.guidelines.length > 0 ||
    testing.bugReportingStandards.length > 0 ||
    taxonomy.environments.length > 0 ||
    taxonomy.features.length > 0 ||
    taxonomy.terminology.length > 0
  )
}
