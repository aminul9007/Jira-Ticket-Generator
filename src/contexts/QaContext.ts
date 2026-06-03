import { createContext } from 'react'
import type { QaContextSettings } from '../types/qaContext'

export interface QaContextValue {
  settings: QaContextSettings
  updateSettings: (patch: Partial<QaContextSettings>) => void
  resetSettings: () => void
  isConfigured: boolean
}

export const QaContext = createContext<QaContextValue | null>(null)
