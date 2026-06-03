import { useCallback, useMemo } from 'react'
import { analyzeInputQuality } from '../services/ticketGeneration'
import { useBugReportForm } from './useBugReportForm'
import { useGeneratedTicket } from './useGeneratedTicket'

export function useBugReportAssistant() {
  const {
    values,
    isValid,
    setCategory,
    toggleEnvironment,
    setTitle,
    setAffectedFeaturePage,
    setAdditionalNotes,
    reset: resetForm,
  } = useBugReportForm()

  const {
    ticket,
    hasGenerated,
    isGenerating,
    usedAi,
    generateFromForm,
    clearTicket,
  } = useGeneratedTicket()

  const inputQuality = useMemo(
    () => analyzeInputQuality(values),
    [values],
  )

  const generateTicket = useCallback(async () => {
    return generateFromForm(values)
  }, [generateFromForm, values])

  const resetAll = useCallback(() => {
    resetForm()
    clearTicket()
  }, [resetForm, clearTicket])

  return {
    form: {
      values,
      isValid,
      setCategory,
      toggleEnvironment,
      setTitle,
      setAffectedFeaturePage,
      setAdditionalNotes,
      reset: resetForm,
    },
    inputQuality,
    ticket: {
      data: ticket,
      hasGenerated,
      isGenerating,
      usedAi,
      generate: generateTicket,
      clear: clearTicket,
    },
    resetAll,
  }
}
