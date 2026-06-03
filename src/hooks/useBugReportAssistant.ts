import { useCallback } from 'react'
import { useBugReportForm } from './useBugReportForm'
import { useGeneratedTicket } from './useGeneratedTicket'

export function useBugReportAssistant() {
  const {
    values,
    isValid,
    setCategory,
    toggleEnvironment,
    setTitle,
    setAdditionalNotes,
    reset: resetForm,
  } = useBugReportForm()

  const {
    ticket,
    hasGenerated,
    isGenerating,
    generateFromForm,
    clearTicket,
  } = useGeneratedTicket()

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
      setAdditionalNotes,
      reset: resetForm,
    },
    ticket: {
      data: ticket,
      hasGenerated,
      isGenerating,
      generate: generateTicket,
      clear: clearTicket,
    },
    resetAll,
  }
}
