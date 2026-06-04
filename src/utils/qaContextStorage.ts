import { DEFAULT_PROJECT_KNOWLEDGE } from '../data/defaultQaContext'
import type { ProjectKnowledgeSettings } from '../types/projectKnowledge'
import { PROJECT_KNOWLEDGE_STORAGE_KEY } from '../types/projectKnowledge'

function normalizeList(items: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []

  for (const item of items) {
    const trimmed = item.trim()
    if (!trimmed) continue
    const key = trimmed.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    result.push(trimmed)
  }

  return result
}

function normalizeText(value: string | undefined): string {
  return value ?? ''
}

type LegacySettings = Partial<ProjectKnowledgeSettings> & {
  productName?: string
  commonBugCategories?: string[]
}

function migrateLegacySettings(raw: LegacySettings): Partial<ProjectKnowledgeSettings> {
  const migrated: Partial<ProjectKnowledgeSettings> = { ...raw }

  if (!migrated.projectName && raw.productName) {
    migrated.projectName = raw.productName
  }

  if (
    !migrated.bugReportingStandards &&
    raw.commonBugCategories &&
    raw.commonBugCategories.length > 0
  ) {
    migrated.bugReportingStandards = [
      'Common bug categories:',
      raw.commonBugCategories.join(', '),
    ].join(' ')
  }

  return migrated
}

export function normalizeProjectKnowledge(
  raw: LegacySettings | null | undefined,
): ProjectKnowledgeSettings {
  if (!raw) return { ...DEFAULT_PROJECT_KNOWLEDGE }

  const migrated = migrateLegacySettings(raw)

  return {
    projectName: normalizeText(migrated.projectName),
    projectOverview: normalizeText(migrated.projectOverview),
    productDescription: normalizeText(migrated.productDescription),
    productGoals: normalizeText(migrated.productGoals),
    testingGuidelines: normalizeText(migrated.testingGuidelines),
    commonEnvironments: normalizeList(
      migrated.commonEnvironments ?? DEFAULT_PROJECT_KNOWLEDGE.commonEnvironments,
    ),
    commonFeatures: normalizeList(migrated.commonFeatures ?? []),
    teamTerminology: normalizeList(migrated.teamTerminology ?? []),
    bugReportingStandards:
      normalizeText(migrated.bugReportingStandards) ||
      DEFAULT_PROJECT_KNOWLEDGE.bugReportingStandards,
  }
}

/** @deprecated Use normalizeProjectKnowledge */
export const normalizeQaContextSettings = normalizeProjectKnowledge

export function loadProjectKnowledge(): ProjectKnowledgeSettings {
  try {
    const raw = localStorage.getItem(PROJECT_KNOWLEDGE_STORAGE_KEY)
    if (!raw) return { ...DEFAULT_PROJECT_KNOWLEDGE }
    return normalizeProjectKnowledge(JSON.parse(raw) as LegacySettings)
  } catch {
    return { ...DEFAULT_PROJECT_KNOWLEDGE }
  }
}

/** @deprecated Use loadProjectKnowledge */
export const loadQaContextSettings = loadProjectKnowledge

export function saveProjectKnowledge(settings: ProjectKnowledgeSettings): void {
  try {
    localStorage.setItem(
      PROJECT_KNOWLEDGE_STORAGE_KEY,
      JSON.stringify(normalizeProjectKnowledge(settings)),
    )
  } catch {
    /* storage unavailable */
  }
}

/** @deprecated Use saveProjectKnowledge */
export const saveQaContextSettings = saveProjectKnowledge

export function isCustomProjectKnowledge(settings: ProjectKnowledgeSettings): boolean {
  const defaults = DEFAULT_PROJECT_KNOWLEDGE
  return (
    settings.projectName.length > 0 ||
    settings.projectOverview.length > 0 ||
    settings.productDescription.length > 0 ||
    settings.productGoals.length > 0 ||
    settings.testingGuidelines.length > 0 ||
    settings.commonFeatures.length > 0 ||
    settings.teamTerminology.length > 0 ||
    settings.commonEnvironments.join('|') !== defaults.commonEnvironments.join('|') ||
    settings.bugReportingStandards !== defaults.bugReportingStandards
  )
}

/** @deprecated Use isCustomProjectKnowledge */
export const hasProjectKnowledge = isCustomProjectKnowledge

/** @deprecated Use isCustomProjectKnowledge */
export const hasQaContext = isCustomProjectKnowledge
