import { createContext } from 'react'
import type { ProjectKnowledgeSettings } from '../types/projectKnowledge'

export interface QaContextValue {
  settings: ProjectKnowledgeSettings
  updateSettings: (patch: Partial<ProjectKnowledgeSettings>) => void
  resetSettings: () => void
  isConfigured: boolean
}

export const QaContext = createContext<QaContextValue | null>(null)
