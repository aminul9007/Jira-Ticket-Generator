import { useCallback, useMemo, useState } from 'react'
import {
  finalizeTicketHistory,
  saveGeneratedTicketHistory,
} from '../services/history/ticketHistoryService'
import {
  getFeedbackForHistory,
  saveTicketFeedback,
} from '../services/feedback/ticketFeedbackService'
import { analyzeInputQuality } from '../services/ticketGeneration'
import type { RecentTicketRecord } from '../types/recentTicket'
import type { TicketFeedbackRating } from '../types/ticketFeedback'
import { useBugReportForm } from './useBugReportForm'
import { useGeneratedTicket } from './useGeneratedTicket'
import { useQaContext } from './useQaContext'
import { useRecentTickets } from './useRecentTickets'
import { useTicketEditor } from './useTicketEditor'

export function useBugReportAssistant() {
  const {
    values,
    isValid,
    setIssueDescription,
    setEnvironments,
    toggleEnvironment,
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
  const { loadTicket, clearTicket: clearEditor, editedTicket } = editor
  const recent = useRecentTickets()
  const { saveTicket, markActive, refreshFromHistory } = recent
  const { settings: knowledgeSettings } = useQaContext()

  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null)
  const [feedbackRating, setFeedbackRating] = useState<TicketFeedbackRating | null>(null)

  const inputQuality = useMemo(
    () => analyzeInputQuality(values),
    [values],
  )

  const submitFeedback = useCallback(
    (rating: TicketFeedbackRating) => {
      if (!activeHistoryId || !editedTicket) return

      finalizeTicketHistory(activeHistoryId, editedTicket)
      saveTicketFeedback(activeHistoryId, rating)
      setFeedbackRating(rating)
      refreshFromHistory()
    },
    [activeHistoryId, editedTicket, refreshFromHistory],
  )

  const generateTicket = useCallback(async () => {
    if (activeHistoryId && editedTicket) {
      finalizeTicketHistory(activeHistoryId, editedTicket)
    }

    const result = await generateFromForm(values, knowledgeSettings)
    if (result) {
      const historyRecord = saveGeneratedTicketHistory(
        values,
        result.ticket,
        result.usedAi,
      )
      loadTicket(result.ticket)
      saveTicket()
      setActiveHistoryId(historyRecord.id)
      setFeedbackRating(null)
      markActive(historyRecord.id)
    }
    return result !== null
  }, [
    activeHistoryId,
    editedTicket,
    generateFromForm,
    values,
    knowledgeSettings,
    loadTicket,
    saveTicket,
    markActive,
  ])

  const reopenRecentTicket = useCallback(
    (record: RecentTicketRecord) => {
      restoreTicket(record.ticket, record.usedAi)
      loadTicket(record.ticket)
      markActive(record.id)
      setActiveHistoryId(record.id)
      setFeedbackRating(getFeedbackForHistory(record.id)?.rating ?? null)
    },
    [restoreTicket, loadTicket, markActive],
  )

  const resetAll = useCallback(() => {
    if (activeHistoryId && editedTicket) {
      finalizeTicketHistory(activeHistoryId, editedTicket)
    }
    resetForm()
    clearTicket()
    clearEditor()
    markActive(null)
    setActiveHistoryId(null)
    setFeedbackRating(null)
  }, [
    activeHistoryId,
    editedTicket,
    resetForm,
    clearTicket,
    clearEditor,
    markActive,
  ])

  return {
    form: {
      values,
      isValid,
      setIssueDescription,
      setEnvironments,
      toggleEnvironment,
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
    feedback: {
      rating: feedbackRating,
      submit: submitFeedback,
      canSubmit: Boolean(activeHistoryId && hasGenerated),
    },
    reopenRecentTicket,
    resetAll,
  }
}
