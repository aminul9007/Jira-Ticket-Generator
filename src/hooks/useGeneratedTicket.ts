import { useCallback, useState } from 'react'
import { generateTicket } from '../services/ticketGeneration'
import type { BugReportFormValues } from '../types/bugReport'
import {
  INITIAL_TICKET_STATE,
  type TicketGenerationState,
} from '../types/ticketState'
import { isBugReportFormComplete } from '../utils/validateForm'

const GENERATION_DELAY_MS = 450

export function useGeneratedTicket() {
  const [state, setState] = useState<TicketGenerationState>(INITIAL_TICKET_STATE)
  const [isGenerating, setIsGenerating] = useState(false)
  const [usedAi, setUsedAi] = useState(false)

  const generateFromForm = useCallback(
    async (formValues: BugReportFormValues): Promise<boolean> => {
      if (!isBugReportFormComplete(formValues)) {
        return false
      }

      setIsGenerating(true)

      const [result] = await Promise.all([
        generateTicket(formValues),
        new Promise((resolve) => setTimeout(resolve, GENERATION_DELAY_MS)),
      ])

      setState({
        ticket: result.ticket,
        hasGenerated: true,
      })
      setUsedAi(result.usedAi)
      setIsGenerating(false)
      return true
    },
    [],
  )

  const clearTicket = useCallback(() => {
    setState(INITIAL_TICKET_STATE)
    setIsGenerating(false)
    setUsedAi(false)
  }, [])

  return {
    ticket: state.ticket,
    hasGenerated: state.hasGenerated,
    isGenerating,
    usedAi,
    generateFromForm,
    clearTicket,
  }
}
