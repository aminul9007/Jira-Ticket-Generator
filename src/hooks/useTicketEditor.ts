import { useCallback, useMemo, useState } from 'react'
import type { GeneratedTicket } from '../types/bugReport'
import type { EditableTicketField, TicketViewMode } from '../types/ticketEditor'
import { cloneTicket } from '../utils/cloneTicket'
import { getModifiedFields } from '../utils/ticketDiff'

export function useTicketEditor() {
  const [originalTicket, setOriginalTicket] = useState<GeneratedTicket | null>(
    null,
  )
  const [editedTicket, setEditedTicket] = useState<GeneratedTicket | null>(null)
  const [viewMode, setViewMode] = useState<TicketViewMode>('preview')

  const loadTicket = useCallback((ticket: GeneratedTicket) => {
    const snapshot = cloneTicket(ticket)
    setOriginalTicket(snapshot)
    setEditedTicket(cloneTicket(ticket))
    setViewMode('preview')
  }, [])

  const clearTicket = useCallback(() => {
    setOriginalTicket(null)
    setEditedTicket(null)
    setViewMode('preview')
  }, [])

  const modifiedFields = useMemo(
    () => getModifiedFields(originalTicket, editedTicket),
    [originalTicket, editedTicket],
  )

  const hasModifications = modifiedFields.size > 0

  const updateField = useCallback(
    <K extends keyof GeneratedTicket>(key: K, value: GeneratedTicket[K]) => {
      setEditedTicket((prev) => (prev ? { ...prev, [key]: value } : prev))
    },
    [],
  )

  const updateTitleSuggestion = useCallback(
    (index: number, value: string) => {
      setEditedTicket((prev) => {
        if (!prev) return prev
        const next = [...prev.titleSuggestions] as GeneratedTicket['titleSuggestions']
        next[index] = value
        return { ...prev, titleSuggestions: next }
      })
    },
    [],
  )

  const updateStep = useCallback((index: number, value: string) => {
    setEditedTicket((prev) => {
      if (!prev) return prev
      const next = [...prev.stepsToReproduce]
      next[index] = value
      return { ...prev, stepsToReproduce: next }
    })
  }, [])

  const updateRootCause = useCallback((index: number, value: string) => {
    setEditedTicket((prev) => {
      if (!prev) return prev
      const next = [...prev.possibleRootCauses]
      next[index] = value
      return { ...prev, possibleRootCauses: next }
    })
  }, [])

  const resetToGenerated = useCallback(() => {
    if (originalTicket) {
      setEditedTicket(cloneTicket(originalTicket))
    }
  }, [originalTicket])

  const isFieldModified = useCallback(
    (field: EditableTicketField) => modifiedFields.has(field),
    [modifiedFields],
  )

  return {
    viewMode,
    setViewMode,
    originalTicket,
    editedTicket,
    modifiedFields,
    hasModifications,
    isFieldModified,
    loadTicket,
    clearTicket,
    updateField,
    updateTitleSuggestion,
    updateStep,
    updateRootCause,
    resetToGenerated,
  }
}

export type TicketEditor = ReturnType<typeof useTicketEditor>
