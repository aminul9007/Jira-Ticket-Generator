import { useCallback, useState } from 'react'
import { generateTicket } from '../services/ticketGeneration'
import type { BugReportFormValues, GeneratedTicket } from '../types/bugReport'
import type { ProjectKnowledgeSettings } from '../types/projectKnowledge'
import {
  INITIAL_TICKET_STATE,
  type TicketGenerationState,
} from '../types/ticketState'
import { isBugReportFormComplete } from '../utils/validateForm'

const GENERATION_DELAY_MS = 250

export interface TicketGenerationOutput {
  ticket: GeneratedTicket
  usedAi: boolean
}

export function useGeneratedTicket() {
  const [state, setState] = useState<TicketGenerationState>(INITIAL_TICKET_STATE)
  const [isGenerating, setIsGenerating] = useState(false)
  const [usedAi, setUsedAi] = useState(false)

  const generateFromForm = useCallback(
    async (
      formValues: BugReportFormValues,
      qaContext: ProjectKnowledgeSettings,
    ): Promise<TicketGenerationOutput | null> => {
      if (!isBugReportFormComplete(formValues)) {
        return null
      }

      setIsGenerating(true)

      const [result] = await Promise.all([
        generateTicket(formValues, qaContext),
        new Promise((resolve) => setTimeout(resolve, GENERATION_DELAY_MS)),
      ])

      setState({
        ticket: result.ticket,
        hasGenerated: true,
      })
      setUsedAi(result.usedAi)
      setIsGenerating(false)
      return result
    },
    [],
  )

  const restoreTicket = useCallback(
    (ticket: GeneratedTicket, wasAiGenerated = false) => {
      setState({ ticket, hasGenerated: true })
      setUsedAi(wasAiGenerated)
      setIsGenerating(false)
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
    restoreTicket,
    clearTicket,
  }
}
