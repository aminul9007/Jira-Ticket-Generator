import { useContext } from 'react'
import { QaContext, type QaContextValue } from '../contexts/QaContext'

export function useQaContext(): QaContextValue {
  const context = useContext(QaContext)
  if (!context) {
    throw new Error('useQaContext must be used within a QaContextProvider')
  }
  return context
}

export type { QaContextValue }
