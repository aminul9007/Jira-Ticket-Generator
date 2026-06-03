import { useCallback, useMemo } from 'react'
import { analyzeInputQuality } from '../services/ticketGeneration'
import { useBugReportForm } from './useBugReportForm'
import { useGeneratedTicket } from './useGeneratedTicket'
import { useTicketEditor } from './useTicketEditor'

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
    hasGenerated,
    isGenerating,
    usedAi,
    generateFromForm,
    clearTicket,
  } = useGeneratedTicket()

  const editor = useTicketEditor()
  const { loadTicket, clearTicket: clearEditor } = editor

  const inputQuality = useMemo(
    () => analyzeInputQuality(values),
    [values],
  )

  const generateTicket = useCallback(async () => {
    const generated = await generateFromForm(values)
    if (generated) {
      loadTicket(generated)
    }
    return generated !== null
  }, [generateFromForm, values, loadTicket])

  const resetAll = useCallback(() => {
    resetForm()
    clearTicket()
    clearEditor()
  }, [resetForm, clearTicket, clearEditor])

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
      hasGenerated,
      isGenerating,
      usedAi,
      generate: generateTicket,
      clear: clearTicket,
    },
    editor,
    resetAll,
  }
}
