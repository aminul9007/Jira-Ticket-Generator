import { BUG_CATEGORIES, ENVIRONMENTS } from './constants'
import type { ProjectKnowledgeSettings } from '../types/projectKnowledge'

export const DEFAULT_PROJECT_KNOWLEDGE: ProjectKnowledgeSettings = {
  projectName: '',
  projectOverview: '',
  productDescription: '',
  productGoals: '',
  testingGuidelines: '',
  commonEnvironments: [...ENVIRONMENTS],
  commonFeatures: [],
  teamTerminology: [],
  bugReportingStandards: [
    'Use clear, actionable titles with category prefix.',
    'Include numbered steps to reproduce.',
    'State expected vs actual results separately.',
    `Common categories: ${BUG_CATEGORIES.join(', ')}.`,
  ].join('\n'),
}

/** @deprecated Use DEFAULT_PROJECT_KNOWLEDGE */
export const DEFAULT_QA_CONTEXT = DEFAULT_PROJECT_KNOWLEDGE
