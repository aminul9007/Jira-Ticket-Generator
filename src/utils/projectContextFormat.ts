import type { ProjectKnowledgeSettings } from '../types/projectKnowledge'

/** Build unified project context text from legacy structured knowledge fields. */
export function formatLegacyKnowledgeAsProjectContext(
  settings: ProjectKnowledgeSettings,
): string {
  const lines: string[] = []

  if (settings.projectName) lines.push(`Product: ${settings.projectName}`)
  if (settings.projectOverview) lines.push('', 'Overview:', settings.projectOverview)
  if (settings.productDescription) {
    lines.push('', 'Product description:', settings.productDescription)
  }
  if (settings.productGoals) lines.push('', 'Goals:', settings.productGoals)

  if (settings.commonEnvironments.length > 0) {
    lines.push('', 'Environments:')
    for (const env of settings.commonEnvironments) {
      lines.push(`- ${env}`)
    }
  }

  if (settings.commonFeatures.length > 0) {
    lines.push('', 'Common Components:')
    for (const feature of settings.commonFeatures) {
      lines.push(`- ${feature}`)
    }
  }

  if (settings.testingGuidelines) {
    lines.push('', 'Testing Guidelines:', settings.testingGuidelines)
  }
  if (settings.bugReportingStandards) {
    lines.push('', 'Bug Reporting Standards:', settings.bugReportingStandards)
  }
  if (settings.teamTerminology.length > 0) {
    lines.push('', 'Team Terminology:', settings.teamTerminology.join('; '))
  }

  return lines.join('\n').trim()
}

export function hasProjectContextContent(projectContext: string): boolean {
  return projectContext.trim().length > 0
}
