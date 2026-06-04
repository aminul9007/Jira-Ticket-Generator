import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { DEFAULT_PROJECT_KNOWLEDGE } from '../data/defaultQaContext'
import type { ProjectKnowledgeSettings } from '../types/projectKnowledge'
import {
  loadProjectKnowledge,
  normalizeProjectKnowledge,
  saveProjectKnowledge,
  isCustomProjectKnowledge,
} from '../utils/qaContextStorage'
import { QaContext, type QaContextValue } from './QaContext'

export function QaContextProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ProjectKnowledgeSettings>(loadProjectKnowledge)

  const updateSettings = useCallback((patch: Partial<ProjectKnowledgeSettings>) => {
    setSettings((prev) => {
      const next = normalizeProjectKnowledge({ ...prev, ...patch })
      saveProjectKnowledge(next)
      return next
    })
  }, [])

  const resetSettings = useCallback(() => {
    const next = { ...DEFAULT_PROJECT_KNOWLEDGE }
    saveProjectKnowledge(next)
    setSettings(next)
  }, [])

  const isConfigured = useMemo(() => isCustomProjectKnowledge(settings), [settings])

  const value = useMemo<QaContextValue>(
    () => ({
      settings,
      updateSettings,
      resetSettings,
      isConfigured,
    }),
    [settings, updateSettings, resetSettings, isConfigured],
  )

  return <QaContext.Provider value={value}>{children}</QaContext.Provider>
}
