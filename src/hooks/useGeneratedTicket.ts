import { useCallback, useState } from 'react'
import type { BugReportFormValues } from '../types/bugReport'
import {
  INITIAL_TICKET_STATE,
  type TicketGenerationState,
} from '../types/ticketState'
import { generateTicketFromForm } from '../utils/generateTicket'
import { isBugReportFormComplete } from '../utils/validateForm'

const GENERATION_DELAY_MS = 400

export function useGeneratedTicket() {
  const [state, setState] = useState<TicketGenerationState>(INITIAL_TICKET_STATE)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateFromForm = useCallback(
    async (formValues: BugReportFormValues): Promise<boolean> => {
      if (!isBugReportFormComplete(formValues)) {
        return false
      }

      setIsGenerating(true)

      await new Promise((resolve) => setTimeout(resolve, GENERATION_DELAY_MS))

      const ticket = generateTicketFromForm(formValues)

      setState({
        ticket,
        hasGenerated: true,
      })
      setIsGenerating(false)
      return true
    },
    [],
  )

  const clearTicket = useCallback(() => {
    setState(INITIAL_TICKET_STATE)
    setIsGenerating(false)
  }, [])

  return {
    ticket: state.ticket,
    hasGenerated: state.hasGenerated,
    isGenerating,
    generateFromForm,
    clearTicket,
  }
}
