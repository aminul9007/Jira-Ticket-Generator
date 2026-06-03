import { useCallback, useMemo } from 'react'
import { analyzeInputQuality } from '../services/ticketGeneration'
import { useBugReportForm } from './useBugReportForm'
import { useGeneratedTicket } from './useGeneratedTicket'
import { useRecentTickets } from './useRecentTickets'
import { useTicketEditor } from './useTicketEditor'
import type { RecentTicketRecord } from '../types/recentTicket'

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
    restoreTicket,
    clearTicket,
  } = useGeneratedTicket()

  const editor = useTicketEditor()
  const { loadTicket, clearTicket: clearEditor } = editor
  const recent = useRecentTickets()
  const { saveTicket, markActive } = recent

  const inputQuality = useMemo(
    () => analyzeInputQuality(values),
    [values],
  )

  const generateTicket = useCallback(async () => {
    const result = await generateFromForm(values)
    if (result) {
      loadTicket(result.ticket)
      saveTicket(result.ticket, result.usedAi)
    }
    return result !== null
  }, [generateFromForm, values, loadTicket, saveTicket])

  const reopenRecentTicket = useCallback(
    (record: RecentTicketRecord) => {
      restoreTicket(record.ticket, record.usedAi)
      loadTicket(record.ticket)
      markActive(record.id)
    },
    [restoreTicket, loadTicket, markActive],
  )

  const resetAll = useCallback(() => {
    resetForm()
    clearTicket()
    clearEditor()
    markActive(null)
  }, [resetForm, clearTicket, clearEditor, markActive])

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
    recentTickets: recent,
    reopenRecentTicket,
    resetAll,
  }
}
