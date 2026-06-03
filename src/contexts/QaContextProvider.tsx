import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { DEFAULT_QA_CONTEXT } from '../data/defaultQaContext'
import type { QaContextSettings } from '../types/qaContext'
import {
  loadQaContextSettings,
  normalizeQaContextSettings,
  saveQaContextSettings,
} from '../utils/qaContextStorage'
import { QaContext, type QaContextValue } from './QaContext'

export function QaContextProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<QaContextSettings>(loadQaContextSettings)

  const updateSettings = useCallback((patch: Partial<QaContextSettings>) => {
    setSettings((prev) => {
      const next = normalizeQaContextSettings({ ...prev, ...patch })
      saveQaContextSettings(next)
      return next
    })
  }, [])

  const resetSettings = useCallback(() => {
    const next = { ...DEFAULT_QA_CONTEXT }
    saveQaContextSettings(next)
    setSettings(next)
  }, [])

  const isConfigured = useMemo(
    () =>
      settings.productName.length > 0 ||
      settings.commonFeatures.length > 0 ||
      settings.commonEnvironments.length !== DEFAULT_QA_CONTEXT.commonEnvironments.length ||
      settings.commonBugCategories.length !== DEFAULT_QA_CONTEXT.commonBugCategories.length,
    [settings],
  )

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
